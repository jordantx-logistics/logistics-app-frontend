import type { ResponseOf } from '@/core/api/types'

/** Tipos del módulo **devices**, derivados del contrato OpenAPI (ADR-0008). */

/** `GET /api/v1/identity/devices` — listado paginado de dispositivos. */
export type ListDevicesResponse = ResponseOf<'/api/v1/identity/devices', 'get'>

/** Dispositivo con token emitido (UC-19). */
export type Device = Required<NonNullable<ListDevicesResponse['data']>[number]>

/** Estado del dispositivo. */
export type DeviceStatus = 'active' | 'revoked'
