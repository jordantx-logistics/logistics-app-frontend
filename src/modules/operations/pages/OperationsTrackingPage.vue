<script setup lang="ts">
import { computed, ref } from 'vue'
import { Search } from 'lucide-vue-next'

import AppShell from '@/core/components/AppShell.vue'
import Button from '@/core/components/Button.vue'
import Card from '@/core/components/Card.vue'
import Input from '@/core/components/Input.vue'
import LoadingSpinner from '@/core/components/LoadingSpinner.vue'

import OperationStatusBadge from '../components/OperationStatusBadge.vue'
import { formatDateTime, formatMeta } from '../composables/useOperationsPresentation'
import { useOperationsStore } from '../stores/useOperationsStore'
import { formatText } from '@/core/utils/format'

/**
 * Consulta del historial de un envío por `ticket_code`.
 *
 * El timeline es append-only y viene ordenado por el backend; aquí solo se
 * pinta. La búsqueda se dispara a mano para no consultar en cada tecla.
 */

const store = useOperationsStore()

const ticketCode = ref('')

const timeline = computed(() => store.tracking.data?.data)
const events = computed(() => timeline.value?.events ?? [])

async function lookup(): Promise<void> {
  const code = ticketCode.value.trim()

  if (code === '') {
    return
  }

  ticketCode.value = code.toUpperCase()
  await store.lookupTracking(ticketCode.value)
}
</script>

<template>
  <AppShell>
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Tracking</h1>
          <p class="page-subtitle">Full timeline of a parcel by its ticket code</p>
        </div>
      </div>

      <Card>
        <form class="search-form" @submit.prevent="lookup">
          <Input v-model="ticketCode" placeholder="A7F3Q8X4" />
          <Button variant="primary" :loading="store.tracking.status === 'loading'" @click="lookup">
            <template #leading>
              <Search :size="16" stroke-width="2" />
            </template>
            Look up
          </Button>
        </form>
      </Card>

      <div v-if="store.tracking.status === 'idle'" class="hint">
        Enter a ticket code to see every reception, embark, disembark and delivery event.
      </div>

      <div v-else-if="store.tracking.status === 'loading'" class="hint">
        <LoadingSpinner />
        Loading timeline…
      </div>

      <Card v-else-if="store.tracking.status === 'error'" class="error-card">
        <p class="error-text">
          {{ store.tracking.error?.message ?? 'The timeline could not be loaded.' }}
        </p>
        <Button variant="secondary" @click="lookup">Retry</Button>
      </Card>

      <template v-else-if="timeline">
        <Card>
          <div class="summary">
            <div>
              <span class="summary-label">Ticket</span>
              <strong class="summary-value">{{ timeline.ticket_number }}</strong>
              <span class="summary-code">{{ timeline.ticket_code }}</span>
            </div>
            <OperationStatusBadge :status="String(timeline.status ?? '')" />
          </div>

          <dl class="summary-grid">
            <div>
              <dt>Order</dt>
              <dd>#{{ timeline.order_id }}</dd>
            </div>
            <div>
              <dt>Origin</dt>
              <dd>#{{ timeline.origin_agency_id }}</dd>
            </div>
            <div>
              <dt>Destination</dt>
              <dd>#{{ timeline.destination_agency_id }}</dd>
            </div>
            <div>
              <dt>Current location</dt>
              <dd>#{{ formatText(timeline.current_location_agency_id) }}</dd>
            </div>
            <div>
              <dt>Delivered</dt>
              <dd>{{ formatDateTime(timeline.delivered_at) }}</dd>
            </div>
          </dl>
        </Card>

        <Card title="Timeline">
          <ol class="timeline">
            <li v-for="event in events" :key="event.id" class="event">
              <span class="event-dot" />
              <div class="event-body">
                <div class="event-head">
                  <strong>{{ formatText(event.event_type) }}</strong>
                  <OperationStatusBadge :status="String(event.status ?? '')" />
                </div>
                <span class="event-meta">
                  {{ formatDateTime(event.created_at) }}
                  · agency #{{ formatText(event.agency_id) }}
                  <template v-if="event.scan_id"> · scan {{ event.scan_id }}</template>
                </span>
                <pre v-if="event.meta" class="event-payload">{{ formatMeta(event.meta) }}</pre>
              </div>
            </li>
          </ol>

          <p v-if="events.length === 0" class="hint">This shipment has no events yet.</p>
        </Card>
      </template>
    </div>
  </AppShell>
</template>

<style scoped>
.page {
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
  margin-top: 2px;
  font-size: 13px;
  color: var(--muted);
}

.search-form {
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 460px;
}

.hint {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--muted);
}

.error-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.error-text {
  margin: 0;
  font-size: 13px;
  color: var(--danger);
}

.summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.summary-label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--muted);
}

.summary-value {
  display: block;
  margin-top: 2px;
  font-size: 18px;
  color: var(--fg);
}

.summary-code {
  font-size: 12px;
  color: var(--muted);
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  margin: 0;
}

.summary-grid dt {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--muted);
}

.summary-grid dd {
  margin: 2px 0 0;
  font-size: 13px;
  color: var(--fg);
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.event {
  display: flex;
  gap: 12px;
}

.event-dot {
  width: 10px;
  height: 10px;
  margin-top: 5px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #6366f1;
}

.event-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.event-head {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.event-meta {
  font-size: 12px;
  color: var(--muted);
}

.event-payload {
  max-width: 100%;
  margin: 4px 0 0;
  padding: 8px 10px;
  overflow-x: auto;
  border-radius: 8px;
  background: var(--bg);
  font-size: 11px;
  color: var(--fg-secondary);
}
</style>
