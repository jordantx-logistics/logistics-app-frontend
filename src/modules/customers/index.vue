<script setup lang="ts">
import { ref, computed } from 'vue'
import AppShell from '@/core/components/AppShell.vue'
import Card from '@/core/components/Card.vue'
import Button from '@/core/components/Button.vue'
import Badge from '@/core/components/Badge.vue'
import Input from '@/core/components/Input.vue'
import Select from '@/core/components/Select.vue'
import Modal from '@/core/components/Modal.vue'
import DataTable from '@/core/components/DataTable.vue'
import Avatar from '@/core/components/Avatar.vue'
import type { Column } from '@/core/components/types'
import {
  Users,
  Search,
  Download,
  Plus,
  CheckCircle,
  TrendingUp,
} from 'lucide-vue-next'

const searchQuery = ref('')
const regionFilter = ref('all')
const showNewCustomer = ref(false)

const regionOptions = [
  { label: 'All Regions', value: 'all' },
  { label: 'North America', value: 'na' },
  { label: 'Europe', value: 'eu' },
  { label: 'Asia Pacific', value: 'apac' },
]

const customers = ref([
  { id: 'CUST-001', name: 'Acme Corporation', email: 'contact@acme.com', region: 'na', orders: 45, revenue: '$125,000', status: 'active' },
  { id: 'CUST-002', name: 'Beta Industries', email: 'info@beta.com', region: 'eu', orders: 32, revenue: '$89,000', status: 'active' },
  { id: 'CUST-003', name: 'Gamma LLC', email: 'hello@gamma.com', region: 'apac', orders: 28, revenue: '$67,500', status: 'active' },
  { id: 'CUST-004', name: 'Delta Inc', email: 'support@delta.com', region: 'na', orders: 15, revenue: '$34,200', status: 'inactive' },
  { id: 'CUST-005', name: 'Epsilon Co', email: 'contact@epsilon.com', region: 'eu', orders: 52, revenue: '$156,000', status: 'active' },
])

const columns: Column[] = [
  { key: 'name', label: 'Customer', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'region', label: 'Region', sortable: true },
  { key: 'orders', label: 'Orders', sortable: true },
  { key: 'revenue', label: 'Revenue', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
]

const statusColors: Record<string, string> = {
  active: 'oklch(62% 0.18 145)',
  inactive: 'oklch(60% 0.20 25)',
}

function getStatusColor(status: string): string {
  return statusColors[status] || 'oklch(60% 0.20 25)'
}

function getStatusLabel(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

const filteredCustomers = computed(() => {
  return customers.value.filter((customer) => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesRegion = regionFilter.value === 'all' || customer.region === regionFilter.value
    return matchesSearch && matchesRegion
  })
})

function openNewCustomer() {
  showNewCustomer.value = true
}

function closeNewCustomer() {
  showNewCustomer.value = false
}
</script>

<template>
  <AppShell>
    <div class="customers">
      <div class="customers-header">
        <div>
          <h1 class="customers-title">Customers</h1>
          <p class="customers-subtitle">Manage your customer database</p>
        </div>
        <div class="customers-actions">
          <Button variant="ghost" icon>
            <Download :size="16" stroke-width="2" />
          </Button>
          <Button variant="primary" @click="openNewCustomer">
            <template #leading>
              <Plus :size="16" stroke-width="2" />
            </template>
            Add Customer
          </Button>
        </div>
      </div>

      <div class="stats-grid">
        <Card class="stat-card">
          <div class="stat-icon" style="background: oklch(58% 0.18 255)">
            <Users :size="20" stroke-width="2" />
          </div>
          <div class="stat-value">{{ customers.length }}</div>
          <div class="stat-label">Total Customers</div>
        </Card>
        <Card class="stat-card">
          <div class="stat-icon" style="background: oklch(62% 0.18 145)">
            <CheckCircle :size="20" stroke-width="2" />
          </div>
          <div class="stat-value">{{String(customers.filter((c) => c.status === 'active').length)}}</div>
          <div class="stat-label">Active Customers</div>
        </Card>
        <Card class="stat-card">
          <div class="stat-icon" style="background: oklch(72% 0.16 80)">
            <TrendingUp :size="20" stroke-width="2" />
          </div>
          <div class="stat-value">{{String(customers.reduce((sum, c) => sum + parseInt(String(c.orders)), 0))}}</div>
          <div class="stat-label">Total Orders</div>
        </Card>
      </div>

      <Card class="filters-card">
        <div class="filters">
          <div class="filter-search">
            <Search :size="16" stroke-width="2" />
            <Input placeholder="Search customers..." v-model="searchQuery" clearable />
          </div>
          <div class="filter-dropdown">
            <Select :options="regionOptions" v-model="regionFilter" placeholder="Region" />
          </div>
        </div>
      </Card>

      <Card class="table-card">
        <template #header>
          <div class="table-header">
            <h2 class="table-title">All Customers ({{ filteredCustomers.length }})</h2>
          </div>
        </template>
        <DataTable :columns="columns" :data="filteredCustomers" :pagination="true" :per-page="5" :current-page="1"
          :searchable="true" class="customers-table">
          <template #name="{ row }">
            <div class="customer-cell">
              <Avatar :name="String(row.name)" :size="32" />
              <div class="customer-info">
                <div class="customer-name">{{ String(row.name) }}</div>
              </div>
            </div>
          </template>
          <template #status="{ row }">
            <Badge :color="getStatusColor(String(row.status))">
              {{ getStatusLabel(String(row.status)) }}
            </Badge>
          </template>
        </DataTable>
      </Card>

      <Modal :visible="showNewCustomer" title="Add Customer" @close="closeNewCustomer">
        <template #footer>
          <Button variant="ghost" @click="closeNewCustomer">
            Cancel
          </Button>
          <Button variant="primary">
            Add Customer
          </Button>
        </template>
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

.customers-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.customers-title {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--fg);
}

.customers-subtitle {
  font-size: 13px;
  color: var(--muted);
  margin-top: 2px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
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
  font-size: 14px;
  font-weight: 600;
  color: var(--fg);
}

.customers-table {
  overflow-x: auto;
}

.customer-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.customer-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.customer-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--fg);
}

.CheckCircle,
.TrendingUp {
  display: inline-block;
}
</style>
