<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Plus, Search } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

import { ApiError } from '@/core/api/errors'
import AppShell from '@/core/components/AppShell.vue'
import Badge from '@/core/components/Badge.vue'
import Button from '@/core/components/Button.vue'
import Card from '@/core/components/Card.vue'
import DataTable from '@/core/components/DataTable.vue'
import ListState from '@/core/components/ListState.vue'
import Pagination from '@/core/components/Pagination.vue'
import { useToast } from '@/core/composables/useToast'
import { useAgencyOptionsStore } from '@/core/stores/agencyOptions'
import '@/core/styles/backoffice.css'
import { formatDate, formatText } from '@/core/utils/format'

import * as ordersApi from '../api/orders.api'
import { useOrdersTable } from '../composables/useOrdersTable'

/**
 * Órdenes, paginadas **en el servidor** con el sobre estándar (`data` + `meta`).
 * Atención al cliente entra por el `ticket_code`: la búsqueda lleva directo al
 * detalle.
 *
 * La lógica vive en `composables/useOrdersTable.ts` y el estado en
 * `stores/useOrdersStore.ts`.
 */

const {
  PER_PAGE,
  store,
  orders,
  goToPage,
  meta,
  rows,
  canCreate,
  columns,
  statusVariant,
  openOrder,
} = useOrdersTable()

const router = useRouter()
const toast = useToast()
const agencies = useAgencyOptionsStore()
const ticketCode = ref('')

async function findByTicket(): Promise<void> {
  const code = ticketCode.value.trim().toUpperCase()

  if (code === '') {
    return
  }

  try {
    openOrder((await ordersApi.getOrderByTicket(code)).id)
  } catch (caught) {
    toast.error('Order not found', caught instanceof ApiError ? caught.message : undefined)
  }
}

onMounted(() => {
  agencies.ensureLoaded()
  void orders.load()
})
</script>

<template>
  <AppShell>
    <div class="orders">
      <div class="page-header">
        <div>
          <h1 class="page-title">Orders</h1>
          <p class="page-subtitle">All shipments, newest first</p>
        </div>
        <Button v-if="canCreate" @click="router.push({ name: 'order-create' })">
          <template #leading><Plus :size="16" /></template>
          New order
        </Button>
      </div>

      <Card>
        <form class="bo-filters" @submit.prevent="findByTicket">
          <label class="bo-filter">
            <span>Ticket code</span>
            <input v-model="ticketCode" maxlength="8" placeholder="AB12CD34" />
          </label>
          <Button type="submit" variant="secondary">
            <template #leading><Search :size="14" /></template>
            Find
          </Button>
          <label class="bo-filter">
            <span>Status</span>
            <select
              :value="store.status"
              @change="store.filterByStatus(($event.target as HTMLSelectElement).value)"
            >
              <option value="">All statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="in_transit">In transit</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </label>
        </form>
      </Card>

      <Card class="table-card">
        <template #header>
          <div class="table-header">
            <h2 class="table-title">
              Orders
              <span v-if="meta">({{ meta.total }})</span>
            </h2>
          </div>
        </template>

        <ListState
          :status="orders.status"
          :error="orders.error"
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
            <template #origin_agency_id="{ row }">{{
              agencies.label(row.origin_agency_id)
            }}</template>
            <template #destination_agency_id="{ row }">
              {{ agencies.label(row.destination_agency_id) }}
            </template>
            <template #created_at="{ row }">{{ formatDate(String(row.created_at)) }}</template>
            <template #actions="{ row }">
              <button class="bo-link" @click="openOrder(row.id)">View</button>
            </template>
          </DataTable>

          <Pagination
            :page="store.page"
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
