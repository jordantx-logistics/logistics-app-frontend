import type { RequestOf, ResponseOf } from '@/core/api/types'

/**
 * Tipos del módulo **permissions**, derivados del contrato OpenAPI
 * (`generated/` + helpers de `core/api/types`, ADR-0008): nada escrito a mano.
 * El módulo solo afina la opcionalidad que el backend no declara (`required`).
 */

// ---------------------------------------------------------------------------
// Roles (`/api/v1/permission/...`)
// ---------------------------------------------------------------------------

/** `GET /api/v1/permission/roles` — el controlador envuelve la colección. */
export type ListRolesResponse = ResponseOf<'/api/v1/permission/roles', 'get'>

/** Fila de rol, con los **nombres** de sus permisos. */
export type Role = Required<NonNullable<ListRolesResponse['data']['roles']>[number]>

/** `POST /api/v1/permission/roles`. */
export type CreateRolePayload = RequestOf<'/api/v1/permission/roles', 'post'>

// ---------------------------------------------------------------------------
// Permisos (`/api/v1/permission/...`)
// ---------------------------------------------------------------------------

/** `GET /api/v1/permission/permissions` — catálogo completo. */
export type ListPermissionsResponse = ResponseOf<'/api/v1/permission/permissions', 'get'>

/** Fila de permiso (`recurso.accion`). */
export type Permission = Required<
  NonNullable<ListPermissionsResponse['data']['permissions']>[number]
>

// ---------------------------------------------------------------------------
// Asignación (`POST /api/v1/permission/roles/{id}/permissions`)
// ---------------------------------------------------------------------------

/** `POST /api/v1/permission/roles/{id}/permissions` — sustituye los del rol. */
export type AssignPermissionsPayload = RequestOf<
  '/api/v1/permission/roles/{id}/permissions',
  'post'
>

/** Respuesta de la asignación de permisos a un rol. */
export type AssignPermissionsResponse = ResponseOf<
  '/api/v1/permission/roles/{id}/permissions',
  'post'
>
