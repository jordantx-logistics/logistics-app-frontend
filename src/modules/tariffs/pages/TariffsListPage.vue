<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Plus } from 'lucide-vue-next'

import AppShell from '@/core/components/AppShell.vue'
import Badge from '@/core/components/Badge.vue'
import Button from '@/core/components/Button.vue'
import Card from '@/core/components/Card.vue'
import DataTable from '@/core/components/DataTable.vue'
import ListState from '@/core/components/ListState.vue'
import Modal from '@/core/components/Modal.vue'
import Pagination from '@/core/components/Pagination.vue'
import type { Column } from '@/core/components/types'
import '@/core/styles/backoffice.css'

import TariffForm from '../components/TariffForm.vue'
import { useTariffsStore } from '../stores/useTariffsStore'
import type { Tariff } from '../types/tariffs.types'

/** Tarifarios: alta, edición y vigencia. El cálculo lo hace siempre el backend. */

const store = useTariffsStore()

const editing = ref<Tariff | null>(null)
const creating = ref(false)

const rows = computed(() => store.tariffs.data?.rows ?? [])
const meta = computed(() => store.tariffs.data?.meta)

const COLUMNS: Column[] = [
  { key: 'code', label: 'Code' },
  { key: 'name', label: 'Name' },
  { key: 'service_type', label: 'Service' },
  { key: 'scope_type', label: 'Scope' },
  { key: 'base_price', label: 'Base (S/)' },
  { key: 'price_per_kg', label: 'Per kg (S/)' },
  { key: 'valid_from', label: 'Valid from' },
  { key: 'is_active', label: 'Status' },
  { key: 'actions', label: '' },
]

function search(): void {
  store.tariffsPage = 1
  void store.tariffs.load()
}

function goToPage(page: number): void {
  store.tariffsPage = page
  void store.tariffs.load()
}

function close(): void {
  creating.value = false
  editing.value = null
}

onMounted(() => {
  void store.tariffs.load()
})
</script>

<template>
  <AppShell>
    <div class="bo-page">
      <div class="bo-header">
        <div>
          <h1 class="bo-title">Tariffs</h1>
          <p class="bo-subtitle">Prices used by the order quote engine</p>
        </div>
        <Button @click="creating = true">
          <template #leading><Plus :size="16" /></template>
          New tariff
        </Button>
      </div>

      <Card>
        <form class="bo-filters" @submit.prevent="search">
          <label class="bo-filter">
            <span>Search</span>
            <input v-model="store.tariffsSearch" placeholder="Code or name" @change="search" />
          </label>
        </form>
      </Card>

      <Card title="Tariffs">
        <ListState
          :status="store.tariffs.status"
          :error="store.tariffs.error"
          :empty="rows.length === 0"
          empty-text="No tariffs match this search."
          @retry="store.tariffs.load"
        >
          <DataTable :columns="COLUMNS" :data="rows">
            <template #code="{ row }">
              <span class="bo-mono">{{ row.code }}</span>
            </template>
            <template #is_active="{ row }">
              <Badge :variant="row.is_active ? 'success' : 'neutral'">
                {{ row.is_active ? 'Active' : 'Inactive' }}
              </Badge>
            </template>
            <template #actions="{ row }">
              <button class="bo-link" @click="editing = row as Tariff">Edit</button>
            </template>
          </DataTable>

          <Pagination
            :page="meta?.current_page ?? 1"
            :last-page="meta?.last_page ?? 1"
            :total="meta?.total ?? rows.length"
            :per-page="meta?.per_page ?? 15"
            @update:page="goToPage"
          />
        </ListState>
      </Card>
    </div>

    <Modal
      :visible="creating || editing !== null"
      :title="editing ? 'Edit tariff' : 'New tariff'"
      @close="close"
    >
      <TariffForm :key="editing?.id ?? 'new'" :tariff="editing" @saved="close" @cancel="close" />
    </Modal>
  </AppShell>
</template>
