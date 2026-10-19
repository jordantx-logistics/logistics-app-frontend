import { computed, ref } from 'vue'

import { ApiError, toApiError } from '@/core/api/errors'
import type { Column } from '@/core/components/types'
import { useAsyncData } from '@/core/composables/useAsyncData'
import { useAuth } from '@/core/composables/useAuth'
import { useToast } from '@/core/composables/useToast'
import { listAgencies } from '@/modules/agencies'

import { PER_PAGE, useEmployeesStore } from '../stores/useEmployeesStore'
import type {
  CreateEmployeePayload,
  Employee,
  EmployeeStatus,
  UpdateEmployeePayload,
} from '../types/employees.types'

/**
 * Lógica de la pantalla de empleados: filtros y paginación de servidor, alta y
 * edición en el mismo modal (el formulario se precarga con la fila) y la baja.
 */

const STATUS_OPTIONS = [
  { label: 'All statuses', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'On leave', value: 'on_leave' },
  { label: 'Terminated', value: 'terminated' },
]

export function useEmployeesTable() {
  const store = useEmployeesStore()
  const { can } = useAuth()
  const { success, error: toastError } = useToast()

  const canManage = computed(() => can('employees.manage'))

  const search = ref('')
  const status = ref('all')
  const agencyId = ref('all')
  const page = ref(1)

  const rows = computed<Employee[]>(() => (store.employees.data?.data ?? []) as Employee[])
  const lastPage = computed(() => store.employees.data?.meta.last_page ?? 1)
  const total = computed(() => store.employees.data?.meta.total ?? 0)
  const activeCount = computed(() => rows.value.filter((row) => row.status === 'active').length)

  /** Catálogo de agencias: la ficha del empleado siempre tiene agencia base. */
  const agencies = useAsyncData(listAgencies)

  const agencyOptions = computed(() =>
    (agencies.data.value ?? []).map((agency) => ({ id: agency.id, name: agency.name })),
  )

  const agencyFilterOptions = computed(() => [
    { label: 'All agencies', value: 'all' },
    ...agencyOptions.value.map((agency) => ({ label: agency.name, value: String(agency.id) })),
  ])

  function loadAgencies(): void {
    if (agencies.data.value === null) {
      void agencies.load()
    }
  }

  function reload(): void {
    void store.load({
      page: page.value,
      per_page: PER_PAGE,
      q: search.value.trim() === '' ? undefined : search.value.trim(),
      status: status.value === 'all' ? undefined : (status.value as EmployeeStatus),
      agency_id: agencyId.value === 'all' ? undefined : Number(agencyId.value),
    })
  }

  function submitSearch(): void {
    page.value = 1
    reload()
  }

  function changePage(next: number): void {
    page.value = next
    reload()
  }

  const emptyText = computed(() =>
    search.value.trim() === '' && status.value === 'all' && agencyId.value === 'all'
      ? 'No employees registered yet.'
      : 'No employees match the filters.',
  )

  const columns: Column[] = [
    { key: 'full_name', label: 'Employee' },
    { key: 'document_number', label: 'Document' },
    { key: 'position', label: 'Position' },
    { key: 'hired_at', label: 'Hired' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: '' },
  ]

  // --- Alta / edición ------------------------------------------------------

  const showForm = ref(false)
  const editing = ref<Employee | null>(null)
  const submitting = ref(false)
  const formError = ref<ApiError | null>(null)

  const editingId = computed(() => editing.value?.id ?? null)

  /**
   * Abre el modal. Sin `row` da de alta; con una fila (la que pasa el slot del
   * `DataTable`, tipada como `Record<string, unknown>`), edita.
   */
  function openForm(row?: unknown): void {
    formError.value = null
    editing.value = row == null ? null : (row as Employee)
    showForm.value = true
  }

  function closeForm(): void {
    showForm.value = false
    editing.value = null
    formError.value = null
  }

  async function submitEmployee(
    payload: CreateEmployeePayload | UpdateEmployeePayload,
  ): Promise<void> {
    submitting.value = true
    formError.value = null

    try {
      if (editing.value === null) {
        await store.createEmployee(payload as CreateEmployeePayload)
        success('Employee created.')
      } else {
        await store.updateEmployee(editing.value.id, payload as UpdateEmployeePayload)
        success('Employee updated.')
      }

      closeForm()
    } catch (caught) {
      formError.value = caught instanceof ApiError ? caught : toApiError(caught)
    } finally {
      submitting.value = false
    }
  }

  // --- Baja ----------------------------------------------------------------

  const actingId = ref<number | null>(null)

  async function deactivate(id: number): Promise<void> {
    actingId.value = id

    try {
      await store.deactivateEmployee(id)
      success('Employee deactivated.')
    } catch (caught) {
      toastError((caught instanceof ApiError ? caught : toApiError(caught)).message)
    } finally {
      actingId.value = null
    }
  }

  return {
    PER_PAGE,
    employees: store.employees,
    canManage,
    search,
    status,
    statusOptions: STATUS_OPTIONS,
    agencyId,
    agencyFilterOptions,
    page,
    rows,
    lastPage,
    total,
    activeCount,
    emptyText,
    columns,
    agencyOptions,
    loadAgencies,
    reload,
    submitSearch,
    changePage,
    showForm,
    editing,
    editingId,
    submitting,
    formError,
    openForm,
    closeForm,
    submitEmployee,
    actingId,
    deactivate,
  }
}
