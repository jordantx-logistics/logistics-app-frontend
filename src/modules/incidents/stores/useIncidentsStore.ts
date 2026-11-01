import { ref } from 'vue'
import { defineStore } from 'pinia'

import { useAsyncData } from '@/core/composables/useAsyncData'

import * as incidentsApi from '../api/incidents.api'
import type { IncidentsQuery } from '../types/incidents.types'

/** Listado de incidencias con su consulta; las mutaciones recargan del API. */
export const useIncidentsStore = defineStore('incidents', () => {
  const PER_PAGE = 15

  const query = ref<IncidentsQuery>({ page: 1, per_page: PER_PAGE })
  const saving = ref(false)

  const incidents = useAsyncData(() => incidentsApi.listIncidents(query.value))

  async function setQuery(next: IncidentsQuery): Promise<void> {
    query.value = { ...next, page: next.page ?? 1, per_page: PER_PAGE }
    await incidents.load()
  }

  async function act<T>(mutation: () => Promise<T>): Promise<T> {
    saving.value = true

    try {
      const result = await mutation()
      await incidents.load()

      return result
    } finally {
      saving.value = false
    }
  }

  return { PER_PAGE, query, saving, incidents, setQuery, act }
})
