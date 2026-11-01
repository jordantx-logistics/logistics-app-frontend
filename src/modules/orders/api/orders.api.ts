import { http } from '@/core/api/client'
import { API_BASE_PATH } from '@/core/api/config'
import type {
  CreateOrderPayload,
  CreateOrderResponse,
  CustomerOption,
  ListOrdersResponse,
  LocationOption,
  OrderDetail,
  OrdersQuery,
  Quote,
  QuotePayload,
  QuoteResponse,
  ShowOrderResponse,
  UpdateDeliveryPayload,
} from '../types/orders.types'

/**
 * Órdenes (`src/Logistics/Order` del backend).
 *
 * El listado viene paginado con el sobre estándar (`data` + `meta` + `links`),
 * así que se devuelve la respuesta entera: la pantalla necesita el `meta` para
 * pintar la paginación del servidor.
 */

const ORDERS_PATH = `${API_BASE_PATH}/logistics/orders`

/** Órdenes visibles para el usuario, de la más nueva a la más vieja. */
export async function listOrders(query: OrdersQuery = {}): Promise<ListOrdersResponse> {
  const { data } = await http.get<ListOrdersResponse>(ORDERS_PATH, { params: query })

  return data
}

export async function getOrder(id: number): Promise<OrderDetail> {
  const { data } = await http.get<ShowOrderResponse>(`${ORDERS_PATH}/${id}`)

  return data.data as unknown as OrderDetail
}

export async function getOrderByTicket(ticketCode: string): Promise<OrderDetail> {
  const { data } = await http.get<ShowOrderResponse>(
    `${ORDERS_PATH}/by-ticket/${encodeURIComponent(ticketCode)}`,
  )

  return data.data as unknown as OrderDetail
}

/** El precio siempre lo calcula el backend; la pantalla solo lo muestra. */
export async function quoteOrder(payload: QuotePayload): Promise<Quote> {
  const { data } = await http.post<QuoteResponse>(`${ORDERS_PATH}/quote`, payload)

  return data.data as Quote
}

export async function createOrder(payload: CreateOrderPayload): Promise<OrderDetail> {
  const { data } = await http.post<CreateOrderResponse>(ORDERS_PATH, payload)

  return data.data as unknown as OrderDetail
}

export async function confirmOrder(id: number): Promise<void> {
  await http.post(`${ORDERS_PATH}/${id}/confirm`)
}

export async function cancelOrder(id: number, reason: string): Promise<void> {
  await http.post(`${ORDERS_PATH}/${id}/cancel`, { reason })
}

export async function updateDelivery(id: number, payload: UpdateDeliveryPayload): Promise<void> {
  await http.patch(`${ORDERS_PATH}/${id}/delivery`, payload)
}

export async function searchCustomers(q: string): Promise<CustomerOption[]> {
  const { data } = await http.get<{ data?: CustomerOption[] }>(`${API_BASE_PATH}/customers`, {
    params: { q, is_active: 1, per_page: 10 },
  })

  return data.data ?? []
}

export async function searchLocations(q: string): Promise<LocationOption[]> {
  const { data } = await http.get<{ data?: LocationOption[] }>(
    `${API_BASE_PATH}/logistics/locations/options`,
    { params: { q } },
  )

  return data.data ?? []
}
