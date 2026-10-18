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

/** Respuesta `200` del mapa de respuestas de una operación. */
type OkOf<Responses> = Responses extends { 200: infer Response } ? Response : never

/** Respuesta completa de un endpoint (sobre incluido). */
type ResponseOf<Path extends keyof paths, Method extends 'get' | 'post'> = Required<
  JsonOf<OkOf<NonNullable<paths[Path][Method]>['responses']>>
>

/** Cuerpo de la petición de un endpoint. */
export type RequestOf<
  Path extends keyof paths,
  Method extends 'get' | 'post',
> = paths[Path][Method] extends { requestBody: { content: { 'application/json': infer Body } } }
  ? Body
  : never

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
