/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Origen del backend, sin `/api` (p. ej. `http://localhost:8000`).
   * Ver `src/core/api/config.ts`; en la imagen se puede sobreescribir en
   * runtime con `window.__APP_CONFIG__.apiUrl`.
   */
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
