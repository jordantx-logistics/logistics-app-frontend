# AGENTS.md

Guía para agentes que trabajen en este repositorio: la **SPA del backoffice** (web) del proyecto logístico. Consume el API de `logistics-app-backend` (Sanctum + permisos).

El plan y las decisiones viven en el repo privado **`logistics-app-spec`** (roadmap `03-roadmap/fase-01-migracion-mvp.md` §5, arquitectura en `05-frontend/web-backoffice/`, contrato en `08-calidad/02-contrato-openapi-frontend.md`).

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
- `pnpm gen:module <nombre>` — crea un módulo nuevo con la estructura autocontenida (api/, types/, stores/, composables/, pages/, components/, router/, __tests__/ y la entrada pública `index.ts`). Starter funcional: listado con los cuatro estados conectado a una api placeholder; los pasos que quedan a mano los imprime el script.
- `pnpm test:unit` / `pnpm test:unit:watch` — Vitest (`src/**/__tests__/*.spec.ts`).
- `pnpm test:e2e` — Playwright (`e2e/`, chromium por defecto). Necesita el backend local levantado para el recorrido de sesión; **no** se ejecuta en el CI.

## Arquitectura

```
src/
├── core/                        # Transversal
│   ├── api/                     # Capa API (ver abajo): client, errors, config, auth, types, generated/
│   ├── components/              # App shell y UI reutilizable (Button, Card, DataTable...)
│   ├── composables/             # useAuth, useTheme, useToast, useAsyncData
│   ├── stores/                  # Pinia: auth (sesión), theme
│   └── types/                   # Tipos de UI (navegación, toasts, tema)
├── modules/                     # Un módulo por dominio, autocontenido:
│   └── customers/
│       ├── api/                 # Llamadas HTTP del dominio: customers.api.ts + index.ts
│       ├── types/               # Tipos derivados del contrato: customers.types.ts
│       ├── stores/              # Estado Pinia del dominio: useCustomersStore.ts
│       ├── composables/         # Lógica de presentación: useCustomersTable.ts
│       ├── components/          # Privados del módulo (formularios, etc.)
│       ├── pages/               # Pantallas: CustomersListPage.vue (sin index.vue)
│       ├── router/index.ts      # Rutas del módulo (por nombre, con meta.permission)
│       ├── __tests__/           # Specs por capa: api/, components/, composables/, stores/
│       └── index.ts             # Entrada pública: store + composables + api + tipos
└── router/                      # index.ts (glob de módulos) y guard.ts (sesión y permisos)
```

- **Rutas por convención**: cada módulo expone su `router/index.ts` (array de rutas, con `component: () => import('../pages/<Pantalla>.vue')` para code-splitting). `src/router/index.ts` los **descubre con `import.meta.glob`**: un módulo nuevo queda registrado sin tocar el router (`pnpm gen:module` lo crea así); un test de router falla si la convención deja de registrar algo.
- **Cada módulo contiene su dominio**: las llamadas HTTP (`api/<dominio>.api.ts`), los tipos derivados del contrato (`types/<dominio>.types.ts`), el estado (`stores/use<Dominio>Store.ts`) y la lógica de pantalla (`composables/use<Dominio>Table.ts`). Lo que otro módulo puede consumir sale **solo** por `index.ts`; `components/` y `pages/` quedan privados.
- **División de responsabilidades en las pantallas**: el store guarda listados y mutaciones (cada alta recarga del API), el composable arma la presentación (filtros, paginación, modal, toasts) y la página queda en el cableado del template. Ojo con los refs anidados: vía store de Pinia, `<listado>.data/status/error` llegan **ya desenvueltos** (`.value` sobra tanto en composables como en templates).
- `modules/auth` es especial: solo contiene sus **páginas** (Login/Forgot/Reset) y su `api/auth.api.ts` (recuperación de contraseña y token para apps/PDA). El ciclo de sesión (login, `me`, logout) es transversal: vive en `core/stores/auth.ts` + `core/api/auth.ts` y lo usan el guard y el interceptor 401.
- Todos los módulos consumen la API real; `payments` está en *empty state* hasta que el backend exponga sus endpoints (y `dashboard`/`settings` no tienen `api/` ni `stores/` todavía). Al conectar un módulo nuevo: tipos derivados del contrato en su `types/`, mocks retirados, y `core/types/index.ts` se queda solo con lo de UI.
- El sidebar (`core/components/Sidebar.vue`) deriva su navegación de la sesión y filtra cada entrada con `can()`.
- Estados de pantalla: `loading | error | empty | data` con `ListState.vue` + `useAsyncData`, en todos los listados. No dejes una tabla en blanco sin estado.

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
2. **Los tipos de respuesta salen del contrato**, nunca escritos a mano. `core/api/types.ts` queda con los **helpers** (`ResponseOf`, `RequestOf`, `QueryOf`, `OkOf`, `JsonOf`) y los tipos de la **sesión**; los de cada dominio se derivan en `modules/<m>/types/<dominio>.types.ts` a partir de `paths`. Scribe no emite `required`, así que los módulos envuelven el sobre en `Required<>` al declarar las filas completas en su capa API. El frontend no hackea lo que el contrato no dice: si falta un campo o un envoltorio, se arregla el docblock del backend y se regenera.
3. **Errores normalizados**: los componentes solo ven `ApiError` (`errors.ts`), con `isNetworkError`/`isUnauthenticated`/`isForbidden`/`isValidationError`/`isRateLimited`/`isCsrfMismatch`, `fieldError('email')` y `status: null` cuando la petición ni llegó. Nadie inspecciona un `AxiosError`.
4. **Sin secretos en `VITE_*`**: acaban en el bundle. El origen del backend se resuelve en runtime con `window.__APP_CONFIG__.apiUrl`, luego `VITE_API_URL` y por último `http://localhost:8000` (`config.ts`).

