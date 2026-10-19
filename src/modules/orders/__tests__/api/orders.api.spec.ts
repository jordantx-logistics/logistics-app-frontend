import { beforeEach, describe, expect, it, vi } from 'vitest'

import * as ordersApi from '@/modules/orders/api'

/**
 * Órdenes: el listado se pagina en el servidor, así que la capa API devuelve el
 * sobre **entero** (`data` + `meta` + `links`), no solo las filas.
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

describe('listOrders', () => {
  it('manda `page` y `per_page` como query string', async () => {
    httpMock.get.mockResolvedValue({
      data: {
        success: true,
        message: 'ok',
        data: [{ id: 1, ticket_number: 'ORD-0000001', status: 'pending' }],
        meta: { current_page: 2, last_page: 5, per_page: 15, total: 70 },
        links: { next: '/?page=3' },
      },
    })

    const response = await ordersApi.listOrders({ page: 2, per_page: 15 })

    expect(httpMock.get).toHaveBeenCalledWith('/api/v1/logistics/orders', {
      params: { page: 2, per_page: 15 },
    })
    expect(response.meta?.current_page).toBe(2)
    expect(response.data).toHaveLength(1)
  })

  it('sin argumentos no manda ningún parámetro', async () => {
    httpMock.get.mockResolvedValue({ data: { success: true, message: 'ok', data: [] } })

    await ordersApi.listOrders()

    expect(httpMock.get).toHaveBeenCalledWith('/api/v1/logistics/orders', { params: {} })
  })
})
