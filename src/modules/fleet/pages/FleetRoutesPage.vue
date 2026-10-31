<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Plus } from 'lucide-vue-next'

import { ApiError } from '@/core/api/errors'
import AppShell from '@/core/components/AppShell.vue'
import Badge from '@/core/components/Badge.vue'
import Button from '@/core/components/Button.vue'
import Card from '@/core/components/Card.vue'
import DataTable from '@/core/components/DataTable.vue'
import FormField from '@/core/components/FormField.vue'
import Input from '@/core/components/Input.vue'
import ListState from '@/core/components/ListState.vue'
import Modal from '@/core/components/Modal.vue'
import Pagination from '@/core/components/Pagination.vue'
import type { Column } from '@/core/components/types'
import { useAuth } from '@/core/composables/useAuth'
import { useToast } from '@/core/composables/useToast'
import { formatText } from '@/core/utils/format'

import * as fleetApi from '../api/fleet.api'
import AssignRouteForm from '../components/AssignRouteForm.vue'
import RouteDetail from '../components/RouteDetail.vue'
import RouteForm from '../components/RouteForm.vue'
import { dateTime, km, label, ROUTE_STATUS_VARIANTS } from '../composables/useFleetPresentation'
import '../fleet.css'
import { useFleetStore } from '../stores/useFleetStore'
import type { FleetRoute } from '../types/fleet.types'

/** Programación de rutas troncales, por salida planificada. */

const store = useFleetStore()
const toast = useToast()
const { can } = useAuth()

const createModal = ref(false)
const assigning = ref<FleetRoute | null>(null)
const cancelling = ref<FleetRoute | null>(null)
const cancelReason = ref('')
const viewingId = ref<number | null>(null)

const status = ref('')
const from = ref('')
const to = ref('')
const ticket = ref('')

const routes = computed(() => store.routes.data?.rows ?? [])
const meta = computed(() => store.routes.data?.meta)

const COLUMNS: Column[] = [
  { key: 'ticket_number', label: 'Route' },
  { key: 'origin_agency_id', label: 'Agencies' },
  { key: 'planned_departure_at', label: 'Departure' },
  { key: 'driver_id', label: 'Driver / vehicle' },
  { key: 'computed_km', label: 'Distance' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: '' },
]

function applyFilters(): void {
  void store.setRoutesQuery({
    page: 1,
    status: status.value === '' ? undefined : status.value,
    departure_from: from.value === '' ? undefined : from.value,
    departure_to: to.value === '' ? undefined : to.value,
    ticket_number: ticket.value.trim() === '' ? undefined : ticket.value.trim().toUpperCase(),
  })
}

function resetFilters(): void {
  status.value = ''
  from.value = ''
  to.value = ''
  ticket.value = ''
  void store.setRoutesQuery({ page: 1 })
}

function goToPage(page: number): void {
  void store.setRoutesQuery({ ...store.routesQuery, page })
}

function canAssign(row: Record<string, unknown>): boolean {
  return can('routes.manage') && (row.status === 'planned' || row.status === 'assigned')
}

function openCancel(row: FleetRoute): void {
  cancelReason.value = ''
  cancelling.value = row
}

async function confirmCancel(): Promise<void> {
  const route = cancelling.value

  if (route === null) {
    return
  }

  try {
    await store.act(
      () => fleetApi.cancelRoute(route.id, cancelReason.value.trim()),
      store.routes.load,
    )
    toast.success('Route cancelled', `${route.ticket_number} will not run.`)
    cancelling.value = null
  } catch (caught) {
    toast.error(
      'Could not cancel the route',
      caught instanceof ApiError ? caught.message : undefined,
    )
  }
}

onMounted(() => {
  void store.routes.load()
})
</script>

