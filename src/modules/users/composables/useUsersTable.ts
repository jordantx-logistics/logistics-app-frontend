import { computed, ref } from 'vue'

import { ApiError, toApiError } from '@/core/api/errors'
import type { Column } from '@/core/components/types'
import { useAsyncData } from '@/core/composables/useAsyncData'
import { useAuth } from '@/core/composables/useAuth'
import { useToast } from '@/core/composables/useToast'
import { listAgencies } from '@/modules/agencies'

import { PER_PAGE, useUsersStore } from '../stores/useUsersStore'
import type { CreateUserPayload, User, UserStatus } from '../types/users.types'

/**
 * Lógica de la pantalla de usuarios: filtros y paginación **de servidor**,
 * alta en modal y acciones de fila (estado y desbloqueo).
 *
 * A diferencia de agencias, `GET /identity/users` pagina y filtra en el
 * backend, así que aquí no hay `slicePage`: cada cambio de filtro o de página
 * vuelve a pedir el listado.
 */

/** Opciones del filtro de estado (`all` no es un estado: es «sin filtro»). */
const STATUS_OPTIONS = [
  { label: 'All statuses', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Suspended', value: 'suspended' },
  { label: 'Inactive', value: 'inactive' },
]

/** ¿La cuenta sigue bloqueada por intentos fallidos? */
export function isLocked(value: unknown): boolean {
  if (typeof value !== 'string' || value === '') {
    return false
  }

  return new Date(value).getTime() > Date.now()
}

export function useUsersTable() {
  const store = useUsersStore()
  const { can } = useAuth()
  const { success, error: toastError } = useToast()

  const canManage = computed(() => can('users.manage'))

  const search = ref('')
  const status = ref('all')
  const page = ref(1)

  const rows = computed<User[]>(() => (store.users.data?.data ?? []) as User[])
  const lastPage = computed(() => store.users.data?.meta.last_page ?? 1)
  const total = computed(() => store.users.data?.meta.total ?? 0)
  const activeCount = computed(() => rows.value.filter((row) => row.status === 'active').length)

  /** Catálogo de agencias para el alta (ámbito obligatorio de los roles operativos). */
  const agencies = useAsyncData(listAgencies)

  const agencyOptions = computed(() =>
    (agencies.data.value ?? []).map((agency) => ({ id: agency.id, name: agency.name })),
  )

  /** El catálogo de agencias solo se pide la primera vez que se abre el alta. */
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
      status: status.value === 'all' ? undefined : (status.value as UserStatus),
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
    search.value.trim() === '' && status.value === 'all'
      ? 'No users registered yet.'
      : 'No users match the filters.',
  )

  const columns: Column[] = [
    { key: 'name', label: 'User' },
    { key: 'status', label: 'Status' },
    { key: 'roles', label: 'Roles' },
    { key: 'agencies', label: 'Agency scope' },
    { key: 'last_login_at', label: 'Last login' },
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

  async function submitUser(payload: CreateUserPayload): Promise<void> {
    submitting.value = true
    formError.value = null

    try {
      await store.createUser(payload)
      success('User created.')
      closeForm()
    } catch (caught) {
      formError.value = caught instanceof ApiError ? caught : toApiError(caught)
    } finally {
      submitting.value = false
    }
  }

  // --- Acciones de fila ----------------------------------------------------

  const actingId = ref<number | null>(null)

  async function setStatus(id: number, next: UserStatus): Promise<void> {
    actingId.value = id

    try {
      await store.changeStatus(id, next)
      success(next === 'active' ? 'User reactivated.' : 'User suspended.')
    } catch (caught) {
      toastError((caught instanceof ApiError ? caught : toApiError(caught)).message)
    } finally {
      actingId.value = null
    }
  }

  async function unlock(id: number): Promise<void> {
    actingId.value = id

    try {
      await store.unlock(id)
      success('User unlocked.')
    } catch (caught) {
      toastError((caught instanceof ApiError ? caught : toApiError(caught)).message)
    } finally {
      actingId.value = null
    }
  }

  return {
    PER_PAGE,
    users: store.users,
    agencyOptions,
    loadAgencies,
    canManage,
    search,
    status,
    statusOptions: STATUS_OPTIONS,
    page,
    rows,
    lastPage,
    total,
    activeCount,
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
    submitUser,
    actingId,
    setStatus,
    unlock,
  }
}
