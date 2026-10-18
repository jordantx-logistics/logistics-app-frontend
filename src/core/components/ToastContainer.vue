<script setup lang="ts">
import { CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-vue-next'
import { useToast } from '@/core/composables/useToast'

const { toasts } = useToast()

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

defineExpose({ name: 'ToastContainer' })
</script>

<template>
  <div class="toast-container">
    <div v-for="toast in toasts" :key="toast.id" class="toast toast-{{ toast.type }} toast-fade-in">
      <component :is="icons[toast.type]" class="toast-icon" :size="18" stroke-width="2" />
      <div class="toast-content">
        <div class="toast-title">{{ toast.title }}</div>
        <div v-if="toast.message" class="toast-message">{{ toast.message }}</div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.toast-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 200;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: var(--surface-raised);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  font-size: 13px;
  animation: slideIn 200ms ease;
  min-width: 280px;
}

.toast-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.toast-success .toast-icon {
  color: var(--success);
}

.toast-error .toast-icon {
  color: var(--danger);
}
</style>
