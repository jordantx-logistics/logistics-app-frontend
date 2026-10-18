export default [
  {
    path: '/customers',
    name: 'customers',
    component: () => import('./index.vue'),
    // La pantalla tiene dos listados; basta con poder ver personas. La pestaña
    // de empresas solo aparece con `companies.view` (se comprueba en el módulo).
    meta: { requiresAuth: true, permission: 'persons.view' },
  },
]
