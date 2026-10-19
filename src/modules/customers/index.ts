/**
 * Entrada pública del módulo **customers**.
 *
 * La página raíz la registra el router (`./router`), y los componentes internos
 * (`./components`) quedan privados del módulo: lo que expone aquí es lo que
 * puede consumir otro módulo (store, lógica de tabla, api y tipos).
 */
export { useCustomersStore } from './stores/useCustomersStore'
export { useCustomersTable } from './composables/useCustomersTable'
export * from './api'
export * from './types/customers.types'
