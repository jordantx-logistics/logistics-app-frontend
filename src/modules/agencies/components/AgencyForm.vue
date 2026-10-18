<script setup lang="ts">
import { ref } from 'vue'

import type { ApiError } from '@/core/api/errors'
import type { CreateAgencyPayload } from '@/core/api/types'
import Button from '@/core/components/Button.vue'
import FormField from '@/core/components/FormField.vue'
import Input from '@/core/components/Input.vue'
import Textarea from '@/core/components/Textarea.vue'
import Toggle from '@/core/components/Toggle.vue'

/**
 * Alta de agencia. Emite el payload; el módulo hace el `POST` y le devuelve el
 * `loading` y el error (422 con los mensajes por campo).
 */
export interface AgencyFormProps {
  loading?: boolean
  error?: ApiError | null
}

const props = withDefaults(defineProps<AgencyFormProps>(), {
  loading: false,
  error: null,
})

const emit = defineEmits<{
  submit: [payload: CreateAgencyPayload]
  cancel: []
}>()

const code = ref('')
const name = ref('')
const address = ref('')
const phone = ref('')
const district = ref('')
const isActive = ref(true)

function orNull(value: string): string | null {
  const trimmed = value.trim()

  return trimmed === '' ? null : trimmed
}

function onSubmit(): void {
  emit('submit', {
    code: code.value.trim(),
    name: name.value.trim(),
    address: orNull(address.value),
    phone: orNull(phone.value),
    district: orNull(district.value),
    is_active: isActive.value,
  })
}
</script>

<template>
  <form class="form" @submit.prevent="onSubmit">
    <div v-if="props.error && !props.error.isValidationError" class="form-alert">
      {{ props.error.message }}
    </div>

    <div class="form-grid">
      <FormField label="Code" :error="props.error?.fieldError('code')">
        <Input v-model="code" placeholder="LIM01" />
      </FormField>

      <FormField label="Name" :error="props.error?.fieldError('name')">
        <Input v-model="name" placeholder="LogiTrack Lima" />
      </FormField>

      <FormField label="Phone" :error="props.error?.fieldError('phone')">
        <Input v-model="phone" placeholder="999 888 777" />
      </FormField>

      <FormField label="District" :error="props.error?.fieldError('district')">
        <Input v-model="district" placeholder="Lefflerhaven" />
      </FormField>

      <FormField
        label="Address"
        class="form-field-wide"
        :error="props.error?.fieldError('address')"
      >
        <Textarea v-model="address" placeholder="99279 Kenyatta Knoll" :rows="2" />
      </FormField>
    </div>

    <Toggle v-model="isActive" label="Active agency" />

    <div class="form-actions">
      <Button variant="ghost" @click="emit('cancel')"> Cancel </Button>
      <Button variant="primary" :loading="props.loading" @click="onSubmit"> Save agency </Button>
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
