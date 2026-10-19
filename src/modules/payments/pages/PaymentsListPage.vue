<script setup lang="ts">
import { CreditCard, Wallet } from 'lucide-vue-next'

import AppShell from '@/core/components/AppShell.vue'
import Card from '@/core/components/Card.vue'

/**
 * Pagos.
 *
 * El backend todavía **no expone** endpoints de pagos (`src/Logistics/Payment`
 * solo tiene el modelo), así que la pantalla no inventa filas: se queda en el
 * estado vacío hasta que existan el listado y el alta.
 */
</script>

<template>
  <AppShell>
    <div class="payments">
      <div class="page-header">
        <div>
          <h1 class="page-title">Payments</h1>
          <p class="page-subtitle">Track and manage all transactions</p>
        </div>
      </div>

      <div class="stats-grid">
        <Card class="stat-card">
          <div class="stat-icon" style="background: oklch(58% 0.18 255)">
            <CreditCard :size="20" stroke-width="2" />
          </div>
          <div class="stat-value">—</div>
          <div class="stat-label">Payments</div>
        </Card>
      </div>

      <Card class="table-card">
        <template #header>
          <div class="table-header">
            <h2 class="table-title">Transactions</h2>
          </div>
        </template>

        <div class="empty-state">
          <div class="empty-icon">
            <Wallet :size="22" stroke-width="2" />
          </div>
          <p class="empty-title">Payments are not available yet</p>
          <p class="empty-text">
            The payments API is not part of this phase, so there is nothing to list. This screen
            will switch to the real data as soon as the endpoints exist.
          </p>
        </div>
      </Card>
    </div>
  </AppShell>
</template>

<style scoped>
.payments {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.page-title {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--fg);
}

.page-subtitle {
  font-size: 13px;
  color: var(--muted);
  margin-top: 2px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.stat-card {
  display: flex;
  flex-direction: column;
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
  color: var(--fg);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--muted);
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.table-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--fg);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 48px 24px;
  text-align: center;
}

.empty-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
  color: var(--muted);
  margin-bottom: 4px;
}

.empty-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--fg);
}

.empty-text {
  font-size: 13px;
  color: var(--muted);
  max-width: 420px;
}
</style>
