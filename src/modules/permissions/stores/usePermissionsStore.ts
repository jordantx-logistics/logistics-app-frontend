import { defineStore } from 'pinia'

import { useAsyncData } from '@/core/composables/useAsyncData'

import * as permissionsApi from '../api/permissions.api'
import type { AssignPermissionsPayload } from '../types/permissions.types'

/**
 * Estado del módulo **permissions**: los roles con sus permisos, el catálogo y
 * la asignación (la que **sustituye** la lista del rol). La sesión y los
 * permisos del usuario NO viven aquí (son de core/).
 */
export const usePermissionsStore = defineStore('permissions', () => {
  const roles = useAsyncData(permissionsApi.listRoles)
  const permissions = useAsyncData(permissionsApi.listPermissions)

  /**
   * asigna permisos a un rol y recarga la lista de roles (el rol devuelto por
   * el POST ya trae los nombres, pero así el listado queda coherente).
   */
  async function assign(roleId: number, payload: AssignPermissionsPayload): Promise<void> {
    await permissionsApi.assignPermissions(roleId, payload)
    await roles.load()
  }

  return {
    roles,
    permissions,
    assign,
  }
})
