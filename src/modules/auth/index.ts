/**
 * Entrada pública del módulo **auth**.
 *
 * El ciclo de sesión NO vive aquí: `api/auth.api.ts` y sus tipos son solo de
 * recuperación de contraseña y token para apps/PDA. La sesión (login, me,
 * logout, permisos) es transversal: `core/stores/auth.ts` + `core/api/auth.ts`,
 * y la fachada de UI es `core/composables/useAuth.ts`.
 */
export * from './api'
export * from './types/auth.types'
