<script setup lang="ts">
import { ref } from 'vue'

export interface TextareaProps {
  modelValue?: string
  placeholder?: string
  rows?: number
}

const props = withDefaults(defineProps<TextareaProps>(), {
  placeholder: '',
  rows: 3,
  modelValue: '',
})

const emit = defineEmits<{
  'update:model-value': [value: string]
}>()

const internalValue = ref(props.modelValue)

function onChange(e: Event) {
  const val = (e.target as HTMLTextAreaElement).value
  internalValue.value = val
  emit('update:model-value', val)
}
</script>

<!-- eslint-disable-next-line vue/multi-word-component-names -->
export default { name: 'Textarea' }

<template>
  <textarea class="form-textarea" :value="internalValue" :placeholder="props.placeholder" :rows="props.rows"
    @input="onChange" />
</template>

<style scoped>
.form-textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
  color: var(--fg);
  font-size: 13px;
  transition: border-color 150ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1);
  resize: vertical;
  min-height: 80px;
}

.form-textarea:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.08);
}
</style>
