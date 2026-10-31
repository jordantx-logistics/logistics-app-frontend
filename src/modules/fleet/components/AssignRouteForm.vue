<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'

import { ApiError } from '@/core/api/errors'
import Button from '@/core/components/Button.vue'
import FormField from '@/core/components/FormField.vue'
import { useToast } from '@/core/composables/useToast'

import * as fleetApi from '../api/fleet.api'
import { useFleetStore } from '../stores/useFleetStore'
import type { Driver, FleetRoute, Vehicle } from '../types/fleet.types'

/** Asigna chofer y vehículo. Solo ofrece los disponibles; el backend revalida. */
const props = defineProps<{
  route: FleetRoute
}>()

const emit = defineEmits<{
  saved: []
  cancel: []
}>()

const store = useFleetStore()
const toast = useToast()

const form = reactive({
  driver_id: props.route.driver_id ? String(props.route.driver_id) : '',
  vehicle_id: props.route.vehicle_id ? String(props.route.vehicle_id) : '',
})

const drivers = ref<Driver[]>([])
const vehicles = ref<Vehicle[]>([])
const error = ref<ApiError | null>(null)

onMounted(async () => {
  try {
    const [driverPage, vehiclePage] = await Promise.all([
      fleetApi.listDrivers({ available: true, per_page: 100 }),
      fleetApi.listVehicles({ status: 'available', per_page: 100 }),
    ])

    drivers.value = driverPage.rows
    vehicles.value = vehiclePage.rows
  } catch (caught) {
    error.value = caught instanceof ApiError ? caught : null
    toast.error('Could not load drivers and vehicles', error.value?.message)
  }
})

async function submit(): Promise<void> {
  error.value = null

  try {
    await store.act(
      () =>
        fleetApi.assignRoute(props.route.id, {
          driver_id: Number(form.driver_id),
          vehicle_id: Number(form.vehicle_id),
        }),
      store.routes.load,
    )
    toast.success('Route assigned', 'The driver can start it when ready.')
    emit('saved')
  } catch (caught) {
    error.value = caught instanceof ApiError ? caught : null
    toast.error('Could not assign the route', error.value?.message)
  }
}
</script>

<template>
  <form class="fleet-form" @submit.prevent="submit">
    <FormField label="Driver" :error="error?.fieldError('driver_id')">
      <select v-model="form.driver_id" class="fleet-control">
        <option value="" disabled>Choose a driver</option>
        <option v-for="driver in drivers" :key="driver.id" :value="String(driver.id)">
          #{{ driver.id }} · {{ driver.license_number }} ({{ driver.license_category }})
        </option>
      </select>
    </FormField>

    <FormField label="Vehicle" :error="error?.fieldError('vehicle_id')">
      <select v-model="form.vehicle_id" class="fleet-control">
        <option value="" disabled>Choose a vehicle</option>
        <option v-for="vehicle in vehicles" :key="vehicle.id" :value="String(vehicle.id)">
          {{ vehicle.plate }} · {{ vehicle.type }}
        </option>
      </select>
    </FormField>

    <p v-if="error && !error.isValidationError" class="fleet-form-error">{{ error.message }}</p>

    <div class="fleet-form-actions">
      <Button variant="secondary" type="button" @click="emit('cancel')">Cancel</Button>
      <Button
        type="submit"
        :loading="store.saving"
        :disabled="form.driver_id === '' || form.vehicle_id === ''"
      >
        Assign route
      </Button>
    </div>
  </form>
</template>
