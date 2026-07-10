<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ChevronRight } from 'lucide-vue-next'

const route = useRoute()

const breadcrumbs = computed(() => {
  const path = route.path
  const parts = path.split('/').filter(Boolean)
  return parts.map((p) => ({
    label: p.charAt(0).toUpperCase() + p.slice(1),
    path: '/' + parts.slice(0, parts.indexOf(p)).join('/'),
    current: parts.indexOf(p) === parts.length - 1,
  }))
})

</script>

<!-- eslint-disable-next-line vue/multi-word-component-names -->
export default { name: 'Breadcrumb' }

<template>
  <nav class="breadcrumb">
    <span class="breadcrumb-root">LogiTrack</span>
    <template v-for="(crumb, index) in breadcrumbs" :key="index">
      <ChevronRight class="breadcrumb-sep" :size="14" stroke-width="2" />
      <span v-if="crumb.current" class="breadcrumb-current">
        {{ crumb.label }}
      </span>
      <router-link v-else :to="crumb.path" class="breadcrumb-link">
        {{ crumb.label }}
      </router-link>
    </template>
  </nav>
</template>

<style scoped>
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--muted);
}

.breadcrumb-root {
  color: var(--fg);
  font-weight: 600;
}

.breadcrumb-sep {
  color: var(--muted);
}

.breadcrumb-link {
  color: var(--fg-secondary);
}

.breadcrumb-link:hover {
  color: var(--fg);
}

.breadcrumb-current {
  color: var(--fg);
  font-weight: 500;
}
</style>
