import type { QueryOf, RequestOf, ResponseOf } from '@/core/api/types'

/**
 * Tipos del módulo **orders**, derivados del contrato OpenAPI (`generated/`
 * + helpers de `core/api/types`, ADR-0008): nada escrito a mano. El módulo solo
 * afina la opcionalidad que el backend no declara (`required`).
 */

/** `GET /api/v1/logistics/orders` — paginado con el sobre estándar. */
export type ListOrdersResponse = ResponseOf<'/api/v1/logistics/orders', 'get'>

/** Fila de orden. Solo ids: los nombres llegan en la Fase 3. */
export type Order = Required<NonNullable<ListOrdersResponse['data']>[number]>

/** `meta` del paginador de Laravel. */
export type OrdersPageMeta = Required<NonNullable<ListOrdersResponse['meta']>>

/** `page` / `per_page` del listado de órdenes. */
export type OrdersQuery = NonNullable<QueryOf<'/api/v1/logistics/orders', 'get'>>

/** `POST /api/v1/logistics/orders` (lo usará el formulario de órdenes). */
export type CreateOrderPayload = RequestOf<'/api/v1/logistics/orders', 'post'>
