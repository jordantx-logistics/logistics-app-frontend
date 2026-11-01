<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'

import { ApiError } from '@/core/api/errors'
import AgencySelect from '@/core/components/AgencySelect.vue'
import AppShell from '@/core/components/AppShell.vue'
import Badge from '@/core/components/Badge.vue'
import Button from '@/core/components/Button.vue'
import Card from '@/core/components/Card.vue'
import DataTable from '@/core/components/DataTable.vue'
import FormField from '@/core/components/FormField.vue'
import ListState from '@/core/components/ListState.vue'
import type { Column } from '@/core/components/types'
import { useToast } from '@/core/composables/useToast'
import '@/core/styles/backoffice.css'
import { saveBlob } from '@/core/utils/download'
import { formatDate, localIsoDate } from '@/core/utils/format'

import * as reportsApi from '../api/reports.api'
import { useReportsStore } from '../stores/useReportsStore'
import type { ReportExport, RequestExportPayload } from '../types/reports.types'

/**
 * Reportes: la generación es asíncrona (cola `reports`). La pantalla pide la
 * exportación y consulta cada pocos segundos mientras haya alguna en curso.
 */

const POLL_MS = 3000

const FORMAT_LABELS: Record<string, string> = { csv: 'CSV', xlsx: 'Excel', pdf: 'PDF' }

const ERROR_LABELS: Record<string, string> = {
  REPORT_TOO_LARGE_FOR_PDF: 'Too many rows for a PDF. Use CSV or Excel.',
}

const STATUS_VARIANTS: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
  pending: 'warning',
  processing: 'info',
  ready: 'success',
  failed: 'danger',
}

const store = useReportsStore()
const toast = useToast()

const form = reactive({
  report: '',
  format: 'csv',
  from: localIsoDate(-30),
  to: localIsoDate(),
  agency_id: '',
  status: '',
})

const saving = ref(false)
const error = ref<ApiError | null>(null)
let timer: ReturnType<typeof setInterval> | null = null

const definitions = computed(() => store.catalog.data ?? [])
const definition = computed(() => definitions.value.find((row) => row.key === form.report))
const statuses = computed(() => definition.value?.statuses ?? [])
const rows = computed(() => store.exports.data ?? [])

const COLUMNS: Column[] = [
  { key: 'report', label: 'Report' },
  { key: 'format', label: 'Format' },
  { key: 'period', label: 'Period' },
  { key: 'status', label: 'Status' },
  { key: 'row_count', label: 'Rows' },
  { key: 'expires_at', label: 'Available until' },
  { key: 'actions', label: '' },
]

function title(key: unknown): string {
  return definitions.value.find((row) => row.key === key)?.title ?? String(key)
}

function failureText(row: { error_code?: unknown }): string {
  return ERROR_LABELS[String(row.error_code)] ?? 'The report could not be generated.'
}

async function submit(): Promise<void> {
  saving.value = true
  error.value = null

  try {
    await reportsApi.requestExport({
      report: form.report,
      format: form.format,
      from: form.from,
      to: form.to,
      agency_id: form.agency_id === '' ? null : Number(form.agency_id),
      status: form.status === '' ? null : form.status,
    } as RequestExportPayload)
    toast.success('Report requested', 'It will appear ready here in a moment.')
    await store.refreshExports()
  } catch (caught) {
    error.value = caught instanceof ApiError ? caught : null
    toast.error('Could not request the report', error.value?.message)
  } finally {
    saving.value = false
  }
}

async function download(row: ReportExport): Promise<void> {
  try {
    saveBlob(
      await reportsApi.downloadExport(Number(row.id)),
      `${row.report}-${row.id}.${row.format}`,
    )
  } catch (caught) {
    toast.error('Could not download the report', caught instanceof ApiError ? caught.message : '')
  }
}

function stopPolling(): void {
  if (timer !== null) {
    clearInterval(timer)
    timer = null
  }
}

watch(
  () => store.hasRunning,
  (running) => {
    if (running && timer === null) {
      timer = setInterval(() => void store.refreshExports(), POLL_MS)
    } else if (!running) {
      stopPolling()
    }
  },
  { immediate: true },
)

