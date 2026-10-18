import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import * as authApi from '@/core/api/auth'
import { setUnauthenticatedHandler } from '@/core/api/client'
import { ApiError } from '@/core/api/errors'
import type { AuthSessionPayload, AuthUser, LoginCredentials } from '@/core/api/types'

/**
 * Sesión de la SPA.
 *
 * La sesión vive en la **cookie `HttpOnly`** de Sanctum: aquí no se guarda
 * ningún token. Al arrancar la aplicación se llama una vez a `ensureSession()`
 * (que hace `GET /auth/me`); si el backend responde `401`, no hay sesión y el
 * guard del router manda al login.
 *
 * `roles`, `permissions` y `agencies` vienen en la misma respuesta que el
 * usuario, así que `can()` y `hasRole()` son síncronos y sin peticiones extra.
 * Ojo: eso es **presentación**, no seguridad — el backend autoriza cada ruta
 * por su cuenta (`permission:` + scope de agencia).
 */
export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const roles = ref<string[]>([])
  const permissions = ref<string[]>([])
  const agencies = ref<number[]>([])

  /** `false` hasta que la primera `ensureSession()` termina. */
  const initialized = ref(false)

  const isAuthenticated = computed(() => user.value !== null)

  function applySession(session: AuthSessionPayload): void {
    user.value = {
      id: session.user?.id ?? 0,
      name: session.user?.name ?? '',
      email: session.user?.email ?? '',
    }
    roles.value = session.roles ?? []
    permissions.value = session.permissions ?? []
    agencies.value = session.agencies ?? []
  }

  /** Limpia la sesión en memoria, sin llamar al backend. */
  function forgetSession(): void {
    user.value = null
    roles.value = []
    permissions.value = []
    agencies.value = []
  }

  /** Inicia sesión (cookie de sesión) y guarda la sesión devuelta. */
  async function login(credentials: LoginCredentials): Promise<void> {
    const response = await authApi.login(credentials)
    applySession(response.data)
    initialized.value = true
  }

  /**
   * Recupera la sesión del backend. Devuelve `false` si no hay sesión (`401`),
   * y deja propagar cualquier otro error (red, `5xx`).
   */
  async function fetchMe(): Promise<boolean> {
    try {
      applySession((await authApi.me()).data)

      return true
    } catch (error) {
      forgetSession()

      if (error instanceof ApiError && error.isUnauthenticated) {
        return false
      }

      throw error
    } finally {
      initialized.value = true
    }
  }

  /** Comprueba la sesión una sola vez (arranque de la app). */
  async function ensureSession(): Promise<boolean> {
    if (initialized.value) {
      return isAuthenticated.value
    }

    return fetchMe()
  }

  /** Cierra la sesión actual. La sesión local se limpia aunque falle la petición. */
  async function logout(): Promise<void> {
    try {
      await authApi.logout()
    } finally {
      forgetSession()
    }
  }

  /** Cierra todas las sesiones del usuario (todos los dispositivos). */
  async function logoutAll(): Promise<void> {
    try {
      await authApi.logoutAll()
    } finally {
      forgetSession()
    }
  }

  /** ¿Tiene el permiso? (`orders.create`, `agencies.manage`...) */
  function can(permission: string): boolean {
    return permissions.value.includes(permission)
  }

  /** ¿Tiene el rol? (`admin`, `counter`...) */
  function hasRole(role: string): boolean {
    return roles.value.includes(role)
  }

  // Una respuesta 401 de cualquier endpoint invalida la sesión: se limpia sin
  // llamar al backend (evita bucles) y el guard del router redirige.
  setUnauthenticatedHandler(forgetSession)

  return {
    user,
    roles,
    permissions,
    agencies,
    initialized,
    isAuthenticated,
    login,
    fetchMe,
    ensureSession,
    logout,
    logoutAll,
    forgetSession,
    can,
    hasRole,
  }
})
