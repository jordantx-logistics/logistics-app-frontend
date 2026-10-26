import { http } from '@/core/api/client'
import { API_BASE_PATH } from '@/core/api/config'

import type {
  AgencyInventoryQuery,
  AgencyInventoryResponse,
  AssignDeliveriesPayload,
  AssignDeliveriesResponse,
  CompleteDeliveryPayload,
  CompleteDeliveryResponse,
  CreateEmbarkPayload,
  CreateEmbarkResponse,
  DeliveriesQuery,
  DisembarkPayload,
  DisembarkResponse,
  EmbarksQuery,
  FailDeliveryPayload,
  FailDeliveryResponse,
  FinishInventoryCountPayload,
  FinishInventoryCountResponse,
  InventoryCountsQuery,
  ListDeliveriesResponse,
  ListEmbarksResponse,
  ListInventoryCountsResponse,
  ListReceptionsResponse,
  ListShipmentsResponse,
  OpenInventoryCountPayload,
  OpenInventoryCountResponse,
  ReceiveShipmentsPayload,
  ReceiveShipmentsResponse,
  ReceptionsQuery,
  ShipmentsQuery,
  ShowDeliveryResponse,
  ShowEmbarkResponse,
  ShowInventoryCountResponse,
  ShowShipmentResponse,
  StartDeliveryResponse,
  SyncScansPayload,
  SyncScansResponse,
  TrackingResponse,
} from '../types/operations.types'

/**
 * Operaciones (`src/Operations` del backend).
 *
 * Un único punto de red para los cinco subcontextos. Los listados devuelven el
 * sobre completo porque las pantallas pintan la paginación del servidor con su
 * `meta`; las mutaciones devuelven la respuesta tal cual para que el store
 * pueda recargar el listado que corresponda.
 */

const OPERATIONS_PATH = `${API_BASE_PATH}/operations`

// ---------------------------------------------------------------------------
// Envíos
// ---------------------------------------------------------------------------

/** Listado paginado de envíos, con los filtros del contrato. */
export async function listShipments(query: ShipmentsQuery = {}): Promise<ListShipmentsResponse> {
  const { data } = await http.get<ListShipmentsResponse>(`${OPERATIONS_PATH}/shipments`, {
    params: query,
  })

  return data
}

/** Detalle de un envío por su código de guía. */
export async function getShipment(ticketCode: string): Promise<ShowShipmentResponse> {
  const { data } = await http.get<ShowShipmentResponse>(
    `${OPERATIONS_PATH}/shipments/${encodeURIComponent(ticketCode)}`,
  )

  return data
}

/** Envíos que están físicamente en una agencia (inventario esperado). */
export async function listAgencyInventory(
  agencyId: number,
  query: AgencyInventoryQuery = {},
): Promise<AgencyInventoryResponse> {
  const { data } = await http.get<AgencyInventoryResponse>(
    `${OPERATIONS_PATH}/agencies/${agencyId}/inventory`,
    { params: query },
  )

  return data
}

// ---------------------------------------------------------------------------
// Recepción
// ---------------------------------------------------------------------------

/** Recepciones registradas, de la más nueva a la más vieja. */
export async function listReceptions(query: ReceptionsQuery = {}): Promise<ListReceptionsResponse> {
  const { data } = await http.get<ListReceptionsResponse>(`${OPERATIONS_PATH}/receptions`, {
    params: query,
  })

  return data
}

/** Registra uno o varios paquetes en una agencia. */
export async function receiveShipments(
  payload: ReceiveShipmentsPayload,
): Promise<ReceiveShipmentsResponse> {
  const { data } = await http.post<ReceiveShipmentsResponse>(
    `${OPERATIONS_PATH}/receptions`,
    payload,
  )

  return data
}

// ---------------------------------------------------------------------------
// Embarque y desembarque
// ---------------------------------------------------------------------------

/** Manifiestos de carga registrados. */
export async function listEmbarks(query: EmbarksQuery = {}): Promise<ListEmbarksResponse> {
  const { data } = await http.get<ListEmbarksResponse>(`${OPERATIONS_PATH}/embarks`, {
    params: query,
  })

  return data
}

/** Detalle de un manifiesto con sus paquetes. */
export async function getEmbark(embarkId: number): Promise<ShowEmbarkResponse> {
  const { data } = await http.get<ShowEmbarkResponse>(`${OPERATIONS_PATH}/embarks/${embarkId}`)

  return data
}

/** Carga paquetes en un vehículo/ruta. */
export async function createEmbark(payload: CreateEmbarkPayload): Promise<CreateEmbarkResponse> {
  const { data } = await http.post<CreateEmbarkResponse>(`${OPERATIONS_PATH}/embarks`, payload)

  return data
}

