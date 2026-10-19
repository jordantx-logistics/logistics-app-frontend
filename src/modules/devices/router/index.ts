/**
 * Rutas del módulo **devices**.
 *
 * El router central las descubre por convención (`import.meta.glob`); van por
 * **nombre** y con `meta.permission`, que el guard usa solo como presentación
 * (el backend exige `devices.manage` también para el listado).
 */
export default [
  {
    path: '/devices',
    name: 'devices',
    component: () => import('../pages/DevicesListPage.vue'),
    meta: { requiresAuth: true, permission: 'devices.manage' },
  },
]
