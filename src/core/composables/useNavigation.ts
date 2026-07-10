import { useThemeStore } from '@/core/stores/theme'
import { useAuthStore } from '@/core/stores/auth'

export function useNavigation() {
  const themeStore = useThemeStore()
  const authStore = useAuthStore()

  function navigateTo(path: string) {
    if (window.innerWidth < 768) {
      document.querySelector('.sidebar')?.classList.remove('mobile-open')
    }
    window.scrollTo(0, 0)
    setTimeout(() => {
      const el = document.querySelector(`[data-route="${path}"]`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
  }

  return { navigateTo, themeStore, authStore }
}
