/**
 * Rutas del módulo **agencies**.
 *
 * El router central (`src/router/index.ts`) las descubre por convención con
 * `import.meta.glob('modules/<dominio>/router/index.ts')`: no hay registro a mano.
 * Han de ir por **nombre** (no por path) y con `meta.permission` que el guard
 * usa solo como presentación (la autorización real es del backend).
 */
export default [
  {
    path: '/agencies',
    name: 'agencies',
    component: () => import('../pages/AgenciesListPage.vue'),
    // El listado lo filtra el backend por ámbito de agencia según el rol.
    meta: { requiresAuth: true, permission: 'agencies.view' },
  },
]
