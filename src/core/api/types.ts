import type { paths } from './generated/openapi'

/**
 * Tipos derivados del contrato OpenAPI (ADR-0008): **nada** de interfaces de
 * respuesta escritas a mano. Lo único que se hace aquí es `alias` de los
 * endpoints que usa el frontend y afinar la opcionalidad.
 *
 * Scribe no emite `required` en las respuestas, así que el contrato marca todas
 * las propiedades como opcionales. El backend siempre manda el sobre
 * (`success`, `message`) y su `data`, por eso se envuelve en `Required<>`: los
 * campos siguen saliendo del contrato, solo se declaran obligatorios.
 *
 * Ver `spec/08-calidad/02-contrato-openapi-frontend.md`.
 */

/** Cuerpo JSON de una respuesta del contrato. */
type JsonOf<Response> = Response extends { content: { 'application/json': infer Body } }
  ? Body
  : never

/** Respuesta de éxito del mapa: los listados responden `200` y las altas `201`. */
type OkOf<Responses> = Responses extends { 200: infer Response }
  ? Response
  : Responses extends { 201: infer Response }
    ? Response
    : never

/** Respuesta completa de un endpoint (sobre incluido). */
type ResponseOf<Path extends keyof paths, Method extends 'get' | 'post' | 'put'> = Required<
  JsonOf<OkOf<NonNullable<paths[Path][Method]>['responses']>>
>

/** Cuerpo de la petición de un endpoint. */
export type RequestOf<
  Path extends keyof paths,
  Method extends 'get' | 'post' | 'put',
> = paths[Path][Method] extends { requestBody: { content: { 'application/json': infer Body } } }
  ? Body
  : never

/** Query string de un endpoint (`page`, `per_page`...). */
type QueryOf<Path extends keyof paths, Method extends 'get'> =
  NonNullable<paths[Path][Method]> extends { parameters: { query?: infer Query } } ? Query : never

/** Respuesta que solo confirma (`success` + `message`, sin `data`). */
export type AuthMessage = ResponseOf<'/api/v1/auth/logout', 'post'>

/** `POST /api/v1/auth/forgot-password` (responde igual exista o no la cuenta). */
export type ForgotPasswordResponse = ResponseOf<'/api/v1/auth/forgot-password', 'post'>

/** `POST /api/v1/auth/reset-password`. */
export type ResetPasswordResponse = ResponseOf<'/api/v1/auth/reset-password', 'post'>

/** `POST /api/v1/auth/login` — sesión recién creada. */
export type LoginResponse = ResponseOf<'/api/v1/auth/login', 'post'>

/** `GET /api/v1/auth/me` — sesión actual. */
export type MeResponse = ResponseOf<'/api/v1/auth/me', 'get'>

/** `POST /api/v1/auth/token` (apps y PDA). */
export type TokenResponse = ResponseOf<'/api/v1/auth/token', 'post'>

/** Sesión: usuario, roles, permisos y agencias, tal como llega del backend. */
export type AuthSessionPayload = MeResponse['data']

/** Usuario ya normalizado por el store: `id`, `name` y `email` siempre presentes. */
export type AuthUser = Required<NonNullable<MeResponse['data']['user']>>

/** Token opaco emitido por `POST /api/v1/auth/token`. */
export type IssuedToken = Required<NonNullable<TokenResponse['data']>>

/** `POST /api/v1/auth/login`. */
export type LoginCredentials = RequestOf<'/api/v1/auth/login', 'post'>

/** `POST /api/v1/auth/token` (apps y PDA). */
export type TokenCredentials = RequestOf<'/api/v1/auth/token', 'post'>

/** `POST /api/v1/auth/forgot-password`. */
export type ForgotPasswordPayload = RequestOf<'/api/v1/auth/forgot-password', 'post'>

/** `POST /api/v1/auth/reset-password`. */
export type ResetPasswordPayload = RequestOf<'/api/v1/auth/reset-password', 'post'>

