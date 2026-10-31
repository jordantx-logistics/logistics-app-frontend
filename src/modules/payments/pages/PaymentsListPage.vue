<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Search } from 'lucide-vue-next'

import AppShell from '@/core/components/AppShell.vue'
import Badge from '@/core/components/Badge.vue'
import Button from '@/core/components/Button.vue'
import Card from '@/core/components/Card.vue'
import DataTable from '@/core/components/DataTable.vue'
import ListState from '@/core/components/ListState.vue'
import Modal from '@/core/components/Modal.vue'
import Pagination from '@/core/components/Pagination.vue'
import type { Column } from '@/core/components/types'
import { formatDate, formatText } from '@/core/utils/format'

import RegisterPaymentForm from '../components/RegisterPaymentForm.vue'
import { usePaymentsStore } from '../stores/usePaymentsStore'

/** Listado de cobros con filtros del contrato y paginación del servidor. */

const router = useRouter()
const store = usePaymentsStore()

const status = ref('')
const method = ref('')
const ticket = ref('')
const registerOpen = ref(false)

const rows = computed(() => store.list.data?.rows ?? [])
const meta = computed(() => store.list.data?.meta)
const page = computed(() => store.query.page ?? 1)

const COLUMNS: Column[] = [
  { key: 'ticket_number', label: 'Payment' },
  { key: 'order_id', label: 'Order' },
  { key: 'amount', label: 'Amount' },
  { key: 'payment_method', label: 'Method' },
  { key: 'status', label: 'Status' },
  { key: 'paid_at', label: 'Paid at' },
  { key: 'actions', label: '' },
]

const STATUS_VARIANTS: Record<string, 'success' | 'warning' | 'danger' | 'neutral'> = {
  registered: 'success',
  refunded: 'warning',
  voided: 'danger',
}

function applyFilters(): void {
  void store.setQuery({
    page: 1,
    status: status.value === '' ? undefined : status.value,
    payment_method: method.value === '' ? undefined : method.value,
    ticket_number: ticket.value.trim() === '' ? undefined : ticket.value.trim().toUpperCase(),
  })
}

function resetFilters(): void {
  status.value = ''
  method.value = ''
  ticket.value = ''
  void store.setQuery({ page: 1 })
}

function goToPage(next: number): void {
  void store.setQuery({ ...store.query, page: next })
}

function openPayment(id: unknown): void {
  void router.push({ name: 'finance-payments-detail', params: { id: Number(id) } })
}

function money(value: unknown): string {
  const numeric = Number(value)

  return Number.isFinite(numeric) ? `S/ ${numeric.toFixed(2)}` : formatText(value)
}

function onCreated(paymentId: number): void {
  registerOpen.value = false
  openPayment(paymentId)
}

onMounted(() => {
  void store.load()
})
</script>

<template>
  <AppShell>
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Payments</h1>
          <p class="page-subtitle">Cash and POS collections, partial payments and refunds</p>
        </div>
        <Button @click="registerOpen = true">
          <template #leading><Plus :size="16" /></template>
          Register payment
        </Button>
      </div>

      <Card>
        <form class="filters" @submit.prevent="applyFilters">
          <label class="filter">
            <span>Status</span>
            <select v-model="status">
              <option value="">All statuses</option>
              <option value="registered">Registered</option>
              <option value="refunded">Refunded</option>
              <option value="voided">Voided</option>
            </select>
          </label>

          <label class="filter">
            <span>Method</span>
            <select v-model="method">
              <option value="">All methods</option>
              <option value="cash">Cash</option>
              <option value="pos">POS</option>
            </select>
          </label>

          <label class="filter">
            <span>Ticket</span>
            <input v-model="ticket" placeholder="PAY-2026" />
          </label>

          <div class="filter-actions">
            <button type="button" class="link-button" @click="resetFilters">Clear</button>
            <button type="submit" class="apply-button">
              <Search :size="14" />
              Apply
            </button>
          </div>
        </form>
      </Card>

      <Card class="table-card">
        <template #header>
          <h2 class="table-title">
            Results <span v-if="meta">({{ meta.total }})</span>
          </h2>
        </template>

        <ListState
          :status="store.list.status"
          :error="store.list.error"
          :empty="rows.length === 0"
          empty-text="No payments match these filters."
          @retry="store.load"
        >
          <DataTable :columns="COLUMNS" :data="rows">
            <template #ticket_number="{ row }">
              <span class="mono">{{ formatText(row.ticket_number) }}</span>
            </template>
            <template #order_id="{ row }">#{{ formatText(row.order_id) }}</template>
            <template #amount="{ row }">{{ money(row.amount) }}</template>
            <template #payment_method="{ row }">
              {{ String(row.payment_method).toUpperCase() }}
            </template>
            <template #status="{ row }">
              <Badge :variant="STATUS_VARIANTS[String(row.status)] ?? 'neutral'">
                {{ formatText(row.status) }}
              </Badge>
            </template>
            <template #paid_at="{ row }">{{ formatDate(row.paid_at) }}</template>
            <template #actions="{ row }">
              <button class="link-button" @click="openPayment(row.id)">View</button>
            </template>
          </DataTable>

          <Pagination
            :page="page"
            :last-page="meta?.last_page ?? 1"
            :total="meta?.total ?? rows.length"
            :per-page="meta?.per_page ?? 15"
            @update:page="goToPage"
          />
        </ListState>
      </Card>
    </div>

    <Modal :visible="registerOpen" title="Register payment" @close="registerOpen = false">
      <RegisterPaymentForm @created="onCreated" @cancel="registerOpen = false" />
    </Modal>
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
  gap: 16px;
}

.page-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--fg);
}

.page-subtitle {
  margin-top: 2px;
  font-size: 13px;
  color: var(--muted);
}

.filters {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  flex-wrap: wrap;
}

.filter {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--fg-secondary);
}

.filter select,
.filter input {
  min-width: 150px;
  padding: 8px 10px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  color: var(--fg);
  font-size: 13px;
}

.filter-actions {
  display: flex;
  gap: 8px;
  margin-left: auto;
}

.apply-button {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 8px 14px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: #6366f1;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.link-button {
  padding: 6px;
  border: none;
  background: none;
  color: #6366f1;
  font-size: 13px;
  cursor: pointer;
}

.table-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--fg);
}

.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12px;
}
</style>
