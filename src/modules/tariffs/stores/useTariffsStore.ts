import { ref } from 'vue'
import { defineStore } from 'pinia'

import { useAsyncData } from '@/core/composables/useAsyncData'

import * as tariffsApi from '../api/tariffs.api'

/** Datos maestros de precios. Cada alta recarga su listado desde el API. */
export const useTariffsStore = defineStore('tariffs', () => {
  const tariffsPage = ref(1)
  const tariffsSearch = ref('')
  const locationsPage = ref(1)
  const locationsSearch = ref('')
  const coveragesPage = ref(1)

  const tariffs = useAsyncData(() =>
    tariffsApi.listTariffs({
      page: tariffsPage.value,
      ...(tariffsSearch.value === '' ? {} : { q: tariffsSearch.value }),
    }),
  )
  const zones = useAsyncData(() => tariffsApi.listZones())
  const locations = useAsyncData(() =>
    tariffsApi.listLocations({
      page: locationsPage.value,
      ...(locationsSearch.value === '' ? {} : { q: locationsSearch.value }),
    }),
  )
  const coverages = useAsyncData(() => tariffsApi.listCoverages({ page: coveragesPage.value }))

  return {
    tariffsPage,
    tariffsSearch,
    locationsPage,
    locationsSearch,
    coveragesPage,
    tariffs,
    zones,
    locations,
    coverages,
  }
})
