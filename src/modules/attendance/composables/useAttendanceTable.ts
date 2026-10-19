import { computed, ref } from 'vue'

import { ApiError, toApiError } from '@/core/api/errors'
import type { Column } from '@/core/components/types'
import { useAsyncData } from '@/core/composables/useAsyncData'
import { useAuth } from '@/core/composables/useAuth'
import { useToast } from '@/core/composables/useToast'
import { listAgencies } from '@/modules/agencies'

import * as attendanceApi from '../api/attendance.api'
import { PER_PAGE, useAttendanceStore } from '../stores/useAttendanceStore'
import type {
  Attendance,
  AttendanceDay,
  AttendanceStatus,
  RegisterAttendancePayload,
} from '../types/attendance.types'

/**
 * Lógica de la pantalla de marcaciones: filtros y paginación de servidor, alta
 * en modal, anulación (RRHH) y el consolidado diario, que se pide a demanda.
 */

const STATUS_OPTIONS = [
  { label: 'All statuses', value: 'all' },
  { label: 'Valid', value: 'valid' },
  { label: 'Late', value: 'late' },
  { label: 'Duplicate', value: 'duplicate' },
  { label: 'Voided', value: 'voided' },
]

export function useAttendanceTable() {
  const store = useAttendanceStore()
  const { can } = useAuth()
  const { success, error: toastError } = useToast()

  const canRegister = computed(() => can('attendance.register'))
  const canVoid = computed(() => can('attendance.manage'))

  const employeeId = ref('')
  const status = ref('all')
  const agencyId = ref('all')
  const from = ref('')
  const to = ref('')
  const page = ref(1)

  const rows = computed<Attendance[]>(() => (store.attendance.data?.data ?? []) as Attendance[])
  const lastPage = computed(() => store.attendance.data?.meta.last_page ?? 1)
  const total = computed(() => store.attendance.data?.meta.total ?? 0)
  const lateCount = computed(() => rows.value.filter((row) => row.status === 'late').length)

  /** Catálogo de agencias: filtro y origen de la marcación. */
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
      status: status.value === 'all' ? undefined : (status.value as AttendanceStatus),
      agency_id: agencyId.value === 'all' ? undefined : Number(agencyId.value),
      employee_id: employeeId.value === '' ? undefined : Number(employeeId.value),
      from: from.value === '' ? undefined : from.value,
      to: to.value === '' ? undefined : to.value,
    })
  }

  function reloadSummary(): void {
    void summary.load()
  }

  function submitSearch(): void {
    page.value = 1
    reload()
  }

  function changePage(next: number): void {
    page.value = next
    reload()
  }

  const filtered = computed(
    () =>
      employeeId.value !== '' ||
      status.value !== 'all' ||
      agencyId.value !== 'all' ||
      from.value !== '' ||
      to.value !== '',
  )

  const emptyText = computed(() =>
    filtered.value ? 'No attendance records match the filters.' : 'No attendance registered yet.',
  )

  const columns: Column[] = [
    { key: 'employee_id', label: 'Employee' },
    { key: 'marked_at', label: 'Marked at' },
    { key: 'type', label: 'Type' },
    { key: 'source', label: 'Source' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: '' },
  ]

  // --- Alta ----------------------------------------------------------------

  const showForm = ref(false)
  const submitting = ref(false)
  const formError = ref<ApiError | null>(null)

  function openForm(): void {
    formError.value = null
    showForm.value = true
  }

  function closeForm(): void {
    showForm.value = false
    formError.value = null
  }

  async function submitAttendance(payload: RegisterAttendancePayload): Promise<void> {
    submitting.value = true
    formError.value = null

    try {
      await store.register(payload)
      success('Attendance registered.')
      closeForm()
    } catch (caught) {
      formError.value = caught instanceof ApiError ? caught : toApiError(caught)
    } finally {
      submitting.value = false
    }
  }

  // --- Consolidado diario --------------------------------------------------

  const showSummary = ref(false)

  const summaryQuery = computed(() => ({
    from: from.value === '' ? undefined : from.value,
    to: to.value === '' ? undefined : to.value,
  }))

  const summary = useAsyncData(() => attendanceApi.attendanceSummary(summaryQuery.value))

  const summaryRows = computed<AttendanceDay[]>(() => summary.data.value ?? [])
  const summaryStatus = computed(() => summary.status.value)
  const summaryError = computed(() => summary.error.value)

  function toggleSummary(): void {
    showSummary.value = !showSummary.value

    if (showSummary.value && summary.data.value === null) {
      void summary.load()
    }
  }

  // --- Anulación -----------------------------------------------------------

  const actingId = ref<number | null>(null)

  async function voidRecord(id: number): Promise<void> {
    actingId.value = id

    try {
      await store.voidRecord(id)
      success('Attendance voided.')

      // El consolidado del día cambia al anular: si está abierto, se refresca.
      if (showSummary.value) {
        void summary.load()
      }
    } catch (caught) {
      toastError((caught instanceof ApiError ? caught : toApiError(caught)).message)
    } finally {
      actingId.value = null
    }
  }

  const summaryColumns: Column[] = [
    { key: 'employee_id', label: 'Employee' },
    { key: 'work_date', label: 'Date' },
    { key: 'first_in_at', label: 'First in' },
    { key: 'last_out_at', label: 'Last out' },
    { key: 'worked_minutes', label: 'Worked (min)' },
    { key: 'late_minutes', label: 'Late (min)' },
    { key: 'status', label: 'Status' },
  ]

  return {
    PER_PAGE,
    attendance: store.attendance,
    canRegister,
    canVoid,
    employeeId,
    status,
    statusOptions: STATUS_OPTIONS,
    agencyId,
    agencyFilterOptions,
    from,
    to,
    page,
    rows,
    lastPage,
    total,
    lateCount,
    emptyText,
    columns,
    reload,
    submitSearch,
    changePage,
    showForm,
    submitting,
    formError,
    openForm,
    closeForm,
    submitAttendance,
    actingId,
    voidRecord,
    agencyOptions,
    loadAgencies,
    showSummary,
    summaryRows,
    summaryStatus,
    summaryError,
    summaryColumns,
    toggleSummary,
    reloadSummary,
  }
}
