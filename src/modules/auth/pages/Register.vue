<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/core/composables/useAuth'
import AuthLayout from '@/core/components/AuthLayout.vue'
import Button from '@/core/components/Button.vue'
import Input from '@/core/components/Input.vue'
import { useToast } from '@/core/composables/useToast'
import type { User } from '@/core/types'

const router = useRouter()
const { login } = useAuth()
const { success, error } = useToast()

const name = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)

async function onSubmit() {
  loading.value = true
  try {
    const user: User = { id: 'user-1', name: name.value, email: email.value, role: 'user', avatar: '' }
    await login(user, password.value)
    success('Registration successful!')
    router.push('/dashboard')
  } catch {
    error('Registration failed. Please try again.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthLayout>
    <form class="register-form" @submit.prevent="onSubmit">
      <h2 class="register-title">Create account</h2>
      <p class="register-subtitle">Join LogiTrack to get started</p>

      <div class="form-group">
        <Input label="Full name" type="text" placeholder="John Doe" v-model="name" required />
      </div>

      <div class="form-group">
        <Input label="Email" type="email" placeholder="you@example.com" v-model="email" required />
      </div>

      <div class="form-group">
        <Input label="Password" type="password" placeholder="••••••••" v-model="password" required />
      </div>

      <Button type="submit" variant="primary" :loading="loading" block>
        Create account
      </Button>
    </form>
  </AuthLayout>
</template>

<style scoped>
.register-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.register-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--fg);
  text-align: center;
}

.register-subtitle {
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
