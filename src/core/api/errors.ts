import { AxiosError } from 'axios'

/**
 * Forma del error que devuelve el backend (`bootstrap/app.php`, trait
 * `ApiResponse`): el sobre del API más los detalles de validación.
 */
export interface ApiErrorPayload {
  success: false
  message: string
  error_code?: string
  errors?: Record<string, string[]>
}

/**
 * Error normalizado de la capa API.
 *
 * Los componentes no deberían mirar nunca un `AxiosError`: aquí ya viene el
 * mensaje del backend, el código de `BusinessRuleException` y los errores de
 * validación por campo, o `status: null` si la petición ni siquiera llegó
 * (red, DNS, backend caído).
 */
export class ApiError extends Error {
  readonly status: number | null
  readonly errorCode?: string
  readonly errors?: Record<string, string[]>
  /** Fallo original (el `AxiosError`), solo para depurar. */
  readonly reason?: unknown

  constructor(
    message: string,
    status: number | null = null,
    errorCode?: string,
    errors?: Record<string, string[]>,
    reason?: unknown,
  ) {
    super(message)

    this.name = 'ApiError'
    this.status = status
    this.errorCode = errorCode
    this.errors = errors
    this.reason = reason
  }

  /** Fallo de red o de CORS: no hay respuesta del backend. */
  get isNetworkError(): boolean {
    return this.status === null
  }

  /** El backend rechazó las credenciales o la sesión caducó. */
  get isUnauthenticated(): boolean {
    return this.status === 401
  }

  /** Regla de negocio (`BusinessRuleException`) o permiso denegado. */
  get isForbidden(): boolean {
    return this.status === 403
  }

  /** Validación (FormRequest). */
  get isValidationError(): boolean {
    return this.status === 422
  }

  /** Rate limit (`throttle:auth`). */
  get isRateLimited(): boolean {
    return this.status === 429
  }

  /** Token CSRF caducado: el cliente reintenta tras pedir uno nuevo. */
  get isCsrfMismatch(): boolean {
    return this.status === 419
  }

  /** Primer mensaje de validación de un campo, para pintarlo bajo el input. */
  fieldError(field: string): string | undefined {
    return this.errors?.[field]?.[0]
  }
}

function isApiErrorPayload(data: unknown): data is ApiErrorPayload {
  return typeof data === 'object' && data !== null && 'message' in data
}

/**
 * Convierte cualquier fallo en un `ApiError`. Punto único de normalización de
 * la capa API: los componentes solo ven `ApiError`.
 */
export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error
  }

  if (error instanceof AxiosError) {
    const status = error.response?.status ?? null
    const data = error.response?.data

    if (isApiErrorPayload(data)) {
      return new ApiError(data.message, status, data.error_code, data.errors, error)
    }

    return new ApiError(
      status === null ? 'Could not reach the server.' : error.message,
      status,
      undefined,
      undefined,
      error,
    )
  }

  return new ApiError(
    error instanceof Error ? error.message : 'Unexpected error.',
    null,
    undefined,
    undefined,
    error,
  )
}
