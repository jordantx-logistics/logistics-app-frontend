<script setup lang="ts">
import { onMounted } from 'vue'
import { Search, Smartphone, SmartphoneCharging } from 'lucide-vue-next'

import AppShell from '@/core/components/AppShell.vue'
import Badge from '@/core/components/Badge.vue'
import Button from '@/core/components/Button.vue'
import Card from '@/core/components/Card.vue'
import DataTable from '@/core/components/DataTable.vue'
import Input from '@/core/components/Input.vue'
import ListState from '@/core/components/ListState.vue'
import Pagination from '@/core/components/Pagination.vue'
import Select from '@/core/components/Select.vue'
import { EMPTY_VALUE, formatText } from '@/core/utils/format'

import { useDevicesTable } from '../composables/useDevicesTable'

/**
 * Dispositivos con token (UC-19): qué equipos pueden operar y cuáles se han
 * revocado.
 *
 * Las sesiones web (UC-20) quedan fuera: en local/producción el driver de sesión
 * es Redis, así que la tabla `sessions` no es la fuente de verdad.
 */

const {
  PER_PAGE,
  devices,
  canManage,
  status,
  statusOptions,
  userId,
  page,
  rows,
  lastPage,
  total,
  activeCount,
  emptyText,
  columns,
  reload,
  submitSearch,
  changePage,
  actingId,
  revoke,
} = useDevicesTable()

onMounted(() => {
  reload()
})

/** `unknown` → marca de tiempo con hora. */
function formatDateTime(value: unknown): string {
  if (value === null || value === undefined || value === '') {
    return EMPTY_VALUE
  }

  const date = new Date(String(value))

  return Number.isNaN(date.getTime())
    ? EMPTY_VALUE
    : `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
}
</script>

<template>
  <AppShell>
    <div class="devices">
      <div class="page-header">
        <div>
          <h1 class="page-title">Devices</h1>
          <p class="page-subtitle">Handhelds and apps holding a token</p>
        </div>
      </div>

      <div class="stats-grid">
        <Card class="stat-card">
          <div class="stat-icon" style="background: oklch(58% 0.18 255)">
            <Smartphone :size="20" stroke-width="2" />
          </div>
          <div class="stat-value">{{ total }}</div>
          <div class="stat-label">Devices</div>
        </Card>
        <Card class="stat-card">
          <div class="stat-icon" style="background: oklch(62% 0.18 145)">
            <SmartphoneCharging :size="20" stroke-width="2" />
          </div>
          <div class="stat-value">{{ activeCount }}</div>
          <div class="stat-label">Active on page</div>
        </Card>
      </div>

      <Card class="filters-card">
        <form class="filters" @submit.prevent="submitSearch">
          <div class="filter-search">
            <Search :size="16" stroke-width="2" />
            <Input placeholder="Filter by user ID..." v-model="userId" type="number" />
          </div>
          <div class="filter-control">
            <Select v-model="status" :options="statusOptions" placeholder="Filter by status" />
          </div>
          <Button variant="secondary" @click="submitSearch">Search</Button>
        </form>
      </Card>

      <Card class="table-card">
        <template #header>
          <div class="table-header">
            <h2 class="table-title">All devices ({{ total }})</h2>
          </div>
        </template>

        <ListState
          :status="devices.status"
          :error="devices.error"
          :empty="rows.length === 0"
          :empty-text="emptyText"
          @retry="reload"
        >
          <DataTable :columns="columns" :data="rows" class="devices-table">
            <template #device_name="{ row }">
              <div class="cell-name-block">
                <span class="cell-name">{{ formatText(row.device_name) }}</span>
                <span class="cell-muted">{{ formatText(row.device_uuid) }}</span>
              </div>
            </template>
            <template #platform="{ row }">
              <Badge variant="neutral">{{ formatText(row.platform) }}</Badge>
            </template>
            <template #app_version="{ row }">{{ formatText(row.app_version) }}</template>
            <template #last_seen_at="{ row }">{{ formatDateTime(row.last_seen_at) }}</template>
            <template #status="{ row }">
              <Badge :variant="row.status === 'active' ? 'success' : 'neutral'" dot>
                {{ formatText(row.status) }}
              </Badge>
            </template>
            <template #actions="{ row }">
              <div class="row-actions">
                <Button
                  v-if="canManage && row.status === 'active'"
                  variant="ghost"
                  size="sm"
                  :loading="actingId === Number(row.id)"
                  @click="revoke(Number(row.id))"
                >
                  Revoke
                </Button>
                <span v-else class="row-empty">{{ EMPTY_VALUE }}</span>
              </div>
            </template>
          </DataTable>

          <Pagination
            :page="page"
            :last-page="lastPage"
            :total="total"
            :per-page="PER_PAGE"
            @update:page="changePage"
          />
        </ListState>
      </Card>
    </div>
  </AppShell>
</template>

<style scoped>
.devices {
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.stat-card {
  display: flex;
  flex-direction: column;
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
  color: var(--fg);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--muted);
}

.filters-card {
  padding: 16px;
}

.filters {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-search {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--muted);
  flex: 1;
  min-width: 240px;
}

.filter-control {
  min-width: 180px;
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.table-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--fg);
}

.devices-table {
  overflow-x: auto;
}

.cell-name-block {
  display: flex;
  flex-direction: column;
}

.cell-name {
  font-weight: 500;
  color: var(--fg);
}

.cell-muted {
  font-size: 12px;
  color: var(--muted);
}

.row-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: flex-end;
}

.row-empty {
  color: var(--muted);
}
</style>
