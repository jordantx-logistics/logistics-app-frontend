<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/core/composables/useAuth'
import AppShell from '@/core/components/AppShell.vue'
import Card from '@/core/components/Card.vue'
import Button from '@/core/components/Button.vue'
import DataTable from '@/core/components/DataTable.vue'
import type { Column } from '@/core/components/types'
import { ArrowUp, ArrowDown, Users, Package, DollarSign, Truck } from 'lucide-vue-next'

const { authStore } = useAuth()

const stats = ref([
  {
    label: 'Total Orders',
    value: '1,234',
    change: '+12.5%',
    up: true,
    icon: Package,
    color: '#6366f1',
  },
  {
    label: 'Revenue',
    value: '$45,678',
    change: '+8.2%',
    up: true,
    icon: DollarSign,
    color: '#10b981',
  },
  {
    label: 'Active Drivers',
    value: '42',
    change: '-3.1%',
    up: false,
    icon: Truck,
    color: '#f59e0b',
  },
  { label: 'Customers', value: '892', change: '+15.3%', up: true, icon: Users, color: '#ef4444' },
])

const recentOrders = ref([
  {
    id: 'ORD-001',
    customer: 'Acme Corp',
    status: 'Delivered',
    amount: '$1,250',
    date: '2024-01-15',
  },
  {
    id: 'ORD-002',
    customer: 'Beta Industries',
    status: 'In Transit',
    amount: '$890',
    date: '2024-01-14',
  },
  { id: 'ORD-003', customer: 'Gamma LLC', status: 'Pending', amount: '$2,100', date: '2024-01-14' },
  { id: 'ORD-004', customer: 'Delta Inc', status: 'Delivered', amount: '$750', date: '2024-01-13' },
  {
    id: 'ORD-005',
    customer: 'Epsilon Co',
    status: 'In Transit',
    amount: '$1,800',
    date: '2024-01-13',
  },
])

const columns: Column[] = [
  { key: 'id', label: 'Order ID', sortable: true },
  { key: 'customer', label: 'Customer', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true },
  { key: 'date', label: 'Date', sortable: true },
]
</script>

<template>
  <AppShell>
    <div class="dashboard">
      <div class="dashboard-header">
        <div>
          <h1 class="dashboard-title">Welcome back, {{ authStore.user?.name || 'User' }}!</h1>
          <p class="dashboard-subtitle">Here's what's happening with your logistics</p>
        </div>
        <div class="dashboard-actions">
          <Button variant="primary"> New Order </Button>
        </div>
      </div>

      <div class="stats-grid">
        <Card v-for="stat in stats" :key="stat.label" class="stat-card">
          <div class="stat-header">
            <div class="stat-icon" :style="{ background: stat.color }">
              <component :is="stat.icon" :size="20" stroke-width="2" />
            </div>
            <span class="stat-change" :class="{ up: stat.up, down: !stat.up }">
              <component :is="stat.up ? ArrowUp : ArrowDown" :size="12" stroke-width="2" />
              {{ stat.change }}
            </span>
          </div>
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </Card>
      </div>

      <div class="dashboard-grid">
        <Card class="table-card">
          <template #header>
            <div class="table-header">
              <h2 class="table-title">Recent Orders</h2>
              <Button variant="ghost">View All</Button>
            </div>
          </template>
          <DataTable
            :columns="columns"
            :data="recentOrders"
            :pagination="true"
            :per-page="5"
            :current-page="1"
            :searchable="true"
            class="orders-table"
          />
        </Card>

        <Card class="activity-card">
          <template #header>
            <h2 class="activity-title">Recent Activity</h2>
          </template>
          <div class="activity-list">
            <div v-for="i in 5" :key="i" class="activity-item">
              <div
                class="activity-dot"
                :style="{
                  background: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][i - 1],
                }"
              />
              <div class="activity-content">
                <div class="activity-text">
                  Order #ORD-00{{ i }} {{ i % 2 === 0 ? 'delivered' : 'in transit' }}
                </div>
                <div class="activity-time">{{ i }},000</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </AppShell>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.dashboard-title {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--fg);
}

.dashboard-subtitle {
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
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 18px 20px;
  transition: box-shadow var(--transition-fast);
}

.stat-card:hover {
  box-shadow: var(--shadow-lg);
}

.stat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.stat-change {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 12px;
  font-weight: 500;
}

.stat-change.up {
  color: var(--success);
}

.stat-change.down {
  color: var(--danger);
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
  color: var(--fg);
  margin-bottom: 6px;
}

.stat-label {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--muted);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
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

.activity-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--fg);
}

.activity-list {
  display: flex;
  flex-direction: column;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 5px;
  flex-shrink: 0;
}

.activity-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.activity-text {
  font-size: 13px;
  line-height: 1.4;
  color: var(--fg);
}

.activity-time {
  font-size: 11px;
  color: var(--muted);
}
</style>
