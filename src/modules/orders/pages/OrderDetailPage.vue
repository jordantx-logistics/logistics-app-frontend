<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'

import { ApiError } from '@/core/api/errors'
import AppShell from '@/core/components/AppShell.vue'
import Badge from '@/core/components/Badge.vue'
import Button from '@/core/components/Button.vue'
import Card from '@/core/components/Card.vue'
import FormField from '@/core/components/FormField.vue'
import Input from '@/core/components/Input.vue'
import ListState from '@/core/components/ListState.vue'
import Modal from '@/core/components/Modal.vue'
import PermissionGate from '@/core/components/PermissionGate.vue'
import { useAsyncData } from '@/core/composables/useAsyncData'
import { useToast } from '@/core/composables/useToast'
import { useAgencyOptionsStore } from '@/core/stores/agencyOptions'
import '@/core/styles/backoffice.css'
import { formatDate, formatText } from '@/core/utils/format'

import * as ordersApi from '../api/orders.api'
import LocationPicker from '../components/LocationPicker.vue'
import { statusVariant } from '../composables/useOrdersTable'
import type { LocationOption, UpdateDeliveryPayload } from '../types/orders.types'

/**
 * Detalle de la orden. Las acciones que dependen del estado se **deshabilitan** en
 * lugar de ocultarse; las que dependen del permiso, no se ofrecen. El backend
 * revalida ambas cosas.
 */

const route = useRoute()
const toast = useToast()
const agencies = useAgencyOptionsStore()

const orderId = computed(() => Number(route.params.id))
const order = useAsyncData(() => ordersApi.getOrder(orderId.value))
const row = computed(() => order.data.value)

const canConfirm = computed(() => row.value?.status === 'pending')
const canCancel = computed(() => ['pending', 'confirmed'].includes(String(row.value?.status)))
const canEditDelivery = computed(() => ['pending', 'confirmed'].includes(String(row.value?.status)))

const busy = ref(false)
const cancelModal = ref(false)
const cancelReason = ref('')
const deliveryModal = ref(false)
const deliveryError = ref<ApiError | null>(null)
const deliveryLocation = ref<LocationOption | null>(null)
const delivery = reactive({
  delivery_type: 'home_delivery' as 'agency_pickup' | 'home_delivery',
  recipient_address: '',
})

async function act(mutation: () => Promise<void>, done: string, failed: string): Promise<boolean> {
  busy.value = true

  try {
    await mutation()
    toast.success(done)
    await order.load()

    return true
  } catch (caught) {
    toast.error(failed, caught instanceof ApiError ? caught.message : undefined)

    return false
  } finally {
    busy.value = false
  }
}

function confirm(): void {
  void act(
    () => ordersApi.confirmOrder(orderId.value),
    'Order confirmed',
    'Could not confirm the order',
  )
}

async function submitCancel(): Promise<void> {
  const cancelled = await act(
    () => ordersApi.cancelOrder(orderId.value, cancelReason.value.trim()),
    'Order cancelled',
    'Could not cancel the order',
  )

  if (cancelled) {
    cancelModal.value = false
  }
}

async function submitDelivery(): Promise<void> {
  deliveryError.value = null
  busy.value = true

  try {
    await ordersApi.updateDelivery(orderId.value, {
      delivery_type: delivery.delivery_type,
      delivery_location_id: deliveryLocation.value?.id ?? null,
      recipient_address: delivery.recipient_address === '' ? null : delivery.recipient_address,
    } as UpdateDeliveryPayload)
    toast.success('Delivery updated')
    deliveryModal.value = false
    await order.load()
  } catch (caught) {
    deliveryError.value = caught instanceof ApiError ? caught : null
    toast.error('Could not update the delivery', deliveryError.value?.message)
  } finally {
    busy.value = false
  }
}

onMounted(() => {
  agencies.ensureLoaded()
  void order.load()
})
</script>

