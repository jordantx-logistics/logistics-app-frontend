import { http } from '@/core/api/client'
import { API_BASE_PATH } from '@/core/api/config'

import type {
  ListPaymentsResponse,
  ListVoidsResponse,
  PageMeta,
  Payment,
  PaymentDetail,
  PaymentsQuery,
  RegisterPaymentPayload,
  RegisterPaymentResponse,
  RequestVoidPayload,
  RequestVoidResponse,
  ShowPaymentResponse,
  VoidRequest,
  VoidsQuery,
} from '../types/payments.types'

/** Cobros y solicitudes de anulación (`src/Finance/Payment`). */

const PAYMENTS_PATH = `${API_BASE_PATH}/finance/payments`
const VOIDS_PATH = `${API_BASE_PATH}/finance/voids`

export interface PaymentPage {
  rows: Payment[]
  meta: PageMeta
}

/** Listado paginado de pagos. */
export async function listPayments(query: PaymentsQuery = {}): Promise<PaymentPage> {
  const { data } = await http.get<ListPaymentsResponse>(PAYMENTS_PATH, { params: query })

  return {
    rows: (data.data ?? []) as Payment[],
    meta: data.meta as PageMeta,
  }
}

/** Registra un cobro total o parcial. */
export async function registerPayment(
  payload: RegisterPaymentPayload,
): Promise<RegisterPaymentResponse> {
  const { data } = await http.post<RegisterPaymentResponse>(PAYMENTS_PATH, payload)

  return data
}

/** Detalle de un pago. */
export async function getPayment(id: number): Promise<PaymentDetail> {
  const { data } = await http.get<ShowPaymentResponse>(`${PAYMENTS_PATH}/${id}`)

  return data.data as PaymentDetail
}

/** Solicita la anulación de un pago. */
export async function requestVoid(payload: RequestVoidPayload): Promise<RequestVoidResponse> {
  const { data } = await http.post<RequestVoidResponse>(VOIDS_PATH, payload)

  return data
}

/** Anulaciones asociadas a un pago. */
export async function listPaymentVoids(paymentId: number): Promise<VoidRequest[]> {
  const query: VoidsQuery = { payment_id: paymentId, per_page: 50 }
  const { data } = await http.get<ListVoidsResponse>(VOIDS_PATH, { params: query })

  return (data.data ?? []) as VoidRequest[]
}
