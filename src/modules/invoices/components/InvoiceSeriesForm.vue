<script setup lang="ts">
import { reactive, ref } from 'vue'

import { ApiError } from '@/core/api/errors'
import Button from '@/core/components/Button.vue'
import FormField from '@/core/components/FormField.vue'
import Input from '@/core/components/Input.vue'
import { useToast } from '@/core/composables/useToast'
import { useAuth } from '@/core/composables/useAuth'

import { useInvoicesStore } from '../stores/useInvoicesStore'
import type { CreateInvoiceSeriesPayload, InvoiceSeries } from '../types/invoices.types'

/** Alta o edición de una serie fiscal por agencia. */
const props = defineProps<{
  series?: InvoiceSeries | undefined
}>()

const emit = defineEmits<{
  saved: []
  cancel: []
}>()

const store = useInvoicesStore()
const toast = useToast()
const { authStore } = useAuth()

const form = reactive({
  agency_id: String(props.series?.agency_id ?? authStore.agencies[0] ?? ''),
  document_type: props.series?.document_type ?? 'boleta',
  series: props.series?.series ?? '',
  issuer_ruc: props.series?.issuer_ruc ?? '',
  issuer_name: props.series?.issuer_name ?? '',
  issuer_trade_name: props.series?.issuer_trade_name ?? '',
  issuer_address: props.series?.issuer_address ?? '',
  issuer_ubigeo: props.series?.issuer_ubigeo ?? '',
  establishment_code: props.series?.establishment_code ?? '',
  is_default: props.series?.is_default ?? false,
})

const error = ref<ApiError | null>(null)

async function submit(): Promise<void> {
  error.value = null

  const payload: CreateInvoiceSeriesPayload = {
    agency_id: Number(form.agency_id),
    document_type: form.document_type,
    series: form.series.trim().toUpperCase(),
    issuer_ruc: form.issuer_ruc.trim(),
    issuer_name: form.issuer_name.trim(),
    issuer_trade_name: form.issuer_trade_name.trim() === '' ? null : form.issuer_trade_name.trim(),
    issuer_address: form.issuer_address.trim() === '' ? null : form.issuer_address.trim(),
    issuer_ubigeo: form.issuer_ubigeo.trim() === '' ? null : form.issuer_ubigeo.trim(),
    establishment_code:
      form.establishment_code.trim() === '' ? null : form.establishment_code.trim(),
    is_default: form.is_default,
  }

  try {
    if (props.series) {
      await store.updateSeries(props.series.id, payload)
      toast.success('Series updated', 'New invoices will use the new configuration.')
    } else {
      await store.createSeries(payload)
      toast.success('Series created', 'It is ready for new invoices.')
    }

    emit('saved')
  } catch (caught) {
    error.value = caught instanceof ApiError ? caught : null
    toast.error('Could not save the series', error.value?.message)
  }
}
</script>

<template>
  <form class="form" @submit.prevent="submit">
    <div class="grid">
      <FormField label="Agency ID" :error="error?.fieldError('agency_id')">
        <Input v-model="form.agency_id" type="number" placeholder="1" />
      </FormField>

      <FormField label="Document" :error="error?.fieldError('document_type')">
        <select v-model="form.document_type" class="control">
          <option value="boleta">Boleta</option>
          <option value="factura">Factura</option>
        </select>
      </FormField>
    </div>

    <div class="grid">
      <FormField label="Series" :error="error?.fieldError('series')">
        <Input v-model="form.series" placeholder="B001" maxlength="4" />
      </FormField>

      <FormField label="Issuer RUC" :error="error?.fieldError('issuer_ruc')">
        <Input v-model="form.issuer_ruc" placeholder="20123456789" maxlength="11" />
      </FormField>
    </div>

    <FormField label="Issuer name" :error="error?.fieldError('issuer_name')">
      <Input v-model="form.issuer_name" placeholder="Logistics SAC" />
    </FormField>

    <FormField label="Trade name" :error="error?.fieldError('issuer_trade_name')">
      <Input v-model="form.issuer_trade_name" placeholder="LogiTrack" />
    </FormField>

    <FormField label="Address" :error="error?.fieldError('issuer_address')">
      <Input v-model="form.issuer_address" placeholder="Av. Example 123" />
    </FormField>

    <div class="grid">
      <FormField label="Ubigeo" :error="error?.fieldError('issuer_ubigeo')">
        <Input v-model="form.issuer_ubigeo" placeholder="150101" maxlength="6" />
      </FormField>

      <FormField label="Establishment" :error="error?.fieldError('establishment_code')">
        <Input v-model="form.establishment_code" placeholder="0000" maxlength="4" />
      </FormField>
    </div>

    <label class="checkbox">
      <input v-model="form.is_default" type="checkbox" />
      <span>Use as default series for this agency and document</span>
    </label>

    <p v-if="error && !error.isValidationError" class="form-error">{{ error.message }}</p>

    <div class="actions">
      <Button variant="secondary" type="button" @click="emit('cancel')">Cancel</Button>
      <Button type="submit" :loading="store.saving">
        {{ props.series ? 'Save changes' : 'Create series' }}
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

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.control {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
  color: var(--fg);
  font-size: 14px;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--fg-secondary);
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