// ---------------------------------------------------------------------------
// Clientes (`src/Customer`): personas y empresas
// ---------------------------------------------------------------------------

/** `GET /api/v1/customer/persons` — personas registradas. */
export type ListPersonsResponse = ResponseOf<'/api/v1/customer/persons', 'get'>

/** Fila de persona (el contrato no marca `required`, la capa API sí). */
export type Person = Required<NonNullable<ListPersonsResponse['data']>[number]>

/** `POST /api/v1/customer/persons`. */
export type CreatePersonPayload = RequestOf<'/api/v1/customer/persons', 'post'>

/** Respuesta del alta de persona. */
export type CreatePersonResponse = ResponseOf<'/api/v1/customer/persons', 'post'>

/** `GET /api/v1/customer/companies` — clientes corporativos. */
export type ListCompaniesResponse = ResponseOf<'/api/v1/customer/companies', 'get'>

/** Fila de empresa. */
export type Company = Required<NonNullable<ListCompaniesResponse['data']>[number]>

/** `POST /api/v1/customer/companies`. */
export type CreateCompanyPayload = RequestOf<'/api/v1/customer/companies', 'post'>

/** Respuesta del alta de empresa. */
export type CreateCompanyResponse = ResponseOf<'/api/v1/customer/companies', 'post'>

// ---------------------------------------------------------------------------
// Agencias (`src/Organization`)
// ---------------------------------------------------------------------------

/** `GET /api/v1/organization/agencies` — agencias configuradas. */
export type ListAgenciesResponse = ResponseOf<'/api/v1/organization/agencies', 'get'>

/** Fila de agencia. */
export type Agency = Required<NonNullable<ListAgenciesResponse['data']>[number]>

/** `POST /api/v1/organization/agencies`. */
export type CreateAgencyPayload = RequestOf<'/api/v1/organization/agencies', 'post'>

/** Respuesta del alta de agencia. */
export type CreateAgencyResponse = ResponseOf<'/api/v1/organization/agencies', 'post'>

// ---------------------------------------------------------------------------
// Roles y permisos (`src/Permission`)
// ---------------------------------------------------------------------------

/** `GET /api/v1/permission/roles` — el controlador envuelve la colección. */
export type ListRolesResponse = ResponseOf<'/api/v1/permission/roles', 'get'>

/** Fila de rol, con los **nombres** de sus permisos. */
export type Role = Required<NonNullable<ListRolesResponse['data']['roles']>[number]>

/** `POST /api/v1/permission/roles`. */
export type CreateRolePayload = RequestOf<'/api/v1/permission/roles', 'post'>

/** `GET /api/v1/permission/permissions` — catálogo completo. */
export type ListPermissionsResponse = ResponseOf<'/api/v1/permission/permissions', 'get'>

/** Fila de permiso (`recurso.accion`). */
export type Permission = Required<
  NonNullable<ListPermissionsResponse['data']['permissions']>[number]
>

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

// ---------------------------------------------------------------------------
// Órdenes (`src/Logistics/Order`)
// ---------------------------------------------------------------------------

/** `GET /api/v1/logistics/orders` — paginado con el sobre estándar. */
export type ListOrdersResponse = ResponseOf<'/api/v1/logistics/orders', 'get'>

/** Fila de orden. Solo ids: los nombres llegan en la Fase 3. */
export type Order = Required<NonNullable<ListOrdersResponse['data']>[number]>

/** `meta` del paginador de Laravel. */
export type OrdersPageMeta = Required<NonNullable<ListOrdersResponse['meta']>>

/** `page` / `per_page` del listado de órdenes. */
export type OrdersQuery = NonNullable<QueryOf<'/api/v1/logistics/orders', 'get'>>

/** `POST /api/v1/logistics/orders` (lo usará el formulario de órdenes). */
export type CreateOrderPayload = RequestOf<'/api/v1/logistics/orders', 'post'>
