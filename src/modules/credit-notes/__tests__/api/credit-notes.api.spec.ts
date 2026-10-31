import { beforeEach, describe, expect, it, vi } from 'vitest'

import * as creditNotesApi from '@/modules/credit-notes/api'

/** Capa API de notas de crédito y anulaciones. */

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

describe('notas de crédito', () => {
  it('lista con filtros y paginador', async () => {
    httpMock.get.mockResolvedValue({
      data: {
        data: [{ id: 2, amount: '10.00', status: 'issued' }],
        meta: { current_page: 1, last_page: 1, per_page: 15, total: 1 },
      },
    })

    const page = await creditNotesApi.listCreditNotes({ payment_id: 9 })

    expect(httpMock.get).toHaveBeenCalledWith('/api/v1/finance/credit-notes', {
      params: { payment_id: 9 },
    })
    expect(page.rows).toHaveLength(1)
  })

  it('emite una nota con motivo y nota opcional', async () => {
    httpMock.post.mockResolvedValue({ data: { data: { id: 2 } } })

    await creditNotesApi.issueCreditNote({
      payment_id: 9,
      amount: 10,
      reason: '01',
      note: 'Partial refund',
    })

    expect(httpMock.post).toHaveBeenCalledWith('/api/v1/finance/credit-notes', {
      payment_id: 9,
      amount: 10,
      reason: '01',
      note: 'Partial refund',
    })
  })

  it('descarga un artefacto como blob', async () => {
    const blob = new Blob(['xml'])
    httpMock.get.mockResolvedValue({ data: blob })

    await expect(creditNotesApi.downloadCreditNoteArtifact(2, 'xml')).resolves.toBe(blob)
    expect(httpMock.get).toHaveBeenCalledWith('/api/v1/finance/credit-notes/2/download/xml', {
      responseType: 'blob',
    })
  })
})

describe('anulaciones', () => {
  it('lista las solicitudes pendientes', async () => {
    httpMock.get.mockResolvedValue({
      data: {
        data: [{ id: 4, status: 'requested' }],
        meta: { current_page: 1, last_page: 1, per_page: 15, total: 1 },
      },
    })

    await creditNotesApi.listVoids({ status: 'requested' })

    expect(httpMock.get).toHaveBeenCalledWith('/api/v1/finance/voids', {
      params: { status: 'requested' },
    })
  })

  it('aprueba y rechaza', async () => {
    httpMock.post.mockResolvedValue({ data: { data: { id: 4 } } })

    await creditNotesApi.approveVoid(4)
    await creditNotesApi.rejectVoid(4, { reason: 'The charge is valid.' })

    expect(httpMock.post).toHaveBeenNthCalledWith(1, '/api/v1/finance/voids/4/approve')
    expect(httpMock.post).toHaveBeenNthCalledWith(2, '/api/v1/finance/voids/4/reject', {
      reason: 'The charge is valid.',
    })
  })
})
