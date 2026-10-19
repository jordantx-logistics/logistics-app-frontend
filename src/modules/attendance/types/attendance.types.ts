import type { RequestOf, ResponseOf } from '@/core/api/types'

/** Tipos del módulo **attendance**, derivados del contrato OpenAPI (ADR-0008). */

/** `GET /api/v1/identity/attendance` — marcaciones paginadas. */
export type ListAttendanceResponse = ResponseOf<'/api/v1/identity/attendance', 'get'>

/** Marcación registrada. */
export type Attendance = Required<NonNullable<ListAttendanceResponse['data']>[number]>

/** `GET /api/v1/identity/attendance/summary` — consolidado diario por empleado. */
export type AttendanceSummaryResponse = ResponseOf<'/api/v1/identity/attendance/summary', 'get'>

/** Fila del consolidado (`attendance_days`). */
export type AttendanceDay = Required<NonNullable<AttendanceSummaryResponse['data']>[number]>

/** `POST /api/v1/identity/attendance` — marcación (UC-10/UC-11). */
export type RegisterAttendancePayload = RequestOf<'/api/v1/identity/attendance', 'post'>

/** Respuesta del alta de marcación. */
export type RegisterAttendanceResponse = ResponseOf<'/api/v1/identity/attendance', 'post'>

/** Tipo de marcación. */
export type AttendanceType = RegisterAttendancePayload['type']

/** Origen de la marcación. */
export type AttendanceSource = NonNullable<RegisterAttendancePayload['source']>

/** Estado de la marcación en el listado. */
export type AttendanceStatus = 'valid' | 'late' | 'duplicate' | 'voided'
