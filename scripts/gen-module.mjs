#!/usr/bin/env node
/**
 * Crea un módulo nuevo del frontoffice con la estructura autocontenida.
 *
 *   pnpm gen:module orders
 *
 * Genera `src/modules/<nombre>/` completo (api/, components/, composables/,
 * pages/, stores/, types/, router/ e index.ts, con __tests__/ por capa) con un
 * starter funcional: el módulo compila, queda registrado en el router por
 * convención (import.meta.glob sobre los router de los módulos) y muestra un
 * listado vacío hasta que el backend exponga el dominio.
 *
 * Reglas del scaffold:
 * - El nombre es kebab-case en plural (`customers`, `orders`, `credit-notes`).
 * - No sobrescribe: falla si `src/modules/<nombre>/` ya existe.
 * - Nada de datos mock permanentes: la api placeholder devuelve una lista
 *   vacía, y los tipos provisorios viven en `types/` solo hasta que el
 *   contrato OpenAPI incluya el dominio (entonces se derivan con los helpers
 *   de `core/api/types` según ADR-0008 y se corre `pnpm gen:api`).
 * - El router raíz (`src/router/index.ts`) ya descubre los `router/index.ts`
 *   de los módulos con un `import.meta.glob`, así que el módulo queda
 *   registrado sin tocar nada más.
 *
 * Después del scaffold quedan **dos pasos manuales**: dar de alta la entrada
 * de menú en `core/components/Sidebar.vue` (con su `permission:`) y sustituir
 * el `meta.permission` cuando el backend disponga de permisos del dominio.
 *
 * Al igual que `gen-api.mjs`, el formato final lo da oxfmt (mismo trato
 * Windows-safe, porque el `.bin/oxfmt.cmd` solo corre bajo `cmd /c`).
 */
import { spawnSync } from 'node:child_process'
import { access, mkdir, writeFile } from 'node:fs/promises'
import { constants } from 'node:fs'
import { dirname, join, resolve } from 'node:path'

// ---------------------------------------------------------------------------
// Validación del nombre
// ---------------------------------------------------------------------------

const name = process.argv[2]

const NAME_PATTERN = /^[a-z][a-z0-9]*(?:-[a-z][a-z0-9]*)*$/

if (!name || !NAME_PATTERN.test(name)) {
  console.error('Uso: pnpm gen:module <nombre>')
  console.error('')
  console.error('El nombre va en kebab-case, singular de dominio y sin espacios')
  console.error('(ejemplos: `orders`, `customers`, `credit-notes`).')
  process.exit(1)
}

const MODULE_DIR = resolve('src/modules', name)

try {
  await access(MODULE_DIR, constants.F_OK)
  console.error(`El módulo ya existe: src/${rel(MODULE_DIR)} — no se sobrescribe.`)
  process.exit(1)
} catch {
  // Bien: el módulo no existe, seguimos.
}

function rel(absolute) {
  return absolute.replace(`${process.cwd()}\\`, '').replace(`${process.cwd()}/`, '')
}

/** Ruta del módulo relativa a la raíz del repo (para cabeceras y logs). */
const SRC_DIR = rel(MODULE_DIR)

// ---------------------------------------------------------------------------
// Nombres derivados del nombre de módulo
// ---------------------------------------------------------------------------

/** `credit-notes`  → `creditNotes`. */
const camel = name.replace(/-([a-z0-9])/g, (_, char) => char.toUpperCase())

/** `credit-notes`  → `CreditNotes`. */
const pascal = camel.charAt(0).toUpperCase() + camel.slice(1)

/** Escribe un archivo del módulo, creando las carpetas que hagan falta. */
async function emit(relativePath, content) {
  const target = join(MODULE_DIR, relativePath)
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, content, 'utf8')
}

/** Título del banner de la consola. */
const RULE = '-'.repeat(72)

// ---------------------------------------------------------------------------
// Plantillas
// ---------------------------------------------------------------------------

const files = {}

files[`api/${camel}.api.ts`] = `import { http } from '@/core/api/client'
import { API_BASE_PATH } from '@/core/api/config'
import type { ${pascal}Row, List${pascal}Response } from '../types/${camel}.types'

/**
 * \`${name}\` — endpoints placeholder mientras el backend no exponga este dominio.
 *
 * Al conectar el recurso real:
 * 1. Deriva los tipos en \`types/${camel}.types.ts\` con \`ResponseOf\`/\`RequestOf\`
 *    (ADR-0008) tras correr \`pnpm gen:api\` con el contrato actualizado.
 * 2. Sustituye este listado por el endpoint de verdad.
 */

const ${name.toUpperCase().replaceAll('-', '_')}_PATH = \`\${API_BASE_PATH}/${name}\`

/** Filas del listado. Placeholder: \`[]\` hasta que exista el endpoint real. */
export async function list${pascal}(): Promise<${pascal}Row[]> {
  const { data } = await http.get<List${pascal}Response>(${name.toUpperCase().replaceAll('-', '_')}_PATH)

  return data.data ?? []
}
`

files['api/index.ts'] = `export * from './${camel}.api'
`