/** Descarga paquetes de un manifiesto en destino o escala. */
export async function disembarkEmbark(
  embarkId: number,
  payload: DisembarkPayload,
): Promise<DisembarkResponse> {
  const { data } = await http.post<DisembarkResponse>(
    `${OPERATIONS_PATH}/embarks/${embarkId}/disembark`,
    payload,
  )

  return data
}

// ---------------------------------------------------------------------------
// Inventario
// ---------------------------------------------------------------------------

/** Conteos de inventario registrados. */
export async function listInventoryCounts(
  query: InventoryCountsQuery = {},
): Promise<ListInventoryCountsResponse> {
  const { data } = await http.get<ListInventoryCountsResponse>(
    `${OPERATIONS_PATH}/inventory-counts`,
    { params: query },
  )

  return data
}

/** Abre un conteo para una agencia. */
export async function openInventoryCount(
  payload: OpenInventoryCountPayload,
): Promise<OpenInventoryCountResponse> {
  const { data } = await http.post<OpenInventoryCountResponse>(
    `${OPERATIONS_PATH}/inventory-counts`,
    payload,
  )

  return data
}

/** Detalle de un conteo con sus líneas y resumen. */
export async function getInventoryCount(countId: number): Promise<ShowInventoryCountResponse> {
  const { data } = await http.get<ShowInventoryCountResponse>(
    `${OPERATIONS_PATH}/inventory-counts/${countId}`,
  )

  return data
}

/** Cierra un conteo con las líneas contadas. */
export async function finishInventoryCount(
  countId: number,
  payload: FinishInventoryCountPayload,
): Promise<FinishInventoryCountResponse> {
  const { data } = await http.post<FinishInventoryCountResponse>(
    `${OPERATIONS_PATH}/inventory-counts/${countId}/finish`,
    payload,
  )

  return data
}

// ---------------------------------------------------------------------------
// Tracking
// ---------------------------------------------------------------------------

/** Historial de un envío por su código de guía. */
export async function getTracking(ticketCode: string): Promise<TrackingResponse> {
  const { data } = await http.get<TrackingResponse>(
    `${OPERATIONS_PATH}/tracking/${encodeURIComponent(ticketCode)}`,
  )

  return data
}

/**
 * Sincroniza un lote de escaneos del PDA.
 *
 * La web no lo usa (los escaneos son de la app de la Fase 8), pero el contrato
 * queda cubierto en la capa API para no derivar tipos a mano cuando llegue.
 */
export async function syncScans(payload: SyncScansPayload): Promise<SyncScansResponse> {
  const { data } = await http.post<SyncScansResponse>(`${OPERATIONS_PATH}/scans/sync`, payload)

  return data
}

// ---------------------------------------------------------------------------
// Entrega
// ---------------------------------------------------------------------------

/** Entregas de última milla. */
export async function listDeliveries(query: DeliveriesQuery = {}): Promise<ListDeliveriesResponse> {
  const { data } = await http.get<ListDeliveriesResponse>(`${OPERATIONS_PATH}/deliveries`, {
    params: query,
  })

  return data
}

/** Detalle de una entrega. */
export async function getDelivery(deliveryId: number): Promise<ShowDeliveryResponse> {
  const { data } = await http.get<ShowDeliveryResponse>(
    `${OPERATIONS_PATH}/deliveries/${deliveryId}`,
  )

  return data
}

/** Asigna envíos a un repartidor. */
export async function assignDeliveries(
  payload: AssignDeliveriesPayload,
): Promise<AssignDeliveriesResponse> {
  const { data } = await http.post<AssignDeliveriesResponse>(
    `${OPERATIONS_PATH}/deliveries/assign`,
    payload,
  )

  return data
}

/** Marca una entrega como en curso. */
export async function startDelivery(deliveryId: number): Promise<StartDeliveryResponse> {
  const { data } = await http.post<StartDeliveryResponse>(
    `${OPERATIONS_PATH}/deliveries/${deliveryId}/start`,
  )

  return data
}

/** Cierra una entrega con destinatario y evidencia. */
export async function completeDelivery(
  deliveryId: number,
  payload: CompleteDeliveryPayload,
): Promise<CompleteDeliveryResponse> {
  const { data } = await http.post<CompleteDeliveryResponse>(
    `${OPERATIONS_PATH}/deliveries/${deliveryId}/complete`,
    payload,
  )

  return data
}

/** Registra un intento fallido (o devuelve el envío al superar el máximo). */
export async function failDelivery(
  deliveryId: number,
  payload: FailDeliveryPayload,
): Promise<FailDeliveryResponse> {
  const { data } = await http.post<FailDeliveryResponse>(
    `${OPERATIONS_PATH}/deliveries/${deliveryId}/fail`,
    payload,
  )

  return data
}
