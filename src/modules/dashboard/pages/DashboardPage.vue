<script setup lang="ts">
import { computed, onMounted } from 'vue'

import AppShell from '@/core/components/AppShell.vue'
import Card from '@/core/components/Card.vue'
import ListState from '@/core/components/ListState.vue'
import { useAsyncData } from '@/core/composables/useAsyncData'
import { useAuth } from '@/core/composables/useAuth'
import '@/core/styles/backoffice.css'

import * as dashboardApi from '../api/dashboard.api'
import { useDashboardShortcuts } from '../composables/useDashboardShortcuts'

/**
 * Dashboard por rol: el backend solo devuelve los indicadores que los permisos del
 * usuario permiten, en su ámbito de agencia. Los accesos directos se filtran igual.
 */

const { authStore, can } = useAuth()
const shortcuts = useDashboardShortcuts()

const kpis = useAsyncData(() => dashboardApi.listKpis())
const rows = computed(() => kpis.data.value ?? [])

const money = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' })

function display(kpi: { value?: string; format?: string }): string {
  return kpi.format === 'money' ? money.format(Number(kpi.value)) : String(kpi.value)
}

onMounted(() => {
  if (can('dashboard.view')) {
    void kpis.load()
  }
})
</script>

<template>
  <AppShell>
    <div class="bo-page">
      <div class="bo-header">
        <div>
          <h1 class="bo-title">Welcome back, {{ authStore.user?.name }}</h1>
          <p class="bo-subtitle">What needs your attention today</p>
        </div>
      </div>

      <ListState
        v-if="can('dashboard.view')"
        :status="kpis.status.value"
        :error="kpis.error.value"
        :empty="rows.length === 0"
        empty-text="There are no indicators for your role."
        @retry="kpis.load"
      >
        <div class="kpi-grid">
          <Card v-for="kpi in rows" :key="kpi.key">
            <p class="kpi-label">{{ kpi.label }}</p>
            <p class="kpi-value" :data-testid="`kpi-${kpi.key}`">{{ display(kpi) }}</p>
          </Card>
        </div>
      </ListState>

      <Card v-if="shortcuts.length > 0" title="Shortcuts">
        <div class="bo-actions">
          <router-link v-for="item in shortcuts" :key="item.to" class="bo-link" :to="item.to">
            {{ item.label }}
          </router-link>
        </div>
      </Card>
    </div>
  </AppShell>
</template>

<style scoped>
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.kpi-label {
  font-size: 13px;
  color: var(--muted);
}

.kpi-value {
  margin-top: 6px;
  font-size: 26px;
  font-weight: 700;
  color: var(--fg);
}
</style>
