import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import * as reportsApi from '@/modules/reports/api'
import { useReportsStore } from '@/modules/reports/stores/useReportsStore'
import type { RequestExportPayload } from '@/modules/reports/types/reports.types'

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
})

describe('api de reportes', () => {
  it('pide la exportación y devuelve la fila creada', async () => {
    httpMock.post.mockResolvedValue({ data: { data: { id: 8, status: 'pending' } } })

    const row = await reportsApi.requestExport({ report: 'orders' } as RequestExportPayload)

    expect(httpMock.post).toHaveBeenCalledWith('/api/v1/reports/exports', { report: 'orders' })
    expect(row.status).toBe('pending')
  })

  it('descarga como blob', async () => {
    httpMock.get.mockResolvedValue({ data: new Blob(['x']) })

    await reportsApi.downloadExport(8)

    expect(httpMock.get).toHaveBeenCalledWith('/api/v1/reports/exports/8/download', {
      responseType: 'blob',
    })
  })
})

describe('store de reportes', () => {
  it('detecta exportaciones en curso para seguir consultando', async () => {
    httpMock.get.mockResolvedValue({ data: { data: [{ id: 1, status: 'processing' }] } })
    const store = useReportsStore()

    await store.exports.load()

    expect(store.hasRunning).toBe(true)
  })

  it('deja de consultar cuando todas terminaron', async () => {
    httpMock.get.mockResolvedValue({ data: { data: [{ id: 1, status: 'ready' }] } })
    const store = useReportsStore()

    await store.exports.load()

    expect(store.hasRunning).toBe(false)
  })

  it('un fallo al refrescar no borra la tabla', async () => {
    httpMock.get.mockResolvedValueOnce({ data: { data: [{ id: 1, status: 'pending' }] } })
    const store = useReportsStore()
    await store.exports.load()

    httpMock.get.mockRejectedValueOnce(new Error('network'))
    await store.refreshExports()

    expect(store.exports.data).toHaveLength(1)
  })
})
