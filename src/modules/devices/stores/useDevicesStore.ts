import { defineStore } from 'pinia'
import { ref } from 'vue'

import { useAsyncData } from '@/core/composables/useAsyncData'

import * as devicesApi from '../api/devices.api'

/** Filas por página del listado de dispositivos (lo pagina el backend). */
export const PER_PAGE = 15

/** Estado del módulo **devices**: el listado paginado y la revocación. */
export const useDevicesStore = defineStore('devices', () => {
  const query = ref<devicesApi.DeviceListQuery>({ page: 1, per_page: PER_PAGE })

  const devices = useAsyncData(() => devicesApi.listDevices(query.value))

  /** Carga (o recarga) el listado con los filtros indicados. */
  async function load(next: devicesApi.DeviceListQuery = {}): Promise<void> {
    query.value = { ...query.value, ...next }
    await devices.load()
  }

  /** Revoca el dispositivo (UC-19) y deja el listado al día. */
  async function revoke(id: number): Promise<void> {
    await devicesApi.revokeDevice(id)
    await devices.load()
  }

  return {
    devices,
    query,
    load,
    revoke,
  }
})
