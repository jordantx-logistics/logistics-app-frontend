/**
 * Rutas del módulo **customers**.
 *
 * El router central (`src/router/index.ts`) las descubre por convención con
 * `import.meta.glob('modules/<dominio>/router/index.ts')`: no hay registro a mano.
 * Han de ir por **nombre** (no por path) y con `meta.permission` que el guard
 * usa solo como presentación (la autorización real es del backend).
 */
export default [
  {
    path: '/customers',
    name: 'customers',
    component: () => import('../pages/CustomersListPage.vue'),
    // La pantalla tiene dos listados; basta con poder ver personas. La pestaña
    // de empresas solo aparece con `companies.view` (se comprueba en el módulo).
    meta: { requiresAuth: true, permission: 'persons.view' },
  },
]
