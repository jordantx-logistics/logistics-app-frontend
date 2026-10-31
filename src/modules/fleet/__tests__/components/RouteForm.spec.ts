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

    await wrapper
      .findAll('button')
      .find((b) => b.text().includes('Add a stop'))
      ?.trigger('click')

    const numbers = wrapper.findAll('input[type="number"]')

    await numbers[0]?.setValue('10')
    await numbers[1]?.setValue('27')
    await numbers[2]?.setValue('320')
    await numbers[3]?.setValue('42')
    await numbers[4]?.setValue('410')
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
