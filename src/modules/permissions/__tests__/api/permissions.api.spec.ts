import { beforeEach, describe, expect, it, vi } from 'vitest'

import * as permissionsApi from '@/modules/permissions/api'
import type { Permission, Role } from '../../types/permissions.types'

/**
 * Roles y permisos: los dos listados envuelven la colección en `data.roles` /
 * `data.permissions`, y la asignación sustituye los permisos del rol.
 */

const { httpMock } = vi.hoisted(() => ({
  httpMock: {
    get: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
    post: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
  },
}))

vi.mock('@/core/api/client', () => ({ http: httpMock }))

const role: Role = {
  id: 4,
  name: 'counter',
  guard_name: 'web',
  permissions: ['persons.view'],
  created_at: '2026-10-18T20:18:04.000000Z',
  updated_at: '2026-10-18T20:18:04.000000Z',
}

const permission: Permission = {
  id: 1,
  name: 'orders.view',
  guard_name: 'web',
  created_at: '2026-10-18T20:18:04.000000Z',
  updated_at: '2026-10-18T20:18:04.000000Z',
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('listRoles', () => {
  it('desenvuelve `data.roles`', async () => {
    httpMock.get.mockResolvedValue({
      data: { success: true, message: 'ok', data: { roles: [role] } },
    })

    await expect(permissionsApi.listRoles()).resolves.toEqual([role])
    expect(httpMock.get).toHaveBeenCalledWith('/api/v1/permission/roles')
  })

  it('sin `data.roles` devuelve una lista vacía', async () => {
    httpMock.get.mockResolvedValue({ data: { success: true, message: 'ok', data: {} } })

    await expect(permissionsApi.listRoles()).resolves.toEqual([])
  })
})

describe('listPermissions', () => {
  it('desenvuelve `data.permissions`', async () => {
    httpMock.get.mockResolvedValue({
      data: { success: true, message: 'ok', data: { permissions: [permission] } },
    })

    await expect(permissionsApi.listPermissions()).resolves.toEqual([permission])
    expect(httpMock.get).toHaveBeenCalledWith('/api/v1/permission/permissions')
  })
})

describe('assignPermissions', () => {
  it('manda los ids a la ruta del rol', async () => {
    httpMock.post.mockResolvedValue({
      data: { success: true, message: 'updated', data: role },
    })

    await permissionsApi.assignPermissions(4, { permission_ids: [1, 2] })

    expect(httpMock.post).toHaveBeenCalledWith('/api/v1/permission/roles/4/permissions', {
      permission_ids: [1, 2],
    })
  })
})
