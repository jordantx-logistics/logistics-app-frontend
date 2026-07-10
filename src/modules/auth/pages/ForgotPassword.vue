<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthLayout from '@/core/components/AuthLayout.vue'
import Button from '@/core/components/Button.vue'
import Input from '@/core/components/Input.vue'
import { useToast } from '@/core/composables/useToast'

const router = useRouter()
const { success, error } = useToast()

const email = ref('')
const loading = ref(false)

async function onSubmit() {
  loading.value = true
  try {
    success('Password reset link sent to your email.')
    router.push('/auth/login')
  } catch {
    error('Failed to send reset link. Please try again.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthLayout>
    <form class="forgot-form" @submit.prevent="onSubmit">
      <h2 class="forgot-title">Reset password</h2>
      <p class="forgot-subtitle">Enter your email and we'll send a reset link</p>

      <div class="form-group">
        <Input label="Email" type="email" placeholder="you@example.com" v-model="email" required />
      </div>

      <Button type="submit" variant="primary" :loading="loading" block>
        Send reset link
      </Button>
    </form>
  </AuthLayout>
</template>

<style scoped>
.forgot-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.forgot-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--fg);
  text-align: center;
}

.forgot-subtitle {
  font-size: 14px;
  color: var(--muted);
  text-align: center;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
</style>