<template>
  <AppShell>
    <div class="fleet-page">
      <div class="fleet-header">
        <div>
          <h1 class="fleet-title">Routes</h1>
          <p class="fleet-subtitle">Trunk routes between agencies, by planned departure</p>
        </div>
        <Button v-if="can('routes.manage')" @click="createModal = true">
          <template #leading><Plus :size="16" /></template>
          Plan route
        </Button>
      </div>

      <Card>
        <form class="fleet-filters" @submit.prevent="applyFilters">
          <label class="fleet-filter">
            <span>Status</span>
            <select v-model="status">
              <option value="">All statuses</option>
              <option value="planned">Planned</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In progress</option>
              <option value="finished">Finished</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </label>

          <label class="fleet-filter">
            <span>Departure from</span>
            <input v-model="from" type="date" />
          </label>

          <label class="fleet-filter">
            <span>Departure to</span>
            <input v-model="to" type="date" />
          </label>

          <label class="fleet-filter">
            <span>Route number</span>
            <input v-model="ticket" placeholder="RUT-2026-000001" />
          </label>

          <div class="fleet-filter-actions">
            <button type="button" class="fleet-link" @click="resetFilters">Clear</button>
            <Button type="submit">Apply</Button>
          </div>
        </form>
      </Card>

      <Card title="Routes">
        <ListState
          :status="store.routes.status"
          :error="store.routes.error"
          :empty="routes.length === 0"
          empty-text="No routes match these filters."
          @retry="store.routes.load"
        >
          <DataTable :columns="COLUMNS" :data="routes">
            <template #ticket_number="{ row }">
              <span class="fleet-mono">{{ formatText(row.ticket_number) }}</span>
            </template>
            <template #origin_agency_id="{ row }">
              #{{ row.origin_agency_id }} → #{{ row.destination_agency_id }}
            </template>
            <template #planned_departure_at="{ row }">{{
              dateTime(row.planned_departure_at)
            }}</template>
            <template #driver_id="{ row }">
              <template v-if="row.driver_id">#{{ row.driver_id }} / #{{ row.vehicle_id }}</template>
              <template v-else>Unassigned</template>
            </template>
            <template #computed_km="{ row }">{{ km(row.computed_km) }}</template>
            <template #status="{ row }">
              <Badge :variant="ROUTE_STATUS_VARIANTS[String(row.status)] ?? 'neutral'">
                {{ label(row.status) }}
              </Badge>
            </template>
            <template #actions="{ row }">
              <div class="fleet-actions">
                <button class="fleet-link" @click="viewingId = Number(row.id)">Open</button>
                <button
                  v-if="canAssign(row)"
                  class="fleet-link"
                  @click="assigning = row as FleetRoute"
                >
                  Assign
                </button>
                <button
                  v-if="canAssign(row)"
                  class="fleet-link danger"
                  @click="openCancel(row as FleetRoute)"
                >
                  Cancel
                </button>
              </div>
            </template>
          </DataTable>

          <Pagination
            :page="meta?.current_page ?? 1"
            :last-page="meta?.last_page ?? 1"
            :total="meta?.total ?? routes.length"
            :per-page="meta?.per_page ?? 15"
            @update:page="goToPage"
          />
        </ListState>
      </Card>
    </div>

    <Modal :visible="createModal" title="Plan route" @close="createModal = false">
      <RouteForm v-if="createModal" @saved="createModal = false" @cancel="createModal = false" />
    </Modal>

    <Modal :visible="assigning !== null" title="Assign route" @close="assigning = null">
      <AssignRouteForm
        v-if="assigning"
        :route="assigning"
        @saved="assigning = null"
        @cancel="assigning = null"
      />
    </Modal>

    <Modal :visible="viewingId !== null" title="Route" @close="viewingId = null">
      <RouteDetail v-if="viewingId !== null" :route-id="viewingId" />
    </Modal>

    <Modal :visible="cancelling !== null" title="Cancel route" @close="cancelling = null">
      <form class="fleet-form" @submit.prevent="confirmCancel">
        <FormField label="Reason">
          <Input v-model="cancelReason" placeholder="Vehicle breakdown" />
        </FormField>

        <div class="fleet-form-actions">
          <Button variant="secondary" type="button" @click="cancelling = null">Keep route</Button>
          <Button type="submit" :loading="store.saving" :disabled="cancelReason.trim() === ''">
            Cancel route
          </Button>
        </div>
      </form>
    </Modal>
  </AppShell>
</template>
