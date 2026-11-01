<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import { ApiError } from '@/core/api/errors'
import Button from '@/core/components/Button.vue'
import FormField from '@/core/components/FormField.vue'
import Input from '@/core/components/Input.vue'
import ListState from '@/core/components/ListState.vue'
import { useAsyncData } from '@/core/composables/useAsyncData'
import { useToast } from '@/core/composables/useToast'

import * as settingsApi from '../api/settings.api'

/**
 * Parámetros de negocio. Solo se envía lo que cambió: la auditoría del backend no se
 * llena de escrituras que no cambian nada.
 */

const GROUP_LABELS: Record<string, string> = { fleet: 'Fleet', pricing: 'Pricing' }

const toast = useToast()
const settings = useAsyncData(() => settingsApi.listSettings())
const draft = ref<Record<string, string>>({})
const saving = ref(false)
const error = ref<ApiError | null>(null)

const rows = computed(() => settings.data.value ?? [])
const groups = computed(() => [...new Set(rows.value.map((row) => String(row.group)))])
const changes = computed(() =>
  rows.value
    .filter((row) => draft.value[row.key] !== undefined && draft.value[row.key] !== row.value)
    .map((row) => ({ key: row.key, value: String(draft.value[row.key]) })),
)

function reset(): void {
  draft.value = Object.fromEntries(rows.value.map((row) => [row.key, row.value]))
}

async function load(): Promise<void> {
  await settings.load()
  reset()
}

async function save(): Promise<void> {
  saving.value = true
  error.value = null

  try {
    settings.data.value = await settingsApi.updateSettings(changes.value)
    reset()
    toast.success('Settings saved', 'They apply to new operations right away.')
  } catch (caught) {
    error.value = caught instanceof ApiError ? caught : null
    toast.error('Could not save the settings', error.value?.message)
  } finally {
    saving.value = false
  }
}

onMounted(load)
</script>

<template>
  <ListState
    :status="settings.status.value"
    :error="settings.error.value"
    :empty="rows.length === 0"
    @retry="load"
  >
    <form class="bo-form" @submit.prevent="save">
      <section v-for="group in groups" :key="group" class="bo-form">
        <h3 class="settings-group">{{ GROUP_LABELS[group] ?? group }}</h3>

        <div class="bo-grid">
          <FormField
            v-for="row in rows.filter((item) => item.group === group)"
            :key="row.key"
            :label="row.label"
          >
            <select
              v-if="row.type === 'enum'"
              v-model="draft[row.key]"
              class="bo-control"
              :aria-label="row.label"
            >
              <option v-for="option in row.options" :key="String(option)" :value="option">
                {{ option }}
              </option>
            </select>
            <Input v-else v-model="draft[row.key]" type="number" />
          </FormField>
        </div>
      </section>

      <p class="bo-hint">
        Switching the pricing engine affects new quotes; existing orders keep their price.
      </p>
      <p v-if="error" class="bo-form-error">{{ error.message }}</p>

      <div class="bo-form-actions">
        <Button type="submit" :disabled="changes.length === 0" :loading="saving">
          Save changes
        </Button>
      </div>
    </form>
  </ListState>
</template>

<style scoped>
.settings-group {
  font-size: 14px;
  font-weight: 600;
  color: var(--fg);
}
</style>
