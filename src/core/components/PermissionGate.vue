<script setup lang="ts">
import { computed } from 'vue'

import { useAuthStore } from '@/core/stores/auth'

/**
 * Envuelve una sección que solo tiene sentido con un permiso.
 *
 * Es **presentación**: la autorización real la hace el backend en cada ruta. Sirve
 * para no ofrecer una acción que respondería 403; el estado del recurso se resuelve
 * aparte, deshabilitando la acción.
 */
const props = defineProps<{
  /** Exige este permiso. */
  permission?: string
  /** Basta con uno de estos. */
  any?: string[]
}>()

const authStore = useAuthStore()

const allowed = computed(() => {
  if (props.permission !== undefined && !authStore.can(props.permission)) {
    return false
  }

  return props.any === undefined || authStore.canAny(props.any)
})
</script>

<template>
  <slot v-if="allowed" />
  <slot v-else name="fallback" />
</template>
