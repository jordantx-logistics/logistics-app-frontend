import { http } from '@/core/api/client'
import { API_BASE_PATH } from '@/core/api/config'

import type {
  AssignRoutePayload,
  AssignRouteResponse,
  AttachReceiptResponse,
  CancelRouteResponse,
  CompleteSegmentResponse,
  CorrectOdometerPayload,
  CorrectOdometerResponse,
  CreateDriverPayload,
  CreateDriverResponse,
  CreateRoutePayload,
  CreateRouteResponse,
  CreateVehiclePayload,
  CreateVehicleResponse,
  Driver,
  DriversQuery,
  Expense,
  ExpensesQuery,
  FinishRoutePayload,
  FinishRouteResponse,
  FleetRoute,
  LiquidateExpensesPayload,
  LiquidateExpensesResponse,
  Page,
  RegisterExpenseInput,
  RegisterExpenseResponse,
  RegisterMileageInput,
  RegisterMileageResponse,
  RouteDetail,
  RoutesQuery,
  RouteSummary,
  RouteSummaryResponse,
  ShowRouteResponse,
  StartRoutePayload,
  StartRouteResponse,
  UpdateDriverPayload,
  UpdateDriverResponse,
  UpdateVehicleStatusResponse,
  Vehicle,
  VehiclesQuery,
} from '../types/fleet.types'

/** Choferes, vehículos, rutas troncales y gastos (`src/Fleet`). */

const BASE = `${API_BASE_PATH}/fleet`

interface PaginatedResponse {
  data?: unknown[]
  meta?: { current_page?: number; last_page?: number; per_page?: number; total?: number }
}

function toPage<T>(body: PaginatedResponse): Page<T> {
  return {
    rows: (body.data ?? []) as T[],
    meta: {
      current_page: body.meta?.current_page ?? 1,
      last_page: body.meta?.last_page ?? 1,
      per_page: body.meta?.per_page ?? 15,
      total: body.meta?.total ?? 0,
    },
  }
}

/** `multipart/form-data` sin los campos vacíos: el backend los validaría como enviados. */
function toFormData(fields: object): FormData {
  const form = new FormData()

  for (const [key, value] of Object.entries(fields)) {
    if (value !== null && value !== undefined && value !== '') {
      form.append(key, value instanceof File ? value : String(value))
    }
  }

  return form
}

/* Choferes */

export async function listDrivers(query: DriversQuery = {}): Promise<Page<Driver>> {
  const { data } = await http.get<PaginatedResponse>(`${BASE}/drivers`, { params: query })

  return toPage<Driver>(data)
}

export async function createDriver(payload: CreateDriverPayload): Promise<CreateDriverResponse> {
  const { data } = await http.post<CreateDriverResponse>(`${BASE}/drivers`, payload)

  return data
}

export async function updateDriver(
  id: number,
  payload: UpdateDriverPayload,
): Promise<UpdateDriverResponse> {
  const { data } = await http.patch<UpdateDriverResponse>(`${BASE}/drivers/${id}`, payload)

  return data
}

/* Vehículos */

export async function listVehicles(query: VehiclesQuery = {}): Promise<Page<Vehicle>> {
  const { data } = await http.get<PaginatedResponse>(`${BASE}/vehicles`, { params: query })

  return toPage<Vehicle>(data)
}

export async function createVehicle(payload: CreateVehiclePayload): Promise<CreateVehicleResponse> {
  const { data } = await http.post<CreateVehicleResponse>(`${BASE}/vehicles`, payload)

  return data
}

export async function updateVehicleStatus(
  id: number,
  status: string,
): Promise<UpdateVehicleStatusResponse> {
  const { data } = await http.patch<UpdateVehicleStatusResponse>(`${BASE}/vehicles/${id}/status`, {
    status,
  })

  return data
}

export async function correctOdometer(
  id: number,
  payload: CorrectOdometerPayload,
): Promise<CorrectOdometerResponse> {
  const { data } = await http.post<CorrectOdometerResponse>(
    `${BASE}/vehicles/${id}/odometer-correction`,
    payload,
  )

  return data
}

