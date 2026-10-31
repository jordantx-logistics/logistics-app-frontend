<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { FileCog, Plus, RefreshCw } from 'lucide-vue-next'

import { ApiError } from '@/core/api/errors'
import { useAuth } from '@/core/composables/useAuth'
import { useToast } from '@/core/composables/useToast'
import { saveBlob } from '@/core/utils/download'
import { formatDate, formatText } from '@/core/utils/format'
import AppShell from '@/core/components/AppShell.vue'
import Badge from '@/core/components/Badge.vue'
import Button from '@/core/components/Button.vue'
import Card from '@/core/components/Card.vue'
import DataTable from '@/core/components/DataTable.vue'
import ListState from '@/core/components/ListState.vue'
import Modal from '@/core/components/Modal.vue'
import Pagination from '@/core/components/Pagination.vue'
import type { Column } from '@/core/components/types'

import * as invoicesApi from '../api/invoices.api'
import InvoiceSeriesForm from '../components/InvoiceSeriesForm.vue'
import { useInvoicesStore } from '../stores/useInvoicesStore'
import type { DownloadType, Invoice, InvoiceSeries } from '../types/invoices.types'

/** Comprobantes electrónicos, reintentos SUNAT y series por agencia. */

const store = useInvoicesStore()
const toast = useToast()
const { can } = useAuth()

const seriesModal = ref(false)
const editingSeries = ref<InvoiceSeries | null>(null)
const status = ref('')
const documentType = ref('')
const ticket = ref('')

const invoices = computed(() => store.list.data?.rows ?? [])
const meta = computed(() => store.list.data?.meta)
const series = computed(() => store.series.data ?? [])

const INVOICE_COLUMNS: Column[] = [
  { key: 'ticket_number', label: 'Invoice' },
  { key: 'order_id', label: 'Order' },
  { key: 'customer_name', label: 'Customer' },
  { key: 'total', label: 'Total' },
  { key: 'status', label: 'SUNAT' },
  { key: 'issued_at', label: 'Issued' },
  { key: 'actions', label: '' },
]

const SERIES_COLUMNS: Column[] = [
  { key: 'agency_id', label: 'Agency' },
  { key: 'document_type', label: 'Document' },
  { key: 'series', label: 'Series' },
  { key: 'next_number', label: 'Next' },
  { key: 'is_default', label: 'Default' },
  { key: 'actions', label: '' },
]

const STATUS_VARIANTS: Record<string, 'success' | 'warning' | 'danger' | 'neutral'> = {
  pending: 'warning',
  sent: 'warning',
  accepted: 'success',
  rejected: 'danger',
  voided: 'neutral',
}

function money(value: unknown): string {
  const numeric = Number(value)

  return Number.isFinite(numeric) ? `S/ ${numeric.toFixed(2)}` : formatText(value)
}

function applyFilters(): void {
  void store.setQuery({
    page: 1,
    status: status.value === '' ? undefined : status.value,
    document_type: documentType.value === '' ? undefined : documentType.value,
    ticket_number: ticket.value.trim() === '' ? undefined : ticket.value.trim().toUpperCase(),
  })
}

function resetFilters(): void {
  status.value = ''
  documentType.value = ''
  ticket.value = ''
  void store.setQuery({ page: 1 })
}

function goToPage(next: number): void {
  void store.setQuery({ page: next })
}

function openCreateSeries(): void {
  editingSeries.value = null
  seriesModal.value = true
}

function openEditSeries(row: InvoiceSeries): void {
  editingSeries.value = row
  seriesModal.value = true
}

async function download(row: Invoice, type: DownloadType): Promise<void> {
  try {
    const blob = await invoicesApi.downloadInvoiceArtifact(row.id, type)
    saveBlob(blob, `invoice-${row.id}.${type}`)
  } catch (caught) {
    const error = caught instanceof ApiError ? caught : null
    toast.error('Could not download the file', error?.message)
  }
}

async function retry(row: Invoice): Promise<void> {
  try {
    await store.retry(row.id)
    toast.success('SUNAT retry queued', 'The invoice status will update when the job finishes.')
  } catch (caught) {
    const error = caught instanceof ApiError ? caught : null
    toast.error('Could not retry the transmission', error?.message)
  }
}

function onSeriesSaved(): void {
  seriesModal.value = false
  editingSeries.value = null
}

onMounted(() => {
  void store.loadAll()
})
</script>

