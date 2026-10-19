/**
 * Entrada pública del módulo **agencies**.
 *
 * La página la registra el router (`./router`); lo que expone aquí es lo que
 * puede consumir otro módulo (store, lógica de tabla, api y tipos).
 */
export { useAgenciesStore } from './stores/useAgenciesStore'
export { useAgenciesTable } from './composables/useAgenciesTable'
export * from './api'
export * from './types/agencies.types'
