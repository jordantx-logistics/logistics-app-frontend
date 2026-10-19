import { http } from '@/core/api/client'
import { API_BASE_PATH } from '@/core/api/config'
import type { ListOrdersResponse, OrdersQuery } from '../types/orders.types'

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
