<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/core/composables/useAuth'
import Button from '@/core/components/Button.vue'
import Input from '@/core/components/Input.vue'
import { useToast } from '@/core/composables/useToast'
import type { User } from '@/core/types'

const router = useRouter()
const { login } = useAuth()
const { success, error } = useToast()

const email = ref('')
const password = ref('')
const loading = ref(false)

async function onSubmit() {
  loading.value = true
  try {
    const user: User = { id: 'user-1', name: 'John Doe', email: email.value, role: 'admin', avatar: '' }
    await login(user, password.value)
    success('Login successful!')
    router.push('/dashboard')
  } catch {
    error('Invalid credentials. Please try again.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form class="login-form" @submit.prevent="onSubmit">
    <h2 class="login-title">Welcome back</h2>
    <p class="login-subtitle">Sign in to your account to continue</p>

    <div class="form-group">
      <Input label="Email" type="email" placeholder="you@example.com" v-model="email" required />
    </div>

    <div class="form-group">
      <Input label="Password" type="password" placeholder="••••••••" v-model="password" required />
    </div>

    <Button type="submit" variant="primary" :loading="loading" block>
      Sign in
    </Button>
  </form>
</template>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.login-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--fg);
  text-align: center;
}

.login-subtitle {
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
