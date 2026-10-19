import { computed, ref, watch } from 'vue'

import { ApiError, toApiError } from '@/core/api/errors'
import type { Column } from '@/core/components/types'
import { useAuth } from '@/core/composables/useAuth'
import { useToast } from '@/core/composables/useToast'
import { matchesQuery, pageCount, slicePage } from '@/core/utils/list'

import { useAgenciesStore } from '../stores/useAgenciesStore'
import type { Agency, CreateAgencyPayload } from '../types/agencies.types'

/**
 * Lógica de la pantalla de agencias: búsqueda local (el listado viene entero
 * del API, ya filtrado por ámbito en el backend), paginación y el alta en
 * modal. El estado de datos vive en `stores/useAgenciesStore.ts`.
 */

const PER_PAGE = 10

export function useAgenciesTable() {
  const store = useAgenciesStore()
  const { can } = useAuth()
  const { success } = useToast()

  const canCreate = computed(() => can('agencies.manage'))

  const search = ref('')
  const page = ref(1)

  watch(search, () => {
    page.value = 1
  })

  const filtered = computed(() => {
    const rows: Agency[] = store.agencies.data ?? []

    return rows.filter((row) =>
      matchesQuery([row.code, row.name, row.district, row.address, row.phone], search.value),
    )
  })

  const visibleRows = computed(() => slicePage(filtered.value, page.value, PER_PAGE))
  const lastPage = computed(() => pageCount(filtered.value.length, PER_PAGE))
  const activeCount = computed(
    () => (store.agencies.data ?? []).filter((row) => row.is_active).length,
  )

  const emptyText = computed(() =>
    search.value.trim() === '' ? 'No agencies registered yet.' : 'No agencies match the search.',
  )

  const columns: Column[] = [
    { key: 'code', label: 'Code' },
    { key: 'name', label: 'Agency' },
    { key: 'district', label: 'District' },
    { key: 'address', label: 'Address' },
    { key: 'phone', label: 'Phone' },
    { key: 'is_active', label: 'Status' },
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

  async function submitAgency(payload: CreateAgencyPayload): Promise<void> {
    submitting.value = true
    formError.value = null

    try {
      await store.createAgency(payload)
      success('Agency created.')
      closeForm()
    } catch (caught) {
      formError.value = caught instanceof ApiError ? caught : toApiError(caught)
    } finally {
      submitting.value = false
    }
  }

  return {
    PER_PAGE,
    agencies: store.agencies,
    canCreate,
    search,
    page,
    filtered,
    visibleRows,
    lastPage,
    activeCount,
    emptyText,
    columns,
    showForm,
    submitting,
    formError,
    openForm,
    closeForm,
    submitAgency,
  }
}
