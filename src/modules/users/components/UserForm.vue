<script setup lang="ts">
import { ref } from 'vue'

import type { ApiError } from '@/core/api/errors'
import Button from '@/core/components/Button.vue'
import FormField from '@/core/components/FormField.vue'
import Input from '@/core/components/Input.vue'
import Toggle from '@/core/components/Toggle.vue'

import type { CreateUserPayload } from '../types/users.types'

/**
 * Alta de usuario (UC-01). Emite el payload; el módulo hace el `POST` y le
 * devuelve el `loading` y el error (422 con mensajes por campo).
 *
 * El ámbito de agencia es obligatorio para los roles operativos
 * (`USER_WITHOUT_AGENCY_SCOPE`), por eso el formulario lo pide: un usuario sin
 * agencia y sin rol nacional no se puede dar de alta.
 */

/** Agencia del desplegable (el módulo `agencies` es el dueño del dato). */
export interface AgencyOption {
  id: number
  name: string
}

export interface UserFormProps {
  loading?: boolean
  error?: ApiError | null
  agencies?: AgencyOption[]
}

const props = withDefaults(defineProps<UserFormProps>(), {
  loading: false,
  error: null,
  agencies: () => [],
})

const emit = defineEmits<{
  submit: [payload: CreateUserPayload]
  cancel: []
}>()

const name = ref('')
const email = ref('')
const password = ref('')
const mustChangePassword = ref(true)
const agencyIds = ref<number[]>([])
const primaryAgencyId = ref<number | null>(null)

/** Marca o desmarca una agencia y mantiene una principal válida. */
function toggleAgency(id: number, checked: boolean): void {
  if (checked) {
    agencyIds.value = [...agencyIds.value, id]
    primaryAgencyId.value ??= id

    return
  }

  agencyIds.value = agencyIds.value.filter((agencyId) => agencyId !== id)

  if (primaryAgencyId.value === id) {
    primaryAgencyId.value = agencyIds.value[0] ?? null
  }
}

function onSubmit(): void {
  emit('submit', {
    name: name.value.trim(),
    email: email.value.trim(),
    password: password.value,
    must_change_password: mustChangePassword.value,
    agency_ids: [...agencyIds.value],
    primary_agency_id: primaryAgencyId.value,
  })
}
</script>

<template>
  <form class="form" @submit.prevent="onSubmit">
    <div v-if="props.error && !props.error.isValidationError" class="form-alert">
      {{ props.error.message }}
    </div>

    <div class="form-grid">
      <FormField label="Name" :error="props.error?.fieldError('name')">
        <Input v-model="name" placeholder="Ana Quispe" />
      </FormField>

      <FormField label="Email" :error="props.error?.fieldError('email')">
        <Input v-model="email" type="email" placeholder="ana@empresa.com" />
      </FormField>

      <FormField
        label="Temporary password"
        class="form-field-wide"
        :error="props.error?.fieldError('password')"
      >
        <Input
          v-model="password"
          type="password"
          placeholder="At least 12 characters and a digit"
        />
      </FormField>
    </div>

    <div class="field">
      <span class="field-label">Agency scope</span>
      <div class="agency-list">
        <label v-for="agency in props.agencies" :key="agency.id" class="agency-option">
          <input
            type="checkbox"
            :checked="agencyIds.includes(agency.id)"
            @change="toggleAgency(agency.id, ($event.target as HTMLInputElement).checked)"
          />
          <span>{{ agency.name }}</span>
        </label>
        <p v-if="props.agencies.length === 0" class="agency-empty">No agencies available.</p>
      </div>
      <span v-if="props.error?.fieldError('agency_ids')" class="field-error">
        {{ props.error?.fieldError('agency_ids') }}
      </span>
    </div>

    <Toggle v-model="mustChangePassword" label="Must change password on first login" />

    <div class="form-actions">
      <Button variant="ghost" @click="emit('cancel')"> Cancel </Button>
      <Button variant="primary" :loading="props.loading" @click="onSubmit"> Save user </Button>
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

.form-field-wide {
  grid-column: 1 / -1;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--fg-secondary);
}

.field-error {
  font-size: 12px;
  color: var(--danger);
}

.agency-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 6px;
  max-height: 160px;
  overflow-y: auto;
  padding: 8px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
}

.agency-option {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--fg-secondary);
  cursor: pointer;
}

.agency-empty {
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
