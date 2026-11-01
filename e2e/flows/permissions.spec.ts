import { expect, test } from '@playwright/test'

import { login, sidebarPaths, trackForbidden, WEB_ROLES } from './support'

/**
 * Criterio 2 de la Fase 7: ninguna pantalla ofrecida a un rol responde 403. Se
 * recorre lo que el menú de cada rol muestra, sin una lista escrita a mano.
 */
for (const role of WEB_ROLES) {
  test(`${role}: nada de lo que ve el menú responde 403`, async ({ page }) => {
    const { forbidden, settled } = trackForbidden(page)

    await login(page, role)
    const paths = await sidebarPaths(page)

    for (const path of ['/dashboard', ...paths]) {
      await page.goto(path)
      await settled()
      await expect(page).toHaveURL(new RegExp(path))
    }

    expect(forbidden).toEqual([])
  })
}

test('counter: no ve el menú de admin ni de reportes', async ({ page }) => {
  await login(page, 'counter')

  const paths = await sidebarPaths(page)

  for (const hidden of ['/reports', '/tariffs', '/zones', '/users', '/permissions', '/devices']) {
    expect(paths).not.toContain(hidden)
  }
})

test('cashier: una ruta sin permiso vuelve al dashboard', async ({ page }) => {
  await login(page, 'cashier')

  await page.goto('/reports')

  await expect(page).toHaveURL(/\/dashboard/)
})

test('analyst: el dashboard no ofrece atajos de escritura', async ({ page }) => {
  await login(page, 'analyst')

  await expect(page.getByRole('link', { name: 'New order' })).toHaveCount(0)
  await expect(page.getByRole('link', { name: 'Reports' }).first()).toBeVisible()
})
