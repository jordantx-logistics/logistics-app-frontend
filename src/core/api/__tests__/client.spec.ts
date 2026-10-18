import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  AxiosError,
  type AxiosAdapter,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'

import { http, setUnauthenticatedHandler } from '@/core/api/client'
import { ApiError } from '@/core/api/errors'

/**
 * Capa API: normalización de errores, reintento tras `419` (token CSRF
 * caducado), aviso al store cuando llega un `401` y cabecera CSRF.
 *
 * El adapter de axios se sustituye en cada test: no hay red.
 */

function axiosResponse(
  config: InternalAxiosRequestConfig,
  status: number,
  data: unknown,
): AxiosResponse {
  return { data, status, statusText: '', headers: {}, config }
}

/** Adapter que responde siempre lo mismo (y falla con `AxiosError` si `status >= 400`). */
function respondWith(status: number, data: unknown = null): AxiosAdapter {
  return async (config) => {
    const response = axiosResponse(config, status, data)

    if (status >= 400) {
      throw new AxiosError('Request failed', `ERR_${status}`, config, {}, response)
    }

    return response
  }
}

const originalAdapter = http.defaults.adapter

afterEach(() => {
  http.defaults.adapter = originalAdapter
  setUnauthenticatedHandler(null)
  document.cookie = 'XSRF-TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 GMT'
})

describe('cliente HTTP', () => {
  it('apunta al origen del backend, con credenciales y pidiendo JSON', () => {
    expect(http.defaults.baseURL).toBe('http://localhost:8000')
    expect(http.defaults.withCredentials).toBe(true)
    expect(http.defaults.headers.common.Accept).toContain('application/json')
  })

  it('manda la cabecera X-XSRF-TOKEN leída de la cookie', async () => {
    document.cookie = 'XSRF-TOKEN=csrf-value'

    let xsrfHeader: unknown
    http.defaults.adapter = async (config) => {
      xsrfHeader = (config.headers as unknown as { get(name: string): unknown }).get('X-XSRF-TOKEN')

      return axiosResponse(config, 200, { success: true, message: 'ok' })
    }

    await http.get('/api/v1/health')

    expect(xsrfHeader).toBe('csrf-value')
  })

  it('normaliza el sobre de error del backend a ApiError', async () => {
    http.defaults.adapter = respondWith(422, {
      success: false,
      message: 'The given data was invalid.',
      error_code: 'VALIDATION',
      errors: { email: ['The email field is required.'] },
    })

    const error = await http.post('/api/v1/auth/login').catch((e: unknown) => e)

    expect(error).toBeInstanceOf(ApiError)
    const apiError = error as ApiError

    expect(apiError.status).toBe(422)
    expect(apiError.message).toBe('The given data was invalid.')
    expect(apiError.errorCode).toBe('VALIDATION')
    expect(apiError.isValidationError).toBe(true)
    expect(apiError.fieldError('email')).toBe('The email field is required.')
  })

  it('marca los fallos sin respuesta como error de red', async () => {
    http.defaults.adapter = async (config) => {
      throw new AxiosError('Network Error', 'ERR_NETWORK', config)
    }

    const error = await http.get('/api/v1/health').catch((e: unknown) => e)

    expect(error).toBeInstanceOf(ApiError)
    expect((error as ApiError).status).toBeNull()
    expect((error as ApiError).isNetworkError).toBe(true)
    expect((error as ApiError).message).toBe('Could not reach the server.')
  })

  it('reintenta una vez tras pedir una cookie CSRF nueva cuando llega 419', async () => {
    const seen: string[] = []
    let attempts = 0

    http.defaults.adapter = async (config) => {
      seen.push(`${config.method?.toUpperCase()} ${config.url}`)

      // El primer intento caduca; la cookie CSRF y el reintento van bien.
      if (config.method === 'post' && attempts++ === 0) {
        return respondWith(419, { message: 'CSRF token mismatch.' })(config)
      }

      return axiosResponse(config, config.method === 'get' ? 204 : 200, null)
    }

    await expect(http.post('/api/v1/auth/logout')).resolves.toBeDefined()

    expect(seen).toEqual([
      'POST /api/v1/auth/logout',
      'GET /sanctum/csrf-cookie',
      'POST /api/v1/auth/logout',
    ])
  })

  it('avisa al store cuando la sesión ya no vale', async () => {
    const onUnauthenticated = vi.fn<() => void>()
    setUnauthenticatedHandler(onUnauthenticated)

    http.defaults.adapter = respondWith(401, { success: false, message: 'Unauthenticated.' })

    await expect(http.get('/api/v1/auth/me')).rejects.toBeInstanceOf(ApiError)
    expect(onUnauthenticated).toHaveBeenCalledTimes(1)
  })

  it('no avisa al store en errores que no son de sesión', async () => {
    const onUnauthenticated = vi.fn<() => void>()
    setUnauthenticatedHandler(onUnauthenticated)

    http.defaults.adapter = respondWith(403, { success: false, message: 'Forbidden.' })

    await expect(http.get('/api/v1/logistics/orders')).rejects.toBeInstanceOf(ApiError)
    expect(onUnauthenticated).not.toHaveBeenCalled()
  })
})
