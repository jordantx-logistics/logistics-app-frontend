<script setup lang="ts">
export interface SelectProps {
  modelValue?: string
  options: { label: string; value: string }[]
  placeholder?: string
}

const props = withDefaults(defineProps<SelectProps>(), {
  placeholder: 'Select...',
  modelValue: '',
})

const emit = defineEmits<{
  'update:model-value': [value: string]
}>()

function onChange(e: Event) {
  const val = (e.target as HTMLSelectElement).value
  emit('update:model-value', val)
}
</script>

<!-- eslint-disable-next-line vue/multi-word-component-names -->
export default { name: 'Select' }

<template>
  <select class="form-select" :value="props.modelValue" @change="onChange">
    <option value="" disabled>{{ props.placeholder }}</option>
    <option v-for="opt in props.options" :key="opt.value" :value="opt.value">
      {{ opt.label }}
    </option>
  </select>
</template>

<style scoped>
.form-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
  color: var(--fg);
  font-size: 13px;
  transition:
    border-color 150ms cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.form-select:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.08);
}
</style>
