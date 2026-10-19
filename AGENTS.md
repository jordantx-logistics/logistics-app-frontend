# AGENTS.md

Guía para agentes que trabajen en este repositorio: la **SPA del backoffice** (web) del proyecto logístico. Consume el API de `logistics-app-backend` (Sanctum + permisos).

El plan y las decisiones viven en el repo privado **`logistics-app-spec`** (roadmap `03-roadmap/fase-01-migracion-mvp.md` §5, arquitectura en `05-frontend/web-backoffice/`, contrato en `08-calidad/02-contrato-openapi-frontend.md`).

> `QWEN.md` y `plan.md` son material del andamiaje (dan por buenos los datos mock y describen un login por token que ya no existe). No los tomes como estado: lo vigente es este archivo y el spec.

## Stack

Vue 3.5 + Vite 8 + TypeScript 6, Pinia 3, vue-router 5, Tailwind v4 y axios. Tests con Vitest (jsdom) y Playwright. Formato con **oxfmt**, estilo con **oxlint** + ESLint. Los tipos de las respuestas del backend se generan del contrato OpenAPI (ver «Capa API»).

## Comandos

El frontend se ejecuta **con `pnpm` del host** (`engines.node: ^22.18.0 || >=24.12.0`, pnpm 11). No hay Docker para el frontend; el backend sí corre solo en Docker.

- `pnpm install` — dependencias.
- `pnpm dev` — servidor de Vite en `http://localhost:5173`.
- `pnpm check` — **lo mismo que el CI**, en orden: `format:check`, `check:lint`, `type-check`, `test:unit`, `build-only`. Es la comprobación que hay que dejar en verde antes de decir que algo está hecho.
- `pnpm format` / `pnpm lint` — arreglan en sitio (`oxfmt src/`, `oxlint --fix`, `eslint --fix`); escriben, no solo comprueban.
- `pnpm gen:api` — regenera `src/core/api/generated/openapi.d.ts` desde el contrato **versionado** del backend (`openapi/openapi.yaml` del repo hermano; criterio 10 de la Fase 1). Ya no necesita el backend levantado:

  ```bash
  # solo si el contrato cambió (docblocks o rutas del backend)
  cd ../logistics-app-backend
  docker compose exec app php artisan scribe:generate
  docker compose exec app php scripts/contract-sync.php

  cd ../logistics-app-frontend
  pnpm gen:api
  ```

  La ruta por defecto es `../logistics-app-backend/openapi/openapi.yaml`; `CONTRACT_PATH` la puede apuntar a otro lado (el CI de este repo hace un checkout adicional del backend y la fija). Tras generar, el script formatea la salida con `oxfmt`, que es la misma representación que la versionada: si `git diff -- src/core/api/generated/` marca cambios tras `pnpm gen:api`, el contrato cambió sin regenerarlos. CI: ambos gates fallan — el del backend si su copia deja de coincidir con el código, el de aquí si la derivación difiere de lo commiteado (ADR-0008).
- `pnpm test:unit` / `pnpm test:unit:watch` — Vitest (`src/**/__tests__/*.spec.ts`).
- `pnpm test:e2e` — Playwright (`e2e/`, chromium por defecto). Necesita el backend local levantado para el recorrido de sesión; **no** se ejecuta en el CI.

## Arquitectura

```
src/
├── core/                  # Transversal
│   ├── api/              # Capa API (ver abajo): client, errors, types, auth
│   ├── components/       # App shell y UI reutilizable (Button, Card, DataTable...)
│   ├── composables/      # useAuth, useTheme, useToast, useNavigation
│   ├── stores/           # Pinia: auth, theme
│   └── types/            # Tipos de UI y los mocks pendientes de retirar
├── modules/              # Un módulo por dominio: routes.ts + index.vue (+ components/, pages/)
└── router/               # index.ts (agrega rutas) y guard.ts (sesión y permisos)
```

- Cada módulo expone su `routes.ts` (array de rutas, con `component: () => import('./index.vue')` para code-splitting). `src/router/index.ts` los **descubre con `import.meta.glob`** (paso 5.8, Fase 1): un módulo nuevo queda registrado sin tocar el router; un test de router falla si la convención deja de registrar algo.
- Los módulos consumen la API real (`core/api/<modulo>.ts`): `orders`, `customers`, `agencies` y `permissions` conectados; `payments` en *empty state* hasta que el backend exponga sus endpoints. Al conectar un módulo, se retiran sus mocks y sus tipos inventados de `core/types/index.ts`; `src/core/types/index.ts` se queda con lo que sea de UI (navegación, toasts, tema).
- El sidebar (`core/components/Sidebar.vue`) deriva su navegación de la sesión y filtra cada entrada con `can()`.
- Estados de pantalla: `loading | error | empty | data` con `ListState.vue` + `useAsyncData` (paso 5.7), que usan los cuatro listados. No dejes una tabla en blanco sin estado.

### Guard de sesión y permisos

`src/router/guard.ts`, aplicado en `router.beforeEach`:

