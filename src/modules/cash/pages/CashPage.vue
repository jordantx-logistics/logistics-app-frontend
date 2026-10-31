<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ArrowDownToLine, LockKeyhole, Plus, UnlockKeyhole, Wallet } from 'lucide-vue-next'

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

import * as cashApi from '../api/cash.api'
import CashMovementForm from '../components/CashMovementForm.vue'
import CloseCashSessionForm from '../components/CloseCashSessionForm.vue'
import OpenCashSessionForm from '../components/OpenCashSessionForm.vue'
import { useCashStore } from '../stores/useCashStore'
import type { CashClosureRow } from '../types/cash.types'

/** Caja diaria: sesión abierta, movimientos, historial y cierres. */

const store = useCashStore()
const toast = useToast()
const { can } = useAuth()

const openModal = ref(false)
const moveModal = ref(false)
const closeModal = ref(false)
const rejectModal = ref(false)
const selectedClosure = ref<CashClosureRow | null>(null)
const rejectReason = ref('')
const rejectError = ref<ApiError | null>(null)

const session = computed(() => store.current.data)
const movements = computed(() => session.value?.movements ?? [])
const sessionRows = computed(() => store.sessions.data?.rows ?? [])
const closureRows = computed(() => store.closures.data?.rows ?? [])
const sessionsMeta = computed(() => store.sessions.data?.meta)
const closuresMeta = computed(() => store.closures.data?.meta)

const MOVEMENT_COLUMNS: Column[] = [
  { key: 'type', label: 'Type' },
  { key: 'amount', label: 'Amount' },
  { key: 'note', label: 'Note' },
  { key: 'created_at', label: 'Registered' },
]

const SESSION_COLUMNS: Column[] = [
  { key: 'id', label: 'Session' },
  { key: 'agency_id', label: 'Agency' },
  { key: 'opened_at', label: 'Opened' },
  { key: 'opening_amount', label: 'Opening' },
  { key: 'expected_amount', label: 'Expected' },
  { key: 'status', label: 'Status' },
  { key: 'closed_at', label: 'Closed' },
]

const CLOSURE_COLUMNS: Column[] = [
  { key: 'id', label: 'Closure' },
  { key: 'requested_at', label: 'Requested' },
  { key: 'expected_amount', label: 'Expected' },
  { key: 'closing_amount', label: 'Counted' },
  { key: 'difference', label: 'Difference' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: '' },
]

const STATUS_VARIANTS: Record<string, 'success' | 'warning' | 'danger' | 'neutral'> = {
  open: 'success',
  closed: 'neutral',
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
}

function money(value: unknown): string {
  const numeric = Number(value)

  return Number.isFinite(numeric) ? `S/ ${numeric.toFixed(2)}` : formatText(value)
}

function onSessionChanged(): void {
  openModal.value = false
  moveModal.value = false
  closeModal.value = false
  void store.loadAll()
}

function openReject(row: CashClosureRow): void {
  selectedClosure.value = row
  rejectReason.value = ''
  rejectError.value = null
  rejectModal.value = true
}

async function approve(row: CashClosureRow): Promise<void> {
  try {
    await store.approve(row.id)
    toast.success('Closure approved', 'The cash session was closed.')
  } catch (caught) {
    const error = caught instanceof ApiError ? caught : null
    toast.error('Could not approve the closure', error?.message)
  }
}

async function reject(): Promise<void> {
  if (!selectedClosure.value) return

  rejectError.value = null

  try {
    await store.reject(selectedClosure.value.id, rejectReason.value.trim())
    toast.success('Closure rejected', 'The cashier can close the session again.')
    rejectModal.value = false
  } catch (caught) {
    rejectError.value = caught instanceof ApiError ? caught : null
    toast.error('Could not reject the closure', rejectError.value?.message)
  }
}

async function downloadReport(row: CashClosureRow): Promise<void> {
  try {
    const blob = await cashApi.downloadCashClosureReport(row.id)
    saveBlob(blob, `cash-closure-${row.id}.pdf`)
  } catch (caught) {
    const error = caught instanceof ApiError ? caught : null
    toast.error('Could not download the report', error?.message)
  }
}

