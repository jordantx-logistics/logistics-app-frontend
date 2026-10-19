import { beforeEach, describe, expect, it, vi } from 'vitest'

import * as employeesApi from '@/modules/employees/api'
import type { Employee } from '../../types/employees.types'

/** Empleados: listado paginado, alta, edición y baja. */

const { httpMock } = vi.hoisted(() => ({
  httpMock: {
    get: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
    post: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
    put: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
    delete: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
  },
}))

vi.mock('@/core/api/client', () => ({ http: httpMock }))

const employee: Employee = {
  id: 9,
  person_id: null,
  document_type: 'DNI',
  document_number: '12345678',
  first_name: 'Ana',
  last_name: 'Quispe',
  full_name: 'Ana Quispe',
  email: 'ana@empresa.com',
  phone: null,
  position: 'Counter clerk',
  agency_id: 37,
  hired_at: '2026-01-15',
  terminated_at: null,
  status: 'active',
  created_at: '2026-01-15T09:00:00Z',
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('listEmployees', () => {
  it('manda los filtros como query y devuelve el sobre con el meta', async () => {
    const envelope = {
      success: true,
      message: 'ok',
      data: [employee],
      meta: { current_page: 1, last_page: 2, total: 20 },
    }

    httpMock.get.mockResolvedValue({ data: envelope })

    await expect(employeesApi.listEmployees({ status: 'active', q: 'ana' })).resolves.toEqual(
      envelope,
    )
    expect(httpMock.get).toHaveBeenCalledWith('/api/v1/identity/employees', {
      params: { status: 'active', q: 'ana' },
    })
  })
})

describe('createEmployee', () => {
  it('manda el payload y devuelve la ficha creada', async () => {
    const payload = {
      document_type: 'DNI' as const,
      document_number: '12345678',
      first_name: 'Ana',
      last_name: 'Quispe',
      position: 'Counter clerk',
      agency_id: 37,
      hired_at: '2026-01-15',
    }

    httpMock.post.mockResolvedValue({
      data: { success: true, message: 'created', data: employee },
    })

    await expect(employeesApi.createEmployee(payload)).resolves.toEqual(employee)
    expect(httpMock.post).toHaveBeenCalledWith('/api/v1/identity/employees', payload)
  })
})

describe('updateEmployee', () => {
  it('hace PUT a la ficha y devuelve el empleado actualizado', async () => {
    httpMock.put.mockResolvedValue({
      data: { success: true, message: 'ok', data: { ...employee, position: 'Supervisor' } },
    })

    await expect(
      employeesApi.updateEmployee(9, {
        document_type: 'DNI',
        document_number: '12345678',
        first_name: 'Ana',
        last_name: 'Quispe',
        position: 'Supervisor',
        agency_id: 37,
        hired_at: '2026-01-15',
      }),
    ).resolves.toMatchObject({ position: 'Supervisor' })

    expect(httpMock.put).toHaveBeenCalledWith('/api/v1/identity/employees/9', expect.anything())
  })
})

describe('deactivateEmployee', () => {
  it('hace DELETE de la ficha', async () => {
    httpMock.delete.mockResolvedValue({ data: { success: true, message: 'ok' } })

    await expect(employeesApi.deactivateEmployee(9)).resolves.toBeUndefined()
    expect(httpMock.delete).toHaveBeenCalledWith('/api/v1/identity/employees/9')
  })
})
