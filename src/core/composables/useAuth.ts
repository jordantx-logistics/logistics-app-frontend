import { useRouter } from 'vue-router'

import { useAuthStore } from '@/core/stores/auth'
import { useToast } from '@/core/composables/useToast'

/**
 * Azúcar para los componentes: el store de sesión (`authStore`) y las acciones
 * que suelen ir con navegación.
 *
 * El estado se lee del store (`authStore.user`, `authStore.isAuthenticated`...)
 * para que sea reactivo; `user`, `roles`, etc. no se copian aquí a propósito:
 * una copia se quedaría con el valor del momento en que se llamó.
 */
export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()
  const { warning } = useToast()

  async function logoutFromServer(close: () => Promise<void>): Promise<void> {
    try {
      await close()
    } catch {
      // La sesión local ya se limpió (el store lo hace en un `finally`); lo que
      // falló es invalidarla en el servidor, así que conviene avisar: si el
      // usuario recarga, la cookie puede devolverle la sesión.
      warning('No se pudo cerrar la sesión en el servidor.')
    } finally {
      await router.push({ name: 'login' })
    }
  }

  /** Cierra la sesión actual y vuelve al login. */
  async function logout(): Promise<void> {
    await logoutFromServer(authStore.logout)
  }

  /** Cierra todas las sesiones (todos los dispositivos) y vuelve al login. */
  async function logoutAll(): Promise<void> {
    await logoutFromServer(authStore.logoutAll)
  }

  return {
    authStore,
    can: authStore.can,
    hasRole: authStore.hasRole,
    login: authStore.login,
    logout,
    logoutAll,
  }
}
