<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import * as ordersApi from '@/core/api/orders'
import AppShell from '@/core/components/AppShell.vue'
import Badge from '@/core/components/Badge.vue'
import Card from '@/core/components/Card.vue'
import DataTable from '@/core/components/DataTable.vue'
import ListState from '@/core/components/ListState.vue'
import Pagination from '@/core/components/Pagination.vue'
import type { Column } from '@/core/components/types'
import { useAuth } from '@/core/composables/useAuth'
import { useAsyncData } from '@/core/composables/useAsyncData'
import { formatDate, formatText } from '@/core/utils/format'

/**
 * Órdenes, paginadas **en el servidor** con el sobre estándar (`data` + `meta`).
 *
 * La fila solo trae ids (emisor, receptor y agencias): el nombre de cada uno
 * llega cuando la Fase 3 amplíe el recurso, así que aquí no se inventa nada.
 * Tampoco hay alta todavía: crear una orden pide los ids de cliente y agencia,
 * que es trabajo de esa misma fase.
 */

const PER_PAGE = 15

const { can } = useAuth()

const page = ref(1)

const orders = useAsyncData(() => ordersApi.listOrders({ page: page.value, per_page: PER_PAGE }))

onMounted(() => {
  void orders.load()
})

const meta = computed(() => orders.data.value?.meta)
const rows = computed(() => orders.data.value?.data ?? [])
const canCreate = computed(() => can('orders.create'))

const columns: Column[] = [
  { key: 'ticket_number', label: 'Ticket' },
  { key: 'status', label: 'Status' },
  { key: 'weight_kg', label: 'Weight (kg)' },
  { key: 'total_amount', label: 'Amount' },
  { key: 'sender_id', label: 'Sender' },
  { key: 'receiver_id', label: 'Receiver' },
  { key: 'origin_agency_id', label: 'Origin' },
  { key: 'destination_agency_id', label: 'Destination' },
  { key: 'created_at', label: 'Created' },
]

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

const STATUS_VARIANTS: Record<string, BadgeVariant> = {
  pending: 'warning',
  in_transit: 'info',
  delivered: 'success',
  cancelled: 'danger',
  failed: 'danger',
}

function statusVariant(status: string): BadgeVariant {
  return STATUS_VARIANTS[status] ?? 'neutral'
}

function goToPage(next: number): void {
  page.value = next
  void orders.load()
}
</script>

<template>
  <AppShell>
    <div class="orders">
      <div class="page-header">
        <div>
          <h1 class="page-title">Orders</h1>
          <p class="page-subtitle">All shipments, newest first</p>
        </div>
      </div>

      <Card class="table-card">
        <template #header>
          <div class="table-header">
            <h2 class="table-title">
              Orders
              <span v-if="meta">({{ meta.total }})</span>
            </h2>
            <span v-if="canCreate" class="table-hint">
              Creating orders from here arrives with the next phase
            </span>
          </div>
        </template>

        <ListState
          :status="orders.status.value"
          :error="orders.error.value"
          :empty="rows.length === 0"
          empty-text="No orders yet."
          @retry="orders.load"
        >
          <DataTable :columns="columns" :data="rows" class="orders-table">
            <template #ticket_number="{ row }">
              <div class="ticket-cell">
                <span class="ticket-number">{{ formatText(row.ticket_number) }}</span>
                <span class="ticket-code">{{ formatText(row.ticket_code) }}</span>
              </div>
            </template>
            <template #status="{ row }">
              <Badge :variant="statusVariant(String(row.status))" dot>
                {{ formatText(row.status) }}
              </Badge>
            </template>
            <template #weight_kg="{ row }">{{ formatText(row.weight_kg) }}</template>
            <template #total_amount="{ row }">{{ formatText(row.total_amount) }}</template>
            <template #sender_id="{ row }">#{{ formatText(row.sender_id) }}</template>
            <template #receiver_id="{ row }">#{{ formatText(row.receiver_id) }}</template>
            <template #origin_agency_id="{ row }">#{{ formatText(row.origin_agency_id) }}</template>
            <template #destination_agency_id="{ row }">
              #{{ formatText(row.destination_agency_id) }}
            </template>
            <template #created_at="{ row }">{{ formatDate(String(row.created_at)) }}</template>
          </DataTable>

          <Pagination
            :page="page"
            :last-page="meta?.last_page ?? 1"
            :total="meta?.total ?? rows.length"
            :per-page="meta?.per_page ?? PER_PAGE"
            @update:page="goToPage"
          />
        </ListState>
      </Card>
    </div>
  </AppShell>
</template>

<style scoped>
.orders {
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
  font-size: 13px;
  color: var(--muted);
  margin-top: 2px;
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

.table-hint {
  font-size: 12px;
  color: var(--muted);
}

.orders-table {
  overflow-x: auto;
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
