import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'

import { useAttendanceTable } from '@/modules/attendance/composables/useAttendanceTable'
import type { RegisterAttendancePayload } from '@/modules/attendance/types/attendance.types'

/** Filtros de servidor, alta, anulación y consolidado a demanda. */

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
  useAuth: () => ({ can: (permission: string) => permission === 'attendance.register' }),
}))

beforeEach(() => {
  vi.clearAllMocks()
  setActivePinia(createPinia())
  httpMock.get.mockImplementation(async (url) => {
    if (String(url).includes('agencies')) {
      return { data: { data: [{ id: 3, name: 'Lima' }] } }
    }

    if (String(url).includes('summary')) {
      return { data: { data: [{ employee_id: 1 }] } }
    }

    return {
      data: {
        data: [
          { id: 1, status: 'late' },
          { id: 2, status: 'valid' },
        ],
        meta: { last_page: 3, total: 30 },
      },
    }
  })

  for (const method of [httpMock.post, httpMock.patch, httpMock.delete]) {
    method.mockResolvedValue({ data: { data: {} } })
  }
})

describe('useAttendanceTable', () => {
  it('traduce los filtros y cuenta las tardanzas', async () => {
    const table = useAttendanceTable()

    table.employeeId.value = '7'
    table.status.value = 'late'
    table.agencyId.value = '3'
    table.from.value = '2026-10-01'
    table.to.value = '2026-10-31'
    table.submitSearch()
    await flushPromises()

    const call = httpMock.get.mock.calls.at(-1) as [string, { params: Record<string, unknown> }]

    expect(call[1].params).toMatchObject({
      page: 1,
      employee_id: 7,
      status: 'late',
      agency_id: 3,
      from: '2026-10-01',
      to: '2026-10-31',
    })
    expect(table.lateCount.value).toBe(1)
    expect(table.lastPage.value).toBe(3)
    expect(table.total.value).toBe(30)
    expect(table.emptyText.value).toBe('No attendance records match the filters.')
  })

  it('sin filtros no manda nada de más', async () => {
    const table = useAttendanceTable()

    table.changePage(2)
    await flushPromises()

    const call = httpMock.get.mock.calls.at(-1) as [string, { params: Record<string, unknown> }]

    expect(call[1].params).toMatchObject({ page: 2, status: undefined, agency_id: undefined })
    expect(table.emptyText.value).toBe('No attendance registered yet.')
    expect(table.canRegister.value).toBe(true)
    expect(table.canVoid.value).toBe(false)
  })

  it('registra y cierra el modal', async () => {
    const table = useAttendanceTable()

    table.openForm()
    await table.submitAttendance({} as RegisterAttendancePayload)

    expect(toast.success).toHaveBeenCalledWith('Attendance registered.')
    expect(table.showForm.value).toBe(false)
  })

  it('un fallo al registrar se queda en el formulario', async () => {
    httpMock.post.mockRejectedValue(new Error('boom'))
    const table = useAttendanceTable()

    table.openForm()
    await table.submitAttendance({} as RegisterAttendancePayload)

    expect(table.formError.value).not.toBeNull()
    expect(table.submitting.value).toBe(false)

    table.closeForm()
    expect(table.formError.value).toBeNull()
  })

  it('pide el consolidado solo al abrirlo y una vez', async () => {
    const table = useAttendanceTable()

    table.toggleSummary()
    await flushPromises()

    expect(table.showSummary.value).toBe(true)
    expect(table.summaryRows.value).toEqual([{ employee_id: 1 }])
    expect(table.summaryStatus.value).toBe('ready')
    expect(table.summaryError.value).toBeNull()

    const calls = httpMock.get.mock.calls.length

    table.toggleSummary()
    table.toggleSummary()
    await flushPromises()

    expect(httpMock.get).toHaveBeenCalledTimes(calls)

    table.reloadSummary()
    await flushPromises()

    expect(httpMock.get).toHaveBeenCalledTimes(calls + 1)
  })

  it('anular refresca el consolidado abierto y avisa si falla', async () => {
    const table = useAttendanceTable()

    table.toggleSummary()
    await flushPromises()
    await table.voidRecord(1)

    expect(toast.success).toHaveBeenCalledWith('Attendance voided.')

    for (const method of [httpMock.post, httpMock.patch, httpMock.delete]) {
      method.mockRejectedValue(new Error('boom'))
    }

    await table.voidRecord(1)

    expect(toast.error).toHaveBeenCalled()
    expect(table.actingId.value).toBeNull()
  })

  it('arma el filtro de agencias una vez', async () => {
    const table = useAttendanceTable()

    table.loadAgencies()
    await flushPromises()
    table.loadAgencies()
    await flushPromises()

    expect(table.agencyFilterOptions.value).toHaveLength(2)
    expect(httpMock.get).toHaveBeenCalledTimes(1)
  })
})
