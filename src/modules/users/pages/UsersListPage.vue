<script setup lang="ts">
import { onMounted } from 'vue'
import { KeyRound, Plus, Search, ShieldCheck, UserCheck, Users } from 'lucide-vue-next'

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

import { isLocked, useUsersTable } from '../composables/useUsersTable'
import UserForm from '../components/UserForm.vue'

/**
 * Usuarios: alta (UC-01), estado (UC-06) y desbloqueo (UC-07).
 *
 * `GET /users` pagina y filtra en el **backend**, así que cada cambio de filtro
 * o de página vuelve a pedir el listado; el `meta` del paginador alimenta el
 * `Pagination`.
 */

const {
  PER_PAGE,
  users,
  agencyOptions,
  loadAgencies,
  canManage,
  search,
  status,
  statusOptions,
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
  showForm,
  submitting,
  formError,
  openForm,
  closeForm,
  submitUser,
  actingId,
  setStatus,
  unlock,
} = useUsersTable()

onMounted(() => {
  reload()
  loadAgencies()
})

/** Lista de valores (`roles`) tal como llega del contrato: `unknown[]`. */
function joinList(value: unknown): string {
  return Array.isArray(value) && value.length > 0 ? value.join(', ') : EMPTY_VALUE
}

/** Nombres de las agencias del ámbito, que llegan como `unknown[]`. */
function agencyNames(value: unknown): string {
  if (!Array.isArray(value) || value.length === 0) {
    return EMPTY_VALUE
  }

  const names = value
    .map((agency) => String((agency as { name?: unknown }).name ?? ''))
    .filter((name) => name !== '')

  return names.length === 0 ? EMPTY_VALUE : names.join(', ')
}
</script>

<template>
  <AppShell>
    <div class="users">
      <div class="page-header">
        <div>
          <h1 class="page-title">Users</h1>
          <p class="page-subtitle">Accounts, roles and agency scope</p>
        </div>
        <Button v-if="canManage" variant="primary" @click="openForm">
          <template #leading>
            <Plus :size="16" stroke-width="2" />
          </template>
          Add user
        </Button>
      </div>

      <div class="stats-grid">
        <Card class="stat-card">
          <div class="stat-icon" style="background: oklch(58% 0.18 255)">
            <Users :size="20" stroke-width="2" />
          </div>
          <div class="stat-value">{{ total }}</div>
          <div class="stat-label">Users</div>
        </Card>
        <Card class="stat-card">
          <div class="stat-icon" style="background: oklch(62% 0.18 145)">
            <UserCheck :size="20" stroke-width="2" />
          </div>
          <div class="stat-value">{{ activeCount }}</div>
          <div class="stat-label">Active on page</div>
        </Card>
      </div>

      <Card class="filters-card">
        <form class="filters" @submit.prevent="submitSearch">
          <div class="filter-search">
            <Search :size="16" stroke-width="2" />
            <Input placeholder="Search by name or email..." v-model="search" />
          </div>
          <div class="filter-status">
            <Select v-model="status" :options="statusOptions" placeholder="Filter by status" />
          </div>
          <Button variant="secondary" @click="submitSearch">Search</Button>
        </form>
      </Card>

      <Card class="table-card">
        <template #header>
          <div class="table-header">
            <h2 class="table-title">All users ({{ total }})</h2>
          </div>
        </template>

        <ListState
          :status="users.status"
          :error="users.error"
          :empty="rows.length === 0"
          :empty-text="emptyText"
          @retry="reload"
        >
          <DataTable :columns="columns" :data="rows" class="users-table">
            <template #name="{ row }">
              <div class="cell-user">
                <span class="cell-name">{{ formatText(row.name) }}</span>
                <span class="cell-email">{{ formatText(row.email) }}</span>
              </div>
            </template>
            <template #status="{ row }">
              <Badge
                :variant="
                  row.status === 'active'
                    ? 'success'
                    : row.status === 'suspended'
                      ? 'warning'
                      : 'neutral'
                "
                dot
              >
                {{ formatText(row.status) }}
              </Badge>
            </template>
            <template #roles="{ row }">{{ joinList(row.roles) }}</template>
            <template #agencies="{ row }">{{ agencyNames(row.agencies) }}</template>
            <template #last_login_at="{ row }">{{ formatDate(row.last_login_at) }}</template>
            <template #actions="{ row }">
              <div class="row-actions">
                <Button
                  v-if="isLocked(row.locked_until)"
                  variant="ghost"
                  size="sm"
                  :loading="actingId === Number(row.id)"
                  @click="unlock(Number(row.id))"
                >
                  <template #leading>
                    <KeyRound :size="14" stroke-width="2" />
                  </template>
                  Unlock
                </Button>
                <Button
                  v-else-if="row.status === 'active'"
                  variant="ghost"
                  size="sm"
                  :loading="actingId === Number(row.id)"
                  @click="setStatus(Number(row.id), 'suspended')"
                >
                  Suspend
                </Button>
                <Button
                  v-else-if="row.status === 'suspended'"
                  variant="ghost"
                  size="sm"
                  :loading="actingId === Number(row.id)"
                  @click="setStatus(Number(row.id), 'active')"
                >
                  <template #leading>
                    <ShieldCheck :size="14" stroke-width="2" />
                  </template>
                  Reactivate
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

      <Modal :visible="showForm" title="Add user" @close="closeForm">
        <UserForm
          :loading="submitting"
          :error="formError"
          :agencies="agencyOptions"
          @submit="submitUser"
          @cancel="closeForm"
        />
      </Modal>
    </div>
  </AppShell>
</template>

<style scoped>
.users {
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

.filter-status {
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

.users-table {
  overflow-x: auto;
}

.cell-user {
  display: flex;
  flex-direction: column;
}

.cell-name {
  font-weight: 500;
  color: var(--fg);
}

.cell-email {
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
