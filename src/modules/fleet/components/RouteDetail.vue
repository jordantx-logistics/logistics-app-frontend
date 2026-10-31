<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { AlertTriangle, CheckCircle2, Download } from 'lucide-vue-next'

import { ApiError } from '@/core/api/errors'
import Badge from '@/core/components/Badge.vue'
import Button from '@/core/components/Button.vue'
import FormField from '@/core/components/FormField.vue'
import Input from '@/core/components/Input.vue'
import ListState from '@/core/components/ListState.vue'
import { useAsyncData } from '@/core/composables/useAsyncData'
import { useAuth } from '@/core/composables/useAuth'
import { useToast } from '@/core/composables/useToast'
import { saveBlob } from '@/core/utils/download'
import { formatText } from '@/core/utils/format'

import * as fleetApi from '../api/fleet.api'
import {
  dateTime,
  km,
  label,
  money,
  ROUTE_STATUS_VARIANTS,
} from '../composables/useFleetPresentation'
import { useFleetStore } from '../stores/useFleetStore'
import type { MileageLog, RouteSegment } from '../types/fleet.types'

/** Detalle de una ruta: ejecución, tramos, lecturas de odómetro, coste y consumo. */
const props = defineProps<{
  routeId: number
}>()

const store = useFleetStore()
const toast = useToast()
const { can } = useAuth()

const detail = useAsyncData(() => fleetApi.getRoute(props.routeId))
const summary = useAsyncData(() => fleetApi.getRouteSummary(props.routeId))

const route = computed(() => detail.data.value)
const reading = reactive({ odometer_km: '' })
const photo = ref<File | null>(null)
const error = ref<ApiError | null>(null)

const canExecute = computed(() => can('routes.execute'))
const inProgress = computed(() => route.value?.status === 'in_progress')
const canStart = computed(() => canExecute.value && route.value?.status === 'assigned')

/** Solo el siguiente tramo pendiente se puede completar: van en orden. */
const nextSegmentId = computed(
  () => route.value?.segments.find((segment) => segment.status === 'pending')?.id,
)

async function reload(): Promise<void> {
  await Promise.all([detail.load(), summary.load(), store.routes.load()])
}

async function run(action: () => Promise<unknown>, done: string): Promise<boolean> {
  error.value = null

  try {
    await store.act(action, reload)
    toast.success(done)

    return true
  } catch (caught) {
    error.value = caught instanceof ApiError ? caught : null
    toast.error('The action failed', error.value?.message)

    return false
  }
}

function clearReading(): void {
  reading.odometer_km = ''
  photo.value = null
}

async function start(): Promise<void> {
  const odometer = Number(reading.odometer_km)

  if (
    await run(() => fleetApi.startRoute(props.routeId, { odometer_km: odometer }), 'Route started')
  ) {
    clearReading()
  }
}

async function finish(): Promise<void> {
  const odometer = Number(reading.odometer_km)

  if (
    await run(
      () => fleetApi.finishRoute(props.routeId, { odometer_km: odometer }),
      'Route finished',
    )
  ) {
    clearReading()
  }
}

async function registerReading(): Promise<void> {
  const input = {
    odometer_km: Number(reading.odometer_km),
    photo: photo.value,
    idempotency_key: crypto.randomUUID(),
  }

  if (await run(() => fleetApi.registerMileage(props.routeId, input), 'Reading registered')) {
    clearReading()
  }
}

function completeSegment(segment: RouteSegment): void {
  void run(
    () => fleetApi.completeSegment(props.routeId, segment.id),
    `Segment ${segment.sequence} completed`,
  )
}

function onPhotoChange(event: Event): void {
  photo.value = (event.target as HTMLInputElement).files?.[0] ?? null
}

async function downloadPhoto(log: MileageLog): Promise<void> {
  try {
    saveBlob(await fleetApi.downloadMileagePhoto(props.routeId, log.id), `odometer-${log.id}`)
  } catch (caught) {
    toast.error(
      'Could not download the photo',
      caught instanceof ApiError ? caught.message : undefined,
    )
  }
}

onMounted(() => {
  void reload()
})
</script>

