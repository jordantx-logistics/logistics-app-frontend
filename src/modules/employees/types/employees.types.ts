import type { RequestOf, ResponseOf } from '@/core/api/types'

/** Tipos del módulo **employees**, derivados del contrato OpenAPI (ADR-0008). */

/** `GET /api/v1/identity/employees` — listado paginado de empleados. */
export type ListEmployeesResponse = ResponseOf<'/api/v1/identity/employees', 'get'>

/** Fila de empleado (`full_name` lo compone el backend). */
export type Employee = Required<NonNullable<ListEmployeesResponse['data']>[number]>

/** Tipo de documento admitido por el alta. */
export type EmployeeDocumentType = 'DNI' | 'CE' | 'PASSPORT'

/** Estado laboral del empleado. */
export type EmployeeStatus = 'active' | 'on_leave' | 'terminated'

/** `POST /api/v1/identity/employees` — alta (UC-08). */
export type CreateEmployeePayload = RequestOf<'/api/v1/identity/employees', 'post'>

/** `PUT /api/v1/identity/employees/{id}` — edición. */
export type UpdateEmployeePayload = RequestOf<'/api/v1/identity/employees/{employee_id}', 'put'>

/** Respuesta con la ficha del empleado (edición). */
export type EmployeeResponse = ResponseOf<'/api/v1/identity/employees/{employee_id}', 'put'>

/** Respuesta del alta de empleado (201). */
export type CreateEmployeeResponse = ResponseOf<'/api/v1/identity/employees', 'post'>
