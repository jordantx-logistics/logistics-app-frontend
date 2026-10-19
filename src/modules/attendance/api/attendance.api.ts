import { http } from '@/core/api/client'
import { API_BASE_PATH } from '@/core/api/config'
import type {
  Attendance,
  AttendanceDay,
  AttendanceStatus,
  ListAttendanceResponse,
  RegisterAttendancePayload,
  RegisterAttendanceResponse,
  AttendanceSummaryResponse,
} from '../types/attendance.types'

/** Marcaciones de RRHH (`src/Identity/Attendance` del backend). */

const ATTENDANCE_PATH = `${API_BASE_PATH}/identity/attendance`

/** Filtros del listado de marcaciones. */
export interface AttendanceListQuery {
  page?: number
  per_page?: number
  employee_id?: number
  agency_id?: number
  status?: AttendanceStatus
  /** Fecha ISO-8601 inferior (inclusive). */
  from?: string
  /** Fecha ISO-8601 superior (inclusive). */
  to?: string
}

/** `GET /identity/attendance` — página de marcaciones. */
export async function listAttendance(
  query: AttendanceListQuery = {},
): Promise<ListAttendanceResponse> {
  const { data } = await http.get<ListAttendanceResponse>(ATTENDANCE_PATH, { params: query })

  return data
}

/**
 * `GET /identity/attendance/summary` — consolidado diario por empleado.
 *
 * Este listado **no** pagina: el backend devuelve la colección entera.
 */
export async function attendanceSummary(query: {
  employee_id?: number
  from?: string
  to?: string
}): Promise<AttendanceDay[]> {
  const { data } = await http.get<AttendanceSummaryResponse>(`${ATTENDANCE_PATH}/summary`, {
    params: query,
  })

  return (data.data ?? []) as AttendanceDay[]
}

/**
 * Registra una marcación (UC-10/UC-11).
 *
 * Es idempotente por `idempotency_key`: el llamante debe **reutilizar** la misma
 * clave al reintentar (el formulario la genera una vez por intento).
 */
export async function registerAttendance(payload: RegisterAttendancePayload): Promise<Attendance> {
  const { data } = await http.post<RegisterAttendanceResponse>(ATTENDANCE_PATH, payload)

  return data.data as Attendance
}

/** Anula una marcación (RRHH). El consolidado del día se recalcula sin ella. */
export async function voidAttendance(id: number): Promise<void> {
  await http.post(`${ATTENDANCE_PATH}/${id}/void`)
}
