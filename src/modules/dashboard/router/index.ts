/**
 * Rutas del módulo **dashboard**.
 *
 * El router central (`src/router/index.ts`) las descubre por convención con
 * `import.meta.glob('modules/<dominio>/router/index.ts')`: no hay registro a mano.
 * Han de ir por **nombre** (no por path) y con `meta.permission` si algo la
 * condiciona (aquí no: la ven todos los actores conectados).
 */
export default [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../pages/DashboardPage.vue'),
    meta: { requiresAuth: true },
  },
]
