<script setup lang="ts">
export interface AvatarProps {
  name: string
  size?: number
  color?: string
}

const props = withDefaults(defineProps<AvatarProps>(), {
  size: 28,
  color: '#6366f1',
})

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0) return ''
  if (parts.length === 1) return (parts[0] || '').charAt(0).toUpperCase()
  return (parts[0] || '').charAt(0).toUpperCase() + (parts[parts.length - 1] || '').charAt(0).toUpperCase()
}
</script>

<!-- eslint-disable-next-line vue/multi-word-component-names -->
export default { name: 'Avatar' }

<template>
  <div class="avatar" :style="{ '--avatar-size': `${props.size}px`, '--avatar-color': props.color }">
    {{ getInitials(props.name) }}
  </div>
</template>

<style scoped>
.avatar {
  width: var(--avatar-size);
  height: var(--avatar-size);
  border-radius: 50%;
  background: var(--avatar-color);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: calc(var(--avatar-size) * 0.45);
  font-weight: 600;
}
</style>
