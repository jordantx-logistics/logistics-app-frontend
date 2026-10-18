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
