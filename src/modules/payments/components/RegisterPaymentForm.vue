<script setup lang="ts">
import { reactive, ref } from 'vue'

import { ApiError } from '@/core/api/errors'
import Button from '@/core/components/Button.vue'
import FormField from '@/core/components/FormField.vue'
import Input from '@/core/components/Input.vue'
import { useToast } from '@/core/composables/useToast'

import { usePaymentsStore } from '../stores/usePaymentsStore'

/**
 * Alta de un cobro total o parcial. Genera una clave de idempotencia por
 * intento para que un doble clic no cree dos pagos.
 */
const emit = defineEmits<{
  created: [paymentId: number]
  cancel: []
}>()

const store = usePaymentsStore()
const toast = useToast()

const form = reactive({
  order_id: '',
  amount: '',
  payment_method: 'cash',
  document_type: '',
  reference: '',
})

const error = ref<ApiError | null>(null)

function newKey(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `pay-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const idempotencyKey = ref(newKey())

function fieldError(field: string): string | undefined {
  return error.value?.fieldError(field)
}

async function submit(): Promise<void> {
  error.value = null

  try {
    const paymentId = await store.register({
      order_id: Number(form.order_id),
      amount: Number(form.amount),
      payment_method: form.payment_method,
      document_type: form.document_type === '' ? undefined : form.document_type,
      idempotency_key: idempotencyKey.value,
      reference: form.reference.trim() === '' ? undefined : form.reference.trim(),
    })

    toast.success('Payment registered', 'The cash movement and invoice were created.')
    emit('created', paymentId)
  } catch (caught) {
    error.value = caught instanceof ApiError ? caught : null
    toast.error('Could not register the payment', error.value?.message)
  }
}
</script>

<template>
  <form class="form" @submit.prevent="submit">
    <FormField label="Order ID" :error="fieldError('order_id')">
      <Input v-model="form.order_id" type="number" placeholder="42" />
    </FormField>

    <FormField label="Amount" :error="fieldError('amount')">
      <Input v-model="form.amount" type="number" placeholder="25.90" />
    </FormField>

    <div class="grid">
      <FormField label="Method" :error="fieldError('payment_method')">
        <select v-model="form.payment_method" class="control">
          <option value="cash">Cash</option>
          <option value="pos">POS</option>
        </select>
      </FormField>

      <FormField label="Document" :error="fieldError('document_type')">
        <select v-model="form.document_type" class="control">
          <option value="">Automatic</option>
          <option value="boleta">Boleta</option>
          <option value="factura">Factura</option>
        </select>
      </FormField>
    </div>

    <FormField label="Reference" :error="fieldError('reference')">
      <Input v-model="form.reference" placeholder="POS operation or voucher" />
    </FormField>

    <p v-if="error && !error.isValidationError" class="form-error">{{ error.message }}</p>

    <div class="actions">
      <Button variant="secondary" type="button" @click="emit('cancel')">Cancel</Button>
      <Button type="submit" :loading="store.saving">Register payment</Button>
    </div>
  </form>
</template>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.control {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
  color: var(--fg);
  font-size: 14px;
}

.form-error {
  font-size: 12px;
  color: var(--danger);
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 4px;
}
</style>
