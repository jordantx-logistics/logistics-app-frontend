<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { Building2, Plus, Search, Users } from 'lucide-vue-next'

import * as customersApi from '@/core/api/customers'
import { ApiError, toApiError } from '@/core/api/errors'
import type { CreateCompanyPayload, CreatePersonPayload } from '@/core/api/types'
import AppShell from '@/core/components/AppShell.vue'
import Avatar from '@/core/components/Avatar.vue'
import Button from '@/core/components/Button.vue'
import Card from '@/core/components/Card.vue'
import DataTable from '@/core/components/DataTable.vue'
import Input from '@/core/components/Input.vue'
import ListState from '@/core/components/ListState.vue'
import Modal from '@/core/components/Modal.vue'
import Pagination from '@/core/components/Pagination.vue'
import type { Column } from '@/core/components/types'
import { useAuth } from '@/core/composables/useAuth'
import { useAsyncData } from '@/core/composables/useAsyncData'
import { useToast } from '@/core/composables/useToast'
import { EMPTY_VALUE, formatDate, formatText } from '@/core/utils/format'
import { matchesQuery, pageCount, slicePage } from '@/core/utils/list'
import CompanyForm from './components/CompanyForm.vue'
import PersonForm from './components/PersonForm.vue'

/**
 * Clientes: personas (documento) y empresas (RUC), en dos pestañas.
 *
 * Cada listado viene del API entero (sin paginar), así que el buscador y la
 * paginación son locales; al dar de alta se recarga la lista del API en vez de
 * insertar la fila a mano.
 */

type Tab = 'persons' | 'companies'

const PER_PAGE = 10

const { can } = useAuth()
const { success } = useToast()

const canSeeCompanies = computed(() => can('companies.view'))
const canCreatePerson = computed(() => can('persons.manage'))
const canCreateCompany = computed(() => can('companies.manage'))

const tab = ref<Tab>('persons')
const search = ref('')
const page = ref(1)

const persons = useAsyncData(customersApi.listPersons)
const companies = useAsyncData(customersApi.listCompanies)

onMounted(() => {
  void persons.load()

  if (canSeeCompanies.value) {
    void companies.load()
  }
})

// Un cambio de pestaña o de búsqueda vuelve a la primera página.
watch([tab, search], () => {
  page.value = 1
})

const filteredPersons = computed(() => {
  const rows = persons.data.value ?? []

  return rows.filter((row) =>
    matchesQuery(
      [row.first_name, row.last_name, row.document_type, row.document_number, row.email],
      search.value,
    ),
  )
})

const filteredCompanies = computed(() => {
  const rows = companies.data.value ?? []

  return rows.filter((row) =>
    matchesQuery([row.business_name, row.trade_name, row.tax_id, row.contact_email], search.value),
  )
})

const visibleRows = computed(() =>
  tab.value === 'persons'
    ? slicePage(filteredPersons.value, page.value, PER_PAGE)
    : slicePage(filteredCompanies.value, page.value, PER_PAGE),
)

const filteredTotal = computed(() =>
  tab.value === 'persons' ? filteredPersons.value.length : filteredCompanies.value.length,
)

const lastPage = computed(() => pageCount(filteredTotal.value, PER_PAGE))

const list = computed(() => (tab.value === 'persons' ? persons : companies))

const emptyText = computed(() => {
  const subject = tab.value === 'persons' ? 'persons' : 'companies'

  return search.value.trim() === ''
    ? `No ${subject} registered yet.`
    : `No ${subject} match the search.`
})

const personColumns: Column[] = [
  { key: 'document', label: 'Document' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'created_at', label: 'Created' },
]

const companyColumns: Column[] = [
  { key: 'tax_id', label: 'Tax ID' },
  { key: 'business_name', label: 'Business name' },
  { key: 'trade_name', label: 'Trade name' },
  { key: 'contact', label: 'Contact' },
  { key: 'created_at', label: 'Created' },
]

// --- Alta -------------------------------------------------------------------

const showForm = ref(false)
const submitting = ref(false)
const formError = ref<ApiError | null>(null)

const formTitle = computed(() => (tab.value === 'persons' ? 'Add person' : 'Add company'))

function openForm(): void {
  formError.value = null
  showForm.value = true
}

function closeForm(): void {
  showForm.value = false
  formError.value = null
}

async function create(
  request: () => Promise<unknown>,
  reload: () => Promise<void>,
  message: string,
): Promise<void> {
  submitting.value = true
  formError.value = null

  try {
    await request()
    await reload()
    success(message)
    closeForm()
  } catch (caught) {
    // El 422 se queda en el modal: el formulario pinta los mensajes por campo.
    formError.value = caught instanceof ApiError ? caught : toApiError(caught)
  } finally {
    submitting.value = false
  }
}

function submitPerson(payload: CreatePersonPayload): void {
  void create(() => customersApi.createPerson(payload), persons.load, 'Person created.')
}

function submitCompany(payload: CreateCompanyPayload): void {
  void create(() => customersApi.createCompany(payload), companies.load, 'Company created.')
}
</script>

