<script setup lang="ts">
import { computed, ref } from 'vue'

import type { ApiError } from '@/core/api/errors'
import Button from '@/core/components/Button.vue'
import FormField from '@/core/components/FormField.vue'
import Select from '@/core/components/Select.vue'
import Textarea from '@/core/components/Textarea.vue'

import type { ReceiveShipmentsPayload } from '../types/operations.types'

/**
 * Alta de recepción: agencia y una guía por línea.
 *
 * No llama al API; emite el payload y la página decide cómo recargar. El
 * escaneo con `scan_id` es cosa del PDA (Fase 8): aquí basta el código.
 */
export interface ReceptionFormProps {
  agencies: number[]
  loading?: boolean
  error?: ApiError | null
}

const props = withDefaults(defineProps<ReceptionFormProps>(), {
  loading: false,
  error: null,
})

const emit = defineEmits<{
  submit: [payload: ReceiveShipmentsPayload]
  cancel: []
}>()

const agencyId = ref(props.agencies[0] ? String(props.agencies[0]) : '')
const ticketCodes = ref('')

const agencyOptions = computed(() =>
  props.agencies.map((agency) => ({ label: `Agency #${agency}`, value: String(agency) })),
)

/** Una guía por línea (también acepta comas); sin vacíos ni repetidas. */
const codes = computed(() => [
  ...new Set(
    ticketCodes.value
      .split(/[\n,]/)
      .map((code) => code.trim().toUpperCase())
      .filter((code) => code !== ''),
  ),
])

function onSubmit(): void {
  emit('submit', {
    agency_id: Number(agencyId.value),
    items: codes.value.map((ticketCode) => ({ ticket_code: ticketCode })),
  })
}
</script>

<template>
  <form class="form" @submit.prevent="onSubmit">
    <div v-if="props.error && !props.error.isValidationError" class="form-alert">
      {{ props.error.message }}
    </div>

    <FormField label="Agency" :error="props.error?.fieldError('agency_id')">
      <Select v-model="agencyId" :options="agencyOptions" placeholder="Select an agency" />
    </FormField>

    <FormField
      label="Ticket codes"
      :error="props.error?.fieldError('items') ?? props.error?.fieldError('items.0.ticket_code')"
    >
      <Textarea v-model="ticketCodes" :rows="6" placeholder="A7F3Q8X4&#10;B2C9L1M7" />
    </FormField>

    <p class="form-hint">
      {{ codes.length }} {{ codes.length === 1 ? 'parcel' : 'parcels' }} ready to receive.
    </p>

    <div class="form-actions">
      <Button variant="ghost" @click="emit('cancel')">Cancel</Button>
      <Button
        variant="primary"
        :loading="props.loading"
        :disabled="codes.length === 0 || agencyId === ''"
        @click="onSubmit"
      >
        Receive parcels
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
