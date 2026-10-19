/**
 * Entrada pública del módulo **permissions**.
 *
 * La página la registra el router (`./router`); lo que expone aquí es lo que
 * puede consumir otro módulo (store, lógica de tabla, api y tipos).
 */
export { usePermissionsStore } from './stores/usePermissionsStore'
export { usePermissionsTable } from './composables/usePermissionsTable'
export * from './api'
export * from './types/permissions.types'
