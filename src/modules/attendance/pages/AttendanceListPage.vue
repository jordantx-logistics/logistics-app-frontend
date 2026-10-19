<script setup lang="ts">
import { onMounted } from 'vue'
import { CircleCheck, Clock, Plus, Search, TableProperties } from 'lucide-vue-next'

import AppShell from '@/core/components/AppShell.vue'
import Badge from '@/core/components/Badge.vue'
import Button from '@/core/components/Button.vue'
import Card from '@/core/components/Card.vue'
import DataTable from '@/core/components/DataTable.vue'
import Input from '@/core/components/Input.vue'
import ListState from '@/core/components/ListState.vue'
import Modal from '@/core/components/Modal.vue'
import Pagination from '@/core/components/Pagination.vue'
import Select from '@/core/components/Select.vue'
import { EMPTY_VALUE, formatDate, formatText } from '@/core/utils/format'

import { useAttendanceTable } from '../composables/useAttendanceTable'
import RegisterAttendanceForm from '../components/RegisterAttendanceForm.vue'

/**
 * Marcaciones de RRHH: alta (UC-10/UC-11), anulación y consolidado diario.
 *
 * El buscador local no aplica: el listado pagina y filtra en el backend. El
 * consolidado se pide a demanda (botón «Daily summary»).
 */

const {
  PER_PAGE,
  attendance,
  canRegister,
  canVoid,
  employeeId,
  status,
  statusOptions,
  agencyId,
  agencyFilterOptions,
  from,
  to,
  page,
  rows,
  lastPage,
  total,
  lateCount,
  emptyText,
  columns,
  reload,
  submitSearch,
  changePage,
  showForm,
  submitting,
  formError,
  openForm,
  closeForm,
  submitAttendance,
  actingId,
  voidRecord,
  agencyOptions,
  loadAgencies,
  showSummary,
  summaryRows,
  summaryStatus,
  summaryError,
  summaryColumns,
  toggleSummary,
  reloadSummary,
} = useAttendanceTable()

onMounted(() => {
  reload()
  loadAgencies()
})

/** `unknown` → texto de una marca de tiempo con hora. */
function formatDateTime(value: unknown): string {
  if (value === null || value === undefined || value === '') {
    return EMPTY_VALUE
  }

  const date = new Date(String(value))

  return Number.isNaN(date.getTime())
    ? EMPTY_VALUE
    : `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
}

function statusVariant(value: unknown): 'success' | 'warning' | 'danger' | 'neutral' {
  if (value === 'valid') {
    return 'success'
  }

  if (value === 'late') {
    return 'warning'
  }

  if (value === 'voided' || value === 'duplicate') {
    return 'danger'
  }

  return 'neutral'
}
</script>

<template>
  <AppShell>
    <div class="attendance">
      <div class="page-header">
        <div>
          <h1 class="page-title">Attendance</h1>
          <p class="page-subtitle">Clock-ins, clock-outs and daily consolidation</p>
        </div>
        <div class="header-actions">
          <Button variant="secondary" @click="toggleSummary">
            <template #leading>
              <TableProperties :size="16" stroke-width="2" />
            </template>
            Daily summary
          </Button>
          <Button v-if="canRegister" variant="primary" @click="openForm">
            <template #leading>
              <Plus :size="16" stroke-width="2" />
            </template>
            Register
          </Button>
        </div>
      </div>

      <div class="stats-grid">
        <Card class="stat-card">
          <div class="stat-icon" style="background: oklch(58% 0.18 255)">
            <Clock :size="20" stroke-width="2" />
          </div>
          <div class="stat-value">{{ total }}</div>
          <div class="stat-label">Records</div>
        </Card>
        <Card class="stat-card">
          <div class="stat-icon" style="background: oklch(72% 0.16 80)">
            <CircleCheck :size="20" stroke-width="2" />
          </div>
          <div class="stat-value">{{ lateCount }}</div>
          <div class="stat-label">Late on page</div>
        </Card>
      </div>

      <Card class="filters-card">
        <form class="filters" @submit.prevent="submitSearch">
          <div class="filter-search">
            <Search :size="16" stroke-width="2" />
            <Input placeholder="Employee ID..." v-model="employeeId" type="number" />
          </div>
          <div class="filter-control">
            <Select v-model="status" :options="statusOptions" placeholder="Filter by status" />
          </div>
          <div class="filter-control">
            <Select
              v-model="agencyId"
              :options="agencyFilterOptions"
              placeholder="Filter by agency"
            />
          </div>
          <div class="filter-date">
            <Input v-model="from" type="date" />
          </div>
          <div class="filter-date">
            <Input v-model="to" type="date" />
          </div>
          <Button variant="secondary" @click="submitSearch">Search</Button>
        </form>
      </Card>

      <Card v-if="showSummary" class="table-card">
        <template #header>
          <div class="table-header">
            <h2 class="table-title">Daily consolidation ({{ summaryRows.length }})</h2>
          </div>
        </template>

        <ListState
          :status="summaryStatus"
          :error="summaryError"
          :empty="summaryRows.length === 0"
          empty-text="No consolidation for the selected range."
          @retry="reloadSummary"
        >
          <DataTable :columns="summaryColumns" :data="summaryRows" class="attendance-table">
            <template #work_date="{ row }">{{ formatDate(row.work_date) }}</template>
            <template #first_in_at="{ row }">{{ formatDateTime(row.first_in_at) }}</template>
            <template #last_out_at="{ row }">{{ formatDateTime(row.last_out_at) }}</template>
            <template #status="{ row }">
              <Badge :variant="statusVariant(row.status)" dot>
                {{ formatText(row.status) }}
              </Badge>
            </template>
          </DataTable>
        </ListState>
      </Card>

      <Card class="table-card">
        <template #header>
          <div class="table-header">
            <h2 class="table-title">All records ({{ total }})</h2>
          </div>
        </template>

        <ListState
          :status="attendance.status"
          :error="attendance.error"
          :empty="rows.length === 0"
          :empty-text="emptyText"
          @retry="reload"
        >
          <DataTable :columns="columns" :data="rows" class="attendance-table">
            <template #employee_id="{ row }">
              <span class="cell-mono">#{{ formatText(row.employee_id) }}</span>
            </template>
            <template #marked_at="{ row }">{{ formatDateTime(row.marked_at) }}</template>
            <template #type="{ row }">
              <Badge variant="neutral">{{ formatText(row.type) }}</Badge>
            </template>
            <template #source="{ row }">{{ formatText(row.source) }}</template>
            <template #status="{ row }">
              <Badge :variant="statusVariant(row.status)" dot>
                {{ formatText(row.status) }}
              </Badge>
            </template>
            <template #actions="{ row }">
              <div class="row-actions">
                <Button
                  v-if="canVoid && row.status !== 'voided'"
                  variant="ghost"
                  size="sm"
                  :loading="actingId === Number(row.id)"
                  @click="voidRecord(Number(row.id))"
                >
                  Void
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

      <Modal :visible="showForm" title="Register attendance" @close="closeForm">
        <RegisterAttendanceForm
          :loading="submitting"
          :error="formError"
          :agencies="agencyOptions"
          @submit="submitAttendance"
          @cancel="closeForm"
        />
      </Modal>
    </div>
  </AppShell>
</template>

<style scoped>
.attendance {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
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
  min-width: 200px;
}

.filter-control {
  min-width: 170px;
}

.filter-date {
  width: 150px;
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

.attendance-table {
  overflow-x: auto;
}

.cell-mono {
  font-variant-numeric: tabular-nums;
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
