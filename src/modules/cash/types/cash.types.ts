import type { QueryOf, RequestOf, ResponseOf } from '@/core/api/types'

/**
 * Tipos del módulo **cash**, derivados del contrato OpenAPI (ADR-0008).
 *
 * La sesión actual llega envuelta en `cash_session` y el cierre devuelve la
 * sesión, el cierre y si necesita aprobación. Scribe no puede inferir esos
 * sobres, así que el backend los declara con `@response` y aquí se derivan.
 */

/** `GET /api/v1/finance/cash-sessions`. */
export type ListCashSessionsResponse = ResponseOf<'/api/v1/finance/cash-sessions', 'get'>

/** Fila del listado de sesiones. */
export type CashSession = Required<NonNullable<ListCashSessionsResponse['data']>[number]>

export type CashSessionsQuery = NonNullable<QueryOf<'/api/v1/finance/cash-sessions', 'get'>> & {
  page?: number
}

/** `GET /api/v1/finance/cash-sessions/current`. */
export type CurrentCashSessionResponse = ResponseOf<'/api/v1/finance/cash-sessions/current', 'get'>

/** Fila del listado de cierres. */
export type CashClosureRow = Required<NonNullable<ListCashClosuresResponse['data']>[number]>

/** Movimiento de caja devuelto al registrarlo. */
export type CashMovement = Required<ResponseOf<'/api/v1/finance/cash-movements', 'post'>['data']>

type CurrentCashSessionBase = Required<
  Extract<NonNullable<CurrentCashSessionResponse['data']['cash_session']>, Record<string, unknown>>
>

/**
 * Sesión abierta o `null`.
 *
 * El contrato declara los dos escenarios (con y sin sesión) y Scribe tipa el
 * `null` como texto; se descarta ese caso y se reemplazan las colecciones que
 * llegan vacías en el ejemplo por sus tipos reales.
 */
export type CurrentCashSession =
  | (Omit<CurrentCashSessionBase, 'movements' | 'closures'> & {
      movements: CashMovement[]
      closures: CashClosureRow[]
    })
  | null

/** `POST /api/v1/finance/cash-sessions`. */
export type OpenCashSessionPayload = RequestOf<'/api/v1/finance/cash-sessions', 'post'>

export type OpenCashSessionResponse = ResponseOf<'/api/v1/finance/cash-sessions', 'post'>

/** `POST /api/v1/finance/cash-sessions/{session}/close`. */
export type CloseCashSessionPayload = RequestOf<
  '/api/v1/finance/cash-sessions/{session}/close',
  'post'
>

export type CloseCashSessionResponse = ResponseOf<
  '/api/v1/finance/cash-sessions/{session}/close',
  'post'
>

/** `POST /api/v1/finance/cash-movements`. */
export type RegisterCashMovementPayload = RequestOf<'/api/v1/finance/cash-movements', 'post'>

export type RegisterCashMovementResponse = ResponseOf<'/api/v1/finance/cash-movements', 'post'>

/** `GET /api/v1/finance/cash-closures`. */
export type ListCashClosuresResponse = ResponseOf<'/api/v1/finance/cash-closures', 'get'>

export type CashClosuresQuery = NonNullable<QueryOf<'/api/v1/finance/cash-closures', 'get'>> & {
  page?: number
}

/** `POST /api/v1/finance/cash-closures/{closure}/approve`. */
export type ApproveCashClosureResponse = ResponseOf<
  '/api/v1/finance/cash-closures/{closure}/approve',
  'post'
>

/** `POST /api/v1/finance/cash-closures/{closure}/reject`. */
export type RejectCashClosurePayload = RequestOf<
  '/api/v1/finance/cash-closures/{closure}/reject',
  'post'
>

export type RejectCashClosureResponse = ResponseOf<
  '/api/v1/finance/cash-closures/{closure}/reject',
  'post'
>

export type CashMovementType = 'expense' | 'withdrawal'
