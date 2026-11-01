import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { usePaymentsStore } from '@/modules/payments/stores/usePaymentsStore'
import type { RegisterPaymentPayload } from '@/modules/payments/types/payments.types'

/** Listado, detalle por id y mutaciones que recargan desde el API. */

const { httpMock } = vi.hoisted(() => ({
  httpMock: {
    get: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
    post: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
  },
}))

vi.mock('@/core/api/client', () => ({ http: httpMock }))

beforeEach(() => {
  vi.clearAllMocks()
  setActivePinia(createPinia())
  httpMock.get.mockResolvedValue({ data: { data: [], meta: {} } })
  httpMock.post.mockResolvedValue({ data: { data: { id: 42 } } })
})

describe('usePaymentsStore', () => {
  it('registra, recarga y devuelve el id', async () => {
    const store = usePaymentsStore()

    await expect(store.register({} as RegisterPaymentPayload)).resolves.toBe(42)

    expect(httpMock.get).toHaveBeenCalledTimes(1)
    expect(store.saving).toBe(false)
  })

  it('el detalle carga el pago y sus anulaciones', async () => {
    const store = usePaymentsStore()

    await store.loadDetail(7)

    expect(store.detailId).toBe(7)
    expect(httpMock.get).toHaveBeenCalledTimes(2)
  })

  it('solicitar una anulación refresca listado y detalle', async () => {
    const store = usePaymentsStore()

    await store.loadDetail(7)
    httpMock.get.mockClear()
    await store.requestVoid(7, 'Duplicated')

    expect(httpMock.post).toHaveBeenCalled()
    expect(httpMock.get).toHaveBeenCalledTimes(3)
  })

  it('libera `saving` aunque falle', async () => {
    httpMock.post.mockRejectedValue(new Error('boom'))
    const store = usePaymentsStore()

    await expect(store.register({} as RegisterPaymentPayload)).rejects.toThrow('boom')
    await expect(store.requestVoid(1, 'x')).rejects.toThrow('boom')

    expect(store.saving).toBe(false)
  })

  it('la consulta usa la página por defecto', async () => {
    const store = usePaymentsStore()

    await store.setQuery({})

    expect(store.query).toMatchObject({ page: 1, per_page: 15 })
  })
})
