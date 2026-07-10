import { useThemeStore } from '@/core/stores/theme'

export function useTheme() {
  const themeStore = useThemeStore()

  function setTheme(t: 'light' | 'dark') {
    themeStore.theme = t
    document.documentElement.setAttribute('data-theme', t)
  }

  return { themeStore, setTheme }
}
