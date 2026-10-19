import { http } from '@/core/api/client'
import { API_BASE_PATH } from '@/core/api/config'
import type {
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
  TokenCredentials,
  TokenResponse,
} from '../types/auth.types'

/**
 * Endpoints de auth que **no** son del ciclo de sesión: recuperación de
 * contraseña y el token opaco para apps/PDA. Los consumen directamente las
 * pantallas del módulo.
 *
 * Lo de sesión (`login`, `me`, `logout`) queda en `core/api/auth.ts`: lo usan
 * el store de sesión y el guard, que son transversales.
 */

const AUTH_PATH = `${API_BASE_PATH}/auth`

/** Pide el enlace de recuperación. Responde igual exista o no la cuenta. */
export async function forgotPassword(
  payload: ForgotPasswordPayload,
): Promise<ForgotPasswordResponse> {
  const { data } = await http.post<ForgotPasswordResponse>(`${AUTH_PATH}/forgot-password`, payload)

  return data
}

/** Cambia la contraseña con el token del enlace de recuperación. */
export async function resetPassword(payload: ResetPasswordPayload): Promise<ResetPasswordResponse> {
  const { data } = await http.post<ResetPasswordResponse>(`${AUTH_PATH}/reset-password`, payload)

  return data
}

/** Emite un token opaco (apps y PDA). El valor solo se muestra una vez. */
export async function issueToken(credentials: TokenCredentials): Promise<TokenResponse> {
  const { data } = await http.post<TokenResponse>(`${AUTH_PATH}/token`, credentials)

  return data
}
