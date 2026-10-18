export default [
  {
    path: '/auth/login',
    name: 'login',
    component: () => import('./pages/Login.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/auth/forgot-password',
    name: 'forgotPassword',
    component: () => import('./pages/ForgotPassword.vue'),
    meta: { requiresAuth: false },
  },
  {
    // El enlace del correo apunta a `<FRONTEND_URL>/reset-password?token=…&email=…`
    // (`ResetPassword::createUrlUsing` en el backend), así que la ruta canónica
    // cuelga de la raíz, no de `/auth`.
    path: '/reset-password',
    name: 'resetPassword',
    component: () => import('./pages/ResetPassword.vue'),
    meta: { requiresAuth: false },
  },
  {
    // Compatibilidad: la ruta también existe bajo `/auth/…`, como el resto de
    // las pantallas de sesión (enlaces antiguos, o si el backend cambia).
    path: '/auth/reset-password',
    redirect: { name: 'resetPassword' },
  },
]
