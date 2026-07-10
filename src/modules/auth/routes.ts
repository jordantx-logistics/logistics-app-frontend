export default [
  {
    path: '/auth/login',
    name: 'login',
    component: () => import('./pages/Login.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/auth/register',
    name: 'register',
    component: () => import('./pages/Register.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/auth/forgot-password',
    name: 'forgotPassword',
    component: () => import('./pages/ForgotPassword.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/auth/reset-password',
    name: 'resetPassword',
    component: () => import('./pages/ResetPassword.vue'),
    meta: { requiresAuth: false },
  },
]
