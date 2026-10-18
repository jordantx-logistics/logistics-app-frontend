<script setup lang="ts">
import { ref } from 'vue'

export interface ToggleProps {
  modelValue?: boolean
  label?: string
}

const props = withDefaults(defineProps<ToggleProps>(), {
  label: '',
  modelValue: false,
})

const emit = defineEmits<{
  'update:model-value': [value: boolean]
}>()

const isOn = ref(props.modelValue)

function toggle() {
  isOn.value = !isOn.value
  emit('update:model-value', isOn.value)
}
</script>

<!-- eslint-disable-next-line vue/multi-word-component-names -->
export default { name: 'Toggle' }

<template>
  <label class="toggle">
    <input type="checkbox" :checked="isOn" @change="toggle" />
    <span class="toggle-slider" />
    <span v-if="props.label" class="toggle-label">{{ props.label }}</span>
  </label>
</template>

<style scoped>
.toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.toggle input {
  display: none;
}

.toggle-slider {
  width: 36px;
  height: 20px;
  background: var(--border);
  border-radius: 10px;
  position: relative;
  transition: background 150ms cubic-bezier(0.4, 0, 0.2, 1);
}

.toggle-slider::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  background: #fff;
  border-radius: 50%;
  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1);
}

.toggle input:checked + .toggle-slider {
  background: #6366f1;
}

.toggle input:checked + .toggle-slider::after {
  transform: translateX(16px);
}

.toggle-label {
  font-size: 13px;
  color: var(--fg-secondary);
}
</style>