/* Rutas */

export async function listRoutes(query: RoutesQuery = {}): Promise<Page<FleetRoute>> {
  const { data } = await http.get<PaginatedResponse>(`${BASE}/routes`, { params: query })

  return toPage<FleetRoute>(data)
}

export async function getRoute(id: number): Promise<RouteDetail> {
  const { data } = await http.get<ShowRouteResponse>(`${BASE}/routes/${id}`)

  return data.data as unknown as RouteDetail
}

export async function getRouteSummary(id: number): Promise<RouteSummary> {
  const { data } = await http.get<RouteSummaryResponse>(`${BASE}/routes/${id}/summary`)

  return data.data as RouteSummary
}

export async function createRoute(payload: CreateRoutePayload): Promise<CreateRouteResponse> {
  const { data } = await http.post<CreateRouteResponse>(`${BASE}/routes`, payload)

  return data
}

export async function assignRoute(
  id: number,
  payload: AssignRoutePayload,
): Promise<AssignRouteResponse> {
  const { data } = await http.post<AssignRouteResponse>(`${BASE}/routes/${id}/assign`, payload)

  return data
}

export async function cancelRoute(id: number, reason: string): Promise<CancelRouteResponse> {
  const { data } = await http.post<CancelRouteResponse>(`${BASE}/routes/${id}/cancel`, { reason })

  return data
}

export async function startRoute(
  id: number,
  payload: StartRoutePayload,
): Promise<StartRouteResponse> {
  const { data } = await http.post<StartRouteResponse>(`${BASE}/routes/${id}/start`, payload)

  return data
}

export async function finishRoute(
  id: number,
  payload: FinishRoutePayload,
): Promise<FinishRouteResponse> {
  const { data } = await http.post<FinishRouteResponse>(`${BASE}/routes/${id}/finish`, payload)

  return data
}

export async function completeSegment(
  routeId: number,
  segmentId: number,
): Promise<CompleteSegmentResponse> {
  const { data } = await http.post<CompleteSegmentResponse>(
    `${BASE}/routes/${routeId}/segments/${segmentId}/complete`,
  )

  return data
}

export async function registerMileage(
  routeId: number,
  input: RegisterMileageInput,
): Promise<RegisterMileageResponse> {
  const { data } = await http.post<RegisterMileageResponse>(
    `${BASE}/routes/${routeId}/mileage`,
    toFormData(input),
  )

  return data
}

export async function downloadMileagePhoto(routeId: number, logId: number): Promise<Blob> {
  const { data } = await http.get<Blob>(`${BASE}/routes/${routeId}/mileage/${logId}/photo`, {
    responseType: 'blob',
  })

  return data
}

/* Gastos */

export async function listExpenses(query: ExpensesQuery = {}): Promise<Page<Expense>> {
  const { data } = await http.get<PaginatedResponse>(`${BASE}/expenses`, { params: query })

  return toPage<Expense>(data)
}

export async function registerExpense(
  input: RegisterExpenseInput,
): Promise<RegisterExpenseResponse> {
  const { data } = await http.post<RegisterExpenseResponse>(`${BASE}/expenses`, toFormData(input))

  return data
}

export async function attachReceipt(id: number, receipt: File): Promise<AttachReceiptResponse> {
  const { data } = await http.post<AttachReceiptResponse>(
    `${BASE}/expenses/${id}/receipt`,
    toFormData({ receipt }),
  )

  return data
}

export async function liquidateExpenses(
  payload: LiquidateExpensesPayload,
): Promise<LiquidateExpensesResponse> {
  const { data } = await http.post<LiquidateExpensesResponse>(`${BASE}/expenses/liquidate`, payload)

  return data
}

export async function downloadReceipt(id: number): Promise<Blob> {
  const { data } = await http.get<Blob>(`${BASE}/expenses/${id}/receipt`, { responseType: 'blob' })

  return data
}
