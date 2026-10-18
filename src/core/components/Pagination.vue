<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

/**
 * Pie de paginación. Lo usan igual los listados que pagina el servidor (órdenes,
 * con el `meta` de Laravel) y los que se filtran en el cliente.
 */
export interface PaginationProps {
  page: number
  lastPage: number
  total: number
  perPage: number
}

const props = defineProps<PaginationProps>()

const emit = defineEmits<{
  'update:page': [page: number]
}>()

/** Ventana de páginas alrededor de la actual (como mucho, cinco botones). */
const pages = computed<number[]>(() => {
  const window = 2
  const first = Math.max(1, Math.min(props.page - window, props.lastPage - window * 2))
  const last = Math.min(props.lastPage, Math.max(props.page + window, window * 2 + 1))
  const result: number[] = []

  for (let current = first; current <= last; current++) {
    result.push(current)
  }

  return result
})

const from = computed(() => (props.total === 0 ? 0 : (props.page - 1) * props.perPage + 1))
const to = computed(() => Math.min(props.page * props.perPage, props.total))

function goTo(page: number): void {
  if (page >= 1 && page <= props.lastPage && page !== props.page) {
    emit('update:page', page)
  }
}
</script>

<template>
  <div v-if="props.lastPage > 1" class="pagination">
    <span class="pagination-summary"> Showing {{ from }}–{{ to }} of {{ props.total }} </span>
    <div class="pagination-pages">
      <button
        class="pagination-btn"
        :disabled="props.page <= 1"
        aria-label="Previous page"
        @click="goTo(props.page - 1)"
      >
        <ChevronLeft :size="14" stroke-width="2" />
      </button>
      <button
        v-for="number in pages"
        :key="number"
        class="pagination-btn"
        :class="{ active: number === props.page }"
        @click="goTo(number)"
      >
        {{ number }}
      </button>
      <button
        class="pagination-btn"
        :disabled="props.page >= props.lastPage"
        aria-label="Next page"
        @click="goTo(props.page + 1)"
      >
        <ChevronRight :size="14" stroke-width="2" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 16px;
  border-top: 1px solid var(--border);
  font-size: 12px;
  color: var(--muted);
}

.pagination-pages {
  display: flex;
  align-items: center;
  gap: 2px;
}

.pagination-btn {
  min-width: 28px;
  height: 28px;
  padding: 0 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: var(--fg-secondary);
  cursor: pointer;
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
}

.pagination-btn:hover:not(:disabled) {
  background: var(--bg);
}

.pagination-btn.active {
  background: rgba(99, 102, 241, 0.08);
  color: #6366f1;
  font-weight: 600;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
