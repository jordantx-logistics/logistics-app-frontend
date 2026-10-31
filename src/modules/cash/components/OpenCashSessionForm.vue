<script setup lang="ts">
import { ref } from 'vue'

import { ApiError } from '@/core/api/errors'
import Button from '@/core/components/Button.vue'
import FormField from '@/core/components/FormField.vue'
import Input from '@/core/components/Input.vue'
import { useToast } from '@/core/composables/useToast'

import { useCashStore } from '../stores/useCashStore'

/** Apertura de caja con el fondo inicial. */
const emit = defineEmits<{
  opened: []
  cancel: []
}>()

const store = useCashStore()
const toast = useToast()

const openingAmount = ref('')
const error = ref<ApiError | null>(null)

async function submit(): Promise<void> {
  error.value = null

  try {
    await store.open({ opening_amount: Number(openingAmount.value) })
    toast.success('Cash session opened', 'You can now register cash payments.')
    emit('opened')
  } catch (caught) {
    error.value = caught instanceof ApiError ? caught : null
    toast.error('Could not open the cash session', error.value?.message)
  }
}
</script>

<template>
  <form class="form" @submit.prevent="submit">
    <FormField label="Opening amount" :error="error?.fieldError('opening_amount')">
      <Input v-model="openingAmount" type="number" placeholder="0.00" />
    </FormField>
    <p v-if="error && !error.isValidationError" class="form-error">{{ error.message }}</p>
    <div class="actions">
      <Button variant="secondary" type="button" @click="emit('cancel')">Cancel</Button>
      <Button type="submit" :loading="store.saving" :disabled="openingAmount === ''">
        Open session
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
