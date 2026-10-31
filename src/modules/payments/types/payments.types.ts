import type { QueryOf, RequestOf, ResponseOf } from '@/core/api/types'

/**
 * Tipos del módulo **payments**, derivados del contrato OpenAPI (ADR-0008).
 *
 * El backend devuelve las relaciones de un pago solo en el detalle; el contrato
 * de Scribe no las declara, así que la pantalla consume las filas base y los
 * recursos de notas de crédito y anulaciones desde sus propios listados.
 */

/** `GET /api/v1/finance/payments`. */
export type ListPaymentsResponse = ResponseOf<'/api/v1/finance/payments', 'get'>

/** Fila del listado de pagos. */
export type Payment = Required<NonNullable<ListPaymentsResponse['data']>[number]>

/** `meta` del paginador de Laravel. */
export type PageMeta = Required<NonNullable<ListPaymentsResponse['meta']>>

/** Filtros del listado de pagos. */
export type PaymentsQuery = NonNullable<QueryOf<'/api/v1/finance/payments', 'get'>> & {
  page?: number
}

/** `POST /api/v1/finance/payments`. */
export type RegisterPaymentPayload = RequestOf<'/api/v1/finance/payments', 'post'>

export type RegisterPaymentResponse = ResponseOf<'/api/v1/finance/payments', 'post'>

/** `GET /api/v1/finance/payments/{payment}`. */
export type ShowPaymentResponse = ResponseOf<'/api/v1/finance/payments/{payment}', 'get'>

export type PaymentDetail = Required<ShowPaymentResponse['data']>

/** Estados visibles del pago. */
export type PaymentStatus = 'registered' | 'refunded' | 'voided'

/** `POST /api/v1/finance/voids`. */
export type RequestVoidPayload = RequestOf<'/api/v1/finance/voids', 'post'>

export type RequestVoidResponse = ResponseOf<'/api/v1/finance/voids', 'post'>

/** `GET /api/v1/finance/voids`. */
export type ListVoidsResponse = ResponseOf<'/api/v1/finance/voids', 'get'>

export type VoidRequest = Required<NonNullable<ListVoidsResponse['data']>[number]>

export type VoidsQuery = NonNullable<QueryOf<'/api/v1/finance/voids', 'get'>>
