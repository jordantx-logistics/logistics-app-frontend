<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthLayout from '@/core/components/AuthLayout.vue'
import Button from '@/core/components/Button.vue'
import Input from '@/core/components/Input.vue'
import { forgotPassword } from '@/core/api/auth'
import { toApiError } from '@/core/api/errors'
import { useToast } from '@/core/composables/useToast'

const router = useRouter()
const { success } = useToast()

const email = ref('')
const loading = ref(false)
const formError = ref('')

async function onSubmit() {
  loading.value = true
  formError.value = ''

  try {
    // El backend responde lo mismo exista o no la cuenta (no filtra correos).
    const response = await forgotPassword({ email: email.value })
    success(response.message)
    await router.push({ name: 'login' })
  } catch (error) {
    const apiError = toApiError(error)

    formError.value = apiError.isRateLimited
      ? 'Too many attempts. Wait a minute and try again.'
      : (apiError.fieldError('email') ?? apiError.message)
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

      <p v-if="formError" class="forgot-error" role="alert">{{ formError }}</p>

      <Button type="submit" variant="primary" :loading="loading" block> Send reset link </Button>

      <RouterLink class="forgot-link" :to="{ name: 'login' }">Back to sign in</RouterLink>
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

.forgot-error {
  font-size: 13px;
  color: #e04545;
  text-align: center;
}

.forgot-link {
  font-size: 13px;
  color: var(--muted);
  text-align: center;
}

.forgot-link:hover {
  color: var(--fg);
}
</style>
