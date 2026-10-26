<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Plus } from 'lucide-vue-next'

import type { ApiError } from '@/core/api/errors'
import { toApiError } from '@/core/api/errors'
import AppShell from '@/core/components/AppShell.vue'
import Button from '@/core/components/Button.vue'
import Card from '@/core/components/Card.vue'
import DataTable from '@/core/components/DataTable.vue'
import FormField from '@/core/components/FormField.vue'
import ListState from '@/core/components/ListState.vue'
import Modal from '@/core/components/Modal.vue'
import Pagination from '@/core/components/Pagination.vue'
import Select from '@/core/components/Select.vue'
import { useToast } from '@/core/composables/useToast'
import { useAuthStore } from '@/core/stores/auth'
import { formatText } from '@/core/utils/format'

import InventoryAuditForm from '../components/InventoryAuditForm.vue'
import OperationStatusBadge from '../components/OperationStatusBadge.vue'
import * as operationsApi from '../api/operations.api'
import { useAsyncAction } from '../composables/useAsyncAction'
import { formatDateTime, INVENTORY_COLUMNS } from '../composables/useOperationsPresentation'
import { useOperationsStore } from '../stores/useOperationsStore'
import type {
  AgencyShipment,
  FinishInventoryCountPayload,
  InventoryCount,
  InventoryCountDetail,
} from '../types/operations.types'
import { INVENTORY_COUNT_STATUSES } from '../types/operations.types'

/**
 * Inventario físico por agencia.
 *
 * Abrir y cerrar un conteo son mutaciones; cerrar carga antes el inventario
 * esperado de la agencia (paginado de 100 en 100) para marcar qué se encontró.
 * Cualquier diferencia exige motivo y lo valida también el backend.
 */

const store = useOperationsStore()
const auth = useAuthStore()
const { success } = useToast()

const openAction = useAsyncAction()
const finishAction = useAsyncAction()

const agencies = computed(() => auth.agencies)
const canManage = computed(() => auth.can('inventory.manage'))

const statusFilter = ref('')
const agencyFilter = ref('')
const rows = computed(() => (store.inventoryCounts.data?.data ?? []) as InventoryCount[])
const meta = computed(() => store.inventoryCounts.data?.meta)
const page = computed(() => store.inventoryQuery.page ?? 1)

const showOpen = ref(false)
const openAgencyId = ref('')

const showAudit = ref(false)
const selectedCount = ref<InventoryCount | null>(null)
const expected = ref<AgencyShipment[]>([])
const expectedLoading = ref(false)
const expectedError = ref<ApiError | null>(null)

const showDetail = ref(false)
const detail = ref<InventoryCountDetail | null>(null)
const detailLoading = ref(false)
const detailError = ref<ApiError | null>(null)

const agencyOptions = computed(() =>
  agencies.value.map((agency) => ({ label: `Agency #${agency}`, value: String(agency) })),
)

function applyFilters(): void {
  store.updateInventoryQuery({
    page: 1,
    status: statusFilter.value === '' ? undefined : statusFilter.value,
    agency: agencyFilter.value === '' ? undefined : Number(agencyFilter.value),
  })
}

function resetFilters(): void {
  statusFilter.value = ''
  agencyFilter.value = ''
  store.updateInventoryQuery({ page: 1, status: undefined, agency: undefined })
}

function findCount(row: Record<string, unknown>): InventoryCount | null {
  return rows.value.find((count) => count.id === Number(row.id)) ?? null
}

function openOpenModal(): void {
  openAction.error.value = null
  openAgencyId.value = agencies.value[0] ? String(agencies.value[0]) : ''
  showOpen.value = true
}

async function onOpenCount(): Promise<void> {
  const result = await openAction.run(() =>
    store.openInventoryCount({ agency_id: Number(openAgencyId.value) }),
  )

  if (result) {
    success('Inventory count opened', 'Record the parcels found at the agency.')
    showOpen.value = false
  }
}

async function loadExpected(agencyId: number): Promise<void> {
  expectedLoading.value = true
  expectedError.value = null
  expected.value = []

  try {
    let currentPage = 1
    let lastPage = 1

    do {
      const response = await operationsApi.listAgencyInventory(agencyId, {
        page: currentPage,
        per_page: 100,
      })

      expected.value = [...expected.value, ...((response.data ?? []) as AgencyShipment[])]
      lastPage = response.meta?.last_page ?? 1
      currentPage += 1
    } while (currentPage <= lastPage)
  } catch (cause) {
    expectedError.value = toApiError(cause)
  } finally {
    expectedLoading.value = false
  }
}

