import { beforeEach, describe, expect, it, vi } from 'vitest'

import * as customersApi from '@/core/api/customers'
import type { Company, Person } from '@/core/api/types'

/**
 * Clientes: la capa API desenvuelve el sobre y devuelve las filas. El cliente
 * HTTP va mockeado: aquí no hay red.
 */

const { httpMock } = vi.hoisted(() => ({
  httpMock: {
    get: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
    post: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
  },
}))

vi.mock('@/core/api/client', () => ({ http: httpMock }))

const person: Person = {
  id: 30,
  document_type: 'DNI',
  document_number: '51757680',
  first_name: 'Noah',
  last_name: 'Cronin',
  email: 'noah@example.net',
  phone: '203-867-3351',
  created_at: '2026-10-18T21:31:29.000000Z',
}

const company: Company = {
  id: 7,
  tax_id: '20151757680',
  business_name: 'Hirthe Inc S.A.C.',
  trade_name: 'Hauck-Leuschke',
  address: '544 Aglae Ridge Apt. 067',
  contact_email: 'contact@example.com',
  contact_phone: '417-663-0574',
  created_at: '2026-10-18T21:31:29.000000Z',
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('listPersons', () => {
  it('devuelve las filas del sobre', async () => {
    httpMock.get.mockResolvedValue({
      data: { success: true, message: 'ok', data: [person] },
    })

    await expect(customersApi.listPersons()).resolves.toEqual([person])
    expect(httpMock.get).toHaveBeenCalledWith('/api/v1/customer/persons')
  })

  it('sin `data` en la respuesta devuelve una lista vacía', async () => {
    httpMock.get.mockResolvedValue({
      data: { success: true, message: 'ok' },
    })

    await expect(customersApi.listPersons()).resolves.toEqual([])
  })
})

describe('createPerson', () => {
  it('manda el payload y devuelve el sobre', async () => {
    const payload = {
      document_type: 'DNI',
      document_number: '51757680',
      first_name: 'Noah',
      last_name: 'Cronin',
      email: null,
      phone: null,
    }

    httpMock.post.mockResolvedValue({
      data: { success: true, message: 'created', data: person },
    })

    await expect(customersApi.createPerson(payload)).resolves.toMatchObject({ data: person })
    expect(httpMock.post).toHaveBeenCalledWith('/api/v1/customer/persons', payload)
  })
})

describe('listCompanies / createCompany', () => {
  it('devuelve las filas del sobre', async () => {
    httpMock.get.mockResolvedValue({
      data: { success: true, message: 'ok', data: [company] },
    })

    await expect(customersApi.listCompanies()).resolves.toEqual([company])
    expect(httpMock.get).toHaveBeenCalledWith('/api/v1/customer/companies')
  })

  it('el alta manda el payload a la ruta de empresas', async () => {
    const payload = {
      tax_id: '20151757680',
      business_name: 'Hirthe Inc S.A.C.',
      trade_name: null,
      address: null,
      contact_email: null,
      contact_phone: null,
    }

    httpMock.post.mockResolvedValue({
      data: { success: true, message: 'created', data: company },
    })

    await customersApi.createCompany(payload)

    expect(httpMock.post).toHaveBeenCalledWith('/api/v1/customer/companies', payload)
  })
})
