import { defineStore } from 'pinia'
import { ref } from 'vue'

import { useAsyncData } from '@/core/composables/useAsyncData'

import * as attendanceApi from '../api/attendance.api'
import type { RegisterAttendancePayload } from '../types/attendance.types'

/** Filas por página del listado de marcaciones (lo pagina el backend). */
export const PER_PAGE = 15

/**
 * Estado del módulo **attendance**: las marcaciones paginadas y las mutaciones.
 *
 * El resumen diario no vive aquí: la pantalla lo pide a demanda por
 * `api/attendance.api.ts` (`attendanceSummary`), porque es otro recurso y no
 * tiene que viajar en cada carga del listado.
 */
export const useAttendanceStore = defineStore('attendance', () => {
  const query = ref<attendanceApi.AttendanceListQuery>({ page: 1, per_page: PER_PAGE })

  const attendance = useAsyncData(() => attendanceApi.listAttendance(query.value))

  /** Carga (o recarga) el listado con los filtros indicados. */
  async function load(next: attendanceApi.AttendanceListQuery = {}): Promise<void> {
    query.value = { ...query.value, ...next }
    await attendance.load()
  }

  /** Registra una marcación y deja el listado al día. */
  async function register(payload: RegisterAttendancePayload): Promise<void> {
    await attendanceApi.registerAttendance(payload)
    await attendance.load()
  }

  /** Anula una marcación (RRHH). */
  async function voidRecord(id: number): Promise<void> {
    await attendanceApi.voidAttendance(id)
    await attendance.load()
  }

  return {
    attendance,
    query,
    load,
    register,
    voidRecord,
  }
})
