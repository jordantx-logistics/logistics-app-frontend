import { ref } from 'vue'
import { defineStore } from 'pinia'

import { useAsyncData } from '@/core/composables/useAsyncData'

import * as cashApi from '../api/cash.api'
import type {
  CashClosuresQuery,
  CashSessionsQuery,
  CloseCashSessionPayload,
  CurrentCashSession,
  OpenCashSessionPayload,
  RegisterCashMovementPayload,
} from '../types/cash.types'

/**
 * Estado del módulo **cash**.
 *
 * La sesión actual, el historial y los cierres comparten las recargas después de
 * abrir, cerrar, mover dinero o resolver un descuadre.
 */
export const useCashStore = defineStore('cash', () => {
  const PER_PAGE = 15

  const sessionsQuery = ref<CashSessionsQuery>({ page: 1, per_page: PER_PAGE })
  const closuresQuery = ref<CashClosuresQuery>({ page: 1, per_page: PER_PAGE })
  const saving = ref(false)

  const current = useAsyncData<CurrentCashSession>(() => cashApi.getCurrentCashSession())
  const sessions = useAsyncData(() => cashApi.listCashSessions(sessionsQuery.value))
  const closures = useAsyncData(() => cashApi.listCashClosures(closuresQuery.value))

  /**
   * La sesión propia exige `cash.open`: quien solo consulta (analista) ve el historial
   * y no debe pedirla, porque respondería 403.
   */
  async function loadAll(withCurrent = true): Promise<void> {
    await Promise.all([...(withCurrent ? [current.load()] : []), sessions.load(), closures.load()])
  }

  async function loadClosures(): Promise<void> {
    await closures.load()
  }

  async function setSessionsQuery(next: CashSessionsQuery): Promise<void> {
    sessionsQuery.value = {
      ...next,
      page: next.page ?? 1,
      per_page: next.per_page ?? PER_PAGE,
    }
    await sessions.load()
  }

  async function setClosuresQuery(next: CashClosuresQuery): Promise<void> {
    closuresQuery.value = {
      ...next,
      page: next.page ?? 1,
      per_page: next.per_page ?? PER_PAGE,
    }
    await closures.load()
  }

  async function open(payload: OpenCashSessionPayload): Promise<void> {
    saving.value = true

    try {
      await cashApi.openCashSession(payload)
      await loadAll()
    } finally {
      saving.value = false
    }
  }

  async function close(
    sessionId: number,
    payload: CloseCashSessionPayload,
  ): Promise<Awaited<ReturnType<typeof cashApi.closeCashSession>>> {
    saving.value = true

    try {
      const result = await cashApi.closeCashSession(sessionId, payload)
      await loadAll()

      return result
    } finally {
      saving.value = false
    }
  }

  async function move(payload: RegisterCashMovementPayload): Promise<void> {
    saving.value = true

    try {
      await cashApi.registerCashMovement(payload)
      await loadAll()
    } finally {
      saving.value = false
    }
  }

  async function approve(closureId: number): Promise<void> {
    saving.value = true

    try {
      await cashApi.approveCashClosure(closureId)
      await loadAll()
    } finally {
      saving.value = false
    }
  }

  async function reject(closureId: number, reason: string): Promise<void> {
    saving.value = true

    try {
      await cashApi.rejectCashClosure(closureId, { reason })
      await loadAll()
    } finally {
      saving.value = false
    }
  }

  return {
    saving,
    current,
    sessions,
    closures,
    loadAll,
    loadClosures,
    setSessionsQuery,
    setClosuresQuery,
    open,
    close,
    move,
    approve,
    reject,
  }
})
