import type { paths } from './generated/openapi'

/**
 * Tipos derivados del contrato OpenAPI (ADR-0008): **nada** de interfaces de
 * respuesta escritas a mano.
 *
 * Este archivo queda con los **helpers genéricos** de derivación y los tipos de
 * la **sesión**, que es transversal: los consume `core/stores/auth`, el guard
 * del router y el interceptor de `client.ts`. Los tipos de cada dominio
 * (clientes, órdenes, agencias, permisos...) viven en su módulo
 * (`src/modules/<dominio>/types/<dominio>.types.ts`) y derivan de `paths`
 * usando estos helpers; aquí no se duplica ninguna derivación.
 *
 * Scribe no emite `required` en las respuestas, así que el contrato marca todas
 * las propiedades como opcionales. El backend siempre manda el sobre
 * (`success`, `message`) y su `data`, por eso se envuelve en `Required<>`: los
 * campos siguen saliendo del contrato, solo se declaran obligatorios.
 *
 * Ver `spec/08-calidad/02-contrato-openapi-frontend.md`.
 */

/** Cuerpo JSON de una respuesta del contrato. */
export type JsonOf<Response> = Response extends { content: { 'application/json': infer Body } }
  ? Body
  : never

/** Respuesta de éxito del mapa: los listados responden `200` y las altas `201`. */
export type OkOf<Responses> = Responses extends { 200: infer Response }
  ? Response
  : Responses extends { 201: infer Response }
    ? Response
    : never

/** Respuesta completa de un endpoint (sobre incluido). */
export type ResponseOf<
  Path extends keyof paths,
  Method extends 'get' | 'post' | 'put' | 'patch' | 'delete',
> = Required<JsonOf<OkOf<NonNullable<paths[Path][Method]>['responses']>>>

/** Cuerpo de la petición de un endpoint. */
export type RequestOf<
  Path extends keyof paths,
  Method extends 'get' | 'post' | 'put' | 'patch' | 'delete',
> = paths[Path][Method] extends { requestBody: { content: { 'application/json': infer Body } } }
  ? Body
  : never

/** Query string de un endpoint (`page`, `per_page`...). */
export type QueryOf<Path extends keyof paths, Method extends 'get'> =
  NonNullable<paths[Path][Method]> extends { parameters: { query?: infer Query } } ? Query : never

// ---------------------------------------------------------------------------
// Sesión (transversal): `core/stores/auth` + guard + interceptor 401
// ---------------------------------------------------------------------------

/** Respuesta que solo confirma (`success` + `message`, sin `data`). */
export type AuthMessage = ResponseOf<'/api/v1/auth/logout', 'post'>

/** `POST /api/v1/auth/login` — sesión recién creada. */
export type LoginResponse = ResponseOf<'/api/v1/auth/login', 'post'>

/** `GET /api/v1/auth/me` — sesión actual. */
export type MeResponse = ResponseOf<'/api/v1/auth/me', 'get'>

/** Sesión: usuario, roles, permisos y agencias, tal como llega del backend. */
export type AuthSessionPayload = MeResponse['data']

/** Usuario ya normalizado por el store: `id`, `name` y `email` siempre presentes. */
export type AuthUser = Required<NonNullable<MeResponse['data']['user']>>

/** `POST /api/v1/auth/login`. */
export type LoginCredentials = RequestOf<'/api/v1/auth/login', 'post'>
