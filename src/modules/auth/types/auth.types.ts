import type { RequestOf, ResponseOf } from '@/core/api/types'

/**
 * Tipos del módulo **auth** que no son del ciclo de sesión: los consume
 * directamente la pantalla de recuperación y el alta de tokens para apps/PDA.
 *
 * Los del **ciclo de sesión** (login, me, logout) son transversales y viven en
 * `core/api/types.ts` (los usa `core/stores/auth` y el guard).
 */

// ---------------------------------------------------------------------------
// Recuperación de contraseña
// ---------------------------------------------------------------------------

/** `POST /api/v1/auth/forgot-password`. */
export type ForgotPasswordResponse = ResponseOf<'/api/v1/auth/forgot-password', 'post'>

/** `POST /api/v1/auth/forgot-password`. */
export type ForgotPasswordPayload = RequestOf<'/api/v1/auth/forgot-password', 'post'>

/** `POST /api/v1/auth/reset-password`. */
export type ResetPasswordResponse = ResponseOf<'/api/v1/auth/reset-password', 'post'>

/** `POST /api/v1/auth/reset-password`. */
export type ResetPasswordPayload = RequestOf<'/api/v1/auth/reset-password', 'post'>

// ---------------------------------------------------------------------------
// Token opaco (apps móviles y PDA; la SPA no lo usa)
// ---------------------------------------------------------------------------

/** `POST /api/v1/auth/token`. */
export type TokenResponse = ResponseOf<'/api/v1/auth/token', 'post'>

/** Token opaco emitido por `POST /api/v1/auth/token`. */
export type IssuedToken = Required<NonNullable<TokenResponse['data']>>

/** `POST /api/v1/auth/token` (apps y PDA). */
export type TokenCredentials = RequestOf<'/api/v1/auth/token', 'post'>
