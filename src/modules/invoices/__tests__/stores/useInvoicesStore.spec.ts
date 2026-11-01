import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { useInvoicesStore } from '@/modules/invoices/stores/useInvoicesStore'
import type {
  CreateInvoiceSeriesPayload,
  UpdateInvoiceSeriesPayload,
} from '@/modules/invoices/types/invoices.types'

/** Reintentos y series: cada mutación recarga solo su listado. */

const { httpMock } = vi.hoisted(() => ({
  httpMock: {
    get: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
    post: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
    patch: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
    put: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
  },
}))

vi.mock('@/core/api/client', () => ({ http: httpMock }))

beforeEach(() => {
  vi.clearAllMocks()
  setActivePinia(createPinia())
  httpMock.get.mockResolvedValue({ data: { data: [], meta: {} } })

  for (const method of [httpMock.post, httpMock.patch, httpMock.put]) {
    method.mockResolvedValue({ data: { data: {} } })
  }
})

describe('useInvoicesStore', () => {
  it('carga comprobantes y series', async () => {
    await useInvoicesStore().loadAll()

    expect(httpMock.get).toHaveBeenCalledTimes(2)
  })

  it('consulta con la página por defecto', async () => {
    await useInvoicesStore().setQuery({})

    const call = httpMock.get.mock.calls.at(-1) as [string, { params: Record<string, unknown> }]

    expect(call[1].params).toMatchObject({ page: 1, per_page: 15 })
  })

  it('reintentar y editar series recargan una vez', async () => {
    const store = useInvoicesStore()

    await store.retry(1)
    await store.createSeries({} as CreateInvoiceSeriesPayload)
    await store.updateSeries(1, {} as UpdateInvoiceSeriesPayload)

    expect(httpMock.get).toHaveBeenCalledTimes(3)
    expect(store.saving).toBe(false)
  })

  it('libera `saving` aunque falle', async () => {
    for (const method of [httpMock.post, httpMock.patch, httpMock.put]) {
      method.mockRejectedValue(new Error('boom'))
    }

    const store = useInvoicesStore()

    await expect(store.retry(1)).rejects.toThrow('boom')
    await expect(store.createSeries({} as CreateInvoiceSeriesPayload)).rejects.toThrow('boom')
    await expect(store.updateSeries(1, {} as UpdateInvoiceSeriesPayload)).rejects.toThrow('boom')

    expect(store.saving).toBe(false)
  })
})
