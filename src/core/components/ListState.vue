<script setup lang="ts">
import { AlertCircle, Inbox } from 'lucide-vue-next'

import type { ApiError } from '@/core/api/errors'
import type { LoadStatus } from '@/core/composables/useAsyncData'
import Button from './Button.vue'
import LoadingSpinner from './LoadingSpinner.vue'

/**
 * Estados de una pantalla con datos remotos: cargando, error (con reintento) o
 * vacío. Cuando hay datos, pinta el contenido del slot.
 *
 * Sin esto, una tabla se queda en blanco mientras carga o cuando el backend no
 * responde, que es justo lo que hay que evitar.
 */
export interface ListStateProps {
  status: LoadStatus
  error?: ApiError | null
  /** `true` cuando la carga fue bien pero no hay filas. */
  empty?: boolean
  emptyText?: string
}

const props = withDefaults(defineProps<ListStateProps>(), {
  error: null,
  empty: false,
  emptyText: 'Nothing to show yet.',
})

const emit = defineEmits<{
  retry: []
}>()
</script>

<template>
  <div v-if="props.status === 'idle' || props.status === 'loading'" class="list-state">
    <LoadingSpinner :size="20" />
    <span>Loading…</span>
  </div>

  <div v-else-if="props.status === 'error'" class="list-state list-state-error">
    <AlertCircle :size="20" stroke-width="2" />
    <span>{{ props.error?.message ?? 'Something went wrong.' }}</span>
    <Button variant="secondary" size="sm" @click="emit('retry')"> Retry </Button>
  </div>

  <div v-else-if="props.empty" class="list-state">
    <Inbox :size="20" stroke-width="2" />
    <span>{{ props.emptyText }}</span>
  </div>

  <slot v-else />
</template>

<style scoped>
.list-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 40px 20px;
  font-size: 13px;
  color: var(--muted);
  text-align: center;
}

.list-state-error {
  color: var(--danger);
}
</style>
