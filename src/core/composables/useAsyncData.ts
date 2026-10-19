import { ref, shallowRef, type Ref, type ShallowRef } from 'vue'

import { ApiError, toApiError } from '@/core/api/errors'

/**
 * Estado de una carga del API: `idle` (sin pedir todavía) → `loading` → `ready`
 * o `error`. Es el mismo ciclo para todas las pantallas con datos remotos, para
 * que el usuario vea siempre lo mismo (paso 5.6; §5.7 lo unifica).
 *
 * El composable **no** carga solo: el componente llama a `load()` (normalmente
 * en `onMounted`, y otra vez al cambiar de página o tras un alta).
 */
export type LoadStatus = 'idle' | 'loading' | 'error' | 'ready'

export interface AsyncData<Data> {
  data: ShallowRef<Data | null>
  status: Ref<LoadStatus>
  error: Ref<ApiError | null>
  load: () => Promise<void>
}

export function useAsyncData<Data>(loader: () => Promise<Data>): AsyncData<Data> {
  const data = shallowRef<Data | null>(null)
  const status = ref<LoadStatus>('idle')
  const error = ref<ApiError | null>(null)

  async function load(): Promise<void> {
    status.value = 'loading'
    error.value = null

    try {
      data.value = await loader()
      status.value = 'ready'
    } catch (caught) {
      error.value = caught instanceof ApiError ? caught : toApiError(caught)
      status.value = 'error'
    }
  }

  return { data, status, error, load }
}
