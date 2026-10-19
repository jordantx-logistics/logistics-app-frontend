/**
 * Rutas del módulo **users**.
 *
 * El router central las descubre por convención (`import.meta.glob`); van por
 * **nombre** y con `meta.permission`, que el guard usa solo como presentación.
 * La administración de usuarios es de alcance nacional: no hay filtro por
 * ámbito, solo el permiso.
 */
export default [
  {
    path: '/users',
    name: 'users',
    component: () => import('../pages/UsersListPage.vue'),
    meta: { requiresAuth: true, permission: 'users.manage' },
  },
]
