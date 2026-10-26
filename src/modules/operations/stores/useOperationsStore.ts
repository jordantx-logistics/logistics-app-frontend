import { ref } from 'vue'
import { defineStore } from 'pinia'

import { useAsyncData } from '@/core/composables/useAsyncData'

import * as operationsApi from '../api/operations.api'
import type {
  AssignDeliveriesPayload,
  CompleteDeliveryPayload,
  CreateEmbarkPayload,
  DeliveriesQuery,
  DisembarkPayload,
  EmbarksQuery,
  FailDeliveryPayload,
  FinishInventoryCountPayload,
  InventoryCountsQuery,
  OpenInventoryCountPayload,
  ReceiveShipmentsPayload,
  ReceptionsQuery,
  ShipmentsQuery,
} from '../types/operations.types'

/**
 * Estado del módulo **operations**.
 *
 * Cada listado guarda su propia query (página y filtros) y se recarga del API
 * con `useAsyncData`. Las mutaciones no insertan filas a mano: escriben en el
 * backend y recargan los listados afectados, para que la pantalla refleje el
 * estado real y no una copia optimista.
 */
export const useOperationsStore = defineStore('operations', () => {
  const PER_PAGE = 15

  // -------------------------------------------------------------------------
  // Envíos
  // -------------------------------------------------------------------------

  const shipmentsQuery = ref<ShipmentsQuery>({ page: 1, per_page: PER_PAGE })
  const shipments = useAsyncData(() => operationsApi.listShipments(shipmentsQuery.value))

  function updateShipmentsQuery(patch: Partial<ShipmentsQuery>): void {
    shipmentsQuery.value = { ...shipmentsQuery.value, ...patch }
    void shipments.load()
  }

  // -------------------------------------------------------------------------
  // Recepción
  // -------------------------------------------------------------------------

  const receptionsQuery = ref<ReceptionsQuery>({ page: 1, per_page: PER_PAGE })
  const receptions = useAsyncData(() => operationsApi.listReceptions(receptionsQuery.value))

  function updateReceptionsQuery(patch: Partial<ReceptionsQuery>): void {
    receptionsQuery.value = { ...receptionsQuery.value, ...patch }
    void receptions.load()
  }

  async function receiveShipments(payload: ReceiveShipmentsPayload) {
    const result = await operationsApi.receiveShipments(payload)

    await receptions.load()
    await shipments.load()

    return result
  }

  // -------------------------------------------------------------------------
  // Embarque y desembarque
  // -------------------------------------------------------------------------

  const embarksQuery = ref<EmbarksQuery>({ page: 1, per_page: PER_PAGE })
  const embarks = useAsyncData(() => operationsApi.listEmbarks(embarksQuery.value))

  function updateEmbarksQuery(patch: Partial<EmbarksQuery>): void {
    embarksQuery.value = { ...embarksQuery.value, ...patch }
    void embarks.load()
  }

  async function createEmbark(payload: CreateEmbarkPayload) {
    const result = await operationsApi.createEmbark(payload)

    await embarks.load()
    await shipments.load()

    return result
  }

  async function disembark(embarkId: number, payload: DisembarkPayload) {
    const result = await operationsApi.disembarkEmbark(embarkId, payload)

    await embarks.load()
    await shipments.load()

    return result
  }

  // -------------------------------------------------------------------------
  // Inventario
  // -------------------------------------------------------------------------

  const inventoryQuery = ref<InventoryCountsQuery>({ page: 1, per_page: PER_PAGE })
  const inventoryCounts = useAsyncData(() =>
    operationsApi.listInventoryCounts(inventoryQuery.value),
  )

  function updateInventoryQuery(patch: Partial<InventoryCountsQuery>): void {
    inventoryQuery.value = { ...inventoryQuery.value, ...patch }
    void inventoryCounts.load()
  }

  async function openInventoryCount(payload: OpenInventoryCountPayload) {
    const result = await operationsApi.openInventoryCount(payload)

    await inventoryCounts.load()

    return result
  }

  async function finishInventoryCount(countId: number, payload: FinishInventoryCountPayload) {
    const result = await operationsApi.finishInventoryCount(countId, payload)

    await inventoryCounts.load()
    await shipments.load()

    return result
  }

  // -------------------------------------------------------------------------
  // Tracking
  // -------------------------------------------------------------------------

  const trackedTicket = ref('')
  const tracking = useAsyncData(() => operationsApi.getTracking(trackedTicket.value))

  async function lookupTracking(ticketCode: string): Promise<void> {
    trackedTicket.value = ticketCode.trim().toUpperCase()
    await tracking.load()
  }

  // -------------------------------------------------------------------------
  // Entrega
  // -------------------------------------------------------------------------

  const deliveriesQuery = ref<DeliveriesQuery>({ page: 1, per_page: PER_PAGE })
  const deliveries = useAsyncData(() => operationsApi.listDeliveries(deliveriesQuery.value))

  function updateDeliveriesQuery(patch: Partial<DeliveriesQuery>): void {
    deliveriesQuery.value = { ...deliveriesQuery.value, ...patch }
    void deliveries.load()
  }

  async function assignDeliveries(payload: AssignDeliveriesPayload) {
    const result = await operationsApi.assignDeliveries(payload)

    await deliveries.load()
    await shipments.load()

    return result
  }

  async function startDelivery(deliveryId: number) {
    const result = await operationsApi.startDelivery(deliveryId)

    await deliveries.load()
    await shipments.load()

    return result
  }

  async function completeDelivery(deliveryId: number, payload: CompleteDeliveryPayload) {
    const result = await operationsApi.completeDelivery(deliveryId, payload)

    await deliveries.load()
    await shipments.load()

    return result
  }

  async function failDelivery(deliveryId: number, payload: FailDeliveryPayload) {
    const result = await operationsApi.failDelivery(deliveryId, payload)

    await deliveries.load()
    await shipments.load()

    return result
  }

  return {
    PER_PAGE,
    shipmentsQuery,
    shipments,
    updateShipmentsQuery,
    receptionsQuery,
    receptions,
    updateReceptionsQuery,
    receiveShipments,
    embarksQuery,
    embarks,
    updateEmbarksQuery,
    createEmbark,
    disembark,
    inventoryQuery,
    inventoryCounts,
    updateInventoryQuery,
    openInventoryCount,
    finishInventoryCount,
    trackedTicket,
    tracking,
    lookupTracking,
    deliveriesQuery,
    deliveries,
    updateDeliveriesQuery,
    assignDeliveries,
    startDelivery,
    completeDelivery,
    failDelivery,
  }
})
