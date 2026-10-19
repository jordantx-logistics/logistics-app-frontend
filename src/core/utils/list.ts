/**
 * Filtro y troceado **en el cliente**.
 *
 * Solo vale para listados que llegan enteros (personas, empresas, agencias,
 * roles, permisos): el backend los devuelve sin paginar. El listado de órdenes
 * pagina en el servidor y no usa esto.
 */

/** ¿Alguno de los valores contiene el texto buscado? (sin distinguir mayúsculas) */
export function matchesQuery(
  values: Array<string | number | null | undefined>,
  query: string,
): boolean {
  const needle = query.trim().toLowerCase()

  if (needle === '') {
    return true
  }

  return values.some((value) =>
    String(value ?? '')
      .toLowerCase()
      .includes(needle),
  )
}

/** Página `page` (1-based) de un array, sin mutarlo. */
export function slicePage<Row>(rows: Row[], page: number, perPage: number): Row[] {
  const start = (page - 1) * perPage

  return rows.slice(start, start + perPage)
}

/** Número de páginas de `total` filas (mínimo una, para no pintar "0 de 0"). */
export function pageCount(total: number, perPage: number): number {
  return Math.max(1, Math.ceil(total / perPage))
}
