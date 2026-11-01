import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { statusVariant, useOrdersTable } from '@/modules/orders/composables/useOrdersTable'
import { useOrdersStore } from '@/modules/orders/stores/useOrdersStore'

/** Paginación de servidor y filtro por estado. */

const { httpMock, push } = vi.hoisted(() => ({
  httpMock: { get: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>() },
  push: vi.fn<(to: unknown) => void>(),
}))

vi.mock('@/core/api/client', () => ({ http: httpMock }))
vi.mock('vue-router', () => ({ useRouter: () => ({ push }) }))
vi.mock('@/core/composables/useAuth', () => ({
  useAuth: () => ({ can: (permission: string) => permission === 'orders.create' }),
}))

beforeEach(() => {
  vi.clearAllMocks()
  setActivePinia(createPinia())
  httpMock.get.mockResolvedValue({ data: { data: [{ id: 1 }], meta: { total: 1 } } })
})

describe('useOrdersStore', () => {
  it('sin filtro no manda `status`', async () => {
    await useOrdersStore().orders.load()

    expect(httpMock.get.mock.lastCall?.[1]).toEqual({ params: { page: 1, per_page: 15 } })
  })

  it('filtrar vuelve a la primera página', () => {
    const store = useOrdersStore()

    store.goToPage(3)
    expect(httpMock.get.mock.lastCall?.[1]).toEqual({ params: { page: 3, per_page: 15 } })

    store.filterByStatus('pending')
    expect(store.page).toBe(1)
    expect(httpMock.get.mock.lastCall?.[1]).toEqual({
      params: { page: 1, per_page: 15, status: 'pending' },
    })
  })
})

describe('useOrdersTable', () => {
  it('expone las filas y el permiso de alta', async () => {
    const table = useOrdersTable()

    await table.orders.load()

    expect(table.rows.value).toEqual([{ id: 1 }])
    expect(table.meta.value?.total).toBe(1)
    expect(table.canCreate.value).toBe(true)
  })

  it('abre el detalle por nombre de ruta', () => {
    useOrdersTable().openOrder(7)

    expect(push).toHaveBeenCalledWith({ name: 'order-detail', params: { id: '7' } })
  })

  it('un estado desconocido es neutro', () => {
    expect(statusVariant('pending')).toBe('warning')
    expect(statusVariant('whatever')).toBe('neutral')
  })
})
