import { beforeEach, describe, expect, it, vi } from 'vitest'

import * as paymentsApi from '@/modules/payments/api'

/** Capa API de cobros: rutas, query y sobres paginados. */

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

describe('listPayments', () => {
  it('devuelve filas y paginador de Laravel', async () => {
    httpMock.get.mockResolvedValue({
      data: {
        data: [{ id: 1, ticket_number: 'PAY-000001', amount: '25.90' }],
        meta: { current_page: 1, last_page: 2, per_page: 15, total: 16 },
      },
    })

    const page = await paymentsApi.listPayments({ page: 1, status: 'registered' })

    expect(httpMock.get).toHaveBeenCalledWith('/api/v1/finance/payments', {
      params: { page: 1, status: 'registered' },
    })
    expect(page.rows).toHaveLength(1)
    expect(page.meta.total).toBe(16)
  })
})

describe('mutaciones', () => {
  it('registra un pago con la clave de idempotencia', async () => {
    httpMock.post.mockResolvedValue({ data: { data: { id: 7 } } })

    const response = await paymentsApi.registerPayment({
      order_id: 10,
      amount: 25.9,
      payment_method: 'cash',
      idempotency_key: 'key-1',
    })

    expect(httpMock.post).toHaveBeenCalledWith('/api/v1/finance/payments', {
      order_id: 10,
      amount: 25.9,
      payment_method: 'cash',
      idempotency_key: 'key-1',
    })
    expect(response.data.id).toBe(7)
  })

  it('solicita la anulación de un pago', async () => {
    httpMock.post.mockResolvedValue({ data: { data: { id: 3, status: 'requested' } } })

    await paymentsApi.requestVoid({ payment_id: 7, reason: 'Duplicate charge' })

    expect(httpMock.post).toHaveBeenCalledWith('/api/v1/finance/voids', {
      payment_id: 7,
      reason: 'Duplicate charge',
    })
  })

  it('trae las anulaciones del pago', async () => {
    httpMock.get.mockResolvedValue({ data: { data: [{ id: 3, status: 'requested' }] } })

    const rows = await paymentsApi.listPaymentVoids(7)

    expect(httpMock.get).toHaveBeenCalledWith('/api/v1/finance/voids', {
      params: { payment_id: 7, per_page: 50 },
    })
    expect(rows).toHaveLength(1)
  })
})
