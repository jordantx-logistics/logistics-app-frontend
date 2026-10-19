<script setup lang="ts">
/**
 * Campo de formulario: etiqueta, control (slot) y el error de validación del
 * backend (422) debajo. Los formularios de alta de §5.6 lo comparten.
 */
export interface FormFieldProps {
  label: string
  error?: string | undefined
}

defineProps<FormFieldProps>()
</script>

<template>
  <label class="form-field">
    <span class="form-label">{{ label }}</span>
    <slot />
    <span v-if="error" class="form-error">{{ error }}</span>
  </label>
</template>

<style scoped>
.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--fg-secondary);
}

.form-error {
  font-size: 12px;
  color: var(--danger);
}
</style>
