<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from '@/core/components/Sidebar.vue'
import Header from '@/core/components/Header.vue'
import ToastContainer from '@/core/components/ToastContainer.vue'

const sidebarCollapsed = ref(false)
const mobileSidebarOpen = ref(false)

function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value
  if (window.innerWidth < 768) {
    mobileSidebarOpen.value = false
  }
}

function closeMobileSidebar() {
  mobileSidebarOpen.value = false
}

defineExpose({ name: 'AppShell' })
</script>

<template>
  <div class="app-shell">
    <Sidebar :collapsed="sidebarCollapsed" :mobile-open="mobileSidebarOpen" @toggle="toggleSidebar"
      @close-mobile="closeMobileSidebar" />
    <div class="main-area">
      <Header :collapsed="sidebarCollapsed" @toggle="toggleSidebar" />
      <main class="content">
        <slot />
      </main>
    </div>
    <ToastContainer />
    <div v-if="mobileSidebarOpen" class="mobile-overlay" @click="closeMobileSidebar" />
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

@media (max-width: 768px) {
  .content {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .content {
    padding: 12px;
  }
}
</style>
