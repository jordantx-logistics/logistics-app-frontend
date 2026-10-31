import { ref } from 'vue'
import { defineStore } from 'pinia'

import { useAsyncData } from '@/core/composables/useAsyncData'

import * as paymentsApi from '../api/payments.api'
import type {
  PaymentDetail,
  PaymentsQuery,
  RegisterPaymentPayload,
  VoidRequest,
} from '../types/payments.types'

/**
 * Estado del módulo **payments**.
 *
 * Cada listado se recarga del API después de una mutación; no se insertan
 * filas optimistas. El detalle y sus anulaciones se cargan por id.
 */
export const usePaymentsStore = defineStore('payments', () => {
  const PER_PAGE = 15

  const query = ref<PaymentsQuery>({ page: 1, per_page: PER_PAGE })
  const detailId = ref<number | null>(null)
  const saving = ref(false)

  const list = useAsyncData(() => paymentsApi.listPayments(query.value))
  const detail = useAsyncData<PaymentDetail>(() => paymentsApi.getPayment(detailId.value ?? 0))
  const voids = useAsyncData<VoidRequest[]>(() => paymentsApi.listPaymentVoids(detailId.value ?? 0))

  async function load(): Promise<void> {
    await list.load()
  }

  async function setQuery(next: PaymentsQuery): Promise<void> {
    query.value = { ...next, page: next.page ?? 1, per_page: next.per_page ?? PER_PAGE }
    await load()
  }

  async function loadDetail(id: number): Promise<void> {
    detailId.value = id
    await Promise.all([detail.load(), voids.load()])
  }

  async function register(payload: RegisterPaymentPayload): Promise<number> {
    saving.value = true

    try {
      const response = await paymentsApi.registerPayment(payload)
      await load()

      return Number(response.data.id)
    } finally {
      saving.value = false
    }
  }

  async function requestVoid(paymentId: number, reason: string): Promise<void> {
    saving.value = true

    try {
      await paymentsApi.requestVoid({ payment_id: paymentId, reason })
      await Promise.all([load(), detail.load(), voids.load()])
    } finally {
      saving.value = false
    }
  }

  return {
    query,
    detailId,
    saving,
    list,
    detail,
    voids,
    load,
    setQuery,
    loadDetail,
    register,
    requestVoid,
  }
})
