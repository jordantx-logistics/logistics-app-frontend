import { http } from './client'
import { API_BASE_PATH } from './config'
import type {
  AssignPermissionsPayload,
  AssignPermissionsResponse,
  ListPermissionsResponse,
  ListRolesResponse,
  Permission,
  Role,
} from './types'

/**
 * Roles y permisos (`src/Permission` del backend).
 *
 * Los dos listados envuelven la colección (`data.roles` / `data.permissions`);
 * la asignación **sustituye** los permisos del rol (`syncPermissions`), no los
 * añade.
 */

const ROLES_PATH = `${API_BASE_PATH}/permission/roles`
const PERMISSIONS_PATH = `${API_BASE_PATH}/permission/permissions`

/** Roles del sistema, con los nombres de sus permisos. */
export async function listRoles(): Promise<Role[]> {
  const { data } = await http.get<ListRolesResponse>(ROLES_PATH)

  return (data.data?.roles ?? []) as Role[]
}

/** Catálogo completo de permisos (`recurso.accion`). */
export async function listPermissions(): Promise<Permission[]> {
  const { data } = await http.get<ListPermissionsResponse>(PERMISSIONS_PATH)

  return (data.data?.permissions ?? []) as Permission[]
}

/** Deja el rol **exactamente** con los permisos indicados. */
export async function assignPermissions(
  roleId: number,
  payload: AssignPermissionsPayload,
): Promise<AssignPermissionsResponse> {
  const { data } = await http.post<AssignPermissionsResponse>(
    `${ROLES_PATH}/${roleId}/permissions`,
    payload,
  )

  return data
}
