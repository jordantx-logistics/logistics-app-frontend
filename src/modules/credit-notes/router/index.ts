/**
 * Rutas del módulo **credit-notes**.
 *
 * La pantalla mezcla notas emitidas y solicitudes de anulación: la aprobación
 * de una anulación se atiende aquí con `voids.approve`.
 */
export default [
  {
    path: '/finance/credit-notes',
    name: 'finance-credit-notes',
    component: () => import('../pages/CreditNotesPage.vue'),
    meta: { requiresAuth: true, permission: 'credit-notes.view' },
  },
]
