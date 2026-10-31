<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Gauge, Plus } from 'lucide-vue-next'

import { ApiError } from '@/core/api/errors'
import AppShell from '@/core/components/AppShell.vue'
import Badge from '@/core/components/Badge.vue'
import Button from '@/core/components/Button.vue'
import Card from '@/core/components/Card.vue'
import DataTable from '@/core/components/DataTable.vue'
import ListState from '@/core/components/ListState.vue'
import Modal from '@/core/components/Modal.vue'
import Pagination from '@/core/components/Pagination.vue'
import type { Column } from '@/core/components/types'
import { useToast } from '@/core/composables/useToast'
import { formatText } from '@/core/utils/format'

import * as fleetApi from '../api/fleet.api'
import OdometerCorrectionForm from '../components/OdometerCorrectionForm.vue'
import VehicleForm from '../components/VehicleForm.vue'
import { km, label, VEHICLE_STATUS_VARIANTS } from '../composables/useFleetPresentation'
import '../fleet.css'
import { useFleetStore } from '../stores/useFleetStore'
import type { Vehicle } from '../types/fleet.types'

/** Vehículos, su estado y la corrección auditada del odómetro. */

const store = useFleetStore()
const toast = useToast()

const createModal = ref(false)
const correcting = ref<Vehicle | null>(null)
const status = ref('')

const vehicles = computed(() => store.vehicles.data?.rows ?? [])
const meta = computed(() => store.vehicles.data?.meta)

const COLUMNS: Column[] = [
  { key: 'plate', label: 'Plate' },
  { key: 'type', label: 'Type' },
  { key: 'capacity_kg', label: 'Capacity' },
  { key: 'owner_agency_id', label: 'Agency' },
  { key: 'odometer_km', label: 'Odometer' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: '' },
]

function applyFilters(): void {
  void store.setVehiclesQuery({ page: 1, status: status.value === '' ? undefined : status.value })
}

function goToPage(page: number): void {
  void store.setVehiclesQuery({ ...store.vehiclesQuery, page })
}

async function changeStatus(row: Vehicle, next: string): Promise<void> {
  try {
    await store.act(() => fleetApi.updateVehicleStatus(row.id, next), store.vehicles.load)
    toast.success('Vehicle status updated', `${row.plate} is now ${label(next)}.`)
  } catch (caught) {
    toast.error(
      'Could not change the status',
      caught instanceof ApiError ? caught.message : undefined,
    )
  }
}

onMounted(() => {
  void store.vehicles.load()
})
</script>

<template>
  <AppShell>
    <div class="fleet-page">
      <div class="fleet-header">
        <div>
          <h1 class="fleet-title">Vehicles</h1>
          <p class="fleet-subtitle">Status, capacity and last odometer reading</p>
        </div>
        <Button @click="createModal = true">
          <template #leading><Plus :size="16" /></template>
          New vehicle
        </Button>
      </div>

      <Card>
        <form class="fleet-filters" @submit.prevent="applyFilters">
          <label class="fleet-filter">
            <span>Status</span>
            <select v-model="status" @change="applyFilters">
              <option value="">All statuses</option>
              <option value="available">Available</option>
              <option value="on_route">On route</option>
              <option value="maintenance">Maintenance</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
        </form>
      </Card>

      <Card title="Vehicles">
        <ListState
          :status="store.vehicles.status"
          :error="store.vehicles.error"
          :empty="vehicles.length === 0"
          empty-text="No vehicles match this filter."
          @retry="store.vehicles.load"
        >
          <DataTable :columns="COLUMNS" :data="vehicles">
            <template #plate="{ row }">
              <span class="fleet-mono">{{ formatText(row.plate) }}</span>
            </template>
            <template #type="{ row }">{{ label(row.type) }}</template>
            <template #capacity_kg="{ row }"
              >{{ row.capacity_kg }} kg · {{ row.capacity_m3 }} m³</template
            >
            <template #owner_agency_id="{ row }">#{{ row.owner_agency_id }}</template>
            <template #odometer_km="{ row }">{{ km(row.odometer_km) }}</template>
            <template #status="{ row }">
              <Badge :variant="VEHICLE_STATUS_VARIANTS[String(row.status)] ?? 'neutral'">
                {{ label(row.status) }}
              </Badge>
            </template>
            <template #actions="{ row }">
              <div class="fleet-actions">
                <template v-if="row.status !== 'on_route'">
                  <button
                    v-if="row.status !== 'available'"
                    class="fleet-link"
                    :disabled="store.saving"
                    @click="changeStatus(row as Vehicle, 'available')"
                  >
                    Available
                  </button>
                  <button
                    v-if="row.status !== 'maintenance'"
                    class="fleet-link"
                    :disabled="store.saving"
                    @click="changeStatus(row as Vehicle, 'maintenance')"
                  >
                    Maintenance
                  </button>
                  <button
                    v-if="row.status !== 'inactive'"
                    class="fleet-link"
                    :disabled="store.saving"
                    @click="changeStatus(row as Vehicle, 'inactive')"
                  >
                    Deactivate
                  </button>
                </template>
                <button class="fleet-link" @click="correcting = row as Vehicle">
                  <Gauge :size="13" />
                  Correct
                </button>
              </div>
            </template>
          </DataTable>

          <Pagination
            :page="meta?.current_page ?? 1"
            :last-page="meta?.last_page ?? 1"
            :total="meta?.total ?? vehicles.length"
            :per-page="meta?.per_page ?? 15"
            @update:page="goToPage"
          />
        </ListState>
      </Card>
    </div>

    <Modal :visible="createModal" title="New vehicle" @close="createModal = false">
      <VehicleForm v-if="createModal" @saved="createModal = false" @cancel="createModal = false" />
    </Modal>

    <Modal :visible="correcting !== null" title="Correct odometer" @close="correcting = null">
      <OdometerCorrectionForm
        v-if="correcting"
        :vehicle="correcting"
        @saved="correcting = null"
        @cancel="correcting = null"
      />
    </Modal>
  </AppShell>
</template>
