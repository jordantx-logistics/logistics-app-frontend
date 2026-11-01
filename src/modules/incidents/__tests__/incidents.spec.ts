import { beforeEach, describe, expect, it, vi } from 'vitest'

import * as incidentsApi from '@/modules/incidents/api'
import { availableActions } from '@/modules/incidents/composables/useIncidentsPresentation'

const { httpMock } = vi.hoisted(() => ({
  httpMock: {
    get: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
    post: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
  },
}))

vi.mock('@/core/api/client', () => ({ http: httpMock }))

beforeEach(() => {
  vi.clearAllMocks()
  httpMock.post.mockResolvedValue({ data: { data: { id: 1 } } })
})

describe('api de incidencias', () => {
  it('desenvuelve el sobre paginado', async () => {
    httpMock.get.mockResolvedValue({
      data: { data: [{ id: 1 }], meta: { current_page: 2, last_page: 3, per_page: 15, total: 31 } },
    })

    const page = await incidentsApi.listIncidents({ page: 2 })

    expect(page.rows).toEqual([{ id: 1 }])
    expect(page.meta.total).toBe(31)
  })

  it('tolera un listado sin meta', async () => {
    httpMock.get.mockResolvedValue({ data: {} })

    const page = await incidentsApi.listIncidents()

    expect(page.rows).toEqual([])
    expect(page.meta.last_page).toBe(1)
  })

  it('llama a la ruta de cada transición', async () => {
    await incidentsApi.changeIncident(4, 'start')
    await incidentsApi.resolveIncident(4, 'Done')
    await incidentsApi.assignIncident(4, 9)

    expect(httpMock.post).toHaveBeenCalledWith('/api/v1/incidents/4/start')
    expect(httpMock.post).toHaveBeenCalledWith('/api/v1/incidents/4/resolve', { note: 'Done' })
    expect(httpMock.post).toHaveBeenCalledWith('/api/v1/incidents/4/assign', { user_id: 9 })
  })
})

describe('acciones según el estado', () => {
  it('solo inicia una abierta', () => {
    expect(availableActions('open')).toMatchObject({ assign: true, start: true, resolve: false })
  })

  it('solo resuelve una en atención', () => {
    expect(availableActions('in_progress')).toMatchObject({ start: false, resolve: true })
  })

  it('cierra o reabre una resuelta', () => {
    expect(availableActions('resolved')).toMatchObject({
      close: true,
      reopen: true,
      resolve: false,
    })
  })

  it('una cerrada no admite nada', () => {
    expect(Object.values(availableActions('closed'))).toEqual([false, false, false, false, false])
  })
})
