import { http } from './client'
import { API_BASE_PATH } from './config'
import type { AuthMessage, LoginCredentials, LoginResponse, MeResponse } from './types'

/**
 * Endpoints de **sesión** (`src/Auth/routes.php` del backend), transversales:
 * los consume `core/stores/auth` (login, me, logout) y con ellos viven el guard
 * del router y el interceptor de `401`.
 *
 * La SPA usa la **cookie de sesión**: no hay token en el navegador. Lo demás
 * del dominio auth (recuperación de contraseña, token para apps y PDA) vive en
 * su módulo: `src/modules/auth/api/auth.api.ts`.
 */

const AUTH_PATH = `${API_BASE_PATH}/auth`

/** Inicia sesión y deja la cookie `HttpOnly` puesta. Requiere la cookie CSRF. */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const { data } = await http.post<LoginResponse>(`${AUTH_PATH}/login`, credentials)

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
