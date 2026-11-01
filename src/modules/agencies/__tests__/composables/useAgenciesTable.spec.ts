import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'

import { useAgenciesTable } from '@/modules/agencies/composables/useAgenciesTable'
import { useAgenciesStore } from '@/modules/agencies/stores/useAgenciesStore'
import type { CreateAgencyPayload } from '@/modules/agencies/types/agencies.types'

/** Búsqueda y paginación locales, y alta en modal. */

const { httpMock, toast } = vi.hoisted(() => ({
  httpMock: {
    get: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
    post: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
  },
  toast: { success: vi.fn<() => void>() },
}))

vi.mock('@/core/api/client', () => ({ http: httpMock }))
vi.mock('@/core/composables/useToast', () => ({ useToast: () => toast }))
vi.mock('@/core/composables/useAuth', () => ({ useAuth: () => ({ can: () => true }) }))

const agencies = Array.from({ length: 11 }, (_, index) => ({
  id: index,
  code: `A${index}`,
  name: index === 0 ? 'Lima' : 'Trujillo',
  is_active: index !== 1,
}))

beforeEach(async () => {
  vi.clearAllMocks()
  setActivePinia(createPinia())
  httpMock.get.mockResolvedValue({ data: { data: agencies } })
  httpMock.post.mockResolvedValue({ data: { data: {} } })

  await useAgenciesStore().agencies.load()
  await flushPromises()
})

describe('useAgenciesTable', () => {
  it('pagina y cuenta las activas', () => {
    const table = useAgenciesTable()

    expect(table.visibleRows.value).toHaveLength(10)
    expect(table.lastPage.value).toBe(2)
    expect(table.activeCount.value).toBe(10)
    expect(table.canCreate.value).toBe(true)
    expect(table.emptyText.value).toBe('No agencies registered yet.')
  })

  it('buscar vuelve a la primera página', async () => {
    const table = useAgenciesTable()

    table.page.value = 2
    table.search.value = 'lima'
    await nextTick()

    expect(table.page.value).toBe(1)
    expect(table.filtered.value).toHaveLength(1)
    expect(table.emptyText.value).toBe('No agencies match the search.')
  })

  it('crea y cierra el modal', async () => {
    const table = useAgenciesTable()

    table.openForm()
    await table.submitAgency({} as CreateAgencyPayload)

    expect(toast.success).toHaveBeenCalledWith('Agency created.')
    expect(table.showForm.value).toBe(false)
  })

  it('un fallo se queda en el modal', async () => {
    httpMock.post.mockRejectedValue(new Error('boom'))
    const table = useAgenciesTable()

    table.openForm()
    await table.submitAgency({} as CreateAgencyPayload)

    expect(table.formError.value).not.toBeNull()
    expect(table.showForm.value).toBe(true)

    table.closeForm()
    expect(table.formError.value).toBeNull()
  })
})
