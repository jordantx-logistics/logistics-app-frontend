/**
 * Entrada pública del módulo **employees**.
 *
 * La página la registra el router (`./router`); lo que expone aquí es lo que
 * puede consumir otro módulo (store, lógica de tabla, api y tipos).
 */
export { useEmployeesStore } from './stores/useEmployeesStore'
export { useEmployeesTable } from './composables/useEmployeesTable'
export * from './api'
export * from './types/employees.types'
