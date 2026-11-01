/** Etiquetas y variantes de las incidencias, sin lógica de negocio. */

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

export const INCIDENT_TYPES: Record<string, string> = {
  damage: 'Damage',
  loss: 'Loss',
  delay: 'Delay',
  billing: 'Billing',
  other: 'Other',
}

export const INCIDENT_PRIORITIES: Record<string, string> = {
  low: 'Low',
  normal: 'Normal',
  high: 'High',
  urgent: 'Urgent',
}

export const INCIDENT_STATUSES: Record<string, string> = {
  open: 'Open',
  in_progress: 'In progress',
  resolved: 'Resolved',
  closed: 'Closed',
}

const STATUS_VARIANTS: Record<string, BadgeVariant> = {
  open: 'warning',
  in_progress: 'info',
  resolved: 'success',
  closed: 'neutral',
}

export function incidentStatusVariant(status: string): BadgeVariant {
  return STATUS_VARIANTS[status] ?? 'neutral'
}

/** Qué acciones admite cada estado. La regla real está en el backend. */
export function availableActions(status: string): {
  assign: boolean
  start: boolean
  resolve: boolean
  close: boolean
  reopen: boolean
} {
  return {
    assign: status !== 'closed',
    start: status === 'open',
    resolve: status === 'in_progress',
    close: status === 'resolved',
    reopen: status === 'resolved',
  }
}
