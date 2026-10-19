import { defineStore } from 'pinia'

import { useAsyncData } from '@/core/composables/useAsyncData'

import * as agenciesApi from '../api/agencies.api'
import type { CreateAgencyPayload } from '../types/agencies.types'

/**
 * Estado del módulo **agencies**: el listado y el alta. La sesión y los
 * permisos NO viven aquí (son de core/); esto es solo dominio de agencias.
 */
export const useAgenciesStore = defineStore('agencies', () => {
  const agencies = useAsyncData(agenciesApi.listAgencies)

  /** Da de alta una agencia y deja la lista del API al día. */
  async function createAgency(payload: CreateAgencyPayload): Promise<void> {
    await agenciesApi.createAgency(payload)
    await agencies.load()
  }

  return {
    agencies,
    createAgency,
  }
})
