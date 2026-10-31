<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Download, Plus, Upload } from 'lucide-vue-next'

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
import type { Column } from '@/core/components/types'
import { useAuth } from '@/core/composables/useAuth'
import { useToast } from '@/core/composables/useToast'
import { saveBlob } from '@/core/utils/download'
import { formatText } from '@/core/utils/format'

import * as fleetApi from '../api/fleet.api'
import ExpenseForm from '../components/ExpenseForm.vue'
import {
  dateTime,
  EXPENSE_STATUS_VARIANTS,
  EXPENSE_TYPE_LABELS,
  money,
} from '../composables/useFleetPresentation'
import '../fleet.css'
import { useFleetStore } from '../stores/useFleetStore'
import type { Expense } from '../types/fleet.types'

/** Viáticos y combustible: comprobantes, liquidación y rechazo. */

const store = useFleetStore()
const toast = useToast()
const { can } = useAuth()

const createModal = ref(false)
const rejecting = ref<Expense | null>(null)
const rejectReason = ref('')
const type = ref('')
const status = ref('')

const expenses = computed(() => store.expenses.data?.rows ?? [])
const meta = computed(() => store.expenses.data?.meta)

const COLUMNS: Column[] = [
  { key: 'id', label: 'Expense' },
  { key: 'route_id', label: 'Route' },
  { key: 'type', label: 'Type' },
  { key: 'amount', label: 'Amount' },
  { key: 'registered_at', label: 'Registered' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: '' },
]

function applyFilters(): void {
  void store.setExpensesQuery({
    page: 1,
    type: type.value === '' ? undefined : type.value,
    status: status.value === '' ? undefined : status.value,
  })
}

function goToPage(page: number): void {
  void store.setExpensesQuery({ ...store.expensesQuery, page })
}

function failure(title: string, caught: unknown): void {
  toast.error(title, caught instanceof ApiError ? caught.message : undefined)
}

async function liquidate(row: Expense): Promise<void> {
  try {
    await store.act(
      () => fleetApi.liquidateExpenses({ expense_ids: [row.id], decision: 'liquidated' }),
      store.expenses.load,
    )
    toast.success('Expense liquidated')
  } catch (caught) {
    failure('Could not liquidate the expense', caught)
  }
}

function openReject(row: Expense): void {
  rejectReason.value = ''
  rejecting.value = row
}

async function confirmReject(): Promise<void> {
  const expense = rejecting.value

  if (expense === null) {
    return
  }

  try {
    await store.act(
      () =>
        fleetApi.liquidateExpenses({
          expense_ids: [expense.id],
          decision: 'rejected',
          reason: rejectReason.value.trim(),
        }),
      store.expenses.load,
    )
    toast.success('Expense rejected')
    rejecting.value = null
  } catch (caught) {
    failure('Could not reject the expense', caught)
  }
}

async function attach(row: Expense, event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) {
    return
  }

  try {
    await store.act(() => fleetApi.attachReceipt(row.id, file), store.expenses.load)
    toast.success('Receipt attached')
  } catch (caught) {
    failure('Could not attach the receipt', caught)
  } finally {
    input.value = ''
  }
}

async function download(row: Expense): Promise<void> {
  try {
    saveBlob(await fleetApi.downloadReceipt(row.id), `receipt-${row.id}`)
  } catch (caught) {
    failure('Could not download the receipt', caught)
  }
}

onMounted(() => {
  void store.expenses.load()
})
</script>

<template>
  <AppShell>
    <div class="fleet-page">
      <div class="fleet-header">
        <div>
          <h1 class="fleet-title">Fleet expenses</h1>
          <p class="fleet-subtitle">Per diems and fuel, reviewed once the route is closed</p>
        </div>
        <Button v-if="can('expenses.register')" @click="createModal = true">
          <template #leading><Plus :size="16" /></template>
          New expense
        </Button>
      </div>

      <Card>
        <form class="fleet-filters" @submit.prevent="applyFilters">
          <label class="fleet-filter">
            <span>Type</span>
            <select v-model="type" @change="applyFilters">
              <option value="">All types</option>
              <option value="fuel">Fuel</option>
              <option value="per_diem">Per diem</option>
            </select>
          </label>

          <label class="fleet-filter">
            <span>Status</span>
            <select v-model="status" @change="applyFilters">
              <option value="">All statuses</option>
              <option value="registered">Registered</option>
              <option value="liquidated">Liquidated</option>
              <option value="rejected">Rejected</option>
            </select>
          </label>
        </form>
      </Card>

      <Card title="Expenses">
        <ListState
          :status="store.expenses.status"
          :error="store.expenses.error"
          :empty="expenses.length === 0"
          empty-text="No expenses match these filters."
          @retry="store.expenses.load"
        >
          <DataTable :columns="COLUMNS" :data="expenses">
            <template #id="{ row }">#{{ row.id }}</template>
            <template #route_id="{ row }">#{{ row.route_id }}</template>
            <template #type="{ row }">{{
              EXPENSE_TYPE_LABELS[String(row.type)] ?? formatText(row.type)
            }}</template>
            <template #amount="{ row }">
              {{ money(row.amount) }}
              <template v-if="row.liters">· {{ row.liters }} L</template>
            </template>
            <template #registered_at="{ row }">{{ dateTime(row.registered_at) }}</template>
            <template #status="{ row }">
              <Badge
                :variant="EXPENSE_STATUS_VARIANTS[String(row.status)] ?? 'neutral'"
                :title="row.rejection_reason ? String(row.rejection_reason) : undefined"
              >
                {{ formatText(row.status) }}
              </Badge>
            </template>
            <template #actions="{ row }">
              <div class="fleet-actions">
                <button v-if="row.has_receipt" class="fleet-link" @click="download(row as Expense)">
                  <Download :size="13" />
                  Receipt
                </button>
                <template v-if="row.status === 'registered'">
                  <label v-if="can('expenses.register')" class="fleet-link">
                    <Upload :size="13" />
                    {{ row.has_receipt ? 'Replace' : 'Attach' }}
                    <input
                      class="file-input"
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      @change="attach(row as Expense, $event)"
                    />
                  </label>
                  <template v-if="can('expenses.approve')">
                    <button
                      class="fleet-link"
                      :disabled="store.saving"
                      @click="liquidate(row as Expense)"
                    >
                      Liquidate
                    </button>
                    <button class="fleet-link danger" @click="openReject(row as Expense)">
                      Reject
                    </button>
                  </template>
                </template>
              </div>
            </template>
          </DataTable>

          <Pagination
            :page="meta?.current_page ?? 1"
            :last-page="meta?.last_page ?? 1"
            :total="meta?.total ?? expenses.length"
            :per-page="meta?.per_page ?? 15"
            @update:page="goToPage"
          />
        </ListState>
      </Card>
    </div>

    <Modal :visible="createModal" title="New expense" @close="createModal = false">
      <ExpenseForm v-if="createModal" @saved="createModal = false" @cancel="createModal = false" />
    </Modal>

    <Modal :visible="rejecting !== null" title="Reject expense" @close="rejecting = null">
      <form class="fleet-form" @submit.prevent="confirmReject">
        <FormField label="Reason">
          <Input v-model="rejectReason" placeholder="Receipt is illegible" />
        </FormField>

        <div class="fleet-form-actions">
          <Button variant="secondary" type="button" @click="rejecting = null">Keep expense</Button>
          <Button type="submit" :loading="store.saving" :disabled="rejectReason.trim() === ''">
            Reject expense
          </Button>
        </div>
      </form>
    </Modal>
  </AppShell>
</template>

<style scoped>
.file-input {
  display: none;
}
</style>
