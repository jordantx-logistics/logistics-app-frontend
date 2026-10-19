/**
 * Entrada pública del módulo **attendance**.
 *
 * La página la registra el router (`./router`); lo que expone aquí es lo que
 * puede consumir otro módulo (store, lógica de tabla, api y tipos).
 */
export { useAttendanceStore } from './stores/useAttendanceStore'
export { useAttendanceTable } from './composables/useAttendanceTable'
export * from './api'
export * from './types/attendance.types'
