import type { QueryOf, RequestOf, ResponseOf } from '@/core/api/types'

/**
 * Tipos del módulo **invoices**, derivados del contrato OpenAPI (ADR-0008).
 *
 * Incluye comprobantes, series y sus descargas autenticadas.
 */

/** `GET /api/v1/finance/invoices`. */
export type ListInvoicesResponse = ResponseOf<'/api/v1/finance/invoices', 'get'>

/** Fila del listado de comprobantes. */
export type Invoice = Required<NonNullable<ListInvoicesResponse['data']>[number]>

export type InvoicesQuery = NonNullable<QueryOf<'/api/v1/finance/invoices', 'get'>> & {
  page?: number
}

/** `GET /api/v1/finance/invoices/{invoice}`. */
export type ShowInvoiceResponse = ResponseOf<'/api/v1/finance/invoices/{invoice}', 'get'>

export type InvoiceDetail = Required<ShowInvoiceResponse['data']>

/** `POST /api/v1/finance/invoices/{invoice}/retry`. */
export type RetryInvoiceResponse = ResponseOf<'/api/v1/finance/invoices/{invoice}/retry', 'post'>

/** `GET /api/v1/finance/invoice-series`. */
export type ListInvoiceSeriesResponse = ResponseOf<'/api/v1/finance/invoice-series', 'get'>

export type InvoiceSeries = Required<NonNullable<ListInvoiceSeriesResponse['data']>[number]>

export type InvoiceSeriesQuery = NonNullable<QueryOf<'/api/v1/finance/invoice-series', 'get'>>

/** `POST /api/v1/finance/invoice-series`. */
export type CreateInvoiceSeriesPayload = RequestOf<'/api/v1/finance/invoice-series', 'post'>

export type CreateInvoiceSeriesResponse = ResponseOf<'/api/v1/finance/invoice-series', 'post'>

/**
 * `PUT /api/v1/finance/invoice-series/{series}`.
 *
 * Scribe marca el cuerpo del PUT como opcional (todos los campos son
 * `sometimes`), así que `RequestOf` no puede extraerlo; el contrato de
 * actualización es el mismo del alta con todos los campos opcionales.
 */
export type UpdateInvoiceSeriesPayload = Partial<CreateInvoiceSeriesPayload>

export type UpdateInvoiceSeriesResponse = ResponseOf<
  '/api/v1/finance/invoice-series/{series}',
  'put'
>

export type InvoiceStatus = 'pending' | 'sent' | 'accepted' | 'rejected' | 'voided'

export type DownloadType = 'xml' | 'pdf' | 'cdr'
