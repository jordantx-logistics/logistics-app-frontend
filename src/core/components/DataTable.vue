<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { ref } from 'vue'
import type { DataTableProps } from './types'

const props = withDefaults(defineProps<DataTableProps>(), {
  search: false,
  searchable: false,
  pagination: false,
  perPage: 10,
  currentPage: 1,
})

const emit = defineEmits<{
  'update:search': [value: string]
  'update:page': [value: number]
  'update:sort': [key: string, order: 'asc' | 'desc']
}>()

const searchValue = ref('')

function onSearchChange(val: string) {
  searchValue.value = val
  emit('update:search', val)
}

function getSortedData() {
  return props.data
}

function getPageCount() {
  return Math.ceil(props.data.length / props.perPage)
}

function getPageNumbers() {
  const count = getPageCount()
  const pages: number[] = []
  for (let i = 1; i <= count; i++) {
    pages.push(i)
  }
  return pages
}
</script>

<template>
  <div class="table-container">
    <div class="table-toolbar">
      <div v-if="searchable" class="table-search">
        <input
          type="text"
          placeholder="Search..."
          :value="searchValue"
          @update:model-value="onSearchChange"
        />
      </div>
    </div>

    <table class="data-table">
      <thead>
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            class="sortable"
            :class="{ sortable: col.sortable }"
            @click="col.sortable && emit('update:sort', col.key, 'asc')"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in getSortedData()" :key="String(row.id || row._id)">
          <td v-for="col in columns" :key="col.key">
            <slot :name="col.key" :row="row">
              {{ row[col.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="pagination" class="table-footer">
      <span>Showing {{ props.data.length }} entries</span>
      <div class="table-pagination">
        <button class="table-page-btn" :disabled="currentPage <= 1">
          <ChevronLeft :size="14" stroke-width="2" />
        </button>
        <template v-for="page in getPageNumbers()" :key="page">
          <button
            class="table-page-btn"
            :class="{ active: page === currentPage }"
            @click="$emit('update:page', page)"
          >
            {{ page }}
          </button>
        </template>
        <button class="table-page-btn" :disabled="currentPage >= getPageCount()">
          <ChevronRight :size="14" stroke-width="2" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.table-container {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
}

.table-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  flex-wrap: wrap;
}

.table-search {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
  font-size: 13px;
  color: var(--muted);
  min-width: 200px;
}

.table-search:focus-within {
  border-color: #6366f1;
}

.table-search input {
  border: none;
  background: 0 0;
  outline: none;
  color: var(--fg);
  width: 100%;
  font-size: 13px;
}

.data-table th {
  text-align: left;
  padding: 10px 16px;
  font-size: 12px;
  font-weight: 600;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-bottom: 1px solid var(--border);
  background: var(--bg);
  white-space: nowrap;
}

.data-table td {
  padding: 10px 16px;
  font-size: 13px;
  border-bottom: 1px solid var(--border);
  vertical-align: middle;
}

.data-table tbody tr {
  transition: background 150ms cubic-bezier(0.4, 0, 0.2, 1);
}

.data-table tbody tr:hover {
  background: var(--bg);
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

.table-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-top: 1px solid var(--border);
  font-size: 12px;
  color: var(--muted);
}

.table-pagination {
  display: flex;
  align-items: center;
  gap: 2px;
}

.table-page-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: var(--fg-secondary);
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
}

.table-page-btn:hover {
  background: var(--bg);
}

.table-page-btn.active {
  background: rgba(oklch(58% 0.18 255), 0.08);
  color: oklch(58% 0.18 255);
  font-weight: 600;
}

.table-page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.sortable {
  cursor: pointer;
}

.sortable:hover {
  background: var(--border);
}
</style>
