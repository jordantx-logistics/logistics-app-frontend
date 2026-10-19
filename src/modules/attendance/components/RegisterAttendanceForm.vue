<script setup lang="ts">
import { ref } from 'vue'

import type { ApiError } from '@/core/api/errors'
import Button from '@/core/components/Button.vue'
import FormField from '@/core/components/FormField.vue'
import Input from '@/core/components/Input.vue'
import Select from '@/core/components/Select.vue'

import type {
  AttendanceSource,
  AttendanceType,
  RegisterAttendancePayload,
} from '../types/attendance.types'

/**
 * Alta de una marcación (UC-10/UC-11).
 *
 * La `idempotency_key` se genera **una vez por intento**: los reintentos de la
 * misma marcación (móvil sin cobertura) deben reutilizarla para no duplicar
 * registros, así que el formulario la crea al enviar y no en cada render.
 */

export interface AgencyOption {
  id: number
  name: string
}

export interface RegisterAttendanceFormProps {
  loading?: boolean
  error?: ApiError | null
  agencies?: AgencyOption[]
}

const props = withDefaults(defineProps<RegisterAttendanceFormProps>(), {
  loading: false,
  error: null,
  agencies: () => [],
})

const emit = defineEmits<{
  submit: [payload: RegisterAttendancePayload]
  cancel: []
}>()

const TYPE_OPTIONS: Array<{ label: string; value: string }> = [
  { label: 'Check in', value: 'in' },
  { label: 'Check out', value: 'out' },
  { label: 'Break start', value: 'break-start' },
  { label: 'Break end', value: 'break-end' },
]

const SOURCE_OPTIONS: Array<{ label: string; value: string }> = [
  { label: 'Web', value: 'web' },
  { label: 'App', value: 'app' },
  { label: 'PDA', value: 'pda' },
  { label: 'Biometric', value: 'biometric' },
]

const employeeId = ref('')
const agencyId = ref('')
const type = ref('in')
const source = ref('web')

function newIdempotencyKey(): string {
  return crypto.randomUUID()
}

function onSubmit(): void {
  emit('submit', {
    employee_id: Number(employeeId.value),
    agency_id: Number(agencyId.value),
    type: type.value as AttendanceType,
    source: source.value as AttendanceSource,
    idempotency_key: newIdempotencyKey(),
  })
}
</script>

<template>
  <form class="form" @submit.prevent="onSubmit">
    <div v-if="props.error && !props.error.isValidationError" class="form-alert">
      {{ props.error.message }}
    </div>

    <div class="form-grid">
      <FormField label="Employee ID" :error="props.error?.fieldError('employee_id')">
        <Input v-model="employeeId" type="number" placeholder="9" />
      </FormField>

      <FormField label="Agency" :error="props.error?.fieldError('agency_id')">
        <Select
          v-model="agencyId"
          :options="
            props.agencies.map((agency) => ({ label: agency.name, value: String(agency.id) }))
          "
          placeholder="Agency"
        />
      </FormField>

      <FormField label="Type" :error="props.error?.fieldError('type')">
        <Select v-model="type" :options="TYPE_OPTIONS" placeholder="Type" />
      </FormField>

      <FormField label="Source" :error="props.error?.fieldError('source')">
        <Select v-model="source" :options="SOURCE_OPTIONS" placeholder="Source" />
      </FormField>
    </div>

    <p class="form-hint">
      The marking is timestamped by the server and is idempotent: retrying with the same key does
      not duplicate the record.
    </p>

    <div class="form-actions">
      <Button variant="ghost" @click="emit('cancel')"> Cancel </Button>
      <Button variant="primary" :loading="props.loading" @click="onSubmit"> Register </Button>
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
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 14px;
}

.form-hint {
  font-size: 12px;
  color: var(--muted);
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
