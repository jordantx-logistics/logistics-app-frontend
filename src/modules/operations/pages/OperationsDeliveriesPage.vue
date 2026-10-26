<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Plus } from 'lucide-vue-next'

import AppShell from '@/core/components/AppShell.vue'
import Button from '@/core/components/Button.vue'
import Card from '@/core/components/Card.vue'
import DataTable from '@/core/components/DataTable.vue'
import ListState from '@/core/components/ListState.vue'
import Modal from '@/core/components/Modal.vue'
import Pagination from '@/core/components/Pagination.vue'
import { useToast } from '@/core/composables/useToast'
import { useAuthStore } from '@/core/stores/auth'
import { formatText } from '@/core/utils/format'

import AssignDeliveryForm from '../components/AssignDeliveryForm.vue'
import CompleteDeliveryForm from '../components/CompleteDeliveryForm.vue'
import FailDeliveryForm from '../components/FailDeliveryForm.vue'
import OperationStatusBadge from '../components/OperationStatusBadge.vue'
import { useAsyncAction } from '../composables/useAsyncAction'
import { DELIVERY_COLUMNS, formatDateTime } from '../composables/useOperationsPresentation'
import { useOperationsStore } from '../stores/useOperationsStore'
import type {
  AssignDeliveriesPayload,
  CompleteDeliveryPayload,
  Delivery,
  FailDeliveryPayload,
} from '../types/operations.types'
import { DELIVERY_STATUSES } from '../types/operations.types'

/**
 * Última milla (base): asignar envíos a un repartidor y ejecutar la entrega.
 *
 * La app del repartidor es de la Fase 8; esta pantalla cubre la operación de
 * mostrador: asignar, iniciar, completar con evidencia o registrar el fallo.
 */

const store = useOperationsStore()
const auth = useAuthStore()
const { success, error: toastError } = useToast()

const assignAction = useAsyncAction()
const startAction = useAsyncAction()
const completeAction = useAsyncAction()
const failAction = useAsyncAction()

const agencies = computed(() => auth.agencies)
const canAssign = computed(() => auth.can('delivery.assign'))
const canExecute = computed(() => auth.can('delivery.execute'))

const statusFilter = ref('')
const agencyFilter = ref('')
const rows = computed(() => (store.deliveries.data?.data ?? []) as Delivery[])
const meta = computed(() => store.deliveries.data?.meta)
const page = computed(() => store.deliveriesQuery.page ?? 1)

const showAssign = ref(false)
const showComplete = ref(false)
const showFail = ref(false)
const selected = ref<Delivery | null>(null)
const formKey = ref(0)

function applyFilters(): void {
  store.updateDeliveriesQuery({
    page: 1,
    status: statusFilter.value === '' ? undefined : statusFilter.value,
    agency: agencyFilter.value === '' ? undefined : Number(agencyFilter.value),
  })
}

function resetFilters(): void {
  statusFilter.value = ''
  agencyFilter.value = ''
  store.updateDeliveriesQuery({ page: 1, status: undefined, agency: undefined })
}

function findDelivery(row: Record<string, unknown>): Delivery | null {
  return rows.value.find((delivery) => delivery.id === Number(row.id)) ?? null
}

function openAssign(): void {
  assignAction.error.value = null
  showAssign.value = true
}

function openComplete(row: Record<string, unknown>): void {
  selected.value = findDelivery(row)
  completeAction.error.value = null
  showComplete.value = true
}

function openFail(row: Record<string, unknown>): void {
  selected.value = findDelivery(row)
  failAction.error.value = null
  showFail.value = true
}

async function onAssign(payload: AssignDeliveriesPayload): Promise<void> {
  const result = await assignAction.run(() => store.assignDeliveries(payload))

  if (result) {
    success('Shipments assigned', 'The courier can start the delivery route.')
    showAssign.value = false
    formKey.value += 1
  }
}

async function onStart(row: Record<string, unknown>): Promise<void> {
  const delivery = findDelivery(row)

  if (delivery === null) {
    return
  }

  const result = await startAction.run(() => store.startDelivery(delivery.id))

  if (result) {
    success('Delivery started', `Delivery #${delivery.id} is now in progress.`)
  } else if (startAction.error.value) {
    toastError('The delivery could not be started', startAction.error.value.message)
  }
}

