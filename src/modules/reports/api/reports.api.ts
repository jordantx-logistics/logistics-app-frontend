import { http } from '@/core/api/client'
import { API_BASE_PATH } from '@/core/api/config'

import type {
  ListExportsResponse,
  ReportDefinition,
  ReportExport,
  RequestExportPayload,
  RequestExportResponse,
} from '../types/reports.types'

/** Exportaciones asíncronas de reportes (`src/Reporting` del backend). */

const BASE = `${API_BASE_PATH}/reports`

export async function listCatalog(): Promise<ReportDefinition[]> {
  const { data } = await http.get<{ data?: ReportDefinition[] }>(`${BASE}/catalog`)

  return data.data ?? []
}

export async function listExports(): Promise<ReportExport[]> {
  const { data } = await http.get<ListExportsResponse>(`${BASE}/exports`, {
    params: { per_page: 20 },
  })

  return (data.data ?? []) as ReportExport[]
}

export async function requestExport(payload: RequestExportPayload): Promise<ReportExport> {
  const { data } = await http.post<RequestExportResponse>(`${BASE}/exports`, payload)

  return data.data as ReportExport
}

export async function downloadExport(id: number): Promise<Blob> {
  const { data } = await http.get<Blob>(`${BASE}/exports/${id}/download`, { responseType: 'blob' })

  return data
}
