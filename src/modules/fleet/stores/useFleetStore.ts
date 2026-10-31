import { ref } from 'vue'
import { defineStore } from 'pinia'

import { useAsyncData } from '@/core/composables/useAsyncData'

import * as fleetApi from '../api/fleet.api'
import type { DriversQuery, ExpensesQuery, RoutesQuery, VehiclesQuery } from '../types/fleet.types'

/**
 * Estado del módulo **fleet**.
 *
 * Cada listado guarda su consulta. `act` envuelve una mutación: marca `saving` y
 * recarga los listados afectados desde el API, que es quien decide el estado real.
 */
export const useFleetStore = defineStore('fleet', () => {
  const PER_PAGE = 15

  const driversQuery = ref<DriversQuery>({ page: 1, per_page: PER_PAGE })
  const vehiclesQuery = ref<VehiclesQuery>({ page: 1, per_page: PER_PAGE })
  const routesQuery = ref<RoutesQuery>({ page: 1, per_page: PER_PAGE })
  const expensesQuery = ref<ExpensesQuery>({ page: 1, per_page: PER_PAGE })
  const saving = ref(false)

  const drivers = useAsyncData(() => fleetApi.listDrivers(driversQuery.value))
  const vehicles = useAsyncData(() => fleetApi.listVehicles(vehiclesQuery.value))
  const routes = useAsyncData(() => fleetApi.listRoutes(routesQuery.value))
  const expenses = useAsyncData(() => fleetApi.listExpenses(expensesQuery.value))

  async function setDriversQuery(next: DriversQuery): Promise<void> {
    driversQuery.value = { ...next, page: next.page ?? 1, per_page: PER_PAGE }
    await drivers.load()
  }

  async function setVehiclesQuery(next: VehiclesQuery): Promise<void> {
    vehiclesQuery.value = { ...next, page: next.page ?? 1, per_page: PER_PAGE }
    await vehicles.load()
  }

  async function setRoutesQuery(next: RoutesQuery): Promise<void> {
    routesQuery.value = { ...next, page: next.page ?? 1, per_page: PER_PAGE }
    await routes.load()
  }

  async function setExpensesQuery(next: ExpensesQuery): Promise<void> {
    expensesQuery.value = { ...next, page: next.page ?? 1, per_page: PER_PAGE }
    await expenses.load()
  }

  async function act<T>(mutation: () => Promise<T>, reload: () => Promise<unknown>): Promise<T> {
    saving.value = true

    try {
      const result = await mutation()
      await reload()

      return result
    } finally {
      saving.value = false
    }
  }

  return {
    saving,
    drivers,
    vehicles,
    routes,
    expenses,
    driversQuery,
    vehiclesQuery,
    routesQuery,
    expensesQuery,
    setDriversQuery,
    setVehiclesQuery,
    setRoutesQuery,
    setExpensesQuery,
    act,
  }
})
