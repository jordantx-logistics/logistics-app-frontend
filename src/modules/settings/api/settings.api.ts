import { http } from '@/core/api/client'
import { API_BASE_PATH } from '@/core/api/config'
import type { ResponseOf } from '@/core/api/types'

type SettingsResponse = ResponseOf<'/api/v1/settings', 'get'>

export type BusinessSetting = Required<NonNullable<SettingsResponse['data']>[number]>

const BASE = `${API_BASE_PATH}/settings`

/** Parámetros de negocio (`src/Settings` del backend). */
export async function listSettings(): Promise<BusinessSetting[]> {
  const { data } = await http.get<SettingsResponse>(BASE)

  return (data.data ?? []) as BusinessSetting[]
}

/** El lote es atómico: un valor inválido deja todo como estaba. */
export async function updateSettings(
  settings: { key: string; value: string }[],
): Promise<BusinessSetting[]> {
  const { data } = await http.patch<SettingsResponse>(BASE, { settings })

  return (data.data ?? []) as BusinessSetting[]
}
