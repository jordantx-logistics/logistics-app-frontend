<script setup lang="ts">
export interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  dot?: boolean
}

defineProps<BadgeProps>()
</script>

<!-- eslint-disable-next-line vue/multi-word-component-names -->
export default { name: 'Badge' }

<template>
  <span class="badge" :class="`badge-${variant || 'neutral'}`">
    <span v-if="dot" class="badge-dot" :class="`badge-dot-${variant}`" />
    <slot />
  </span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}

/* OKLCH color definitions from reference */
:root {
  --oklch-success: oklch(62% 0.18 145);
  --oklch-warning: oklch(72% 0.16 80);
  --oklch-danger: oklch(60% 0.20 25);
  --oklch-info: oklch(58% 0.18 255);
}

.badge-success {
  background: rgba(oklch(62% 0.18 145), 0.08);
  color: oklch(62% 0.18 145);
}

.badge-warning {
  background: rgba(oklch(72% 0.16 80), 0.08);
  color: oklch(72% 0.16 80);
}

.badge-danger {
  background: rgba(oklch(60% 0.20 25), 0.08);
  color: oklch(60% 0.20 25);
}

.badge-info {
  background: rgba(oklch(58% 0.18 255), 0.08);
  color: oklch(58% 0.18 255);
}

.badge-neutral {
  background: var(--bg);
  color: var(--fg-secondary);
  border: 1px solid var(--border);
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.badge-dot-success {
  background: oklch(62% 0.18 145);
}

.badge-dot-warning {
  background: oklch(72% 0.16 80);
}

.badge-dot-danger {
  background: oklch(60% 0.20 25);
}

.badge-dot-info {
  background: oklch(58% 0.18 255);
}
</style>
