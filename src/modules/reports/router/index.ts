/** Rutas del módulo **reports**. */
export default [
  {
    path: '/reports',
    name: 'reports',
    component: () => import('../pages/ReportsPage.vue'),
    meta: { requiresAuth: true, permission: 'reports.view' },
  },
]
