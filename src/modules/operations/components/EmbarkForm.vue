<script setup lang="ts">
import { computed, ref } from 'vue'

import type { ApiError } from '@/core/api/errors'
import Button from '@/core/components/Button.vue'
import FormField from '@/core/components/FormField.vue'
import Input from '@/core/components/Input.vue'
import Select from '@/core/components/Select.vue'
import Textarea from '@/core/components/Textarea.vue'

import type { CreateEmbarkPayload } from '../types/operations.types'

/**
 * Alta de manifiesto de embarque.
 *
 * Flota (vehículo/ruta) llega en la Fase 6, así que aquí se piden los ids tal
 * como los espera el contrato; no se inventan catálogos que el backend aún no
 * expone. Una guía por línea.
 */
export interface EmbarkFormProps {
  agencies: number[]
  loading?: boolean
  error?: ApiError | null
}

const props = withDefaults(defineProps<EmbarkFormProps>(), {
  loading: false,
  error: null,
})

const emit = defineEmits<{
  submit: [payload: CreateEmbarkPayload]
  cancel: []
}>()

const agencyId = ref(props.agencies[0] ? String(props.agencies[0]) : '')
const vehicleId = ref('')
const driverId = ref('')
const routeRef = ref('')
const departedAt = ref('')
const ticketCodes = ref('')

const agencyOptions = computed(() =>
  props.agencies.map((agency) => ({ label: `Agency #${agency}`, value: String(agency) })),
)

const codes = computed(() => [
  ...new Set(
    ticketCodes.value
      .split(/[\n,]/)
      .map((code) => code.trim().toUpperCase())
      .filter((code) => code !== ''),
  ),
])

const canSubmit = computed(
  () =>
    agencyId.value !== '' &&
    vehicleId.value !== '' &&
    driverId.value !== '' &&
    codes.value.length > 0,
)

function onSubmit(): void {
  emit('submit', {
    agency_id: Number(agencyId.value),
    vehicle_id: Number(vehicleId.value),
    driver_id: Number(driverId.value),
    route_ref: routeRef.value.trim() === '' ? null : routeRef.value.trim(),
    ...(departedAt.value === '' ? {} : { departed_at: new Date(departedAt.value).toISOString() }),
    items: codes.value.map((ticketCode) => ({ ticket_code: ticketCode })),
  })
}
</script>

<template>
  <form class="form" @submit.prevent="onSubmit">
    <div v-if="props.error && !props.error.isValidationError" class="form-alert">
      {{ props.error.message }}
    </div>

    <div class="form-grid">
      <FormField label="Agency" :error="props.error?.fieldError('agency_id')">
        <Select v-model="agencyId" :options="agencyOptions" placeholder="Select an agency" />
      </FormField>

      <FormField label="Vehicle id" :error="props.error?.fieldError('vehicle_id')">
        <Input v-model="vehicleId" type="number" placeholder="12" />
      </FormField>

      <FormField label="Driver id" :error="props.error?.fieldError('driver_id')">
        <Input v-model="driverId" type="number" placeholder="48" />
      </FormField>

      <FormField label="Route reference" :error="props.error?.fieldError('route_ref')">
        <Input v-model="routeRef" placeholder="LIM-AQP-01" />
      </FormField>

      <FormField label="Departed at" :error="props.error?.fieldError('departed_at')">
        <Input v-model="departedAt" type="datetime-local" />
      </FormField>
    </div>

    <FormField
      label="Ticket codes"
      :error="props.error?.fieldError('items') ?? props.error?.fieldError('items.0.ticket_code')"
    >
      <Textarea v-model="ticketCodes" :rows="6" placeholder="A7F3Q8X4&#10;B2C9L1M7" />
    </FormField>

    <p class="form-hint">
      {{ codes.length }} {{ codes.length === 1 ? 'parcel' : 'parcels' }} in this manifest.
    </p>

    <div class="form-actions">
      <Button variant="ghost" @click="emit('cancel')">Cancel</Button>
      <Button variant="primary" :loading="props.loading" :disabled="!canSubmit" @click="onSubmit">
        Create manifest
      </Button>
    </div>
  </form>
</template>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 14px;
}

.form-hint {
  margin: 0;
  font-size: 12px;
  color: var(--fg-secondary);
}

.form-alert {
  padding: 10px 12px;
  border: 1px solid var(--danger);
  border-radius: 8px;
  font-size: 12px;
  color: var(--danger);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 14px;
  border-top: 1px solid var(--border);
}
</style>
