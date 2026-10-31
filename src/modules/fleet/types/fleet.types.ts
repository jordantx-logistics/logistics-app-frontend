import type { QueryOf, RequestOf, ResponseOf } from '@/core/api/types'

/**
 * Tipos del módulo **fleet**, derivados del contrato OpenAPI (ADR-0008).
 *
 * Los envíos con archivo (`*Input`) se escriben aquí porque viajan como
 * `multipart/form-data`: el `File` del navegador no existe en el contrato.
 */

/* Choferes */

export type ListDriversResponse = ResponseOf<'/api/v1/fleet/drivers', 'get'>

export type Driver = Required<NonNullable<ListDriversResponse['data']>[number]>

export type DriversQuery = NonNullable<QueryOf<'/api/v1/fleet/drivers', 'get'>> & { page?: number }

export type CreateDriverPayload = RequestOf<'/api/v1/fleet/drivers', 'post'>

export type CreateDriverResponse = ResponseOf<'/api/v1/fleet/drivers', 'post'>

/** Scribe marca el cuerpo del PATCH como opcional, así que `RequestOf` no lo extrae. */
export interface UpdateDriverPayload {
  license_number?: string
  license_category?: string
  license_expires_at?: string
  phone?: string | null
  status?: string
}

export type UpdateDriverResponse = ResponseOf<'/api/v1/fleet/drivers/{driver}', 'patch'>

/* Vehículos */

export type ListVehiclesResponse = ResponseOf<'/api/v1/fleet/vehicles', 'get'>

export type Vehicle = Required<NonNullable<ListVehiclesResponse['data']>[number]>

export type VehiclesQuery = NonNullable<QueryOf<'/api/v1/fleet/vehicles', 'get'>> & {
  page?: number
}

export type CreateVehiclePayload = RequestOf<'/api/v1/fleet/vehicles', 'post'>

export type CreateVehicleResponse = ResponseOf<'/api/v1/fleet/vehicles', 'post'>

export type UpdateVehicleStatusResponse = ResponseOf<
  '/api/v1/fleet/vehicles/{vehicle}/status',
  'patch'
>

export type CorrectOdometerPayload = RequestOf<
  '/api/v1/fleet/vehicles/{vehicle}/odometer-correction',
  'post'
>

export type CorrectOdometerResponse = ResponseOf<
  '/api/v1/fleet/vehicles/{vehicle}/odometer-correction',
  'post'
>

/* Rutas */

export type ListRoutesResponse = ResponseOf<'/api/v1/fleet/routes', 'get'>

export type FleetRoute = Required<NonNullable<ListRoutesResponse['data']>[number]>

export type RoutesQuery = NonNullable<QueryOf<'/api/v1/fleet/routes', 'get'>> & { page?: number }

export type CreateRoutePayload = RequestOf<'/api/v1/fleet/routes', 'post'>

export type CreateRouteResponse = ResponseOf<'/api/v1/fleet/routes', 'post'>

export type ShowRouteResponse = ResponseOf<'/api/v1/fleet/routes/{route}', 'get'>

/** El detalle añade tramos y lecturas: se describen aquí porque Scribe los emite sin forma. */
export interface RouteSegment {
  id: number
  route_id: number
  sequence: number
  from_agency_id: number
  to_agency_id: number
  distance_km: string
  status: 'pending' | 'completed'
  completed_at: string | null
}

export interface MileageLog {
  id: number
  route_id: number
  vehicle_id: number
  odometer_km: string
  recorded_at: string | null
  recorded_by: number
  has_photo: boolean
}

export type RouteDetail = Omit<FleetRoute, 'segments' | 'mileage_logs'> & {
  segments: RouteSegment[]
  mileage_logs: MileageLog[]
}

export type RouteSummaryResponse = ResponseOf<'/api/v1/fleet/routes/{route}/summary', 'get'>

export type RouteSummary = Required<NonNullable<RouteSummaryResponse['data']>>

export type AssignRoutePayload = RequestOf<'/api/v1/fleet/routes/{route}/assign', 'post'>

export type AssignRouteResponse = ResponseOf<'/api/v1/fleet/routes/{route}/assign', 'post'>

export type CancelRouteResponse = ResponseOf<'/api/v1/fleet/routes/{route}/cancel', 'post'>

export type StartRoutePayload = RequestOf<'/api/v1/fleet/routes/{route}/start', 'post'>

export type StartRouteResponse = ResponseOf<'/api/v1/fleet/routes/{route}/start', 'post'>

export type FinishRoutePayload = RequestOf<'/api/v1/fleet/routes/{route}/finish', 'post'>

export type FinishRouteResponse = ResponseOf<'/api/v1/fleet/routes/{route}/finish', 'post'>

export type CompleteSegmentResponse = ResponseOf<
  '/api/v1/fleet/routes/{route}/segments/{segment}/complete',
  'post'
>

export interface RegisterMileageInput {
  odometer_km: number
  photo?: File | null
  idempotency_key?: string
}

export type RegisterMileageResponse = ResponseOf<'/api/v1/fleet/routes/{route}/mileage', 'post'>

/* Gastos */

export type ListExpensesResponse = ResponseOf<'/api/v1/fleet/expenses', 'get'>

export type Expense = Required<NonNullable<ListExpensesResponse['data']>[number]>

export type ExpensesQuery = NonNullable<QueryOf<'/api/v1/fleet/expenses', 'get'>> & {
  page?: number
}

export interface RegisterExpenseInput {
  route_id: number
  type: 'per_diem' | 'fuel'
  amount: number
  liters?: number | null
  odometer_km?: number | null
  idempotency_key?: string
  receipt?: File | null
}

export type RegisterExpenseResponse = ResponseOf<'/api/v1/fleet/expenses', 'post'>

export type AttachReceiptResponse = ResponseOf<'/api/v1/fleet/expenses/{expense}/receipt', 'post'>

export type LiquidateExpensesPayload = RequestOf<'/api/v1/fleet/expenses/liquidate', 'post'>

export type LiquidateExpensesResponse = ResponseOf<'/api/v1/fleet/expenses/liquidate', 'post'>

export interface PageMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface Page<T> {
  rows: T[]
  meta: PageMeta
}
