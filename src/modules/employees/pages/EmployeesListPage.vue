<script setup lang="ts">
import { onMounted } from 'vue'
import { BadgeCheck, Plus, Search, UserRound, UserRoundX } from 'lucide-vue-next'

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

import { useEmployeesTable } from '../composables/useEmployeesTable'
import EmployeeForm from '../components/EmployeeForm.vue'

/**
 * Empleados de RRHH: alta y edición (UC-08) y baja (UC-09).
 *
 * `GET /employees` pagina y filtra en el backend; el `meta` del paginador
 * alimenta el `Pagination`.
 */

const {
  PER_PAGE,
  employees,
  canManage,
  search,
  status,
  statusOptions,
  agencyId,
  agencyFilterOptions,
  page,
  rows,
  lastPage,
  total,
  activeCount,
  emptyText,
  columns,
  agencyOptions,
  loadAgencies,
  reload,
  submitSearch,
  changePage,
  showForm,
  editing,
  submitting,
  formError,
  openForm,
  closeForm,
  submitEmployee,
  actingId,
  deactivate,
} = useEmployeesTable()

onMounted(() => {
  reload()
  loadAgencies()
})

/** `document_type` → etiqueta corta para la tabla. */
function documentLabel(value: unknown): string {
  return value === 'DNI' ? 'DNI' : formatText(value)
}
</script>

<template>
  <AppShell>
    <div class="employees">
      <div class="page-header">
        <div>
          <h1 class="page-title">Employees</h1>
          <p class="page-subtitle">HR records: documents, positions and base agency</p>
        </div>
        <Button v-if="canManage" variant="primary" @click="openForm()">
          <template #leading>
            <Plus :size="16" stroke-width="2" />
          </template>
          Add employee
        </Button>
      </div>

      <div class="stats-grid">
        <Card class="stat-card">
          <div class="stat-icon" style="background: oklch(58% 0.18 255)">
            <UserRound :size="20" stroke-width="2" />
          </div>
          <div class="stat-value">{{ total }}</div>
          <div class="stat-label">Employees</div>
        </Card>
        <Card class="stat-card">
          <div class="stat-icon" style="background: oklch(62% 0.18 145)">
            <BadgeCheck :size="20" stroke-width="2" />
          </div>
          <div class="stat-value">{{ activeCount }}</div>
          <div class="stat-label">Active on page</div>
        </Card>
      </div>

      <Card class="filters-card">
        <form class="filters" @submit.prevent="submitSearch">
          <div class="filter-search">
            <Search :size="16" stroke-width="2" />
            <Input placeholder="Search by document or name..." v-model="search" />
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
          <Button variant="secondary" @click="submitSearch">Search</Button>
        </form>
      </Card>

      <Card class="table-card">
        <template #header>
          <div class="table-header">
            <h2 class="table-title">All employees ({{ total }})</h2>
          </div>
        </template>

        <ListState
          :status="employees.status"
          :error="employees.error"
          :empty="rows.length === 0"
          :empty-text="emptyText"
          @retry="reload"
        >
          <DataTable :columns="columns" :data="rows" class="employees-table">
            <template #full_name="{ row }">
              <div class="cell-name-block">
                <span class="cell-name">{{ formatText(row.full_name) }}</span>
                <span class="cell-muted">{{ formatText(row.email) }}</span>
              </div>
            </template>
            <template #document_number="{ row }">
              <span class="cell-document">
                {{ documentLabel(row.document_type) }} {{ formatText(row.document_number) }}
              </span>
            </template>
            <template #position="{ row }">{{ formatText(row.position) }}</template>
            <template #hired_at="{ row }">{{ formatDate(row.hired_at) }}</template>
            <template #status="{ row }">
              <Badge :variant="row.status === 'active' ? 'success' : 'neutral'" dot>
                {{ formatText(row.status) }}
              </Badge>
            </template>
            <template #actions="{ row }">
              <div class="row-actions">
                <template v-if="row.status !== 'terminated'">
                  <Button variant="ghost" size="sm" @click="openForm(row)">Edit</Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    :loading="actingId === Number(row.id)"
                    @click="deactivate(Number(row.id))"
                  >
                    <template #leading>
                      <UserRoundX :size="14" stroke-width="2" />
                    </template>
                    Deactivate
                  </Button>
                </template>
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

      <Modal
        :visible="showForm"
        :title="editing === null ? 'Add employee' : 'Edit employee'"
        @close="closeForm"
      >
        <EmployeeForm
          :loading="submitting"
          :error="formError"
          :agencies="agencyOptions"
          :employee="editing"
          @submit="submitEmployee"
          @cancel="closeForm"
        />
      </Modal>
    </div>
  </AppShell>
</template>

<style scoped>
.employees {
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

.employees-table {
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

.cell-document {
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
