import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'

import { useDevicesTable } from '@/modules/devices/composables/useDevicesTable'

/** Filtros de servidor y revocación. */

const { httpMock, toast } = vi.hoisted(() => ({
  httpMock: {
    get: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
    post: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
    delete: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
  },
  toast: { success: vi.fn<() => void>(), error: vi.fn<() => void>() },
}))

vi.mock('@/core/api/client', () => ({ http: httpMock }))
vi.mock('@/core/composables/useToast', () => ({ useToast: () => toast }))
vi.mock('@/core/composables/useAuth', () => ({ useAuth: () => ({ can: () => true }) }))

beforeEach(() => {
  vi.clearAllMocks()
  setActivePinia(createPinia())
  httpMock.get.mockResolvedValue({
    data: {
      data: [
        { id: 1, status: 'active' },
        { id: 2, status: 'revoked' },
      ],
      meta: { last_page: 2, total: 12 },
    },
  })
  httpMock.post.mockResolvedValue({ data: { data: {} } })
  httpMock.delete.mockResolvedValue({ data: { data: {} } })
})

describe('useDevicesTable', () => {
  it('traduce los filtros y calcula los totales', async () => {
    const table = useDevicesTable()

    table.status.value = 'active'
    table.userId.value = '4'
    table.submitSearch()
    await flushPromises()

    const call = httpMock.get.mock.calls.at(-1) as [string, { params: Record<string, unknown> }]

    expect(call[1].params).toMatchObject({ page: 1, status: 'active', user_id: 4 })
    expect(table.activeCount.value).toBe(1)
    expect(table.lastPage.value).toBe(2)
    expect(table.total.value).toBe(12)
    expect(table.canManage.value).toBe(true)
    expect(table.emptyText.value).toBe('No devices match the filters.')
  })

  it('sin filtros cambia de página', async () => {
    const table = useDevicesTable()

    table.changePage(2)
    await flushPromises()

    expect(table.page.value).toBe(2)
    expect(table.emptyText.value).toBe('No devices registered yet.')
  })

  it('revoca y avisa también si falla', async () => {
    const table = useDevicesTable()

    await table.revoke(1)
    expect(toast.success).toHaveBeenCalledWith('Device revoked.')

    httpMock.post.mockRejectedValue(new Error('boom'))
    httpMock.delete.mockRejectedValue(new Error('boom'))

    await table.revoke(1)
    expect(toast.error).toHaveBeenCalled()
    expect(table.actingId.value).toBeNull()
  })
})
