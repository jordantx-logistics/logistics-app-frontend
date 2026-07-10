import { ref } from 'vue'
import type { ToastMessage } from '@/core/types'

const toasts = ref<ToastMessage[]>([])

export function useToast() {
  function showToast(message: Omit<ToastMessage, 'id'>) {
    const id = Date.now().toString()
    const toast: ToastMessage = { id, ...message }
    toasts.value = [...toasts.value, toast]
    const duration = toast.duration ?? 3000
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id)
    }, duration)
  }

  function success(title: string, msg?: string) {
    showToast({ type: 'success', title, message: msg })
  }

  function error(title: string, msg?: string) {
    showToast({ type: 'error', title, message: msg })
  }

  function warning(title: string, msg?: string) {
    showToast({ type: 'warning', title, message: msg })
  }

  function info(title: string, msg?: string) {
    showToast({ type: 'info', title, message: msg })
  }

  return { toasts, showToast, success, error, warning, info }
}
