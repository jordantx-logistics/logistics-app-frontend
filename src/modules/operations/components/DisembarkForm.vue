<script setup lang="ts">
import { computed, ref } from 'vue'

import type { ApiError } from '@/core/api/errors'
import Button from '@/core/components/Button.vue'
import FormField from '@/core/components/FormField.vue'
import Input from '@/core/components/Input.vue'
import Select from '@/core/components/Select.vue'
import Textarea from '@/core/components/Textarea.vue'

import type { DisembarkPayload, Embark } from '../types/operations.types'

/**
 * Descarga de un manifiesto en destino o escala.
 *
 * Si no se indican guías, el contrato descarga el manifiesto completo; si se
 * indican, solo esas (útil cuando el vehículo para en varias agencias).
 */
export interface DisembarkFormProps {
  embark: Embark
  agencies: number[]
  loading?: boolean
  error?: ApiError | null
}

const props = withDefaults(defineProps<DisembarkFormProps>(), {
  loading: false,
  error: null,
})

const emit = defineEmits<{
  submit: [payload: DisembarkPayload]
  cancel: []
}>()

const agencyId = ref(props.agencies[0] ? String(props.agencies[0]) : '')
const arrivedAt = ref('')
const ticketCodes = ref('')

const agencyOptions = computed(() =>
  props.agencies.map((agency) => ({ label: `Agency #${agency}`, value: String(agency) })),
)

const manifestCodes = computed(() => (props.embark.items ?? []).map((item) => item.ticket_code))

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
    ...(arrivedAt.value === '' ? {} : { arrived_at: new Date(arrivedAt.value).toISOString() }),
    ...(codes.value.length === 0
      ? {}
      : { items: codes.value.map((ticketCode) => ({ ticket_code: ticketCode })) }),
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

      <FormField label="Arrived at" :error="props.error?.fieldError('arrived_at')">
        <Input v-model="arrivedAt" type="datetime-local" />
      </FormField>
    </div>

    <FormField
      label="Ticket codes (optional)"
      :error="props.error?.fieldError('items') ?? props.error?.fieldError('items.0.ticket_code')"
    >
      <Textarea
        v-model="ticketCodes"
        :rows="5"
        placeholder="Leave empty to disembark the whole manifest"
      />
    </FormField>

    <p class="form-hint">
      Manifest #{{ props.embark.id }} · {{ manifestCodes.length }}
      {{ manifestCodes.length === 1 ? 'parcel' : 'parcels' }}:
      {{ manifestCodes.join(', ') || '—' }}
    </p>

    <div class="form-actions">
      <Button variant="ghost" @click="emit('cancel')">Cancel</Button>
      <Button
        variant="primary"
        :loading="props.loading"
        :disabled="agencyId === ''"
        @click="onSubmit"
      >
        Disembark
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
  word-break: break-word;
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
