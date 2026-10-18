import { http } from './client'
import { API_BASE_PATH } from './config'
import type {
  AuthMessage,
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  LoginCredentials,
  LoginResponse,
  MeResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
  TokenCredentials,
  TokenResponse,
} from './types'

/**
 * Endpoints de autenticación (`src/Auth/routes.php` del backend).
 *
 * La SPA usa la **cookie de sesión** (`login`, `me`, `logout`): no hay token en
 * el navegador. `issueToken` es para apps y PDA, donde sí se guarda el token
 * opaco en el almacén seguro del dispositivo.
 */

const AUTH_PATH = `${API_BASE_PATH}/auth`

/** Inicia sesión y deja la cookie `HttpOnly` puesta. Requiere la cookie CSRF. */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const { data } = await http.post<LoginResponse>(`${AUTH_PATH}/login`, credentials)

  return data
}

/** Emite un token opaco (apps y PDA). El valor solo se muestra una vez. */
export async function issueToken(credentials: TokenCredentials): Promise<TokenResponse> {
  const { data } = await http.post<TokenResponse>(`${AUTH_PATH}/token`, credentials)

  return data
}

/** Sesión actual: usuario, roles, permisos y agencias. */
export async function me(): Promise<MeResponse> {
  const { data } = await http.get<MeResponse>(`${AUTH_PATH}/me`)

  return data
}

/** Cierra la sesión actual (revoca el token actual si venía por token). */
export async function logout(): Promise<AuthMessage> {
  const { data } = await http.post<AuthMessage>(`${AUTH_PATH}/logout`)

  return data
}

/** Cierra **todas** las sesiones del usuario. */
export async function logoutAll(): Promise<AuthMessage> {
  const { data } = await http.post<AuthMessage>(`${AUTH_PATH}/logout-all`)

  return data
}

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
