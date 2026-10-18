<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AuthLayout from '@/core/components/AuthLayout.vue'
import Button from '@/core/components/Button.vue'
import Input from '@/core/components/Input.vue'
import { resetPassword } from '@/core/api/auth'
import { toApiError } from '@/core/api/errors'
import { useToast } from '@/core/composables/useToast'

const route = useRoute()
const router = useRouter()
const { success } = useToast()

// El enlace del correo trae `?token=...&email=...` (ver `ResetPassword::createUrlUsing`
// en el backend). Sin los dos, no hay nada que reenviar.
const token = typeof route.query.token === 'string' ? route.query.token : ''
const email = typeof route.query.email === 'string' ? route.query.email : ''
const linkIsValid = token !== '' && email !== ''

const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const formError = ref('')

async function onSubmit() {
  if (password.value !== confirmPassword.value) {
    formError.value = 'Passwords do not match.'
    return
  }

  loading.value = true
  formError.value = ''

  try {
    const response = await resetPassword({
      token,
      email,
      password: password.value,
      password_confirmation: confirmPassword.value,
    })
    success(response.message)
    await router.push({ name: 'login' })
  } catch (error) {
    const apiError = toApiError(error)

    formError.value = apiError.isRateLimited
      ? 'Too many attempts. Wait a minute and try again.'
      : (apiError.fieldError('password') ?? apiError.fieldError('email') ?? apiError.message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthLayout>
    <form v-if="linkIsValid" class="reset-form" @submit.prevent="onSubmit">
      <h2 class="reset-title">Set new password</h2>
      <p class="reset-subtitle">Enter your new password to continue</p>

      <div class="form-group">
        <Input
          label="New password"
          type="password"
          placeholder="••••••••"
          v-model="password"
          required
        />
      </div>

      <div class="form-group">
        <Input
          label="Confirm password"
          type="password"
          placeholder="••••••••"
          v-model="confirmPassword"
          required
        />
      </div>

      <p v-if="formError" class="reset-error" role="alert">{{ formError }}</p>

      <Button type="submit" variant="primary" :loading="loading" block> Update password </Button>

      <RouterLink class="reset-link" :to="{ name: 'login' }">Back to sign in</RouterLink>
    </form>

    <div v-else class="reset-form">
      <h2 class="reset-title">Invalid link</h2>
      <p class="reset-subtitle">
        This password reset link is missing its token. Request a new one.
      </p>

      <RouterLink class="reset-link" :to="{ name: 'forgotPassword' }"
        >Request a new link</RouterLink
      >
    </div>
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

.reset-error {
  font-size: 13px;
  color: #e04545;
  text-align: center;
}

.reset-link {
  font-size: 13px;
  color: var(--muted);
  text-align: center;
}

.reset-link:hover {
  color: var(--fg);
}
</style>
