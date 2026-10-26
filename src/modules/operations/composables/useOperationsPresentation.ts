import type { Column } from '@/core/components/types'

/**
 * Presentación compartida de Operaciones: estados, fechas y columnas.
 *
 * El backend devuelve los estados en `snake_case`; la interfaz los pinta en
 * inglés y con el color de su grupo (en curso, cerrado, incidencia). Es solo
 * presentación: la verdad del estado la tiene el backend.
 */

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

const STATUS_VARIANTS: Record<string, BadgeVariant> = {
  created: 'neutral',
  received: 'info',
  embarked: 'info',
  in_transit: 'info',
  disembarked: 'info',
  out_for_delivery: 'warning',
  delivery_failed: 'danger',
  delivered: 'success',
  returned: 'danger',
  cancelled: 'neutral',
  assigned: 'neutral',
  in_progress: 'warning',
  failed: 'danger',
  open: 'warning',
  finished: 'success',
}

/** Color del badge de un estado (envío, entrega o conteo). */
export function statusVariant(status: string): BadgeVariant {
  return STATUS_VARIANTS[status] ?? 'neutral'
}

/** `out_for_delivery` → `Out for delivery`. */
export function humanizeStatus(status: string): string {
  const text = status.replaceAll('_', ' ')

  return text.charAt(0).toUpperCase() + text.slice(1)
}

/** Fecha y hora local; el contrato manda ISO 8601. */
export function formatDateTime(value: unknown): string {
  if (value === null || value === undefined || value === '') {
    return '—'
  }

  const date = new Date(String(value))

  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString()
}

/** `meta` del evento: se pinta como JSON compacto, no como `[object Object]`. */
export function formatMeta(value: unknown): string {
  if (value === null || value === undefined || value === '') {
    return ''
  }

  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

/** Columnas del listado de envíos. */
export const SHIPMENT_COLUMNS: Column[] = [
  { key: 'ticket_number', label: 'Ticket' },
  { key: 'ticket_code', label: 'Code' },
  { key: 'status', label: 'Status' },
  { key: 'origin_agency_id', label: 'Origin' },
  { key: 'destination_agency_id', label: 'Destination' },
  { key: 'current_location_agency_id', label: 'Location' },
  { key: 'updated_at', label: 'Updated' },
]

/** Columnas del listado de recepciones. */
export const RECEPTION_COLUMNS: Column[] = [
  { key: 'id', label: '#' },
  { key: 'agency_id', label: 'Agency' },
  { key: 'items_count', label: 'Parcels' },
  { key: 'received_by', label: 'Received by' },
  { key: 'received_at', label: 'Received' },
]

/** Columnas del listado de manifiestos. */
export const EMBARK_COLUMNS: Column[] = [
  { key: 'id', label: '#' },
  { key: 'route_ref', label: 'Route' },
  { key: 'agency_id', label: 'Agency' },
  { key: 'vehicle_id', label: 'Vehicle' },
  { key: 'driver_id', label: 'Driver' },
  { key: 'items_count', label: 'Parcels' },
  { key: 'departed_at', label: 'Departed' },
  { key: 'actions', label: '' },
]

/** Columnas del listado de conteos. */
export const INVENTORY_COLUMNS: Column[] = [
  { key: 'id', label: '#' },
  { key: 'agency_id', label: 'Agency' },
  { key: 'status', label: 'Status' },
  { key: 'items_count', label: 'Lines' },
  { key: 'counted_by', label: 'Counted by' },
  { key: 'finished_at', label: 'Finished' },
  { key: 'actions', label: '' },
]

/** Columnas del listado de entregas. */
export const DELIVERY_COLUMNS: Column[] = [
  { key: 'id', label: '#' },
  { key: 'ticket_code', label: 'Code' },
  { key: 'status', label: 'Status' },
  { key: 'courier_id', label: 'Courier' },
  { key: 'attempt', label: 'Attempt' },
  { key: 'agency_id', label: 'Agency' },
  { key: 'delivered_at', label: 'Delivered' },
  { key: 'actions', label: '' },
]
