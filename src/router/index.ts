import { createRouter, createWebHistory } from 'vue-router'

import { authGuard } from './guard'

// Import all module routes
import authRoutes from '@/modules/auth/routes'
import dashboardRoutes from '@/modules/dashboard/routes'
import ordersRoutes from '@/modules/orders/routes'
import paymentsRoutes from '@/modules/payments/routes'
import customersRoutes from '@/modules/customers/routes'
import agenciesRoutes from '@/modules/agencies/routes'
import permissionsRoutes from '@/modules/permissions/routes'
import settingsRoutes from '@/modules/settings/routes'

// Aggregate all routes
const routes = [
  // `/` no tiene pantalla propia: entra por el dashboard (que exige sesión).
  { path: '/', redirect: { name: 'dashboard' } },
  ...authRoutes,
  ...dashboardRoutes,
  ...ordersRoutes,
  ...paymentsRoutes,
  ...customersRoutes,
  ...agenciesRoutes,
  ...permissionsRoutes,
  ...settingsRoutes,
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Sesión, login y permisos: ver `src/router/guard.ts`.
router.beforeEach(authGuard)

export default router
