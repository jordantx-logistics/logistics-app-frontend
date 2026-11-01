<script setup lang="ts">
import { ref } from 'vue'

import { ApiError } from '@/core/api/errors'
import Button from '@/core/components/Button.vue'
import Input from '@/core/components/Input.vue'

import * as ordersApi from '../api/orders.api'
import type { CustomerOption } from '../types/orders.types'

/** Busca un cliente por nombre o documento y lo reutiliza en la orden. */
const props = defineProps<{
  modelValue: CustomerOption | null
  title: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: CustomerOption | null]
}>()

const query = ref('')
const results = ref<CustomerOption[] | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

async function search(): Promise<void> {
  if (query.value.trim() === '') {
    return
  }

  loading.value = true
  error.value = null

  try {
    results.value = await ordersApi.searchCustomers(query.value.trim())
  } catch (caught) {
    error.value = caught instanceof ApiError ? caught.message : 'The search failed.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="bo-form">
    <h3 class="picker-title">{{ props.title }}</h3>

    <div v-if="props.modelValue" class="picker-selected">
      <div>
        <strong>{{ props.modelValue.display_name }}</strong>
        <p class="bo-hint">
          {{ props.modelValue.document_type }} {{ props.modelValue.document_number }}
        </p>
      </div>
      <button type="button" class="bo-link" @click="emit('update:modelValue', null)">Change</button>
    </div>

    <template v-else>
      <form class="picker-search" @submit.prevent="search">
        <Input v-model="query" placeholder="Name or document number" />
        <Button type="submit" variant="secondary" :loading="loading">Search</Button>
      </form>

      <p v-if="error" class="bo-form-error">{{ error }}</p>

      <ul v-if="results && results.length > 0" class="picker-results">
        <li v-for="customer in results" :key="customer.id">
          <button type="button" class="picker-result" @click="emit('update:modelValue', customer)">
            <strong>{{ customer.display_name }}</strong>
            <span class="bo-hint">{{ customer.document_type }} {{ customer.document_number }}</span>
          </button>
        </li>
      </ul>

      <p v-else-if="results" class="bo-hint">
        No customers found. Register them in
        <router-link to="/customers">Customers</router-link>
        and search again.
      </p>
    </template>
  </div>
</template>

<style scoped>
.picker-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--fg);
}

.picker-search {
  display: flex;
  gap: 8px;
}

.picker-selected {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
}

.picker-results {
  display: flex;
  flex-direction: column;
  gap: 4px;
  list-style: none;
  padding: 0;
}

.picker-result {
  display: flex;
  width: 100%;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: none;
  color: var(--fg);
  font-size: 13px;
  text-align: left;
  cursor: pointer;
}
</style>
