import { beforeEach, describe, expect, it, vi } from 'vitest'

import * as invoicesApi from '@/modules/invoices/api'

/** Capa API de comprobantes, reintentos y series. */

const { httpMock } = vi.hoisted(() => ({
  httpMock: {
    get: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
    post: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
    put: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
  },
}))

vi.mock('@/core/api/client', () => ({ http: httpMock }))

beforeEach(() => {
  vi.clearAllMocks()
})

describe('comprobantes', () => {
  it('lista con filtros y paginador', async () => {
    httpMock.get.mockResolvedValue({
      data: {
        data: [{ id: 1, ticket_number: '001-000001', status: 'accepted' }],
        meta: { current_page: 1, last_page: 1, per_page: 15, total: 1 },
      },
    })

    const page = await invoicesApi.listInvoices({ status: 'accepted', order_id: 5 })

    expect(httpMock.get).toHaveBeenCalledWith('/api/v1/finance/invoices', {
      params: { status: 'accepted', order_id: 5 },
    })
    expect(page.rows[0]?.ticket_number).toBe('001-000001')
  })

  it('reintenta la transmisión SUNAT', async () => {
    httpMock.post.mockResolvedValue({ data: { data: { id: 1, status: 'pending' } } })

    await invoicesApi.retryInvoice(1)

    expect(httpMock.post).toHaveBeenCalledWith('/api/v1/finance/invoices/1/retry')
  })

  it('descarga un artefacto como blob', async () => {
    const blob = new Blob(['pdf'])
    httpMock.get.mockResolvedValue({ data: blob })

    await expect(invoicesApi.downloadInvoiceArtifact(1, 'pdf')).resolves.toBe(blob)
    expect(httpMock.get).toHaveBeenCalledWith('/api/v1/finance/invoices/1/download/pdf', {
      responseType: 'blob',
    })
  })
})

describe('series', () => {
  it('lista series por agencia', async () => {
    httpMock.get.mockResolvedValue({ data: { data: [{ id: 1, series: 'B001' }] } })

    const series = await invoicesApi.listInvoiceSeries({ agency: 1 })

    expect(httpMock.get).toHaveBeenCalledWith('/api/v1/finance/invoice-series', {
      params: { agency: 1 },
    })
    expect(series).toHaveLength(1)
  })

  it('crea y actualiza una serie', async () => {
    httpMock.post.mockResolvedValue({ data: { data: { id: 1 } } })
    httpMock.put.mockResolvedValue({ data: { data: { id: 1 } } })

    await invoicesApi.createInvoiceSeries({
      agency_id: 1,
      document_type: 'boleta',
      series: 'B001',
      issuer_ruc: '20123456789',
      issuer_name: 'Logistics SAC',
    })
    await invoicesApi.updateInvoiceSeries(1, { is_default: true })

    expect(httpMock.post).toHaveBeenCalledWith('/api/v1/finance/invoice-series', {
      agency_id: 1,
      document_type: 'boleta',
      series: 'B001',
      issuer_ruc: '20123456789',
      issuer_name: 'Logistics SAC',
    })
    expect(httpMock.put).toHaveBeenCalledWith('/api/v1/finance/invoice-series/1', {
      is_default: true,
    })
  })
})
