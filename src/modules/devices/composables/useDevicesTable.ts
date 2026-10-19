import { computed, ref } from 'vue'

import { ApiError, toApiError } from '@/core/api/errors'
import type { Column } from '@/core/components/types'
import { useAuth } from '@/core/composables/useAuth'
import { useToast } from '@/core/composables/useToast'

import { PER_PAGE, useDevicesStore } from '../stores/useDevicesStore'
import type { Device, DeviceStatus } from '../types/devices.types'

/**
 * Lógica de la pantalla de dispositivos: filtros y paginación de servidor y la
 * revocación (UC-19), que deja el token inservible al instante.
 */

const STATUS_OPTIONS = [
  { label: 'All statuses', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Revoked', value: 'revoked' },
]

export function useDevicesTable() {
  const store = useDevicesStore()
  const { can } = useAuth()
  const { success, error: toastError } = useToast()

  const canManage = computed(() => can('devices.manage'))

  const status = ref('all')
  const userId = ref('')
  const page = ref(1)

  const rows = computed<Device[]>(() => (store.devices.data?.data ?? []) as Device[])
  const lastPage = computed(() => store.devices.data?.meta.last_page ?? 1)
  const total = computed(() => store.devices.data?.meta.total ?? 0)
  const activeCount = computed(() => rows.value.filter((row) => row.status === 'active').length)

  function reload(): void {
    void store.load({
      page: page.value,
      per_page: PER_PAGE,
      status: status.value === 'all' ? undefined : (status.value as DeviceStatus),
      user_id: userId.value === '' ? undefined : Number(userId.value),
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
    status.value === 'all' && userId.value === ''
      ? 'No devices registered yet.'
      : 'No devices match the filters.',
  )

  const columns: Column[] = [
    { key: 'device_name', label: 'Device' },
    { key: 'platform', label: 'Platform' },
    { key: 'app_version', label: 'App version' },
    { key: 'last_seen_at', label: 'Last seen' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: '' },
  ]

  const actingId = ref<number | null>(null)

  async function revoke(id: number): Promise<void> {
    actingId.value = id

    try {
      await store.revoke(id)
      success('Device revoked.')
    } catch (caught) {
      toastError((caught instanceof ApiError ? caught : toApiError(caught)).message)
    } finally {
      actingId.value = null
    }
  }

  return {
    PER_PAGE,
    devices: store.devices,
    canManage,
    status,
    statusOptions: STATUS_OPTIONS,
    userId,
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
    actingId,
    revoke,
  }
}
