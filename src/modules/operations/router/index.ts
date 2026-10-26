/**
 * Rutas del módulo **operations**.
 *
 * El router central las descubre por convención y aplica `meta.permission`
 * como presentación; la autorización real la hace el backend ruta a ruta. Los
 * nombres son estables porque la navegación usa `router.push({ name })`.
 */
export default [
  {
    path: '/operations',
    redirect: { name: 'operations-shipments' },
  },
  {
    path: '/operations/shipments',
    name: 'operations-shipments',
    component: () => import('../pages/OperationsShipmentsPage.vue'),
    meta: { requiresAuth: true, permission: 'shipments.view' },
  },
  {
    path: '/operations/reception',
    name: 'operations-reception',
    component: () => import('../pages/OperationsReceptionPage.vue'),
    meta: { requiresAuth: true, permission: 'shipments.receive' },
  },
  {
    path: '/operations/embarks',
    name: 'operations-embarks',
    component: () => import('../pages/OperationsEmbarksPage.vue'),
    meta: { requiresAuth: true, permission: 'shipments.view' },
  },
  {
    path: '/operations/inventory',
    name: 'operations-inventory',
    component: () => import('../pages/OperationsInventoryPage.vue'),
    meta: { requiresAuth: true, permission: 'inventory.manage' },
  },
  {
    path: '/operations/tracking',
    name: 'operations-tracking',
    component: () => import('../pages/OperationsTrackingPage.vue'),
    meta: { requiresAuth: true, permission: 'tracking.view' },
  },
  {
    path: '/operations/deliveries',
    name: 'operations-deliveries',
    component: () => import('../pages/OperationsDeliveriesPage.vue'),
    meta: { requiresAuth: true, permission: 'delivery.view' },
  },
]
