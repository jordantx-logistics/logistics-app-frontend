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
import type { Column } from '@/core/components/types'
import {
  Building2,
  Search,
  Download,
  Plus,
  Users,
  TrendingUp,
} from 'lucide-vue-next'

const searchQuery = ref('')
const statusFilter = ref('all')
const showNewAgency = ref(false)

const statusOptions = [
  { label: 'All Statuses', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
]

const agencies = ref([
  { id: 'AG-001', name: 'LogiTrack East', location: 'New York', agents: 15, status: 'active', revenue: '$250,000', performance: '95%' },
  { id: 'AG-002', name: 'LogiTrack West', location: 'Los Angeles', agents: 12, status: 'active', revenue: '$180,000', performance: '88%' },
  { id: 'AG-003', name: 'LogiTrack Central', location: 'Chicago', agents: 8, status: 'active', revenue: '$120,000', performance: '82%' },
  { id: 'AG-004', name: 'LogiTrack South', location: 'Miami', agents: 6, status: 'inactive', revenue: '$75,000', performance: '70%' },
  { id: 'AG-005', name: 'LogiTrack North', location: 'Seattle', agents: 10, status: 'active', revenue: '$150,000', performance: '91%' },
])

const columns: Column[] = [
  { key: 'name', label: 'Agency', sortable: true },
  { key: 'location', label: 'Location', sortable: true },
  { key: 'agents', label: 'Agents', sortable: true },
  { key: 'revenue', label: 'Revenue', sortable: true },
  { key: 'performance', label: 'Performance', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
]

const statusColors: Record<string, string> = {
  active: '#10b981',
  inactive: '#6b7280',
}

function getStatusColor(status: string): string {
  return statusColors[status] || '#6366f1'
}

function getStatusLabel(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

const filteredAgencies = computed(() => {
  return agencies.value.filter((agency) => {
    const matchesSearch = agency.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      agency.location.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = statusFilter.value === 'all' || agency.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

function openNewAgency() {
  showNewAgency.value = true
}

function closeNewAgency() {
  showNewAgency.value = false
}
</script>

<template>
  <AppShell>
    <div class="agencies">
      <div class="agencies-header">
        <div>
          <h1 class="agencies-title">Agencies</h1>
          <p class="agencies-subtitle">Manage logistics partner agencies</p>
        </div>
        <div class="agencies-actions">
          <Button variant="ghost" icon>
            <Download :size="16" stroke-width="2" />
          </Button>
          <Button variant="primary" @click="openNewAgency">
            <template #leading>
              <Plus :size="16" stroke-width="2" />
            </template>
            Add Agency
          </Button>
        </div>
      </div>

      <div class="stats-grid">
        <Card class="stat-card">
          <div class="stat-icon" style="background: oklch(58% 0.18 255)">
            <Building2 :size="20" stroke-width="2" />
          </div>
          <div class="stat-value">{{ agencies.length }}</div>
          <div class="stat-label">Total Agencies</div>
        </Card>
        <Card class="stat-card">
          <div class="stat-icon" style="background: oklch(62% 0.18 145)">
            <Users :size="20" stroke-width="2" />
          </div>
          <div class="stat-value">{{String(agencies.reduce((sum, a) => sum + parseInt(String(a.agents)), 0))}}</div>
          <div class="stat-label">Total Agents</div>
        </Card>
        <Card class="stat-card">
          <div class="stat-icon" style="background: oklch(72% 0.16 80)">
            <TrendingUp :size="20" stroke-width="2" />
          </div>
          <div class="stat-value">{{String(agencies.filter((a) => a.status === 'active').length)}}</div>
          <div class="stat-label">Active Agencies</div>
        </Card>
      </div>

      <Card class="filters-card">
        <div class="filters">
          <div class="filter-search">
            <Search :size="16" stroke-width="2" />
            <Input placeholder="Search agencies..." v-model="searchQuery" clearable />
          </div>
          <div class="filter-dropdown">
            <Select :options="statusOptions" v-model="statusFilter" placeholder="Status" />
          </div>
        </div>
      </Card>

      <Card class="table-card">
        <template #header>
          <div class="table-header">
            <h2 class="table-title">All Agencies ({{ filteredAgencies.length }})</h2>
          </div>
        </template>
        <DataTable :columns="columns" :data="filteredAgencies" :pagination="true" :per-page="5" :current-page="1"
          :searchable="true" class="agencies-table">
          <template #status="{ row }">
            <Badge :color="getStatusColor(String(row.status))">
              {{ getStatusLabel(String(row.status)) }}
            </Badge>
          </template>
        </DataTable>
      </Card>

      <Modal :visible="showNewAgency" title="Add Agency" @close="closeNewAgency">
        <template #footer>
          <Button variant="ghost" @click="closeNewAgency">
            Cancel
          </Button>
          <Button variant="primary">
            Add Agency
          </Button>
        </template>
      </Modal>
    </div>
  </AppShell>
</template>

<style scoped>
.agencies {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.agencies-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.agencies-title {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--fg);
}

.agencies-subtitle {
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

.agencies-table {
  overflow-x: auto;
}
</style>
