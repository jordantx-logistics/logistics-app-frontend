<script setup lang="ts">
import { computed, ref } from 'vue'

import type { ApiError } from '@/core/api/errors'
import Button from '@/core/components/Button.vue'
import FormField from '@/core/components/FormField.vue'
import Input from '@/core/components/Input.vue'

import type { CompleteDeliveryPayload } from '../types/operations.types'

/**
 * Cierre de una entrega con la evidencia que exige el contrato.
 *
 * La subida de archivos llega en una fase posterior: por ahora se guardan las
 * rutas (`deliveries/...`) que el PDA subirá. El backend valida el prefijo.
 */
export interface CompleteDeliveryFormProps {
  loading?: boolean
  error?: ApiError | null
}

const props = withDefaults(defineProps<CompleteDeliveryFormProps>(), {
  loading: false,
  error: null,
})

const emit = defineEmits<{
  submit: [payload: CompleteDeliveryPayload]
  cancel: []
}>()

const recipientName = ref('')
const recipientDocument = ref('')
const signaturePath = ref('')
const photoPath = ref('')
const latitude = ref('')
const longitude = ref('')
const capturedAt = ref(new Date().toISOString().slice(0, 16))

const canSubmit = computed(
  () =>
    recipientName.value.trim() !== '' &&
    recipientDocument.value.trim() !== '' &&
    signaturePath.value.trim().startsWith('deliveries/') &&
    photoPath.value.trim().startsWith('deliveries/') &&
    latitude.value !== '' &&
    longitude.value !== '' &&
    capturedAt.value !== '',
)

function onSubmit(): void {
  emit('submit', {
    recipient_name: recipientName.value.trim(),
    recipient_document: recipientDocument.value.trim(),
    signature_path: signaturePath.value.trim(),
    photo_path: photoPath.value.trim(),
    latitude: Number(latitude.value),
    longitude: Number(longitude.value),
    captured_at: new Date(capturedAt.value).toISOString(),
  })
}
</script>

<template>
  <form class="form" @submit.prevent="onSubmit">
    <div v-if="props.error && !props.error.isValidationError" class="form-alert">
      {{ props.error.message }}
    </div>

    <div class="form-grid">
      <FormField label="Recipient name" :error="props.error?.fieldError('recipient_name')">
        <Input v-model="recipientName" placeholder="Ana Torres" />
      </FormField>

      <FormField label="Recipient document" :error="props.error?.fieldError('recipient_document')">
        <Input v-model="recipientDocument" placeholder="44556677" />
      </FormField>

      <FormField label="Signature path" :error="props.error?.fieldError('signature_path')">
        <Input v-model="signaturePath" placeholder="deliveries/signature-123.png" />
      </FormField>

      <FormField label="Photo path" :error="props.error?.fieldError('photo_path')">
        <Input v-model="photoPath" placeholder="deliveries/photo-123.jpg" />
      </FormField>

      <FormField label="Latitude" :error="props.error?.fieldError('latitude')">
        <Input v-model="latitude" type="number" placeholder="-12.0464" />
      </FormField>

      <FormField label="Longitude" :error="props.error?.fieldError('longitude')">
        <Input v-model="longitude" type="number" placeholder="-77.0428" />
      </FormField>

      <FormField label="Captured at" :error="props.error?.fieldError('captured_at')">
        <Input v-model="capturedAt" type="datetime-local" />
      </FormField>
    </div>

    <p class="form-hint">
      Evidence paths must start with <code>deliveries/</code>; the backend rejects anything else.
    </p>

    <div class="form-actions">
      <Button variant="ghost" @click="emit('cancel')">Cancel</Button>
      <Button variant="primary" :loading="props.loading" :disabled="!canSubmit" @click="onSubmit">
        Complete delivery
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

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 14px;
}

.form-hint {
  margin: 0;
  font-size: 12px;
  color: var(--fg-secondary);
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
