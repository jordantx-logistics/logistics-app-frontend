import { beforeEach, describe, expect, it, vi } from 'vitest'

import * as usersApi from '@/modules/users/api'
import type { User } from '../../types/users.types'

/** Usuarios: listado paginado, alta y acciones de estado. */

const { httpMock } = vi.hoisted(() => ({
  httpMock: {
    get: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
    post: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
    put: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
    patch: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
    delete: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
  },
}))

vi.mock('@/core/api/client', () => ({ http: httpMock }))

const user: User = {
  id: 12,
  name: 'Ana Quispe',
  email: 'ana@empresa.com',
  status: 'active',
  employee_id: null,
  must_change_password: true,
  failed_login_attempts: 0,
  locked_until: null,
  last_login_at: null,
  roles: ['employee'],
  agencies: [{ id: 37, name: 'LogiTrack Lima', is_primary: true }],
  created_at: '2026-10-18T21:07:28Z',
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('listUsers', () => {
  it('manda los filtros como query y devuelve el sobre con el meta', async () => {
    const envelope = {
      success: true,
      message: 'ok',
      data: [user],
      meta: { current_page: 1, last_page: 3, total: 40 },
    }

    httpMock.get.mockResolvedValue({ data: envelope })

    await expect(usersApi.listUsers({ page: 2, status: 'active' })).resolves.toEqual(envelope)
    expect(httpMock.get).toHaveBeenCalledWith('/api/v1/identity/users', {
      params: { page: 2, status: 'active' },
    })
  })
})

describe('createUser', () => {
  it('manda el payload y devuelve la fila creada', async () => {
    const payload = {
      name: 'Ana Quispe',
      email: 'ana@empresa.com',
      password: 'Secreta12345',
      agency_ids: [37],
    }

    httpMock.post.mockResolvedValue({
      data: { success: true, message: 'created', data: user },
    })

    await expect(usersApi.createUser(payload)).resolves.toEqual(user)
    expect(httpMock.post).toHaveBeenCalledWith('/api/v1/identity/users', payload)
  })
})

describe('changeUserStatus', () => {
  it('hace PATCH a /status con el estado destino', async () => {
    httpMock.patch.mockResolvedValue({
      data: { success: true, message: 'ok', data: { ...user, status: 'suspended' } },
    })

    await expect(usersApi.changeUserStatus(12, { status: 'suspended' })).resolves.toMatchObject({
      status: 'suspended',
    })
    expect(httpMock.patch).toHaveBeenCalledWith('/api/v1/identity/users/12/status', {
      status: 'suspended',
    })
  })
})

describe('suspendUser y unlockUser', () => {
  it('usan DELETE y POST .../unlock respectivamente', async () => {
    httpMock.delete.mockResolvedValue({ data: { success: true, message: 'ok' } })
    httpMock.post.mockResolvedValue({ data: { success: true, message: 'ok' } })

    await expect(usersApi.suspendUser(12)).resolves.toBeUndefined()
    await expect(usersApi.unlockUser(12)).resolves.toBeUndefined()

    expect(httpMock.delete).toHaveBeenCalledWith('/api/v1/identity/users/12')
    expect(httpMock.post).toHaveBeenCalledWith('/api/v1/identity/users/12/unlock')
  })
})
