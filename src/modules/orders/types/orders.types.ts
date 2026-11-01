import type { QueryOf, RequestOf, ResponseOf } from '@/core/api/types'

/**
 * Tipos del módulo **orders**, derivados del contrato OpenAPI (`generated/`
 * + helpers de `core/api/types`, ADR-0008): nada escrito a mano. El módulo solo
 * afina la opcionalidad que el backend no declara (`required`).
 */

/** `GET /api/v1/logistics/orders` — paginado con el sobre estándar. */
export type ListOrdersResponse = ResponseOf<'/api/v1/logistics/orders', 'get'>

/** Fila de orden. Los clientes y agencias llegan como ids. */
export type Order = Required<NonNullable<ListOrdersResponse['data']>[number]>

/** `meta` del paginador de Laravel. */
export type OrdersPageMeta = Required<NonNullable<ListOrdersResponse['meta']>>

/** Filtros del listado de órdenes. */
export type OrdersQuery = NonNullable<QueryOf<'/api/v1/logistics/orders', 'get'>> & {
  page?: number
  per_page?: number
  status?: string
}

/** `POST /api/v1/logistics/orders`. */
export type CreateOrderPayload = RequestOf<'/api/v1/logistics/orders', 'post'>

export type CreateOrderResponse = ResponseOf<'/api/v1/logistics/orders', 'post'>

export type ShowOrderResponse = ResponseOf<'/api/v1/logistics/orders/{order}', 'get'>

/** Detalle: como la fila, con el historial de estados. */
export type OrderDetail = Order & {
  status_history?: {
    from_status: string | null
    to_status: string
    reason: string | null
    changed_by: number | null
    created_at: string | null
  }[]
}

/** `POST /api/v1/logistics/orders/quote`. */
export type QuotePayload = RequestOf<'/api/v1/logistics/orders/quote', 'post'>

export type QuoteResponse = ResponseOf<'/api/v1/logistics/orders/quote', 'post'>

export type Quote = NonNullable<QuoteResponse['data']>

export type UpdateDeliveryPayload = RequestOf<'/api/v1/logistics/orders/{order}/delivery', 'patch'>

/* Selectores del alta */

type ListCustomersResponse = ResponseOf<'/api/v1/customers', 'get'>

export type CustomerOption = Required<NonNullable<ListCustomersResponse['data']>[number]>

type LocationOptionsResponse = ResponseOf<'/api/v1/logistics/locations/options', 'get'>

export type LocationOption = Required<NonNullable<LocationOptionsResponse['data']>[number]>
