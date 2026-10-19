import { http } from '@/core/api/client'
import { API_BASE_PATH } from '@/core/api/config'
import type { DeviceStatus, ListDevicesResponse } from '../types/devices.types'

/** Dispositivos con token (`src/Identity/Device` del backend). */

const DEVICES_PATH = `${API_BASE_PATH}/identity/devices`

/** Filtros del listado. `user_id` exige `devices.manage` (lo exige la ruta). */
export interface DeviceListQuery {
  page?: number
  per_page?: number
  user_id?: number
  status?: DeviceStatus
}

/** `GET /identity/devices` — página de dispositivos. */
export async function listDevices(query: DeviceListQuery = {}): Promise<ListDevicesResponse> {
  const { data } = await http.get<ListDevicesResponse>(DEVICES_PATH, { params: query })

  return data
}

/** Revoca el dispositivo y sus tokens (UC-19): el token deja de autenticar. */
export async function revokeDevice(id: number): Promise<void> {
  await http.delete(`${DEVICES_PATH}/${id}`)
}
