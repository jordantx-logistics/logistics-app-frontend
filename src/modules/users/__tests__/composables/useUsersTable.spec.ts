import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'

import { isLocked, useUsersTable } from '@/modules/users/composables/useUsersTable'
import type { CreateUserPayload } from '@/modules/users/types/users.types'

/** Filtros de servidor, alta en modal y acciones de fila. */

const { httpMock, toast } = vi.hoisted(() => ({
  httpMock: {
    get: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
    post: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
    patch: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
    delete: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
  },
  toast: { success: vi.fn<() => void>(), error: vi.fn<() => void>() },
}))

vi.mock('@/core/api/client', () => ({ http: httpMock }))
vi.mock('@/core/composables/useToast', () => ({ useToast: () => toast }))
vi.mock('@/core/composables/useAuth', () => ({
  useAuth: () => ({ can: (permission: string) => permission === 'users.manage' }),
}))

beforeEach(() => {
  vi.clearAllMocks()
  setActivePinia(createPinia())
  httpMock.get.mockImplementation(async (url) =>
    String(url).includes('agencies')
      ? { data: { data: [{ id: 3, name: 'Lima' }] } }
      : {
          data: {
            data: [
              { id: 1, status: 'active' },
              { id: 2, status: 'suspended' },
            ],
            meta: { last_page: 4, total: 40 },
          },
        },
  )
  httpMock.post.mockResolvedValue({ data: { data: {} } })
  httpMock.patch.mockResolvedValue({ data: { data: {} } })
})

function lastParams(): Record<string, unknown> {
  const call = httpMock.get.mock.calls.at(-1) as [string, { params: Record<string, unknown> }]

  return call[1].params
}

describe('useUsersTable', () => {
  it('manda los filtros al servidor y calcula los totales', async () => {
    const table = useUsersTable()

    table.search.value = '  ana '
    table.status.value = 'active'
    table.page.value = 3
    table.submitSearch()
    await flushPromises()

    expect(lastParams()).toMatchObject({ page: 1, q: 'ana', status: 'active' })
    expect(table.rows.value).toHaveLength(2)
    expect(table.activeCount.value).toBe(1)
    expect(table.lastPage.value).toBe(4)
    expect(table.total.value).toBe(40)
    expect(table.canManage.value).toBe(true)
    expect(table.emptyText.value).toBe('No users match the filters.')
  })

  it('sin filtros no manda `q` ni `status`, y cambia de página', async () => {
    const table = useUsersTable()

    table.changePage(2)
    await flushPromises()

    expect(lastParams()).toMatchObject({ page: 2, q: undefined, status: undefined })
    expect(table.emptyText.value).toBe('No users registered yet.')
  })

  it('crea, avisa y cierra el modal', async () => {
    const table = useUsersTable()

    table.openForm()
    await table.submitUser({} as CreateUserPayload)

    expect(toast.success).toHaveBeenCalledWith('User created.')
    expect(table.showForm.value).toBe(false)
  })

  it('un fallo al crear se queda en el formulario', async () => {
    httpMock.post.mockRejectedValue(new Error('boom'))
    const table = useUsersTable()

    table.openForm()
    await table.submitUser({} as CreateUserPayload)

    expect(table.formError.value).not.toBeNull()
    expect(table.showForm.value).toBe(true)
    expect(table.submitting.value).toBe(false)

    table.closeForm()
    expect(table.formError.value).toBeNull()
  })

  it('cambia el estado y desbloquea con su aviso', async () => {
    const table = useUsersTable()

    await table.setStatus(1, 'active')
    await table.setStatus(1, 'suspended')
    await table.unlock(1)

    expect(toast.success).toHaveBeenCalledWith('User reactivated.')
    expect(toast.success).toHaveBeenCalledWith('User suspended.')
    expect(toast.success).toHaveBeenCalledWith('User unlocked.')
    expect(table.actingId.value).toBeNull()
  })

  it('un fallo en una acción de fila avisa por toast', async () => {
    httpMock.patch.mockRejectedValue(new Error('boom'))
    httpMock.post.mockRejectedValue(new Error('boom'))
    const table = useUsersTable()

    await table.setStatus(1, 'suspended')
    await table.unlock(1)

    expect(toast.error).toHaveBeenCalledTimes(2)
  })

  it('pide el catálogo de agencias una sola vez', async () => {
    const table = useUsersTable()

    table.loadAgencies()
    await flushPromises()
    table.loadAgencies()
    await flushPromises()

    expect(table.agencyOptions.value).toEqual([{ id: 3, name: 'Lima' }])
    expect(httpMock.get).toHaveBeenCalledTimes(1)
  })
})

describe('isLocked', () => {
  it('solo está bloqueada con una fecha futura', () => {
    expect(isLocked(null)).toBe(false)
    expect(isLocked('')).toBe(false)
    expect(isLocked('2000-01-01T00:00:00Z')).toBe(false)
    expect(isLocked(new Date(Date.now() + 60_000).toISOString())).toBe(true)
  })
})
