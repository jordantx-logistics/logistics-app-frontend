import { ref } from 'vue'
import { defineStore } from 'pinia'

import { useAsyncData } from '@/core/composables/useAsyncData'

import * as invoicesApi from '../api/invoices.api'
import type {
  CreateInvoiceSeriesPayload,
  InvoicesQuery,
  InvoiceSeriesQuery,
  UpdateInvoiceSeriesPayload,
} from '../types/invoices.types'

/**
 * Estado del módulo **invoices**.
 *
 * El listado y las series se recargan desde el API tras reintentar una
 * transmisión o modificar la configuración fiscal.
 */
export const useInvoicesStore = defineStore('invoices', () => {
  const PER_PAGE = 15

  const query = ref<InvoicesQuery>({ page: 1, per_page: PER_PAGE })
  const seriesQuery = ref<InvoiceSeriesQuery>({})
  const saving = ref(false)

  const list = useAsyncData(() => invoicesApi.listInvoices(query.value))
  const series = useAsyncData(() => invoicesApi.listInvoiceSeries(seriesQuery.value))

  async function loadAll(): Promise<void> {
    await Promise.all([list.load(), series.load()])
  }

  async function setQuery(next: InvoicesQuery): Promise<void> {
    query.value = { ...next, page: next.page ?? 1, per_page: next.per_page ?? PER_PAGE }
    await list.load()
  }

  async function retry(id: number): Promise<void> {
    saving.value = true

    try {
      await invoicesApi.retryInvoice(id)
      await list.load()
    } finally {
      saving.value = false
    }
  }

  async function createSeries(payload: CreateInvoiceSeriesPayload): Promise<void> {
    saving.value = true

    try {
      await invoicesApi.createInvoiceSeries(payload)
      await series.load()
    } finally {
      saving.value = false
    }
  }

  async function updateSeries(id: number, payload: UpdateInvoiceSeriesPayload): Promise<void> {
    saving.value = true

    try {
      await invoicesApi.updateInvoiceSeries(id, payload)
      await series.load()
    } finally {
      saving.value = false
    }
  }

  return {
    saving,
    list,
    series,
    loadAll,
    setQuery,
    retry,
    createSeries,
    updateSeries,
  }
})
