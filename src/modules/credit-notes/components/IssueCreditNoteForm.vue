<script setup lang="ts">
import { ref } from 'vue'

import { ApiError } from '@/core/api/errors'
import Button from '@/core/components/Button.vue'
import FormField from '@/core/components/FormField.vue'
import Input from '@/core/components/Input.vue'
import Textarea from '@/core/components/Textarea.vue'
import { useToast } from '@/core/composables/useToast'

import { useCreditNotesStore } from '../stores/useCreditNotesStore'
import { CREDIT_NOTE_REASONS } from '../types/credit-notes.types'

/** Emisión de una nota de crédito sobre un comprobante aceptado. */
const props = withDefaults(
  defineProps<{
    initialPaymentId?: number
  }>(),
  { initialPaymentId: 0 },
)

const emit = defineEmits<{
  issued: []
  cancel: []
}>()

const store = useCreditNotesStore()
const toast = useToast()

const paymentId = ref(props.initialPaymentId > 0 ? String(props.initialPaymentId) : '')
const amount = ref('')
const reason = ref('01')
const note = ref('')
const error = ref<ApiError | null>(null)

async function submit(): Promise<void> {
  error.value = null

  try {
    await store.issue({
      payment_id: Number(paymentId.value),
      amount: Number(amount.value),
      reason: reason.value,
      note: note.value.trim() === '' ? undefined : note.value.trim(),
    })
    toast.success('Credit note issued', 'The payment status and cash were recalculated.')
    emit('issued')
  } catch (caught) {
    error.value = caught instanceof ApiError ? caught : null
    toast.error('Could not issue the credit note', error.value?.message)
  }
}
</script>

<template>
  <form class="form" @submit.prevent="submit">
    <FormField label="Payment ID" :error="error?.fieldError('payment_id')">
      <Input v-model="paymentId" type="number" placeholder="42" />
    </FormField>

    <FormField label="Amount" :error="error?.fieldError('amount')">
      <Input v-model="amount" type="number" placeholder="25.90" />
    </FormField>

    <FormField label="Reason" :error="error?.fieldError('reason')">
      <select v-model="reason" class="control">
        <option v-for="item in CREDIT_NOTE_REASONS" :key="item.value" :value="item.value">
          {{ item.label }}
        </option>
      </select>
    </FormField>

    <FormField label="Note" :error="error?.fieldError('note')">
      <Textarea v-model="note" placeholder="Optional detail for the credit note." />
    </FormField>

    <p v-if="error && !error.isValidationError" class="form-error">{{ error.message }}</p>

    <div class="actions">
      <Button variant="secondary" type="button" @click="emit('cancel')">Cancel</Button>
      <Button type="submit" :loading="store.saving" :disabled="paymentId === '' || amount === ''">
        Issue credit note
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
}
</style>
