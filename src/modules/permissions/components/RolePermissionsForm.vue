<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import type { ApiError } from '@/core/api/errors'
import type { AssignPermissionsPayload, Permission, Role } from '@/core/api/types'
import Button from '@/core/components/Button.vue'
import Toggle from '@/core/components/Toggle.vue'

/**
 * Asignación de permisos a un rol.
 *
 * El backend **sustituye** los permisos del rol (`syncPermissions`) por los que
 * llegan, así que el formulario arranca con los que ya tiene y manda la lista
 * completa marcada.
 */
export interface RolePermissionsFormProps {
  role: Role | null
  permissions: Permission[]
  loading?: boolean
  error?: ApiError | null
}

const props = withDefaults(defineProps<RolePermissionsFormProps>(), {
  loading: false,
  error: null,
})

const emit = defineEmits<{
  submit: [payload: AssignPermissionsPayload]
  cancel: []
}>()

const selected = ref<Set<number>>(new Set())

/** Permisos del rol (llegan como nombres) traducidos a ids del catálogo. */
function currentIds(): number[] {
  const names = new Set(props.role?.permissions ?? [])

  return props.permissions.filter((permission) => names.has(permission.name)).map((p) => p.id)
}

watch(
  () => [props.role, props.permissions] as const,
  () => {
    selected.value = new Set(currentIds())
  },
  { immediate: true },
)

/** El catálogo agrupado por recurso (`orders`, `persons`...), como en el backend. */
const grouped = computed<Array<[string, Permission[]]>>(() => {
  const groups = new Map<string, Permission[]>()

  for (const permission of props.permissions) {
    const [resource = 'other'] = permission.name.split('.')
    groups.set(resource, [...(groups.get(resource) ?? []), permission])
  }

  return [...groups.entries()]
})

function toggle(permissionId: number, enabled: boolean): void {
  const next = new Set(selected.value)

  if (enabled) {
    next.add(permissionId)
  } else {
    next.delete(permissionId)
  }

  selected.value = next
}

function onSubmit(): void {
  emit('submit', { permission_ids: [...selected.value] })
}
</script>

<template>
  <form class="form" @submit.prevent="onSubmit">
    <p class="form-hint">
      Permissions for <strong>{{ props.role?.name ?? '—' }}</strong
      >. Saving replaces the role list.
    </p>

    <div v-if="props.error" class="form-alert">{{ props.error.message }}</div>

    <div class="permission-groups">
      <section v-for="[resource, group] in grouped" :key="resource" class="permission-group">
        <h3 class="permission-group-title">{{ resource }}</h3>
        <Toggle
          v-for="permission in group"
          :key="permission.id"
          :model-value="selected.has(permission.id)"
          :label="permission.name"
          @update:model-value="toggle(permission.id, $event)"
        />
      </section>
    </div>

    <div class="form-actions">
      <Button variant="ghost" @click="emit('cancel')"> Cancel </Button>
      <Button variant="primary" :loading="props.loading" @click="onSubmit">
        Save permissions
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
  font-size: 13px;
  color: var(--muted);
}

.form-alert {
  padding: 10px 12px;
  border: 1px solid var(--danger);
  border-radius: 8px;
  font-size: 12px;
  color: var(--danger);
}

.permission-groups {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-height: 320px;
  overflow-y: auto;
}

.permission-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.permission-group-title {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--muted);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 14px;
  border-top: 1px solid var(--border);
}
</style>
