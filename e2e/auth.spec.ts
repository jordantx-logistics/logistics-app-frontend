import { test, expect } from '@playwright/test'

// Sin sesión, la raíz entra por una ruta protegida y el guard manda al login.
// No hace falta el backend: `GET /auth/me` falla y se trata como "sin sesión".
test('sin sesión, la raíz lleva al login', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveURL(/\/auth\/login/)

  await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Forgot your password?' })).toBeVisible()
})
