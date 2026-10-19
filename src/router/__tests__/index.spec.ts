import { describe, expect, it } from 'vitest'

import router from '@/router'

// El mismo glob que usa el router: cada módulo con
// `src/modules/*/router/index.ts`. Si alguien reintroduce el agregado a mano o
// se rompe la convención, este test lo señala módulo y ruta concretos.
const routeModules = import.meta.glob<{ default: { path: string }[] }>(
  '@/modules/*/router/index.ts',
  {
    eager: true,
  },
)

describe('registro automático de rutas de módulos', () => {
  it('hay módulos que declarar rutas', () => {
    expect(Object.keys(routeModules).length).toBeGreaterThan(0)
  })

  it('todas las rutas declaradas por los módulos quedan registradas', () => {
    const registeredPaths = new Set(router.getRoutes().map((route) => route.path))

    for (const [file, mod] of Object.entries(routeModules)) {
      expect(mod.default.length, `routes de ${file}`).toBeGreaterThan(0)

      for (const route of mod.default) {
        expect(registeredPaths.has(route.path), `ruta ${route.path} de ${file}`).toBe(true)
      }
    }
  })
})
