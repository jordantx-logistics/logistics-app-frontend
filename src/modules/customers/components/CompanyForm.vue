<script setup lang="ts">
import { ref } from 'vue'

import type { ApiError } from '@/core/api/errors'
import type { CreateCompanyPayload } from '../types/customers.types'
import Button from '@/core/components/Button.vue'
import FormField from '@/core/components/FormField.vue'
import Input from '@/core/components/Input.vue'
import Textarea from '@/core/components/Textarea.vue'

/**
 * Alta de empresa (cliente corporativo). Emite el payload y deja la llamada al
 * módulo, igual que `PersonForm`.
 */
export interface CompanyFormProps {
  loading?: boolean
  error?: ApiError | null
}

const props = withDefaults(defineProps<CompanyFormProps>(), {
  loading: false,
  error: null,
})

const emit = defineEmits<{
  submit: [payload: CreateCompanyPayload]
  cancel: []
}>()

const taxId = ref('')
const businessName = ref('')
const tradeName = ref('')
const address = ref('')
const contactEmail = ref('')
const contactPhone = ref('')

function orNull(value: string): string | null {
  const trimmed = value.trim()

  return trimmed === '' ? null : trimmed
}

function onSubmit(): void {
  emit('submit', {
    tax_id: taxId.value.trim(),
    business_name: businessName.value.trim(),
    trade_name: orNull(tradeName.value),
    address: orNull(address.value),
    contact_email: orNull(contactEmail.value),
    contact_phone: orNull(contactPhone.value),
  })
}
</script>

<template>
  <form class="form" @submit.prevent="onSubmit">
    <div v-if="props.error && !props.error.isValidationError" class="form-alert">
      {{ props.error.message }}
    </div>

    <div class="form-grid">
      <FormField label="Tax ID (RUC)" :error="props.error?.fieldError('tax_id')">
        <Input v-model="taxId" placeholder="20151757680" />
      </FormField>

      <FormField label="Business name" :error="props.error?.fieldError('business_name')">
        <Input v-model="businessName" placeholder="Hirthe Inc S.A.C." />
      </FormField>

      <FormField label="Trade name" :error="props.error?.fieldError('trade_name')">
        <Input v-model="tradeName" placeholder="Hauck-Leuschke" />
      </FormField>

      <FormField label="Contact phone" :error="props.error?.fieldError('contact_phone')">
        <Input v-model="contactPhone" placeholder="999 888 777" />
      </FormField>

      <FormField
        label="Contact email"
        class="form-field-wide"
        :error="props.error?.fieldError('contact_email')"
      >
        <Input v-model="contactEmail" type="email" placeholder="contact@example.com" />
      </FormField>

      <FormField
        label="Address"
        class="form-field-wide"
        :error="props.error?.fieldError('address')"
      >
        <Textarea v-model="address" placeholder="544 Aglae Ridge Apt. 067" :rows="2" />
      </FormField>
    </div>

    <div class="form-actions">
      <Button variant="ghost" @click="emit('cancel')"> Cancel </Button>
      <Button variant="primary" :loading="props.loading" @click="onSubmit"> Save company </Button>
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
