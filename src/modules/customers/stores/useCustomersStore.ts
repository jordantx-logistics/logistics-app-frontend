import { defineStore } from 'pinia'

import { useAsyncData } from '@/core/composables/useAsyncData'

import * as customersApi from '../api/customers.api'
import type { CreateCompanyPayload, CreatePersonPayload } from '../types/customers.types'

/**
 * Estado del módulo **customers**: los dos listados (personas y empresas) y sus
 * altas. La sesión y los permisos NO viven aquí (son de core/); esto es solo
 * dominio de clientes.
 *
 * Cada alta recarga su listado del API en vez de insertar la fila a mano, como
 * venía haciéndose (el listado no viene paginado del servidor).
 */
export const useCustomersStore = defineStore('customers', () => {
  const persons = useAsyncData(customersApi.listPersons)
  const companies = useAsyncData(customersApi.listCompanies)

  /** Da de alta una persona y deja la lista del API al día. */
  async function createPerson(payload: CreatePersonPayload): Promise<void> {
    await customersApi.createPerson(payload)
    await persons.load()
  }

  /** Da de alta una empresa y deja la lista del API al día. */
  async function createCompany(payload: CreateCompanyPayload): Promise<void> {
    await customersApi.createCompany(payload)
    await companies.load()
  }

  return {
    persons,
    companies,
    createPerson,
    createCompany,
  }
})
