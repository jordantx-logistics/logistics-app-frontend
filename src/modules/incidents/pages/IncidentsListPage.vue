<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Plus } from 'lucide-vue-next'

import { ApiError } from '@/core/api/errors'
import AppShell from '@/core/components/AppShell.vue'
import Badge from '@/core/components/Badge.vue'
import Button from '@/core/components/Button.vue'
import Card from '@/core/components/Card.vue'
import DataTable from '@/core/components/DataTable.vue'
import FormField from '@/core/components/FormField.vue'
import Input from '@/core/components/Input.vue'
import ListState from '@/core/components/ListState.vue'
import Modal from '@/core/components/Modal.vue'
import Pagination from '@/core/components/Pagination.vue'
import PermissionGate from '@/core/components/PermissionGate.vue'
import Textarea from '@/core/components/Textarea.vue'
import type { Column } from '@/core/components/types'
import { useAuth } from '@/core/composables/useAuth'
import { useToast } from '@/core/composables/useToast'
import '@/core/styles/backoffice.css'
import { formatDate } from '@/core/utils/format'

import * as incidentsApi from '../api/incidents.api'
import IncidentActions from '../components/IncidentActions.vue'
import {
  INCIDENT_PRIORITIES,
  INCIDENT_STATUSES,
  INCIDENT_TYPES,
  incidentStatusVariant,
} from '../composables/useIncidentsPresentation'
import { useIncidentsStore } from '../stores/useIncidentsStore'
import type { Incident, OpenIncidentPayload } from '../types/incidents.types'

/**
 * Incidencias: se llega desde el menú o desde una orden (`?order_id=&ticket_code=`),
 * que deja el listado filtrado y el alta con la orden ya puesta.
 */

const store = useIncidentsStore()
const route = useRoute()
const toast = useToast()
const { can } = useAuth()

const filters = reactive({
  status: '',
  type: '',
  ticket_code: typeof route.query.ticket_code === 'string' ? route.query.ticket_code : '',
  overdue: false,
})

const openModal = ref(false)
const selected = ref<Incident | null>(null)
const error = ref<ApiError | null>(null)
const form = reactive({
  order_id: typeof route.query.order_id === 'string' ? route.query.order_id : '',
  type: 'damage' as OpenIncidentPayload['type'],
  priority: 'normal' as NonNullable<OpenIncidentPayload['priority']>,
  description: '',
})

const rows = computed(() => store.incidents.data?.rows ?? [])
const meta = computed(() => store.incidents.data?.meta)

const COLUMNS: Column[] = [
  { key: 'ticket_code', label: 'Ticket' },
  { key: 'type', label: 'Type' },
  { key: 'priority', label: 'Priority' },
  { key: 'status', label: 'Status' },
  { key: 'due_at', label: 'Due' },
  { key: 'actions', label: '' },
]

function applyFilters(page = 1): void {
  void store.setQuery({
    page,
    ...(filters.status === '' ? {} : { status: filters.status }),
    ...(filters.type === '' ? {} : { type: filters.type }),
    ...(filters.ticket_code.trim() === '' ? {} : { ticket_code: filters.ticket_code.trim() }),
    ...(filters.overdue ? { overdue: true } : {}),
  })
}

async function submit(): Promise<void> {
  error.value = null

  try {
    await store.act(() =>
      incidentsApi.openIncident({
        order_id: Number(form.order_id),
        type: form.type,
        priority: form.priority,
        description: form.description.trim(),
      }),
    )
    toast.success('Incident opened')
    openModal.value = false
    form.description = ''
  } catch (caught) {
    error.value = caught instanceof ApiError ? caught : null
    toast.error('Could not open the incident', error.value?.message)
  }
}

onMounted(() => {
  applyFilters()
})
</script>