<template>
  <AppShell>
    <div class="customers">
      <div class="page-header">
        <div>
          <h1 class="page-title">Customers</h1>
          <p class="page-subtitle">Individual customers and corporate clients</p>
        </div>
        <Button
          v-if="(tab === 'persons' && canCreatePerson) || (tab === 'companies' && canCreateCompany)"
          variant="primary"
          @click="openForm"
        >
          <template #leading>
            <Plus :size="16" stroke-width="2" />
          </template>
          {{ formTitle }}
        </Button>
      </div>

      <div class="stats-grid">
        <Card class="stat-card">
          <div class="stat-icon" style="background: oklch(58% 0.18 255)">
            <Users :size="20" stroke-width="2" />
          </div>
          <div class="stat-value">{{ persons.data.value?.length ?? EMPTY_VALUE }}</div>
          <div class="stat-label">Persons</div>
        </Card>
        <Card v-if="canSeeCompanies" class="stat-card">
          <div class="stat-icon" style="background: oklch(62% 0.18 145)">
            <Building2 :size="20" stroke-width="2" />
          </div>
          <div class="stat-value">{{ companies.data.value?.length ?? EMPTY_VALUE }}</div>
          <div class="stat-label">Companies</div>
        </Card>
      </div>

      <div class="customers-toolbar">
        <div class="tabs">
          <button class="tab" :class="{ active: tab === 'persons' }" @click="tab = 'persons'">
            Persons
          </button>
          <button
            v-if="canSeeCompanies"
            class="tab"
            :class="{ active: tab === 'companies' }"
            @click="tab = 'companies'"
          >
            Companies
          </button>
        </div>
        <div class="filter-search">
          <Search :size="16" stroke-width="2" />
          <Input placeholder="Search customers..." v-model="search" />
        </div>
      </div>

      <Card class="table-card">
        <template #header>
          <div class="table-header">
            <h2 class="table-title">
              {{ tab === 'persons' ? 'Persons' : 'Companies' }} ({{ filteredTotal }})
            </h2>
          </div>
        </template>

        <ListState
          :status="list.status.value"
          :error="list.error.value"
          :empty="visibleRows.length === 0"
          :empty-text="emptyText"
          @retry="list.load"
        >
          <DataTable
            v-if="tab === 'persons'"
            :columns="personColumns"
            :data="visibleRows"
            class="customers-table"
          >
            <template #document="{ row }">
              <span class="document">
                <Badge variant="neutral">{{ formatText(row.document_type) }}</Badge>
                {{ formatText(row.document_number) }}
              </span>
            </template>
            <template #name="{ row }">
              <div class="customer-cell">
                <Avatar :name="`${String(row.first_name)} ${String(row.last_name)}`" :size="32" />
                <div class="customer-name">
                  {{ formatText(row.first_name) }} {{ formatText(row.last_name) }}
                </div>
              </div>
            </template>
            <template #email="{ row }">{{ formatText(row.email) }}</template>
            <template #phone="{ row }">{{ formatText(row.phone) }}</template>
            <template #created_at="{ row }">{{ formatDate(String(row.created_at)) }}</template>
          </DataTable>

          <DataTable v-else :columns="companyColumns" :data="visibleRows" class="customers-table">
            <template #tax_id="{ row }">{{ formatText(row.tax_id) }}</template>
            <template #business_name="{ row }">{{ formatText(row.business_name) }}</template>
            <template #trade_name="{ row }">{{ formatText(row.trade_name) }}</template>
            <template #contact="{ row }">
              <div class="contact-cell">
                <span>{{ formatText(row.contact_email) }}</span>
                <span class="contact-phone">{{ formatText(row.contact_phone) }}</span>
              </div>
            </template>
            <template #created_at="{ row }">{{ formatDate(String(row.created_at)) }}</template>
          </DataTable>

          <Pagination
            :page="page"
            :last-page="lastPage"
            :total="filteredTotal"
            :per-page="PER_PAGE"
            @update:page="page = $event"
          />
        </ListState>
      </Card>

      <Modal :visible="showForm" :title="formTitle" @close="closeForm">
        <PersonForm
          v-if="tab === 'persons'"
          :loading="submitting"
          :error="formError"
          @submit="submitPerson"
          @cancel="closeForm"
        />
        <CompanyForm
          v-else
          :loading="submitting"
          :error="formError"
          @submit="submitCompany"
          @cancel="closeForm"
        />
      </Modal>
    </div>
  </AppShell>
</template>

<style scoped>
.customers {
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
  font-size: 13px;
  color: var(--muted);
  margin-top: 2px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.stat-card {
  display: flex;
  flex-direction: column;
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
  color: var(--fg);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--muted);
}

.customers-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.tabs {
  display: flex;
  gap: 4px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 4px;
}

.tab {
  padding: 6px 14px;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 500;
  color: var(--fg-secondary);
  cursor: pointer;
}

.tab.active {
  background: var(--surface);
  color: var(--fg);
  box-shadow: var(--shadow-sm);
}

.filter-search {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  max-width: 320px;
  color: var(--muted);
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.table-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--fg);
}

.customers-table {
  overflow-x: auto;
}

.document {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.customer-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.customer-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--fg);
}

.contact-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.contact-phone {
  font-size: 12px;
  color: var(--muted);
}
</style>
