import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import * as tariffsApi from '@/modules/tariffs/api'
import { useTariffsStore } from '@/modules/tariffs/stores/useTariffsStore'
import type {
  CoveragePayload,
  LocationPayload,
  TariffPayload,
  ZonePayload,
} from '@/modules/tariffs/types/tariffs.types'

/** Datos maestros de precios: rutas del contrato y consultas del store. */

const { httpMock } = vi.hoisted(() => ({
  httpMock: {
    get: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
    post: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
    put: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
  },
}))

vi.mock('@/core/api/client', () => ({ http: httpMock }))

const BASE = '/api/v1/logistics'

beforeEach(() => {
  vi.clearAllMocks()
  setActivePinia(createPinia())
  httpMock.get.mockResolvedValue({
    data: { data: [{ id: 1 }], meta: { current_page: 2, last_page: 3, per_page: 15, total: 31 } },
  })
  httpMock.post.mockResolvedValue({ data: {} })
  httpMock.put.mockResolvedValue({ data: {} })
})

describe('api de tarifarios', () => {
  it('desenvuelve el paginado', async () => {
    const page = await tariffsApi.listTariffs({ page: 2 })

    expect(page.rows).toEqual([{ id: 1 }])
    expect(page.meta.total).toBe(31)
    expect(httpMock.get).toHaveBeenCalledWith(`${BASE}/tariffs`, {
      params: { per_page: 15, page: 2 },
    })
  })

  it('tolera una respuesta sin meta', async () => {
    httpMock.get.mockResolvedValue({ data: {} })

    const page = await tariffsApi.listZones()

    expect(page.rows).toEqual([])
    expect(page.meta.last_page).toBe(1)
  })

  it('escribe en las rutas del contrato', async () => {
    await tariffsApi.createTariff({} as TariffPayload)
    await tariffsApi.updateTariff(5, {} as TariffPayload)
    await tariffsApi.createZone({} as ZonePayload)
    await tariffsApi.updateLocation(6, {} as LocationPayload)
    await tariffsApi.createCoverage({} as CoveragePayload)

    expect(httpMock.post).toHaveBeenCalledWith(`${BASE}/tariffs`, {})
    expect(httpMock.put).toHaveBeenCalledWith(`${BASE}/tariffs/5`, {})
    expect(httpMock.post).toHaveBeenCalledWith(`${BASE}/zones`, {})
    expect(httpMock.put).toHaveBeenCalledWith(`${BASE}/locations/6`, {})
    expect(httpMock.post).toHaveBeenCalledWith(`${BASE}/agency-coverages`, {})
  })
})

describe('store de tarifarios', () => {
  it('solo manda la búsqueda si hay texto', async () => {
    const store = useTariffsStore()

    await store.tariffs.load()
    expect(httpMock.get.mock.lastCall?.[1]).toEqual({ params: { per_page: 15, page: 1 } })

    store.tariffsSearch = 'lim'
    store.tariffsPage = 2
    await store.tariffs.load()
    expect(httpMock.get.mock.lastCall?.[1]).toEqual({ params: { per_page: 15, page: 2, q: 'lim' } })
  })

  it('ubicaciones y coberturas tienen su propia página', async () => {
    const store = useTariffsStore()

    store.locationsSearch = 'lima'
    store.locationsPage = 3
    store.coveragesPage = 4
    await store.locations.load()
    expect(httpMock.get.mock.lastCall?.[1]).toEqual({
      params: { per_page: 15, page: 3, q: 'lima' },
    })

    await store.coverages.load()
    expect(httpMock.get.mock.lastCall?.[1]).toEqual({ params: { per_page: 15, page: 4 } })
  })
})
