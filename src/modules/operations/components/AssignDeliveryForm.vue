<script setup lang="ts">
import { computed, ref } from 'vue'

import type { ApiError } from '@/core/api/errors'
import Button from '@/core/components/Button.vue'
import FormField from '@/core/components/FormField.vue'
import Input from '@/core/components/Input.vue'
import Select from '@/core/components/Select.vue'
import Textarea from '@/core/components/Textarea.vue'

import type { AssignDeliveriesPayload } from '../types/operations.types'

/**
 * Asignación de envíos a un repartidor.
 *
 * El repartidor se valida en el backend contra `EmployeeDirectory` (existe,
 * está activo y es de la misma agencia), así que aquí solo se pide su id.
 */
export interface AssignDeliveryFormProps {
  agencies: number[]
  loading?: boolean
  error?: ApiError | null
}

const props = withDefaults(defineProps<AssignDeliveryFormProps>(), {
  loading: false,
  error: null,
})

const emit = defineEmits<{
  submit: [payload: AssignDeliveriesPayload]
  cancel: []
}>()

const agencyId = ref(props.agencies[0] ? String(props.agencies[0]) : '')
const courierId = ref('')
const shipmentIds = ref('')

const agencyOptions = computed(() =>
  props.agencies.map((agency) => ({ label: `Agency #${agency}`, value: String(agency) })),
)

const ids = computed(() => [
  ...new Set(
    shipmentIds.value
      .split(/[\n,]/)
      .map((id) => Number(id.trim()))
      .filter((id) => Number.isInteger(id) && id > 0),
  ),
])

const canSubmit = computed(
  () => agencyId.value !== '' && courierId.value !== '' && ids.value.length > 0,
)

function onSubmit(): void {
  emit('submit', {
    agency_id: Number(agencyId.value),
    courier_id: Number(courierId.value),
    shipment_ids: ids.value,
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

      <FormField label="Courier id" :error="props.error?.fieldError('courier_id')">
        <Input v-model="courierId" type="number" placeholder="48" />
      </FormField>
    </div>

    <FormField label="Shipment ids" :error="props.error?.fieldError('shipment_ids')">
      <Textarea v-model="shipmentIds" :rows="5" placeholder="10&#10;11&#10;12" />
    </FormField>

    <p class="form-hint">
      {{ ids.length }} {{ ids.length === 1 ? 'parcel' : 'parcels' }} will be assigned.
    </p>

    <div class="form-actions">
      <Button variant="ghost" @click="emit('cancel')">Cancel</Button>
      <Button variant="primary" :loading="props.loading" :disabled="!canSubmit" @click="onSubmit">
        Assign for delivery
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