async function openAudit(row: Record<string, unknown>): Promise<void> {
  selectedCount.value = findCount(row)
  finishAction.error.value = null

  if (selectedCount.value === null) {
    return
  }

  showAudit.value = true
  await loadExpected(selectedCount.value.agency_id)
}

async function onFinish(payload: FinishInventoryCountPayload): Promise<void> {
  if (selectedCount.value === null) {
    return
  }

  const result = await finishAction.run(() =>
    store.finishInventoryCount(selectedCount.value?.id ?? 0, payload),
  )

  if (result) {
    success('Inventory count finished', 'The differences were recorded with their motive.')
    showAudit.value = false
  }
}

async function openDetail(row: Record<string, unknown>): Promise<void> {
  const count = findCount(row)

  if (count === null) {
    return
  }

  detail.value = null
  detailError.value = null
  detailLoading.value = true
  showDetail.value = true

  try {
    const response = await operationsApi.getInventoryCount(count.id)
    detail.value = (response.data ?? null) as InventoryCountDetail | null
  } catch (cause) {
    detailError.value = toApiError(cause)
  } finally {
    detailLoading.value = false
  }
}

function goToPage(next: number): void {
  store.updateInventoryQuery({ page: next })
}

onMounted(() => {
  if (canManage.value) {
    void store.inventoryCounts.load()
  }
})
</script>