<template>
  <ListState :status="detail.status.value" :error="detail.error.value" @retry="detail.load">
    <div v-if="route" class="detail">
      <div class="heading">
        <span class="fleet-mono">{{ route.ticket_number }}</span>
        <Badge :variant="ROUTE_STATUS_VARIANTS[route.status ?? ''] ?? 'neutral'">
          {{ label(route.status) }}
        </Badge>
      </div>

      <dl class="facts">
        <div>
          <dt>Agencies</dt>
          <dd>#{{ route.origin_agency_id }} → #{{ route.destination_agency_id }}</dd>
        </div>
        <div>
          <dt>Driver / vehicle</dt>
          <dd>#{{ formatText(route.driver_id) }} / #{{ formatText(route.vehicle_id) }}</dd>
        </div>
        <div>
          <dt>Planned departure</dt>
          <dd>{{ dateTime(route.planned_departure_at) }}</dd>
        </div>
        <div>
          <dt>Started</dt>
          <dd>{{ dateTime(route.started_at) }}</dd>
        </div>
        <div>
          <dt>Finished</dt>
          <dd>{{ dateTime(route.finished_at) }}</dd>
        </div>
        <div v-if="route.cancel_reason">
          <dt>Cancelled because</dt>
          <dd>{{ route.cancel_reason }}</dd>
        </div>
      </dl>

      <section v-if="summary.data.value" aria-label="Cost and consumption">
        <h3 class="section-title">Cost and consumption</h3>
        <dl class="facts">
          <div>
            <dt>Distance</dt>
            <dd>{{ km(summary.data.value.km) }}</dd>
          </div>
          <div>
            <dt>Consumption</dt>
            <dd class="consumption">
              {{
                summary.data.value.km_per_liter === null
                  ? '—'
                  : `${summary.data.value.km_per_liter} km/L`
              }}
              <Badge v-if="summary.data.value.is_anomalous" variant="danger">
                <AlertTriangle :size="12" />
                Out of range
              </Badge>
            </dd>
          </div>
          <div>
            <dt>Fuel</dt>
            <dd>{{ money(summary.data.value.fuel_cost) }} ({{ summary.data.value.liters }} L)</dd>
          </div>
          <div>
            <dt>Per diem</dt>
            <dd>{{ money(summary.data.value.per_diem_cost) }}</dd>
          </div>
          <div>
            <dt>Total cost</dt>
            <dd>{{ money(summary.data.value.total_cost) }}</dd>
          </div>
          <div>
            <dt>Cost per km</dt>
            <dd>
              {{
                summary.data.value.cost_per_km === null
                  ? '—'
                  : money(summary.data.value.cost_per_km)
              }}
            </dd>
          </div>
        </dl>
      </section>

      <section aria-label="Segments">
        <h3 class="section-title">Segments</h3>
        <ol class="rows">
          <li v-for="segment in route.segments" :key="segment.id" class="row">
            <span
              >{{ segment.sequence }}. #{{ segment.from_agency_id }} → #{{ segment.to_agency_id }} ·
              {{ km(segment.distance_km) }}</span
            >
            <Badge v-if="segment.status === 'completed'" variant="success">completed</Badge>
            <button
              v-else-if="canExecute && inProgress && segment.id === nextSegmentId"
              class="fleet-link"
              :disabled="store.saving"
              @click="completeSegment(segment)"
            >
              <CheckCircle2 :size="14" />
              Complete
            </button>
            <Badge v-else variant="neutral">pending</Badge>
          </li>
        </ol>
      </section>

      <section v-if="route.mileage_logs.length > 0" aria-label="Odometer readings">
        <h3 class="section-title">Odometer readings</h3>
        <ul class="rows">
          <li v-for="log in route.mileage_logs" :key="log.id" class="row">
            <span>{{ km(log.odometer_km) }} · {{ dateTime(log.recorded_at) }}</span>
            <button v-if="log.has_photo" class="fleet-link" @click="downloadPhoto(log)">
              <Download :size="14" />
              Photo
            </button>
          </li>
        </ul>
      </section>

      <form v-if="canStart || (canExecute && inProgress)" class="fleet-form" @submit.prevent>
        <FormField label="Odometer (km)" :error="error?.fieldError('odometer_km')">
          <Input v-model="reading.odometer_km" type="number" placeholder="153200" />
        </FormField>

        <FormField v-if="inProgress" label="Photo (optional)" :error="error?.fieldError('photo')">
          <input
            class="fleet-control"
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            @change="onPhotoChange"
          />
        </FormField>

        <p v-if="error && !error.isValidationError" class="fleet-form-error">{{ error.message }}</p>

        <div class="fleet-form-actions">
          <Button
            v-if="canStart"
            type="button"
            :loading="store.saving"
            :disabled="reading.odometer_km === ''"
            @click="start"
          >
            Start route
          </Button>
          <template v-else>
            <Button
              variant="secondary"
              type="button"
              :disabled="reading.odometer_km === '' || store.saving"
              @click="registerReading"
            >
              Register reading
            </Button>
            <Button
              type="button"
              :loading="store.saving"
              :disabled="reading.odometer_km === ''"
              @click="finish"
            >
              Finish route
            </Button>
          </template>
        </div>
      </form>
    </div>
  </ListState>
</template>

<style scoped>
.detail {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-title {
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--fg);
}

.facts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 16px;
  margin: 0;
}

.facts dt {
  font-size: 11px;
  color: var(--muted);
}

.facts dd {
  margin: 0;
  font-size: 13px;
  color: var(--fg);
}

.consumption {
  display: flex;
  align-items: center;
  gap: 6px;
}

.rows {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 30px;
  font-size: 13px;
  color: var(--fg-secondary);
}
</style>
