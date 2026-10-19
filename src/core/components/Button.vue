<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md'
  loading?: boolean
  disabled?: boolean
  block?: boolean
}

defineProps<ButtonProps>()
defineEmits<{
  click: []
}>()
</script>

<!-- eslint-disable-next-line vue/multi-word-component-names -->
export default { name: 'Button' }

<template>
  <button
    class="btn"
    :class="[
      `btn-${variant || 'primary'}`,
      `btn-${size || 'md'}`,
      { loading: loading, block: block },
    ]"
    :disabled="disabled || loading"
    @click="$emit('click')"
  >
    <slot name="leading" />
    <Loader2 v-if="loading" :size="16" class="spinner" stroke-width="2" />
    <slot />
    <slot name="trailing" />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: oklch(58% 0.18 255);
  color: #fff;
}

.btn-primary:hover {
  background: oklch(58% 0.18 255 / 0.9);
}

.btn-secondary {
  background: var(--bg);
  color: var(--fg);
  border: 1px solid var(--border);
}

.btn-secondary:hover {
  background: var(--border);
}

.btn-ghost {
  color: var(--fg-secondary);
}

.btn-ghost:hover {
  background: var(--bg);
  color: var(--fg);
}

.btn-sm {
  padding: 5px 10px;
  font-size: 12px;
}

.btn-icon {
  padding: 6px;
}

.btn.loading .spinner {
  animation: spin 0.6s linear infinite;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn.block {
  width: 100%;
}
</style>
