import { beforeEach, describe, expect, it, vi } from 'vitest'

import * as operationsApi from '@/modules/operations/api'

/**
 * Operaciones: la capa API es el ǧnico punto que toca la red. Cada listado
 * devuelve el sobre completo (la pantalla pinta `meta`) y cada mutación manda
 * el payload tal como lo espera el contrato.
 */

const { httpMock } = vi.hoisted(() => ({
  httpMock: {
    get: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
    post: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
  },
}))

vi.mock('@/core/api/client', () => ({ http: httpMock }))

beforeEach(() => {
  vi.clearAllMocks()
})

describe('listados de Operaciones', () => {
  it('manda la query de env��os y devuelve el sobre con `meta`', async () => {
    httpMock.get.mockResolvedValue({
      data: { success: true, message: 'ok', data: [{ id: 1 }], meta: { total: 1 } },
    })

    const response = await operationsApi.listShipments({
      page: 2,
      status: 'received,embarked',
      agency: 1,
    })

    expect(httpMock.get).toHaveBeenCalledWith('/api/v1/operations/shipments', {
      params: { page: 2, status: 'received,embarked', agency: 1 },
    })
    expect(response.meta?.total).toBe(1)
  })

  it('sin filtros manda un objeto vac��o de parǭmetros', async () => {
    httpMock.get.mockResolvedValue({ data: { success: true, message: 'ok', data: [] } })

    await operationsApi.listShipments()

    expect(httpMock.get).toHaveBeenCalledWith('/api/v1/operations/shipments', { params: {} })
  })

  it('codifica el c��digo de gu��a en el detalle y en el tracking', async () => {
    httpMock.get.mockResolvedValue({ data: { success: true, message: 'ok', data: {} } })

    await operationsApi.getShipment('A/B 1234')
    await operationsApi.getTracking('A/B 1234')

    expect(httpMock.get).toHaveBeenCalledWith('/api/v1/operations/shipments/A%2FB%201234')
    expect(httpMock.get).toHaveBeenCalledWith('/api/v1/operations/tracking/A%2FB%201234')
  })

  it('el inventario de agencia va por la ruta anidada', async () => {
    httpMock.get.mockResolvedValue({ data: { success: true, message: 'ok', data: [] } })

    await operationsApi.listAgencyInventory(42, { page: 3, search: 'ORD-2026' })

    expect(httpMock.get).toHaveBeenCalledWith('/api/v1/operations/agencies/42/inventory', {
      params: { page: 3, search: 'ORD-2026' },
    })
  })

  it('lista recepciones, manifiestos, conteos y entregas con su query', async () => {
    httpMock.get.mockResolvedValue({ data: { success: true, message: 'ok', data: [] } })

    await operationsApi.listReceptions({ agency: 1 })
    await operationsApi.listEmbarks({ page: 2 })
    await operationsApi.listInventoryCounts({ status: 'open' })
    await operationsApi.listDeliveries({ status: 'assigned', courier_id: 7 })

    expect(httpMock.get).toHaveBeenNthCalledWith(1, '/api/v1/operations/receptions', {
      params: { agency: 1 },
    })
    expect(httpMock.get).toHaveBeenNthCalledWith(2, '/api/v1/operations/embarks', {
      params: { page: 2 },
    })
    expect(httpMock.get).toHaveBeenNthCalledWith(3, '/api/v1/operations/inventory-counts', {
      params: { status: 'open' },
    })
    expect(httpMock.get).toHaveBeenNthCalledWith(4, '/api/v1/operations/deliveries', {
      params: { status: 'assigned', courier_id: 7 },
    })
  })
})

