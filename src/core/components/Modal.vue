<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { X } from 'lucide-vue-next'

export interface ModalProps {
  visible: boolean
  title?: string
}

const props = defineProps<ModalProps>()
const emit = defineEmits<{
  close: []
}>()

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.visible) {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeyDown)
})

defineExpose({ name: 'Modal' })
</script>

<template>
  <Teleport to="body">
    <div v-if="props.visible" class="modal-overlay active" @click.self="$emit('close')">
      <div class="modal">
        <div class="modal-header">
          <span v-if="props.title" class="modal-title">{{ props.title }}</span>
          <button class="modal-close" @click="$emit('close')">
            <X :size="18" stroke-width="2" />
          </button>
        </div>
        <div class="modal-body">
          <slot />
        </div>
        <div v-if="$slots.footer" class="modal-footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.modal-overlay.active {
  animation: fadeIn 150ms ease;
  display: flex;
}

.modal {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  width: 100%;
  max-width: 520px;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: var(--shadow-xl);
  animation: slideUp 200ms ease;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
}

.modal-title {
  font-size: 16px;
  font-weight: 600;
}

.modal-close {
  padding: 4px;
  color: var(--muted);
  border-radius: 4px;
}

.modal-close:hover {
  background: var(--bg);
  color: var(--fg);
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 24px;
  border-top: 1px solid var(--border);
}
</style>
