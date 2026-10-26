<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import AppShell from '@/core/components/AppShell.vue'
import Card from '@/core/components/Card.vue'
import DataTable from '@/core/components/DataTable.vue'
import ListState from '@/core/components/ListState.vue'
import Pagination from '@/core/components/Pagination.vue'
import { useToast } from '@/core/composables/useToast'
import { useAuthStore } from '@/core/stores/auth'
import { formatText } from '@/core/utils/format'

import ReceptionForm from '../components/ReceptionForm.vue'
import { useAsyncAction } from '../composables/useAsyncAction'
import { formatDateTime, RECEPTION_COLUMNS } from '../composables/useOperationsPresentation'
import { useOperationsStore } from '../stores/useOperationsStore'

/**
 * Recepción física de paquetes en la agencia de origen.
 *
 * El formulario solo se pinta con `shipments.receive`; el listado necesita
 * `shipments.view`. La autorización real la hace el backend en cada ruta.
 */

const store = useOperationsStore()
const auth = useAuthStore()
const { success } = useToast()
const { loading, error, run } = useAsyncAction()

const formKey = ref(0)

const agencies = computed(() => auth.agencies)
const canReceive = computed(() => auth.can('shipments.receive'))
const rows = computed(() => store.receptions.data?.data ?? [])
const meta = computed(() => store.receptions.data?.meta)
const page = computed(() => store.receptionsQuery.page ?? 1)

async function onSubmit(payload: Parameters<typeof store.receiveShipments>[0]): Promise<void> {
  const result = await run(() => store.receiveShipments(payload))

  if (result) {
    success('Reception registered', 'The parcels were received and are now traceable.')
    formKey.value += 1
  }
}

function goToPage(next: number): void {
  store.updateReceptionsQuery({ page: next })
}

onMounted(() => {
  void store.receptions.load()
})
</script>

<template>
  <AppShell>
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Reception</h1>
          <p class="page-subtitle">Register parcels when they arrive at the origin agency</p>
        </div>
      </div>

      <Card v-if="canReceive" title="Register reception">
        <ReceptionForm
          :key="formKey"
          :agencies="agencies"
          :loading="loading"
          :error="error"
          @submit="onSubmit"
          @cancel="formKey += 1"
        />
      </Card>

      <Card class="table-card">
        <template #header>
          <div class="table-header">
            <h2 class="table-title">
              Receptions
              <span v-if="meta">({{ meta.total }})</span>
            </h2>
          </div>
        </template>

        <ListState
          :status="store.receptions.status"
          :error="store.receptions.error"
          :empty="rows.length === 0"
          empty-text="No receptions registered yet."
          @retry="store.receptions.load"
        >
          <DataTable :columns="RECEPTION_COLUMNS" :data="rows">
            <template #id="{ row }">#{{ formatText(row.id) }}</template>
            <template #agency_id="{ row }">#{{ formatText(row.agency_id) }}</template>
            <template #items_count="{ row }">{{ formatText(row.items_count) }}</template>
            <template #received_by="{ row }">{{ formatText(row.received_by) }}</template>
            <template #received_at="{ row }">{{ formatDateTime(row.received_at) }}</template>
          </DataTable>

          <Pagination
            :page="page"
            :last-page="meta?.last_page ?? 1"
            :total="meta?.total ?? rows.length"
            :per-page="meta?.per_page ?? store.PER_PAGE"
            @update:page="goToPage"
          />
        </ListState>
      </Card>
    </div>
  </AppShell>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.page-title {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--fg);
}

.page-subtitle {
  margin-top: 2px;
  font-size: 13px;
  color: var(--muted);
}

.table-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.table-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--fg);
}
</style>
