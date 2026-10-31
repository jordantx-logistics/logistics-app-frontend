<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

import { ApiError } from '@/core/api/errors'
import Button from '@/core/components/Button.vue'
import FormField from '@/core/components/FormField.vue'
import Input from '@/core/components/Input.vue'
import { useToast } from '@/core/composables/useToast'

import * as fleetApi from '../api/fleet.api'
import { useFleetStore } from '../stores/useFleetStore'

/**
 * Viático o carga de combustible. La clave de idempotencia se fija al abrir el
 * formulario: reenviarlo tras un fallo de red no duplica el gasto.
 */
const props = defineProps<{
  routeId?: number | undefined
}>()

const emit = defineEmits<{
  saved: []
  cancel: []
}>()

const store = useFleetStore()
const toast = useToast()

const form = reactive({
  route_id: props.routeId ? String(props.routeId) : '',
  type: 'fuel' as 'fuel' | 'per_diem',
  amount: '',
  liters: '',
  odometer_km: '',
})

const receipt = ref<File | null>(null)
const idempotencyKey = crypto.randomUUID()
const error = ref<ApiError | null>(null)

const isFuel = computed(() => form.type === 'fuel')

function onReceiptChange(event: Event): void {
  receipt.value = (event.target as HTMLInputElement).files?.[0] ?? null
}

async function submit(): Promise<void> {
  error.value = null

  try {
    await store.act(
      () =>
        fleetApi.registerExpense({
          route_id: Number(form.route_id),
          type: form.type,
          amount: Number(form.amount),
          liters: isFuel.value && form.liters !== '' ? Number(form.liters) : null,
          odometer_km: form.odometer_km === '' ? null : Number(form.odometer_km),
          idempotency_key: idempotencyKey,
          receipt: receipt.value,
        }),
      store.expenses.load,
    )
    toast.success('Expense registered', 'It is waiting for review.')
    emit('saved')
  } catch (caught) {
    error.value = caught instanceof ApiError ? caught : null
    toast.error('Could not register the expense', error.value?.message)
  }
}
</script>

<template>
  <form class="fleet-form" @submit.prevent="submit">
    <div class="fleet-grid">
      <FormField label="Route ID" :error="error?.fieldError('route_id')">
        <Input v-model="form.route_id" type="number" placeholder="1" :disabled="!!props.routeId" />
      </FormField>

      <FormField label="Type" :error="error?.fieldError('type')">
        <select v-model="form.type" class="fleet-control">
          <option value="fuel">Fuel</option>
          <option value="per_diem">Per diem</option>
        </select>
      </FormField>
    </div>

    <div class="fleet-grid">
      <FormField label="Amount (S/)" :error="error?.fieldError('amount')">
        <Input v-model="form.amount" type="number" placeholder="380.00" />
      </FormField>

      <FormField v-if="isFuel" label="Liters" :error="error?.fieldError('liters')">
        <Input v-model="form.liters" type="number" placeholder="95" />
      </FormField>
    </div>

    <FormField v-if="isFuel" label="Odometer (km)" :error="error?.fieldError('odometer_km')">
      <Input v-model="form.odometer_km" type="number" placeholder="153600" />
    </FormField>

    <FormField
      :label="isFuel ? 'Receipt' : 'Receipt (optional for now)'"
      :error="error?.fieldError('receipt')"
    >
      <input
        class="fleet-control"
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        @change="onReceiptChange"
      />
    </FormField>

    <p v-if="!isFuel" class="fleet-form-hint">
      A per diem cannot be liquidated until its receipt is attached.
    </p>

    <p v-if="error && !error.isValidationError" class="fleet-form-error">{{ error.message }}</p>

    <div class="fleet-form-actions">
      <Button variant="secondary" type="button" @click="emit('cancel')">Cancel</Button>
      <Button type="submit" :loading="store.saving">Register expense</Button>
    </div>
  </form>
</template>
