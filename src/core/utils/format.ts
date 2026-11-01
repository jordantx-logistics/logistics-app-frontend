/** Valor que se pinta cuando el backend devuelve el campo vacío. */
export const EMPTY_VALUE = '—'

/**
 * Los formateadores aceptan `unknown` a propósito: en las tablas, la fila llega
 * del `slot` del `DataTable` (`Record<string, unknown>`), así que el dato es
 * `unknown` hasta que se pinta.
 */

/** Fecha corta en el idioma del navegador (`2026-10-18T21:07:28Z` → `18/10/2026`). */
export function formatDate(value: unknown): string {
  if (value === null || value === undefined || value === '') {
    return EMPTY_VALUE
  }

  const date = new Date(String(value))

  return Number.isNaN(date.getTime()) ? EMPTY_VALUE : date.toLocaleDateString()
}

/** Texto opcional: los campos `nullable` del contrato no se pintan vacíos. */
export function formatText(value: unknown): string {
  if (value === null || value === undefined || value === '') {
    return EMPTY_VALUE
  }

  return String(value)
}

/**
 * Fecha local en `YYYY-MM-DD`, desplazada `offsetDays`. `toISOString` daría el día UTC:
 * en Lima, desde las 19:00 ya sería mañana.
 */
export function localIsoDate(offsetDays = 0): string {
  const date = new Date()
  date.setDate(date.getDate() + offsetDays)

  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${date.getFullYear()}-${month}-${day}`
}
