import { beforeEach, describe, expect, it, vi } from 'vitest'

import * as attendanceApi from '@/modules/attendance/api'
import type { Attendance, AttendanceDay } from '../../types/attendance.types'

/** Marcaciones: listado paginado, alta idempotente, anulación y consolidado. */

const { httpMock } = vi.hoisted(() => ({
  httpMock: {
    get: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
    post: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
  },
}))

vi.mock('@/core/api/client', () => ({ http: httpMock }))

const record: Attendance = {
  id: 5,
  employee_id: 9,
  agency_id: 37,
  type: 'in',
  marked_at: '2026-10-18T08:02:00Z',
  source: 'web',
  device_id: null,
  latitude: null,
  longitude: null,
  ip_address: '127.0.0.1',
  status: 'valid',
  idempotency_key: 'uuid-1',
  created_at: '2026-10-18T08:02:00Z',
}

const day: AttendanceDay = {
  employee_id: 9,
  work_date: '2026-10-18',
  first_in_at: '2026-10-18T08:02:00Z',
  last_out_at: '2026-10-18T17:30:00Z',
  worked_minutes: 540,
  late_minutes: 2,
  status: 'valid',
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('listAttendance', () => {
  it('manda los filtros como query y devuelve el sobre con el meta', async () => {
    const envelope = {
      success: true,
      message: 'ok',
      data: [record],
      meta: { current_page: 1, last_page: 1, total: 1 },
    }

    httpMock.get.mockResolvedValue({ data: envelope })

    await expect(attendanceApi.listAttendance({ status: 'valid', agency_id: 37 })).resolves.toEqual(
      envelope,
    )
    expect(httpMock.get).toHaveBeenCalledWith('/api/v1/identity/attendance', {
      params: { status: 'valid', agency_id: 37 },
    })
  })
})

describe('attendanceSummary', () => {
  it('devuelve solo la colección (el consolidado no pagina)', async () => {
    httpMock.get.mockResolvedValue({
      data: { success: true, message: 'ok', data: [day] },
    })

    await expect(attendanceApi.attendanceSummary({ from: '2026-10-01' })).resolves.toEqual([day])
    expect(httpMock.get).toHaveBeenCalledWith('/api/v1/identity/attendance/summary', {
      params: { from: '2026-10-01' },
    })
  })
})

describe('registerAttendance', () => {
  it('manda la idempotency_key y devuelve la marcación', async () => {
    const payload = {
      employee_id: 9,
      agency_id: 37,
      type: 'in' as const,
      source: 'web' as const,
      idempotency_key: 'uuid-1',
    }

    httpMock.post.mockResolvedValue({
      data: { success: true, message: 'created', data: record },
    })

    await expect(attendanceApi.registerAttendance(payload)).resolves.toEqual(record)
    expect(httpMock.post).toHaveBeenCalledWith('/api/v1/identity/attendance', payload)
  })
})

describe('voidAttendance', () => {
  it('hace POST a /void', async () => {
    httpMock.post.mockResolvedValue({ data: { success: true, message: 'ok' } })

    await expect(attendanceApi.voidAttendance(5)).resolves.toBeUndefined()
    expect(httpMock.post).toHaveBeenCalledWith('/api/v1/identity/attendance/5/void')
  })
})
