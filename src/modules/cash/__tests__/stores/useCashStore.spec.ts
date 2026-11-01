import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { useCashStore } from '@/modules/cash/stores/useCashStore'
import type {
  CloseCashSessionPayload,
  OpenCashSessionPayload,
  RegisterCashMovementPayload,
} from '@/modules/cash/types/cash.types'

/** Cada mutación recarga desde el API; `saving` se libera aunque falle. */

const { httpMock } = vi.hoisted(() => ({
  httpMock: {
    get: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
    post: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
  },
}))

vi.mock('@/core/api/client', () => ({ http: httpMock }))

const CURRENT = '/api/v1/finance/cash-sessions/current'

beforeEach(() => {
  vi.clearAllMocks()
  setActivePinia(createPinia())
  httpMock.get.mockResolvedValue({ data: { data: [], meta: {} } })
  httpMock.post.mockResolvedValue({ data: { data: { id: 1 } } })
})

function requestedCurrent(): boolean {
  return httpMock.get.mock.calls.some(([url]) => url === CURRENT)
}

describe('useCashStore', () => {
  it('quien solo consulta no pide la sesión propia', async () => {
    await useCashStore().loadAll(false)

    expect(requestedCurrent()).toBe(false)
  })

  it('por defecto carga también la sesión propia', async () => {
    await useCashStore().loadAll()

    expect(requestedCurrent()).toBe(true)
  })

  it('cada mutación llama a su ruta y recarga', async () => {
    const store = useCashStore()

    await store.open({} as OpenCashSessionPayload)
    await store.close(4, {} as CloseCashSessionPayload)
    await store.move({} as RegisterCashMovementPayload)
    await store.approve(9)
    await store.reject(9, 'Wrong count')

    const urls = httpMock.post.mock.calls.map(([url]) => url)

    expect(urls).toContain('/api/v1/finance/cash-sessions')
    expect(urls).toContain('/api/v1/finance/cash-sessions/4/close')
    expect(urls).toContain('/api/v1/finance/cash-closures/9/approve')
    expect(urls).toContain('/api/v1/finance/cash-closures/9/reject')
    expect(httpMock.get.mock.calls.length).toBeGreaterThanOrEqual(15)
  })

  it('libera `saving` aunque la mutación falle', async () => {
    httpMock.post.mockRejectedValue(new Error('boom'))
    const store = useCashStore()

    await expect(store.open({} as OpenCashSessionPayload)).rejects.toThrow('boom')
    await expect(store.close(1, {} as CloseCashSessionPayload)).rejects.toThrow('boom')
    await expect(store.move({} as RegisterCashMovementPayload)).rejects.toThrow('boom')
    await expect(store.approve(1)).rejects.toThrow('boom')
    await expect(store.reject(1, 'x')).rejects.toThrow('boom')

    expect(store.saving).toBe(false)
  })

  it('cambiar de página conserva los filtros en la consulta', async () => {
    const store = useCashStore()

    await store.setSessionsQuery({ page: 2 })
    await store.setClosuresQuery({})
    await store.loadClosures()

    const pages = httpMock.get.mock.calls.map(
      (call) => (call[1] as { params?: { page?: number } } | undefined)?.params?.page,
    )

    expect(pages).toContain(2)
    expect(pages).toContain(1)
  })
})
