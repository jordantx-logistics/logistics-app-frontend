import process from 'node:process'
import { defineConfig, devices } from '@playwright/test'

/**
 * E2E de los flujos por actor contra el backend real, en el stack aislado de
 * `logistics-app-backend/scripts/e2e-up.sh` (http://localhost:8100). Comparten datos
 * y corren en orden: la orden que registra el counter la cobra el cajero.
 */
export default defineConfig({
  testDir: './e2e/flows',
  timeout: 60 * 1000,
  expect: { timeout: 15 * 1000 },
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  fullyParallel: false,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:5199',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    ...devices['Desktop Chrome'],
  },
  webServer: {
    command: 'pnpm exec vite --port 5199 --strictPort',
    port: 5199,
    reuseExistingServer: false,
    env: { VITE_API_URL: 'http://localhost:8100' },
  },
})
