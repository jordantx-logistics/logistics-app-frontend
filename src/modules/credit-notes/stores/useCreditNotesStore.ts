import { ref } from 'vue'
import { defineStore } from 'pinia'

import { useAsyncData } from '@/core/composables/useAsyncData'

import * as creditNotesApi from '../api/credit-notes.api'
import type {
  CreditNotesQuery,
  IssueCreditNotePayload,
  VoidsQuery,
} from '../types/credit-notes.types'

/**
 * Estado del módulo **credit-notes**.
 *
 * La pantalla mantiene dos listados: las notas emitidas y las anulaciones que
 * esperan decisión. Aprobar o rechazar una anulación recarga ambos.
 */
export const useCreditNotesStore = defineStore('credit-notes', () => {
  const PER_PAGE = 15

  const notesQuery = ref<CreditNotesQuery>({ page: 1, per_page: PER_PAGE })
  const voidsQuery = ref<VoidsQuery>({ page: 1, per_page: PER_PAGE, status: 'requested' })
  const saving = ref(false)

  const notes = useAsyncData(() => creditNotesApi.listCreditNotes(notesQuery.value))
  const voids = useAsyncData(() => creditNotesApi.listVoids(voidsQuery.value))

  async function loadAll(): Promise<void> {
    await Promise.all([notes.load(), voids.load()])
  }

  async function setNotesQuery(next: CreditNotesQuery): Promise<void> {
    notesQuery.value = {
      ...next,
      page: next.page ?? 1,
      per_page: next.per_page ?? PER_PAGE,
    }
    await notes.load()
  }

  async function setVoidsQuery(next: VoidsQuery): Promise<void> {
    voidsQuery.value = {
      ...next,
      page: next.page ?? 1,
      per_page: next.per_page ?? PER_PAGE,
    }
    await voids.load()
  }

  async function issue(payload: IssueCreditNotePayload): Promise<void> {
    saving.value = true

    try {
      await creditNotesApi.issueCreditNote(payload)
      await loadAll()
    } finally {
      saving.value = false
    }
  }

  async function approveVoid(voidId: number): Promise<void> {
    saving.value = true

    try {
      await creditNotesApi.approveVoid(voidId)
      await loadAll()
    } finally {
      saving.value = false
    }
  }

  async function rejectVoid(voidId: number, reason: string): Promise<void> {
    saving.value = true

    try {
      await creditNotesApi.rejectVoid(voidId, { reason })
      await loadAll()
    } finally {
      saving.value = false
    }
  }

  return {
    saving,
    notes,
    voids,
    loadAll,
    setNotesQuery,
    setVoidsQuery,
    issue,
    approveVoid,
    rejectVoid,
  }
})
