import { beforeEach, describe, expect, it, vi } from 'vitest'

import * as ordersApi from '@/modules/orders/api'
import type { CreateOrderPayload, QuotePayload } from '@/modules/orders/types/orders.types'

/**
 * Órdenes: el listado se pagina en el servidor, así que la capa API devuelve el
 * sobre **entero** (`data` + `meta` + `links`), no solo las filas.
 */

const { httpMock } = vi.hoisted(() => ({
  httpMock: {
    get: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
    post: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
    patch: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
  },
}))

vi.mock('@/core/api/client', () => ({ http: httpMock }))

beforeEach(() => {
  vi.clearAllMocks()
  httpMock.get.mockResolvedValue({ data: { data: { id: 1 } } })
  httpMock.post.mockResolvedValue({ data: { data: { id: 1 } } })
  httpMock.patch.mockResolvedValue({ data: {} })
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

describe('órdenes', () => {
  it('busca por ticket codificando el código', async () => {
    await ordersApi.getOrderByTicket('AB 12')

    expect(httpMock.get).toHaveBeenCalledWith('/api/v1/logistics/orders/by-ticket/AB%2012')
  })

  it('cotiza en el backend y devuelve el resultado', async () => {
    httpMock.post.mockResolvedValue({ data: { data: { total_amount: 53 } } })

    const quote = await ordersApi.quoteOrder({ weight_kg: 5 } as QuotePayload)

    expect(httpMock.post).toHaveBeenCalledWith('/api/v1/logistics/orders/quote', { weight_kg: 5 })
    expect(quote.total_amount).toBe(53)
  })

  it('envía la clave de idempotencia al crear', async () => {
    await ordersApi.createOrder({ idempotency_key: 'abc' } as CreateOrderPayload)

    expect(httpMock.post).toHaveBeenCalledWith('/api/v1/logistics/orders', {
      idempotency_key: 'abc',
    })
  })

  it('cancela con motivo y confirma sin cuerpo', async () => {
    await ordersApi.cancelOrder(7, 'Customer request')
    await ordersApi.confirmOrder(7)

    expect(httpMock.post).toHaveBeenCalledWith('/api/v1/logistics/orders/7/cancel', {
      reason: 'Customer request',
    })
    expect(httpMock.post).toHaveBeenCalledWith('/api/v1/logistics/orders/7/confirm')
  })
})

describe('selectores', () => {
  it('busca solo clientes activos', async () => {
    httpMock.get.mockResolvedValue({ data: { data: [{ id: 3 }] } })

    expect(await ordersApi.searchCustomers('ana')).toEqual([{ id: 3 }])
    expect(httpMock.get).toHaveBeenCalledWith('/api/v1/customers', {
      params: { q: 'ana', is_active: 1, per_page: 10 },
    })
  })

  it('usa el endpoint de opciones para las ubicaciones', async () => {
    httpMock.get.mockResolvedValue({ data: {} })

    expect(await ordersApi.searchLocations('lima')).toEqual([])
    expect(httpMock.get).toHaveBeenCalledWith('/api/v1/logistics/locations/options', {
      params: { q: 'lima' },
    })
  })
})
