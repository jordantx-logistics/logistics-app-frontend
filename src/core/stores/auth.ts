import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/core/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)

  function login(u: User, t: string) {
    user.value = u
    token.value = t
  }

  function logout() {
    user.value = null
    token.value = null
  }

  return { user, token, isAuthenticated, login, logout }
})
