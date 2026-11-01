import { useAuth } from '@/core/composables/useAuth'

interface Shortcut {
  label: string
  to: string
  permission: string
}

const SHORTCUTS: Shortcut[] = [
  { label: 'New order', to: '/orders/new', permission: 'orders.create' },
  { label: 'Collect a payment', to: '/finance/payments', permission: 'payments.create' },
  { label: 'Cash session', to: '/finance/cash', permission: 'cash.view' },
  { label: 'Track a parcel', to: '/operations/tracking', permission: 'tracking.view' },
  { label: 'Incidents', to: '/incidents', permission: 'incidents.view' },
  { label: 'Void requests', to: '/finance/credit-notes', permission: 'voids.approve' },
  { label: 'Fleet routes', to: '/fleet/routes', permission: 'routes.view' },
  { label: 'Tariffs', to: '/tariffs', permission: 'tariffs.manage' },
  { label: 'Users', to: '/users', permission: 'users.manage' },
  { label: 'Reports', to: '/reports', permission: 'reports.view' },
]

/** Accesos directos del rol: los mismos permisos que abren cada pantalla. */
export function useDashboardShortcuts(): Shortcut[] {
  const { can } = useAuth()

  return SHORTCUTS.filter((shortcut) => can(shortcut.permission))
}
