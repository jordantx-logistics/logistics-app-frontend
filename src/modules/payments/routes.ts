export default [
  {
    path: '/payments',
    name: 'payments',
    component: () => import('./index.vue'),
    meta: { requiresAuth: true },
  },
]
