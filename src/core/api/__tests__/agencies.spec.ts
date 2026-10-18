import { beforeEach, describe, expect, it, vi } from 'vitest'

import * as agenciesApi from '@/core/api/agencies'
import type { Agency } from '@/core/api/types'

/** Agencias: listado (con `is_active`) y alta. */

const { httpMock } = vi.hoisted(() => ({
  httpMock: {
    get: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
    post: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
  },
}))

vi.mock('@/core/api/client', () => ({ http: httpMock }))

const agency: Agency = {
  id: 37,
  code: 'LIM01',
  name: 'LogiTrack Lima',
  address: '99279 Kenyatta Knoll',
  phone: '870-215-1024',
  district: 'Lefflerhaven',
  is_active: true,
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('listAgencies', () => {
  it('devuelve las filas del sobre', async () => {
    httpMock.get.mockResolvedValue({
      data: { success: true, message: 'ok', data: [agency] },
    })

    await expect(agenciesApi.listAgencies()).resolves.toEqual([agency])
    expect(httpMock.get).toHaveBeenCalledWith('/api/v1/organization/agencies')
  })
})

describe('createAgency', () => {
  it('manda el payload y devuelve la agencia creada', async () => {
    const payload = {
      code: 'LIM01',
      name: 'LogiTrack Lima',
      address: null,
      phone: null,
      district: null,
      is_active: true,
    }

    httpMock.post.mockResolvedValue({
      data: { success: true, message: 'created', data: agency },
    })

    await expect(agenciesApi.createAgency(payload)).resolves.toMatchObject({ data: agency })
    expect(httpMock.post).toHaveBeenCalledWith('/api/v1/organization/agencies', payload)
  })
})
