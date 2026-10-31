import { formatText } from '@/core/utils/format'

type BadgeVariant = 'success' | 'warning' | 'danger' | 'neutral'

/** Presentación común de las pantallas de Flota. */

export const ROUTE_STATUS_VARIANTS: Record<string, BadgeVariant> = {
  planned: 'neutral',
  assigned: 'warning',
  in_progress: 'warning',
  finished: 'success',
  cancelled: 'danger',
}

export const VEHICLE_STATUS_VARIANTS: Record<string, BadgeVariant> = {
  available: 'success',
  on_route: 'warning',
  maintenance: 'danger',
  inactive: 'neutral',
}

export const DRIVER_STATUS_VARIANTS: Record<string, BadgeVariant> = {
  active: 'success',
  inactive: 'neutral',
  suspended: 'danger',
}

export const EXPENSE_STATUS_VARIANTS: Record<string, BadgeVariant> = {
  registered: 'warning',
  liquidated: 'success',
  rejected: 'danger',
}

export const EXPENSE_TYPE_LABELS: Record<string, string> = {
  per_diem: 'Per diem',
  fuel: 'Fuel',
}

export function money(value: unknown): string {
  const numeric = Number(value)

  return value !== null && value !== '' && Number.isFinite(numeric)
    ? `S/ ${numeric.toFixed(2)}`
    : formatText(value)
}

export function km(value: unknown): string {
  const numeric = Number(value)

  return value !== null && value !== '' && Number.isFinite(numeric)
    ? `${numeric.toLocaleString(undefined, { maximumFractionDigits: 2 })} km`
    : formatText(value)
}

/** `in_progress` → `in progress`. */
export function label(value: unknown): string {
  return formatText(value).replace(/_/g, ' ')
}

/**
 * Fecha sin hora (`2030-12-31`). `new Date()` la interpreta como UTC y, en Lima, la
 * pintaría un día antes; una vigencia de licencia no puede bailar con la zona horaria.
 */
export function dateOnly(value: unknown): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value ?? ''))

  if (match === null) {
    return formatText(value)
  }

  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])).toLocaleDateString()
}

/** Fecha y hora cortas: una salida planificada sin hora no sirve para operar. */
export function dateTime(value: unknown): string {
  if (value === null || value === undefined || value === '') {
    return formatText(value)
  }

  const date = new Date(String(value))

  return Number.isNaN(date.getTime())
    ? formatText(value)
    : date.toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })
}
