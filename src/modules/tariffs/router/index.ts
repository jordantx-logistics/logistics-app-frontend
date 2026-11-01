/** Rutas del módulo **tariffs**: el backend exige el permiso también para leer. */
export default [
  {
    path: '/tariffs',
    name: 'tariffs',
    component: () => import('../pages/TariffsListPage.vue'),
    meta: { requiresAuth: true, permission: 'tariffs.manage' },
  },
  {
    path: '/zones',
    name: 'zones',
    component: () => import('../pages/ZonesPage.vue'),
    meta: { requiresAuth: true, permission: 'locations.manage' },
  },
]
