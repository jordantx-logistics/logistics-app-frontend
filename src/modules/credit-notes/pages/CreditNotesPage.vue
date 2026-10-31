<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { FilePlus2 } from 'lucide-vue-next'

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
import FormField from '@/core/components/FormField.vue'
import ListState from '@/core/components/ListState.vue'
import Modal from '@/core/components/Modal.vue'
import Pagination from '@/core/components/Pagination.vue'
import Textarea from '@/core/components/Textarea.vue'
import type { Column } from '@/core/components/types'

import * as creditNotesApi from '../api/credit-notes.api'
import IssueCreditNoteForm from '../components/IssueCreditNoteForm.vue'
import { useCreditNotesStore } from '../stores/useCreditNotesStore'
import type { CreditNote, DownloadType, VoidRequest } from '../types/credit-notes.types'

/** Notas de crédito emitidas y aprobación de anulaciones. */

const route = useRoute()
const store = useCreditNotesStore()
const toast = useToast()
const { can } = useAuth()

const issueModal = ref(false)
const rejectModal = ref(false)
const selectedVoid = ref<VoidRequest | null>(null)
const rejectReason = ref('')
const rejectError = ref<ApiError | null>(null)
const notesStatus = ref('')
const voidsStatus = ref('requested')

const notes = computed(() => store.notes.data?.rows ?? [])
const notesMeta = computed(() => store.notes.data?.meta)
const voids = computed(() => store.voids.data?.rows ?? [])
const voidsMeta = computed(() => store.voids.data?.meta)

const initialPaymentId = computed(() => {
  const raw = route.query.payment_id
  return typeof raw === 'string' ? Number(raw) : 0
})

const NOTE_COLUMNS: Column[] = [
  { key: 'ticket_number', label: 'Credit note' },
  { key: 'payment_id', label: 'Payment' },
  { key: 'amount', label: 'Amount' },
  { key: 'reason', label: 'Reason' },
  { key: 'status', label: 'Status' },
  { key: 'issued_at', label: 'Issued' },
  { key: 'actions', label: '' },
]

const VOID_COLUMNS: Column[] = [
  { key: 'id', label: 'Request' },
  { key: 'payment_id', label: 'Payment' },
  { key: 'reason', label: 'Reason' },
  { key: 'requested_at', label: 'Requested' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: '' },
]

const STATUS_VARIANTS: Record<string, 'success' | 'warning' | 'danger' | 'neutral'> = {
  issued: 'warning',
  sent: 'warning',
  accepted: 'success',
  rejected: 'danger',
  voided: 'neutral',
  requested: 'warning',
  approved: 'danger',
}

const REASON_LABELS: Record<string, string> = {
  '01': 'Cancellation',
  '02': 'Price adjustment',
  '03': 'Commercial discount',
  '06': 'Return',
  '07': 'Other',
}

function money(value: unknown): string {
  const numeric = Number(value)

  return Number.isFinite(numeric) ? `S/ ${numeric.toFixed(2)}` : formatText(value)
}

function filterNotes(status: string): void {
  notesStatus.value = status
  void store.setNotesQuery({ status: status === '' ? undefined : status, page: 1 })
}

function filterVoids(status: string): void {
  voidsStatus.value = status
  void store.setVoidsQuery({ status: status === '' ? undefined : status, page: 1 })
}

function notePage(next: number): void {
  void store.setNotesQuery({ page: next })
}

function voidPage(next: number): void {
  void store.setVoidsQuery({ page: next })
}

async function download(row: CreditNote, type: DownloadType): Promise<void> {
  try {
    const blob = await creditNotesApi.downloadCreditNoteArtifact(row.id, type)
    saveBlob(blob, `credit-note-${row.id}.${type}`)
  } catch (caught) {
    const error = caught instanceof ApiError ? caught : null
    toast.error('Could not download the file', error?.message)
  }
}

function openReject(row: VoidRequest): void {
  selectedVoid.value = row
  rejectReason.value = ''
  rejectError.value = null
  rejectModal.value = true
}

async function approve(row: VoidRequest): Promise<void> {
  try {
    await store.approveVoid(row.id)
    toast.success('Void approved', 'The payment was voided and its invoice updated.')
  } catch (caught) {
    const error = caught instanceof ApiError ? caught : null
    toast.error('Could not approve the void', error?.message)
  }
}

async function reject(): Promise<void> {
  if (!selectedVoid.value) return

  rejectError.value = null

  try {
    await store.rejectVoid(selectedVoid.value.id, rejectReason.value.trim())
    toast.success('Void rejected', 'The payment remains registered.')
    rejectModal.value = false
  } catch (caught) {
    rejectError.value = caught instanceof ApiError ? caught : null
    toast.error('Could not reject the void', rejectError.value?.message)
  }
}

