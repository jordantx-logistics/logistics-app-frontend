<script setup lang="ts">
import { ref } from 'vue'

import { ApiError } from '@/core/api/errors'
import Button from '@/core/components/Button.vue'
import Input from '@/core/components/Input.vue'

import * as ordersApi from '../api/orders.api'
import type { LocationOption } from '../types/orders.types'

/** Ubicación de reparto: se busca por ubigeo, distrito, provincia o departamento. */
const props = defineProps<{
  modelValue: LocationOption | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: LocationOption | null]
}>()

const query = ref('')
const results = ref<LocationOption[] | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

async function search(): Promise<void> {
  if (query.value.trim().length < 2) {
    return
  }

  loading.value = true
  error.value = null

  try {
    results.value = await ordersApi.searchLocations(query.value.trim())
  } catch (caught) {
    error.value = caught instanceof ApiError ? caught.message : 'The search failed.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div v-if="props.modelValue" class="location-selected">
    <span>
      {{ props.modelValue.district }}, {{ props.modelValue.province }},
      {{ props.modelValue.department }}
    </span>
    <button type="button" class="bo-link" @click="emit('update:modelValue', null)">Change</button>
  </div>

  <div v-else class="bo-form">
    <div class="location-search">
      <Input v-model="query" placeholder="District, province or ubigeo" />
      <Button type="button" variant="secondary" :loading="loading" @click="search">Search</Button>
    </div>

    <p v-if="error" class="bo-form-error">{{ error }}</p>

    <select
      v-if="results && results.length > 0"
      class="bo-control"
      aria-label="Delivery location"
      @change="
        emit(
          'update:modelValue',
          results?.find((row) => row.id === Number(($event.target as HTMLSelectElement).value)) ??
            null,
        )
      "
    >
      <option value="">Select a location</option>
      <option v-for="location in results" :key="location.id" :value="location.id">
        {{ location.ubigeo }} · {{ location.district }}, {{ location.province }}
      </option>
    </select>

    <p v-else-if="results" class="bo-hint">No locations found.</p>
  </div>
</template>

<style scoped>
.location-selected {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: var(--fg);
}

.location-search {
  display: flex;
  gap: 8px;
}
</style>
