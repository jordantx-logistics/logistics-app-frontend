export default [
  {
    path: '/orders',
    name: 'orders',
    component: () => import('./index.vue'),
    // El backend exige `orders.view` en `GET /logistics/orders`; el guard solo
    // evita mandar a una pantalla que respondería 403 (es presentación).
    meta: { requiresAuth: true, permission: 'orders.view' },
  },
]
