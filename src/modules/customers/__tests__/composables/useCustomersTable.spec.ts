import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'

import { useCustomersTable } from '@/modules/customers/composables/useCustomersTable'
import { useCustomersStore } from '@/modules/customers/stores/useCustomersStore'
import type {
  CreateCompanyPayload,
  CreatePersonPayload,
} from '@/modules/customers/types/customers.types'

/** Pestañas, búsqueda y paginación locales, y alta en modal. */

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

const persons = Array.from({ length: 12 }, (_, index) => ({
  id: index,
  first_name: index === 0 ? 'Ana' : 'Luis',
  last_name: 'Perez',
  document_number: String(index),
}))

beforeEach(async () => {
  vi.clearAllMocks()
  setActivePinia(createPinia())
  httpMock.get.mockImplementation(async (url) =>
    String(url).includes('persons')
      ? { data: { data: persons } }
      : { data: { data: [{ id: 1, business_name: 'ACME', tax_id: '20' }] } },
  )
  httpMock.post.mockResolvedValue({ data: { data: {} } })

  const store = useCustomersStore()
  await Promise.all([store.persons.load(), store.companies.load()])
  await flushPromises()
})

describe('useCustomersTable', () => {
  it('pagina en el cliente', () => {
    const table = useCustomersTable()

    expect(table.visibleRows.value).toHaveLength(10)
    expect(table.filteredTotal.value).toBe(12)
    expect(table.lastPage.value).toBe(2)

    table.page.value = 2

    expect(table.visibleRows.value).toHaveLength(2)
  })

  it('buscar vuelve a la primera página y filtra', async () => {
    const table = useCustomersTable()

    table.page.value = 2
    table.search.value = 'ana'
    await nextTick()

    expect(table.page.value).toBe(1)
    expect(table.filteredTotal.value).toBe(1)
    expect(table.emptyText.value).toBe('No persons match the search.')
  })

  it('cambia de pestaña y de textos', async () => {
    const table = useCustomersTable()

    expect(table.formTitle.value).toBe('Add person')
    expect(table.emptyText.value).toBe('No persons registered yet.')

    table.tab.value = 'companies'
    await nextTick()

    expect(table.visibleRows.value).toHaveLength(1)
    expect(table.formTitle.value).toBe('Add company')
    expect(table.emptyText.value).toBe('No companies registered yet.')
    expect(table.canSeeCompanies.value).toBe(true)
  })

  it('crea personas y empresas y cierra el modal', async () => {
    const table = useCustomersTable()

    table.openForm()
    table.submitPerson({} as CreatePersonPayload)
    await flushPromises()

    expect(toast.success).toHaveBeenCalledWith('Person created.')
    expect(table.showForm.value).toBe(false)

    table.openForm()
    table.submitCompany({} as CreateCompanyPayload)
    await flushPromises()

    expect(toast.success).toHaveBeenCalledWith('Company created.')
  })

  it('un fallo se queda en el modal', async () => {
    httpMock.post.mockRejectedValue(new Error('boom'))
    const table = useCustomersTable()

    table.openForm()
    table.submitPerson({} as CreatePersonPayload)
    await flushPromises()

    expect(table.formError.value).not.toBeNull()
    expect(table.showForm.value).toBe(true)

    table.closeForm()
    expect(table.formError.value).toBeNull()
  })
})