describe('mutaciones de Operaciones', () => {
  it('recepción: manda el payload y devuelve el sobre', async () => {
    const payload = {
      agency_id: 1,
      items: [{ ticket_code: 'A7F3Q8X4' }],
    }

    httpMock.post.mockResolvedValue({
      data: { success: true, message: 'ok', data: { accepted: 1, duplicated: 0 } },
    })

    const response = await operationsApi.receiveShipments(payload)

    expect(httpMock.post).toHaveBeenCalledWith('/api/v1/operations/receptions', payload)
    expect(response.data?.accepted).toBe(1)
  })

  it('manifiesto y desembarque usan la ruta del embarque', async () => {
    httpMock.post.mockResolvedValue({ data: { success: true, message: 'ok', data: {} } })

    await operationsApi.createEmbark({
      agency_id: 1,
      vehicle_id: 10,
      driver_id: 20,
      items: [{ ticket_code: 'A7F3Q8X4' }],
    })
    await operationsApi.disembarkEmbark(3, { agency_id: 2 })

    expect(httpMock.post).toHaveBeenNthCalledWith(1, '/api/v1/operations/embarks', {
      agency_id: 1,
      vehicle_id: 10,
      driver_id: 20,
      items: [{ ticket_code: 'A7F3Q8X4' }],
    })
    expect(httpMock.post).toHaveBeenNthCalledWith(2, '/api/v1/operations/embarks/3/disembark', {
      agency_id: 2,
    })
  })

  it('inventario: abre, consulta y cierra el conteo', async () => {
    httpMock.post.mockResolvedValue({ data: { success: true, message: 'ok', data: { id: 1 } } })
    httpMock.get.mockResolvedValue({ data: { success: true, message: 'ok', data: { id: 1 } } })

    await operationsApi.openInventoryCount({ agency_id: 1 })
    await operationsApi.getInventoryCount(1)
    await operationsApi.finishInventoryCount(1, {
      items: [{ shipment_id: 5, found: false, motive: 'Missing' }],
    })

    expect(httpMock.post).toHaveBeenNthCalledWith(1, '/api/v1/operations/inventory-counts', {
      agency_id: 1,
    })
    expect(httpMock.get).toHaveBeenCalledWith('/api/v1/operations/inventory-counts/1')
    expect(httpMock.post).toHaveBeenNthCalledWith(
      2,
      '/api/v1/operations/inventory-counts/1/finish',
      { items: [{ shipment_id: 5, found: false, motive: 'Missing' }] },
    )
  })

  it('escaneos del PDA se envían en lote', async () => {
    const payload = {
      scans: [
        {
          scan_id: '8a8f0a52-4f1e-4f54-9c9e-3f0b1f0a2b3c',
          ticket_code: 'A7F3Q8X4',
          scan_type: 'reception' as const,
          scanned_at: '2026-10-20T10:00:00Z',
        },
      ],
    }

    httpMock.post.mockResolvedValue({ data: { success: true, message: 'ok', data: {} } })

    await operationsApi.syncScans(payload)

    expect(httpMock.post).toHaveBeenCalledWith('/api/v1/operations/scans/sync', payload)
  })

  it('entrega: asigna, inicia, completa y falla por la ruta de la entrega', async () => {
    httpMock.post.mockResolvedValue({ data: { success: true, message: 'ok', data: {} } })

    await operationsApi.assignDeliveries({
      agency_id: 2,
      courier_id: 7,
      shipment_ids: [5],
    })
    await operationsApi.startDelivery(9)
    await operationsApi.completeDelivery(9, {
      recipient_name: 'Ana PǸrez',
      recipient_document: '12345678',
      signature_path: 'deliveries/9/signature.png',
      photo_path: 'deliveries/9/photo.jpg',
      latitude: -12.0464,
      longitude: -77.0428,
      captured_at: '2026-10-20T10:00:00Z',
    })
    await operationsApi.failDelivery(9, { failure_reason: 'Recipient absent' })

    expect(httpMock.post).toHaveBeenNthCalledWith(1, '/api/v1/operations/deliveries/assign', {
      agency_id: 2,
      courier_id: 7,
      shipment_ids: [5],
    })
    expect(httpMock.post).toHaveBeenNthCalledWith(2, '/api/v1/operations/deliveries/9/start')
    expect(httpMock.post).toHaveBeenNthCalledWith(3, '/api/v1/operations/deliveries/9/complete', {
      recipient_name: 'Ana PǸrez',
      recipient_document: '12345678',
      signature_path: 'deliveries/9/signature.png',
      photo_path: 'deliveries/9/photo.jpg',
      latitude: -12.0464,
      longitude: -77.0428,
      captured_at: '2026-10-20T10:00:00Z',
    })
    expect(httpMock.post).toHaveBeenNthCalledWith(4, '/api/v1/operations/deliveries/9/fail', {
      failure_reason: 'Recipient absent',
    })
  })
})
