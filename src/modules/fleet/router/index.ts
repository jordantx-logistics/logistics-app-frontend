/**
 * Rutas del módulo **fleet**.
 *
 * Los supervisores asignan rutas sin administrar la flota: ven choferes y
 * vehículos desde el formulario de asignación, no desde estas pantallas.
 */
export default [
  {
    path: '/fleet/routes',
    name: 'fleet-routes',
    component: () => import('../pages/FleetRoutesPage.vue'),
    meta: { requiresAuth: true, permission: 'routes.view' },
  },
  {
    path: '/fleet/expenses',
    name: 'fleet-expenses',
    component: () => import('../pages/FleetExpensesPage.vue'),
    meta: { requiresAuth: true, permission: 'routes.view' },
  },
  {
    path: '/fleet/drivers',
    name: 'fleet-drivers',
    component: () => import('../pages/FleetDriversPage.vue'),
    meta: { requiresAuth: true, permission: 'fleet.manage' },
  },
  {
    path: '/fleet/vehicles',
    name: 'fleet-vehicles',
    component: () => import('../pages/FleetVehiclesPage.vue'),
    meta: { requiresAuth: true, permission: 'fleet.manage' },
  },
]