// Tipos provisorios: se sustituyen por alias del contrato (ADR-0008) cuando el
// backend exponga el dominio; mientras tanto el starter necesita compilar.
files[`types/${camel}.types.ts`] = `/**
 * Tipos del módulo \`${name}\`.
 *
 * PROVISORIOS: cuando el backend exponga el dominio, sustitúyelos por alias
 * derivados del contrato con los helpers de \`@/core/api/types\`
 * (\`ResponseOf\`, \`RequestOf\`, \`QueryOf\`; ADR-0008). Nada de escribir a mano
 * las formas de las respuestas del backend.
 */

/** Fila del listado placeholder. */
export interface ${pascal}Row {
  id: number
}

/** Sobre mínimo del endpoint placeholder. */
export interface List${pascal}Response {
  success: boolean
  message: string
  data: ${pascal}Row[]
}
`

files[`stores/use${pascal}Store.ts`] = `import { defineStore } from 'pinia'

import { useAsyncData } from '@/core/composables/useAsyncData'

import { list${pascal} } from '../api'

/**
 * Estado del módulo \`${name}\`: el listado del API. Los permisos y la sesión NO
 * viven aquí (los lleva core/).
 */
export const use${pascal}Store = defineStore('${camel}', () => {
  const load = useAsyncData(list${pascal})

  return {
    ${camel}: load,
  }
})
`

files[`composables/use${pascal}Table.ts`] = `import { computed } from 'vue'

import type { Column } from '@/core/components/types'

import { use${pascal}Store } from '../stores/use${pascal}Store'

/**
 * Lógica de presentación del módulo \`${name}\`: columnas del listado y lecturas
 * del store. Extiende aquí filtros y paginación cuando haya datos reales; el
 * estado vive en \`stores/use${pascal}Store.ts\`.
 *
 * Ojo con los refs anidados: al pasar por el store de Pinia, las propiedades
 * \`data\`, \`status\` y \`error\` llegan ya desenvueltas (no llevan \`.value\`),
 * igual que en las plantillas.
 */
export function use${pascal}Table() {
  const store = use${pascal}Store()

  const rows = computed(() => store.${camel}.data ?? [])
  const status = computed(() => store.${camel}.status)
  const error = computed(() => store.${camel}.error)

  const columns: Column[] = [
    // TODO: columnas reales cuando el recurso exista.
    { key: 'id', label: 'Id' },
  ]

  return {
    rows,
    status,
    error,
    columns,
    reload: () => store.${camel}.load(),
  }
}
`

files[`pages/${pascal}ListPage.vue`] = `<script setup lang="ts">
import { onMounted } from 'vue'

import AppShell from '@/core/components/AppShell.vue'
import Card from '@/core/components/Card.vue'
import ListState from '@/core/components/ListState.vue'

import { use${pascal}Table } from '../composables/use${pascal}Table'

/**
 * \`${name}\`: starter del módulo — listado con sus cuatro estados
 * (\`loading | error | empty | data\`). No dejes una tabla en blanco: cuando el
 * backend exponga el recurso, conecta aquí tu \`DataTable\` real.
 */

const { rows, status, error, columns, reload } = use${pascal}Table()

onMounted(() => {
  void reload()
})
</script>

<template>
  <AppShell>
    <div class="${camel}-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">${pascal}</h1>
          <p class="page-subtitle">Placeholder module: connect the real resource</p>
        </div>
      </div>

      <Card class="table-card">
        <template #header>
          <div class="table-header">
            <h2 class="table-title">${pascal} ({{ rows.length }})</h2>
          </div>
        </template>

        <ListState
          :status="status"
          :error="error"
          :empty="rows.length === 0"
          empty-text="Nothing here yet — connect the API."
          @retry="reload"
        >
          <!-- TODO: DataTable real con columnas y slots por columna. -->
        </ListState>
      </Card>
    </div>
  </AppShell>
</template>

<style scoped>
.${camel}-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-title {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--fg);
}

.page-subtitle {
  font-size: 13px;
  color: var(--muted);
  margin-top: 2px;
}

.table-card {
  padding-bottom: 12px;
}
</style>
`

files['router/index.ts'] = `/**
 * Rutas del módulo \`${name}\`.
 *
 * El router central (\`src/router/index.ts\`) las descubre por convención con
 * \`import.meta.glob('modules/<dominio>/router/index.ts')\`: no hay registro a mano.
 * Han de ir por **nombre** (no por path) y con \`meta.permission\` que el guard
 * usa solo como presentación (la autorización real es del backend).
 */
export default [
  {
    path: '/${name}',
    name: '${camel}',
    component: () => import('../pages/${pascal}ListPage.vue'),
    // TODO: cuando el backend tenga permisos para este dominio (recurso.accion,
    // ej. \`orders.view\`), añádelo a \`meta.permission\` y a la entrada del Sidebar.
    meta: { requiresAuth: true },
  },
]
`

