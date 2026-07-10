import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/core/composables/useAuth'

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

// Navigation guard for authentication
router.beforeEach((to) => {
  const { isAuthenticated } = useAuth()
  const requiresAuth = to.meta?.requiresAuth !== false

  if (requiresAuth && !isAuthenticated) {
    return { name: 'login' }
  }

  if (!requiresAuth && isAuthenticated && to.name === 'login') {
    return { name: 'dashboard' }
  }
})

export default router
