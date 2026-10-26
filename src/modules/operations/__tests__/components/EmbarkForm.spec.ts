import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import EmbarkForm from '@/modules/operations/components/EmbarkForm.vue'

/**
 * Manifiesto: pide los ids de veh��culo/conductor tal como los espera el
 * contrato (Flota llega en la Fase 6), normaliza las gu��as y deja `route_ref`
 * en `null` cuando se deja vac��o.
 */

describe('EmbarkForm', () => {
  it('emite el payload con ids num��ricos y ruta nula', async () => {
    const wrapper = mount(EmbarkForm, { props: { agencies: [1, 2] } })

    await wrapper.find('select').setValue('2')

    const inputs = wrapper.findAll('input')

    await inputs[0]!.setValue('10')
    await inputs[1]!.setValue('20')
    await wrapper.find('textarea').setValue('a7f3q8x4\nb2c9l1m7')

    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('submit')?.[0]?.[0]).toEqual({
      agency_id: 2,
      vehicle_id: 10,
      driver_id: 20,
      route_ref: null,
      items: [{ ticket_code: 'A7F3Q8X4' }, { ticket_code: 'B2C9L1M7' }],
    })
  })

  it('incluye `departed_at` en ISO cuando se informa', async () => {
    const wrapper = mount(EmbarkForm, { props: { agencies: [1] } })

    const inputs = wrapper.findAll('input')

    await inputs[0]!.setValue('10')
    await inputs[1]!.setValue('20')
    await inputs[2]!.setValue(' LIM-AQP-01 ')
    await inputs[3]!.setValue('2026-10-20T08:30')

    await wrapper.find('textarea').setValue('a7f3q8x4')
    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('submit')?.[0]?.[0]).toMatchObject({
      route_ref: 'LIM-AQP-01',
      departed_at: new Date('2026-10-20T08:30').toISOString(),
    })
  })

  it('emite `cancel` al pulsar Cancel', async () => {
    const wrapper = mount(EmbarkForm, { props: { agencies: [1] } })

    await wrapper.findAll('button')[0]!.trigger('click')

    expect(wrapper.emitted('cancel')).toHaveLength(1)
  })
})