// Cambiar de reporte invalida el estado elegido: cada uno admite los suyos.
watch(
  () => form.report,
  () => {
    form.status = ''
  },
)

watch(definitions, (loaded) => {
  if (form.report === '' && loaded[0]) {
    form.report = String(loaded[0].key)
  }
})

onMounted(() => {
  void store.catalog.load()
  void store.exports.load()
})

onBeforeUnmount(stopPolling)
</script>

<template>
  <AppShell>
    <div class="bo-page">
      <div class="bo-header">
        <div>
          <h1 class="bo-title">Reports</h1>
          <p class="bo-subtitle">Generated in the background and kept for 7 days</p>
        </div>
      </div>

      <Card title="New report">
        <ListState
          :status="store.catalog.status"
          :error="store.catalog.error"
          :empty="definitions.length === 0"
          empty-text="No reports available."
          @retry="store.catalog.load"
        >
          <form class="bo-form" @submit.prevent="submit">
            <div class="bo-grid">
              <FormField label="Report" :error="error?.fieldError('report')">
                <select v-model="form.report" class="bo-control" aria-label="Report">
                  <option v-for="row in definitions" :key="row.key" :value="row.key">
                    {{ row.title }}
                  </option>
                </select>
              </FormField>
              <FormField label="Format" :error="error?.fieldError('format')">
                <select v-model="form.format" class="bo-control" aria-label="Format">
                  <option v-for="(label, value) in FORMAT_LABELS" :key="value" :value="value">
                    {{ label }}
                  </option>
                </select>
              </FormField>
            </div>

            <div class="bo-grid">
              <FormField label="From" :error="error?.fieldError('from')">
                <input v-model="form.from" class="bo-control" type="date" aria-label="From" />
              </FormField>
              <FormField label="To" :error="error?.fieldError('to')">
                <input v-model="form.to" class="bo-control" type="date" aria-label="To" />
              </FormField>
            </div>

            <div class="bo-grid">
              <FormField label="Agency" :error="error?.fieldError('agency_id')">
                <AgencySelect
                  v-model="form.agency_id"
                  placeholder="All agencies in my scope"
                  aria-label="Agency"
                />
              </FormField>
              <FormField v-if="statuses.length > 0" label="Status">
                <select v-model="form.status" class="bo-control" aria-label="Status">
                  <option value="">All statuses</option>
                  <option v-for="status in statuses" :key="status" :value="status">
                    {{ status }}
                  </option>
                </select>
              </FormField>
            </div>

            <p v-if="error && !error.isValidationError" class="bo-form-error">
              {{ error.message }}
            </p>

            <div class="bo-form-actions">
              <Button type="submit" :loading="saving">Generate report</Button>
            </div>
          </form>
        </ListState>
      </Card>

      <Card title="My reports">
        <ListState
          :status="store.exports.status"
          :error="store.exports.error"
          :empty="rows.length === 0"
          empty-text="You have not requested any report yet."
          @retry="store.exports.load"
        >
          <DataTable :columns="COLUMNS" :data="rows">
            <template #report="{ row }">{{ title(row.report) }}</template>
            <template #format="{ row }">{{ FORMAT_LABELS[String(row.format)] }}</template>
            <template #period="{ row }">
              {{ (row.filters as { from?: string })?.from }} →
              {{ (row.filters as { to?: string })?.to }}
            </template>
            <template #status="{ row }">
              <Badge
                :variant="STATUS_VARIANTS[String(row.status)] ?? 'info'"
                :title="row.status === 'failed' ? failureText(row) : undefined"
              >
                {{ row.status }}
              </Badge>
              <p v-if="row.status === 'failed'" class="bo-form-error">{{ failureText(row) }}</p>
            </template>
            <template #expires_at="{ row }">{{ formatDate(row.expires_at) }}</template>
            <template #actions="{ row }">
              <button
                class="bo-link"
                :disabled="row.status !== 'ready'"
                @click="download(row as ReportExport)"
              >
                Download
              </button>
            </template>
          </DataTable>
        </ListState>
      </Card>
    </div>
  </AppShell>
</template>
