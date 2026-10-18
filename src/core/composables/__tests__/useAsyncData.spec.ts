import { describe, expect, it, vi } from 'vitest'

import { ApiError } from '@/core/api/errors'
import { useAsyncData } from '@/core/composables/useAsyncData'

/** Ciclo `idle → loading → ready|error` de las pantallas con datos remotos. */

describe('useAsyncData', () => {
  it('empieza en `idle` y acaba en `ready` con los datos', async () => {
    const loader = vi.fn<() => Promise<number[]>>().mockResolvedValue([1, 2])

    const { data, status, error, load } = useAsyncData(loader)

    expect(status.value).toBe('idle')
    expect(data.value).toBeNull()

    const pending = load()
    expect(status.value).toBe('loading')

    await pending

    expect(status.value).toBe('ready')
    expect(data.value).toEqual([1, 2])
    expect(error.value).toBeNull()
  })

  it('guarda el `ApiError` cuando la carga falla', async () => {
    const loader = vi.fn<() => Promise<number[]>>().mockRejectedValue(new ApiError('Nope.', 500))

    const { data, status, error, load } = useAsyncData(loader)

    await load()

    expect(status.value).toBe('error')
    expect(data.value).toBeNull()
    expect(error.value?.message).toBe('Nope.')
    expect(error.value?.status).toBe(500)
  })

  it('normaliza un fallo que no es del API (red)', async () => {
    const loader = vi.fn<() => Promise<number[]>>().mockRejectedValue(new Error('Network down'))

    const { status, error, load } = useAsyncData(loader)

    await load()

    expect(status.value).toBe('error')
    expect(error.value).toBeInstanceOf(ApiError)
    expect(error.value?.isNetworkError).toBe(true)
  })

  it('reintentar limpia el error anterior', async () => {
    const loader = vi
      .fn<() => Promise<string[]>>()
      .mockRejectedValueOnce(new ApiError('Nope.', 500))
      .mockResolvedValueOnce(['ok'])

    const { data, status, error, load } = useAsyncData(loader)

    await load()
    expect(status.value).toBe('error')

    await load()

    expect(status.value).toBe('ready')
    expect(error.value).toBeNull()
    expect(data.value).toEqual(['ok'])
  })
})
