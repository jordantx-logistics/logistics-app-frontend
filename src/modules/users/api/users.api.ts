import { http } from '@/core/api/client'
import { API_BASE_PATH } from '@/core/api/config'
import type {
  AssignAgencyScopePayload,
  ChangeUserStatusPayload,
  CreateUserPayload,
  CreateUserResponse,
  ListUsersResponse,
  UpdateUserPayload,
  UpdateUserResponse,
  User,
  UserStatus,
} from '../types/users.types'

/** Usuarios (`src/Identity/User` del backend). */

const USERS_PATH = `${API_BASE_PATH}/identity/users`

/** Filtros del listado: los aplica el **backend** (el listado pagina allí). */
export interface UserListQuery {
  page?: number
  per_page?: number
  status?: UserStatus
  /** Busca por nombre o email. */
  q?: string
  /** Usuarios con esa agencia en su ámbito. */
  agency_id?: number
}

/**
 * `GET /identity/users` — página de usuarios.
 *
 * Devuelve el sobre entero (no solo la colección) porque la pantalla necesita el
 * `meta` del paginador (`last_page`, `total`).
 */
export async function listUsers(query: UserListQuery = {}): Promise<ListUsersResponse> {
  const { data } = await http.get<ListUsersResponse>(USERS_PATH, { params: query })

  return data
}

/** Da de alta un usuario (UC-01). Devuelve la fila creada. */
export async function createUser(payload: CreateUserPayload): Promise<User> {
  const { data } = await http.post<CreateUserResponse>(USERS_PATH, payload)

  return data.data as User
}

/** Edita los datos de un usuario. */
export async function updateUser(id: number, payload: UpdateUserPayload): Promise<User> {
  const { data } = await http.put<UpdateUserResponse>(`${USERS_PATH}/${id}`, payload)

  return data.data as User
}

/** Suspende, reactiva o da de baja al usuario (UC-06). */
export async function changeUserStatus(
  id: number,
  payload: ChangeUserStatusPayload,
): Promise<User> {
  const { data } = await http.patch<UpdateUserResponse>(`${USERS_PATH}/${id}/status`, payload)

  return data.data as User
}

/** Atajo de UC-06: suspende al usuario. */
export async function suspendUser(id: number): Promise<void> {
  await http.delete(`${USERS_PATH}/${id}`)
}

/** Levanta el bloqueo por intentos fallidos (UC-07). */
export async function unlockUser(id: number): Promise<void> {
  await http.post(`${USERS_PATH}/${id}/unlock`)
}

/** Sincroniza el ámbito de agencia del usuario (UC-16). */
export async function assignAgencyScope(
  id: number,
  payload: AssignAgencyScopePayload,
): Promise<User> {
  const { data } = await http.put<UpdateUserResponse>(`${USERS_PATH}/${id}/agency-scope`, payload)

  return data.data as User
}
