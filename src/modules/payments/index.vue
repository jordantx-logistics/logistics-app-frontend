<script setup lang="ts">
import { computed, ref } from 'vue'
import AppShell from '@/core/components/AppShell.vue'
import Card from '@/core/components/Card.vue'
import Button from '@/core/components/Button.vue'
import Input from '@/core/components/Input.vue'
import Select from '@/core/components/Select.vue'
import Modal from '@/core/components/Modal.vue'
import DataTable from '@/core/components/DataTable.vue'
import type { Column } from '@/core/components/types'
import { DollarSign, Search, Download, Plus, CheckCircle, Clock } from 'lucide-vue-next'

const searchQuery = ref('')
const paymentFilter = ref('all')
const showNewPayment = ref(false)

const paymentTypeOptions = [
  { label: 'All Types', value: 'all' },
  { label: 'Credit Card', value: 'credit-card' },
  { label: 'Bank Transfer', value: 'bank-transfer' },
  { label: 'Cash', value: 'cash' },
]

const payments = ref([
  {
    id: 'PAY-001',
    customer: 'Acme Corp',
    method: 'credit-card',
    amount: '$1,250',
    status: 'completed',
    date: '2024-01-15',
  },
  {
    id: 'PAY-002',
    customer: 'Beta Industries',
    method: 'bank-transfer',
    amount: '$890',
    status: 'pending',
    date: '2024-01-14',
  },
  {
    id: 'PAY-003',
    customer: 'Gamma LLC',
    method: 'cash',
    amount: '$2,100',
    status: 'completed',
    date: '2024-01-14',
  },
  {
    id: 'PAY-004',
    customer: 'Delta Inc',
    method: 'credit-card',
    amount: '$750',
    status: 'failed',
    date: '2024-01-13',
  },
  {
    id: 'PAY-005',
    customer: 'Epsilon Co',
    method: 'bank-transfer',
    amount: '$1,800',
    status: 'completed',
    date: '2024-01-13',
  },
])

const columns: Column[] = [
  { key: 'id', label: 'Payment ID', sortable: true },
  { key: 'customer', label: 'Customer', sortable: true },
  { key: 'method', label: 'Method', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'date', label: 'Date', sortable: true },
]

const filteredPayments = computed(() => {
  return payments.value.filter((payment) => {
    const matchesSearch =
      payment.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      payment.customer.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesType = paymentFilter.value === 'all' || payment.method === paymentFilter.value
    return matchesSearch && matchesType
  })
})

const totalRevenue = computed(() => {
  return payments.value
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + parseFloat(p.amount.replace('$', '')), 0)
    .toLocaleString()
})

function openNewPayment() {
  showNewPayment.value = true
}

function closeNewPayment() {
  showNewPayment.value = false
}
</script>

<template>
  <AppShell>
    <div class="payments">
      <div class="payments-header">
        <div>
          <h1 class="payments-title">Payments</h1>
          <p class="payments-subtitle">Track and manage all transactions</p>
        </div>
        <div class="payments-actions">
          <Button variant="ghost" icon>
            <Download :size="16" stroke-width="2" />
          </Button>
          <Button variant="primary" @click="openNewPayment">
            <template #leading>
              <Plus :size="16" stroke-width="2" />
            </template>
            New Payment
          </Button>
        </div>
      </div>

      <div class="stats-grid">
        <Card class="stat-card">
          <div class="stat-icon" style="background: oklch(58% 0.18 255)">
            <DollarSign :size="20" stroke-width="2" />
          </div>
          <div class="stat-value">{{ totalRevenue }}</div>
          <div class="stat-label">Total Revenue</div>
        </Card>
        <Card class="stat-card">
          <div class="stat-icon" style="background: oklch(62% 0.18 145)">
            <CheckCircle :size="20" stroke-width="2" />
          </div>
          <div class="stat-value">
            {{ payments.filter((p) => p.status === 'completed').length }}
          </div>
          <div class="stat-label">Completed</div>
        </Card>
        <Card class="stat-card">
          <div class="stat-icon" style="background: oklch(72% 0.16 80)">
            <Clock :size="20" stroke-width="2" />
          </div>
          <div class="stat-value">{{ payments.filter((p) => p.status === 'pending').length }}</div>
          <div class="stat-label">Pending</div>
        </Card>
      </div>

      <Card class="filters-card">
        <div class="filters">
          <div class="filter-search">
            <Search :size="16" stroke-width="2" />
            <Input placeholder="Search payments..." v-model="searchQuery" clearable />
          </div>
          <div class="filter-dropdown">
            <Select
              :options="paymentTypeOptions"
              v-model="paymentFilter"
              placeholder="Payment Type"
            />
          </div>
        </div>
      </Card>

      <Card class="table-card">
        <template #header>
          <div class="table-header">
            <h2 class="table-title">All Payments ({{ filteredPayments.length }})</h2>
          </div>
        </template>
        <DataTable
          :columns="columns"
          :data="filteredPayments"
          :pagination="true"
          :per-page="5"
          :current-page="1"
          :searchable="true"
          class="payments-table"
        />
      </Card>

      <Modal :visible="showNewPayment" title="New Payment" @close="closeNewPayment">
        <template #footer>
          <Button variant="ghost" @click="closeNewPayment"> Cancel </Button>
          <Button variant="primary"> Create Payment </Button>
        </template>
      </Modal>
    </div>
  </AppShell>
</template>

<style scoped>
.payments {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.payments-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.payments-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--fg);
}

.payments-subtitle {
  font-size: 14px;
  color: var(--muted);
  margin-top: 4px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--fg);
}

.stat-label {
  font-size: 14px;
  color: var(--muted);
}

.filters-card {
  padding: 16px;
}

.filters {
  display: flex;
  align-items: center;
  gap: 16px;
}

.filter-search {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.filter-search input {
  flex: 1;
}

.filter-dropdown {
  min-width: 160px;
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.table-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--fg);
}

.payments-table {
  overflow-x: auto;
}

.CheckCircle,
.Clock {
  display: inline-block;
}
</style>
