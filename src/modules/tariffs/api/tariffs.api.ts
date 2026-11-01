import { http } from '@/core/api/client'
import { API_BASE_PATH } from '@/core/api/config'

import type {
  Coverage,
  CoveragePayload,
  Location,
  LocationPayload,
  Page,
  Tariff,
  TariffPayload,
  Zone,
  ZonePayload,
} from '../types/tariffs.types'

/** Tarifarios, zonas, ubicaciones y coberturas (`src/Logistics` del backend). */

const BASE = `${API_BASE_PATH}/logistics`

interface PaginatedResponse<Row> {
  data?: Row[]
  meta?: Partial<Page<Row>['meta']>
}

async function fetchPage<Row>(path: string, params: Record<string, unknown>): Promise<Page<Row>> {
  const { data } = await http.get<PaginatedResponse<Row>>(`${BASE}/${path}`, { params })

  return {
    rows: data.data ?? [],
    meta: {
      current_page: data.meta?.current_page ?? 1,
      last_page: data.meta?.last_page ?? 1,
      per_page: data.meta?.per_page ?? 15,
      total: data.meta?.total ?? 0,
    },
  }
}

export function listTariffs(params: { page?: number; q?: string } = {}): Promise<Page<Tariff>> {
  return fetchPage<Tariff>('tariffs', { per_page: 15, ...params })
}

export async function createTariff(payload: TariffPayload): Promise<void> {
  await http.post(`${BASE}/tariffs`, payload)
}

export async function updateTariff(id: number, payload: TariffPayload): Promise<void> {
  await http.put(`${BASE}/tariffs/${id}`, payload)
}

export function listZones(): Promise<Page<Zone>> {
  return fetchPage<Zone>('zones', { per_page: 100 })
}

export async function createZone(payload: ZonePayload): Promise<void> {
  await http.post(`${BASE}/zones`, payload)
}

export function listLocations(params: { page?: number; q?: string } = {}): Promise<Page<Location>> {
  return fetchPage<Location>('locations', { per_page: 15, ...params })
}

export async function updateLocation(id: number, payload: LocationPayload): Promise<void> {
  await http.put(`${BASE}/locations/${id}`, payload)
}

export function listCoverages(params: { page?: number } = {}): Promise<Page<Coverage>> {
  return fetchPage<Coverage>('agency-coverages', { per_page: 15, ...params })
}

export async function createCoverage(payload: CoveragePayload): Promise<void> {
  await http.post(`${BASE}/agency-coverages`, payload)
}
