import { http } from '@/core/api/client'
import { API_BASE_PATH } from '@/core/api/config'

import type {
  CreateInvoiceSeriesPayload,
  CreateInvoiceSeriesResponse,
  DownloadType,
  Invoice,
  InvoiceDetail,
  InvoicesQuery,
  InvoiceSeries,
  InvoiceSeriesQuery,
  ListInvoicesResponse,
  ListInvoiceSeriesResponse,
  RetryInvoiceResponse,
  ShowInvoiceResponse,
  UpdateInvoiceSeriesPayload,
  UpdateInvoiceSeriesResponse,
} from '../types/invoices.types'

/** Comprobantes electrónicos y series (`src/Finance/Invoice`). */

const INVOICES_PATH = `${API_BASE_PATH}/finance/invoices`
const SERIES_PATH = `${API_BASE_PATH}/finance/invoice-series`

export interface InvoicePage {
  rows: Invoice[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

/** Listado paginado de comprobantes. */
export async function listInvoices(query: InvoicesQuery = {}): Promise<InvoicePage> {
  const { data } = await http.get<ListInvoicesResponse>(INVOICES_PATH, { params: query })

  return {
    rows: (data.data ?? []) as Invoice[],
    meta: {
      current_page: data.meta?.current_page ?? 1,
      last_page: data.meta?.last_page ?? 1,
      per_page: data.meta?.per_page ?? 15,
      total: data.meta?.total ?? 0,
    },
  }
}

/** Detalle de un comprobante. */
export async function getInvoice(id: number): Promise<InvoiceDetail> {
  const { data } = await http.get<ShowInvoiceResponse>(`${INVOICES_PATH}/${id}`)

  return data.data as InvoiceDetail
}

/** Reintenta la transmisión SUNAT de un comprobante. */
export async function retryInvoice(id: number): Promise<RetryInvoiceResponse> {
  const { data } = await http.post<RetryInvoiceResponse>(`${INVOICES_PATH}/${id}/retry`)

  return data
}

/** Descarga autenticada de un artefacto (XML, PDF o CDR). */
export async function downloadInvoiceArtifact(id: number, type: DownloadType): Promise<Blob> {
  const { data } = await http.get<Blob>(`${INVOICES_PATH}/${id}/download/${type}`, {
    responseType: 'blob',
  })

  return data
}

/** Series configuradas por agencia y tipo de comprobante. */
export async function listInvoiceSeries(query: InvoiceSeriesQuery = {}): Promise<InvoiceSeries[]> {
  const { data } = await http.get<ListInvoiceSeriesResponse>(SERIES_PATH, { params: query })

  return (data.data ?? []) as InvoiceSeries[]
}

/** Crea una serie. */
export async function createInvoiceSeries(
  payload: CreateInvoiceSeriesPayload,
): Promise<CreateInvoiceSeriesResponse> {
  const { data } = await http.post<CreateInvoiceSeriesResponse>(SERIES_PATH, payload)

  return data
}

/** Actualiza una serie. */
export async function updateInvoiceSeries(
  id: number,
  payload: UpdateInvoiceSeriesPayload,
): Promise<UpdateInvoiceSeriesResponse> {
  const { data } = await http.put<UpdateInvoiceSeriesResponse>(`${SERIES_PATH}/${id}`, payload)

  return data
}
