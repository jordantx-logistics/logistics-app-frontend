<script setup lang="ts">
import { computed, ref } from 'vue'

import type { ApiError } from '@/core/api/errors'
import Button from '@/core/components/Button.vue'
import FormField from '@/core/components/FormField.vue'
import Input from '@/core/components/Input.vue'
import Select from '@/core/components/Select.vue'

import type {
  CreateEmployeePayload,
  Employee,
  EmployeeDocumentType,
  EmployeeStatus,
} from '../types/employees.types'

/**
 * Alta y edición de la ficha de un empleado (UC-08). Con `employee` precargado
 * el mismo formulario edita; sin él, da de alta. Emite el payload completo.
 *
 * El estado no ofrece `terminated`: la baja tiene su propia acción (UC-09), que
 * es la que además pone `terminated_at`.
 */

export interface AgencyOption {
  id: number
  name: string
}

export interface EmployeeFormProps {
  loading?: boolean
  error?: ApiError | null
  agencies?: AgencyOption[]
  employee?: Employee | null
}

const props = withDefaults(defineProps<EmployeeFormProps>(), {
  loading: false,
  error: null,
  agencies: () => [],
  employee: null,
})

const emit = defineEmits<{
  submit: [payload: CreateEmployeePayload]
  cancel: []
}>()

const DOCUMENT_OPTIONS: Array<{ label: string; value: string }> = [
  { label: 'DNI', value: 'DNI' },
  { label: 'Foreigner card (CE)', value: 'CE' },
  { label: 'Passport', value: 'PASSPORT' },
]

const STATUS_OPTIONS: Array<{ label: string; value: string }> = [
  { label: 'Active', value: 'active' },
  { label: 'On leave', value: 'on_leave' },
]

/** El `<input type="date">` solo entiende `YYYY-MM-DD`. */
function toDateInput(value: string | undefined): string {
  return (value ?? '').slice(0, 10)
}

const documentType = ref<string>(props.employee?.document_type ?? 'DNI')
const documentNumber = ref(props.employee?.document_number ?? '')
const firstName = ref(props.employee?.first_name ?? '')
const lastName = ref(props.employee?.last_name ?? '')
const email = ref(props.employee?.email ?? '')
const phone = ref(props.employee?.phone ?? '')
const position = ref(props.employee?.position ?? '')
const agencyId = ref(props.employee ? String(props.employee.agency_id) : '')
const hiredAt = ref(toDateInput(props.employee?.hired_at))
const status = ref<string>(
  props.employee?.status === 'terminated' ? 'active' : (props.employee?.status ?? 'active'),
)

const title = computed(() => (props.employee === null ? 'New employee' : 'Edit employee'))

function orNull(value: string): string | null {
  const trimmed = value.trim()

  return trimmed === '' ? null : trimmed
}

function onSubmit(): void {
  emit('submit', {
    document_type: documentType.value as EmployeeDocumentType,
    document_number: documentNumber.value.trim(),
    first_name: firstName.value.trim(),
    last_name: lastName.value.trim(),
    email: orNull(email.value),
    phone: orNull(phone.value),
    position: position.value.trim(),
    agency_id: Number(agencyId.value),
    hired_at: hiredAt.value,
    status: status.value as EmployeeStatus,
  })
}
</script>

<template>
  <form class="form" @submit.prevent="onSubmit">
    <p class="form-title">{{ title }}</p>

    <div v-if="props.error && !props.error.isValidationError" class="form-alert">
      {{ props.error.message }}
    </div>

    <div class="form-grid">
      <FormField label="Document type" :error="props.error?.fieldError('document_type')">
        <Select v-model="documentType" :options="DOCUMENT_OPTIONS" placeholder="Document type" />
      </FormField>

      <FormField label="Document number" :error="props.error?.fieldError('document_number')">
        <Input v-model="documentNumber" placeholder="12345678" />
      </FormField>

      <FormField label="First name" :error="props.error?.fieldError('first_name')">
        <Input v-model="firstName" placeholder="Ana" />
      </FormField>

      <FormField label="Last name" :error="props.error?.fieldError('last_name')">
        <Input v-model="lastName" placeholder="Quispe" />
      </FormField>

      <FormField label="Email" :error="props.error?.fieldError('email')">
        <Input v-model="email" type="email" placeholder="ana@empresa.com" />
      </FormField>

      <FormField label="Phone" :error="props.error?.fieldError('phone')">
        <Input v-model="phone" placeholder="999 888 777" />
      </FormField>

      <FormField label="Position" :error="props.error?.fieldError('position')">
        <Input v-model="position" placeholder="Counter clerk" />
      </FormField>

      <FormField label="Base agency" :error="props.error?.fieldError('agency_id')">
        <Select
          v-model="agencyId"
          :options="
            props.agencies.map((agency) => ({ label: agency.name, value: String(agency.id) }))
          "
          placeholder="Base agency"
        />
      </FormField>

      <FormField label="Hired at" :error="props.error?.fieldError('hired_at')">
        <Input v-model="hiredAt" type="date" />
      </FormField>

      <FormField label="Status" :error="props.error?.fieldError('status')">
        <Select v-model="status" :options="STATUS_OPTIONS" placeholder="Status" />
      </FormField>
    </div>

    <div class="form-actions">
      <Button variant="ghost" @click="emit('cancel')"> Cancel </Button>
      <Button variant="primary" :loading="props.loading" @click="onSubmit"> Save employee </Button>
    </div>
  </form>
</template>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--fg-secondary);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 14px;
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
