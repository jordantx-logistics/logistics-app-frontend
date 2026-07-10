<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthLayout from '@/core/components/AuthLayout.vue'
import Button from '@/core/components/Button.vue'
import Input from '@/core/components/Input.vue'
import { useToast } from '@/core/composables/useToast'

const router = useRouter()
const { success, error } = useToast()

const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)

async function onSubmit() {
  loading.value = true
  try {
    if (password.value !== confirmPassword.value) {
      error('Passwords do not match.')
      return
    }
    success('Password updated successfully.')
    router.push('/auth/login')
  } catch {
    error('Failed to reset password. Please try again.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthLayout>
    <form class="reset-form" @submit.prevent="onSubmit">
      <h2 class="reset-title">Set new password</h2>
      <p class="reset-subtitle">Enter your new password below</p>

      <div class="form-group">
        <Input label="New password" type="password" placeholder="••••••••" v-model="password" required />
      </div>

      <div class="form-group">
        <Input label="Confirm password" type="password" placeholder="••••••••" v-model="confirmPassword" required />
      </div>

      <Button type="submit" variant="primary" :loading="loading" block>
        Reset password
      </Button>
    </form>
  </AuthLayout>
</template>

<style scoped>
.reset-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.reset-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--fg);
  text-align: center;
}

.reset-subtitle {
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
