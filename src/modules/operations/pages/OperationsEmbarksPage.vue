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

import DisembarkForm from '../components/DisembarkForm.vue'
import EmbarkForm from '../components/EmbarkForm.vue'
import { useAsyncAction } from '../composables/useAsyncAction'
import { EMBARK_COLUMNS, formatDateTime } from '../composables/useOperationsPresentation'
import { useOperationsStore } from '../stores/useOperationsStore'
import type { CreateEmbarkPayload, DisembarkPayload, Embark } from '../types/operations.types'

/**
 * Manifiestos de embarque y desembarque.
 *
 * La lista ya trae los paquetes (`with('items')` en el backend), así que el
 * detalle no hace otra petición. Crear y descargar sí son mutaciones y recargan
 * el listado.
 */

const store = useOperationsStore()
const auth = useAuthStore()
const { success } = useToast()
const { loading, error, run } = useAsyncAction()

const agencies = computed(() => auth.agencies)
const canEmbark = computed(() => auth.can('shipments.embark'))
const canDisembark = computed(() => auth.can('shipments.disembark'))

const agencyFilter = ref('')
const rows = computed(() => (store.embarks.data?.data ?? []) as Embark[])
const meta = computed(() => store.embarks.data?.meta)
const page = computed(() => store.embarksQuery.page ?? 1)

const showCreate = ref(false)
const showDisembark = ref(false)
const showDetail = ref(false)
const selected = ref<Embark | null>(null)
const formKey = ref(0)

function applyFilters(): void {
  store.updateEmbarksQuery({
    page: 1,
    agency: agencyFilter.value === '' ? undefined : Number(agencyFilter.value),
  })
}

function resetFilters(): void {
  agencyFilter.value = ''
  store.updateEmbarksQuery({ page: 1, agency: undefined })
}

function findEmbark(row: Record<string, unknown>): Embark | null {
  return rows.value.find((embark) => embark.id === Number(row.id)) ?? null
}

function openCreate(): void {
  error.value = null
  showCreate.value = true
}

function openDisembark(row: Record<string, unknown>): void {
  selected.value = findEmbark(row)
  error.value = null
  showDisembark.value = true
}

function openDetail(row: Record<string, unknown>): void {
  selected.value = findEmbark(row)
  showDetail.value = true
}

async function onCreate(payload: CreateEmbarkPayload): Promise<void> {
  const result = await run(() => store.createEmbark(payload))

  if (result) {
    success('Manifest created', 'The parcels are now embarked.')
    showCreate.value = false
    formKey.value += 1
  }
}

async function onDisembark(payload: DisembarkPayload): Promise<void> {
  if (selected.value === null) {
    return
  }

  const result = await run(() => store.disembark(selected.value?.id ?? 0, payload))

  if (result) {
    success('Manifest disembarked', 'The parcels arrived at the destination agency.')
    showDisembark.value = false
  }
}

function goToPage(next: number): void {
  store.updateEmbarksQuery({ page: next })
}

onMounted(() => {
  void store.embarks.load()
})
</script>

<template>
  <AppShell>
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Embarks</h1>
          <p class="page-subtitle">Load manifests and disembark them at destination or scale</p>
        </div>
        <Button v-if="canEmbark" variant="primary" @click="openCreate">
          <template #leading>
            <Plus :size="16" stroke-width="2" />
          </template>
          New manifest
        </Button>
      </div>

      <Card>
        <form class="filters" @submit.prevent="applyFilters">
          <label class="filter">
            <span>Origin agency</span>
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
              Manifests
              <span v-if="meta">({{ meta.total }})</span>
            </h2>
          </div>
        </template>

        <ListState
          :status="store.embarks.status"
          :error="store.embarks.error"
          :empty="rows.length === 0"
          empty-text="No manifests yet."
          @retry="store.embarks.load"
        >
          <DataTable :columns="EMBARK_COLUMNS" :data="rows">
            <template #id="{ row }">#{{ formatText(row.id) }}</template>
            <template #route_ref="{ row }">{{ formatText(row.route_ref) }}</template>
            <template #agency_id="{ row }">#{{ formatText(row.agency_id) }}</template>
            <template #vehicle_id="{ row }">#{{ formatText(row.vehicle_id) }}</template>
            <template #driver_id="{ row }">#{{ formatText(row.driver_id) }}</template>
            <template #items_count="{ row }">{{ formatText(row.items_count) }}</template>
            <template #departed_at="{ row }">{{ formatDateTime(row.departed_at) }}</template>
            <template #actions="{ row }">
              <div class="row-actions">
                <Button variant="ghost" size="sm" @click="openDetail(row)">Details</Button>
                <Button
                  v-if="canDisembark"
                  variant="secondary"
                  size="sm"
                  @click="openDisembark(row)"
                >
                  Disembark
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

    <Modal :visible="showCreate" title="New manifest" @close="showCreate = false">
      <EmbarkForm
        :key="formKey"
        :agencies="agencies"
        :loading="loading"
        :error="error"
        @submit="onCreate"
        @cancel="showCreate = false"
      />
    </Modal>

    <Modal
      :visible="showDisembark && selected !== null"
      title="Disembark manifest"
      @close="showDisembark = false"
    >
      <DisembarkForm
        v-if="selected"
        :embark="selected"
        :agencies="agencies"
        :loading="loading"
        :error="error"
        @submit="onDisembark"
        @cancel="showDisembark = false"
      />
    </Modal>

    <Modal
      :visible="showDetail && selected !== null"
      title="Manifest detail"
      @close="showDetail = false"
    >
      <div v-if="selected" class="detail">
        <dl class="detail-grid">
          <div>
            <dt>Manifest</dt>
            <dd>#{{ selected.id }}</dd>
          </div>
          <div>
            <dt>Route</dt>
            <dd>{{ formatText(selected.route_ref) }}</dd>
          </div>
          <div>
            <dt>Agency</dt>
            <dd>#{{ selected.agency_id }}</dd>
          </div>
          <div>
            <dt>Vehicle</dt>
            <dd>#{{ selected.vehicle_id }}</dd>
          </div>
          <div>
            <dt>Driver</dt>
            <dd>#{{ selected.driver_id }}</dd>
          </div>
          <div>
            <dt>Departed</dt>
            <dd>{{ formatDateTime(selected.departed_at) }}</dd>
          </div>
        </dl>

        <h3 class="detail-title">Parcels</h3>
        <ul class="detail-list">
          <li v-for="item in selected.items ?? []" :key="item.id">
            <strong>{{ item.ticket_code }}</strong>
            <span class="muted">{{ item.scan_id ?? 'No scan id' }}</span>
          </li>
        </ul>
      </div>
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

.detail {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  margin: 0;
}

.detail-grid dt {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--muted);
}

.detail-grid dd {
  margin: 2px 0 0;
  font-size: 13px;
  color: var(--fg);
}

.detail-title {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
}

.detail-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 260px;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  list-style: none;
}

.detail-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 10px;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 13px;
}

.muted {
  font-size: 11px;
  color: var(--muted);
}
</style>
