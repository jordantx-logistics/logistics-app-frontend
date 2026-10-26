/**
 * Entrada pública del módulo **operations**.
 *
 * La página la registra el router (`./router`); lo que expone aquí es lo que
 * puede consumir otro módulo (store, presentación, api y tipos).
 */
export { useOperationsStore } from './stores/useOperationsStore'
export {
  DELIVERY_COLUMNS,
  EMBARK_COLUMNS,
  INVENTORY_COLUMNS,
  RECEPTION_COLUMNS,
  SHIPMENT_COLUMNS,
  formatDateTime,
  humanizeStatus,
  statusVariant,
} from './composables/useOperationsPresentation'
export * from './api'
export * from './types/operations.types'
