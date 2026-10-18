import { http } from './client'
import { API_BASE_PATH } from './config'
import type {
  Agency,
  CreateAgencyPayload,
  CreateAgencyResponse,
  ListAgenciesResponse,
} from './types'

/** Agencias (`src/Organization` del backend). */

const AGENCIES_PATH = `${API_BASE_PATH}/organization/agencies`

/**
 * Agencias configuradas.
 *
 * Como en el resto de listados, las filas se declaran completas al salir de la
 * capa API: el contrato no marca `required` (ADR-0008).
 */
export async function listAgencies(): Promise<Agency[]> {
  const { data } = await http.get<ListAgenciesResponse>(AGENCIES_PATH)

  return (data.data ?? []) as Agency[]
}

/** Da de alta una agencia. Devuelve la fila creada. */
export async function createAgency(payload: CreateAgencyPayload): Promise<CreateAgencyResponse> {
  const { data } = await http.post<CreateAgencyResponse>(AGENCIES_PATH, payload)

  return data
}
