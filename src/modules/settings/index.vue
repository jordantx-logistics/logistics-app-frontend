<script setup lang="ts">
import { ref } from 'vue'
import AppShell from '@/core/components/AppShell.vue'
import Card from '@/core/components/Card.vue'
import Button from '@/core/components/Button.vue'
import Input from '@/core/components/Input.vue'
import Select from '@/core/components/Select.vue'
import Toggle from '@/core/components/Toggle.vue'
import Textarea from '@/core/components/Textarea.vue'
import { useAuth } from '@/core/composables/useAuth'
import { useTheme } from '@/core/composables/useTheme'
import {
  Users,
  Bell,
  Shield,
  Palette,
  Save,
} from 'lucide-vue-next'

const { user } = useAuth()
const { themeStore, setTheme } = useTheme()

const activeTab = ref('profile')

const profileForm = ref({
  name: user?.name || 'John Doe',
  email: user?.email || 'john@example.com',
  phone: '+1 234 567 8900',
  bio: 'Logistics manager with 10+ years of experience.',
})

const notificationSettings = ref({
  email: true,
  push: true,
  sms: false,
})

const appearanceSettings = ref({
  theme: themeStore.theme,
  language: 'en',
  timezone: 'UTC',
})
</script>

<template>
  <AppShell>
    <div class="settings">
      <div class="settings-header">
        <div>
          <h1 class="settings-title">Settings</h1>
          <p class="settings-subtitle">Manage your account and preferences</p>
        </div>
      </div>

      <div class="settings-layout">
        <aside class="settings-sidebar">
          <nav class="settings-nav">
            <button class="settings-nav-item" :class="{ active: activeTab === 'profile' }"
              @click="activeTab = 'profile'">
              <Users :size="16" stroke-width="2" />
              Profile
            </button>
            <button class="settings-nav-item" :class="{ active: activeTab === 'notifications' }"
              @click="activeTab = 'notifications'">
              <Bell :size="16" stroke-width="2" />
              Notifications
            </button>
            <button class="settings-nav-item" :class="{ active: activeTab === 'appearance' }"
              @click="activeTab = 'appearance'">
              <Palette :size="16" stroke-width="2" />
              Appearance
            </button>
            <button class="settings-nav-item" :class="{ active: activeTab === 'security' }"
              @click="activeTab = 'security'">
              <Shield :size="16" stroke-width="2" />
              Security
            </button>
          </nav>
        </aside>

        <main class="settings-main">
          <Card v-if="activeTab === 'profile'">
            <template #header>
              <h2 class="settings-card-title">Profile Information</h2>
            </template>
            <div class="settings-form">
              <div class="form-group">
                <Input label="Full Name" v-model="profileForm.name" />
              </div>
              <div class="form-group">
                <Input label="Email" type="email" v-model="profileForm.email" />
              </div>
              <div class="form-group">
                <Input label="Phone" v-model="profileForm.phone" />
              </div>
              <div class="form-group">
                <Textarea label="Bio" v-model="profileForm.bio" placeholder="Tell us about yourself..." />
              </div>
              <div class="form-actions">
                <Button variant="primary">
                  <template #leading>
                    <Save :size="16" stroke-width="2" />
                  </template>
                  Save Changes
                </Button>
              </div>
            </div>
          </Card>

          <Card v-if="activeTab === 'notifications'">
            <template #header>
              <h2 class="settings-card-title">Notification Preferences</h2>
            </template>
            <div class="settings-form">
              <div class="form-group">
                <Toggle label="Email Notifications" :model-value="notificationSettings.email"
                  @update:model-value="notificationSettings.email = $event" />
              </div>
              <div class="form-group">
                <Toggle label="Push Notifications" :model-value="notificationSettings.push"
                  @update:model-value="notificationSettings.push = $event" />
              </div>
              <div class="form-group">
                <Toggle label="SMS Notifications" :model-value="notificationSettings.sms"
                  @update:model-value="notificationSettings.sms = $event" />
              </div>
            </div>
          </Card>

          <Card v-if="activeTab === 'appearance'">
            <template #header>
              <h2 class="settings-card-title">Appearance</h2>
            </template>
            <div class="settings-form">
              <div class="form-group">
                <Toggle label="Dark Mode" :model-value="themeStore.theme === 'dark'"
                  @update:model-value="setTheme(themeStore.theme === 'dark' ? 'light' : 'dark')" />
              </div>
              <div class="form-group">
                <Select label="Language" :options="[
                  { label: 'English', value: 'en' },
                  { label: 'Spanish', value: 'es' },
                  { label: 'French', value: 'fr' },
                ]" v-model="appearanceSettings.language" />
              </div>
              <div class="form-group">
                <Select label="Timezone" :options="[
                  { label: 'UTC', value: 'UTC' },
                  { label: 'EST', value: 'EST' },
                  { label: 'PST', value: 'PST' },
                ]" v-model="appearanceSettings.timezone" />
              </div>
            </div>
          </Card>

          <Card v-if="activeTab === 'security'">
            <template #header>
              <h2 class="settings-card-title">Security</h2>
            </template>
            <div class="settings-form">
              <div class="form-group">
                <Input label="Current Password" type="password" placeholder="••••••••" />
              </div>
              <div class="form-group">
                <Input label="New Password" type="password" placeholder="••••••••" />
              </div>
              <div class="form-group">
                <Input label="Confirm New Password" type="password" placeholder="••••••••" />
              </div>
              <div class="form-actions">
                <Button variant="primary">
                  Update Password
                </Button>
              </div>
            </div>
          </Card>
        </main>
      </div>
    </div>
  </AppShell>
</template>

<style scoped>
.settings {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.settings-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.settings-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--fg);
}

.settings-subtitle {
  font-size: 14px;
  color: var(--muted);
  margin-top: 4px;
}

.settings-layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 24px;
}

.settings-sidebar {
  position: sticky;
  top: 24px;
  height: fit-content;
}

.settings-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.settings-nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 14px;
  color: var(--muted);
  background: 0 0;
  border: none;
  cursor: pointer;
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
  width: 100%;
}

.settings-nav-item:hover {
  background: var(--border);
  color: var(--fg);
}

.settings-nav-item.active {
  background: rgba(oklch(58% 0.18 255), 0.08);
  color: oklch(58% 0.18 255);
  font-weight: 500;
}

.settings-main {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.settings-card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--fg);
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.Users {
  display: inline-block;
}
</style>
