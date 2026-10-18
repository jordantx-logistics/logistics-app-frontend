<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { Key, Search, ShieldCheck } from 'lucide-vue-next'

import { ApiError, toApiError } from '@/core/api/errors'
import * as permissionsApi from '@/core/api/permissions'
import type { AssignPermissionsPayload, Role } from '@/core/api/types'
import AppShell from '@/core/components/AppShell.vue'
import Badge from '@/core/components/Badge.vue'
import Button from '@/core/components/Button.vue'
import Card from '@/core/components/Card.vue'
import DataTable from '@/core/components/DataTable.vue'
import Input from '@/core/components/Input.vue'
import ListState from '@/core/components/ListState.vue'
import Modal from '@/core/components/Modal.vue'
import type { Column } from '@/core/components/types'
import { useAuth } from '@/core/composables/useAuth'
import { useAsyncData } from '@/core/composables/useAsyncData'
import { useToast } from '@/core/composables/useToast'
import { formatDate, formatText } from '@/core/utils/format'
import { matchesQuery } from '@/core/utils/list'
import RolePermissionsForm from './components/RolePermissionsForm.vue'

/**
 * Roles y permisos.
 *
 * El catálogo es fijo (lo siembra el backend) y lo que se toca desde aquí es
 * **qué permisos tiene cada rol**: el `POST` de asignación los sustituye
 * (`syncPermissions`), así que el modal manda la lista completa.
 */

type Tab = 'roles' | 'permissions'

const { can } = useAuth()
const { success } = useToast()

const canManageRoles = computed(() => can('roles.manage'))
const canSeePermissions = computed(() => can('permissions.view'))

const tab = ref<Tab>('roles')
const search = ref('')

const roles = useAsyncData(permissionsApi.listRoles)
const permissions = useAsyncData(permissionsApi.listPermissions)

onMounted(() => {
  void roles.load()

  if (canSeePermissions.value) {
    void permissions.load()
  }
})

const filteredRoles = computed(() => {
  const rows = roles.data.value ?? []

  return rows.filter((row) => matchesQuery([row.name, row.guard_name], search.value))
})

const filteredPermissions = computed(() => {
  const rows = permissions.data.value ?? []

  return rows.filter((row) => matchesQuery([row.name, row.guard_name], search.value))
})

const list = computed(() => (tab.value === 'roles' ? roles : permissions))

const roleColumns: Column[] = [
  { key: 'name', label: 'Role' },
  { key: 'guard_name', label: 'Guard' },
  { key: 'permissions', label: 'Permissions' },
  { key: 'actions', label: '' },
]

const permissionColumns: Column[] = [
  { key: 'name', label: 'Permission' },
  { key: 'guard_name', label: 'Guard' },
  { key: 'created_at', label: 'Created' },
]

const emptyText = computed(() =>
  search.value.trim() === ''
    ? tab.value === 'roles'
      ? 'No roles yet.'
      : 'No permissions yet.'
    : 'Nothing matches the search.',
)

// --- Asignación de permisos a un rol ----------------------------------------

const selectedRole = ref<Role | null>(null)
const submitting = ref(false)
const formError = ref<ApiError | null>(null)

function openPermissions(role: Role): void {
  selectedRole.value = role
  formError.value = null
}

function closePermissions(): void {
  selectedRole.value = null
  formError.value = null
}

async function submitPermissions(payload: AssignPermissionsPayload): Promise<void> {
  const role = selectedRole.value

  if (!role) {
    return
  }

  submitting.value = true
  formError.value = null

  try {
    await permissionsApi.assignPermissions(role.id, payload)
    await roles.load()
    success(`Permissions updated for ${role.name}.`)
    closePermissions()
  } catch (caught) {
    formError.value = caught instanceof ApiError ? caught : toApiError(caught)
  } finally {
    submitting.value = false
  }
}

watch(tab, () => {
  search.value = ''
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
          <div class="stat-value">{{ roles.data.value?.length ?? 0 }}</div>
          <div class="stat-label">Roles</div>
        </Card>
        <Card v-if="canSeePermissions" class="stat-card">
          <div class="stat-icon" style="background: oklch(72% 0.16 80)">
            <Key :size="20" stroke-width="2" />
          </div>
          <div class="stat-value">{{ permissions.data.value?.length ?? 0 }}</div>
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
          :status="list.status.value"
          :error="list.error.value"
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
          :permissions="permissions.data.value ?? []"
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
