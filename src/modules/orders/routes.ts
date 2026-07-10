export default [
  {
    path: '/orders',
    name: 'orders',
    component: () => import('./index.vue'),
    meta: { requiresAuth: true },
  },
]
