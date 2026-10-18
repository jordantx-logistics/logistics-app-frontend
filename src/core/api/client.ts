import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'

import { API_ORIGIN, CSRF_COOKIE_PATH } from './config'
import { toApiError } from './errors'

/**
 * Cliente HTTP del frontend.
 *
 * - `baseURL` es el **origen** del backend; las rutas se escriben completas
 *   (`/api/v1/...`) para que Sanctum pueda usar `/sanctum/csrf-cookie`.
 * - `withCredentials` viaja con la cookie de sesión `HttpOnly`. **Nunca** se
 *   guarda un token en el navegador.
 * - El interceptor de petición añade `X-XSRF-TOKEN` leyendo la cookie que
 *   escribe Sanctum (axios también lo haría con `withXSRFToken` en el
 *   navegador; aquí queda explícito y comprobable en los tests).
 * - Los errores salen normalizados como `ApiError` (`./errors`).
 */

type RetriableConfig = InternalAxiosRequestConfig & { __csrfRetried?: boolean }

type UnauthenticatedHandler = () => void

let onUnauthenticated: UnauthenticatedHandler | null = null

/**
 * Registra qué hacer cuando una petición responde `401` (sesión caducada o
 * revocada). El store de auth limpia su estado sin llamar al backend, para no
 * entrar en bucle; el guard del router se encarga de redirigir.
 */
export function setUnauthenticatedHandler(handler: UnauthenticatedHandler | null): void {
  onUnauthenticated = handler
}

/** Lee una cookie del navegador (`document.cookie`). */
export function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`))

  return match?.[1] === undefined ? null : decodeURIComponent(match[1])
}

export const http: AxiosInstance = axios.create({
  baseURL: API_ORIGIN,
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

http.interceptors.request.use((config) => {
  // `Accept: application/json` es lo que hace que Laravel devuelva el sobre de
  // error del API (y no un redirect) cuando algo falla.
  config.headers.set('Accept', 'application/json')

  const token = readCookie('XSRF-TOKEN')
  if (token !== null) {
    config.headers.set('X-XSRF-TOKEN', token)
  }

  return config
})

/**
 * Pide la cookie CSRF a Sanctum. Es obligatorio antes del primer `POST` de la
 * SPA (y lo repite el interceptor cuando el token caduca).
 */
export async function ensureCsrfCookie(): Promise<void> {
  // `__csrfRetried` evita que un 419 de esta propia petición dispare otra
  // ronda de reintentos (bucle).
  await http.get(CSRF_COOKIE_PATH, {
    withCredentials: true,
    __csrfRetried: true,
  } as RetriableConfig)
}

http.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    const apiError = toApiError(error)
    const config = axios.isAxiosError(error)
      ? (error.config as RetriableConfig | undefined)
      : undefined

    // 419: la cookie CSRF caducó (la sesión sigue viva). Se pide una nueva y se
    // repite la petición **una** vez; si vuelve a fallar, se propaga.
    if (apiError.isCsrfMismatch && config && !config.__csrfRetried) {
      config.__csrfRetried = true
      await ensureCsrfCookie()

      return http.request(config)
    }

    // 401: la sesión ya no vale. Se avisa al store (sin llamar al backend).
    if (apiError.isUnauthenticated) {
      onUnauthenticated?.()
    }

    throw apiError
  },
)
