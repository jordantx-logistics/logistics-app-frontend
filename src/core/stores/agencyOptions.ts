import { computed } from 'vue'
import { defineStore } from 'pinia'

import { http } from '@/core/api/client'
import { API_BASE_PATH } from '@/core/api/config'
import type { ResponseOf } from '@/core/api/types'
import { useAsyncData } from '@/core/composables/useAsyncData'

type OptionsResponse = ResponseOf<'/api/v1/organization/agencies/options', 'get'>

export type AgencyOption = Required<NonNullable<OptionsResponse['data']>[number]>

/**
 * Agencias activas para selectores y para pintar códigos en lugar de ids. Las
 * agencias casi no cambian: se piden una vez por sesión.
 */
export const useAgencyOptionsStore = defineStore('agency-options', () => {
  const options = useAsyncData(async () => {
    const { data } = await http.get<OptionsResponse>(
      `${API_BASE_PATH}/organization/agencies/options`,
    )

    return (data.data ?? []) as AgencyOption[]
  })

  const rows = computed(() => options.data.value ?? [])

  function ensureLoaded(): void {
    if (options.status.value === 'idle' || options.status.value === 'error') {
      void options.load()
    }
  }

  /** Código de la agencia, o su id mientras no se conozca. */
  function label(id: unknown): string {
    const agency = rows.value.find((row) => row.id === Number(id))

    return agency ? agency.code : `#${String(id)}`
  }

  return { rows, status: options.status, ensureLoaded, label }
})
