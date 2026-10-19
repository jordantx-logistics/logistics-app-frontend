/**
 * Rutas del módulo **orders**.
 *
 * El router central (`src/router/index.ts`) las descubre por convención con
 * `import.meta.glob('modules/<dominio>/router/index.ts')`: no hay registro a mano.
 * Han de ir por **nombre** (no por path) y con `meta.permission` que el guard
 * usa solo como presentación (la autorización real es del backend).
 */
export default [
  {
    path: '/orders',
    name: 'orders',
    component: () => import('../pages/OrdersListPage.vue'),
    // El backend exige `orders.view` en `GET /logistics/orders`; el guard solo
    // evita mandar a una pantalla que respondería 403 (es presentación).
    meta: { requiresAuth: true, permission: 'orders.view' },
  },
]
