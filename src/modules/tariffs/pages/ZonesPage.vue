<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'

import { ApiError } from '@/core/api/errors'
import AgencySelect from '@/core/components/AgencySelect.vue'
import AppShell from '@/core/components/AppShell.vue'
import Button from '@/core/components/Button.vue'
import Card from '@/core/components/Card.vue'
import DataTable from '@/core/components/DataTable.vue'
import FormField from '@/core/components/FormField.vue'
import Input from '@/core/components/Input.vue'
import ListState from '@/core/components/ListState.vue'
import Pagination from '@/core/components/Pagination.vue'
import type { Column } from '@/core/components/types'
import { useToast } from '@/core/composables/useToast'
import { useAgencyOptionsStore } from '@/core/stores/agencyOptions'
import '@/core/styles/backoffice.css'

import * as tariffsApi from '../api/tariffs.api'
import { useTariffsStore } from '../stores/useTariffsStore'
import type { CoveragePayload, Location, LocationPayload } from '../types/tariffs.types'

/** Zonas tarifarias, a qué zona pertenece cada distrito y qué cubre cada agencia. */

const store = useTariffsStore()
const agencies = useAgencyOptionsStore()
const toast = useToast()

const tab = ref<'zones' | 'locations' | 'coverages'>('zones')
const saving = ref(false)
const zoneError = ref<ApiError | null>(null)
const coverageError = ref<ApiError | null>(null)

const zoneForm = reactive({ code: '', name: '' })
const coverageForm = reactive({ agency_id: '', location_id: '', delivery_surcharge: '' })

const zones = computed(() => store.zones.data?.rows ?? [])
const locations = computed(() => store.locations.data?.rows ?? [])
const locationsMeta = computed(() => store.locations.data?.meta)
const coverages = computed(() => store.coverages.data?.rows ?? [])
const coveragesMeta = computed(() => store.coverages.data?.meta)

const ZONE_COLUMNS: Column[] = [
  { key: 'code', label: 'Code' },
  { key: 'name', label: 'Name' },
]

const LOCATION_COLUMNS: Column[] = [
  { key: 'ubigeo', label: 'Ubigeo' },
  { key: 'district', label: 'District' },
  { key: 'province', label: 'Province' },
  { key: 'department', label: 'Department' },
  { key: 'zone_id', label: 'Zone' },
]

const COVERAGE_COLUMNS: Column[] = [
  { key: 'agency_id', label: 'Agency' },
  { key: 'location_id', label: 'Location' },
  { key: 'delivery_surcharge', label: 'Surcharge (S/)' },
]

async function createZone(): Promise<void> {
  saving.value = true
  zoneError.value = null

  try {
    await tariffsApi.createZone({ code: zoneForm.code, name: zoneForm.name })
    toast.success('Zone created')
    zoneForm.code = ''
    zoneForm.name = ''
    await store.zones.load()
  } catch (caught) {
    zoneError.value = caught instanceof ApiError ? caught : null
    toast.error('Could not create the zone', zoneError.value?.message)
  } finally {
    saving.value = false
  }
}

async function moveLocation(row: Location, zoneId: string): Promise<void> {
  try {
    await tariffsApi.updateLocation(Number(row.id), {
      ubigeo: row.ubigeo,
      department: row.department,
      province: row.province,
      district: row.district,
      zone_id: Number(zoneId),
    } as LocationPayload)
    toast.success('Location updated')
    await store.locations.load()
  } catch (caught) {
    toast.error('Could not update the location', caught instanceof ApiError ? caught.message : '')
  }
}

async function createCoverage(): Promise<void> {
  saving.value = true
  coverageError.value = null

  try {
    await tariffsApi.createCoverage({
      agency_id: Number(coverageForm.agency_id),
      location_id: Number(coverageForm.location_id),
      allows_pickup: true,
      allows_delivery: true,
      delivery_surcharge:
        coverageForm.delivery_surcharge === '' ? null : Number(coverageForm.delivery_surcharge),
    } as CoveragePayload)
    toast.success('Coverage added')
    coverageForm.location_id = ''
    coverageForm.delivery_surcharge = ''
    await store.coverages.load()
  } catch (caught) {
    coverageError.value = caught instanceof ApiError ? caught : null
    toast.error('Could not add the coverage', coverageError.value?.message)
  } finally {
    saving.value = false
  }
}

function searchLocations(): void {
  store.locationsPage = 1
  void store.locations.load()
}

function goToLocations(page: number): void {
  store.locationsPage = page
  void store.locations.load()
}

function goToCoverages(page: number): void {
  store.coveragesPage = page
  void store.coverages.load()
}

// Cada pestaña carga lo suyo al abrirse: `locations` son casi 2 000 distritos.
watch(tab, (next) => {
  if (next === 'locations' && store.locations.status === 'idle') {
    void store.locations.load()
  }

  if (next === 'coverages' && store.coverages.status === 'idle') {
    agencies.ensureLoaded()
    void store.coverages.load()
  }
})

