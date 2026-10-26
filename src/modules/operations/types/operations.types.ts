import type { QueryOf, RequestOf, ResponseOf } from '@/core/api/types'

/**
 * Tipos del módulo **operations**, derivados del contrato OpenAPI (ADR-0008).
 *
 * Los cinco subcontextos del backend (Reception, Shipment, Inventory, Tracking
 * y Delivery) comparten aquí el vocabulario del envío y los sobres de sus
 * listados. El contrato no emite `required`; las filas se declaran completas en
 * la capa API, en el único punto donde se desenvuelve el sobre.
 */

// ---------------------------------------------------------------------------
// Vocabulario de estado (lo comparten los listados y los filtros)
// ---------------------------------------------------------------------------

export type ShipmentStatus =
  | 'created'
  | 'received'
  | 'embarked'
  | 'in_transit'
  | 'disembarked'
  | 'out_for_delivery'
  | 'delivered'
  | 'delivery_failed'
  | 'returned'
  | 'cancelled'

export type DeliveryStatus = 'assigned' | 'in_progress' | 'delivered' | 'failed' | 'returned'

export type InventoryCountStatus = 'open' | 'finished'

export interface StatusOption {
  label: string
  value: string
}

export const SHIPMENT_STATUSES: StatusOption[] = [
  { label: 'Created', value: 'created' },
  { label: 'Received', value: 'received' },
  { label: 'Embarked', value: 'embarked' },
  { label: 'In transit', value: 'in_transit' },
  { label: 'Disembarked', value: 'disembarked' },
  { label: 'Out for delivery', value: 'out_for_delivery' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Delivery failed', value: 'delivery_failed' },
  { label: 'Returned', value: 'returned' },
  { label: 'Cancelled', value: 'cancelled' },
]

export const DELIVERY_STATUSES: StatusOption[] = [
  { label: 'Assigned', value: 'assigned' },
  { label: 'In progress', value: 'in_progress' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Failed', value: 'failed' },
  { label: 'Returned', value: 'returned' },
]

export const INVENTORY_COUNT_STATUSES: StatusOption[] = [
  { label: 'Open', value: 'open' },
  { label: 'Finished', value: 'finished' },
]

// ---------------------------------------------------------------------------
// Envíos
// ---------------------------------------------------------------------------

/** `GET /api/v1/operations/shipments`. */
export type ListShipmentsResponse = ResponseOf<'/api/v1/operations/shipments', 'get'>

/** Fila del listado de envíos. */
export type Shipment = Required<NonNullable<ListShipmentsResponse['data']>[number]>

/** `meta` del paginador de Laravel. */
export type PageMeta = Required<NonNullable<ListShipmentsResponse['meta']>>

/** Filtros del listado de envíos. */
export type ShipmentsQuery = NonNullable<QueryOf<'/api/v1/operations/shipments', 'get'>>

/** `GET /api/v1/operations/shipments/{ticketCode}`. */
export type ShowShipmentResponse = ResponseOf<'/api/v1/operations/shipments/{ticketCode}', 'get'>

export type ShipmentDetail = Required<ShowShipmentResponse['data']>

/** `GET /api/v1/operations/agencies/{agency}/inventory`. */
export type AgencyInventoryResponse = ResponseOf<
  '/api/v1/operations/agencies/{agency}/inventory',
  'get'
>

export type AgencyShipment = Required<NonNullable<AgencyInventoryResponse['data']>[number]>

/** Filtros del inventario físico de una agencia. */
export type AgencyInventoryQuery = NonNullable<
  QueryOf<'/api/v1/operations/agencies/{agency}/inventory', 'get'>
>

// ---------------------------------------------------------------------------
// Recepción
// ---------------------------------------------------------------------------

/** `GET /api/v1/operations/receptions`. */
export type ListReceptionsResponse = ResponseOf<'/api/v1/operations/receptions', 'get'>

export type Reception = Required<NonNullable<ListReceptionsResponse['data']>[number]>

export type ReceptionItem = Required<NonNullable<Reception['items']>[number]>

export type ReceptionsQuery = NonNullable<QueryOf<'/api/v1/operations/receptions', 'get'>>

/** `POST /api/v1/operations/receptions`. */
export type ReceiveShipmentsPayload = RequestOf<'/api/v1/operations/receptions', 'post'>

export type ReceiveShipmentsResponse = ResponseOf<'/api/v1/operations/receptions', 'post'>

// ---------------------------------------------------------------------------
// Embarque y desembarque
// ---------------------------------------------------------------------------

/** `GET /api/v1/operations/embarks`. */
export type ListEmbarksResponse = ResponseOf<'/api/v1/operations/embarks', 'get'>

export type Embark = Required<NonNullable<ListEmbarksResponse['data']>[number]>

export type EmbarkItem = Required<NonNullable<Embark['items']>[number]>

export type EmbarksQuery = NonNullable<QueryOf<'/api/v1/operations/embarks', 'get'>>

/** `POST /api/v1/operations/embarks`. */
export type CreateEmbarkPayload = RequestOf<'/api/v1/operations/embarks', 'post'>

export type CreateEmbarkResponse = ResponseOf<'/api/v1/operations/embarks', 'post'>

/** `GET /api/v1/operations/embarks/{embark}`. */
export type ShowEmbarkResponse = ResponseOf<'/api/v1/operations/embarks/{embark}', 'get'>

/** `POST /api/v1/operations/embarks/{embark}/disembark`. */
export type DisembarkPayload = RequestOf<'/api/v1/operations/embarks/{embark}/disembark', 'post'>

export type DisembarkResponse = ResponseOf<'/api/v1/operations/embarks/{embark}/disembark', 'post'>

// ---------------------------------------------------------------------------
// Inventario
// ---------------------------------------------------------------------------

/** `GET /api/v1/operations/inventory-counts`. */
export type ListInventoryCountsResponse = ResponseOf<'/api/v1/operations/inventory-counts', 'get'>

export type InventoryCount = Required<NonNullable<ListInventoryCountsResponse['data']>[number]>

/** `GET /api/v1/operations/inventory-counts/{count}` (con líneas y resumen). */
export type InventoryCountDetail = Required<ShowInventoryCountResponse['data']>

export type InventoryItem = Required<NonNullable<InventoryCountDetail['items']>[number]>

export type InventoryCountsQuery = NonNullable<
  QueryOf<'/api/v1/operations/inventory-counts', 'get'>
>

/** `POST /api/v1/operations/inventory-counts`. */
export type OpenInventoryCountPayload = RequestOf<'/api/v1/operations/inventory-counts', 'post'>

export type OpenInventoryCountResponse = ResponseOf<'/api/v1/operations/inventory-counts', 'post'>

/** `GET /api/v1/operations/inventory-counts/{count}`. */
export type ShowInventoryCountResponse = ResponseOf<
  '/api/v1/operations/inventory-counts/{count}',
  'get'
>

/** `POST /api/v1/operations/inventory-counts/{count}/finish`. */
export type FinishInventoryCountPayload = RequestOf<
  '/api/v1/operations/inventory-counts/{count}/finish',
  'post'
>

export type FinishInventoryCountResponse = ResponseOf<
  '/api/v1/operations/inventory-counts/{count}/finish',
  'post'
>

// ---------------------------------------------------------------------------
// Tracking
// ---------------------------------------------------------------------------

/** `GET /api/v1/operations/tracking/{ticketCode}`. */
export type TrackingResponse = ResponseOf<'/api/v1/operations/tracking/{ticketCode}', 'get'>

export type TrackingTimeline = Required<TrackingResponse['data']>

export type TrackingEvent = Required<NonNullable<TrackingTimeline['events']>[number]>

/** `POST /api/v1/operations/scans/sync`. */
export type SyncScansPayload = RequestOf<'/api/v1/operations/scans/sync', 'post'>

export type SyncScansResponse = ResponseOf<'/api/v1/operations/scans/sync', 'post'>

// ---------------------------------------------------------------------------
// Entrega (última milla)
// ---------------------------------------------------------------------------

/** `GET /api/v1/operations/deliveries`. */
export type ListDeliveriesResponse = ResponseOf<'/api/v1/operations/deliveries', 'get'>

export type Delivery = Required<NonNullable<ListDeliveriesResponse['data']>[number]>

export type DeliveriesQuery = NonNullable<QueryOf<'/api/v1/operations/deliveries', 'get'>>

/** `GET /api/v1/operations/deliveries/{delivery}`. */
export type ShowDeliveryResponse = ResponseOf<'/api/v1/operations/deliveries/{delivery}', 'get'>

/** `POST /api/v1/operations/deliveries/assign`. */
export type AssignDeliveriesPayload = RequestOf<'/api/v1/operations/deliveries/assign', 'post'>

export type AssignDeliveriesResponse = ResponseOf<'/api/v1/operations/deliveries/assign', 'post'>

/** `POST /api/v1/operations/deliveries/{delivery}/start`. */
export type StartDeliveryResponse = ResponseOf<
  '/api/v1/operations/deliveries/{delivery}/start',
  'post'
>

/** `POST /api/v1/operations/deliveries/{delivery}/complete`. */
export type CompleteDeliveryPayload = RequestOf<
  '/api/v1/operations/deliveries/{delivery}/complete',
  'post'
>

export type CompleteDeliveryResponse = ResponseOf<
  '/api/v1/operations/deliveries/{delivery}/complete',
  'post'
>

/** `POST /api/v1/operations/deliveries/{delivery}/fail`. */
export type FailDeliveryPayload = RequestOf<'/api/v1/operations/deliveries/{delivery}/fail', 'post'>

export type FailDeliveryResponse = ResponseOf<
  '/api/v1/operations/deliveries/{delivery}/fail',
  'post'
>