<template>
  <AppShell>
    <div class="bo-page">
      <ListState
        :status="order.status.value"
        :error="order.error.value"
        :empty="row === null"
        @retry="order.load"
      >
        <template v-if="row">
          <div class="bo-header">
            <div>
              <h1 class="bo-title">{{ row.ticket_number }}</h1>
              <p class="bo-subtitle bo-mono" data-testid="ticket-code">{{ row.ticket_code }}</p>
            </div>
            <div class="bo-actions">
              <PermissionGate permission="orders.confirm">
                <Button :disabled="!canConfirm" :loading="busy" @click="confirm">Confirm</Button>
              </PermissionGate>
              <PermissionGate permission="orders.update">
                <Button
                  variant="secondary"
                  :disabled="!canEditDelivery"
                  @click="deliveryModal = true"
                >
                  Request delivery
                </Button>
              </PermissionGate>
              <PermissionGate permission="orders.cancel">
                <Button variant="secondary" :disabled="!canCancel" @click="cancelModal = true">
                  Cancel order
                </Button>
              </PermissionGate>
            </div>
          </div>

          <Card title="Order">
            <dl class="bo-details">
              <div>
                <dt>Status</dt>
                <dd>
                  <Badge :variant="statusVariant(String(row.status))" dot>
                    <span data-testid="order-status">{{ row.status }}</span>
                  </Badge>
                </dd>
              </div>
              <div>
                <dt>Total</dt>
                <dd>S/ {{ row.total_amount }}</dd>
              </div>
              <div>
                <dt>Origin</dt>
                <dd>{{ agencies.label(row.origin_agency_id) }}</dd>
              </div>
              <div>
                <dt>Destination</dt>
                <dd>{{ agencies.label(row.destination_agency_id) }}</dd>
              </div>
              <div>
                <dt>Weight</dt>
                <dd>{{ row.weight_kg }} kg</dd>
              </div>
              <div>
                <dt>Service</dt>
                <dd>{{ formatText(row.service_type) }}</dd>
              </div>
              <div>
                <dt>Delivery</dt>
                <dd>{{ formatText(row.delivery_type) }}</dd>
              </div>
              <div>
                <dt>Address</dt>
                <dd>{{ formatText(row.recipient_address) }}</dd>
              </div>
              <div>
                <dt>Contents</dt>
                <dd>{{ formatText(row.description) }}</dd>
              </div>
              <div v-if="row.cancelled_reason">
                <dt>Cancellation reason</dt>
                <dd>{{ row.cancelled_reason }}</dd>
              </div>
            </dl>
          </Card>

          <Card title="History">
            <ListState
              status="ready"
              :empty="(row.status_history ?? []).length === 0"
              empty-text="No status changes yet."
            >
              <ul class="history">
                <li v-for="entry in row.status_history" :key="String(entry.created_at)">
                  <strong>{{ entry.to_status }}</strong>
                  <span class="bo-hint">{{ formatDate(entry.created_at) }}</span>
                  <span v-if="entry.reason" class="bo-hint">{{ entry.reason }}</span>
                </li>
              </ul>
            </ListState>
          </Card>

          <div class="bo-actions">
            <PermissionGate permission="payments.create">
              <router-link class="bo-link" to="/finance/payments">Collect payment</router-link>
            </PermissionGate>
            <PermissionGate permission="tracking.view">
              <router-link class="bo-link" to="/operations/tracking">Tracking</router-link>
            </PermissionGate>
            <PermissionGate permission="incidents.view">
              <router-link
                class="bo-link"
                :to="{
                  name: 'incidents',
                  query: { ticket_code: row.ticket_code, order_id: row.id },
                }"
              >
                Incidents
              </router-link>
            </PermissionGate>
          </div>
        </template>
      </ListState>
    </div>

    <Modal :visible="cancelModal" title="Cancel order" @close="cancelModal = false">
      <form class="bo-form" @submit.prevent="submitCancel">
        <FormField label="Reason">
          <Input v-model="cancelReason" placeholder="Customer request" />
        </FormField>
        <div class="bo-form-actions">
          <Button type="button" variant="ghost" @click="cancelModal = false">Keep order</Button>
          <Button type="submit" :loading="busy">Cancel order</Button>
        </div>
      </form>
    </Modal>

    <Modal :visible="deliveryModal" title="Request delivery" @close="deliveryModal = false">
      <form class="bo-form" @submit.prevent="submitDelivery">
        <FormField label="Delivery">
          <select v-model="delivery.delivery_type" class="bo-control" aria-label="Delivery">
            <option value="home_delivery">Home delivery</option>
            <option value="agency_pickup">Pick up at agency</option>
          </select>
        </FormField>
        <template v-if="delivery.delivery_type === 'home_delivery'">
          <FormField
            label="Delivery location"
            :error="deliveryError?.fieldError('delivery_location_id')"
          >
            <LocationPicker v-model="deliveryLocation" />
          </FormField>
          <FormField label="Address" :error="deliveryError?.fieldError('recipient_address')">
            <Input v-model="delivery.recipient_address" placeholder="Street and number" />
          </FormField>
        </template>
        <p v-if="deliveryError && !deliveryError.isValidationError" class="bo-form-error">
          {{ deliveryError.message }}
        </p>
        <div class="bo-form-actions">
          <Button type="button" variant="ghost" @click="deliveryModal = false">Close</Button>
          <Button type="submit" :loading="busy">Save</Button>
        </div>
      </form>
    </Modal>
  </AppShell>
</template>

<style scoped>
.history {
  display: flex;
  flex-direction: column;
  gap: 8px;
  list-style: none;
  padding: 0;
  font-size: 13px;
  color: var(--fg);
}

.history li {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
</style>
