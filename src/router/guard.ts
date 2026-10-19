import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'

import { useAuthStore } from '@/core/stores/auth'

declare module 'vue-router' {
  interface RouteMeta {
    /** `false` en las rutas públicas (login, recuperar contraseña...). */
    requiresAuth?: boolean
    /**
     * Permiso que exige el backend para la ruta (p. ej. `orders.create`).
     * El guard solo lo usa para no mostrar pantallas que darían `403`; la
     * autorización real la hace el backend en cada petición.
     */
    permission?: string
  }
}

/**
 * Guard de sesión y permisos.
 *
 * Antes de cada navegación **protegida** asegura que la sesión esté comprobada
 * (`GET /auth/me`, una sola vez por carga de página) y después decide:
 *
 * 1. Ruta protegida sin sesión → `login`, guardando el destino en `?redirect=`.
 * 2. Ruta pública con sesión conocida (`login`, `forgotPassword`...) → `dashboard`.
 * 3. Ruta con `meta.permission` que el usuario no tiene → `dashboard`.
 *
 * Las rutas públicas **no** preguntan al backend: un `GET /auth/me` en el login
 * solo puede acabar en `401` y ensucia la traza (y en una sesión ya cerrada es
 * una petición inútil). Para sacar del login a quien ya tiene sesión (p. ej.
 * justo después de iniciarla) basta con el estado que sigue en memoria.
 *
 * No usa `useRouter()`: los guards no corren en el contexto de un componente.
 */
export async function authGuard(to: RouteLocationNormalized): Promise<true | RouteLocationRaw> {
  const auth = useAuthStore()

  const requiresAuth = to.meta.requiresAuth !== false

  if (requiresAuth) {
    try {
      await auth.ensureSession()
    } catch {
      // El backend no responde (red caída, 5xx): se trata como "sin sesión" y el
      // usuario acaba en el login, donde el intento de entrar mostrará el error
      // de verdad. Dejar propagar el fallo abortaría la navegación y la
      // aplicación se quedaría en blanco.
      auth.forgetSession()
    }
  }

  if (requiresAuth && !auth.isAuthenticated) {
    return {
      name: 'login',
      query: to.fullPath === '/' ? {} : { redirect: to.fullPath },
    }
  }

  if (!requiresAuth && auth.isAuthenticated && to.name === 'login') {
    return { name: 'dashboard' }
  }

  if (to.meta.permission && !auth.can(to.meta.permission)) {
    return { name: 'dashboard' }
  }

  return true
}
