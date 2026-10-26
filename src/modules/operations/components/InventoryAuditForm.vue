<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

import type { ApiError } from '@/core/api/errors'
import Button from '@/core/components/Button.vue'
import Input from '@/core/components/Input.vue'

import type {
  AgencyShipment,
  FinishInventoryCountPayload,
  InventoryCount,
} from '../types/operations.types'

/**
 * Cierre de un conteo: lo esperado sale del inventario físico de la agencia y
 * se marca lo encontrado. Cualquier diferencia (faltante o sobrante) exige
 * motivo, porque el backend no acepta un ajuste sin explicación.
 *
 * Los sobrantes se añaden a mano por id: el backend no expone un buscador de
 * envíos "no esperados", y el contrato pide el `shipment_id`.
 */
export interface InventoryAuditFormProps {
  count: InventoryCount
  expected: AgencyShipment[]
  loading?: boolean
  error?: ApiError | null
}

const props = withDefaults(defineProps<InventoryAuditFormProps>(), {
  loading: false,
  error: null,
})

const emit = defineEmits<{
  submit: [payload: FinishInventoryCountPayload]
  cancel: []
}>()

const found = reactive<Record<number, boolean>>(
  Object.fromEntries(props.expected.map((shipment) => [shipment.id, true])),
)

const motives = reactive<Record<number, string>>({})

const extraRows = ref<{ shipmentId: string; motive: string }[]>([])

const expectedIds = computed(() => new Set(props.expected.map((shipment) => shipment.id)))

function addExtraRow(): void {
  extraRows.value = [...extraRows.value, { shipmentId: '', motive: '' }]
}

function removeExtraRow(index: number): void {
  extraRows.value = extraRows.value.filter((_, current) => current !== index)
}

const extras = computed(() =>
  extraRows.value
    .map((row) => ({ shipmentId: Number(row.shipmentId), motive: row.motive.trim() }))
    .filter(
      (row) =>
        Number.isInteger(row.shipmentId) &&
        row.shipmentId > 0 &&
        !expectedIds.value.has(row.shipmentId),
    ),
)

const missingMotive = computed(
  () =>
    props.expected.some(
      (shipment) => !found[shipment.id] && (motives[shipment.id] ?? '').trim() === '',
    ) || extras.value.some((row) => row.motive === ''),
)

const totalItems = computed(() => props.expected.length + extras.value.length)

const canSubmit = computed(
  () =>
    totalItems.value > 0 && extras.value.length === extraRows.value.length && !missingMotive.value,
)

function onSubmit(): void {
  emit('submit', {
    items: [
      ...props.expected.map((shipment) => ({
        shipment_id: shipment.id,
        found: found[shipment.id] ?? false,
        motive: (motives[shipment.id] ?? '').trim() || null,
      })),
      ...extras.value.map((row) => ({
        shipment_id: row.shipmentId,
        found: true,
        motive: row.motive,
      })),
    ],
  })
}
</script>

<template>
  <form class="form" @submit.prevent="onSubmit">
    <div v-if="props.error && !props.error.isValidationError" class="form-alert">
      {{ props.error.message }}
    </div>

    <p class="form-hint">
      Count #{{ props.count.id }} · agency #{{ props.count.agency_id }}. Uncheck a parcel that is
      not physically there; every difference needs a motive.
    </p>

    <div class="audit-list">
      <div v-for="shipment in props.expected" :key="shipment.id" class="audit-row">
        <label class="audit-check">
          <input v-model="found[shipment.id]" type="checkbox" />
          <span>{{ shipment.ticket_code }}</span>
        </label>

        <Input
          v-if="!found[shipment.id]"
          v-model="motives[shipment.id]"
          placeholder="Why is it missing?"
        />
      </div>

      <p v-if="props.expected.length === 0" class="audit-empty">
        The agency has no expected parcels. Add the parcels you found below.
      </p>
    </div>

    <div v-if="extraRows.length > 0" class="audit-extras">
      <div v-for="(row, index) in extraRows" :key="index" class="audit-row">
        <Input v-model="row.shipmentId" type="number" placeholder="Shipment id" />
        <Input v-model="row.motive" placeholder="Why is it here?" />
        <Button variant="ghost" size="sm" @click="removeExtraRow(index)">Remove</Button>
      </div>
    </div>

    <Button variant="secondary" size="sm" @click="addExtraRow">Add unexpected parcel</Button>

    <p v-if="missingMotive" class="form-warning">
      Add a motive for every missing or unexpected parcel.
    </p>

    <div class="form-actions">
      <Button variant="ghost" @click="emit('cancel')">Cancel</Button>
      <Button variant="primary" :loading="props.loading" :disabled="!canSubmit" @click="onSubmit">
        Finish count
      </Button>
    </div>
  </form>
</template>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-hint {
  margin: 0;
  font-size: 12px;
  color: var(--fg-secondary);
}

.audit-list,
.audit-extras {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 280px;
  overflow-y: auto;
}

.audit-row {
  display: grid;
  grid-template-columns: minmax(140px, 1fr) minmax(160px, 2fr) auto;
  align-items: center;
  gap: 10px;
}

.audit-check {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
}

.audit-empty {
  margin: 0;
  font-size: 12px;
  color: var(--fg-secondary);
}

.form-warning {
  margin: 0;
  font-size: 12px;
  color: var(--warning);
}

.form-alert {
  padding: 10px 12px;
  border: 1px solid var(--danger);
  border-radius: 8px;
  font-size: 12px;
  color: var(--danger);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 14px;
  border-top: 1px solid var(--border);
}
</style>
