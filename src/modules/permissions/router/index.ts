/**
 * Rutas del módulo **permissions**.
 *
 * El router central (`src/router/index.ts`) las descubre por convención con
 * `import.meta.glob('modules/<dominio>/router/index.ts')`: no hay registro a mano.
 * Han de ir por **nombre** (no por path) y con `meta.permission` que el guard
 * usa solo como presentación (la autorización real es del backend).
 */
export default [
  {
    path: '/permissions',
    name: 'permissions',
    component: () => import('../pages/PermissionsListPage.vue'),
    // La pestaña de permisos solo aparece con `permissions.view` (se comprueba
    // en el módulo); para el listado de roles basta `roles.view`.
    meta: { requiresAuth: true, permission: 'roles.view' },
  },
]
