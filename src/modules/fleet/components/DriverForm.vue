<script setup lang="ts">
import { reactive, ref } from 'vue'

import { ApiError } from '@/core/api/errors'
import AgencySelect from '@/core/components/AgencySelect.vue'
import Button from '@/core/components/Button.vue'
import FormField from '@/core/components/FormField.vue'
import Input from '@/core/components/Input.vue'
import { useAuth } from '@/core/composables/useAuth'
import { useToast } from '@/core/composables/useToast'

import * as fleetApi from '../api/fleet.api'
import { useFleetStore } from '../stores/useFleetStore'
import type { Driver } from '../types/fleet.types'

/** Alta o edición de la ficha de un chofer. El usuario y la agencia no cambian al editar. */
const props = defineProps<{
  driver?: Driver | undefined
}>()

const emit = defineEmits<{
  saved: []
  cancel: []
}>()

const store = useFleetStore()
const toast = useToast()
const { authStore } = useAuth()

const form = reactive({
  user_id: String(props.driver?.user_id ?? ''),
  home_agency_id: String(props.driver?.home_agency_id ?? authStore.agencies[0] ?? ''),
  license_number: props.driver?.license_number ?? '',
  license_category: props.driver?.license_category ?? '',
  license_expires_at: props.driver?.license_expires_at ?? '',
  phone: props.driver?.phone ?? '',
  status: props.driver?.status ?? 'active',
})

const error = ref<ApiError | null>(null)

async function submit(): Promise<void> {
  error.value = null

  const shared = {
    license_number: form.license_number.trim(),
    license_category: form.license_category.trim(),
    license_expires_at: form.license_expires_at,
    phone: form.phone.trim() === '' ? null : form.phone.trim(),
  }

  try {
    if (props.driver) {
      const id = props.driver.id
      await store.act(
        () => fleetApi.updateDriver(id, { ...shared, status: form.status }),
        store.drivers.load,
      )
      toast.success('Driver updated', 'The changes apply to new assignments.')
    } else {
      await store.act(
        () =>
          fleetApi.createDriver({
            ...shared,
            user_id: Number(form.user_id),
            home_agency_id: Number(form.home_agency_id),
          }),
        store.drivers.load,
      )
      toast.success('Driver registered', 'They can now be assigned to routes.')
    }

    emit('saved')
  } catch (caught) {
    error.value = caught instanceof ApiError ? caught : null
    toast.error('Could not save the driver', error.value?.message)
  }
}
</script>

<template>
  <form class="fleet-form" @submit.prevent="submit">
    <div v-if="!props.driver" class="fleet-grid">
      <FormField label="User ID" :error="error?.fieldError('user_id')">
        <Input v-model="form.user_id" type="number" placeholder="15" />
      </FormField>

      <FormField label="Home agency" :error="error?.fieldError('home_agency_id')">
        <AgencySelect v-model="form.home_agency_id" aria-label="Home agency" />
      </FormField>
    </div>

    <div class="fleet-grid">
      <FormField label="License number" :error="error?.fieldError('license_number')">
        <Input v-model="form.license_number" placeholder="Q12345678" />
      </FormField>

      <FormField label="Category" :error="error?.fieldError('license_category')">
        <Input v-model="form.license_category" placeholder="A-III" />
      </FormField>
    </div>

    <div class="fleet-grid">
      <FormField label="License expires" :error="error?.fieldError('license_expires_at')">
        <Input v-model="form.license_expires_at" type="date" />
      </FormField>

      <FormField label="Phone" :error="error?.fieldError('phone')">
        <Input v-model="form.phone" placeholder="999888777" />
      </FormField>
    </div>

    <FormField v-if="props.driver" label="Status" :error="error?.fieldError('status')">
      <select v-model="form.status" class="fleet-control">
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="suspended">Suspended</option>
      </select>
    </FormField>

    <p v-if="error && !error.isValidationError" class="fleet-form-error">{{ error.message }}</p>

    <div class="fleet-form-actions">
      <Button variant="secondary" type="button" @click="emit('cancel')">Cancel</Button>
      <Button type="submit" :loading="store.saving">
        {{ props.driver ? 'Save changes' : 'Register driver' }}
      </Button>
    </div>
  </form>
</template>
