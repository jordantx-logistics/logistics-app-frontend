import type { RequestOf, ResponseOf } from '@/core/api/types'

/**
 * Tipos del módulo **users**, derivados del contrato OpenAPI (ADR-0008): nada
 * escrito a mano, salvo la afinación de `roles`/`agencies` (ver `User`).
 */

/** `GET /api/v1/identity/users` — listado paginado de usuarios. */
export type ListUsersResponse = ResponseOf<'/api/v1/identity/users', 'get'>

/** Agencia del ámbito del usuario, con la marca de principal (`agency_user`). */
export interface UserAgency {
  id: number
  name: string
  is_primary: boolean
}

/**
 * Fila de usuario.
 *
 * El contrato emite `roles` y `agencies` como `unknown[]` porque Scribe no sabe
 * tipar los arrays que el `UserResource` calcula en PHP; aquí se les da forma —y
 * solo a esos dos campos—, que es la excepción que ADR-0008 permite documentar.
 */
export type User = Omit<
  Required<NonNullable<ListUsersResponse['data']>[number]>,
  'roles' | 'agencies'
> & {
  roles: string[]
  agencies: UserAgency[]
}

/** Estado del usuario: máquina de estados de UC-06. */
export type UserStatus = RequestOf<'/api/v1/identity/users/{user_id}/status', 'patch'>['status']

/** `POST /api/v1/identity/users` — alta (UC-01). */
export type CreateUserPayload = RequestOf<'/api/v1/identity/users', 'post'>

/** Respuesta del alta de usuario. */
export type CreateUserResponse = ResponseOf<'/api/v1/identity/users', 'post'>

/** `PUT /api/v1/identity/users/{id}` — edición de datos. */
export type UpdateUserPayload = RequestOf<'/api/v1/identity/users/{user_id}', 'put'>

/** Respuesta de la edición de usuario. */
export type UpdateUserResponse = ResponseOf<'/api/v1/identity/users/{user_id}', 'put'>

/** `PATCH /api/v1/identity/users/{id}/status` — suspender/reactivar (UC-06). */
export type ChangeUserStatusPayload = RequestOf<'/api/v1/identity/users/{user_id}/status', 'patch'>

/** `PUT /api/v1/identity/users/{id}/agency-scope` — ámbito de agencia (UC-16). */
export type AssignAgencyScopePayload = RequestOf<
  '/api/v1/identity/users/{user_id}/agency-scope',
  'put'
>
