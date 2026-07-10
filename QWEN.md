# Logistics App Frontend - Development Guide

## Project Overview

Vue 3.5+ logistics management dashboard application built with Vite, TypeScript, and Tailwind CSS. The app implements a modular architecture with authentication, theming, and 8 feature modules for complete logistics operations management.

**Target**: Match the design in `references/logitrack-dashboard.html` using OKLCH CSS variables for theming.

---

## Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | Vue 3 | 3.5.38 |
| Build Tool | Vite | 8.0.16 |
| Language | TypeScript | 6.0.0 |
| State Management | Pinia | 3.0.4 |
| Routing | Vue Router | 5.1.0 |
| Styling | Tailwind CSS | 4.3.2 |
| Testing | Playwright | 1.61.0 |
| Testing | Vitest | 4.1.9 |
| HTTP Client | Axios | 1.9.0 |
| Icons | Lucide Vue Next | latest |

---

## Architecture

### Directory Structure

```
src/
├── core/                    # Shared, app-wide functionality
│   ├── components/         # Reusable layout/UI components
│   ├── composables/        # Vue composables (useAuth, useTheme, useToast)
│   ├── stores/             # Pinia stores (auth, theme)
│   └── types/              # TypeScript interfaces
├── modules/                # Feature modules (lazy-loaded)
│   ├── auth/
│   ├── dashboard/
│   ├── orders/
│   ├── customers/
│   ├── agencies/
│   ├── payments/
│   ├── permissions/
│   └── settings/
└── router/                 # Vue Router configuration
```

### Core Components

| Component | Purpose |
|-----------|---------|
| `AppShell.vue` | Main layout wrapper with Sidebar, Header, RouterView, ToastContainer |
| `Sidebar.vue` | Collapsible navigation with 3 sections (Main, Management, System) |
| `Header.vue` | Top bar with search, notifications, theme toggle, user menu |
| `Card.vue` | Reusable card container with header/title/actions slots |
| `Button.vue` | Button with variants (primary/secondary/ghost), sizes, loading state |
| `Badge.vue` | Status badges with variants (success/warning/danger/info/neutral) |
| `DataTable.vue` | Data table with pagination, search, sorting |
| `Input.vue` | Form input with validation |
| `ToastContainer.vue` | Toast notifications (success/error/warning/info) |

### Core Stores

**Auth Store** (`src/core/stores/auth.ts`):
```typescript
const user = ref<User | null>(null)
const token = ref<string | null>(null)
const isAuthenticated = computed(() => !!user.value)

// Methods
login(u: User, t: string)
logout()
```

**Theme Store** (`src/core/stores/theme.ts`):
```typescript
const theme = ref<'light' | 'dark'>('light')

// Methods
toggle() // Switches between light/dark
```

### Core Composables

**useAuth** (`src/core/composables/useAuth.ts`):
```typescript
requireAuth()      // Redirect if not authenticated
requireNotAuth()   // Redirect if authenticated
logout()           // Call auth store logout
```

**useTheme** (`src/core/composables/useTheme.ts`):
```typescript
setTheme()         // Set theme explicitly
```

**useToast** (`src/core/composables/useToast.ts`):
```typescript
success(msg)
error(msg)
warning(msg)
info(msg)
```

---

## TypeScript Types

All types are defined in `src/core/types/index.ts`:

```typescript
interface User { id: string; name: string; email: string; role: string; avatar?: string }
interface AuthState { user: User | null; token: string | null; isAuthenticated: boolean }
interface ThemeState { theme: 'light' | 'dark' }
interface NavigationState { collapsed: boolean; activeSection: string }
interface ToastMessage { type: 'success' | 'error' | 'warning' | 'info'; message: string }
interface NavItem { label: string; icon: Component; route: string; section: 'main' | 'management' | 'system' }
interface Order { id: string; customer: string; status: OrderStatus; amount: string; date: string }
interface OrderStatus { value: string; label: string; color: string }
// ... more types
```

---

## Styling System

### CSS Variables (OKLCH Color Space)

```css
:root {
  /* Primary brand color */
  --primary: oklch(58% 0.18 255);
  
  /* Semantic colors */
  --success: oklch(62% 0.18 145);
  --warning: oklch(72% 0.16 80);
  --danger: oklch(60% 0.20 25);
  --info: oklch(58% 0.18 255);
  
  /* Theme variables (light/dark) */
  --bg: oklch(98% 0.01 255);
  --fg: oklch(20% 0.01 255);
  --border: oklch(90% 0.01 255);
  --muted: oklch(60% 0.01 255);
  --surface: oklch(96% 0.01 255);
  --radius-md: 8px;
  --radius-lg: 12px;
}
```

### Tailwind Usage

Tailwind is configured with custom theme. Use standard Tailwind classes alongside custom CSS for fine-tuning.

**Example**:
```vue
<div class="card p-4 rounded-xl border border-gray-200 bg-white">
  <h2 class="text-lg font-semibold">Title</h2>
</div>
```

---

## Routing

### Main Router (`src/router/index.ts`)

```typescript
createRouter({
  history: createWebHistory(),
  routes,
}).createWebHistory()
```

**Features**:
- Authentication guard (`onBeforeNavigate` hook)
- Lazy-loaded route components
- 8 module routes + auth routes

### Route Structure

```
/                                    # Dashboard (default)
/login                               # Login page
/register                            # Registration
/forgot-password                     # Forgot password
/reset-password                      # Reset password
/orders                              # Orders list
/customers                           # Customers list
/agencies                            # Agencies list
/payments                            # Payments list
/permissions                         # Permissions management
/settings                            # Settings
```

