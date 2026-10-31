import { http } from '@/core/api/client'
import { API_BASE_PATH } from '@/core/api/config'

import type {
  ApproveVoidResponse,
  CreditNote,
  CreditNoteDetail,
  CreditNotesQuery,
  DownloadType,
  IssueCreditNotePayload,
  IssueCreditNoteResponse,
  ListCreditNotesResponse,
  ListVoidsResponse,
  RejectVoidPayload,
  RejectVoidResponse,
  ShowCreditNoteResponse,
  VoidRequest,
  VoidsQuery,
} from '../types/credit-notes.types'

/** Notas de crédito y aprobación de anulaciones (`src/Finance/CreditNote`). */

const CREDIT_NOTES_PATH = `${API_BASE_PATH}/finance/credit-notes`
const VOIDS_PATH = `${API_BASE_PATH}/finance/voids`

export interface CreditNotePage {
  rows: CreditNote[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface VoidPage {
  rows: VoidRequest[]
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

/** Listado paginado de notas de crédito. */
export async function listCreditNotes(query: CreditNotesQuery = {}): Promise<CreditNotePage> {
  const { data } = await http.get<ListCreditNotesResponse>(CREDIT_NOTES_PATH, { params: query })

  return {
    rows: (data.data ?? []) as CreditNote[],
    meta: pageMeta(data),
  }
}

/** Emite una nota de crédito sobre un comprobante aceptado. */
export async function issueCreditNote(
  payload: IssueCreditNotePayload,
): Promise<IssueCreditNoteResponse> {
  const { data } = await http.post<IssueCreditNoteResponse>(CREDIT_NOTES_PATH, payload)

  return data
}

/** Detalle de una nota de crédito. */
export async function getCreditNote(id: number): Promise<CreditNoteDetail> {
  const { data } = await http.get<ShowCreditNoteResponse>(`${CREDIT_NOTES_PATH}/${id}`)

  return data.data as CreditNoteDetail
}

/** Descarga autenticada de un artefacto (XML, PDF o CDR). */
export async function downloadCreditNoteArtifact(id: number, type: DownloadType): Promise<Blob> {
  const { data } = await http.get<Blob>(`${CREDIT_NOTES_PATH}/${id}/download/${type}`, {
    responseType: 'blob',
  })

  return data
}

/** Listado paginado de solicitudes de anulación. */
export async function listVoids(query: VoidsQuery = {}): Promise<VoidPage> {
  const { data } = await http.get<ListVoidsResponse>(VOIDS_PATH, { params: query })

  return {
    rows: (data.data ?? []) as VoidRequest[],
    meta: pageMeta(data),
  }
}

/** Aprueba una anulación (permiso `voids.approve`). */
export async function approveVoid(voidId: number): Promise<ApproveVoidResponse> {
  const { data } = await http.post<ApproveVoidResponse>(`${VOIDS_PATH}/${voidId}/approve`)

  return data
}

/** Rechaza una anulación con un motivo. */
export async function rejectVoid(
  voidId: number,
  payload: RejectVoidPayload,
): Promise<RejectVoidResponse> {
  const { data } = await http.post<RejectVoidResponse>(`${VOIDS_PATH}/${voidId}/reject`, payload)

  return data
}
