<script setup lang="ts">
import { ref } from 'vue'

import AppShell from '@/core/components/AppShell.vue'
import Card from '@/core/components/Card.vue'
import PermissionGate from '@/core/components/PermissionGate.vue'
import { useAuth } from '@/core/composables/useAuth'
import { useTheme } from '@/core/composables/useTheme'
import '@/core/styles/backoffice.css'

import BusinessSettingsForm from '../components/BusinessSettingsForm.vue'

/** Ajustes: la cuenta y el tema para todos; los parámetros, con `settings.manage`. */

const { authStore } = useAuth()
const { themeStore, setTheme } = useTheme()

const tab = ref<'account' | 'parameters'>('account')
</script>

<template>
  <AppShell>
    <div class="bo-page">
      <div class="bo-header">
        <div>
          <h1 class="bo-title">Settings</h1>
          <p class="bo-subtitle">Your account and, if you manage them, business parameters</p>
        </div>
      </div>

      <div class="bo-tabs">
        <button class="bo-tab" :class="{ active: tab === 'account' }" @click="tab = 'account'">
          Account
        </button>
        <PermissionGate permission="settings.manage">
          <button
            class="bo-tab"
            :class="{ active: tab === 'parameters' }"
            @click="tab = 'parameters'"
          >
            Parameters
          </button>
        </PermissionGate>
      </div>

      <template v-if="tab === 'account'">
        <Card title="Account">
          <dl class="bo-details">
            <div>
              <dt>Name</dt>
              <dd>{{ authStore.user?.name }}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{{ authStore.user?.email }}</dd>
            </div>
            <div>
              <dt>Roles</dt>
              <dd>{{ authStore.roles.join(', ') }}</dd>
            </div>
          </dl>
        </Card>

        <Card title="Appearance">
          <label class="bo-filter">
            <span>Theme</span>
            <select
              :value="themeStore.theme"
              @change="setTheme(($event.target as HTMLSelectElement).value as 'light' | 'dark')"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
        </Card>
      </template>

      <Card v-else title="Business parameters">
        <BusinessSettingsForm />
      </Card>
    </div>
  </AppShell>
</template>
