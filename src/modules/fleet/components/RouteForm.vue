<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { Plus, Trash2 } from 'lucide-vue-next'

import { ApiError } from '@/core/api/errors'
import AgencySelect from '@/core/components/AgencySelect.vue'
import Button from '@/core/components/Button.vue'
import FormField from '@/core/components/FormField.vue'
import Input from '@/core/components/Input.vue'
import { useAuth } from '@/core/composables/useAuth'
import { useToast } from '@/core/composables/useToast'

import * as fleetApi from '../api/fleet.api'
import { useFleetStore } from '../stores/useFleetStore'

/**
 * Planificación de una ruta. Cada tramo sale de donde terminó el anterior, así que
 * el formulario solo pide los destinos: los tramos no pueden quedar sin encadenar.
 */
const emit = defineEmits<{
  saved: []
  cancel: []
}>()

const store = useFleetStore()
const toast = useToast()
const { authStore } = useAuth()

const form = reactive({
  origin: String(authStore.agencies[0] ?? ''),
  departure: '',
  arrival: '',
  stops: [{ agency: '', distance: '' }],
})

const error = ref<ApiError | null>(null)

const lastStop = computed(() => form.stops[form.stops.length - 1])

function addStop(): void {
  form.stops.push({ agency: '', distance: '' })
}

function removeStop(index: number): void {
  form.stops.splice(index, 1)
}

function buildSegments(): { from_agency_id: number; to_agency_id: number; distance_km: number }[] {
  let from = Number(form.origin)

  return form.stops.map((stop) => {
    const segment = {
      from_agency_id: from,
      to_agency_id: Number(stop.agency),
      distance_km: Number(stop.distance),
    }

    from = segment.to_agency_id

    return segment
  })
}

async function submit(): Promise<void> {
  error.value = null

  try {
    await store.act(
      () =>
        fleetApi.createRoute({
          origin_agency_id: Number(form.origin),
          destination_agency_id: Number(lastStop.value?.agency),
          planned_departure_at: new Date(form.departure).toISOString(),
          planned_arrival_at: form.arrival === '' ? null : new Date(form.arrival).toISOString(),
          segments: buildSegments(),
        }),
      store.routes.load,
    )
    toast.success('Route planned', 'Assign a driver and a vehicle to get it ready.')
    emit('saved')
  } catch (caught) {
    error.value = caught instanceof ApiError ? caught : null
    toast.error('Could not plan the route', error.value?.message)
  }
}
</script>

<template>
  <form class="fleet-form" @submit.prevent="submit">
    <FormField label="Origin agency" :error="error?.fieldError('origin_agency_id')">
      <AgencySelect v-model="form.origin" aria-label="Origin agency" />
    </FormField>

    <div class="fleet-grid">
      <FormField label="Planned departure" :error="error?.fieldError('planned_departure_at')">
        <Input v-model="form.departure" type="datetime-local" />
      </FormField>

      <FormField label="Planned arrival" :error="error?.fieldError('planned_arrival_at')">
        <Input v-model="form.arrival" type="datetime-local" />
      </FormField>
    </div>

    <div v-for="(stop, index) in form.stops" :key="index" class="stop">
      <div class="fleet-grid">
        <FormField
          :label="
            index === form.stops.length - 1 ? 'Destination agency' : `Stop ${index + 1} agency`
          "
          :error="error?.fieldError(`segments.${index}.to_agency_id`)"
        >
          <AgencySelect
            v-model="stop.agency"
            :aria-label="
              index === form.stops.length - 1 ? 'Destination agency' : `Stop ${index + 1} agency`
            "
          />
        </FormField>

        <FormField
          label="Distance (km)"
          :error="error?.fieldError(`segments.${index}.distance_km`)"
        >
          <Input v-model="stop.distance" type="number" placeholder="320" />
        </FormField>
      </div>

      <button
        v-if="form.stops.length > 1"
        type="button"
        class="fleet-link danger"
        aria-label="Remove this stop"
        @click="removeStop(index)"
      >
        <Trash2 :size="14" />
      </button>
    </div>

    <button type="button" class="fleet-link" @click="addStop">
      <Plus :size="14" />
      Add a stop
    </button>

    <p v-if="error && !error.isValidationError" class="fleet-form-error">{{ error.message }}</p>

    <div class="fleet-form-actions">
      <Button variant="secondary" type="button" @click="emit('cancel')">Cancel</Button>
      <Button type="submit" :loading="store.saving">Plan route</Button>
    </div>
  </form>
</template>

<style scoped>
.stop {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.stop > .fleet-grid {
  flex: 1;
}
</style>
