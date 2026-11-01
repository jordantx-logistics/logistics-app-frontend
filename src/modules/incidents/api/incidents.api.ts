import { http } from '@/core/api/client'
import { API_BASE_PATH } from '@/core/api/config'

import type {
  Incident,
  IncidentAssignee,
  IncidentsPage,
  IncidentsPageMeta,
  IncidentsQuery,
  ListIncidentsResponse,
  OpenIncidentPayload,
  OpenIncidentResponse,
  ShowIncidentResponse,
} from '../types/incidents.types'

/** Incidencias sobre órdenes (`src/Incident` del backend). */

const BASE = `${API_BASE_PATH}/incidents`

export type IncidentAction = 'start' | 'close' | 'reopen'

export async function listIncidents(query: IncidentsQuery = {}): Promise<IncidentsPage> {
  const { data } = await http.get<ListIncidentsResponse>(BASE, { params: query })

  return {
    rows: (data.data ?? []) as Incident[],
    meta: {
      current_page: data.meta?.current_page ?? 1,
      last_page: data.meta?.last_page ?? 1,
      per_page: data.meta?.per_page ?? 15,
      total: data.meta?.total ?? 0,
    } as IncidentsPageMeta,
  }
}

export async function openIncident(payload: OpenIncidentPayload): Promise<Incident> {
  const { data } = await http.post<OpenIncidentResponse>(BASE, payload)

  return data.data as Incident
}

export async function listAssignees(id: number): Promise<IncidentAssignee[]> {
  const { data } = await http.get<{ data?: IncidentAssignee[] }>(`${BASE}/${id}/assignees`)

  return data.data ?? []
}

export async function assignIncident(id: number, userId: number): Promise<Incident> {
  const { data } = await http.post<ShowIncidentResponse>(`${BASE}/${id}/assign`, {
    user_id: userId,
  })

  return data.data as Incident
}

export async function changeIncident(id: number, action: IncidentAction): Promise<Incident> {
  const { data } = await http.post<ShowIncidentResponse>(`${BASE}/${id}/${action}`)

  return data.data as Incident
}

export async function resolveIncident(id: number, note: string): Promise<Incident> {
  const { data } = await http.post<ShowIncidentResponse>(`${BASE}/${id}/resolve`, { note })

  return data.data as Incident
}
