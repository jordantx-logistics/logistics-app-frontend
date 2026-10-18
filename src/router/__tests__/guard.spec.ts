import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { RouteLocationNormalized } from 'vue-router'

import * as authApi from '@/core/api/auth'
import { ApiError } from '@/core/api/errors'
import { authGuard } from '@/router/guard'
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

const SESSION: MeResponse = {
  success: true,
  message: 'ok',
  data: {
    user: { id: 1, name: 'Admin', email: 'admin@test.com' },
    roles: ['admin'],
    permissions: ['orders.create'],
    agencies: [1],
  },
}

function route(overrides: Partial<RouteLocationNormalized> = {}): RouteLocationNormalized {
  return {
    meta: {},
    name: 'orders',
    path: '/orders',
    fullPath: '/orders',
    ...overrides,
  } as RouteLocationNormalized
}

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
})

describe('guard de sesión', () => {
  it('manda al login si la ruta exige sesión y no hay', async () => {
    vi.mocked(authApi.me).mockRejectedValue(new ApiError('Unauthenticated.', 401))

    await expect(
      authGuard(route({ meta: { requiresAuth: true }, fullPath: '/orders' })),
    ).resolves.toEqual({
      name: 'login',
      query: { redirect: '/orders' },
    })
  })

  it('no añade `redirect` al entrar por la raíz', async () => {
    vi.mocked(authApi.me).mockRejectedValue(new ApiError('Unauthenticated.', 401))

    await expect(
      authGuard(route({ name: 'dashboard', path: '/', fullPath: '/' })),
    ).resolves.toEqual({
      name: 'login',
      query: {},
    })
  })

  it('deja pasar las rutas públicas sin sesión', async () => {
    vi.mocked(authApi.me).mockRejectedValue(new ApiError('Unauthenticated.', 401))

    await expect(
      authGuard(route({ name: 'login', path: '/auth/login', meta: { requiresAuth: false } })),
    ).resolves.toBe(true)
  })

  it('deja pasar las rutas protegidas con sesión', async () => {
    vi.mocked(authApi.me).mockResolvedValue(SESSION)

    await expect(authGuard(route({ meta: { requiresAuth: true } }))).resolves.toBe(true)
  })

  it('saca del login a quien ya tiene sesión', async () => {
    vi.mocked(authApi.me).mockResolvedValue(SESSION)

    await expect(
      authGuard(route({ name: 'login', path: '/auth/login', meta: { requiresAuth: false } })),
    ).resolves.toEqual({ name: 'dashboard' })
  })

  it('no entra en una ruta cuyo permiso no tiene', async () => {
    vi.mocked(authApi.me).mockResolvedValue(SESSION)

    await expect(
      authGuard(route({ meta: { requiresAuth: true, permission: 'roles.manage' } })),
    ).resolves.toEqual({
      name: 'dashboard',
    })
    await expect(
      authGuard(route({ meta: { requiresAuth: true, permission: 'orders.create' } })),
    ).resolves.toBe(true)
  })

  it('comprueba la sesión una sola vez entre navegaciones', async () => {
    vi.mocked(authApi.me).mockResolvedValue(SESSION)

    await authGuard(route({ meta: { requiresAuth: true } }))
    await authGuard(route({ name: 'login', path: '/auth/login', meta: { requiresAuth: false } }))

    expect(authApi.me).toHaveBeenCalledTimes(1)
  })

  it('no revienta si el backend no responde: manda al login', async () => {
    vi.mocked(authApi.me).mockRejectedValue(
      new ApiError('No se pudo contactar con el servidor.', null),
    )

    await expect(
      authGuard(route({ meta: { requiresAuth: true }, fullPath: '/orders' })),
    ).resolves.toEqual({
      name: 'login',
      query: { redirect: '/orders' },
    })
  })
})
