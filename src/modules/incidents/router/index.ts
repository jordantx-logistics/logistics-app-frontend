/** Rutas del módulo **incidents**. */
export default [
  {
    path: '/incidents',
    name: 'incidents',
    component: () => import('../pages/IncidentsListPage.vue'),
    meta: { requiresAuth: true, permission: 'incidents.view' },
  },
]
