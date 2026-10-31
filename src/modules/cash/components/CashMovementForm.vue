<script setup lang="ts">
import { ref } from 'vue'

import { ApiError } from '@/core/api/errors'
import Button from '@/core/components/Button.vue'
import FormField from '@/core/components/FormField.vue'
import Input from '@/core/components/Input.vue'
import Textarea from '@/core/components/Textarea.vue'
import { useToast } from '@/core/composables/useToast'

import { useCashStore } from '../stores/useCashStore'

/** Egreso o retiro de efectivo de la sesión abierta. */
const emit = defineEmits<{
  saved: []
  cancel: []
}>()

const store = useCashStore()
const toast = useToast()

const type = ref<'expense' | 'withdrawal'>('expense')
const amount = ref('')
const note = ref('')
const error = ref<ApiError | null>(null)

async function submit(): Promise<void> {
  error.value = null

  try {
    await store.move({
      type: type.value,
      amount: Number(amount.value),
      note: note.value.trim(),
    })
    toast.success('Cash movement registered', 'The expected cash was recalculated.')
    emit('saved')
  } catch (caught) {
    error.value = caught instanceof ApiError ? caught : null
    toast.error('Could not register the movement', error.value?.message)
  }
}
</script>

<template>
  <form class="form" @submit.prevent="submit">
    <FormField label="Type" :error="error?.fieldError('type')">
      <select v-model="type" class="control">
        <option value="expense">Expense</option>
        <option value="withdrawal">Withdrawal</option>
      </select>
    </FormField>

    <FormField label="Amount" :error="error?.fieldError('amount')">
      <Input v-model="amount" type="number" placeholder="0.00" />
    </FormField>

    <FormField label="Note" :error="error?.fieldError('note')">
      <Textarea v-model="note" placeholder="Fuel, supplies, cash delivery..." />
    </FormField>

    <p v-if="error && !error.isValidationError" class="form-error">{{ error.message }}</p>

    <div class="actions">
      <Button variant="secondary" type="button" @click="emit('cancel')">Cancel</Button>
      <Button type="submit" :loading="store.saving" :disabled="amount === '' || note.trim() === ''">
        Register movement
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
