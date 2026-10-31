/**
 * Rutas del módulo **cash**.
 *
 * La pantalla cubre la sesión abierta, el historial y los cierres pendientes;
 * el permiso de entrada es `cash.view`, y las acciones se comprueban dentro.
 */
export default [
  {
    path: '/finance/cash',
    name: 'finance-cash',
    component: () => import('../pages/CashPage.vue'),
    meta: { requiresAuth: true, permission: 'cash.view' },
  },
]
