<script setup lang="ts">
import { ref } from 'vue'

import { ApiError } from '@/core/api/errors'
import Button from '@/core/components/Button.vue'
import FormField from '@/core/components/FormField.vue'
import Input from '@/core/components/Input.vue'
import { useToast } from '@/core/composables/useToast'

import { useCashStore } from '../stores/useCashStore'

/** Cierre con conteo; el backend decide si queda pendiente de aprobación. */
const props = defineProps<{
  sessionId: number
  expectedAmount: string
}>()

const emit = defineEmits<{
  closed: []
  cancel: []
}>()

const store = useCashStore()
const toast = useToast()

const closingAmount = ref(props.expectedAmount)
const error = ref<ApiError | null>(null)

async function submit(): Promise<void> {
  error.value = null

  try {
    const result = await store.close(props.sessionId, {
      closing_amount: Number(closingAmount.value),
    })

    if (result?.requires_approval) {
      toast.info(
        'Closing sent for approval',
        'The counted cash differs from the expected amount. The session stays open.',
      )
    } else {
      toast.success('Cash session closed', 'The reported cash matches the expected amount.')
    }

    emit('closed')
  } catch (caught) {
    error.value = caught instanceof ApiError ? caught : null
    toast.error('Could not close the cash session', error.value?.message)
  }
}
</script>

<template>
  <form class="form" @submit.prevent="submit">
    <p class="hint">
      Expected cash: <strong>S/ {{ props.expectedAmount }}</strong
      >. Any difference keeps the session open until a supervisor approves it.
    </p>

    <FormField label="Counted cash" :error="error?.fieldError('closing_amount')">
      <Input v-model="closingAmount" type="number" placeholder="0.00" />
    </FormField>

    <p v-if="error && !error.isValidationError" class="form-error">{{ error.message }}</p>

    <div class="actions">
      <Button variant="secondary" type="button" @click="emit('cancel')">Cancel</Button>
      <Button type="submit" :loading="store.saving" :disabled="closingAmount === ''">
        Close session
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

.hint {
  font-size: 13px;
  line-height: 1.5;
  color: var(--muted);
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
