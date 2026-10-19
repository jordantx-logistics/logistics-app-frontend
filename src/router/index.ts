import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import { authGuard } from './guard'

// Rutas de cada módulo por convención: un módulo nuevo con
// `src/modules/<nombre>/router/index.ts` queda registrado sin tocar este
// archivo (el scaffolding lo crea con `pnpm gen:module`). `eager: true` trae
// las rutas de forma sincrónica (el router las necesita en el arranque); el
// code-splitting lo dan las pantallas, que el `router/index.ts` de cada módulo
// importa de forma diferida.
const moduleRoutes = import.meta.glob<{ default: RouteRecordRaw[] }>(
  '@/modules/*/router/index.ts',
  {
    eager: true,
  },
)

const routes = [
  // `/` no tiene pantalla propia: entra por el dashboard (que exige sesión).
  { path: '/', redirect: { name: 'dashboard' } },
  // Orden estable: el resultado del glob viene por clave, pero el sort lo fija
  // para que las rutas no dependan de incidentes del bundler.
  ...Object.entries(moduleRoutes)
    .sort(([a], [b]) => a.localeCompare(b))
    .flatMap(([, mod]) => mod.default),
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Sesión, login y permisos: ver `src/router/guard.ts`.
router.beforeEach(authGuard)

export default router
