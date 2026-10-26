<script setup lang="ts">
import { computed, ref } from 'vue'

import type { ApiError } from '@/core/api/errors'
import Button from '@/core/components/Button.vue'
import FormField from '@/core/components/FormField.vue'
import Textarea from '@/core/components/Textarea.vue'

import type { FailDeliveryPayload } from '../types/operations.types'

/**
 * Registra un intento fallido. El backend decide si aún quedan intentos o si el
 * envío pasa a `returned` al superar el máximo configurado.
 */
export interface FailDeliveryFormProps {
  loading?: boolean
  error?: ApiError | null
}

const props = withDefaults(defineProps<FailDeliveryFormProps>(), {
  loading: false,
  error: null,
})

const emit = defineEmits<{
  submit: [payload: FailDeliveryPayload]
  cancel: []
}>()

const failureReason = ref('')

const canSubmit = computed(() => failureReason.value.trim() !== '')

function onSubmit(): void {
  emit('submit', { failure_reason: failureReason.value.trim() })
}
</script>

<template>
  <form class="form" @submit.prevent="onSubmit">
    <div v-if="props.error && !props.error.isValidationError" class="form-alert">
      {{ props.error.message }}
    </div>

    <FormField label="Failure reason" :error="props.error?.fieldError('failure_reason')">
      <Textarea
        v-model="failureReason"
        :rows="4"
        placeholder="Recipient not available at the address"
      />
    </FormField>

    <div class="form-actions">
      <Button variant="ghost" @click="emit('cancel')">Cancel</Button>
      <Button variant="primary" :loading="props.loading" :disabled="!canSubmit" @click="onSubmit">
        Register failure
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
