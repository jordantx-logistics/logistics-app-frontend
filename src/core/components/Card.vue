<script setup lang="ts">
export interface CardProps {
  title?: string
  actions?: boolean
}

defineProps<CardProps>()
</script>

<!-- eslint-disable-next-line vue/multi-word-component-names -->
export default { name: 'Card' }

<template>
  <div class="card">
    <div v-if="title || $slots.header" class="card-header">
      <span v-if="title" class="card-title">{{ title }}</span>
      <div class="card-header-actions">
        <slot name="header" />
        <slot name="actions" />
      </div>
    </div>
    <slot />
  </div>
</template>

<style scoped>
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 18px 20px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
}

.card-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
