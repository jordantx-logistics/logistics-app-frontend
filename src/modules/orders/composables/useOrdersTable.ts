import { computed } from 'vue'

import { useAuth } from '@/core/composables/useAuth'
import type { Column } from '@/core/components/types'

import { useOrdersStore } from '../stores/useOrdersStore'

/**
 * Lógica de la pantalla de órdenes: columnas, variantes de estado y lecturas
 * del listado server-side. El estado (`page`, datos del API) vive en
 * `stores/useOrdersStore.ts`.
 */

export function useOrdersTable() {
  const store = useOrdersStore()
  const { can } = useAuth()

  const meta = computed(() => store.orders.data?.meta)
  const rows = computed(() => store.orders.data?.data ?? [])
  const canCreate = computed(() => can('orders.create'))

  const columns: Column[] = [
    { key: 'ticket_number', label: 'Ticket' },
    { key: 'status', label: 'Status' },
    { key: 'weight_kg', label: 'Weight (kg)' },
    { key: 'total_amount', label: 'Amount' },
    { key: 'sender_id', label: 'Sender' },
    { key: 'receiver_id', label: 'Receiver' },
    { key: 'origin_agency_id', label: 'Origin' },
    { key: 'destination_agency_id', label: 'Destination' },
    { key: 'created_at', label: 'Created' },
  ]

  type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

  const STATUS_VARIANTS: Record<string, BadgeVariant> = {
    pending: 'warning',
    in_transit: 'info',
    delivered: 'success',
    cancelled: 'danger',
    failed: 'danger',
  }

  function statusVariant(status: string): BadgeVariant {
    return STATUS_VARIANTS[status] ?? 'neutral'
  }

  return {
    PER_PAGE: store.PER_PAGE,
    orders: store.orders,
    page: store.page,
    goToPage: store.goToPage,
    meta,
    rows,
    canCreate,
    columns,
    statusVariant,
  }
}
