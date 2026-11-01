<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import { ApiError } from '@/core/api/errors'
import AgencySelect from '@/core/components/AgencySelect.vue'
import AppShell from '@/core/components/AppShell.vue'
import Button from '@/core/components/Button.vue'
import Card from '@/core/components/Card.vue'
import FormField from '@/core/components/FormField.vue'
import Input from '@/core/components/Input.vue'
import { useAuthStore } from '@/core/stores/auth'
import { useToast } from '@/core/composables/useToast'
import '@/core/styles/backoffice.css'

import * as ordersApi from '../api/orders.api'
import CustomerPicker from '../components/CustomerPicker.vue'
import LocationPicker from '../components/LocationPicker.vue'
import type {
  CreateOrderPayload,
  CustomerOption,
  LocationOption,
  Quote,
  QuotePayload,
} from '../types/orders.types'

/**
 * Alta guiada: remitente → destinatario → detalle → tarifa.
 *
 * El precio lo calcula el motor del backend al entrar en el último paso. La clave de
 * idempotencia se fija al abrir la pantalla: reenviar tras un fallo de red no
 * duplica la orden.
 */

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

const STEPS = ['Sender', 'Receiver', 'Details', 'Tariff']
const step = ref(0)

const sender = ref<CustomerOption | null>(null)
const receiver = ref<CustomerOption | null>(null)
const location = ref<LocationOption | null>(null)

const form = reactive({
  origin_agency_id: String(authStore.agencies[0] ?? ''),
  destination_agency_id: '',
  weight_kg: '',
  volume_m3: '',
  declared_value: '',
  description: '',
  service_type: 'standard' as 'standard' | 'express',
  payment_responsibility: 'sender' as 'sender' | 'receiver',
  delivery_type: 'agency_pickup' as 'agency_pickup' | 'home_delivery',
  recipient_address: '',
})

const idempotencyKey = crypto.randomUUID()
const quote = ref<Quote | null>(null)
const quoting = ref(false)
const saving = ref(false)
const error = ref<ApiError | null>(null)

const isHomeDelivery = computed(() => form.delivery_type === 'home_delivery')

const canContinue = computed(() => {
  if (step.value === 0) return sender.value !== null
  if (step.value === 1) return receiver.value !== null
  if (step.value === 2) {
    return (
      form.origin_agency_id !== '' &&
      form.destination_agency_id !== '' &&
      Number(form.weight_kg) > 0 &&
      (!isHomeDelivery.value || location.value !== null)
    )
  }

  return false
})

function quotePayload(): QuotePayload {
  return {
    origin_agency_id: Number(form.origin_agency_id),
    destination_agency_id: Number(form.destination_agency_id),
    weight_kg: Number(form.weight_kg),
    volume_m3: form.volume_m3 === '' ? null : Number(form.volume_m3),
    service_type: form.service_type,
    delivery_type: form.delivery_type,
    delivery_location_id: isHomeDelivery.value ? (location.value?.id ?? null) : null,
  } as QuotePayload
}

async function loadQuote(): Promise<void> {
  quoting.value = true
  quote.value = null
  error.value = null

  try {
    quote.value = await ordersApi.quoteOrder(quotePayload())
  } catch (caught) {
    error.value = caught instanceof ApiError ? caught : null
    toast.error('Could not calculate the price', error.value?.message)
  } finally {
    quoting.value = false
  }
}

function next(): void {
  step.value += 1

  if (step.value === STEPS.length - 1) {
    void loadQuote()
  }
}

