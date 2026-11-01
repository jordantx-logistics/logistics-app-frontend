import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'

import PermissionGate from '@/core/components/PermissionGate.vue'
import { useAuthStore } from '@/core/stores/auth'

function render(props: { permission?: string; any?: string[] }) {
  return mount(PermissionGate, {
    props,
    slots: { default: '<button>Action</button>', fallback: '<span>Denied</span>' },
  })
}

describe('PermissionGate', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    useAuthStore().permissions = ['orders.view']
  })

  it('pinta el contenido con el permiso', () => {
    expect(render({ permission: 'orders.view' }).text()).toBe('Action')
  })

  it('pinta el fallback sin el permiso', () => {
    expect(render({ permission: 'orders.create' }).text()).toBe('Denied')
  })

  it('con `any` basta uno de los permisos', () => {
    expect(render({ any: ['orders.create', 'orders.view'] }).text()).toBe('Action')
    expect(render({ any: ['orders.create', 'orders.cancel'] }).text()).toBe('Denied')
  })

  it('exige `permission` aunque `any` se cumpla', () => {
    expect(render({ permission: 'orders.create', any: ['orders.view'] }).text()).toBe('Denied')
  })
})
