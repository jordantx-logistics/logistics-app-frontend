<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { ApiError } from '@/core/api/errors'
import Button from '@/core/components/Button.vue'
import FormField from '@/core/components/FormField.vue'
import Textarea from '@/core/components/Textarea.vue'
import { useToast } from '@/core/composables/useToast'
import { formatDate, formatText } from '@/core/utils/format'

import * as incidentsApi from '../api/incidents.api'
import { availableActions } from '../composables/useIncidentsPresentation'
import { useIncidentsStore } from '../stores/useIncidentsStore'
import type { Incident, IncidentAssignee } from '../types/incidents.types'

/**
 * Atención de una incidencia. Las acciones que el estado no admite quedan
 * deshabilitadas; el backend vuelve a comprobarlo.
 */
const props = defineProps<{
  incident: Incident
}>()

const emit = defineEmits<{
  changed: [incident: Incident]
}>()

const store = useIncidentsStore()
const toast = useToast()

const assignees = ref<IncidentAssignee[]>([])
const assignee = ref('')
const note = ref('')

const actions = computed(() => availableActions(String(props.incident.status)))

async function run(mutation: () => Promise<Incident>, done: string): Promise<void> {
  try {
    emit('changed', await store.act(mutation))
    toast.success(done)
  } catch (caught) {
    toast.error('Could not update the incident', caught instanceof ApiError ? caught.message : '')
  }
}

function assign(): void {
  void run(
    () => incidentsApi.assignIncident(Number(props.incident.id), Number(assignee.value)),
    'Incident assigned',
  )
}

function change(action: incidentsApi.IncidentAction, done: string): void {
  void run(() => incidentsApi.changeIncident(Number(props.incident.id), action), done)
}

function resolve(): void {
  void run(
    () => incidentsApi.resolveIncident(Number(props.incident.id), note.value.trim()),
    'Incident resolved',
  )
}

watch(
  () => props.incident.id,
  async (id) => {
    assignee.value = props.incident.assigned_to ? String(props.incident.assigned_to) : ''

    try {
      assignees.value = await incidentsApi.listAssignees(Number(id))
    } catch (caught) {
      assignees.value = []
      toast.error(
        'Could not load who can attend it',
        caught instanceof ApiError ? caught.message : '',
      )
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="bo-form">
    <dl class="bo-details">
      <div>
        <dt>Due</dt>
        <dd>{{ formatDate(props.incident.due_at) }}</dd>
      </div>
      <div>
        <dt>Description</dt>
        <dd>{{ formatText(props.incident.description) }}</dd>
      </div>
      <div v-if="props.incident.resolution_note">
        <dt>Resolution</dt>
        <dd>{{ props.incident.resolution_note }}</dd>
      </div>
    </dl>

    <FormField label="Responsible">
      <div class="incident-assign">
        <select
          v-model="assignee"
          class="bo-control"
          aria-label="Responsible"
          :disabled="!actions.assign"
        >
          <option value="">Select someone</option>
          <option v-for="user in assignees" :key="user.id" :value="String(user.id)">
            {{ user.name }}
          </option>
        </select>
        <Button
          variant="secondary"
          :disabled="!actions.assign || assignee === ''"
          :loading="store.saving"
          @click="assign"
        >
          Assign
        </Button>
      </div>
    </FormField>

    <FormField label="Resolution note">
      <Textarea v-model="note" placeholder="What was done" :disabled="!actions.resolve" />
    </FormField>

    <div class="bo-form-actions">
      <Button
        variant="secondary"
        :disabled="!actions.reopen"
        @click="change('reopen', 'Incident reopened')"
      >
        Reopen
      </Button>
      <Button
        variant="secondary"
        :disabled="!actions.start"
        @click="change('start', 'Incident started')"
      >
        Start
      </Button>
      <Button :disabled="!actions.resolve" :loading="store.saving" @click="resolve">Resolve</Button>
      <Button
        variant="secondary"
        :disabled="!actions.close"
        @click="change('close', 'Incident closed')"
      >
        Close
      </Button>
    </div>
  </div>
</template>

<style scoped>
.incident-assign {
  display: flex;
  gap: 8px;
}
</style>
