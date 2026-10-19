/**
 * Entrada pública del módulo **orders**.
 *
 * La página raíz la registra el router (`./router`), y los componentes internos
 * quedan privados del módulo: lo que expone aquí es lo que puede consumir otro
 * módulo (store, lógica de tabla, api y tipos).
 */
export { useOrdersStore } from './stores/useOrdersStore'
export { useOrdersTable } from './composables/useOrdersTable'
export * from './api'
export * from './types/orders.types'
