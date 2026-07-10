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
import {
  Plus,
  Search,
  Download,
} from 'lucide-vue-next'

const searchQuery = ref('')
const statusFilter = ref('all')
const showNewOrder = ref(false)

const statusOptions = [
  { label: 'All Statuses', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'In Transit', value: 'in-transit' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Failed', value: 'failed' },
]

const orders = ref([
  { id: 'ORD-001', customer: 'Acme Corp', origin: 'New York', destination: 'Boston', status: 'delivered', weight: '150kg', date: '2024-01-15' },
  { id: 'ORD-002', customer: 'Beta Industries', origin: 'Chicago', destination: 'Detroit', status: 'in-transit', weight: '85kg', date: '2024-01-14' },
  { id: 'ORD-003', customer: 'Gamma LLC', origin: 'Miami', destination: 'Orlando', status: 'pending', weight: '45kg', date: '2024-01-14' },
  { id: 'ORD-004', customer: 'Delta Inc', origin: 'Seattle', destination: 'Portland', status: 'delivered', weight: '120kg', date: '2024-01-13' },
  { id: 'ORD-005', customer: 'Epsilon Co', origin: 'Denver', destination: 'Denver', status: 'failed', weight: '60kg', date: '2024-01-13' },
  { id: 'ORD-006', customer: 'Zeta Corp', origin: 'Houston', destination: 'Dallas', status: 'in-transit', weight: '95kg', date: '2024-01-12' },
])

const columns: Column[] = [
  { key: 'id', label: 'Order ID', sortable: true },
  { key: 'customer', label: 'Customer', sortable: true },
  { key: 'origin', label: 'Origin', sortable: true },
  { key: 'destination', label: 'Destination', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'weight', label: 'Weight', sortable: true },
  { key: 'date', label: 'Date', sortable: true },
]

const filteredOrders = computed(() => {
  return orders.value.filter((order) => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = statusFilter.value === 'all' || order.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

function openNewOrder() {
  showNewOrder.value = true
}

function closeNewOrder() {
  showNewOrder.value = false
}
</script>

<template>
  <AppShell>
    <div class="orders">
      <div class="orders-header">
        <div>
          <h1 class="orders-title">Orders</h1>
          <p class="orders-subtitle">Manage and track all shipments</p>
        </div>
        <div class="orders-actions">
          <Button variant="ghost" icon>
            <Download :size="16" stroke-width="2" />
          </Button>
          <Button variant="primary" @click="openNewOrder">
            <template #leading>
              <Plus :size="16" stroke-width="2" />
            </template>
            New Order
          </Button>
        </div>
      </div>

      <Card class="filters-card">
        <div class="filters">
          <div class="filter-search">
            <Search :size="16" stroke-width="2" />
            <Input placeholder="Search orders..." v-model="searchQuery" clearable />
          </div>
          <div class="filter-dropdown">
            <Select :options="statusOptions" v-model="statusFilter" placeholder="Status" />
          </div>
        </div>
      </Card>

      <Card class="table-card">
        <template #header>
          <div class="table-header">
            <h2 class="table-title">All Orders ({{ filteredOrders.length }})</h2>
          </div>
        </template>
        <DataTable :columns="columns" :data="filteredOrders" :pagination="true" :per-page="5" :current-page="1"
          :searchable="true" class="orders-table" />
      </Card>

      <Modal :visible="showNewOrder" title="New Order" @close="closeNewOrder">
        <template #footer>
          <Button variant="ghost" @click="closeNewOrder">
            Cancel
          </Button>
          <Button variant="primary">
            Create Order
          </Button>
        </template>
      </Modal>
    </div>
  </AppShell>
</template>

<style scoped>
.orders {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.orders-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.orders-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--fg);
}

.orders-subtitle {
  font-size: 14px;
  color: var(--muted);
  margin-top: 4px;
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

.orders-table {
  overflow-x: auto;
}
</style>
