import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { ApiError } from '@/core/api/errors'
import ReceptionForm from '@/modules/operations/components/ReceptionForm.vue'

/**
 * Recepción: el formulario normaliza las gu��as (may��sculas, sin vac��os ni
 * repetidas) y emite el payload; la página hace el `POST`.
 */

describe('ReceptionForm', () => {
  it('emite una gu��a por l��nea, en may��sculas y sin duplicados', async () => {
    const wrapper = mount(ReceptionForm, { props: { agencies: [1, 2] } })

    await wrapper.find('select').setValue('2')
    await wrapper.find('textarea').setValue('a7f3q8x4\n b2c9l1m7 \na7f3q8x4')

    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('submit')?.[0]?.[0]).toEqual({
      agency_id: 2,
      items: [{ ticket_code: 'A7F3Q8X4' }, { ticket_code: 'B2C9L1M7' }],
    })
  })

  it('pinta el error de validación de la primera gu��a', () => {
    const error = new ApiError('The given data was invalid.', 422, undefined, {
      'items.0.ticket_code': ['The ticket code field is required.'],
    })

    const wrapper = mount(ReceptionForm, { props: { agencies: [1], error } })

    expect(wrapper.text()).toContain('The ticket code field is required.')
    expect(wrapper.text()).not.toContain('The given data was invalid.')
  })

  it('muestra el mensaje general cuando el fallo no es de validación', () => {
    const wrapper = mount(ReceptionForm, {
      props: { agencies: [1], error: new ApiError('Could not reach the server.') },
    })

    expect(wrapper.text()).toContain('Could not reach the server.')
  })

  it('emite `cancel` al pulsar Cancel', async () => {
    const wrapper = mount(ReceptionForm, { props: { agencies: [1] } })

    await wrapper.findAll('button')[0]!.trigger('click')

    expect(wrapper.emitted('cancel')).toHaveLength(1)
  })
})
