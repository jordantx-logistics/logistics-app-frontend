import { describe, expect, it } from 'vitest'

import routes from '../../router'

describe('rutas de customers', () => {
  it('exige `customers.view`, el permiso del catálogo del backend', () => {
    expect(routes[0]?.meta.permission).toBe('customers.view')
  })
})
