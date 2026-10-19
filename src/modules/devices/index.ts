/**
 * Entrada pública del módulo **devices**.
 *
 * La página la registra el router (`./router`); lo que expone aquí es lo que
 * puede consumir otro módulo (store, lógica de tabla, api y tipos).
 */
export { useDevicesStore } from './stores/useDevicesStore'
export { useDevicesTable } from './composables/useDevicesTable'
export * from './api'
export * from './types/devices.types'
