import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { useAuth } from '@/core/composables/useAuth'
import type { Column } from '@/core/components/types'

import { useOrdersStore } from '../stores/useOrdersStore'

/**
 * Lógica de la pantalla de órdenes: columnas, variantes de estado y lecturas
 * del listado server-side. El estado (`page`, datos del API) vive en
 * `stores/useOrdersStore.ts`.
 */

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

const STATUS_VARIANTS: Record<string, BadgeVariant> = {
  pending: 'warning',
  confirmed: 'info',
  in_transit: 'info',
  delivered: 'success',
  cancelled: 'danger',
}

export function statusVariant(status: string): BadgeVariant {
  return STATUS_VARIANTS[status] ?? 'neutral'
}

export function useOrdersTable() {
  const store = useOrdersStore()
  const router = useRouter()
  const { can } = useAuth()

  const meta = computed(() => store.orders.data?.meta)
  const rows = computed(() => store.orders.data?.data ?? [])
  const canCreate = computed(() => can('orders.create'))

  const columns: Column[] = [
    { key: 'ticket_number', label: 'Ticket' },
    { key: 'status', label: 'Status' },
    { key: 'weight_kg', label: 'Weight (kg)' },
    { key: 'total_amount', label: 'Amount' },
    { key: 'origin_agency_id', label: 'Origin' },
    { key: 'destination_agency_id', label: 'Destination' },
    { key: 'created_at', label: 'Created' },
    { key: 'actions', label: '' },
  ]

  function openOrder(id: unknown): void {
    void router.push({ name: 'order-detail', params: { id: String(id) } })
  }

  return {
    PER_PAGE: store.PER_PAGE,
    store,
    orders: store.orders,
    goToPage: store.goToPage,
    meta,
    rows,
    canCreate,
    columns,
    statusVariant,
    openOrder,
  }
}
