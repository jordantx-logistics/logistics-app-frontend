import { http } from '@/core/api/client'
import { API_BASE_PATH } from '@/core/api/config'
import type { ResponseOf } from '@/core/api/types'

type KpisResponse = ResponseOf<'/api/v1/dashboard/kpis', 'get'>

export type Kpi = Required<NonNullable<KpisResponse['data']>[number]>

/** Indicadores del usuario: los filtra el backend por permisos y ámbito. */
export async function listKpis(): Promise<Kpi[]> {
  const { data } = await http.get<KpisResponse>(`${API_BASE_PATH}/dashboard/kpis`)

  return (data.data ?? []) as Kpi[]
}