### Lazy Loading Helper (`src/router/helpers.ts`)

```typescript
export const getRouteComponent = (routeName: string) =>
  () => import(`@/modules/${routeName}/index.vue`).then(mod => mod.default)
```

---

## State Management

### Pinia Stores

- **auth**: User session, authentication state
- **theme**: Light/dark theme toggle
- **navigation**: Sidebar state, active section
- **toast**: Notification queue

### Composables vs Stores

- **Stores**: Global state (auth, theme, navigation)
- **Composables**: Reusable logic (useAuth, useTheme, useToast)

---

## Feature Modules

All modules follow the same pattern: `src/modules/{name}/index.vue`

### Module List

1. **dashboard** - Main dashboard with stats, recent orders, activity
2. **auth** - Login, register, password recovery
3. **orders** - Order management (CRUD)
4. **customers** - Customer management (CRUD)
5. **agencies** - Agency management (CRUD)
6. **payments** - Payment management (CRUD)
7. **permissions** - Permission/role management
8. **settings** - Application settings

### Module Structure Example

```
src/modules/orders/
├── index.vue          # Main orders page
├── types.ts           # Module-specific types
├── composables/       # Module composables (useOrders)
└── stores/            # Module stores (if needed)
```

---

## Component Patterns

### Card Component

```vue
<Card title="Card Title">
  <template #header>
    <div class="header-actions">
      <slot name="header" />
      <slot name="actions" />
    </div>
  </template>
  <div class="card-content">
    <slot />
  </div>
</Card>
```

### Button Component

```vue
<Button variant="primary" size="md" @click="handleClick">
  <template #leading>
    <Icon name="plus" />
  </template>
  Add New
  <template #trailing>
    <span>(Ctrl+Enter)</span>
  </template>
</Button>
```

### DataTable Component

```vue
<DataTable
  :data="orders"
  :columns="columns"
  :pagination="true"
  :per-page="10"
  :searchable="true"
  @update:search="handleSearch"
  @update:page="handlePageChange"
  @update:sort="handleSort"
/>
```

---

## Testing Setup

### Unit Tests (Vitest)

```bash
pnpm test:unit
```

### E2E Tests (Playwright)

```bash
pnpm test:e2e
```

### Test File Structure

```
tests/
├── unit/
│   ├── composables/
│   │   ├── useAuth.test.ts
│   │   └── useTheme.test.ts
│   └── stores/
│       └── auth.test.ts
└── e2e/
    └── login.spec.ts
```

---

## Development Commands

```bash
# Install dependencies
pnpm install

# Run dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run unit tests
pnpm test:unit

# Run E2E tests
pnpm test:e2e

# Lint code
pnpm lint

# Format code
pnpm format

# Type check
pnpm type-check
```

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `package.json` | Dependencies and scripts |
| `vite.config.ts` | Vite configuration (alias, plugins) |
| `tsconfig.json` | TypeScript configuration |
| `tailwind.config.ts` | Tailwind theme configuration |
| `eslint.config.ts` | ESLint rules |
| `src/core/types/index.ts` | All TypeScript interfaces |
| `src/core/stores/auth.ts` | Authentication state |
| `src/core/stores/theme.ts` | Theme state |
| `src/core/composables/useAuth.ts` | Auth logic |
| `src/core/composables/useTheme.ts` | Theme logic |
| `src/core/composables/useToast.ts` | Toast notifications |
| `src/core/components/AppShell.vue` | Main layout |
| `src/core/components/Sidebar.vue` | Navigation sidebar |
| `src/core/components/Header.vue` | Top header bar |
| `src/core/components/Button.vue` | Button component |
| `src/core/components/Badge.vue` | Badge component |
| `src/core/components/Card.vue` | Card container |
| `src/core/components/DataTable.vue` | Data table |
| `src/modules/dashboard/index.vue` | Dashboard page |
| `src/router/index.ts` | Main router |
| `src/router/helpers.ts` | Lazy loading helper |
| `references/logitrack-dashboard.html` | Reference design |
| `plan.md` | Implementation plan |

---

## Design Goals

1. **Match reference design** (`references/logitrack-dashboard.html`)
2. **OKLCH color space** for consistent theming
3. **Responsive layout** with mobile-first approach
4. **Modular architecture** for maintainability
5. **Type-safe** with full TypeScript coverage
6. **Accessible** with semantic HTML and ARIA attributes
7. **Performance-optimized** with lazy loading and code splitting

---

## Conventions

### Component Naming

- PascalCase for components: `MyComponent.vue`
- kebab-case in templates: `<my-component />`
- `index.vue` for module entry points

### Props & Emits

```vue
<script setup lang="ts">
interface Props {
  prop1: string
  prop2?: boolean
}

const emit = defineEmits<{
  'update:prop1': [value: string]
  click: []
}>()
</script>
```

### State Management

- Use Pinia stores for global state
- Use composables for reusable logic
- Use refs/reactive for local component state

### Styling

- Use Tailwind for utility classes
- Use scoped CSS for custom styles
- Use CSS variables for theming
- OKLCH colors for semantic colors

---

## Notes for New Developers

1. Always check `plan.md` for current implementation status
2. Reference `logitrack-dashboard.html` for design guidance
3. Use the composables (`useAuth`, `useTheme`, `useToast`) in all pages
4. Follow the modular pattern for new features
5. TypeScript is required — no `.vue` files without `<script setup lang="ts">`
6. All components should use `<script setup>` syntax
7. Use slots for extensibility in reusable components
8. Keep components small and focused
9. Use the DataTable component for data-heavy tables
10. Test critical paths with Playwright before merging
