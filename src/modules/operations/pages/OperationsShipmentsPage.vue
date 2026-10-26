<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import AppShell from '@/core/components/AppShell.vue'
import Card from '@/core/components/Card.vue'
import DataTable from '@/core/components/DataTable.vue'
import ListState from '@/core/components/ListState.vue'
import Pagination from '@/core/components/Pagination.vue'
import { formatText } from '@/core/utils/format'

import OperationStatusBadge from '../components/OperationStatusBadge.vue'
import { formatDateTime, SHIPMENT_COLUMNS } from '../composables/useOperationsPresentation'
import { useOperationsStore } from '../stores/useOperationsStore'
import { SHIPMENT_STATUSES } from '../types/operations.types'

/**
 * Listado de envíos con los filtros del contrato (estado, agencia, guía) y
 * paginación del servidor. Es la puerta de entrada al detalle operativo; el
 * historial se consulta en **Tracking** por `ticket_code`.
 *
 * La tabla no pagina en cliente: el `meta` de Laravel manda.
 */

const store = useOperationsStore()

const status = ref('')
const agency = ref('')
const ticketCode = ref('')

const rows = computed(() => store.shipments.data?.data ?? [])
const meta = computed(() => store.shipments.data?.meta)
const page = computed(() => store.shipmentsQuery.page ?? 1)

function applyFilters(): void {
  store.updateShipmentsQuery({
    page: 1,
    status: status.value === '' ? undefined : status.value,
    agency: agency.value === '' ? undefined : Number(agency.value),
    ticket_code: ticketCode.value.trim() === '' ? undefined : ticketCode.value.trim().toUpperCase(),
  })
}

function resetFilters(): void {
  status.value = ''
  agency.value = ''
  ticketCode.value = ''
  store.updateShipmentsQuery({
    page: 1,
    status: undefined,
    agency: undefined,
    ticket_code: undefined,
  })
}

function goToPage(next: number): void {
  store.updateShipmentsQuery({ page: next })
}

onMounted(() => {
  void store.shipments.load()
})
</script>

<template>
  <AppShell>
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Shipments</h1>
          <p class="page-subtitle">Operational state of every parcel, newest first</p>
        </div>
      </div>

      <Card>
        <form class="filters" @submit.prevent="applyFilters">
          <label class="filter">
            <span>Status</span>
            <select v-model="status">
              <option value="">All statuses</option>
              <option v-for="option in SHIPMENT_STATUSES" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </label>

          <label class="filter">
            <span>Agency</span>
            <input v-model="agency" type="number" min="1" placeholder="Any" />
          </label>

          <label class="filter">
            <span>Ticket code</span>
            <input v-model="ticketCode" placeholder="A7F3Q8X4" />
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
              Results
              <span v-if="meta">({{ meta.total }})</span>
            </h2>
          </div>
        </template>

        <ListState
          :status="store.shipments.status"
          :error="store.shipments.error"
          :empty="rows.length === 0"
          empty-text="No shipments match these filters."
          @retry="store.shipments.load"
        >
          <DataTable :columns="SHIPMENT_COLUMNS" :data="rows">
            <template #ticket_number="{ row }">
              <div class="ticket-cell">
                <span class="ticket-number">{{ formatText(row.ticket_number) }}</span>
                <span class="ticket-code">{{ formatText(row.ticket_code) }}</span>
              </div>
            </template>
            <template #ticket_code="{ row }">{{ formatText(row.ticket_code) }}</template>
            <template #status="{ row }">
              <OperationStatusBadge :status="String(row.status)" />
            </template>
            <template #origin_agency_id="{ row }">#{{ formatText(row.origin_agency_id) }}</template>
            <template #destination_agency_id="{ row }">
              #{{ formatText(row.destination_agency_id) }}
            </template>
            <template #current_location_agency_id="{ row }">
              #{{ formatText(row.current_location_agency_id) }}
            </template>
            <template #updated_at="{ row }">{{ formatDateTime(row.updated_at) }}</template>
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

.ticket-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ticket-number {
  font-weight: 600;
  color: var(--fg);
}

.ticket-code {
  font-size: 12px;
  color: var(--muted);
}
</style>
