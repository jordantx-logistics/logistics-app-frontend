import { beforeEach, describe, expect, it, vi } from 'vitest'

import * as fleetApi from '@/modules/fleet/api'
import { dateOnly } from '@/modules/fleet/composables/useFleetPresentation'

/** Capa API de Flota: rutas del contrato, paginación y envíos con archivo. */

const { httpMock } = vi.hoisted(() => ({
  httpMock: {
    get: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
    post: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
    patch: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
  },
}))

vi.mock('@/core/api/client', () => ({ http: httpMock }))

beforeEach(() => {
  vi.clearAllMocks()
})

describe('listados', () => {
  it('desenvuelve el sobre paginado', async () => {
    httpMock.get.mockResolvedValue({
      data: {
        data: [{ id: 1, plate: 'ABC123' }],
        meta: { current_page: 2, last_page: 3, per_page: 15, total: 31 },
      },
    })

    const page = await fleetApi.listVehicles({ status: 'available' })

    expect(httpMock.get).toHaveBeenCalledWith('/api/v1/fleet/vehicles', {
      params: { status: 'available' },
    })
    expect(page.rows[0]?.plate).toBe('ABC123')
    expect(page.meta.total).toBe(31)
  })

  it('usa valores seguros si faltan datos o meta', async () => {
    httpMock.get.mockResolvedValue({ data: {} })

    const page = await fleetApi.listDrivers()

    expect(page.rows).toEqual([])
    expect(page.meta).toEqual({ current_page: 1, last_page: 1, per_page: 15, total: 0 })
  })
})

describe('rutas', () => {
  it('llama a cada acción de la ruta con su contrato', async () => {
    httpMock.post.mockResolvedValue({ data: { data: {} } })

    await fleetApi.assignRoute(7, { driver_id: 1, vehicle_id: 2 })
    expect(httpMock.post).toHaveBeenLastCalledWith('/api/v1/fleet/routes/7/assign', {
      driver_id: 1,
      vehicle_id: 2,
    })

    await fleetApi.startRoute(7, { odometer_km: 100 })
    expect(httpMock.post).toHaveBeenLastCalledWith('/api/v1/fleet/routes/7/start', {
      odometer_km: 100,
    })

    await fleetApi.completeSegment(7, 3)
    expect(httpMock.post).toHaveBeenLastCalledWith('/api/v1/fleet/routes/7/segments/3/complete')

    await fleetApi.finishRoute(7, { odometer_km: 200 })
    expect(httpMock.post).toHaveBeenLastCalledWith('/api/v1/fleet/routes/7/finish', {
      odometer_km: 200,
    })

    await fleetApi.cancelRoute(7, 'Breakdown')
    expect(httpMock.post).toHaveBeenLastCalledWith('/api/v1/fleet/routes/7/cancel', {
      reason: 'Breakdown',
    })
  })

  it('lee el detalle y el resumen', async () => {
    httpMock.get.mockResolvedValueOnce({ data: { data: { id: 7, segments: [] } } })
    httpMock.get.mockResolvedValueOnce({ data: { data: { route_id: 7, km_per_liter: 4 } } })

    expect((await fleetApi.getRoute(7)).id).toBe(7)
    expect((await fleetApi.getRouteSummary(7)).km_per_liter).toBe(4)
    expect(httpMock.get).toHaveBeenLastCalledWith('/api/v1/fleet/routes/7/summary')
  })
})

describe('envíos con archivo', () => {
  it('manda el gasto como multipart sin los campos vacíos', async () => {
    httpMock.post.mockResolvedValue({ data: { data: { id: 1 } } })
    const receipt = new File(['x'], 'receipt.jpg', { type: 'image/jpeg' })

    await fleetApi.registerExpense({
      route_id: 7,
      type: 'fuel',
      amount: 380,
      liters: 95,
      odometer_km: null,
      receipt,
    })

    const [url, body] = httpMock.post.mock.calls[0] as [string, FormData]

    expect(url).toBe('/api/v1/fleet/expenses')
    expect(body).toBeInstanceOf(FormData)
    expect(body.get('amount')).toBe('380')
    expect(body.get('liters')).toBe('95')
    expect(body.has('odometer_km')).toBe(false)
    expect((body.get('receipt') as File).name).toBe('receipt.jpg')
  })

  it('manda la lectura con foto y adjunta comprobantes', async () => {
    httpMock.post.mockResolvedValue({ data: { data: { id: 1 } } })
    const file = new File(['x'], 'photo.png', { type: 'image/png' })

    await fleetApi.registerMileage(7, { odometer_km: 150, photo: file, idempotency_key: 'k1' })
    let [url, body] = httpMock.post.mock.lastCall as [string, FormData]
    expect(url).toBe('/api/v1/fleet/routes/7/mileage')
    expect(body.get('idempotency_key')).toBe('k1')

    await fleetApi.attachReceipt(4, file)
    ;[url, body] = httpMock.post.mock.lastCall as [string, FormData]
    expect(url).toBe('/api/v1/fleet/expenses/4/receipt')
    expect((body.get('receipt') as File).name).toBe('photo.png')
  })

  it('descarga los archivos como blob', async () => {
    httpMock.get.mockResolvedValue({ data: new Blob(['x']) })

    await fleetApi.downloadReceipt(4)
    expect(httpMock.get).toHaveBeenLastCalledWith('/api/v1/fleet/expenses/4/receipt', {
      responseType: 'blob',
    })

    await fleetApi.downloadMileagePhoto(7, 2)
    expect(httpMock.get).toHaveBeenLastCalledWith('/api/v1/fleet/routes/7/mileage/2/photo', {
      responseType: 'blob',
    })
  })
})

describe('administración', () => {
  it('liquida, corrige el odómetro y cambia estados', async () => {
    httpMock.post.mockResolvedValue({ data: { data: [] } })
    httpMock.patch.mockResolvedValue({ data: { data: {} } })

    await fleetApi.liquidateExpenses({ expense_ids: [1], decision: 'liquidated' })
    expect(httpMock.post).toHaveBeenLastCalledWith('/api/v1/fleet/expenses/liquidate', {
      expense_ids: [1],
      decision: 'liquidated',
    })

    await fleetApi.correctOdometer(3, { odometer_km: 10, reason: 'Typo' })
    expect(httpMock.post).toHaveBeenLastCalledWith('/api/v1/fleet/vehicles/3/odometer-correction', {
      odometer_km: 10,
      reason: 'Typo',
    })

    await fleetApi.updateVehicleStatus(3, 'maintenance')
    expect(httpMock.patch).toHaveBeenLastCalledWith('/api/v1/fleet/vehicles/3/status', {
      status: 'maintenance',
    })

    await fleetApi.updateDriver(5, { status: 'suspended' })
    expect(httpMock.patch).toHaveBeenLastCalledWith('/api/v1/fleet/drivers/5', {
      status: 'suspended',
    })
  })
})

describe('presentación', () => {
  it('no corre una fecha sin hora por la zona horaria', () => {
    expect(dateOnly('2030-12-31')).toBe(new Date(2030, 11, 31).toLocaleDateString())
    expect(dateOnly(null)).toBe('—')
  })
})
