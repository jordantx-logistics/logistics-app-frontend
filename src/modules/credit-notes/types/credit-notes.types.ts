import type { QueryOf, RequestOf, ResponseOf } from '@/core/api/types'

/**
 * Tipos del módulo **credit-notes**, derivados del contrato OpenAPI (ADR-0008).
 *
 * Incluye las notas de crédito y las solicitudes de anulación, porque la
 * aprobación de anulaciones se atiende desde esta misma pantalla.
 */

/** `GET /api/v1/finance/credit-notes`. */
export type ListCreditNotesResponse = ResponseOf<'/api/v1/finance/credit-notes', 'get'>

/** Fila del listado de notas de crédito. */
export type CreditNote = Required<NonNullable<ListCreditNotesResponse['data']>[number]>

export type CreditNotesQuery = NonNullable<QueryOf<'/api/v1/finance/credit-notes', 'get'>> & {
  page?: number
}

/** `POST /api/v1/finance/credit-notes`. */
export type IssueCreditNotePayload = RequestOf<'/api/v1/finance/credit-notes', 'post'>

export type IssueCreditNoteResponse = ResponseOf<'/api/v1/finance/credit-notes', 'post'>

/** `GET /api/v1/finance/credit-notes/{creditNote}`. */
export type ShowCreditNoteResponse = ResponseOf<'/api/v1/finance/credit-notes/{creditNote}', 'get'>

export type CreditNoteDetail = Required<ShowCreditNoteResponse['data']>

/** `GET /api/v1/finance/voids`. */
export type ListVoidsResponse = ResponseOf<'/api/v1/finance/voids', 'get'>

export type VoidRequest = Required<NonNullable<ListVoidsResponse['data']>[number]>

export type VoidsQuery = NonNullable<QueryOf<'/api/v1/finance/voids', 'get'>> & {
  page?: number
}

/** `POST /api/v1/finance/voids/{void}/approve`. */
export type ApproveVoidResponse = ResponseOf<'/api/v1/finance/voids/{void}/approve', 'post'>

/** `POST /api/v1/finance/voids/{void}/reject`. */
export type RejectVoidPayload = RequestOf<'/api/v1/finance/voids/{void}/reject', 'post'>

export type RejectVoidResponse = ResponseOf<'/api/v1/finance/voids/{void}/reject', 'post'>

/** Catálogo de motivos SUNAT expuesto por el backend. */
export const CREDIT_NOTE_REASONS = [
  { label: '01 - Cancellation', value: '01' },
  { label: '02 - Price adjustment', value: '02' },
  { label: '03 - Commercial discount', value: '03' },
  { label: '06 - Return', value: '06' },
  { label: '07 - Other', value: '07' },
]

export type DownloadType = 'xml' | 'pdf' | 'cdr'
