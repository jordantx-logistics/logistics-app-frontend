import { describe, expect, it } from 'vitest'

import { ApiError } from '@/core/api/errors'
import { useAsyncAction } from '@/modules/operations/composables/useAsyncAction'

/**
 * `useAsyncAction` envuelve una mutación: expone `loading`, devuelve el
 * resultado y normaliza el fallo a `ApiError` sin lanzarlo a la página.
 */

describe('useAsyncAction', () => {
  it('marca loading mientras corre y devuelve el resultado', async () => {
    const action = useAsyncAction()
    let resolve: (value: string) => void = () => {}

    const pending = action.run(
      () =>
        new Promise<string>((done) => {
          resolve = done
        }),
    )

    expect(action.loading.value).toBe(true)

    resolve('ok')

    await expect(pending).resolves.toBe('ok')
    expect(action.loading.value).toBe(false)
    expect(action.error.value).toBeNull()
  })

  it('normaliza el fallo y devuelve undefined', async () => {
    const action = useAsyncAction()

    const result = await action.run(() => Promise.reject(new ApiError('Forbidden', 403)))

    expect(result).toBeUndefined()
    expect(action.error.value).toBeInstanceOf(ApiError)
    expect(action.error.value?.isForbidden).toBe(true)
    expect(action.loading.value).toBe(false)
  })

  it('un fallo de red tambiǸn se normaliza a ApiError', async () => {
    const action = useAsyncAction()

    await action.run(() => Promise.reject(new Error('Network down')))

    expect(action.error.value?.isNetworkError).toBe(true)
  })

  it('limpia el error en el siguiente intento', async () => {
    const action = useAsyncAction()

    await action.run(() => Promise.reject(new ApiError('Nope', 500)))
    expect(action.error.value).not.toBeNull()

    const result = await action.run(() => Promise.resolve('ok'))

    expect(result).toBe('ok')
    expect(action.error.value).toBeNull()
  })
})
