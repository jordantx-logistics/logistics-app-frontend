export default [
  {
    path: '/agencies',
    name: 'agencies',
    component: () => import('./index.vue'),
    meta: { requiresAuth: true, permission: 'agencies.view' },
  },
]
