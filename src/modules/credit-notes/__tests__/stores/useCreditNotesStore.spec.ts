import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { useCreditNotesStore } from '@/modules/credit-notes/stores/useCreditNotesStore'
import type { IssueCreditNotePayload } from '@/modules/credit-notes/types/credit-notes.types'

/** Notas y anulaciones: aprobar o rechazar recarga ambos listados. */

const { httpMock } = vi.hoisted(() => ({
  httpMock: {
    get: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
    post: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
  },
}))

vi.mock('@/core/api/client', () => ({ http: httpMock }))

beforeEach(() => {
  vi.clearAllMocks()
  setActivePinia(createPinia())
  httpMock.get.mockResolvedValue({ data: { data: [], meta: {} } })
  httpMock.post.mockResolvedValue({ data: { data: {} } })
})

describe('useCreditNotesStore', () => {
  it('las anulaciones arrancan filtradas por las pendientes', async () => {
    await useCreditNotesStore().loadAll()

    const voids = httpMock.get.mock.calls.find(([url]) => String(url).includes('voids')) as [
      string,
      { params: Record<string, unknown> },
    ]

    expect(voids[1].params).toMatchObject({ status: 'requested' })
  })

  it('emitir, aprobar y rechazar recargan los dos listados', async () => {
    const store = useCreditNotesStore()

    await store.issue({} as IssueCreditNotePayload)
    await store.approveVoid(3)
    await store.rejectVoid(3, 'No proof')

    const urls = httpMock.post.mock.calls.map(([url]) => url)

    expect(urls).toContain('/api/v1/finance/voids/3/approve')
    expect(urls).toContain('/api/v1/finance/voids/3/reject')
    expect(httpMock.get).toHaveBeenCalledTimes(6)
  })

  it('libera `saving` aunque falle', async () => {
    httpMock.post.mockRejectedValue(new Error('boom'))
    const store = useCreditNotesStore()

    await expect(store.issue({} as IssueCreditNotePayload)).rejects.toThrow('boom')
    await expect(store.approveVoid(1)).rejects.toThrow('boom')
    await expect(store.rejectVoid(1, 'x')).rejects.toThrow('boom')

    expect(store.saving).toBe(false)
  })

  it('cada listado guarda su propia consulta', async () => {
    const store = useCreditNotesStore()

    await store.setNotesQuery({ page: 2 })
    await store.setVoidsQuery({ page: 3 })

    expect(httpMock.get).toHaveBeenCalledTimes(2)
  })
})
