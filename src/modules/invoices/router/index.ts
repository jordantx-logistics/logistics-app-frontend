/**
 * Rutas del módulo **invoices**.
 *
 * La pantalla lista comprobantes y series; ambas acciones se protegen con el
 * permiso de Finanzas correspondiente.
 */
export default [
  {
    path: '/finance/invoices',
    name: 'finance-invoices',
    component: () => import('../pages/InvoicesPage.vue'),
    meta: { requiresAuth: true, permission: 'invoices.view' },
  },
]
