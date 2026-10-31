<script setup lang="ts">
import { reactive, ref } from 'vue'

import { ApiError } from '@/core/api/errors'
import Button from '@/core/components/Button.vue'
import FormField from '@/core/components/FormField.vue'
import Input from '@/core/components/Input.vue'
import { useToast } from '@/core/composables/useToast'

import * as fleetApi from '../api/fleet.api'
import { useFleetStore } from '../stores/useFleetStore'
import type { Vehicle } from '../types/fleet.types'

/** Corrección auditada: la única vía para que el odómetro retroceda. */
const props = defineProps<{
  vehicle: Vehicle
}>()

const emit = defineEmits<{
  saved: []
  cancel: []
}>()

const store = useFleetStore()
const toast = useToast()

const form = reactive({ odometer_km: String(props.vehicle.odometer_km), reason: '' })
const error = ref<ApiError | null>(null)

async function submit(): Promise<void> {
  error.value = null

  try {
    await store.act(
      () =>
        fleetApi.correctOdometer(props.vehicle.id, {
          odometer_km: Number(form.odometer_km),
          reason: form.reason.trim(),
        }),
      store.vehicles.load,
    )
    toast.success('Odometer corrected', 'The correction was recorded in the audit log.')
    emit('saved')
  } catch (caught) {
    error.value = caught instanceof ApiError ? caught : null
    toast.error('Could not correct the odometer', error.value?.message)
  }
}
</script>

<template>
  <form class="fleet-form" @submit.prevent="submit">
    <p class="fleet-form-hint">
      This overrides the last known reading of {{ props.vehicle.plate }} and is audited.
    </p>

    <FormField label="Correct reading (km)" :error="error?.fieldError('odometer_km')">
      <Input v-model="form.odometer_km" type="number" />
    </FormField>

    <FormField label="Reason" :error="error?.fieldError('reason')">
      <Input v-model="form.reason" placeholder="Mistyped reading" />
    </FormField>

    <p v-if="error && !error.isValidationError" class="fleet-form-error">{{ error.message }}</p>

    <div class="fleet-form-actions">
      <Button variant="secondary" type="button" @click="emit('cancel')">Cancel</Button>
      <Button type="submit" :loading="store.saving">Correct odometer</Button>
    </div>
  </form>
</template>
