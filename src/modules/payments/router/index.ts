/**
 * Rutas del módulo **payments**.
 *
 * El listado real vive bajo `/finance`, dentro del grupo Finance del sidebar.
 * `/payments` se conserva como redirección para no romper enlaces antiguos.
 */
export default [
  {
    path: '/payments',
    name: 'payments',
    redirect: '/finance/payments',
    meta: { requiresAuth: true },
  },
  {
    path: '/finance/payments',
    name: 'finance-payments',
    component: () => import('../pages/PaymentsListPage.vue'),
    meta: { requiresAuth: true, permission: 'payments.view' },
  },
  {
    path: '/finance/payments/:id',
    name: 'finance-payments-detail',
    component: () => import('../pages/PaymentDetailPage.vue'),
    meta: { requiresAuth: true, permission: 'payments.view' },
  },
]
