# logistics-app-frontend

SPA del **backoffice web** del proyecto logístico (Vue 3 + TypeScript). Consume el API de `logistics-app-backend` (Sanctum con cookie de sesión + permisos). El plan y las decisiones de arquitectura viven en el repo `logistics-app-spec`.

## Stack

- Vue 3.5 (Composition API, `<script setup lang="ts">`) + Vite 8 + TypeScript 6
- Pinia 3, vue-router 5, Tailwind v4 y axios
- Tests: Vitest (jsdom, `src/**/__tests__/*.spec.ts`) y Playwright (`e2e/`)
- Calidad: `oxfmt` (formato), `oxlint` + ESLint (estilo), `vue-tsc --build` (tipos)

## Arranque

```sh
pnpm install
pnpm dev          # http://localhost:5173
```

El frontend no corre en Docker: usa el `pnpm` del host (`engines.node: ^22.18.0 || >=24.12.0`, pnpm 11). Para el recorrido completo hace falta el backend local en `http://localhost:8000` (Docker), que es el origen por defecto de la capa API.

## Comandos

| Comando | Qué hace |
| --- | --- |
| `pnpm check` | **El CI en local**: format:check, lint, type-check, test:unit y build. Que quede en verde antes de decir que algo está hecho. |
| `pnpm format` / `pnpm lint` | Arreglan en sitio (escriben, no solo comprueban). |
| `pnpm type-check` | `vue-tsc --build` (app + tests). |
| `pnpm test:unit` | Vitest en modo run (`pnpm test:unit:watch` en watch). |
| `pnpm test:e2e` | Playwright contra el **backend local** (no corre en el CI). |
| `pnpm build-only` / `pnpm build` | Compila a `dist/` (con type-check en el segundo). |
| `pnpm gen:api` | Regenera `src/core/api/generated/openapi.d.ts` desde el contrato OpenAPI **versionado** del backend. Ver `AGENTS.md` para el flujo completo. |
| `pnpm gen:module <nombre>` | Crea un módulo nuevo con la estructura autocontenida (starter funcional, registrado por convención en el router). |

## Arquitectura

Un módulo por dominio, autocontenido. Lo transversal (sesión, guard, shell de UI, capa HTTP) vive en `core/`:

```
src/
├── core/                     # Transversal
│   ├── api/                  # Capa API: client, errors, config, auth (sesión), generated/, types
│   ├── components/           # AppShell y UI reutilizable (Button, Card, DataTable, ListState...)
│   ├── composables/          # useAuth, useTheme, useToast, useAsyncData...
│   ├── stores/               # Pinia: auth (sesión), theme
│   └── types/                # Tipos de UI (navegación, toasts, tema)
├── modules/                  # Un módulo por dominio:
│   └── customers/
│       ├── api/              # Llamadas HTTP del dominio (puerta única: core/api/client)
│       ├── types/            # Tipos derivados del contrato OpenAPI (nunca a mano)
│       ├── stores/           # Estado Pinia del dominio (listados + mutaciones)
│       ├── composables/      # Lógica de presentación de las pantallas
│       ├── components/       # Privados del módulo
│       ├── pages/            # Pantallas (PascalCase, sin index.vue)
│       ├── router/index.ts   # Rutas del módulo (descubiertas por convención)
│       ├── __tests__/        # Specs por capa: api/, components/, composables/, stores/
│       └── index.ts          # Entrada pública: store + composables + api + tipos
└── router/                   # index.ts (glob de módulos) y guard.ts (sesión y permisos)
```

- **Rutas por convención**: `src/router/index.ts` descubre `modules/*/router/index.ts` con `import.meta.glob`; un módulo nuevo queda registrado sin tocar el router, y un test lo verifica.
- **Solo hay una puerta a la red**: `core/api/client.ts` (axios + cookie de sesión Sanctum + interceptores 419/401). Los módulos llaman a `http` con rutas `/api/v1/...`; nunca `axios`/`fetch` directos.
- **Tipos del contrato**: las respuestas del backend se **deriven** de `openapi.d.ts` (generado por `pnpm gen:api`) con los helpers `ResponseOf`/`RequestOf`/`QueryOf` — nada de interfaces escritas a mano (ADR-0008). Cada módulo deriva los suyos en `types/<dominio>.types.ts`; `core/api/types.ts` queda con los helpers y los tipos de la sesión.
- **Sesión**: cookie `HttpOnly` de Sanctum; el ciclo (login, `me`, logout) vive en `core/stores/auth.ts` + `core/api/auth.ts`, y `useAuth` es la fachada de la UI. El guard del router (`meta.requiresAuth` / `meta.permission`) solo es **presentación**: la autorización la hace el backend en cada petición.
- **Estados de pantalla**: `loading | error | empty | data` con `ListState.vue` + `useAsyncData`. Sin tablas en blanco.

### Añadir un módulo

```sh
pnpm gen:module <nombre-en-kebab-plural>   # p. ej. orders, credit-notes
```

Genera el andamio completo (api/types/stores/composables/pages/router/tests) con un starter funcional y los pasos que quedan a mano en pantalla.

## Tests

- **Unitarios**: Vitest + jsdom; mockean la capa API (sin red en los tests), cubren interceptores del client, store de sesión, guard y las capas de cada módulo.
- **E2E**: `e2e/auth.spec.ts` (smoke de sesión) requiere el backend local: `pnpm test:e2e`.

Detalles completos para agentes: ver [`AGENTS.md`](AGENTS.md).
