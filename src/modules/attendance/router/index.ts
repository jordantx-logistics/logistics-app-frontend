/**
 * Rutas del módulo **attendance**.
 *
 * El router central las descubre por convención (`import.meta.glob`); van por
 * **nombre** y con `meta.permission`, que el guard usa solo como presentación
 * (la distinción entre ver, marcar y anular la hace el backend por endpoint).
 */
export default [
  {
    path: '/attendance',
    name: 'attendance',
    component: () => import('../pages/AttendanceListPage.vue'),
    meta: { requiresAuth: true, permission: 'attendance.view' },
  },
]
