#!/usr/bin/env node
/**
 * Genera los tipos TypeScript del contrato OpenAPI del backend (ADR-0008).
 *
 * La fuente es la copia **versionada** del contrato:
 * `openapi/openapi.yaml` del repo `logistics-app-backend` (criterio 10 de la
 * Fase 1). Ya no hace falta el backend levantado ni descargar el vivo: la copia
 * es canónica — el CI del backend garantiza que coincide con su código — y el
 * CI de este repo compara la derivación de abajo contra lo que está commiteado
 * (falla si hay deriva, o sea: si `openapi.d.ts` no se regeneró o se tocó a mano).
 *
 *   pnpm gen:api
 *
 * La ruta por defecto es el repo hermano (`../logistics-app-backend/…`); la
 * variable `CONTRACT_PATH` la cambia — el CI de este repo hace un checkout
 * adicional del backend y apunta ahí.
 */
import { spawnSync } from 'node:child_process'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'

import openapiTS, { astToString } from 'openapi-typescript'

const DEFAULT_CONTRACT = resolve(
  process.cwd(),
  '..',
  'logistics-app-backend',
  'openapi',
  'openapi.yaml',
)
const CONTRACT = process.env.CONTRACT_PATH ? resolve(process.env.CONTRACT_PATH) : DEFAULT_CONTRACT
const OUTPUT = resolve('src/core/api/generated/openapi.d.ts')

let contract
try {
  contract = await readFile(CONTRACT, 'utf8')
} catch (cause) {
  console.error(`No se pudo leer el contrato OpenAPI en ${CONTRACT}`)
  console.error(`  ${cause instanceof Error ? cause.message : String(cause)}`)
  console.error('')
  console.error('El backend lo versiona en `openapi/openapi.yaml` (repo logistics-app-backend).')
  console.error('Si falta, regenerarlo en ese repo:')
  console.error('  docker compose exec app php artisan scribe:generate')
  console.error('  docker compose exec app sh scripts/contract-sync.sh')
  process.exit(1)
}

// `openapiTS` acepta el YAML tal cual y devuelve un AST; `astToString` lo
// convierte en el `.d.ts`. El encabezado lo añadimos nosotros: deja claro que
// el archivo no se edita a mano y cómo se regenera.
const ast = await openapiTS(contract)
const header = [
  '/**',
  ' * GENERADO — NO EDITAR A MANO.',
  ' *',
  ' * Tipos del contrato OpenAPI del backend, versionado en',
  ' * `openapi/openapi.yaml` del repo `logistics-app-backend` (criterio 10 de',
  ' * la Fase 1; ADR-0008): el CI compara esta derivación contra el contrato',
  ' * commiteado y falla si hay deriva. Regenerar con `pnpm gen:api` (la ruta',
  ' * concreta la fija `CONTRACT_PATH`; en el CI, el checkout adicional del',
  ' * repo backend).',
  ' */',
  '',
  '',
].join('\n')

await mkdir(dirname(OUTPUT), { recursive: true })
await writeFile(OUTPUT, header + astToString(ast), 'utf8')

// El `.d.ts` está versionado y `oxfmt` también lo formatea (`oxfmt src/`), así
// que la derivación formateada aquí DEBE coincidir con el commiteado: sin este
// paso, el chequeo de deriva del CI apuntaría una deriva falsa solo por formato.
// En Windows el `.bin/oxfmt.cmd` solo corre bajo `cmd /c`; en Linux/macOS, directo.
const binDir = join(process.cwd(), 'node_modules', '.bin')
const result =
  process.platform === 'win32'
    ? spawnSync('cmd.exe', ['/c', join(binDir, 'oxfmt.cmd'), OUTPUT], { stdio: 'inherit' })
    : spawnSync(join(binDir, 'oxfmt'), [OUTPUT], { stdio: 'inherit' })
if (result.status !== 0) {
  console.error('oxfmt no pudo formatear el archivo generado.')
  process.exit(result.status ?? 1)
}

console.log(`Tipos generados en ${OUTPUT.replace(`${process.cwd()}\\`, '').replace(`${process.cwd()}/`, '')}`)
