import { beforeEach, describe, expect, it, vi } from 'vitest'

import * as devicesApi from '@/modules/devices/api'
import type { Device } from '../../types/devices.types'

/** Dispositivos: listado paginado y revocación. */

const { httpMock } = vi.hoisted(() => ({
  httpMock: {
    get: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
    delete: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
  },
}))

vi.mock('@/core/api/client', () => ({ http: httpMock }))

const device: Device = {
  id: 4,
  user_id: 12,
  device_name: 'PDA A1',
  platform: 'pda',
  device_uuid: 'uuid-pda-1',
  app_version: '2.1.0',
  status: 'active',
  last_seen_at: '2026-10-18T21:07:28Z',
  revoked_at: null,
  created_at: '2026-10-01T10:00:00Z',
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('listDevices', () => {
  it('manda los filtros como query y devuelve el sobre con el meta', async () => {
    const envelope = {
      success: true,
      message: 'ok',
      data: [device],
      meta: { current_page: 1, last_page: 1, total: 1 },
    }

    httpMock.get.mockResolvedValue({ data: envelope })

    await expect(devicesApi.listDevices({ status: 'active', user_id: 12 })).resolves.toEqual(
      envelope,
    )
    expect(httpMock.get).toHaveBeenCalledWith('/api/v1/identity/devices', {
      params: { status: 'active', user_id: 12 },
    })
  })
})

describe('revokeDevice', () => {
  it('hace DELETE del dispositivo', async () => {
    httpMock.delete.mockResolvedValue({ data: { success: true, message: 'ok' } })

    await expect(devicesApi.revokeDevice(4)).resolves.toBeUndefined()
    expect(httpMock.delete).toHaveBeenCalledWith('/api/v1/identity/devices/4')
  })
})
