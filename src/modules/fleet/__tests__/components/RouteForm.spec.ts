import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'

import RouteForm from '@/modules/fleet/components/RouteForm.vue'
import { useFleetStore } from '@/modules/fleet/stores/useFleetStore'

/** El formulario encadena los tramos: cada uno sale de donde terminó el anterior. */

const { createRoute, listRoutes } = vi.hoisted(() => ({
  createRoute: vi.fn<(payload: unknown) => Promise<unknown>>(),
  listRoutes: vi.fn<() => Promise<unknown>>(),
}))

vi.mock('@/modules/fleet/api/fleet.api', () => ({
  createRoute,
  listRoutes,
  listDrivers: vi.fn<() => Promise<unknown>>(),
  listVehicles: vi.fn<() => Promise<unknown>>(),
  listExpenses: vi.fn<() => Promise<unknown>>(),
}))

vi.mock('@/core/composables/useAuth', () => ({
  useAuth: () => ({ authStore: { agencies: [1] } }),
}))

vi.mock('@/core/composables/useToast', () => ({
  useToast: () => ({ success: vi.fn<() => void>(), error: vi.fn<() => void>() }),
}))

vi.mock('@/core/api/client', () => ({
  http: {
    get: vi.fn<() => Promise<unknown>>().mockResolvedValue({
      data: {
        data: [10, 27, 42].map((id) => ({ id, code: `AG${id}`, name: `Agency ${id}` })),
      },
    }),
  },
}))

beforeEach(() => {
  setActivePinia(createPinia())
  createRoute.mockReset().mockResolvedValue({})
  listRoutes.mockReset().mockResolvedValue({ rows: [], meta: {} })
})

describe('RouteForm', () => {
  it('encadena las paradas desde el origen hasta el destino', async () => {
    useFleetStore()

    const wrapper = mount(RouteForm, {
      global: { stubs: { Button: { template: '<button><slot /></button>' } } },
    })

    await flushPromises()

    await wrapper
      .findAll('button')
      .find((b) => b.text().includes('Add a stop'))
      ?.trigger('click')

    const agencies = wrapper.findAll('select')
    const distances = wrapper.findAll('input[type="number"]')

    await agencies[0]?.setValue('10')
    await agencies[1]?.setValue('27')
    await distances[0]?.setValue('320')
    await agencies[2]?.setValue('42')
    await distances[1]?.setValue('410')
    await wrapper.find('input[type="datetime-local"]').setValue('2026-11-15T18:00')

    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(createRoute).toHaveBeenCalledWith(
      expect.objectContaining({
        origin_agency_id: 10,
        destination_agency_id: 42,
        planned_arrival_at: null,
        segments: [
          { from_agency_id: 10, to_agency_id: 27, distance_km: 320 },
          { from_agency_id: 27, to_agency_id: 42, distance_km: 410 },
        ],
      }),
    )
    expect(wrapper.emitted('saved')).toHaveLength(1)
  })
})
