import { computed, ref, watch } from 'vue'

import { ApiError, toApiError } from '@/core/api/errors'
import type { Column } from '@/core/components/types'
import { useAuth } from '@/core/composables/useAuth'
import { useToast } from '@/core/composables/useToast'
import { matchesQuery, pageCount, slicePage } from '@/core/utils/list'

import { useCustomersStore } from '../stores/useCustomersStore'
import type {
  Company,
  CreateCompanyPayload,
  CreatePersonPayload,
  Person,
} from '../types/customers.types'

/**
 * Lógica de la pantalla de clientes: pestañas, búsqueda y paginación local (el
 * listado viene entero del API) y el alta en modal. El estado de datos vive en
 * `stores/useCustomersStore.ts`; aquí queda la presentación.
 */

type Tab = 'persons' | 'companies'

const PER_PAGE = 10

export function useCustomersTable() {
  const store = useCustomersStore()
  const { can } = useAuth()
  const { success } = useToast()

  const canSeeCompanies = computed(() => can('companies.view'))
  const canCreatePerson = computed(() => can('persons.manage'))
  const canCreateCompany = computed(() => can('companies.manage'))

  const tab = ref<Tab>('persons')
  const search = ref('')
  const page = ref(1)

  // Un cambio de pestaña o de búsqueda vuelve a la primera página.
  watch([tab, search], () => {
    page.value = 1
  })

  const filteredPersons = computed(() => {
    const rows: Person[] = store.persons.data ?? []

    return rows.filter((row) =>
      matchesQuery(
        [row.first_name, row.last_name, row.document_type, row.document_number, row.email],
        search.value,
      ),
    )
  })

  const filteredCompanies = computed(() => {
    const rows: Company[] = store.companies.data ?? []

    return rows.filter((row) =>
      matchesQuery(
        [row.business_name, row.trade_name, row.tax_id, row.contact_email],
        search.value,
      ),
    )
  })

  const visibleRows = computed(() =>
    tab.value === 'persons'
      ? slicePage(filteredPersons.value, page.value, PER_PAGE)
      : slicePage(filteredCompanies.value, page.value, PER_PAGE),
  )

  const filteredTotal = computed(() =>
    tab.value === 'persons' ? filteredPersons.value.length : filteredCompanies.value.length,
  )

  const lastPage = computed(() => pageCount(filteredTotal.value, PER_PAGE))

  const list = computed(() => (tab.value === 'persons' ? store.persons : store.companies))

  const emptyText = computed(() => {
    const subject = tab.value === 'persons' ? 'persons' : 'companies'

    return search.value.trim() === ''
      ? `No ${subject} registered yet.`
      : `No ${subject} match the search.`
  })

  const personColumns: Column[] = [
    { key: 'document', label: 'Document' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'created_at', label: 'Created' },
  ]

  const companyColumns: Column[] = [
    { key: 'tax_id', label: 'Tax ID' },
    { key: 'business_name', label: 'Business name' },
    { key: 'trade_name', label: 'Trade name' },
    { key: 'contact', label: 'Contact' },
    { key: 'created_at', label: 'Created' },
  ]

  // --- Alta ----------------------------------------------------------------

  const showForm = ref(false)
  const submitting = ref(false)
  const formError = ref<ApiError | null>(null)

  const formTitle = computed(() => (tab.value === 'persons' ? 'Add person' : 'Add company'))

  function openForm(): void {
    formError.value = null
    showForm.value = true
  }

  function closeForm(): void {
    showForm.value = false
    formError.value = null
  }

  async function create(request: () => Promise<void>, message: string): Promise<void> {
    submitting.value = true
    formError.value = null

    try {
      await request()
      success(message)
      closeForm()
    } catch (caught) {
      // El 422 se queda en el modal: el formulario pinta los mensajes por campo.
      formError.value = caught instanceof ApiError ? caught : toApiError(caught)
    } finally {
      submitting.value = false
    }
  }

  function submitPerson(payload: CreatePersonPayload): void {
    void create(() => store.createPerson(payload), 'Person created.')
  }

  function submitCompany(payload: CreateCompanyPayload): void {
    void create(() => store.createCompany(payload), 'Company created.')
  }

  return {
    PER_PAGE,
    persons: store.persons,
    companies: store.companies,
    canCreatePerson,
    canCreateCompany,
    canSeeCompanies,
    tab,
    search,
    page,
    visibleRows,
    filteredTotal,
    lastPage,
    list,
    emptyText,
    personColumns,
    companyColumns,
    showForm,
    submitting,
    formError,
    formTitle,
    openForm,
    closeForm,
    submitPerson,
    submitCompany,
  }
}