<template>
  <AppShell>
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Invoices</h1>
          <p class="page-subtitle">Electronic receipts, SUNAT status and fiscal series</p>
        </div>
        <Button v-if="can('invoices.series')" variant="secondary" @click="openCreateSeries">
          <template #leading><Plus :size="16" /></template>
          New series
        </Button>
      </div>

      <Card>
        <form class="filters" @submit.prevent="applyFilters">
          <label class="filter">
            <span>Status</span>
            <select v-model="status">
              <option value="">All statuses</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="voided">Voided</option>
            </select>
          </label>

          <label class="filter">
            <span>Document</span>
            <select v-model="documentType">
              <option value="">All documents</option>
              <option value="boleta">Boleta</option>
              <option value="factura">Factura</option>
            </select>
          </label>

          <label class="filter">
            <span>Ticket</span>
            <input v-model="ticket" placeholder="001-000001" />
          </label>

          <div class="filter-actions">
            <button type="button" class="link-button" @click="resetFilters">Clear</button>
            <button type="submit" class="apply-button">Apply</button>
          </div>
        </form>
      </Card>

      <Card title="Receipts">
        <ListState
          :status="store.list.status"
          :error="store.list.error"
          :empty="invoices.length === 0"
          empty-text="No invoices match these filters."
          @retry="store.list.load"
        >
          <DataTable :columns="INVOICE_COLUMNS" :data="invoices">
            <template #ticket_number="{ row }">
              <span class="mono">{{ formatText(row.ticket_number) }}</span>
            </template>
            <template #order_id="{ row }">#{{ formatText(row.order_id) }}</template>
            <template #customer_name="{ row }">
              <div class="customer">
                <span>{{ formatText(row.customer_name) }}</span>
                <span class="customer-doc">{{ formatText(row.customer_document_number) }}</span>
              </div>
            </template>
            <template #total="{ row }">{{ money(row.total) }}</template>
            <template #status="{ row }">
              <Badge :variant="STATUS_VARIANTS[String(row.status)] ?? 'neutral'">
                {{ formatText(row.status) }}
              </Badge>
            </template>
            <template #issued_at="{ row }">{{ formatDate(row.issued_at) }}</template>
            <template #actions="{ row }">
              <div class="row-actions">
                <button
                  v-if="(row as Invoice).downloads?.xml"
                  class="link-button"
                  @click="download(row as Invoice, 'xml')"
                >
                  XML
                </button>
                <button
                  v-if="(row as Invoice).downloads?.pdf"
                  class="link-button"
                  @click="download(row as Invoice, 'pdf')"
                >
                  PDF
                </button>
                <button
                  v-if="(row as Invoice).downloads?.cdr"
                  class="link-button"
                  @click="download(row as Invoice, 'cdr')"
                >
                  CDR
                </button>
                <button
                  v-if="can('invoices.retry') && row.status === 'rejected'"
                  class="link-button"
                  @click="retry(row as Invoice)"
                >
                  <RefreshCw :size="13" />
                  Retry
                </button>
              </div>
            </template>
          </DataTable>

          <Pagination
            :page="store.list.data?.meta.current_page ?? 1"
            :last-page="meta?.last_page ?? 1"
            :total="meta?.total ?? invoices.length"
            :per-page="meta?.per_page ?? 15"
            @update:page="goToPage"
          />
        </ListState>
      </Card>

      <Card title="Invoice series">
        <ListState
          :status="store.series.status"
          :error="store.series.error"
          :empty="series.length === 0"
          empty-text="No invoice series configured. Payments will fail until one exists."
          @retry="store.series.load"
        >
          <DataTable :columns="SERIES_COLUMNS" :data="series">
            <template #agency_id="{ row }">#{{ row.agency_id }}</template>
            <template #document_type="{ row }">{{ formatText(row.document_type) }}</template>
            <template #series="{ row }">
              <span class="mono">{{ formatText(row.series) }}</span>
            </template>
            <template #next_number="{ row }">{{ row.next_number }}</template>
            <template #is_default="{ row }">
              <Badge :variant="row.is_default ? 'success' : 'neutral'">
                {{ row.is_default ? 'Default' : 'No' }}
              </Badge>
            </template>
            <template #actions="{ row }">
              <button
                v-if="can('invoices.series')"
                class="link-button"
                @click="openEditSeries(row as InvoiceSeries)"
              >
                <FileCog :size="14" />
                Edit
              </button>
            </template>
          </DataTable>
        </ListState>
      </Card>
    </div>

    <Modal
      :visible="seriesModal"
      :title="editingSeries ? 'Edit invoice series' : 'New invoice series'"
      @close="seriesModal = false"
    >
      <InvoiceSeriesForm
        :series="editingSeries ?? undefined"
        @saved="onSeriesSaved"
        @cancel="seriesModal = false"
      />
    </Modal>
  </AppShell>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.page-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--fg);
}

.page-subtitle {
  margin-top: 2px;
  font-size: 13px;
  color: var(--muted);
}

.filters {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  flex-wrap: wrap;
}

.filter {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--fg-secondary);
}

.filter select,
.filter input {
  min-width: 150px;
  padding: 8px 10px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  color: var(--fg);
  font-size: 13px;
}

.filter-actions {
  display: flex;
  gap: 8px;
  margin-left: auto;
}

.apply-button {
  padding: 8px 14px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: #6366f1;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.row-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.link-button {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 6px;
  border: none;
  background: none;
  color: #6366f1;
  font-size: 12px;
  cursor: pointer;
}

.customer {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.customer-doc {
  font-size: 11px;
  color: var(--muted);
}

.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12px;
}
</style>
