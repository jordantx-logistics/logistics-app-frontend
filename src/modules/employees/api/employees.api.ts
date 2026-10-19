import { http } from '@/core/api/client'
import { API_BASE_PATH } from '@/core/api/config'
import type {
  CreateEmployeePayload,
  CreateEmployeeResponse,
  Employee,
  EmployeeResponse,
  EmployeeStatus,
  ListEmployeesResponse,
  UpdateEmployeePayload,
} from '../types/employees.types'

/** Empleados de RRHH (`src/Identity/Employee` del backend). */

const EMPLOYEES_PATH = `${API_BASE_PATH}/identity/employees`

/** Filtros del listado: los aplica el backend (el listado pagina allí). */
export interface EmployeeListQuery {
  page?: number
  per_page?: number
  status?: EmployeeStatus
  agency_id?: number
  /** Busca por documento o nombre. */
  q?: string
}

/**
 * `GET /identity/employees` — página de empleados.
 *
 * Devuelve el sobre entero porque la pantalla necesita el `meta` del paginador.
 */
export async function listEmployees(query: EmployeeListQuery = {}): Promise<ListEmployeesResponse> {
  const { data } = await http.get<ListEmployeesResponse>(EMPLOYEES_PATH, { params: query })

  return data
}

/** Da de alta un empleado (UC-08). Devuelve la ficha creada. */
export async function createEmployee(payload: CreateEmployeePayload): Promise<Employee> {
  const { data } = await http.post<CreateEmployeeResponse>(EMPLOYEES_PATH, payload)

  return data.data as Employee
}

/** Edita la ficha de un empleado. */
export async function updateEmployee(
  id: number,
  payload: UpdateEmployeePayload,
): Promise<Employee> {
  const { data } = await http.put<EmployeeResponse>(`${EMPLOYEES_PATH}/${id}`, payload)

  return data.data as Employee
}

/** Da de baja al empleado (UC-09). */
export async function deactivateEmployee(id: number): Promise<void> {
  await http.delete(`${EMPLOYEES_PATH}/${id}`)
}
