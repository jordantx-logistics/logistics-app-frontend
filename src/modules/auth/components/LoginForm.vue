<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/core/composables/useAuth'
import { toApiError } from '@/core/api/errors'
import Button from '@/core/components/Button.vue'
import Input from '@/core/components/Input.vue'
import { useToast } from '@/core/composables/useToast'

const router = useRouter()
const route = useRoute()
const { login } = useAuth()
const { success } = useToast()

const email = ref('')
const password = ref('')
const loading = ref(false)
const formError = ref('')

function messageFor(error: unknown): string {
  const apiError = toApiError(error)

  if (apiError.isRateLimited) {
    return 'Demasiados intentos. Espera un minuto y vuelve a probar.'
  }

  if (apiError.isValidationError || apiError.isUnauthenticated) {
    return 'Credenciales incorrectas.'
  }

  return apiError.message
}

async function onSubmit() {
  loading.value = true
  formError.value = ''

  try {
    await login({ email: email.value, password: password.value })
    success('Sesión iniciada.')

    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard'
    await router.push(redirect)
  } catch (error) {
    formError.value = messageFor(error)
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

    <p v-if="formError" class="login-error" role="alert">{{ formError }}</p>

    <Button type="submit" variant="primary" :loading="loading" block> Sign in </Button>

    <RouterLink class="login-link" :to="{ name: 'forgotPassword' }"
      >Forgot your password?</RouterLink
    >
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

.login-error {
  font-size: 13px;
  color: #e04545;
  text-align: center;
}

.login-link {
  font-size: 13px;
  color: var(--muted);
  text-align: center;
}

.login-link:hover {
  color: var(--fg);
}
</style>
