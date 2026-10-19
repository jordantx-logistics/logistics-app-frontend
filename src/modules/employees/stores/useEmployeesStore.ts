import { defineStore } from 'pinia'
import { ref } from 'vue'

import { useAsyncData } from '@/core/composables/useAsyncData'

import * as employeesApi from '../api/employees.api'
import type {
  CreateEmployeePayload,
  Employee,
  UpdateEmployeePayload,
} from '../types/employees.types'

/** Filas por página del listado de empleados (lo pagina el backend). */
export const PER_PAGE = 15

/**
 * Estado del módulo **employees**: el listado paginado y las mutaciones. El
 * filtrado y la paginación son de servidor, así que el store guarda la última
 * consulta y cada mutación recarga el listado.
 */
export const useEmployeesStore = defineStore('employees', () => {
  const query = ref<employeesApi.EmployeeListQuery>({ page: 1, per_page: PER_PAGE })

  const employees = useAsyncData(() => employeesApi.listEmployees(query.value))

  /** Carga (o recarga) el listado con los filtros indicados. */
  async function load(next: employeesApi.EmployeeListQuery = {}): Promise<void> {
    query.value = { ...query.value, ...next }
    await employees.load()
  }

  /** Alta: deja el listado al día y devuelve la ficha creada. */
  async function createEmployee(payload: CreateEmployeePayload): Promise<Employee> {
    const created = await employeesApi.createEmployee(payload)
    await employees.load()

    return created
  }

  /** Edición: deja el listado al día. */
  async function updateEmployee(id: number, payload: UpdateEmployeePayload): Promise<Employee> {
    const updated = await employeesApi.updateEmployee(id, payload)
    await employees.load()

    return updated
  }

  /** Baja (UC-09). */
  async function deactivateEmployee(id: number): Promise<void> {
    await employeesApi.deactivateEmployee(id)
    await employees.load()
  }

  return {
    employees,
    query,
    load,
    createEmployee,
    updateEmployee,
    deactivateEmployee,
  }
})
