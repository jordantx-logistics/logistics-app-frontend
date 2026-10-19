/**
 * Rutas del módulo **payments**.
 *
 * El router central (`src/router/index.ts`) las descubre por convención con
 * `import.meta.glob('modules/<dominio>/router/index.ts')`: no hay registro a mano.
 * Han de ir por **nombre** (no por path) y con `meta.permission` que el guard
 * usa solo como presentación (la autorización real es del backend).
 */
export default [
  {
    path: '/payments',
    name: 'payments',
    component: () => import('../pages/PaymentsListPage.vue'),
    // El backend aún no expone endpoints de pagos: sin permiso concreto,
    // hasta que exista el listado y el alta (Fase 5, `05-frontend`).
    meta: { requiresAuth: true },
  },
]