<template>
  <AppShell>
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Inventory</h1>
          <p class="page-subtitle">
            Physical counts per agency, with missing and unexpected parcels
          </p>
        </div>
        <Button v-if="canManage" variant="primary" @click="openOpenModal">
          <template #leading>
            <Plus :size="16" stroke-width="2" />
          </template>
          Open count
        </Button>
      </div>

      <Card>
        <form class="filters" @submit.prevent="applyFilters">
          <label class="filter">
            <span>Status</span>
            <select v-model="statusFilter">
              <option value="">All statuses</option>
              <option
                v-for="option in INVENTORY_COUNT_STATUSES"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </label>

          <label class="filter">
            <span>Agency</span>
            <input v-model="agencyFilter" type="number" min="1" placeholder="Any" />
          </label>

          <div class="filter-actions">
            <button type="button" class="link-button" @click="resetFilters">Clear</button>
            <button type="submit" class="apply-button">Apply</button>
          </div>
        </form>
      </Card>

      <Card class="table-card">
        <template #header>
          <div class="table-header">
            <h2 class="table-title">
              Counts
              <span v-if="meta">({{ meta.total }})</span>
            </h2>
          </div>
        </template>

        <ListState
          :status="store.inventoryCounts.status"
          :error="store.inventoryCounts.error"
          :empty="rows.length === 0"
          empty-text="No inventory counts yet."
          @retry="store.inventoryCounts.load"
        >
          <DataTable :columns="INVENTORY_COLUMNS" :data="rows">
            <template #id="{ row }">#{{ formatText(row.id) }}</template>
            <template #agency_id="{ row }">#{{ formatText(row.agency_id) }}</template>
            <template #status="{ row }">
              <OperationStatusBadge :status="String(row.status)" />
            </template>
            <template #items_count="{ row }">{{ formatText(row.items_count) }}</template>
            <template #counted_by="{ row }">{{ formatText(row.counted_by) }}</template>
            <template #finished_at="{ row }">{{ formatDateTime(row.finished_at) }}</template>
            <template #actions="{ row }">
              <div class="row-actions">
                <Button variant="ghost" size="sm" @click="openDetail(row)">Details</Button>
                <Button
                  v-if="String(row.status) === 'open'"
                  variant="secondary"
                  size="sm"
                  @click="openAudit(row)"
                >
                  Record count
                </Button>
              </div>
            </template>
          </DataTable>

          <Pagination
            :page="page"
            :last-page="meta?.last_page ?? 1"
            :total="meta?.total ?? rows.length"
            :per-page="meta?.per_page ?? store.PER_PAGE"
            @update:page="goToPage"
          />
        </ListState>
      </Card>
    </div>

    <Modal :visible="showOpen" title="Open inventory count" @close="showOpen = false">
      <form class="form" @submit.prevent="onOpenCount">
        <div
          v-if="openAction.error.value && !openAction.error.value.isValidationError"
          class="form-alert"
        >
          {{ openAction.error.value.message }}
        </div>

        <FormField label="Agency" :error="openAction.error.value?.fieldError('agency_id')">
          <Select v-model="openAgencyId" :options="agencyOptions" placeholder="Select an agency" />
        </FormField>

        <div class="form-actions">
          <Button variant="ghost" @click="showOpen = false">Cancel</Button>
          <Button
            variant="primary"
            :loading="openAction.loading.value"
            :disabled="openAgencyId === ''"
            @click="onOpenCount"
          >
            Open count
          </Button>
        </div>
      </form>
    </Modal>

    <Modal
      :visible="showAudit && selectedCount !== null"
      title="Record inventory count"
      @close="showAudit = false"
    >
      <div v-if="expectedLoading" class="loading">Loading expected parcels…</div>
      <div v-else-if="expectedError" class="form-alert">{{ expectedError.message }}</div>
      <InventoryAuditForm
        v-else-if="selectedCount"
        :count="selectedCount"
        :expected="expected"
        :loading="finishAction.loading.value"
        :error="finishAction.error.value"
        @submit="onFinish"
        @cancel="showAudit = false"
      />
    </Modal>

    <Modal :visible="showDetail" title="Inventory count detail" @close="showDetail = false">
      <div v-if="detailLoading" class="loading">Loading count…</div>
      <div v-else-if="detailError" class="form-alert">{{ detailError.message }}</div>
      <div v-else-if="detail" class="detail">
        <dl class="detail-grid">
          <div>
            <dt>Count</dt>
            <dd>#{{ detail.id }}</dd>
          </div>
          <div>
            <dt>Agency</dt>
            <dd>#{{ detail.agency_id }}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd><OperationStatusBadge :status="detail.status" /></dd>
          </div>
          <div>
            <dt>Lines</dt>
            <dd>{{ detail.items_count ?? detail.items?.length ?? 0 }}</dd>
          </div>
          <div>
            <dt>Expected</dt>
            <dd>{{ detail.summary?.expected ?? '—' }}</dd>
          </div>
          <div>
            <dt>Found</dt>
            <dd>{{ detail.summary?.found ?? '—' }}</dd>
          </div>
          <div>
            <dt>Missing</dt>
            <dd>{{ detail.summary?.missing ?? '—' }}</dd>
          </div>
          <div>
            <dt>Unexpected</dt>
            <dd>{{ detail.summary?.unexpected ?? '—' }}</dd>
          </div>
        </dl>

        <h3 class="detail-title">Lines</h3>
        <ul class="detail-list">
          <li v-for="item in detail.items ?? []" :key="item.id">
            <strong>{{ item.ticket_code }}</strong>
            <span class="muted">
              {{ item.found ? 'Found' : 'Missing' }} · difference {{ item.difference }}
              <template v-if="item.motive"> · {{ item.motive }}</template>
            </span>
          </li>
        </ul>
      </div>
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
  gap: 12px;
}

.page-title {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.02em;
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

.link-button {
  padding: 8px 6px;
  border: none;
  background: none;
  color: var(--muted);
  font-size: 13px;
  cursor: pointer;
}

.table-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.table-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--fg);
}

.row-actions {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-alert {
  padding: 10px 12px;
  border: 1px solid var(--danger);
  border-radius: 8px;
  font-size: 12px;
  color: var(--danger);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 14px;
  border-top: 1px solid var(--border);
}

.loading {
  padding: 24px;
  text-align: center;
  font-size: 13px;
  color: var(--muted);
}

.detail {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 12px;
  margin: 0;
}

.detail-grid dt {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--muted);
}

.detail-grid dd {
  margin: 2px 0 0;
  font-size: 13px;
  color: var(--fg);
}

.detail-title {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
}

.detail-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 260px;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  list-style: none;
}

.detail-list li {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 10px;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 13px;
}

.muted {
  font-size: 11px;
  color: var(--muted);
}
</style>
