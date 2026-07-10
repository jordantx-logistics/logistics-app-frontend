export type Column = {
  key: string
  label: string
  sortable?: boolean
}

export type DataTableProps = {
  columns: Column[]
  data: Record<string, unknown>[]
  search?: boolean
  searchable?: boolean
  pagination?: boolean
  perPage?: number
  currentPage?: number
}
