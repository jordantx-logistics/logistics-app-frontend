import { useRouter } from 'vue-router'
import { useAuthStore } from '@/core/stores/auth'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()

  function requireAuth() {
    if (!authStore.isAuthenticated) {
      router.push({ name: 'login' })
    }
  }

  function requireNotAuth() {
    if (authStore.isAuthenticated) {
      router.push('/dashboard')
    }
  }

  async function logout() {
    authStore.logout()
    router.push({ name: 'login' })
  }

  return {
    authStore,
    user: authStore.user,
    isAuthenticated: authStore.isAuthenticated,
    login: authStore.login,
    requireAuth,
    requireNotAuth,
    logout,
  }
}