Lo transversal de sesión en la capa API: `core/api/auth.ts` solo expone `login`, `me`, `logout` y `logoutAll` (lo que consumen el store de sesión y el guard); el resto del dominio auth (recuperación de contraseña, token para apps/PDA) vive en `modules/auth/api/auth.api.ts`.

Para conectar un módulo: su `api/<dominio>.api.ts` con funciones tipadas, sus tipos derivados del contrato en `types/<dominio>.types.ts`, y los mocks de Vitest apuntando al api del módulo (`vi.mock('@/modules/<m>/api')`).

Comportamiento de `client.ts`:

- `baseURL` es el **origen** (`http://localhost:8000`), sin `/api`: las rutas se escriben completas (`/api/v1/...`) para que Sanctum pueda usar `/sanctum/csrf-cookie`.
- `withCredentials: true` para la cookie de sesión `HttpOnly`. **Nunca** se guarda un token en el navegador.
- Interceptor de petición: pone `Accept: application/json`, `X-Requested-With` y `X-XSRF-TOKEN` leído de la cookie `document.cookie` (explícito, para poder testearlo).
- `419` (CSRF caducado, sesión viva) → pide `/sanctum/csrf-cookie` y repite la petición **una** vez.
- `401` → avisa a `setUnauthenticatedHandler` (el store limpia su estado **sin** llamar al backend, para no entrar en bucle).

## Para añadir un módulo

1. `pnpm gen:module <nombre-en-kebab-plural>` — crea `src/modules/<nombre>/` con la estructura completa y un starter funcional (el módulo compila y su ruta queda registrada por convención).
2. Entrada de menú en `core/components/Sidebar.vue` con su `permission: '<recurso>.<acción>'`.
3. Cuando el backend exponga el dominio: `pnpm gen:api` para actualizar el contrato generado, deriva los tipos en `types/<dominio>.types.ts` con `ResponseOf`/`RequestOf` (ADR-0008), sustituye la api placeholder en `api/<dominio>.api.ts` y completa `meta.permission` en `router/index.ts`.
4. Conectar el store y la pantalla: el listado con los cuatro estados (`ListState` + `useAsyncData`), y retirar el starter placeholder.
5. Specs por capa en `__tests__/` (api sin red, store, composables, componentes) y `pnpm check` en verde.

## Sesión y permisos

`src/core/stores/auth.ts` (Pinia) guarda usuario, `roles`, `permissions` y `agencies`, todo en la respuesta de `GET /auth/me` (o `POST /auth/login`), así que `can()` y `hasRole()` son síncronos. `ensureSession()` es idempotente (`initialized`) y es lo único que sabe del ciclo de sesión; `logout()`/`logoutAll()` limpian en `finally` aunque el backend falle. La sesión se restaura de la cookie al recargar, no de storage.

`src/core/composables/useAuth.ts` es la fachada de UI (login, logout, `can`, `hasRole`, `ensureSession`).

## Convenciones

- **Comentarios en español; textos de la interfaz en inglés** (la referencia de diseño está en inglés). Todavía **no hay capa de i18n**: cuando se aborde, será con `vue-i18n` y en un trabajo aparte. No metas literales nuevos en español en la UI.
- Componentes en PascalCase con `<script setup lang="ts">`. **Nombres plural por dominio** dentro de los módulos: `customers.api.ts`, `customers.types.ts`, `useCustomersStore.ts`, `pages/CustomersListPage.vue`. Nombres de funciones y rutas en inglés.
- `noUncheckedIndexedAccess` está activo: indexar un array da `T | undefined`.
- Tipos de UI en `src/core/types/index.ts`; tipos del backend, derivados del contrato en el `types/` de cada módulo (nunca aquí).
- **Rutas por nombre**, no por path: `router.push({ name: 'orders' })`.

## Testing

- Unitarios: `src/**/__tests__/*.spec.ts`, entorno `jsdom`. `tsconfig.app.json` los excluye y `tsconfig.vitest.json` los incluye; `vue-tsc --build` comprueba ambos.
- Los tests **mockean la capa API** (`vi.mock('@/modules/<m>/api')` en los módulos; `vi.mock('@/core/api/client')` para los interceptores) y no tocan la red. Hay tests de los specs por capa de cada módulo, del store de sesión y del guard, y de los interceptores (419/401/422, red).
- E2E: `e2e/auth.spec.ts` es un smoke de sesión contra el backend local. El `baseURL` es `http://localhost:5173` en local y `4173` (preview) en CI; Playwright levanta el servidor solo si no hay uno en marcha.
- El CI no ejecuta e2e ni necesita Docker: solo instala, formatea, lintea, tipa, testea y compila.

## CI

`.github/workflows/ci.yml` (ramas `develop` y `main`, push y PR): `pnpm install --frozen-lockfile` y, en pasos separados, `format:check`, `check:lint`, `type-check`, `test:unit` y `build-only`. Es el mismo orden que `pnpm check`; si local pasa y el CI falla, es por dependencias o el lockfile.