function onIssued(): void {
  issueModal.value = false
  void store.loadAll()
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
          <h1 class="page-title">Credit notes</h1>
          <p class="page-subtitle">Refunds, adjustments and void approvals</p>
        </div>
        <Button v-if="can('credit-notes.issue')" @click="issueModal = true">
          <template #leading><FilePlus2 :size="16" /></template>
          Issue credit note
        </Button>
      </div>

      <Card title="Issued credit notes">
        <template #actions>
          <select
            class="status-filter"
            @change="filterNotes(($event.target as HTMLSelectElement).value)"
          >
            <option value="">All statuses</option>
            <option value="issued">Issued</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </template>

        <ListState
          :status="store.notes.status"
          :error="store.notes.error"
          :empty="notes.length === 0"
          empty-text="No credit notes have been issued."
          @retry="store.notes.load"
        >
          <DataTable :columns="NOTE_COLUMNS" :data="notes">
            <template #ticket_number="{ row }">
              <span class="mono">{{ formatText(row.ticket_number) }}</span>
            </template>
            <template #payment_id="{ row }">#{{ formatText(row.payment_id) }}</template>
            <template #amount="{ row }">{{ money(row.amount) }}</template>
            <template #reason="{ row }">
              {{ REASON_LABELS[String(row.reason)] ?? formatText(row.reason) }}
            </template>
            <template #status="{ row }">
              <Badge :variant="STATUS_VARIANTS[String(row.status)] ?? 'neutral'">
                {{ formatText(row.status) }}
              </Badge>
            </template>
            <template #issued_at="{ row }">{{ formatDate(row.issued_at) }}</template>
            <template #actions="{ row }">
              <div class="row-actions">
                <button
                  v-if="(row as CreditNote).downloads?.xml"
                  class="link-button"
                  @click="download(row as CreditNote, 'xml')"
                >
                  XML
                </button>
                <button
                  v-if="(row as CreditNote).downloads?.pdf"
                  class="link-button"
                  @click="download(row as CreditNote, 'pdf')"
                >
                  PDF
                </button>
                <button
                  v-if="(row as CreditNote).downloads?.cdr"
                  class="link-button"
                  @click="download(row as CreditNote, 'cdr')"
                >
                  CDR
                </button>
              </div>
            </template>
          </DataTable>

          <Pagination
            :page="store.notes.data?.meta.current_page ?? 1"
            :last-page="notesMeta?.last_page ?? 1"
            :total="notesMeta?.total ?? notes.length"
            :per-page="notesMeta?.per_page ?? 15"
            @update:page="notePage"
          />
        </ListState>
      </Card>

      <Card title="Void requests">
        <template #actions>
          <select
            class="status-filter"
            @change="filterVoids(($event.target as HTMLSelectElement).value)"
          >
            <option value="requested">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="">All requests</option>
          </select>
        </template>

        <ListState
          :status="store.voids.status"
          :error="store.voids.error"
          :empty="voids.length === 0"
          empty-text="No void requests match this filter."
          @retry="store.voids.load"
        >
          <DataTable :columns="VOID_COLUMNS" :data="voids">
            <template #id="{ row }">#{{ row.id }}</template>
            <template #payment_id="{ row }">#{{ formatText(row.payment_id) }}</template>
            <template #reason="{ row }">{{ formatText(row.reason) }}</template>
            <template #requested_at="{ row }">{{ formatDate(row.requested_at) }}</template>
            <template #status="{ row }">
              <Badge :variant="STATUS_VARIANTS[String(row.status)] ?? 'neutral'">
                {{ formatText(row.status) }}
              </Badge>
            </template>
            <template #actions="{ row }">
              <div class="row-actions">
                <template v-if="row.status === 'requested' && can('voids.approve')">
                  <button class="link-button" @click="approve(row as VoidRequest)">Approve</button>
                  <button class="link-button danger" @click="openReject(row as VoidRequest)">
                    Reject
                  </button>
                </template>
                <span v-else class="muted">—</span>
              </div>
            </template>
          </DataTable>

          <Pagination
            :page="store.voids.data?.meta.current_page ?? 1"
            :last-page="voidsMeta?.last_page ?? 1"
            :total="voidsMeta?.total ?? voids.length"
            :per-page="voidsMeta?.per_page ?? 15"
            @update:page="voidPage"
          />
        </ListState>
      </Card>
    </div>

    <Modal :visible="issueModal" title="Issue credit note" @close="issueModal = false">
      <IssueCreditNoteForm
        :initial-payment-id="initialPaymentId"
        @issued="onIssued"
        @cancel="issueModal = false"
      />
    </Modal>

    <Modal :visible="rejectModal" title="Reject void" @close="rejectModal = false">
      <form class="form" @submit.prevent="reject">
        <p class="hint">The payment stays registered and the request is closed.</p>
        <FormField label="Reason" :error="rejectError?.fieldError('reason')">
          <Textarea v-model="rejectReason" placeholder="The customer confirmed the charge." />
        </FormField>
        <p v-if="rejectError && !rejectError.isValidationError" class="form-error">
          {{ rejectError.message }}
        </p>
        <div class="actions">
          <Button variant="secondary" type="button" @click="rejectModal = false">Cancel</Button>
          <Button type="submit" :loading="store.saving" :disabled="rejectReason.trim() === ''">
            Reject void
          </Button>
        </div>
      </form>
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

.status-filter {
  padding: 7px 10px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  color: var(--fg);
  font-size: 12px;
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

.link-button.danger {
  color: var(--danger);
}

.muted {
  color: var(--muted);
}

.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.hint {
  font-size: 13px;
  line-height: 1.5;
  color: var(--muted);
}

.form-error {
  font-size: 12px;
  color: var(--danger);
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
