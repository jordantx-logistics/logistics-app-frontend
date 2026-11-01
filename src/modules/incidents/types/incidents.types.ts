import type { QueryOf, RequestOf, ResponseOf } from '@/core/api/types'

/** Tipos del módulo **incidents**, derivados del contrato OpenAPI (ADR-0008). */

export type ListIncidentsResponse = ResponseOf<'/api/v1/incidents', 'get'>

export type Incident = Required<NonNullable<ListIncidentsResponse['data']>[number]>

export type IncidentsPageMeta = Required<NonNullable<ListIncidentsResponse['meta']>>

export type IncidentsQuery = NonNullable<QueryOf<'/api/v1/incidents', 'get'>> & { page?: number }

export type OpenIncidentPayload = RequestOf<'/api/v1/incidents', 'post'>

export type OpenIncidentResponse = ResponseOf<'/api/v1/incidents', 'post'>

export type ShowIncidentResponse = ResponseOf<'/api/v1/incidents/{incident}', 'get'>

type AssigneesResponse = ResponseOf<'/api/v1/incidents/{incident}/assignees', 'get'>

export type IncidentAssignee = Required<NonNullable<AssigneesResponse['data']>[number]>

export interface IncidentsPage {
  rows: Incident[]
  meta: IncidentsPageMeta
}
