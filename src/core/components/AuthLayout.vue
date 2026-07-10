<script setup lang="ts">
defineProps<{
  title?: string
  subtitle?: string
}>()

defineExpose({ name: 'AuthLayout' })
</script>

<template>
  <div class="auth-screen">
    <div class="auth-card">
      <div class="auth-logo">
        <div class="auth-logo-icon">L</div>
        <div class="auth-logo-text">LogiTrack</div>
      </div>
      <div v-if="title" class="auth-title">{{ title }}</div>
      <div v-if="subtitle" class="auth-subtitle">{{ subtitle }}</div>
      <slot />
    </div>
  </div>
</template>
<style scoped>
.auth-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--bg);
  padding: 24px
}

.auth-card {
  width: 100%;
  max-width: 400px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: 40px 32px;
  box-shadow: var(--shadow-lg)
}

.auth-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 32px
}

.auth-logo-icon {
  width: 36px;
  height: 36px;
  background: var(--accent);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 16px
}

.auth-logo-text {
  font-size: 20px;
  font-weight: 700;
  color: var(--fg);
  letter-spacing: -.02em
}

.auth-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 4px;
  letter-spacing: -.02em
}

.auth-subtitle {
  color: var(--muted);
  font-size: 14px;
  margin-bottom: 28px
}
</style>