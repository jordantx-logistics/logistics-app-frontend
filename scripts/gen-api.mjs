#!/usr/bin/env node
/**
 * Genera los tipos TypeScript del contrato OpenAPI del backend (ADR-0008).
 *
 * El contrato no se versiona en este repo: se descarga del backend en vivo
 * (`GET /docs.openapi`, que sirve el último `scribe:generate`). Antes de
 * ejecutarlo, el backend tiene que estar levantado y con la documentación
 * regenerada:
 *
 *   cd ../logistics-app-backend
 *   docker compose exec app php artisan scribe:generate
 *
 *   cd ../logistics-app-frontend
 *   pnpm gen:api
 *
 * La URL del backend sale de `VITE_API_URL` (`.env`) y, si no está definida,
 * del valor por defecto de `src/core/api/config.ts` (`http://localhost:8000`).
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

import openapiTS, { astToString } from 'openapi-typescript'
import { loadEnv } from 'vite'

const DEFAULT_API_URL = 'http://localhost:8000'
const OUTPUT = resolve('src/core/api/generated/openapi.d.ts')

// `loadEnv` solo expone lo que empieza por el prefijo indicado (`VITE_`), que
// es justo lo que puede acabar en el navegador. `process.env` manda, para
// poder apuntar a otro backend sin tocar `.env` (`VITE_API_URL=... pnpm gen:api`).
const fileEnv = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), 'VITE_')
const baseUrl = (process.env.VITE_API_URL ?? fileEnv.VITE_API_URL ?? DEFAULT_API_URL).replace(/\/+$/, '')
const contractUrl = `${baseUrl}/docs.openapi`

let contract
try {
  const response = await fetch(contractUrl)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`)
  }
  contract = await response.text()
} catch (cause) {
  console.error(`No se pudo descargar el contrato OpenAPI de ${contractUrl}`)
  console.error(`  ${cause instanceof Error ? cause.message : String(cause)}`)
  console.error('')
  console.error('Levanta el backend y regenera la documentación:')
  console.error('  cd ../logistics-app-backend')
  console.error('  docker compose up -d app')
  console.error('  docker compose exec app php artisan scribe:generate')
  process.exit(1)
}

// `openapiTS` acepta el YAML/JSON tal cual y devuelve un AST; `astToString` lo
// convierte en el `.d.ts`. El encabezado lo añadimos nosotros: deja claro que
// el archivo no se edita a mano y cómo se regenera.
const ast = await openapiTS(contract)
const header = [
  '/**',
  ' * GENERADO — NO EDITAR A MANO.',
  ' *',
  ' * Tipos del contrato OpenAPI del backend (`GET /docs.openapi`).',
  ` * Generado con \`pnpm gen:api\` desde ${contractUrl}`,
  ' * Ver `spec/09-decisiones/ADR-0008-openapi-tipos-generados.md`.',
  ' */',
  '',
  '',
].join('\n')

await mkdir(dirname(OUTPUT), { recursive: true })
await writeFile(OUTPUT, header + astToString(ast), 'utf8')

console.log(`Tipos generados en ${OUTPUT.replace(`${process.cwd()}\\`, '').replace(`${process.cwd()}/`, '')}`)
