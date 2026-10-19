/**
 * Entrada pública del módulo **users**.
 *
 * La página la registra el router (`./router`); lo que expone aquí es lo que
 * puede consumir otro módulo (store, lógica de tabla, api y tipos).
 */
export { useUsersStore } from './stores/useUsersStore'
export { useUsersTable } from './composables/useUsersTable'
export * from './api'
export * from './types/users.types'
