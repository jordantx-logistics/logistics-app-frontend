<script setup lang="ts">
import { onMounted } from 'vue'
import { Key, Search, ShieldCheck } from 'lucide-vue-next'

import AppShell from '@/core/components/AppShell.vue'
import Badge from '@/core/components/Badge.vue'
import Button from '@/core/components/Button.vue'
import Card from '@/core/components/Card.vue'
import DataTable from '@/core/components/DataTable.vue'
import Input from '@/core/components/Input.vue'
import ListState from '@/core/components/ListState.vue'
import Modal from '@/core/components/Modal.vue'
import { formatDate, formatText } from '@/core/utils/format'
import type { Role } from '../types/permissions.types'

import { usePermissionsTable } from '../composables/usePermissionsTable'
import RolePermissionsForm from '../components/RolePermissionsForm.vue'

/**
 * Roles y permisos.
 *
 * El catálogo es fijo (lo siembra el backend) y lo que se toca desde aquí es
 * **qué permisos tiene cada rol**: el `POST` de asignación los sustituye
 * (`syncPermissions`), así que el modal manda la lista completa.
 *
 * La lógica vive en `composables/usePermissionsTable.ts`, el estado en
 * `stores/usePermissionsStore.ts` y las llamadas HTTP en
 * `api/permissions.api.ts`.
 */

const {
  roles,
  permissions,
  canManageRoles,
  canSeePermissions,
  tab,
  search,
  filteredRoles,
  filteredPermissions,
  list,
  roleColumns,
  permissionColumns,
  emptyText,
  selectedRole,
  submitting,
  formError,
  openPermissions,
  closePermissions,
  submitPermissions,
} = usePermissionsTable()

onMounted(() => {
  void roles.load()

  if (canSeePermissions.value) {
    void permissions.load()
  }
})
</script>

<template>
  <AppShell>
    <div class="permissions">
      <div class="page-header">
        <div>
          <h1 class="page-title">Permissions</h1>
          <p class="page-subtitle">Roles and the permissions each one grants</p>
        </div>
      </div>

      <div class="stats-grid">
        <Card class="stat-card">
          <div class="stat-icon" style="background: oklch(58% 0.18 255)">
            <ShieldCheck :size="20" stroke-width="2" />
          </div>
          <div class="stat-value">{{ roles.data?.length ?? 0 }}</div>
          <div class="stat-label">Roles</div>
        </Card>
        <Card v-if="canSeePermissions" class="stat-card">
          <div class="stat-icon" style="background: oklch(72% 0.16 80)">
            <Key :size="20" stroke-width="2" />
          </div>
          <div class="stat-value">{{ permissions.data?.length ?? 0 }}</div>
          <div class="stat-label">Permissions</div>
        </Card>
      </div>

      <div class="permissions-toolbar">
        <div class="tabs">
          <button class="tab" :class="{ active: tab === 'roles' }" @click="tab = 'roles'">
            Roles
          </button>
          <button
            v-if="canSeePermissions"
            class="tab"
            :class="{ active: tab === 'permissions' }"
            @click="tab = 'permissions'"
          >
            Permissions
          </button>
        </div>
        <div class="filter-search">
          <Search :size="16" stroke-width="2" />
          <Input placeholder="Search..." v-model="search" />
        </div>
      </div>

      <Card class="table-card">
        <template #header>
          <div class="table-header">
            <h2 class="table-title">
              {{ tab === 'roles' ? 'Roles' : 'Permissions' }} ({{
                tab === 'roles' ? filteredRoles.length : filteredPermissions.length
              }})
            </h2>
          </div>
        </template>

        <ListState
          :status="list.status"
          :error="list.error"
          :empty="tab === 'roles' ? filteredRoles.length === 0 : filteredPermissions.length === 0"
          :empty-text="emptyText"
          @retry="list.load"
        >
          <DataTable v-if="tab === 'roles'" :columns="roleColumns" :data="filteredRoles">
            <template #name="{ row }">
              <span class="role-name">{{ formatText(row.name) }}</span>
            </template>
            <template #guard_name="{ row }">
              <Badge variant="neutral">{{ formatText(row.guard_name) }}</Badge>
            </template>
            <template #permissions="{ row }">
              <div class="permissions-list">
                <Badge v-for="permission in row.permissions as string[]" :key="permission">
                  {{ permission }}
                </Badge>
                <span v-if="(row.permissions as string[]).length === 0" class="no-permissions">
                  None
                </span>
              </div>
            </template>
            <template #actions="{ row }">
              <Button
                v-if="canManageRoles"
                variant="secondary"
                size="sm"
                @click="openPermissions(row as unknown as Role)"
              >
                Edit permissions
              </Button>
            </template>
          </DataTable>

          <DataTable v-else :columns="permissionColumns" :data="filteredPermissions">
            <template #name="{ row }">
              <span class="role-name">{{ formatText(row.name) }}</span>
            </template>
            <template #guard_name="{ row }">
              <Badge variant="neutral">{{ formatText(row.guard_name) }}</Badge>
            </template>
            <template #created_at="{ row }">{{ formatDate(String(row.created_at)) }}</template>
          </DataTable>
        </ListState>
      </Card>

      <Modal
        :visible="selectedRole !== null"
        :title="`Permissions · ${selectedRole?.name ?? ''}`"
        @close="closePermissions"
      >
        <RolePermissionsForm
          :role="selectedRole"
          :permissions="permissions.data ?? []"
          :loading="submitting"
          :error="formError"
          @submit="submitPermissions"
          @cancel="closePermissions"
        />
      </Modal>
    </div>
  </AppShell>
</template>

<style scoped>
.permissions {
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

.permissions-toolbar {
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

.permissions-list {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}

.role-name {
  font-weight: 500;
  color: var(--fg);
}

.no-permissions {
  font-size: 12px;
  color: var(--muted);
}
</style>
