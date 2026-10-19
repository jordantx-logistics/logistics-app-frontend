import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { ApiError } from '@/core/api/errors'
import PersonForm from '@/modules/customers/components/PersonForm.vue'

/**
 * Alta de persona: el formulario solo emite el payload (el módulo hace el
 * `POST`), y pinta los errores de validación del backend bajo cada campo.
 */

describe('PersonForm', () => {
  it('emite el payload con los opcionales vacíos como `null`', async () => {
    const wrapper = mount(PersonForm)

    await wrapper.find('select').setValue('RUC')

    const inputs = wrapper.findAll('input')

    await inputs[0]!.setValue('20151757680')
    await inputs[1]!.setValue('Noah')
    await inputs[2]!.setValue('Cronin')
    await inputs[3]!.setValue('noah@example.net')
    await inputs[4]!.setValue('203-867-3351')

    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('submit')?.[0]?.[0]).toEqual({
      document_type: 'RUC',
      document_number: '20151757680',
      first_name: 'Noah',
      last_name: 'Cronin',
      email: 'noah@example.net',
      phone: '203-867-3351',
    })
  })

  it('pinta el mensaje de validación (422) del campo que falla', () => {
    const error = new ApiError('The given data was invalid.', 422, undefined, {
      document_number: ['The document number has already been taken.'],
    })

    const wrapper = mount(PersonForm, { props: { error } })

    expect(wrapper.text()).toContain('The document number has already been taken.')
    // El aviso general no se duplica cuando el fallo es de validación.
    expect(wrapper.text()).not.toContain('The given data was invalid.')
  })

  it('muestra el mensaje general cuando el fallo no es de validación', () => {
    const error = new ApiError('Could not reach the server.')

    const wrapper = mount(PersonForm, { props: { error } })

    expect(wrapper.text()).toContain('Could not reach the server.')
  })

  it('emite `cancel` al pulsar Cancel', async () => {
    const wrapper = mount(PersonForm)

    await wrapper.findAll('button')[0]!.trigger('click')

    expect(wrapper.emitted('cancel')).toHaveLength(1)
  })
})
