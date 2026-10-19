<script setup lang="ts">
import { ref } from 'vue'

import type { ApiError } from '@/core/api/errors'
import type { CreatePersonPayload } from '../types/customers.types'
import Button from '@/core/components/Button.vue'
import FormField from '@/core/components/FormField.vue'
import Input from '@/core/components/Input.vue'
import Select from '@/core/components/Select.vue'

/**
 * Alta de persona (cliente individual).
 *
 * No llama al API: arma el payload y lo emite; el módulo hace el `POST` y le
 * devuelve el `loading` y el error (con los mensajes de validación por campo).
 */
export interface PersonFormProps {
  loading?: boolean
  error?: ApiError | null
}

const props = withDefaults(defineProps<PersonFormProps>(), {
  loading: false,
  error: null,
})

const emit = defineEmits<{
  submit: [payload: CreatePersonPayload]
  cancel: []
}>()

const DOCUMENT_TYPES = [
  { label: 'DNI', value: 'DNI' },
  { label: 'RUC', value: 'RUC' },
  { label: 'Foreigner card', value: 'CE' },
  { label: 'Passport', value: 'PASSPORT' },
]

const documentType = ref('DNI')
const documentNumber = ref('')
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const phone = ref('')

/** Los campos `nullable` del contrato viajan como `null`, no como `''`. */
function orNull(value: string): string | null {
  const trimmed = value.trim()

  return trimmed === '' ? null : trimmed
}

function onSubmit(): void {
  emit('submit', {
    document_type: documentType.value,
    document_number: documentNumber.value.trim(),
    first_name: firstName.value.trim(),
    last_name: lastName.value.trim(),
    email: orNull(email.value),
    phone: orNull(phone.value),
  })
}
</script>

<template>
  <form class="form" @submit.prevent="onSubmit">
    <div v-if="props.error && !props.error.isValidationError" class="form-alert">
      {{ props.error.message }}
    </div>

    <div class="form-grid">
      <FormField label="Document type" :error="props.error?.fieldError('document_type')">
        <Select v-model="documentType" :options="DOCUMENT_TYPES" placeholder="Document type" />
      </FormField>

      <FormField label="Document number" :error="props.error?.fieldError('document_number')">
        <Input v-model="documentNumber" placeholder="51757680" />
      </FormField>

      <FormField label="First name" :error="props.error?.fieldError('first_name')">
        <Input v-model="firstName" placeholder="Noah" />
      </FormField>

      <FormField label="Last name" :error="props.error?.fieldError('last_name')">
        <Input v-model="lastName" placeholder="Cronin" />
      </FormField>

      <FormField label="Email" :error="props.error?.fieldError('email')">
        <Input v-model="email" type="email" placeholder="name@example.com" />
      </FormField>

      <FormField label="Phone" :error="props.error?.fieldError('phone')">
        <Input v-model="phone" placeholder="999 888 777" />
      </FormField>
    </div>

    <div class="form-actions">
      <Button variant="ghost" @click="emit('cancel')"> Cancel </Button>
      <Button variant="primary" :loading="props.loading" @click="onSubmit"> Save person </Button>
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
