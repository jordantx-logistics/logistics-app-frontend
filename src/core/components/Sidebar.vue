<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  LayoutDashboard,
  ShoppingCart,
  CreditCard,
  Users,
  Building2,
  ShieldCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  UserCog,
  UserRound,
  Clock,
  Smartphone,
} from 'lucide-vue-next'

import { useAuth } from '@/core/composables/useAuth'
import type { NavItem } from '@/core/types'

const props = withDefaults(
  defineProps<{
    collapsed?: boolean
    mobileOpen?: boolean
  }>(),
  {
    collapsed: false,
    mobileOpen: false,
  },
)

const emit = defineEmits<{
  toggle: []
  closeMobile: []
}>()

const route = useRoute()
const { can } = useAuth()

/**
 * Navegación escrita a mano, con el permiso que abre cada pantalla: las
 * entradas que el rol no puede usar no se pintan, para no llevar al usuario a
 * una pantalla que el backend respondería con 403. Igual que el guard, esto es
 * **presentación**: la autorización real la hace el backend en cada ruta.
 */
const NAV_GROUPS: Array<{ label: string; items: NavItem[] }> = [
  {
    label: 'Main',
    items: [
      { label: 'Dashboard', icon: 'LayoutDashboard', path: '/dashboard' },
      { label: 'Orders', icon: 'ShoppingCart', path: '/orders', permission: 'orders.view' },
    ],
  },
  {
    label: 'Management',
    items: [
      { label: 'Payments', icon: 'CreditCard', path: '/payments' },
      { label: 'Customers', icon: 'Users', path: '/customers', permission: 'persons.view' },
      { label: 'Agencies', icon: 'Building2', path: '/agencies', permission: 'agencies.view' },
    ],
  },
  {
    label: 'Human resources',
    items: [
      {
        label: 'Employees',
        icon: 'UserRound',
        path: '/employees',
        permission: 'employees.manage',
      },
      {
        label: 'Attendance',
        icon: 'Clock',
        path: '/attendance',
        permission: 'attendance.view',
      },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Users', icon: 'UserCog', path: '/users', permission: 'users.manage' },
      { label: 'Devices', icon: 'Smartphone', path: '/devices', permission: 'devices.manage' },
      { label: 'Permissions', icon: 'ShieldCheck', path: '/permissions', permission: 'roles.view' },
      { label: 'Settings', icon: 'Settings', path: '/settings' },
    ],
  },
]

const navGroups = computed(() =>
  NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => !item.permission || can(item.permission)),
  })).filter((group) => group.items.length > 0),
)

type Icon =
  | typeof LayoutDashboard
  | typeof ShoppingCart
  | typeof CreditCard
  | typeof Users
  | typeof Building2
  | typeof ShieldCheck
  | typeof Settings
  | typeof UserCog
  | typeof UserRound
  | typeof Clock
  | typeof Smartphone

const iconMap: Record<string, Icon> = {
  LayoutDashboard,
  ShoppingCart,
  CreditCard,
  Users,
  Building2,
  ShieldCheck,
  Settings,
  UserCog,
  UserRound,
  Clock,
  Smartphone,
}

function handleToggle() {
  emit('toggle')
}
</script>

<!-- eslint-disable-next-line vue/multi-word-component-names -->
export default { name: 'Sidebar' }

<template>
  <aside class="sidebar" :class="{ collapsed: props.collapsed, 'mobile-open': props.mobileOpen }">
    <div class="sidebar-header">
      <div class="sidebar-logo">L</div>
      <span v-if="!props.collapsed" class="sidebar-brand">LogiTrack</span>
    </div>

    <nav class="sidebar-nav">
      <template v-for="group in navGroups" :key="group.label">
        <div v-if="!props.collapsed" class="sidebar-section-label">{{ group.label }}</div>
        <template v-for="item in group.items" :key="item.path">
          <router-link
            :to="item.path"
            class="nav-item"
            :class="{ active: route.path === item.path }"
            data-route="true"
          >
            <component
              :is="iconMap[item.icon]"
              class="nav-icon"
              :size="props.collapsed ? 18 : 18"
              :stroke-width="props.collapsed ? 2 : 1.5"
            />
            <span v-if="!props.collapsed" class="nav-item-text">{{ item.label }}</span>
            <span v-if="!props.collapsed && item.badge" class="nav-badge">{{ item.badge }}</span>
            <span v-if="props.collapsed" class="nav-badge" />
          </router-link>
        </template>
      </template>
    </nav>

    <div class="sidebar-footer">
      <button class="sidebar-toggle" @click="handleToggle">
        <component :is="props.collapsed ? ChevronRight : ChevronLeft" :size="18" stroke-width="2" />
      </button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 260px;
  background: var(--surface);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  transition: width 200ms cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  overflow-y: auto;
}

.sidebar.collapsed {
  width: 64px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid var(--border);
  height: 64px;
  flex-shrink: 0;
}

.sidebar-logo {
  width: 32px;
  height: 32px;
  background: #6366f1;
  color: #fff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0;
}

.sidebar-brand {
  font-size: 18px;
  font-weight: 700;
  color: var(--fg);
  white-space: nowrap;
  opacity: 0.9;
}

.sidebar-nav {
  flex: 1;
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
}

.sidebar-section-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 12px 4px 8px;
  padding: 4px 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  color: var(--fg-secondary);
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-item:hover {
  background: var(--bg);
  color: var(--fg);
}

.nav-item.active {
  background: rgba(99, 102, 241, 0.12);
  color: #6366f1;
}

.nav-icon {
  flex-shrink: 0;
}

.nav-item-text {
  white-space: nowrap;
}

.nav-badge {
  font-size: 11px;
  font-weight: 600;
  color: var(--fg-secondary);
  background: var(--border);
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-footer {
  padding: 12px;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: center;
}

.sidebar-toggle {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--fg-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar-toggle:hover {
  background: var(--border);
  color: var(--fg);
}

.mobile-open {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  z-index: 100;
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    z-index: 100;
    transform: translateX(-100%);
    transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .sidebar.mobile-open {
    transform: translateX(0);
  }

  .mobile-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 99;
  }
}
</style>