async function onComplete(payload: CompleteDeliveryPayload): Promise<void> {
  if (selected.value === null) {
    return
  }

  const result = await completeAction.run(() =>
    store.completeDelivery(selected.value?.id ?? 0, payload),
  )

  if (result) {
    success('Delivery completed', 'The order was closed as delivered.')
    showComplete.value = false
  }
}

async function onFail(payload: FailDeliveryPayload): Promise<void> {
  if (selected.value === null) {
    return
  }

  const result = await failAction.run(() => store.failDelivery(selected.value?.id ?? 0, payload))

  if (result) {
    success('Delivery failure recorded', 'The attempt was registered.')
    showFail.value = false
  }
}

function goToPage(next: number): void {
  store.updateDeliveriesQuery({ page: next })
}

onMounted(() => {
  if (auth.can('delivery.view')) {
    void store.deliveries.load()
  }
})
</script>

<template>
  <AppShell>
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Deliveries</h1>
          <p class="page-subtitle">Last-mile assignment, delivery and failure attempts</p>
        </div>
        <Button v-if="canAssign" variant="primary" @click="openAssign">
          <template #leading>
            <Plus :size="16" stroke-width="2" />
          </template>
          Assign shipments
        </Button>
      </div>

      <Card>
        <form class="filters" @submit.prevent="applyFilters">
          <label class="filter">
            <span>Status</span>
            <select v-model="statusFilter">
              <option value="">All statuses</option>
              <option v-for="option in DELIVERY_STATUSES" :key="option.value" :value="option.value">
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
              Deliveries
              <span v-if="meta">({{ meta.total }})</span>
            </h2>
          </div>
        </template>

        <ListState
          :status="store.deliveries.status"
          :error="store.deliveries.error"
          :empty="rows.length === 0"
          empty-text="No deliveries match these filters."
          @retry="store.deliveries.load"
        >
          <DataTable :columns="DELIVERY_COLUMNS" :data="rows">
            <template #id="{ row }">#{{ formatText(row.id) }}</template>
            <template #ticket_code="{ row }">{{ formatText(row.ticket_code) }}</template>
            <template #status="{ row }">
              <OperationStatusBadge :status="String(row.status)" />
            </template>
            <template #courier_id="{ row }">#{{ formatText(row.courier_id) }}</template>
            <template #attempt="{ row }">{{ formatText(row.attempt) }}</template>
            <template #agency_id="{ row }">#{{ formatText(row.agency_id) }}</template>
            <template #delivered_at="{ row }">{{ formatDateTime(row.delivered_at) }}</template>
            <template #actions="{ row }">
              <div v-if="canExecute" class="row-actions">
                <Button
                  v-if="String(row.status) === 'assigned'"
                  variant="secondary"
                  size="sm"
                  @click="onStart(row)"
                >
                  Start
                </Button>
                <Button
                  v-if="String(row.status) === 'in_progress'"
                  variant="secondary"
                  size="sm"
                  @click="openComplete(row)"
                >
                  Complete
                </Button>
                <Button
                  v-if="['assigned', 'in_progress'].includes(String(row.status))"
                  variant="ghost"
                  size="sm"
                  @click="openFail(row)"
                >
                  Fail
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

    <Modal :visible="showAssign" title="Assign shipments" @close="showAssign = false">
      <AssignDeliveryForm
        :key="formKey"
        :agencies="agencies"
        :loading="assignAction.loading.value"
        :error="assignAction.error.value"
        @submit="onAssign"
        @cancel="showAssign = false"
      />
    </Modal>

    <Modal
      :visible="showComplete && selected !== null"
      title="Complete delivery"
      @close="showComplete = false"
    >
      <CompleteDeliveryForm
        :loading="completeAction.loading.value"
        :error="completeAction.error.value"
        @submit="onComplete"
        @cancel="showComplete = false"
      />
    </Modal>

    <Modal
      :visible="showFail && selected !== null"
      title="Register delivery failure"
      @close="showFail = false"
    >
      <FailDeliveryForm
        :loading="failAction.loading.value"
        :error="failAction.error.value"
        @submit="onFail"
        @cancel="showFail = false"
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
</style>
