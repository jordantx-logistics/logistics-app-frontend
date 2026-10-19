/**
 * Configuración de la capa API.
 *
 * El valor es el **origen** del backend (`http://localhost:8000`), sin `/api`:
 * las rutas de negocio se componen como `/api/v1/...` y Sanctum necesita el
 * origen para `/sanctum/csrf-cookie`.
 *
 * Se resuelve en este orden, para que la misma imagen sirva a los tres
 * entornos (el `entrypoint.sh` del contenedor escribe `config.js` con
 * `window.__APP_CONFIG__`) y `pnpm dev` no necesite nada especial:
 *
 * 1. `window.__APP_CONFIG__.apiUrl` (runtime).
 * 2. `import.meta.env.VITE_API_URL` (build de Vite).
 * 3. `http://localhost:8000` (backend local por defecto).
 */

declare global {
  interface Window {
    __APP_CONFIG__?: {
      apiUrl?: string
    }
  }
}

const DEFAULT_API_ORIGIN = 'http://localhost:8000'

function resolveApiOrigin(): string {
  const runtime = window.__APP_CONFIG__?.apiUrl
  const buildTime = import.meta.env.VITE_API_URL

  return (runtime || buildTime || DEFAULT_API_ORIGIN).replace(/\/+$/, '')
}

/** Origen del backend (sin `/api`). */
export const API_ORIGIN: string = resolveApiOrigin()

/** Prefijo versionado de las rutas de negocio. */
export const API_BASE_PATH = '/api/v1'

/** Endpoint que emite la cookie CSRF de Sanctum. */
export const CSRF_COOKIE_PATH = '/sanctum/csrf-cookie'
