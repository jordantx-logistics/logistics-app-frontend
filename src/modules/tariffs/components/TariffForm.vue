<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'

import { ApiError } from '@/core/api/errors'
import Button from '@/core/components/Button.vue'
import FormField from '@/core/components/FormField.vue'
import Input from '@/core/components/Input.vue'
import Toggle from '@/core/components/Toggle.vue'
import { useToast } from '@/core/composables/useToast'
import { localIsoDate } from '@/core/utils/format'

import * as tariffsApi from '../api/tariffs.api'
import { useTariffsStore } from '../stores/useTariffsStore'
import type { Tariff, TariffPayload } from '../types/tariffs.types'

/**
 * Alta y edición de un tarifario de alcance nacional o entre zonas. El alcance por
 * par de ubicaciones se sigue gestionando por API: exige elegir dos distritos entre
 * casi 2 000 y no lo usa ningún tarifario hoy.
 */
const props = defineProps<{
  tariff?: Tariff | null
}>()

const emit = defineEmits<{
  saved: []
  cancel: []
}>()

const store = useTariffsStore()
const toast = useToast()

const row = props.tariff ?? null

const form = reactive({
  code: String(row?.code ?? ''),
  name: String(row?.name ?? ''),
  service_type: String(row?.service_type ?? 'standard'),
  scope_type: String(row?.scope_type ?? 'national'),
  origin_zone_id: row?.origin_zone_id ? String(row.origin_zone_id) : '',
  destination_zone_id: row?.destination_zone_id ? String(row.destination_zone_id) : '',
  base_price: String(row?.base_price ?? ''),
  price_per_kg: String(row?.price_per_kg ?? ''),
  min_charge: String(row?.min_charge ?? ''),
  max_weight_kg: String(row?.max_weight_kg ?? ''),
  valid_from: String(row?.valid_from ?? localIsoDate()),
  valid_to: row?.valid_to ? String(row.valid_to) : '',
  is_active: row ? Boolean(row.is_active) : true,
})

const saving = ref(false)
const error = ref<ApiError | null>(null)

const zones = computed(() => store.zones.data?.rows ?? [])
const needsZones = computed(() => form.scope_type === 'zone_pair')

async function submit(): Promise<void> {
  saving.value = true
  error.value = null

  const payload = {
    code: form.code,
    name: form.name,
    service_type: form.service_type,
    scope_type: form.scope_type,
    origin_zone_id: needsZones.value ? Number(form.origin_zone_id) : null,
    destination_zone_id: needsZones.value ? Number(form.destination_zone_id) : null,
    base_price: Number(form.base_price),
    price_per_kg: Number(form.price_per_kg),
    min_charge: Number(form.min_charge),
    max_weight_kg: Number(form.max_weight_kg),
    valid_from: form.valid_from,
    valid_to: form.valid_to === '' ? null : form.valid_to,
    is_active: form.is_active,
  } as TariffPayload

  try {
    if (row) {
      await tariffsApi.updateTariff(Number(row.id), payload)
    } else {
      await tariffsApi.createTariff(payload)
    }

    toast.success(row ? 'Tariff updated' : 'Tariff created')
    await store.tariffs.load()
    emit('saved')
  } catch (caught) {
    error.value = caught instanceof ApiError ? caught : null
    toast.error('Could not save the tariff', error.value?.message)
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  if (store.zones.status === 'idle') {
    void store.zones.load()
  }
})
</script>

<template>
  <form class="bo-form" @submit.prevent="submit">
    <div class="bo-grid">
      <FormField label="Code" :error="error?.fieldError('code')">
        <Input v-model="form.code" placeholder="LIM-NOR-2026" />
      </FormField>
      <FormField label="Name" :error="error?.fieldError('name')">
        <Input v-model="form.name" placeholder="Lima to the north" />
      </FormField>
    </div>

    <div class="bo-grid">
      <FormField label="Service" :error="error?.fieldError('service_type')">
        <select v-model="form.service_type" class="bo-control" aria-label="Service">
          <option value="standard">Standard</option>
          <option value="express">Express</option>
        </select>
      </FormField>
      <FormField label="Scope" :error="error?.fieldError('scope_type')">
        <select v-model="form.scope_type" class="bo-control" aria-label="Scope">
          <option value="national">National</option>
          <option value="zone_pair">Between zones</option>
        </select>
      </FormField>
    </div>

    <div v-if="needsZones" class="bo-grid">
      <FormField label="Origin zone" :error="error?.fieldError('origin_zone_id')">
        <select v-model="form.origin_zone_id" class="bo-control" aria-label="Origin zone">
          <option value="">Select a zone</option>
          <option v-for="zone in zones" :key="zone.id" :value="String(zone.id)">
            {{ zone.name }}
          </option>
        </select>
      </FormField>
      <FormField label="Destination zone" :error="error?.fieldError('destination_zone_id')">
        <select v-model="form.destination_zone_id" class="bo-control" aria-label="Destination zone">
          <option value="">Select a zone</option>
          <option v-for="zone in zones" :key="zone.id" :value="String(zone.id)">
            {{ zone.name }}
          </option>
        </select>
      </FormField>
    </div>

    <div class="bo-grid">
      <FormField label="Base price (S/)" :error="error?.fieldError('base_price')">
        <Input v-model="form.base_price" type="number" placeholder="5" />
      </FormField>
      <FormField label="Price per kg (S/)" :error="error?.fieldError('price_per_kg')">
        <Input v-model="form.price_per_kg" type="number" placeholder="2.5" />
      </FormField>
      <FormField label="Minimum charge (S/)" :error="error?.fieldError('min_charge')">
        <Input v-model="form.min_charge" type="number" placeholder="10" />
      </FormField>
      <FormField label="Maximum weight (kg)" :error="error?.fieldError('max_weight_kg')">
        <Input v-model="form.max_weight_kg" type="number" placeholder="100" />
      </FormField>
      <FormField label="Valid from" :error="error?.fieldError('valid_from')">
        <input v-model="form.valid_from" class="bo-control" type="date" aria-label="Valid from" />
      </FormField>
      <FormField label="Valid to (optional)" :error="error?.fieldError('valid_to')">
        <input v-model="form.valid_to" class="bo-control" type="date" aria-label="Valid to" />
      </FormField>
    </div>

    <label class="bo-filter">
      <span>Active</span>
      <Toggle v-model="form.is_active" />
    </label>

    <p v-if="error && !error.isValidationError" class="bo-form-error">{{ error.message }}</p>

    <div class="bo-form-actions">
      <Button type="button" variant="ghost" @click="emit('cancel')">Cancel</Button>
      <Button type="submit" :loading="saving">Save</Button>
    </div>
  </form>
</template>
