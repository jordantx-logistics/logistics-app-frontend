
export default [
  {
    path: '/settings',
    name: 'settings',
    component: () => import('./index.vue'),
    meta: { requiresAuth: true },
  },
]
