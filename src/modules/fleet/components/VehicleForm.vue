<script setup lang="ts">
import { reactive, ref } from 'vue'

import { ApiError } from '@/core/api/errors'
import Button from '@/core/components/Button.vue'
import FormField from '@/core/components/FormField.vue'
import Input from '@/core/components/Input.vue'
import { useAuth } from '@/core/composables/useAuth'
import { useToast } from '@/core/composables/useToast'

import * as fleetApi from '../api/fleet.api'
import { useFleetStore } from '../stores/useFleetStore'

/** Alta de un vehículo. El backend normaliza la placa. */
const emit = defineEmits<{
  saved: []
  cancel: []
}>()

const store = useFleetStore()
const toast = useToast()
const { authStore } = useAuth()

const form = reactive({
  plate: '',
  type: 'truck',
  capacity_kg: '',
  capacity_m3: '',
  owner_agency_id: String(authStore.agencies[0] ?? ''),
  odometer_km: '',
})

const error = ref<ApiError | null>(null)

async function submit(): Promise<void> {
  error.value = null

  try {
    await store.act(
      () =>
        fleetApi.createVehicle({
          plate: form.plate.trim(),
          type: form.type,
          capacity_kg: Number(form.capacity_kg),
          capacity_m3: Number(form.capacity_m3),
          owner_agency_id: Number(form.owner_agency_id),
          odometer_km: form.odometer_km === '' ? 0 : Number(form.odometer_km),
        }),
      store.vehicles.load,
    )
    toast.success('Vehicle registered', 'It is available for new routes.')
    emit('saved')
  } catch (caught) {
    error.value = caught instanceof ApiError ? caught : null
    toast.error('Could not register the vehicle', error.value?.message)
  }
}
</script>

<template>
  <form class="fleet-form" @submit.prevent="submit">
    <div class="fleet-grid">
      <FormField label="Plate" :error="error?.fieldError('plate')">
        <Input v-model="form.plate" placeholder="ABC-123" />
      </FormField>

      <FormField label="Type" :error="error?.fieldError('type')">
        <select v-model="form.type" class="fleet-control">
          <option value="truck">Truck</option>
          <option value="van">Van</option>
          <option value="trailer">Trailer</option>
        </select>
      </FormField>
    </div>

    <div class="fleet-grid">
      <FormField label="Capacity (kg)" :error="error?.fieldError('capacity_kg')">
        <Input v-model="form.capacity_kg" type="number" placeholder="12000" />
      </FormField>

      <FormField label="Capacity (m³)" :error="error?.fieldError('capacity_m3')">
        <Input v-model="form.capacity_m3" type="number" placeholder="45" />
      </FormField>
    </div>

    <div class="fleet-grid">
      <FormField label="Owner agency ID" :error="error?.fieldError('owner_agency_id')">
        <Input v-model="form.owner_agency_id" type="number" placeholder="1" />
      </FormField>

      <FormField label="Current odometer (km)" :error="error?.fieldError('odometer_km')">
        <Input v-model="form.odometer_km" type="number" placeholder="153200" />
      </FormField>
    </div>

    <p v-if="error && !error.isValidationError" class="fleet-form-error">{{ error.message }}</p>

    <div class="fleet-form-actions">
      <Button variant="secondary" type="button" @click="emit('cancel')">Cancel</Button>
      <Button type="submit" :loading="store.saving">Register vehicle</Button>
    </div>
  </form>
</template>
