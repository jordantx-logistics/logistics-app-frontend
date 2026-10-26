import { ref } from 'vue'

import { type ApiError, toApiError } from '@/core/api/errors'

/**
 * Estado de una mutación (alta, cierre, asignación…): `loading` mientras el
 * backend responde y el `ApiError` normalizado si falla.
 *
 * La página decide qué hacer con el resultado (recargar, cerrar el modal,
 * lanzar un toast); el composable no conoce el dominio.
 */
export function useAsyncAction() {
  const loading = ref(false)
  const error = ref<ApiError | null>(null)

  async function run<Result>(action: () => Promise<Result>): Promise<Result | undefined> {
    loading.value = true
    error.value = null

    try {
      return await action()
    } catch (cause) {
      error.value = toApiError(cause)

      return undefined
    } finally {
      loading.value = false
    }
  }

  return { loading, error, run }
}
