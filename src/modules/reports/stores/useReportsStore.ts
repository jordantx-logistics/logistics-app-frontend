import { computed } from 'vue'
import { defineStore } from 'pinia'

import { useAsyncData } from '@/core/composables/useAsyncData'

import * as reportsApi from '../api/reports.api'

/** Catálogo de reportes y exportaciones del usuario. */
export const useReportsStore = defineStore('reports', () => {
  const catalog = useAsyncData(() => reportsApi.listCatalog())
  const exports = useAsyncData(() => reportsApi.listExports())

  /** Hay algo generándose: la pantalla sigue consultando hasta que termine. */
  const hasRunning = computed(() =>
    (exports.data.value ?? []).some(
      (row) => row.status === 'pending' || row.status === 'processing',
    ),
  )

  /** Recarga sin pasar por `loading`, para que la tabla no parpadee en cada consulta. */
  async function refreshExports(): Promise<void> {
    try {
      exports.data.value = await reportsApi.listExports()
    } catch {
      // La siguiente consulta lo reintenta; un fallo puntual no borra la tabla.
    }
  }

  return { catalog, exports, hasRunning, refreshExports }
})
