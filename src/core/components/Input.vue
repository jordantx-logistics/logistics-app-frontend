<script setup lang="ts">
import { ref } from 'vue'

export interface InputProps {
  modelValue?: string | number
  placeholder?: string
  type?: string
  error?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<InputProps>(), {
  placeholder: '',
  type: 'text',
  error: false,
  disabled: false,
  modelValue: '',
})

const emit = defineEmits<{
  'update:model-value': [value: string]
}>()

const internalValue = ref(props.modelValue)

function onChange(e: Event) {
  const val = (e.target as HTMLInputElement).value
  internalValue.value = val
  emit('update:model-value', val)
}
</script>

<!-- eslint-disable-next-line vue/multi-word-component-names -->
export default { name: 'Input' }

<template>
  <div class="auth-input-wrap" :class="{ error: props.error }">
    <input
      class="auth-input"
      :type="props.type"
      :value="internalValue"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      @input="onChange"
    />
  </div>
</template>

<style scoped>
.auth-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
  transition:
    border-color 150ms cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1);
}

.auth-input-wrap:focus-within {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.08);
}

.auth-input-wrap.error {
  border-color: #e04545;
}

.auth-input {
  flex: 1;
  padding: 10px 12px;
  background: 0 0;
  border: none;
  outline: none;
  color: var(--fg);
  font-size: 14px;
}

.auth-input::placeholder {
  color: var(--muted);
}

.auth-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
