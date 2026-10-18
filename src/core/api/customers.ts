import { http } from './client'
import { API_BASE_PATH } from './config'
import type {
  Company,
  CreateCompanyPayload,
  CreateCompanyResponse,
  CreatePersonPayload,
  CreatePersonResponse,
  ListCompaniesResponse,
  ListPersonsResponse,
  Person,
} from './types'

/**
 * Clientes (`src/Customer` del backend): personas y empresas.
 *
 * Los listados devuelven el array completo, sin paginar (el backend aún no lo
 * hace para estos recursos), así que el filtro de la pantalla es local.
 */

const PERSONS_PATH = `${API_BASE_PATH}/customer/persons`
const COMPANIES_PATH = `${API_BASE_PATH}/customer/companies`

/**
 * Personas registradas.
 *
 * El contrato no marca `required` (Scribe no los emite), así que las filas se
 * declaran completas aquí, en el único punto donde se desenvuelve el sobre.
 */
export async function listPersons(): Promise<Person[]> {
  const { data } = await http.get<ListPersonsResponse>(PERSONS_PATH)

  return (data.data ?? []) as Person[]
}

/** Da de alta una persona. Devuelve la fila creada. */
export async function createPerson(payload: CreatePersonPayload): Promise<CreatePersonResponse> {
  const { data } = await http.post<CreatePersonResponse>(PERSONS_PATH, payload)

  return data
}

/** Clientes corporativos. */
export async function listCompanies(): Promise<Company[]> {
  const { data } = await http.get<ListCompaniesResponse>(COMPANIES_PATH)

  return (data.data ?? []) as Company[]
}

/** Da de alta una empresa. Devuelve la fila creada. */
export async function createCompany(payload: CreateCompanyPayload): Promise<CreateCompanyResponse> {
  const { data } = await http.post<CreateCompanyResponse>(COMPANIES_PATH, payload)

  return data
}
