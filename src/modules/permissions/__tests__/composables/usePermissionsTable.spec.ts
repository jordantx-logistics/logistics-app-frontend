import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'

import { usePermissionsTable } from '@/modules/permissions/composables/usePermissionsTable'
import { usePermissionsStore } from '@/modules/permissions/stores/usePermissionsStore'
import type { AssignPermissionsPayload, Role } from '@/modules/permissions/types/permissions.types'

/** Búsqueda local y asignación de permisos a un rol. */

const { httpMock, toast } = vi.hoisted(() => ({
  httpMock: {
    get: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
    post: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
    put: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
  },
  toast: { success: vi.fn<() => void>() },
}))

vi.mock('@/core/api/client', () => ({ http: httpMock }))
vi.mock('@/core/composables/useToast', () => ({ useToast: () => toast }))
vi.mock('@/core/composables/useAuth', () => ({ useAuth: () => ({ can: () => true }) }))

const role = { id: 1, name: 'admin', guard_name: 'web' } as unknown as Role

beforeEach(async () => {
  vi.clearAllMocks()
  setActivePinia(createPinia())
  httpMock.get.mockImplementation(async (url) =>
    String(url).includes('roles')
      ? { data: { data: { roles: [role, { id: 2, name: 'counter', guard_name: 'web' }] } } }
      : { data: { data: { permissions: [{ id: 5, name: 'orders.view', guard_name: 'web' }] } } },
  )
  httpMock.post.mockResolvedValue({ data: { data: role } })
  httpMock.put.mockResolvedValue({ data: { data: role } })

  const store = usePermissionsStore()
  await Promise.all([store.roles.load(), store.permissions.load()])
  await flushPromises()
})

describe('usePermissionsTable', () => {
  it('filtra roles y permisos', () => {
    const table = usePermissionsTable()

    table.search.value = 'coun'

    expect(table.filteredRoles.value).toHaveLength(1)
    expect(table.filteredPermissions.value).toHaveLength(0)
    expect(table.emptyText.value).toBe('Nothing matches the search.')
  })

  it('cambiar de pestaña limpia la búsqueda', async () => {
    const table = usePermissionsTable()

    expect(table.emptyText.value).toBe('No roles yet.')

    table.search.value = 'x'
    table.tab.value = 'permissions'
    await nextTick()

    expect(table.search.value).toBe('')
    expect(table.emptyText.value).toBe('No permissions yet.')
    expect(table.canManageRoles.value).toBe(true)
    expect(table.canSeePermissions.value).toBe(true)
  })

  it('asigna permisos al rol elegido', async () => {
    const table = usePermissionsTable()

    table.openPermissions(role)
    await table.submitPermissions({} as AssignPermissionsPayload)

    expect(toast.success).toHaveBeenCalledWith('Permissions updated for admin.')
    expect(table.selectedRole.value).toBeNull()
  })

  it('sin rol elegido no hace nada', async () => {
    const table = usePermissionsTable()

    await table.submitPermissions({} as AssignPermissionsPayload)

    expect(httpMock.post).not.toHaveBeenCalled()
    expect(httpMock.put).not.toHaveBeenCalled()
  })

  it('un fallo se queda en el formulario', async () => {
    httpMock.post.mockRejectedValue(new Error('boom'))
    httpMock.put.mockRejectedValue(new Error('boom'))
    const table = usePermissionsTable()

    table.openPermissions(role)
    await table.submitPermissions({} as AssignPermissionsPayload)

    expect(table.formError.value).not.toBeNull()
    expect(table.submitting.value).toBe(false)

    table.closePermissions()
    expect(table.formError.value).toBeNull()
  })
})
