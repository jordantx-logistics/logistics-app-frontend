import { beforeEach, describe, expect, it, vi } from 'vitest'

import * as cashApi from '@/modules/cash/api'

/** Capa API de caja: sesión actual, cierres y descarga autenticada. */

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

describe('getCurrentCashSession', () => {
  it('desenvuelve la sesión abierta', async () => {
    httpMock.get.mockResolvedValue({
      data: {
        data: {
          cash_session: {
            id: 1,
            agency_id: 1,
            status: 'open',
            opening_amount: '100.00',
            expected_amount: '150.00',
            movements: [],
            closures: [],
          },
        },
      },
    })

    const session = await cashApi.getCurrentCashSession()

    expect(httpMock.get).toHaveBeenCalledWith('/api/v1/finance/cash-sessions/current')
    expect(session?.id).toBe(1)
    expect(session?.expected_amount).toBe('150.00')
  })

  it('convierte el escenario sin sesión en null', async () => {
    httpMock.get.mockResolvedValue({ data: { data: { cash_session: null } } })

    await expect(cashApi.getCurrentCashSession()).resolves.toBeNull()
  })
})

describe('closeCashSession', () => {
  it('devuelve sesión, cierre y la marca de aprobación', async () => {
    httpMock.post.mockResolvedValue({
      data: {
        data: {
          cash_session: { id: 1, status: 'open' },
          closure: { id: 4, status: 'pending', difference: '-5.00' },
          requires_approval: true,
        },
      },
    })

    const result = await cashApi.closeCashSession(1, { closing_amount: 145 })

    expect(httpMock.post).toHaveBeenCalledWith('/api/v1/finance/cash-sessions/1/close', {
      closing_amount: 145,
    })
    expect(result.requires_approval).toBe(true)
    expect(result.closure.id).toBe(4)
  })
})

describe('listCashClosures', () => {
  it('filtra por estado pendiente', async () => {
    httpMock.get.mockResolvedValue({
      data: {
        data: [{ id: 4, status: 'pending' }],
        meta: { current_page: 1, last_page: 1, per_page: 15, total: 1 },
      },
    })

    const page = await cashApi.listCashClosures({ status: 'pending', page: 1 })

    expect(httpMock.get).toHaveBeenCalledWith('/api/v1/finance/cash-closures', {
      params: { status: 'pending', page: 1 },
    })
    expect(page.rows[0]?.status).toBe('pending')
  })
})

describe('downloadCashClosureReport', () => {
  it('pide el PDF como blob', async () => {
    const blob = new Blob(['pdf'])
    httpMock.get.mockResolvedValue({ data: blob })

    await expect(cashApi.downloadCashClosureReport(4)).resolves.toBe(blob)
    expect(httpMock.get).toHaveBeenCalledWith('/api/v1/finance/cash-closures/4/report', {
      responseType: 'blob',
    })
  })
})
