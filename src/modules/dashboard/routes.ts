export default [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('./index.vue'),
    meta: { requiresAuth: true },
  },
]
