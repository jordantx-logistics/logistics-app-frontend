import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { ApiError } from '@/core/api/errors'
import AgencyForm from '@/modules/agencies/components/AgencyForm.vue'

/** Alta de agencia: payload (incluido `is_active`) y errores por campo. */

describe('AgencyForm', () => {
  it('emite el payload y manda la agencia activa por defecto', async () => {
    const wrapper = mount(AgencyForm)

    const inputs = wrapper.findAll('input')

    await inputs[0]!.setValue('LIM01')
    await inputs[1]!.setValue('LogiTrack Lima')
    await inputs[2]!.setValue('870-215-1024')
    await inputs[3]!.setValue('Lefflerhaven')

    await wrapper.find('textarea').setValue('99279 Kenyatta Knoll')
    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('submit')?.[0]?.[0]).toEqual({
      code: 'LIM01',
      name: 'LogiTrack Lima',
      address: '99279 Kenyatta Knoll',
      phone: '870-215-1024',
      district: 'Lefflerhaven',
      is_active: true,
    })
  })

  it('pinta el error del código duplicado', () => {
    const error = new ApiError('The given data was invalid.', 422, undefined, {
      code: ['The code has already been taken.'],
    })

    const wrapper = mount(AgencyForm, { props: { error } })

    expect(wrapper.text()).toContain('The code has already been taken.')
  })
})
