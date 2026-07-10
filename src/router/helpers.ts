import type { Component } from 'vue'

// Lazy load component using Vue 3 code-splitting
export function lazy(loader: () => Promise<{ default: Component }>) {
  return () => ({
    component: loader(),
    loading: () => null,
    error: () => null,
    delay: 0,
  })
}
