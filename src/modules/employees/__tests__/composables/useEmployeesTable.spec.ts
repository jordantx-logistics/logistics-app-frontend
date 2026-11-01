import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'

import { useEmployeesTable } from '@/modules/employees/composables/useEmployeesTable'
import type { CreateEmployeePayload } from '@/modules/employees/types/employees.types'

/** Filtros de servidor; el mismo modal da de alta y edita. */

const { httpMock, toast } = vi.hoisted(() => ({
  httpMock: {
    get: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
    post: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
    patch: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
    put: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
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
  httpMock.get.mockImplementation(async (url) =>
    String(url).includes('agencies')
      ? { data: { data: [{ id: 3, name: 'Lima' }] } }
      : {
          data: {
            data: [
              { id: 1, status: 'active' },
              { id: 2, status: 'on_leave' },
            ],
            meta: { last_page: 2, total: 20 },
          },
        },
  )

  for (const method of [httpMock.post, httpMock.patch, httpMock.put, httpMock.delete]) {
    method.mockResolvedValue({ data: { data: {} } })
  }
})

describe('useEmployeesTable', () => {
  it('traduce los filtros de pantalla a la consulta', async () => {
    const table = useEmployeesTable()

    table.search.value = ' ana '
    table.status.value = 'active'
    table.agencyId.value = '3'
    table.submitSearch()
    await flushPromises()

    const call = httpMock.get.mock.calls.at(-1) as [string, { params: Record<string, unknown> }]

    expect(call[1].params).toMatchObject({ page: 1, q: 'ana', status: 'active', agency_id: 3 })
    expect(table.activeCount.value).toBe(1)
    expect(table.lastPage.value).toBe(2)
    expect(table.total.value).toBe(20)
    expect(table.emptyText.value).toBe('No employees match the filters.')
  })

  it('sin filtros, el texto vacío invita a registrar', async () => {
    const table = useEmployeesTable()

    table.changePage(2)
    await flushPromises()

    expect(table.page.value).toBe(2)
    expect(table.emptyText.value).toBe('No employees registered yet.')
  })

  it('sin fila da de alta', async () => {
    const table = useEmployeesTable()

    table.openForm()
    expect(table.editingId.value).toBeNull()

    await table.submitEmployee({} as CreateEmployeePayload)

    expect(httpMock.post).toHaveBeenCalled()
    expect(toast.success).toHaveBeenCalledWith('Employee created.')
    expect(table.showForm.value).toBe(false)
  })

  it('con fila edita esa fila', async () => {
    const table = useEmployeesTable()

    table.openForm({ id: 9 })
    expect(table.editingId.value).toBe(9)

    await table.submitEmployee({} as CreateEmployeePayload)

    expect(toast.success).toHaveBeenCalledWith('Employee updated.')
    expect(table.editing.value).toBeNull()
  })

  it('un fallo se queda en el formulario', async () => {
    httpMock.post.mockRejectedValue(new Error('boom'))
    const table = useEmployeesTable()

    table.openForm()
    await table.submitEmployee({} as CreateEmployeePayload)

    expect(table.formError.value).not.toBeNull()
    expect(table.showForm.value).toBe(true)
  })

  it('da de baja y avisa también si falla', async () => {
    const table = useEmployeesTable()

    await table.deactivate(1)
    expect(toast.success).toHaveBeenCalledWith('Employee deactivated.')

    for (const method of [httpMock.post, httpMock.patch, httpMock.put, httpMock.delete]) {
      method.mockRejectedValue(new Error('boom'))
    }

    await table.deactivate(1)
    expect(toast.error).toHaveBeenCalled()
    expect(table.actingId.value).toBeNull()
  })

  it('arma las opciones del filtro de agencias', async () => {
    const table = useEmployeesTable()

    table.loadAgencies()
    await flushPromises()

    expect(table.agencyFilterOptions.value).toEqual([
      { label: 'All agencies', value: 'all' },
      { label: 'Lima', value: '3' },
    ])
  })
})
