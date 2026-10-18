<script setup lang="ts">
import { computed, ref } from 'vue'
import AppShell from '@/core/components/AppShell.vue'
import Card from '@/core/components/Card.vue'
import Button from '@/core/components/Button.vue'
import Badge from '@/core/components/Badge.vue'
import Input from '@/core/components/Input.vue'
import DataTable from '@/core/components/DataTable.vue'
import type { Column } from '@/core/components/types'
import { Shield, Search, Users, Key } from 'lucide-vue-next'

const searchQuery = ref('')

const roles = ref([
  {
    id: 'role-1',
    name: 'Administrator',
    users: 2,
    permissions: [
      'dashboard',
      'orders',
      'payments',
      'customers',
      'agencies',
      'permissions',
      'settings',
    ],
    status: 'active',
  },
  {
    id: 'role-2',
    name: 'Manager',
    users: 5,
    permissions: ['dashboard', 'orders', 'payments', 'customers', 'agencies'],
    status: 'active',
  },
  {
    id: 'role-3',
    name: 'Agent',
    users: 12,
    permissions: ['dashboard', 'orders', 'customers'],
    status: 'active',
  },
  { id: 'role-4', name: 'Viewer', users: 8, permissions: ['dashboard'], status: 'inactive' },
])

const columns: Column[] = [
  { key: 'name', label: 'Role', sortable: true },
  { key: 'users', label: 'Users', sortable: true },
  { key: 'permissions', label: 'Permissions', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
]

const filteredRoles = computed(() => {
  return roles.value.filter((role) => {
    return role.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  })
})
</script>

<template>
  <AppShell>
    <div class="permissions">
      <div class="permissions-header">
        <div>
          <h1 class="permissions-title">Permissions</h1>
          <p class="permissions-subtitle">Manage roles and access controls</p>
        </div>
        <div class="permissions-actions">
          <Button variant="primary"> Add Role </Button>
        </div>
      </div>

      <div class="stats-grid">
        <Card class="stat-card">
          <div class="stat-icon" style="background: oklch(58% 0.18 255)">
            <Shield :size="20" stroke-width="2" />
          </div>
          <div class="stat-value">{{ roles.length }}</div>
          <div class="stat-label">Total Roles</div>
        </Card>
        <Card class="stat-card">
          <div class="stat-icon" style="background: oklch(62% 0.18 145)">
            <Users :size="20" stroke-width="2" />
          </div>
          <div class="stat-value">{{ roles.reduce((sum, r) => sum + r.users, 0) }}</div>
          <div class="stat-label">Total Users</div>
        </Card>
        <Card class="stat-card">
          <div class="stat-icon" style="background: oklch(72% 0.16 80)">
            <Key :size="20" stroke-width="2" />
          </div>
          <div class="stat-value">{{ roles[0]?.permissions.length || 0 }}</div>
          <div class="stat-label">Max Permissions</div>
        </Card>
      </div>

      <Card class="filters-card">
        <div class="filters">
          <div class="filter-search">
            <Search :size="16" stroke-width="2" />
            <Input placeholder="Search roles..." v-model="searchQuery" clearable />
          </div>
        </div>
      </Card>

      <Card class="table-card">
        <template #header>
          <div class="table-header">
            <h2 class="table-title">All Roles ({{ filteredRoles.length }})</h2>
          </div>
        </template>
        <DataTable
          :columns="columns"
          :data="filteredRoles"
          :pagination="true"
          :per-page="5"
          :current-page="1"
          :searchable="true"
          class="permissions-table"
        >
          <template #permissions="{ row }">
            <div class="permissions-list">
              <Badge
                v-for="perm in (row.permissions as string[]).slice(0, 3)"
                :key="perm"
                size="sm"
              >
                {{ perm }}
              </Badge>
              <span v-if="(row.permissions as string[]).length > 3" class="perm-more">
                +{{ (row.permissions as string[]).length - 3 }} more
              </span>
            </div>
          </template>
          <template #status="{ row }">
            <Badge
              :color="
                (row.status as string) === 'active' ? 'oklch(62% 0.18 145)' : 'oklch(60% 0.20 25)'
              "
            >
              {{ (row.status as string).charAt(0).toUpperCase() + (row.status as string).slice(1) }}
            </Badge>
          </template>
        </DataTable>
      </Card>
    </div>
  </AppShell>
</template>

<style scoped>
.permissions {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.permissions-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.permissions-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--fg);
}

.permissions-subtitle {
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

.permissions-table {
  overflow-x: auto;
}

.permissions-list {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}

.perm-more {
  font-size: 12px;
  color: var(--muted);
}
</style>
