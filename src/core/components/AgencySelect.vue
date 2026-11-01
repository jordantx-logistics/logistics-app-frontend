<script setup lang="ts">
import { computed, onMounted } from 'vue'

import { useAgencyOptionsStore } from '@/core/stores/agencyOptions'

/**
 * Selector de agencia. El valor es el id como texto, igual que un `<input>`, para
 * que los formularios no cambien su forma de leerlo.
 */
const props = withDefaults(
  defineProps<{
    modelValue: string
    placeholder?: string
    disabled?: boolean
    ariaLabel?: string
  }>(),
  { placeholder: 'Select an agency', disabled: false, ariaLabel: undefined },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const store = useAgencyOptionsStore()

const options = computed(() =>
  store.rows.map((agency) => ({
    value: String(agency.id),
    label: `${agency.code} · ${agency.name}`,
  })),
)

onMounted(store.ensureLoaded)
</script>

<template>
  <select
    class="agency-select"
    :value="props.modelValue"
    :disabled="props.disabled || store.status === 'loading'"
    :aria-label="props.ariaLabel"
    @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
  >
    <option value="">{{ props.placeholder }}</option>
    <option v-for="option in options" :key="option.value" :value="option.value">
      {{ option.label }}
    </option>
  </select>
</template>

<style scoped>
.agency-select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
  color: var(--fg);
  font-size: 14px;
}
</style>