function filterClosures(status: string): void {
  void store.setClosuresQuery({ status: status === '' ? undefined : status, page: 1 })
}

function sessionPage(next: number): void {
  void store.setSessionsQuery({ page: next })
}

function closurePage(next: number): void {
  void store.setClosuresQuery({ page: next })
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
          <h1 class="page-title">Cash</h1>
          <p class="page-subtitle">Daily cash sessions, movements and closing approvals</p>
        </div>

        <div class="header-actions">
          <Button v-if="!session && can('cash.open')" @click="openModal = true">
            <template #leading><UnlockKeyhole :size="16" /></template>
            Open session
          </Button>

          <template v-if="session">
            <Button v-if="can('payments.create')" variant="secondary" @click="moveModal = true">
              <template #leading><Plus :size="16" /></template>
              Movement
            </Button>
            <Button v-if="can('cash.close')" variant="secondary" @click="closeModal = true">
              <template #leading><LockKeyhole :size="16" /></template>
              Close session
            </Button>
          </template>
        </div>
      </div>

      <ListState
        :status="store.current.status"
        :error="store.current.error"
        :empty="false"
        @retry="store.current.load"
      >
        <Card v-if="session" title="Current session">
          <template #actions>
            <Badge variant="success">{{ session.status }}</Badge>
          </template>
          <div class="stats-grid">
            <div class="stat">
              <span class="stat-label">Opening cash</span>
              <span class="stat-value">{{ money(session.opening_amount) }}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Expected cash</span>
              <span class="stat-value">{{ money(session.expected_amount) }}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Agency</span>
              <span class="stat-value">#{{ session.agency_id }}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Opened at</span>
              <span class="stat-value small">{{ formatDate(session.opened_at) }}</span>
            </div>
          </div>
        </Card>

        <Card v-else title="No open session">
          <div class="empty-session">
            <Wallet :size="28" stroke-width="1.5" />
            <p>Open a cash session to register cash payments and movements.</p>
          </div>
        </Card>
      </ListState>

      <Card v-if="session" title="Movements">
        <ListState
          :status="store.current.status"
          :error="store.current.error"
          :empty="movements.length === 0"
          empty-text="No cash movements in this session."
          @retry="store.current.load"
        >
          <DataTable :columns="MOVEMENT_COLUMNS" :data="movements">
            <template #type="{ row }">
              <Badge :variant="row.type === 'income' ? 'success' : 'warning'">
                {{ formatText(row.type) }}
              </Badge>
            </template>
            <template #amount="{ row }">{{ money(row.amount) }}</template>
            <template #note="{ row }">{{ formatText(row.note) }}</template>
            <template #created_at="{ row }">{{ formatDate(row.created_at) }}</template>
          </DataTable>
        </ListState>
      </Card>

      <Card title="Session history">
        <ListState
          :status="store.sessions.status"
          :error="store.sessions.error"
          :empty="sessionRows.length === 0"
          empty-text="No cash sessions have been opened yet."
          @retry="store.sessions.load"
        >
          <DataTable :columns="SESSION_COLUMNS" :data="sessionRows">
            <template #id="{ row }">#{{ row.id }}</template>
            <template #agency_id="{ row }">#{{ row.agency_id }}</template>
            <template #opened_at="{ row }">{{ formatDate(row.opened_at) }}</template>
            <template #opening_amount="{ row }">{{ money(row.opening_amount) }}</template>
            <template #expected_amount="{ row }">{{ money(row.expected_amount) }}</template>
            <template #status="{ row }">
              <Badge :variant="STATUS_VARIANTS[String(row.status)] ?? 'neutral'">
                {{ formatText(row.status) }}
              </Badge>
            </template>
            <template #closed_at="{ row }">
              {{ row.closed_at ? formatDate(row.closed_at) : '—' }}
            </template>
          </DataTable>

          <Pagination
            :page="store.sessions.data?.meta.current_page ?? 1"
            :last-page="sessionsMeta?.last_page ?? 1"
            :total="sessionsMeta?.total ?? sessionRows.length"
            :per-page="sessionsMeta?.per_page ?? 15"
            @update:page="sessionPage"
          />
        </ListState>
      </Card>

      <Card title="Closings">
        <template #actions>
          <select
            class="status-filter"
            @change="filterClosures(($event.target as HTMLSelectElement).value)"
          >
            <option value="">All closings</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </template>

        <ListState
          :status="store.closures.status"
          :error="store.closures.error"
          :empty="closureRows.length === 0"
          empty-text="No cash closings yet."
          @retry="store.closures.load"
        >
          <DataTable :columns="CLOSURE_COLUMNS" :data="closureRows">
            <template #id="{ row }">#{{ row.id }}</template>
            <template #requested_at="{ row }">{{ formatDate(row.requested_at) }}</template>
            <template #expected_amount="{ row }">{{ money(row.expected_amount) }}</template>
            <template #closing_amount="{ row }">{{ money(row.closing_amount) }}</template>
            <template #difference="{ row }">{{ money(row.difference) }}</template>
            <template #status="{ row }">
              <Badge :variant="STATUS_VARIANTS[String(row.status)] ?? 'neutral'">
                {{ formatText(row.status) }}
              </Badge>
            </template>
            <template #actions="{ row }">
              <div class="row-actions">
                <button class="link-button" @click="downloadReport(row as CashClosureRow)">
                  <ArrowDownToLine :size="14" />
                  PDF
                </button>
                <template v-if="row.status === 'pending' && can('voids.approve')">
                  <button class="link-button" @click="approve(row as CashClosureRow)">
                    Approve
                  </button>
                  <button class="link-button danger" @click="openReject(row as CashClosureRow)">
                    Reject
                  </button>
                </template>
              </div>
            </template>
          </DataTable>

          <Pagination
            :page="store.closures.data?.meta.current_page ?? 1"
            :last-page="closuresMeta?.last_page ?? 1"
            :total="closuresMeta?.total ?? closureRows.length"
            :per-page="closuresMeta?.per_page ?? 15"
            @update:page="closurePage"
          />
        </ListState>
      </Card>
    </div>

    <Modal :visible="openModal" title="Open cash session" @close="openModal = false">
      <OpenCashSessionForm @opened="onSessionChanged" @cancel="openModal = false" />
    </Modal>

    <Modal :visible="moveModal" title="Cash movement" @close="moveModal = false">
      <CashMovementForm @saved="onSessionChanged" @cancel="moveModal = false" />
    </Modal>

    <Modal :visible="closeModal" title="Close cash session" @close="closeModal = false">
      <CloseCashSessionForm
        v-if="session"
        :session-id="session.id"
        :expected-amount="session.expected_amount"
        @closed="onSessionChanged"
        @cancel="closeModal = false"
      />
    </Modal>

    <Modal :visible="rejectModal" title="Reject closing" @close="rejectModal = false">
      <form class="form" @submit.prevent="reject">
        <p class="hint">The cashier will keep the session open and can count the cash again.</p>
        <FormField label="Reason" :error="rejectError?.fieldError('reason')">
          <Textarea v-model="rejectReason" placeholder="The count does not match the vouchers." />
        </FormField>
        <p v-if="rejectError && !rejectError.isValidationError" class="form-error">
          {{ rejectError.message }}
        </p>
        <div class="actions">
          <Button variant="secondary" type="button" @click="rejectModal = false">Cancel</Button>
          <Button type="submit" :loading="store.saving" :disabled="rejectReason.trim() === ''">
            Reject closing
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

.header-actions {
  display: flex;
  gap: 8px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--muted);
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--fg);
}

.stat-value.small {
  font-size: 13px;
  font-weight: 500;
}

.empty-session {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 0;
  color: var(--muted);
  font-size: 13px;
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
