<script setup lang="ts">
import { computed } from 'vue'

import Badge from '@/core/components/Badge.vue'

import { humanizeStatus, statusVariant } from '../composables/useOperationsPresentation'

/**
 * Estado de un envío, entrega o conteo con el color de su grupo.
 *
 * El texto y el color son presentación: el backend sigue siendo la fuente de
 * verdad y valida cada transición.
 */
export interface OperationStatusBadgeProps {
  status: string
}

const props = defineProps<OperationStatusBadgeProps>()

const variant = computed(() => statusVariant(props.status))
const label = computed(() => humanizeStatus(props.status))
</script>

<template>
  <Badge :variant="variant" dot>{{ label }}</Badge>
</template>
