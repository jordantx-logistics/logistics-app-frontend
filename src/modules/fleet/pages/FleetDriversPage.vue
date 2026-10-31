<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Pencil, Plus } from 'lucide-vue-next'

import AppShell from '@/core/components/AppShell.vue'
import Badge from '@/core/components/Badge.vue'
import Button from '@/core/components/Button.vue'
import Card from '@/core/components/Card.vue'
import DataTable from '@/core/components/DataTable.vue'
import ListState from '@/core/components/ListState.vue'
import Modal from '@/core/components/Modal.vue'
import Pagination from '@/core/components/Pagination.vue'
import type { Column } from '@/core/components/types'
import { formatText } from '@/core/utils/format'

import DriverForm from '../components/DriverForm.vue'
import { dateOnly, DRIVER_STATUS_VARIANTS, label } from '../composables/useFleetPresentation'
import '../fleet.css'
import { useFleetStore } from '../stores/useFleetStore'
import type { Driver } from '../types/fleet.types'

/** Fichas de los choferes. */

const store = useFleetStore()

const modal = ref(false)
const editing = ref<Driver | null>(null)
const status = ref('')

const drivers = computed(() => store.drivers.data?.rows ?? [])
const meta = computed(() => store.drivers.data?.meta)

const COLUMNS: Column[] = [
  { key: 'id', label: 'Driver' },
  { key: 'user_id', label: 'User' },
  { key: 'license_number', label: 'License' },
  { key: 'license_expires_at', label: 'Expires' },
  { key: 'home_agency_id', label: 'Agency' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: '' },
]

/** La licencia vencida se resalta: ese chofer no se podrá asignar. */
function isExpired(value: unknown): boolean {
  return typeof value === 'string' && value < new Date().toISOString().slice(0, 10)
}

function applyFilters(): void {
  void store.setDriversQuery({ page: 1, status: status.value === '' ? undefined : status.value })
}

function goToPage(page: number): void {
  void store.setDriversQuery({ ...store.driversQuery, page })
}

function openCreate(): void {
  editing.value = null
  modal.value = true
}

function openEdit(row: Driver): void {
  editing.value = row
  modal.value = true
}

onMounted(() => {
  void store.drivers.load()
})
</script>

<template>
  <AppShell>
    <div class="fleet-page">
      <div class="fleet-header">
        <div>
          <h1 class="fleet-title">Drivers</h1>
          <p class="fleet-subtitle">Licenses and availability for trunk routes</p>
        </div>
        <Button @click="openCreate">
          <template #leading><Plus :size="16" /></template>
          New driver
        </Button>
      </div>

      <Card>
        <form class="fleet-filters" @submit.prevent="applyFilters">
          <label class="fleet-filter">
            <span>Status</span>
            <select v-model="status" @change="applyFilters">
              <option value="">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </label>
        </form>
      </Card>

      <Card title="Drivers">
        <ListState
          :status="store.drivers.status"
          :error="store.drivers.error"
          :empty="drivers.length === 0"
          empty-text="No drivers match this filter."
          @retry="store.drivers.load"
        >
          <DataTable :columns="COLUMNS" :data="drivers">
            <template #id="{ row }">#{{ row.id }}</template>
            <template #user_id="{ row }">#{{ row.user_id }}</template>
            <template #license_number="{ row }">
              <span class="fleet-mono">{{ formatText(row.license_number) }}</span>
              · {{ formatText(row.license_category) }}
            </template>
            <template #license_expires_at="{ row }">
              <Badge v-if="isExpired(row.license_expires_at)" variant="danger">
                {{ dateOnly(row.license_expires_at) }}
              </Badge>
              <template v-else>{{ dateOnly(row.license_expires_at) }}</template>
            </template>
            <template #home_agency_id="{ row }">#{{ row.home_agency_id }}</template>
            <template #status="{ row }">
              <Badge :variant="DRIVER_STATUS_VARIANTS[String(row.status)] ?? 'neutral'">
                {{ label(row.status) }}
              </Badge>
            </template>
            <template #actions="{ row }">
              <button class="fleet-link" @click="openEdit(row as Driver)">
                <Pencil :size="13" />
                Edit
              </button>
            </template>
          </DataTable>

          <Pagination
            :page="meta?.current_page ?? 1"
            :last-page="meta?.last_page ?? 1"
            :total="meta?.total ?? drivers.length"
            :per-page="meta?.per_page ?? 15"
            @update:page="goToPage"
          />
        </ListState>
      </Card>
    </div>

    <Modal :visible="modal" :title="editing ? 'Edit driver' : 'New driver'" @close="modal = false">
      <DriverForm
        v-if="modal"
        :driver="editing ?? undefined"
        @saved="modal = false"
        @cancel="modal = false"
      />
    </Modal>
  </AppShell>
</template>
