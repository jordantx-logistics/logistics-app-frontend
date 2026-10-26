import { flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useOperationsStore } from '@/modules/operations/stores/useOperationsStore'

/**
 * Store de Operaciones: cada listado guarda su query y se recarga del API.
 * Las mutaciones no insertan filas a mano: llaman al API y recargan los
 * listados afectados.
 */

const { apiMock } = vi.hoisted(() => ({
  apiMock: {
    listShipments: vi.fn<(...args: unknown[]) => Promise<unknown>>(),
    listReceptions: vi.fn<(...args: unknown[]) => Promise<unknown>>(),
    listEmbarks: vi.fn<(...args: unknown[]) => Promise<unknown>>(),
    listInventoryCounts: vi.fn<(...args: unknown[]) => Promise<unknown>>(),
    getTracking: vi.fn<(...args: unknown[]) => Promise<unknown>>(),
    listDeliveries: vi.fn<(...args: unknown[]) => Promise<unknown>>(),
    receiveShipments: vi.fn<(...args: unknown[]) => Promise<unknown>>(),
    createEmbark: vi.fn<(...args: unknown[]) => Promise<unknown>>(),
    disembarkEmbark: vi.fn<(...args: unknown[]) => Promise<unknown>>(),
    openInventoryCount: vi.fn<(...args: unknown[]) => Promise<unknown>>(),
    finishInventoryCount: vi.fn<(...args: unknown[]) => Promise<unknown>>(),
    assignDeliveries: vi.fn<(...args: unknown[]) => Promise<unknown>>(),
    startDelivery: vi.fn<(...args: unknown[]) => Promise<unknown>>(),
    completeDelivery: vi.fn<(...args: unknown[]) => Promise<unknown>>(),
    failDelivery: vi.fn<(...args: unknown[]) => Promise<unknown>>(),
  },
}))

vi.mock('@/modules/operations/api/operations.api', () => apiMock)

function emptyPage() {
  return {
    success: true,
    message: 'ok',
    data: [],
    meta: { current_page: 1, last_page: 1, per_page: 15, total: 0 },
  }
}

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()

  for (const list of [
    apiMock.listShipments,
    apiMock.listReceptions,
    apiMock.listEmbarks,
    apiMock.listInventoryCounts,
    apiMock.listDeliveries,
  ]) {
    list.mockResolvedValue(emptyPage())
  }

  apiMock.getTracking.mockResolvedValue({ success: true, message: 'ok', data: {} })
  apiMock.receiveShipments.mockResolvedValue({
    success: true,
    message: 'ok',
    data: { accepted: 1, duplicated: 0 },
  })
  apiMock.createEmbark.mockResolvedValue({ success: true, message: 'ok', data: {} })
  apiMock.disembarkEmbark.mockResolvedValue({ success: true, message: 'ok', data: {} })
  apiMock.openInventoryCount.mockResolvedValue({ success: true, message: 'ok', data: { id: 1 } })
  apiMock.finishInventoryCount.mockResolvedValue({ success: true, message: 'ok', data: {} })
  apiMock.assignDeliveries.mockResolvedValue({ success: true, message: 'ok', data: [] })
  apiMock.startDelivery.mockResolvedValue({ success: true, message: 'ok', data: {} })
  apiMock.completeDelivery.mockResolvedValue({ success: true, message: 'ok', data: {} })
  apiMock.failDelivery.mockResolvedValue({ success: true, message: 'ok', data: {} })
})

describe('listados', () => {
  it('carga env��os con la pǭgina inicial y guarda el sobre', async () => {
    const store = useOperationsStore()

    await store.shipments.load()

    expect(apiMock.listShipments).toHaveBeenCalledWith({ page: 1, per_page: 15 })
    expect(store.shipments.status).toBe('ready')
    expect(store.shipments.data?.meta?.total).toBe(0)
  })

  it('actualiza la query y recarga el listado', async () => {
    const store = useOperationsStore()

    store.updateShipmentsQuery({ page: 3, status: 'received' })
    await flushPromises()

    expect(store.shipmentsQuery).toEqual({ page: 3, per_page: 15, status: 'received' })
    expect(apiMock.listShipments).toHaveBeenCalledWith({
      page: 3,
      per_page: 15,
      status: 'received',
    })
  })

  it('tracking normaliza el c��digo antes de consultar', async () => {
    const store = useOperationsStore()

    await store.lookupTracking('  a7f3q8x4 ')

    expect(store.trackedTicket).toBe('A7F3Q8X4')
    expect(apiMock.getTracking).toHaveBeenCalledWith('A7F3Q8X4')
  })
})

describe('mutaciones', () => {
  it('recepción recarga recepciones y env��os', async () => {
    const store = useOperationsStore()

    await store.receiveShipments({ agency_id: 1, items: [{ ticket_code: 'A7F3Q8X4' }] })

    expect(apiMock.receiveShipments).toHaveBeenCalledWith({
      agency_id: 1,
      items: [{ ticket_code: 'A7F3Q8X4' }],
    })
    expect(apiMock.listReceptions).toHaveBeenCalledTimes(1)
    expect(apiMock.listShipments).toHaveBeenCalledTimes(1)
  })

  it('embarque y desembarque recargan manifiestos y env��os', async () => {
    const store = useOperationsStore()

    await store.createEmbark({
      agency_id: 1,
      vehicle_id: 10,
      driver_id: 20,
      items: [{ ticket_code: 'A7F3Q8X4' }],
    })
    await store.disembark(3, { agency_id: 2 })

    expect(apiMock.createEmbark).toHaveBeenCalledTimes(1)
    expect(apiMock.disembarkEmbark).toHaveBeenCalledWith(3, { agency_id: 2 })
    expect(apiMock.listEmbarks).toHaveBeenCalledTimes(2)
    expect(apiMock.listShipments).toHaveBeenCalledTimes(2)
  })

  it('inventario recarga conteos y, al cerrar, tambiǸn env��os', async () => {
    const store = useOperationsStore()

    await store.openInventoryCount({ agency_id: 1 })
    expect(apiMock.listInventoryCounts).toHaveBeenCalledTimes(1)
    expect(apiMock.listShipments).not.toHaveBeenCalled()

    await store.finishInventoryCount(1, {
      items: [{ shipment_id: 5, found: false, motive: 'Missing' }],
    })

    expect(apiMock.finishInventoryCount).toHaveBeenCalledWith(1, {
      items: [{ shipment_id: 5, found: false, motive: 'Missing' }],
    })
    expect(apiMock.listInventoryCounts).toHaveBeenCalledTimes(2)
    expect(apiMock.listShipments).toHaveBeenCalledTimes(1)
  })

  it('entregas recargan entregas y env��os en cada transici��n', async () => {
    const store = useOperationsStore()

    await store.assignDeliveries({ agency_id: 2, courier_id: 7, shipment_ids: [5] })
    await store.startDelivery(9)
    await store.completeDelivery(9, {
      recipient_name: 'Ana PǸrez',
      recipient_document: '12345678',
      signature_path: 'deliveries/9/signature.png',
      photo_path: 'deliveries/9/photo.jpg',
      latitude: -12.0464,
      longitude: -77.0428,
      captured_at: '2026-10-20T10:00:00Z',
    })
    await store.failDelivery(9, { failure_reason: 'Recipient absent' })

    expect(apiMock.listDeliveries).toHaveBeenCalledTimes(4)
    expect(apiMock.listShipments).toHaveBeenCalledTimes(4)
  })
})
