<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'

export interface LoadingSpinnerProps {
  size?: number
  strokeWidth?: number
}

withDefaults(defineProps<LoadingSpinnerProps>(), {
  size: 16,
  strokeWidth: 2,
})
</script>

<!-- eslint-disable-next-line vue/multi-word-component-names -->
export default { name: 'LoadingSpinner' }

<template>
  <Loader2 class="spinner" :size="size" :stroke-width="strokeWidth" />
</template>

<style scoped>
.spinner {
  animation: spin 0.6s linear infinite;
  color: rgba(255, 255, 255, 0.3);
}
</style>