async function submit(): Promise<void> {
  if (sender.value === null || receiver.value === null) {
    return
  }

  saving.value = true
  error.value = null

  try {
    const order = await ordersApi.createOrder({
      ...quotePayload(),
      idempotency_key: idempotencyKey,
      sender_id: sender.value.id,
      receiver_id: receiver.value.id,
      description: form.description === '' ? null : form.description,
      declared_value: form.declared_value === '' ? null : Number(form.declared_value),
      payment_responsibility: form.payment_responsibility,
      recipient_address: form.recipient_address === '' ? null : form.recipient_address,
    } as CreateOrderPayload)

    toast.success('Order registered', `Ticket ${order.ticket_number}`)
    await router.push({ name: 'order-detail', params: { id: String(order.id) } })
  } catch (caught) {
    error.value = caught instanceof ApiError ? caught : null
    toast.error('Could not register the order', error.value?.message)
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <AppShell>
    <div class="bo-page">
      <div class="bo-header">
        <div>
          <h1 class="bo-title">New order</h1>
          <p class="bo-subtitle">The price is calculated by the tariff engine</p>
        </div>
      </div>

      <ol class="wizard-steps">
        <li
          v-for="(label, index) in STEPS"
          :key="label"
          class="wizard-step"
          :class="{ active: index === step, done: index < step }"
        >
          {{ index + 1 }}. {{ label }}
        </li>
      </ol>

      <Card>
        <CustomerPicker v-if="step === 0" v-model="sender" title="Who sends the parcel?" />
        <CustomerPicker v-else-if="step === 1" v-model="receiver" title="Who receives it?" />

        <div v-else-if="step === 2" class="bo-form">
          <div class="bo-grid">
            <FormField label="Origin agency" :error="error?.fieldError('origin_agency_id')">
              <AgencySelect v-model="form.origin_agency_id" aria-label="Origin agency" />
            </FormField>
            <FormField
              label="Destination agency"
              :error="error?.fieldError('destination_agency_id')"
            >
              <AgencySelect v-model="form.destination_agency_id" aria-label="Destination agency" />
            </FormField>
          </div>

          <div class="bo-grid">
            <FormField label="Weight (kg)" :error="error?.fieldError('weight_kg')">
              <Input v-model="form.weight_kg" type="number" placeholder="5" />
            </FormField>
            <FormField label="Volume (m³, optional)" :error="error?.fieldError('volume_m3')">
              <Input v-model="form.volume_m3" type="number" placeholder="0.02" />
            </FormField>
          </div>

          <div class="bo-grid">
            <FormField label="Service">
              <select v-model="form.service_type" class="bo-control" aria-label="Service">
                <option value="standard">Standard</option>
                <option value="express">Express</option>
              </select>
            </FormField>
            <FormField label="Paid by">
              <select v-model="form.payment_responsibility" class="bo-control" aria-label="Paid by">
                <option value="sender">Sender</option>
                <option value="receiver">Receiver</option>
              </select>
            </FormField>
          </div>

          <FormField label="Delivery">
            <select v-model="form.delivery_type" class="bo-control" aria-label="Delivery">
              <option value="agency_pickup">Pick up at agency</option>
              <option value="home_delivery">Home delivery</option>
            </select>
          </FormField>

          <template v-if="isHomeDelivery">
            <FormField label="Delivery location" :error="error?.fieldError('delivery_location_id')">
              <LocationPicker v-model="location" />
            </FormField>
            <FormField label="Address" :error="error?.fieldError('recipient_address')">
              <Input v-model="form.recipient_address" placeholder="Street and number" />
            </FormField>
          </template>

          <div class="bo-grid">
            <FormField label="Contents (optional)" :error="error?.fieldError('description')">
              <Input v-model="form.description" placeholder="Documents" />
            </FormField>
            <FormField label="Declared value (optional)">
              <Input v-model="form.declared_value" type="number" placeholder="100" />
            </FormField>
          </div>
        </div>

        <div v-else class="bo-form">
          <p v-if="quoting" class="bo-hint">Calculating the price…</p>

          <dl v-else-if="quote" class="bo-details">
            <div>
              <dt>Sender</dt>
              <dd>{{ sender?.display_name }}</dd>
            </div>
            <div>
              <dt>Receiver</dt>
              <dd>{{ receiver?.display_name }}</dd>
            </div>
            <div>
              <dt>Chargeable weight</dt>
              <dd>{{ quote.chargeable_weight_kg }} kg</dd>
            </div>
            <div>
              <dt>Total</dt>
              <dd data-testid="quote-total">S/ {{ quote.total_amount }}</dd>
            </div>
          </dl>

          <p v-if="error && !error.isValidationError" class="bo-form-error">{{ error.message }}</p>

          <Button v-if="!quoting && !quote" variant="secondary" @click="loadQuote">
            Calculate again
          </Button>
        </div>

        <div class="wizard-actions">
          <Button v-if="step > 0" variant="ghost" @click="step -= 1">Back</Button>
          <Button v-if="step < STEPS.length - 1" :disabled="!canContinue" @click="next">
            Continue
          </Button>
          <Button v-else :loading="saving" :disabled="quote === null" @click="submit">
            Register order
          </Button>
        </div>
      </Card>
    </div>
  </AppShell>
</template>

<style scoped>
.wizard-steps {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
  font-size: 13px;
}

.wizard-step {
  color: var(--muted);
}

.wizard-step.active {
  color: var(--fg);
  font-weight: 700;
}

.wizard-step.done {
  color: var(--fg-secondary);
}

.wizard-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 20px;
}
</style>