<template>
  <AppShell>
    <div class="bo-page">
      <div class="bo-header">
        <div>
          <h1 class="bo-title">Incidents</h1>
          <p class="bo-subtitle">Claims on orders, with someone responsible and a deadline</p>
        </div>
        <PermissionGate permission="incidents.manage">
          <Button @click="openModal = true">
            <template #leading><Plus :size="16" /></template>
            New incident
          </Button>
        </PermissionGate>
      </div>

      <Card>
        <form class="bo-filters" @submit.prevent="applyFilters()">
          <label class="bo-filter">
            <span>Status</span>
            <select v-model="filters.status" @change="applyFilters()">
              <option value="">All statuses</option>
              <option v-for="(label, value) in INCIDENT_STATUSES" :key="value" :value="value">
                {{ label }}
              </option>
            </select>
          </label>
          <label class="bo-filter">
            <span>Type</span>
            <select v-model="filters.type" @change="applyFilters()">
              <option value="">All types</option>
              <option v-for="(label, value) in INCIDENT_TYPES" :key="value" :value="value">
                {{ label }}
              </option>
            </select>
          </label>
          <label class="bo-filter">
            <span>Ticket code</span>
            <input v-model="filters.ticket_code" maxlength="8" @change="applyFilters()" />
          </label>
          <label class="bo-filter">
            <span>Overdue only</span>
            <input v-model="filters.overdue" type="checkbox" @change="applyFilters()" />
          </label>
        </form>
      </Card>

      <Card title="Incidents">
        <ListState
          :status="store.incidents.status"
          :error="store.incidents.error"
          :empty="rows.length === 0"
          empty-text="No incidents match these filters."
          @retry="store.incidents.load"
        >
          <DataTable :columns="COLUMNS" :data="rows">
            <template #ticket_code="{ row }">
              <span class="bo-mono">{{ row.ticket_code }}</span>
            </template>
            <template #type="{ row }">{{ INCIDENT_TYPES[String(row.type)] }}</template>
            <template #priority="{ row }">{{ INCIDENT_PRIORITIES[String(row.priority)] }}</template>
            <template #status="{ row }">
              <Badge :variant="incidentStatusVariant(String(row.status))">
                {{ INCIDENT_STATUSES[String(row.status)] }}
              </Badge>
            </template>
            <template #due_at="{ row }">
              {{ formatDate(row.due_at) }}
              <Badge v-if="row.is_overdue" variant="danger">Overdue</Badge>
            </template>
            <template #actions="{ row }">
              <button
                v-if="can('incidents.manage')"
                class="bo-link"
                @click="selected = row as Incident"
              >
                Attend
              </button>
            </template>
          </DataTable>

          <Pagination
            :page="meta?.current_page ?? 1"
            :last-page="meta?.last_page ?? 1"
            :total="meta?.total ?? rows.length"
            :per-page="meta?.per_page ?? store.PER_PAGE"
            @update:page="applyFilters"
          />
        </ListState>
      </Card>
    </div>

    <Modal :visible="openModal" title="New incident" @close="openModal = false">
      <form class="bo-form" @submit.prevent="submit">
        <FormField label="Order ID" :error="error?.fieldError('order_id')">
          <Input v-model="form.order_id" type="number" placeholder="1" />
        </FormField>
        <div class="bo-grid">
          <FormField label="Type" :error="error?.fieldError('type')">
            <select v-model="form.type" class="bo-control" aria-label="Type">
              <option v-for="(label, value) in INCIDENT_TYPES" :key="value" :value="value">
                {{ label }}
              </option>
            </select>
          </FormField>
          <FormField label="Priority" :error="error?.fieldError('priority')">
            <select v-model="form.priority" class="bo-control" aria-label="Priority">
              <option v-for="(label, value) in INCIDENT_PRIORITIES" :key="value" :value="value">
                {{ label }}
              </option>
            </select>
          </FormField>
        </div>
        <FormField label="Description" :error="error?.fieldError('description')">
          <Textarea v-model="form.description" placeholder="What happened" />
        </FormField>
        <p v-if="error && !error.isValidationError" class="bo-form-error">{{ error.message }}</p>
        <div class="bo-form-actions">
          <Button type="button" variant="ghost" @click="openModal = false">Close</Button>
          <Button type="submit" :loading="store.saving">Open incident</Button>
        </div>
      </form>
    </Modal>

    <Modal :visible="selected !== null" title="Attend incident" @close="selected = null">
      <IncidentActions v-if="selected" :incident="selected" @changed="selected = $event" />
    </Modal>
  </AppShell>
</template>