onMounted(() => {
  void store.zones.load()
})
</script>

<template>
  <AppShell>
    <div class="bo-page">
      <div class="bo-header">
        <div>
          <h1 class="bo-title">Zones</h1>
          <p class="bo-subtitle">Pricing zones, their districts and agency coverage</p>
        </div>
      </div>

      <div class="bo-tabs">
        <button class="bo-tab" :class="{ active: tab === 'zones' }" @click="tab = 'zones'">
          Zones
        </button>
        <button class="bo-tab" :class="{ active: tab === 'locations' }" @click="tab = 'locations'">
          Locations
        </button>
        <button class="bo-tab" :class="{ active: tab === 'coverages' }" @click="tab = 'coverages'">
          Coverage
        </button>
      </div>

      <template v-if="tab === 'zones'">
        <Card title="New zone">
          <form class="bo-form" @submit.prevent="createZone">
            <div class="bo-grid">
              <FormField label="Code" :error="zoneError?.fieldError('code')">
                <Input v-model="zoneForm.code" placeholder="NORTE" />
              </FormField>
              <FormField label="Name" :error="zoneError?.fieldError('name')">
                <Input v-model="zoneForm.name" placeholder="North" />
              </FormField>
            </div>
            <div class="bo-form-actions">
              <Button type="submit" :loading="saving">Create zone</Button>
            </div>
          </form>
        </Card>

        <Card title="Zones">
          <ListState
            :status="store.zones.status"
            :error="store.zones.error"
            :empty="zones.length === 0"
            empty-text="No zones yet."
            @retry="store.zones.load"
          >
            <DataTable :columns="ZONE_COLUMNS" :data="zones" />
          </ListState>
        </Card>
      </template>

      <Card v-else-if="tab === 'locations'" title="Locations">
        <form class="bo-filters" @submit.prevent="searchLocations">
          <label class="bo-filter">
            <span>Search</span>
            <input
              v-model="store.locationsSearch"
              placeholder="District, province or ubigeo"
              @change="searchLocations"
            />
          </label>
        </form>

        <ListState
          :status="store.locations.status"
          :error="store.locations.error"
          :empty="locations.length === 0"
          empty-text="No locations match this search."
          @retry="store.locations.load"
        >
          <DataTable :columns="LOCATION_COLUMNS" :data="locations">
            <template #zone_id="{ row }">
              <select
                class="bo-control"
                :value="String(row.zone_id)"
                :aria-label="`Zone of ${row.district}`"
                @change="moveLocation(row as Location, ($event.target as HTMLSelectElement).value)"
              >
                <option v-for="zone in zones" :key="zone.id" :value="String(zone.id)">
                  {{ zone.name }}
                </option>
              </select>
            </template>
          </DataTable>

          <Pagination
            :page="locationsMeta?.current_page ?? 1"
            :last-page="locationsMeta?.last_page ?? 1"
            :total="locationsMeta?.total ?? locations.length"
            :per-page="locationsMeta?.per_page ?? 15"
            @update:page="goToLocations"
          />
        </ListState>
      </Card>

      <template v-else>
        <Card title="New coverage">
          <form class="bo-form" @submit.prevent="createCoverage">
            <div class="bo-grid">
              <FormField label="Agency" :error="coverageError?.fieldError('agency_id')">
                <AgencySelect v-model="coverageForm.agency_id" aria-label="Agency" />
              </FormField>
              <FormField label="Location ID" :error="coverageError?.fieldError('location_id')">
                <Input v-model="coverageForm.location_id" type="number" placeholder="1" />
              </FormField>
            </div>
            <FormField
              label="Delivery surcharge (S/, optional)"
              :error="coverageError?.fieldError('delivery_surcharge')"
            >
              <Input v-model="coverageForm.delivery_surcharge" type="number" placeholder="8" />
            </FormField>
            <div class="bo-form-actions">
              <Button type="submit" :loading="saving">Add coverage</Button>
            </div>
          </form>
        </Card>

        <Card title="Coverage">
          <ListState
            :status="store.coverages.status"
            :error="store.coverages.error"
            :empty="coverages.length === 0"
            empty-text="No coverage yet."
            @retry="store.coverages.load"
          >
            <DataTable :columns="COVERAGE_COLUMNS" :data="coverages">
              <template #agency_id="{ row }">{{ agencies.label(row.agency_id) }}</template>
            </DataTable>

            <Pagination
              :page="coveragesMeta?.current_page ?? 1"
              :last-page="coveragesMeta?.last_page ?? 1"
              :total="coveragesMeta?.total ?? coverages.length"
              :per-page="coveragesMeta?.per_page ?? 15"
              @update:page="goToCoverages"
            />
          </ListState>
        </Card>
      </template>
    </div>
  </AppShell>
</template>
