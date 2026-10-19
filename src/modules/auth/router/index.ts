/**
 * Rutas del módulo **auth**.
 *
 * El router central (`src/router/index.ts`) las descubre por convención con
 * `import.meta.glob('modules/<dominio>/router/index.ts')`: no hay registro a mano.
 * Todas son **públicas** (`requiresAuth: false`); si hay sesión y se visita
 * `login`, el guard manda al dashboard.
 */
export default [
  {
    path: '/auth/login',
    name: 'login',
    component: () => import('../pages/LoginPage.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/auth/forgot-password',
    name: 'forgotPassword',
    component: () => import('../pages/ForgotPasswordPage.vue'),
    meta: { requiresAuth: false },
  },
  {
    // El enlace del correo apunta a `<FRONTEND_URL>/auth/reset-password?token=...&email=...`
    // (`ResetPassword::createUrlUsing` en el backend), igual que el resto de
    // las pantallas de sesión.
    path: '/auth/reset-password',
    name: 'resetPassword',
    component: () => import('../pages/ResetPasswordPage.vue'),
    meta: { requiresAuth: false },
  },
  {
    // Compatibilidad: los correos de recuperación enviados antes del cambio
    // apuntaban a `/reset-password` (en la raíz, sin `/auth`). Queda de alias
    // hasta que esos enlaces expiren solos.
    path: '/reset-password',
    redirect: { name: 'resetPassword' },
  },
]
