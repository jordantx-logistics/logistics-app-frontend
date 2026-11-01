import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      // Criterio 8 de la Fase 7: la lógica (stores, composables, capa API y utilidades).
      // Las pantallas se comprueban con los E2E de flujos.
      coverage: {
        include: [
          'src/**/stores/**',
          'src/**/composables/**',
          'src/**/api/**',
          'src/core/utils/**',
        ],
        exclude: ['src/core/api/generated/**', '**/__tests__/**'],
        reporter: ['text-summary'],
        thresholds: { lines: 70 },
      },
    },
  }),
)
