import { mount, type VueWrapper } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { ApiError } from '@/core/api/errors'
import type { AssignPermissionsPayload, Permission, Role } from '../../types/permissions.types'
import RolePermissionsForm from '@/modules/permissions/components/RolePermissionsForm.vue'

/**
 * Asignación de permisos a un rol: el backend **sustituye** la lista
 * (`syncPermissions`), así que el formulario arranca con lo que el rol ya tiene
 * y manda la selección completa.
 */

const role: Role = {
  id: 4,
  name: 'counter',
  guard_name: 'web',
  permissions: ['persons.view'],
  created_at: '2026-10-18T20:18:04.000000Z',
  updated_at: '2026-10-18T20:18:04.000000Z',
}

function permission(id: number, name: string): Permission {
  return {
    id,
    name,
    guard_name: 'web',
    created_at: '2026-10-18T20:18:04.000000Z',
    updated_at: '2026-10-18T20:18:04.000000Z',
  }
}

const permissions: Permission[] = [
  permission(1, 'persons.view'),
  permission(2, 'persons.manage'),
  permission(3, 'users.manage'),
]

/** Casilla del permiso que se llama así (los agrupa por recurso). */
function checkboxFor(wrapper: VueWrapper, name: string) {
  const checkbox = wrapper
    .findAll('input[type="checkbox"]')
    .find((candidate) => candidate.element.closest('label')?.textContent?.includes(name))

  if (!checkbox) {
    throw new Error(`No checkbox for ${name}`)
  }

  return checkbox
}

describe('RolePermissionsForm', () => {
  it('arranca con los permisos que el rol ya tiene', () => {
    const wrapper = mount(RolePermissionsForm, { props: { role, permissions } })

    expect((checkboxFor(wrapper, 'persons.view').element as HTMLInputElement).checked).toBe(true)
    expect((checkboxFor(wrapper, 'persons.manage').element as HTMLInputElement).checked).toBe(false)
    expect((checkboxFor(wrapper, 'users.manage').element as HTMLInputElement).checked).toBe(false)
  })

  it('emite la selección completa, con los permisos añadidos', async () => {
    const wrapper = mount(RolePermissionsForm, { props: { role, permissions } })

    await checkboxFor(wrapper, 'users.manage').trigger('change')
    await wrapper.find('form').trigger('submit')

    const payload = wrapper.emitted('submit')?.[0]?.[0] as AssignPermissionsPayload

    expect(new Set(payload.permission_ids)).toEqual(new Set([1, 3]))
  })

  it('quitar un permiso también viaja en el payload', async () => {
    const wrapper = mount(RolePermissionsForm, { props: { role, permissions } })

    await checkboxFor(wrapper, 'persons.view').trigger('change')
    await wrapper.find('form').trigger('submit')

    const payload = wrapper.emitted('submit')?.[0]?.[0] as AssignPermissionsPayload

    expect(payload.permission_ids).toEqual([])
  })

  it('pinta el mensaje del backend cuando falla la asignación', () => {
    const error = new ApiError('This action is unauthorized.', 403)

    const wrapper = mount(RolePermissionsForm, { props: { role, permissions, error } })

    expect(wrapper.text()).toContain('This action is unauthorized.')
  })

  it('muestra el nombre del rol', () => {
    const wrapper = mount(RolePermissionsForm, { props: { role, permissions } })

    expect(wrapper.text()).toContain('counter')
  })
})