// Entrada pública del módulo: lo único que puede consumir otro módulo.
files['index.ts'] = `/**
 * Entrada pública del módulo \`${name}\`.
 *
 * La página la registra el router (\`./router\`) y los componentes internos
 * (\`./components\`) quedan privados: aquí solo vive lo que otro módulo puede
 * consumir (store, lógica de tabla, api y tipos).
 */
export { use${pascal}Store } from './stores/use${pascal}Store'
export { use${pascal}Table } from './composables/use${pascal}Table'
export * from './api'
export * from './types/${camel}.types'
`

// ---------------------------------------------------------------------------
// Specs iniciales: api y stores con pruebas reales; components/composables
// placeholders que pasarán hasta escribir las correspondientes.
// ---------------------------------------------------------------------------

files[`__tests__/api/${camel}.api.spec.ts`] = `import { beforeEach, describe, expect, it, vi } from 'vitest'

import { list${pascal} } from '@/modules/${name}/api'

/**
 * \`${name}\`: el HTTP va mockeado (aquí no hay red). Placeholder: el endpoint
 * placeholder devuelve la lista vacía del sobre.
 */

const { httpMock } = vi.hoisted(() => ({
  httpMock: {
    get: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
    post: vi.fn<(...args: unknown[]) => Promise<{ data: unknown }>>(),
  },
}))

vi.mock('@/core/api/client', () => ({ http: httpMock }))

beforeEach(() => {
  vi.clearAllMocks()
})

describe('list${pascal} (placeholder)', () => {
  it('pide la ruta del módulo y desenvuelve una lista vacía', async () => {
    httpMock.get.mockResolvedValue({
      data: { success: true, message: 'ok', data: [] },
    })

    await expect(list${pascal}()).resolves.toEqual([])
    expect(httpMock.get).toHaveBeenCalledWith('/api/v1/${name}')
  })
})
`

files['__tests__/stores/use' + pascal + 'Store.spec.ts'] = `import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { use${pascal}Store } from '@/modules/${name}/stores/use${pascal}Store'

/**
 * \`${name}\`: el store arranca vacío y cargable (sin red: la api va mockeada).
 */

vi.mock('@/modules/${name}/api', () => ({
  list${pascal}: vi.fn(async () => []),
}))

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('use${pascal}Store', () => {
  it('empieza sin datos y con la carga pendiente', () => {
    const store = use${pascal}Store()

    // A través del store de Pinia los refs anidados llegan desenvueltos.
    expect(store.${camel}.data).toBeNull()
    expect(store.${camel}.status).toBe('idle')
  })
})
`

files['__tests__/composables/use' + pascal + 'Table.spec.ts'] = `import { describe, expect, it } from 'vitest'

describe('use${pascal}Table', () => {
  it('placeholder — sustituir por pruebas reales al dar forma al módulo', () => {
    expect([])
    // TODO: probar columnas, filtros y paginación cuando existan.
  })
})
`

files['__tests__/components/' + camel + '.spec.ts'] = `import { describe, expect, it } from 'vitest'

describe('${pascal} components', () => {
  it('placeholder — sustituir por pruebas reales al dar forma al módulo', () => {
    expect(true).toBe(true)
    // TODO: montar los componentes del módulo aquí cuando existan.
  })
})
`

// ---------------------------------------------------------------------------
// Escritura + formato
// ---------------------------------------------------------------------------

for (const [file, content] of Object.entries(files)) {
  await emit(file, content)
}

// `components/` forma parte de la estructura estándar del módulo aunque el
// starter no tenga componentes todavía.
await emit('components/.gitkeep', '')

// Tras generar, formatear lo nuevo con oxfmt: mismo tratamiento que en
// `gen-api.mjs` (en Windows el \`.bin/oxfmt.cmd\` solo corre bajo \`cmd /c\`).
const binDir = join(process.cwd(), 'node_modules', '.bin')
const result =
  process.platform === 'win32'
    ? spawnSync('cmd.exe', ['/c', join(binDir, 'oxfmt.cmd'), MODULE_DIR], { stdio: 'inherit' })
    : spawnSync(join(binDir, 'oxfmt'), [MODULE_DIR], { stdio: 'inherit' })
if (result.status !== 0) {
  console.error('oxfmt no pudo formatear el módulo generado.')
  process.exit(result.status ?? 1)
}

console.log(RULE)
console.log(`Módulo ${name} creado en ${SRC_DIR}/`)
console.log('')
console.log('Queda registrado en el router por convención (glob sobre los')
console.log(`router de los módulos) y accesible en /${name}.`)
console.log('')
console.log('Pasos que quedan a mano:')
console.log('  1. Entrada del menú en src/core/components/Sidebar.vue')
console.log(`     { label: '${pascal}', icon: '...', path: '/${name}', permission: '<recurso>.<acción>' }`)
console.log('  2. Cuando el backend exponga el dominio: `pnpm gen:api` + derivar')
console.log(`     los tipos en types/${camel}.types.ts con ResponseOf/RequestOf`)
console.log(`     (ADR-0008), reemplazar el listado placeholder en api/${camel}.api.ts`)
console.log('     y completar meta.permission en router/index.ts.')
console.log(RULE)

