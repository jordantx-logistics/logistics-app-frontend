import { expect, type Page } from '@playwright/test'

/** Contraseña de prueba de `E2eSeeder`: solo existe en el stack aislado. */
const PASSWORD = 'E2e-Password-2026!'

export type Role =
  | 'admin'
  | 'agency-supervisor'
  | 'counter'
  | 'cashier'
  | 'customer-service'
  | 'analyst'

export const WEB_ROLES: Role[] = [
  'admin',
  'agency-supervisor',
  'counter',
  'cashier',
  'customer-service',
  'analyst',
]

export async function login(page: Page, role: Role): Promise<void> {
  await page.goto('/auth/login')
  await page.getByPlaceholder('you@example.com').fill(`e2e.${role}@logistics.test`)
  await page.getByPlaceholder('••••••••').fill(PASSWORD)
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page).toHaveURL(/\/dashboard/)
}

/** Enlaces del menú lateral: lo que el rol ve, sin depender de una lista escrita aquí. */
export async function sidebarPaths(page: Page): Promise<string[]> {
  const links = page.locator('.sidebar-nav a[data-route]')
  await expect(links.first()).toBeVisible()

  const paths = await links.evaluateAll((items) =>
    items.map((item) => item.getAttribute('href') ?? ''),
  )

  return paths.filter((path) => path !== '')
}

/**
 * Registra los 403 del API. `settled` espera a que no quede ninguna petición en curso:
 * sin eso, cambiar de pantalla cancelaría la petición antes de ver su respuesta y un
 * 403 pasaría inadvertido.
 */
export function trackForbidden(page: Page): {
  forbidden: string[]
  settled: () => Promise<void>
} {
  const forbidden: string[] = []
  let inFlight = 0
  let lastActivity = Date.now()

  const isApi = (url: string): boolean => url.includes('/api/')

  page.on('request', (request) => {
    if (isApi(request.url())) {
      inFlight += 1
      lastActivity = Date.now()
    }
  })

  const finished = (url: string): void => {
    if (isApi(url)) {
      inFlight -= 1
      lastActivity = Date.now()
    }
  }

  page.on('requestfinished', (request) => finished(request.url()))
  page.on('requestfailed', (request) => finished(request.url()))
  page.on('response', (response) => {
    if (response.status() === 403 && isApi(response.url())) {
      forbidden.push(`${response.request().method()} ${response.url()}`)
    }
  })

  return {
    forbidden,
    settled: () =>
      expect(() => {
        expect(inFlight).toBe(0)
        expect(Date.now() - lastActivity).toBeGreaterThan(500)
      }).toPass({ timeout: 20_000 }),
  }
}
