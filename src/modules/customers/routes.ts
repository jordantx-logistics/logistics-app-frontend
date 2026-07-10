export default [
  {
    path: '/customers',
    name: 'customers',
    component: () => import('./index.vue'),
    meta: { requiresAuth: true },
  },
]
