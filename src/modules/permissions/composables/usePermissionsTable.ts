import { computed, ref, watch } from 'vue'

import { ApiError, toApiError } from '@/core/api/errors'
import type { Column } from '@/core/components/types'
import { useAuth } from '@/core/composables/useAuth'
import { useToast } from '@/core/composables/useToast'
import { matchesQuery } from '@/core/utils/list'

import { usePermissionsStore } from '../stores/usePermissionsStore'
import type { AssignPermissionsPayload, Permission, Role } from '../types/permissions.types'

/**
 * Lógica de la pantalla de roles y permisos: pestañas, búsqueda y el modal de
 * asignación. El catálogo es fijo (lo siembra el backend) y lo que se toca es
 * **qué permisos tiene cada rol**. El estado vive en
 * `stores/usePermissionsStore.ts`.
 */

type Tab = 'roles' | 'permissions'

export function usePermissionsTable() {
  const store = usePermissionsStore()
  const { can } = useAuth()
  const { success } = useToast()

  const canManageRoles = computed(() => can('roles.manage'))
  const canSeePermissions = computed(() => can('permissions.view'))

  const tab = ref<Tab>('roles')
  const search = ref('')

  const filteredRoles = computed(() => {
    const rows: Role[] = store.roles.data ?? []

    return rows.filter((row) => matchesQuery([row.name, row.guard_name], search.value))
  })

  const filteredPermissions = computed(() => {
    const rows: Permission[] = store.permissions.data ?? []

    return rows.filter((row) => matchesQuery([row.name, row.guard_name], search.value))
  })

  const list = computed(() => (tab.value === 'roles' ? store.roles : store.permissions))

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

  // --- Asignación de permisos a un rol --------------------------------------

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
      await store.assign(role.id, payload)
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

  return {
    roles: store.roles,
    permissions: store.permissions,
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
  }
}
