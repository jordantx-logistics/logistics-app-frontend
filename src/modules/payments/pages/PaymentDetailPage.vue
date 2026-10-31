<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Ban } from 'lucide-vue-next'

import { ApiError } from '@/core/api/errors'
import AppShell from '@/core/components/AppShell.vue'
import Badge from '@/core/components/Badge.vue'
import Button from '@/core/components/Button.vue'
import Card from '@/core/components/Card.vue'
import FormField from '@/core/components/FormField.vue'
import ListState from '@/core/components/ListState.vue'
import Modal from '@/core/components/Modal.vue'
import Textarea from '@/core/components/Textarea.vue'
import { useToast } from '@/core/composables/useToast'
import { formatDate, formatText } from '@/core/utils/format'

import { usePaymentsStore } from '../stores/usePaymentsStore'

/** Detalle de un cobro y solicitud de anulación. */

const route = useRoute()
const router = useRouter()
const store = usePaymentsStore()
const toast = useToast()

const voidOpen = ref(false)
const reason = ref('')
const error = ref<ApiError | null>(null)

const paymentId = computed(() => Number(route.params.id))
const payment = computed(() => store.detail.data)
const voids = computed(() => store.voids.data ?? [])

const STATUS_VARIANTS: Record<string, 'success' | 'warning' | 'danger' | 'neutral'> = {
  registered: 'success',
  refunded: 'warning',
  voided: 'danger',
}

const hasOpenVoid = computed(() =>
  voids.value.some((item) => item.status === 'requested' || item.status === 'approved'),
)

function money(value: unknown): string {
  const numeric = Number(value)

  return Number.isFinite(numeric) ? `S/ ${numeric.toFixed(2)}` : formatText(value)
}

async function submitVoid(): Promise<void> {
  error.value = null

  try {
    await store.requestVoid(paymentId.value, reason.value.trim())
    toast.success('Void requested', 'A supervisor must approve it.')
    voidOpen.value = false
    reason.value = ''
  } catch (caught) {
    error.value = caught instanceof ApiError ? caught : null
    toast.error('Could not request the void', error.value?.message)
  }
}

onMounted(() => {
  void store.loadDetail(paymentId.value)
})
</script>

<template>
  <AppShell>
    <div class="page">
      <div class="page-header">
        <div class="title-row">
          <Button variant="ghost" @click="router.push({ name: 'finance-payments' })">
            <template #leading><ArrowLeft :size="16" /></template>
            Back
          </Button>
          <div>
            <h1 class="page-title">Payment detail</h1>
            <p class="page-subtitle">Collections, invoices and void requests</p>
          </div>
        </div>

        <Button
          v-if="payment && payment.status !== 'voided' && !hasOpenVoid"
          variant="secondary"
          @click="voidOpen = true"
        >
          <template #leading><Ban :size="16" /></template>
          Request void
        </Button>
      </div>

      <ListState
        :status="store.detail.status"
        :error="store.detail.error"
        :empty="payment === null"
        empty-text="The payment does not exist."
        @retry="store.detail.load"
      >
        <template v-if="payment">
          <Card title="Summary">
            <dl class="summary">
              <div>
                <dt>Ticket</dt>
                <dd class="mono">{{ formatText(payment.ticket_number) }}</dd>
              </div>
              <div>
                <dt>Order</dt>
                <dd>#{{ formatText(payment.order_id) }}</dd>
              </div>
              <div>
                <dt>Amount</dt>
                <dd>{{ money(payment.amount) }}</dd>
              </div>
              <div>
                <dt>Method</dt>
                <dd>{{ String(payment.payment_method).toUpperCase() }}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>
                  <Badge :variant="STATUS_VARIANTS[payment.status] ?? 'neutral'">
                    {{ payment.status }}
                  </Badge>
                </dd>
              </div>
              <div>
                <dt>Agency</dt>
                <dd>#{{ payment.agency_id }}</dd>
              </div>
              <div>
                <dt>Paid at</dt>
                <dd>{{ formatDate(payment.paid_at) }}</dd>
              </div>
              <div>
                <dt>Reference</dt>
                <dd>{{ formatText(payment.reference) }}</dd>
              </div>
            </dl>
          </Card>

          <Card title="Void requests">
            <ListState
              :status="store.voids.status"
              :error="store.voids.error"
              :empty="voids.length === 0"
              empty-text="No void requests for this payment."
              @retry="store.voids.load"
            >
              <ul class="void-list">
                <li v-for="item in voids" :key="item.id" class="void-item">
                  <div>
                    <p class="void-reason">{{ item.reason }}</p>
                    <p class="void-meta">
                      Requested {{ formatDate(item.requested_at) }} · #{{ item.requested_by }}
                    </p>
                    <p v-if="item.rejection_reason" class="void-meta">
                      Rejected: {{ item.rejection_reason }}
                    </p>
                  </div>
                  <Badge
                    :variant="
                      item.status === 'approved'
                        ? 'danger'
                        : item.status === 'requested'
                          ? 'warning'
                          : 'neutral'
                    "
                  >
                    {{ item.status }}
                  </Badge>
                </li>
              </ul>
            </ListState>
          </Card>
        </template>
      </ListState>
    </div>

    <Modal :visible="voidOpen" title="Request void" @close="voidOpen = false">
      <form class="form" @submit.prevent="submitVoid">
        <p class="hint">
          An accepted invoice must be credited before a void can be approved. The request goes to a
          different supervisor.
        </p>
        <FormField label="Reason" :error="error?.fieldError('reason')">
          <Textarea v-model="reason" placeholder="Duplicate charge, customer cancellation..." />
        </FormField>
        <p v-if="error && !error.isValidationError" class="form-error">{{ error.message }}</p>
        <div class="actions">
          <Button variant="secondary" type="button" @click="voidOpen = false">Cancel</Button>
          <Button type="submit" :loading="store.saving" :disabled="reason.trim() === ''">
            Send request
          </Button>
        </div>
      </form>
    </Modal>
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
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--fg);
}

.page-subtitle {
  margin-top: 2px;
  font-size: 13px;
  color: var(--muted);
}

.summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 16px;
  margin: 0;
}

.summary dt {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--muted);
}

.summary dd {
  margin: 4px 0 0;
  font-size: 14px;
  color: var(--fg);
}

.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12px;
}

.void-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.void-item {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 10px;
}

.void-reason {
  font-size: 13px;
  font-weight: 600;
  color: var(--fg);
}

.void-meta {
  margin-top: 4px;
  font-size: 12px;
  color: var(--muted);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.hint {
  font-size: 13px;
  color: var(--muted);
  line-height: 1.5;
}

.form-error {
  font-size: 12px;
  color: var(--danger);
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
