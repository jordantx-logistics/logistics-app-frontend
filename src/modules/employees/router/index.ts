/**
 * Rutas del módulo **employees**.
 *
 * El router central las descubre por convención (`import.meta.glob`); van por
 * **nombre** y con `meta.permission`, que el guard usa solo como presentación.
 */
export default [
  {
    path: '/employees',
    name: 'employees',
    component: () => import('../pages/EmployeesListPage.vue'),
    meta: { requiresAuth: true, permission: 'employees.manage' },
  },
]
