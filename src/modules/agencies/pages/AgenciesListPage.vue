<script setup lang="ts">
import { onMounted } from 'vue'
import { Building2, CheckCircle, Plus, Search } from 'lucide-vue-next'

import AppShell from '@/core/components/AppShell.vue'
import Badge from '@/core/components/Badge.vue'
import Button from '@/core/components/Button.vue'
import Card from '@/core/components/Card.vue'
import DataTable from '@/core/components/DataTable.vue'
import Input from '@/core/components/Input.vue'
import ListState from '@/core/components/ListState.vue'
import Modal from '@/core/components/Modal.vue'
import Pagination from '@/core/components/Pagination.vue'
import { EMPTY_VALUE, formatText } from '@/core/utils/format'

import { useAgenciesTable } from '../composables/useAgenciesTable'
import AgencyForm from '../components/AgencyForm.vue'

/**
 * Agencias: sucursales donde se originan y reciben los envíos.
 *
 * `GET /agencies` devuelve la lista entera (el backend ya la filtra por ámbito
 * cuando el rol no es nacional), así que el buscador es local.
 *
 * La lógica vive en `composables/useAgenciesTable.ts`, el estado de datos en
 * `stores/useAgenciesStore.ts` y las llamadas HTTP en `api/agencies.api.ts`.
 */

const {
  PER_PAGE,
  agencies,
  canCreate,
  search,
  page,
  filtered,
  visibleRows,
  lastPage,
  activeCount,
  emptyText,
  columns,
  showForm,
  submitting,
  formError,
  openForm,
  closeForm,
  submitAgency,
} = useAgenciesTable()

onMounted(() => {
  void agencies.load()
})
</script>

<template>
  <AppShell>
    <div class="agencies">
      <div class="page-header">
        <div>
          <h1 class="page-title">Agencies</h1>
          <p class="page-subtitle">Branches where shipments are dropped off and collected</p>
        </div>
        <Button v-if="canCreate" variant="primary" @click="openForm">
          <template #leading>
            <Plus :size="16" stroke-width="2" />
          </template>
          Add agency
        </Button>
      </div>

      <div class="stats-grid">
        <Card class="stat-card">
          <div class="stat-icon" style="background: oklch(58% 0.18 255)">
            <Building2 :size="20" stroke-width="2" />
          </div>
          <div class="stat-value">{{ agencies.data?.length ?? EMPTY_VALUE }}</div>
          <div class="stat-label">Agencies</div>
        </Card>
        <Card class="stat-card">
          <div class="stat-icon" style="background: oklch(62% 0.18 145)">
            <CheckCircle :size="20" stroke-width="2" />
          </div>
          <div class="stat-value">{{ activeCount }}</div>
          <div class="stat-label">Active</div>
        </Card>
      </div>

      <Card class="filters-card">
        <div class="filter-search">
          <Search :size="16" stroke-width="2" />
          <Input placeholder="Search agencies..." v-model="search" />
        </div>
      </Card>

      <Card class="table-card">
        <template #header>
          <div class="table-header">
            <h2 class="table-title">All agencies ({{ filtered.length }})</h2>
          </div>
        </template>

        <ListState
          :status="agencies.status"
          :error="agencies.error"
          :empty="visibleRows.length === 0"
          :empty-text="emptyText"
          @retry="agencies.load"
        >
          <DataTable :columns="columns" :data="visibleRows" class="agencies-table">
            <template #code="{ row }">
              <Badge variant="neutral">{{ formatText(row.code) }}</Badge>
            </template>
            <template #name="{ row }">{{ formatText(row.name) }}</template>
            <template #district="{ row }">{{ formatText(row.district) }}</template>
            <template #address="{ row }">{{ formatText(row.address) }}</template>
            <template #phone="{ row }">{{ formatText(row.phone) }}</template>
            <template #is_active="{ row }">
              <Badge :variant="row.is_active ? 'success' : 'neutral'" dot>
                {{ row.is_active ? 'Active' : 'Inactive' }}
              </Badge>
            </template>
          </DataTable>

          <Pagination
            :page="page"
            :last-page="lastPage"
            :total="filtered.length"
            :per-page="PER_PAGE"
            @update:page="page = $event"
          />
        </ListState>
      </Card>

      <Modal :visible="showForm" title="Add agency" @close="closeForm">
        <AgencyForm
          :loading="submitting"
          :error="formError"
          @submit="submitAgency"
          @cancel="closeForm"
        />
      </Modal>
    </div>
  </AppShell>
</template>

<style scoped>
.agencies {
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

.filter-search {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--muted);
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

.agencies-table {
  overflow-x: auto;
}
</style>
