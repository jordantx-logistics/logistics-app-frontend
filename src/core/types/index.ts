/**
 * Tipos de **UI** (layout, navegación, toasts, tema).
 *
 * Los tipos de las respuestas del backend **no** se escriben aquí: salen del
 * contrato OpenAPI (`src/core/api/types.ts`, ADR-0008). Los mocks que quedaban
 * (`Order`, `Customer`, `Agency`, `Payment`, `Permission` — y sus `StatCard` y
 * `TableState`) se retiraron al conectar cada módulo con el API en el paso 5.6.
 */

export interface ThemeState {
  theme: 'light' | 'dark'
}

export interface NavigationState {
  sidebarCollapsed: boolean
  mobileSidebarOpen: boolean
}

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

export interface NavItem {
  label: string
  icon: string
  path: string
  /** Permiso que hace falta para ver la entrada (lo comprueba el sidebar). */
  permission?: string
  badge?: string
  children?: NavItem[]
}
