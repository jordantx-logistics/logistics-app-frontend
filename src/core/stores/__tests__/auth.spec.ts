import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import * as authApi from '@/core/api/auth'
import { ApiError } from '@/core/api/errors'
import { useAuthStore } from '@/core/stores/auth'
import type { MeResponse } from '@/core/api/types'

vi.mock('@/core/api/auth', () => ({
  login: vi.fn<typeof import('@/core/api/auth').login>(),
  issueToken: vi.fn<typeof import('@/core/api/auth').issueToken>(),
  me: vi.fn<typeof import('@/core/api/auth').me>(),
  logout: vi.fn<typeof import('@/core/api/auth').logout>(),
  logoutAll: vi.fn<typeof import('@/core/api/auth').logoutAll>(),
  forgotPassword: vi.fn<typeof import('@/core/api/auth').forgotPassword>(),
  resetPassword: vi.fn<typeof import('@/core/api/auth').resetPassword>(),
}))

/** Sesión como la manda el backend (`GET /auth/me`). */
function session(data: Partial<MeResponse['data']> = {}): MeResponse {
  return {
    success: true,
    message: 'ok',
    data: {
      user: { id: 1, name: 'Admin', email: 'admin@test.com' },
      roles: ['admin'],
      permissions: ['orders.create', 'agencies.view'],
      agencies: [1],
      ...data,
    },
  }
}

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
})

describe('store de sesión', () => {
  it('empieza sin sesión y sin datos de autorización', () => {
    const store = useAuthStore()

    expect(store.isAuthenticated).toBe(false)
    expect(store.initialized).toBe(false)
    expect(store.user).toBeNull()
    expect(store.can('orders.create')).toBe(false)
    expect(store.hasRole('admin')).toBe(false)
  })

  it('guarda usuario, roles, permisos y agencias al iniciar sesión', async () => {
    vi.mocked(authApi.login).mockResolvedValue(session())

    const store = useAuthStore()
    await store.login({ email: 'admin@test.com', password: 'secret123' })

    expect(authApi.login).toHaveBeenCalledWith({ email: 'admin@test.com', password: 'secret123' })
    expect(store.isAuthenticated).toBe(true)
    expect(store.initialized).toBe(true)
    expect(store.user).toEqual({ id: 1, name: 'Admin', email: 'admin@test.com' })
    expect(store.roles).toEqual(['admin'])
    expect(store.agencies).toEqual([1])
    expect(store.can('orders.create')).toBe(true)
    expect(store.can('agencies.manage')).toBe(false)
    expect(store.hasRole('admin')).toBe(true)
    expect(store.hasRole('counter')).toBe(false)
  })

  it('deja la sesión fuera si `/auth/me` responde 401', async () => {
    vi.mocked(authApi.me).mockRejectedValue(new ApiError('Unauthenticated.', 401))

    const store = useAuthStore()

    await expect(store.fetchMe()).resolves.toBe(false)
    expect(store.isAuthenticated).toBe(false)
    expect(store.user).toBeNull()
    expect(store.initialized).toBe(true)
  })

  it('propaga los errores que no son de sesión (red, 5xx)', async () => {
    vi.mocked(authApi.me).mockRejectedValue(new ApiError('Could not reach the server.', null))

    const store = useAuthStore()

    await expect(store.fetchMe()).rejects.toBeInstanceOf(ApiError)
    expect(store.isAuthenticated).toBe(false)
    expect(store.initialized).toBe(true)
  })

  it('comprueba la sesión una sola vez', async () => {
    vi.mocked(authApi.me).mockResolvedValue(session())

    const store = useAuthStore()

    await expect(store.ensureSession()).resolves.toBe(true)
    await expect(store.ensureSession()).resolves.toBe(true)

    expect(authApi.me).toHaveBeenCalledTimes(1)
  })

  it('limpia la sesión al cerrarla, aunque el backend falle', async () => {
    vi.mocked(authApi.login).mockResolvedValue(session())
    vi.mocked(authApi.logout).mockRejectedValue(new ApiError('Could not reach the server.', null))

    const store = useAuthStore()
    await store.login({ email: 'admin@test.com', password: 'secret123' })

    await expect(store.logout()).rejects.toBeInstanceOf(ApiError)
    expect(store.isAuthenticated).toBe(false)
    expect(store.permissions).toEqual([])
    expect(store.agencies).toEqual([])
  })

  it('cierra todas las sesiones', async () => {
    vi.mocked(authApi.login).mockResolvedValue(session())
    vi.mocked(authApi.logoutAll).mockResolvedValue({
      success: true,
      message: 'Successfully logged out from all devices.',
    })

    const store = useAuthStore()
    await store.login({ email: 'admin@test.com', password: 'secret123' })
    await store.logoutAll()

    expect(authApi.logoutAll).toHaveBeenCalledTimes(1)
    expect(store.isAuthenticated).toBe(false)
  })
})
