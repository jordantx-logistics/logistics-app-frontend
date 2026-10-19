<script setup lang="ts">
import { onMounted } from 'vue'

import AppShell from '@/core/components/AppShell.vue'
import Badge from '@/core/components/Badge.vue'
import Card from '@/core/components/Card.vue'
import DataTable from '@/core/components/DataTable.vue'
import ListState from '@/core/components/ListState.vue'
import Pagination from '@/core/components/Pagination.vue'
import { formatDate, formatText } from '@/core/utils/format'

import { useOrdersTable } from '../composables/useOrdersTable'

/**
 * Órdenes, paginadas **en el servidor** con el sobre estándar (`data` + `meta`).
 *
 * La fila solo trae ids (emisor, receptor y agencias): el nombre de cada uno
 * llega cuando la Fase 3 amplíe el recurso, así que aquí no se inventa nada.
 * Tampoco hay alta todavía: crear una orden pide los ids de cliente y agencia,
 * que es trabajo de esa misma fase.
 *
 * La lógica vive en `composables/useOrdersTable.ts` y el estado en
 * `stores/useOrdersStore.ts`.
 */

const { PER_PAGE, orders, page, goToPage, meta, rows, canCreate, columns, statusVariant } =
  useOrdersTable()

onMounted(() => {
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
