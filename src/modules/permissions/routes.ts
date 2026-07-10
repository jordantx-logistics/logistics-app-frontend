export default [
  {
    path: '/permissions',
    name: 'permissions',
    component: () => import('./index.vue'),
    meta: { requiresAuth: true },
  },
]
