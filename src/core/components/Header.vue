<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  Menu,
  Search,
  Bell,
  Moon,
  Sun,
  LogOut,
  ChevronDown,
  CircleHelp,
} from 'lucide-vue-next'
import { useAuth } from '@/core/composables/useAuth'
import { useTheme } from '@/core/composables/useTheme'

const route = useRoute()
const emit = defineEmits<{
  toggle: []
}>()

const { logout } = useAuth()
const { themeStore } = useTheme()

const breadcrumbs = computed(() => {
  const path = route.path
  const parts = path.split('/').filter(Boolean)
  return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1))
})

const showUserMenu = ref(false)

function toggleUserMenu() {
  showUserMenu.value = !showUserMenu.value
}

function closeUserMenu() {
  showUserMenu.value = false
}

function handleLogout() {
  closeUserMenu()
  logout()
}

const currentTheme = computed(() => themeStore.theme === 'dark' ? Moon : Sun)

function handleThemeToggle() {
  (window as unknown as { $toggleTheme?: () => void }).$toggleTheme?.()
  themeStore.toggle()
}

function handleHelp() {
  closeUserMenu()
}

function handleClickOutside(e: MouseEvent) {
  if (!(e.target instanceof HTMLElement) || !e.target.closest('.user-menu-wrapper')) {
    closeUserMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <header class="header">
    <button class="header-toggle" @click="emit('toggle')" title="Toggle sidebar">
      <Menu :size="18" stroke-width="2" />
    </button>

    <div class="header-breadcrumb">
      <span>LogiTrack</span>
      <span v-if="breadcrumbs.length" class="breadcrumb-sep">/</span>
      <span v-if="breadcrumbs.length" class="breadcrumb-current">{{ breadcrumbs[0] }}</span>
    </div>

    <div class="header-search">
      <Search :size="14" stroke-width="2" />
      <input type="text" placeholder="Search..." />
      <kbd>⌘K</kbd>
    </div>

    <div class="header-actions">
      <button class="header-btn" title="Notifications">
        <Bell :size="18" stroke-width="1.5" />
        <span class="dot" />
      </button>
      <button class="header-btn" :title="themeStore.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
        @click="handleThemeToggle">
        <component :is="currentTheme" :size="18" stroke-width="1.5" />
      </button>
      <div class="user-menu-wrapper">
        <button class="user-menu-trigger" @click="toggleUserMenu">
          <div class="header-avatar">JD</div>
          <ChevronDown :size="14" stroke-width="2" />
        </button>
        <div v-if="showUserMenu" class="user-menu">
          <div class="user-menu-header">
            <div class="user-menu-avatar">JD</div>
            <div>
              <div class="user-menu-name">John Doe</div>
              <div class="user-menu-role">Administrator</div>
            </div>
          </div>
          <div class="user-menu-divider" />
          <button class="user-menu-item" @click="handleThemeToggle">
            <component :is="currentTheme" :size="16" stroke-width="1.5" />
            <span>Theme</span>
          </button>
          <button class="user-menu-item" @click="handleHelp">
            <CircleHelp :size="16" stroke-width="1.5" />
            <span>Help</span>
          </button>
          <div class="user-menu-divider" />
          <button class="user-menu-item danger" @click="handleLogout">
            <LogOut :size="16" stroke-width="1.5" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
<style scoped>
.header {
  height: var(--header-height);
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 12px;
  border-bottom: 1px solid var(--border);
  background: var(--surface);
  flex-shrink: 0;
  z-index: 30
}

.header-toggle {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  color: var(--muted);
  transition: all var(--transition-fast)
}

.header-toggle:hover {
  background: var(--bg);
  color: var(--fg)
}

.header-breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--muted);
  flex: 1;
  min-width: 0
}

.header-breadcrumb span {
  color: var(--fg);
  font-weight: 500
}

.header-search {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--bg);
  color: var(--muted);
  font-size: 13px;
  width: 220px;
  transition: all var(--transition-fast);
  cursor: text
}

.header-search:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-subtle);
  color: var(--fg)
}

.header-search input {
  border: none;
  background: 0 0;
  outline: none;
  color: inherit;
  width: 100%;
  font-size: 13px
}

.header-search kbd {
  font-family: var(--font-mono);
  font-size: 11px;
  padding: 1px 5px;
  border: 1px solid var(--border);
  border-radius: 3px;
  background: var(--surface);
  color: var(--muted);
  flex-shrink: 0
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto
}

.header-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  color: var(--muted);
  transition: all var(--transition-fast);
  position: relative
}

.header-btn:hover {
  background: var(--bg);
  color: var(--fg)
}

.header-btn .dot {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 7px;
  height: 7px;
  background: var(--danger);
  border-radius: 50%;
  border: 1.5px solid var(--surface)
}

.header-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--accent);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  margin-left: 4px
}

/* User Menu Dropdown */
.user-menu-wrapper {
  position: relative;
}

.user-menu-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--muted);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.user-menu-trigger:hover {
  background: var(--bg);
  color: var(--fg);
}

.user-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 240px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.06);
  z-index: 100;
  padding: 8px 0;
  animation: slideDown 0.15s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.user-menu-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
}

.user-menu-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--accent);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  flex-shrink: 0;
}

.user-menu-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--fg);
  margin: 0;
  line-height: 1.25;
}

.user-menu-role {
  font-size: 12px;
  color: var(--muted);
  margin: 0;
}

.user-menu-divider {
  height: 1px;
  background: var(--border);
  margin: 8px 0;
}

.user-menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 16px;
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  text-align: left;
  color: var(--fg);
  font-size: 13px;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.user-menu-item:hover {
  background: var(--bg);
  color: var(--fg);
}

.user-menu-item.danger:hover {
  background: rgba(220, 38, 38, 0.1);
  color: var(--danger);
}

.user-menu-item svg {
  flex-shrink: 0;
  color: var(--muted);
}

.user-menu-item:hover svg {
  color: var(--fg);
}
</style>