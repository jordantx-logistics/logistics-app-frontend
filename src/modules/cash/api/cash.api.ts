import { http } from '@/core/api/client'
import { API_BASE_PATH } from '@/core/api/config'

import type {
  ApproveCashClosureResponse,
  CashClosureRow,
  CashClosuresQuery,
  CashSession,
  CashSessionsQuery,
  CloseCashSessionPayload,
  CloseCashSessionResponse,
  CurrentCashSession,
  CurrentCashSessionResponse,
  ListCashClosuresResponse,
  ListCashSessionsResponse,
  OpenCashSessionPayload,
  OpenCashSessionResponse,
  RegisterCashMovementPayload,
  RegisterCashMovementResponse,
  RejectCashClosurePayload,
  RejectCashClosureResponse,
} from '../types/cash.types'

/** Caja diaria (`src/Finance/Cash`). */

const SESSIONS_PATH = `${API_BASE_PATH}/finance/cash-sessions`
const MOVEMENTS_PATH = `${API_BASE_PATH}/finance/cash-movements`
const CLOSURES_PATH = `${API_BASE_PATH}/finance/cash-closures`

export interface CashSessionPage {
  rows: CashSession[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface CashClosurePage {
  rows: CashClosureRow[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

function pageMeta(data: {
  meta?: {
    current_page?: number
    last_page?: number
    per_page?: number
    total?: number
  }
}) {
  return {
    current_page: data.meta?.current_page ?? 1,
    last_page: data.meta?.last_page ?? 1,
    per_page: data.meta?.per_page ?? 15,
    total: data.meta?.total ?? 0,
  }
}

/** Sesión abierta del cajero autenticado, o `null`. */
export async function getCurrentCashSession(): Promise<CurrentCashSession> {
  const { data } = await http.get<CurrentCashSessionResponse>(`${SESSIONS_PATH}/current`)
  const session = data.data.cash_session

  // El contrato declara dos escenarios y Scribe tipa el `null` como texto; en
  // runtime el backend solo devuelve el recurso o `null`.
  return typeof session === 'object' && session !== null ? (session as CurrentCashSession) : null
}

/** Listado paginado de sesiones. */
export async function listCashSessions(query: CashSessionsQuery = {}): Promise<CashSessionPage> {
  const { data } = await http.get<ListCashSessionsResponse>(SESSIONS_PATH, { params: query })

  return {
    rows: (data.data ?? []) as CashSession[],
    meta: pageMeta(data),
  }
}

/** Abre la caja del cajero autenticado. */
export async function openCashSession(
  payload: OpenCashSessionPayload,
): Promise<OpenCashSessionResponse> {
  const { data } = await http.post<OpenCashSessionResponse>(SESSIONS_PATH, payload)

  return data
}

/** Cierra una sesión; un descuadre queda pendiente de aprobación. */
export async function closeCashSession(
  sessionId: number,
  payload: CloseCashSessionPayload,
): Promise<CloseCashSessionResponse['data']> {
  const { data } = await http.post<CloseCashSessionResponse>(
    `${SESSIONS_PATH}/${sessionId}/close`,
    payload,
  )

  return data.data
}

/** Registra un egreso o retiro de caja. */
export async function registerCashMovement(
  payload: RegisterCashMovementPayload,
): Promise<RegisterCashMovementResponse> {
  const { data } = await http.post<RegisterCashMovementResponse>(MOVEMENTS_PATH, payload)

  return data
}

/** Listado paginado de cierres (incluye los pendientes de aprobación). */
export async function listCashClosures(query: CashClosuresQuery = {}): Promise<CashClosurePage> {
  const { data } = await http.get<ListCashClosuresResponse>(CLOSURES_PATH, { params: query })

  return {
    rows: (data.data ?? []) as CashClosureRow[],
    meta: pageMeta(data),
  }
}

/** Aprueba un cierre con descuadre. */
export async function approveCashClosure(closureId: number): Promise<ApproveCashClosureResponse> {
  const { data } = await http.post<ApproveCashClosureResponse>(
    `${CLOSURES_PATH}/${closureId}/approve`,
  )

  return data
}

/** Rechaza un cierre con descuadre. */
export async function rejectCashClosure(
  closureId: number,
  payload: RejectCashClosurePayload,
): Promise<RejectCashClosureResponse> {
  const { data } = await http.post<RejectCashClosureResponse>(
    `${CLOSURES_PATH}/${closureId}/reject`,
    payload,
  )

  return data
}

/** Descarga autenticada del PDF de cierre. */
export async function downloadCashClosureReport(closureId: number): Promise<Blob> {
  const { data } = await http.get<Blob>(`${CLOSURES_PATH}/${closureId}/report`, {
    responseType: 'blob',
  })

  return data
}
