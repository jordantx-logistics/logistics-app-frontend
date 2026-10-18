/**
 * Tipos de UI (layout, navegación, toasts...) y, marcados como **mocks**, los
 * que hoy usan los módulos con datos de mentira.
 *
 * Los tipos de las respuestas del backend **no** se escriben aquí: salen del
 * contrato OpenAPI (`src/core/api/types.ts`, ADR-0008). `Order`, `Customer`,
 * `Agency`, `Payment` y `Permission` siguen siendo los mocks del andamiaje y se
 * sustituyen por los del contrato al conectar cada módulo (paso 5.6 de la Fase 1).
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
  badge?: string
  children?: NavItem[]
}

export interface TableState {
  page: number
  perPage: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface OrderStatus {
  label: string
  status: 'pending' | 'in-transit' | 'delivered' | 'cancelled' | 'delayed'
}

export interface Order {
  id: string
  customer: string
  origin: string
  destination: string
  status: OrderStatus
  date: string
  weight: string
  items?: number
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  status: 'active' | 'inactive'
  orders: number
}

export interface Agency {
  id: string
  name: string
  code: string
  status: 'active' | 'inactive'
  contact: string
  phone: string
  email: string
  address: string
}

export interface Payment {
  id: string
  orderId: string
  customer: string
  amount: number
  currency: string
  method: string
  status: 'pending' | 'completed' | 'failed'
  date: string
}

export interface Permission {
  id: string
  name: string
  description: string
  role: string
}

export interface StatCard {
  label: string
  value: string | number
  change: number
  changeType: 'up' | 'down'
}