1. `await auth.ensureSession()` (una vez por carga de página). Si el backend no responde, se trata como **sin sesión** (`forgetSession()`) en vez de abortar la navegación: la app se quedaría en blanco.
2. Ruta protegida sin sesión → `login` con `?redirect=<fullPath>` (menos `/`, que no lo lleva).
3. Ruta pública con sesión yendo a `login` → `dashboard`.
4. `meta.permission` que el usuario no tiene → `dashboard`. Esto es **presentación**: la autorización real la hace el backend con `permission:` en cada ruta.

`meta` está aumentado en `guard.ts` (`requiresAuth`, por defecto `true`; `permission`). Rutas por **nombre**, no por path.

## Capa API (ADR-0008)

Reglas que no se negocian:

1. **Una sola puerta a la red**: todo pasa por `src/core/api/client.ts`. Ni componentes ni stores usan `axios`/`fetch` directamente.
2. **Los tipos de respuesta salen del contrato**, nunca escritos a mano. `src/core/api/types.ts` solo hace `alias` de endpoints y ajusta la opcionalidad: Scribe no emite `required`, así que se envuelve el sobre en `Required<JsonOf<OkOf<...>>>` derivado de `paths`. El frontend no hackea lo que el contrato no dice: si falta un campo o un envoltorio, se arregla el docblock del backend y se regenera.
3. **Errores normalizados**: los componentes solo ven `ApiError` (`errors.ts`), con `isNetworkError`/`isUnauthenticated`/`isForbidden`/`isValidationError`/`isRateLimited`/`isCsrfMismatch`, `fieldError('email')` y `status: null` cuando la petición ni llegó. Nadie inspecciona un `AxiosError`.
4. **Sin secretos en `VITE_*`**: acaban en el bundle. El origen del backend se resuelve en runtime con `window.__APP_CONFIG__.apiUrl`, luego `VITE_API_URL` y por último `http://localhost:8000` (`config.ts`).

Comportamiento de `client.ts`:

- `baseURL` es el **origen** (`http://localhost:8000`), sin `/api`: las rutas se escriben completas (`/api/v1/...`) para que Sanctum pueda usar `/sanctum/csrf-cookie`.
- `withCredentials: true` para la cookie de sesión `HttpOnly`. **Nunca** se guarda un token en el navegador.
- Interceptor de petición: pone `Accept: application/json`, `X-Requested-With` y `X-XSRF-TOKEN` leído de la cookie `document.cookie` (explícito, para poder testearlo).
- `419` (CSRF caducado, sesión viva) → pide `/sanctum/csrf-cookie` y repite la petición **una** vez.
- `401` → avisa a `setUnauthenticatedHandler` (el store limpia su estado **sin** llamar al backend, para no entrar en bucle).

Para añadir un módulo: crea `src/core/api/<modulo>.ts` con funciones tipadas y deriva sus tipos en `types.ts` a partir de `paths`. Los mocks de Vitest usan esos mismos tipos.

## Sesión y permisos

`src/core/stores/auth.ts` (Pinia) guarda usuario, `roles`, `permissions` y `agencies`, todo en la respuesta de `GET /auth/me` (o `POST /auth/login`), así que `can()` y `hasRole()` son síncronos. `ensureSession()` es idempotente (`initialized`) y es lo único que sabe del ciclo de sesión; `logout()`/`logoutAll()` limpian en `finally` aunque el backend falle. La sesión se restaura de la cookie al recargar, no de storage.

`src/core/composables/useAuth.ts` es la fachada de UI (login, logout, `can`, `hasRole`, `ensureSession`).

## Convenciones

- **Comentarios en español; textos de la interfaz en inglés** (la referencia de diseño está en inglés). Todavía **no hay capa de i18n**: cuando se aborde, será con `vue-i18n` y en un trabajo aparte. No metas literales nuevos en español en la UI.
- Componentes en PascalCase, `<script setup lang="ts">` y `index.vue` como entrada del módulo. Nombres de funciones y rutas en inglés.
- `noUncheckedIndexedAccess` está activo: indexar un array da `T | undefined`.
- Tipos de UI en `src/core/types/index.ts`; tipos del backend, generados (nunca aquí).

## Testing

- Unitarios: `src/**/__tests__/*.spec.ts`, entorno `jsdom`. `tsconfig.app.json` los excluye y `tsconfig.vitest.json` los incluye; `vue-tsc --build` comprueba ambos.
- Los tests **mockean la capa API** (`vi.mock('@/core/api/...')`) y no tocan la red. Hay tests de los interceptores (419/401/422, red), del store de sesión y del guard.
- E2E: `e2e/auth.spec.ts` es un smoke de sesión contra el backend local. El `baseURL` es `http://localhost:5173` en local y `4173` (preview) en CI; Playwright levanta el servidor solo si no hay uno en marcha.
- El CI no ejecuta e2e ni necesita Docker: solo instala, formatea, lintea, tipa, testea y compila.

## CI

`.github/workflows/ci.yml` (ramas `develop` y `main`, push y PR): `pnpm install --frozen-lockfile` y, en pasos separados, `format:check`, `check:lint`, `type-check`, `test:unit` y `build-only`. Es el mismo orden que `pnpm check`; si local pasa y el CI falla, es por dependencias o el lockfile.
