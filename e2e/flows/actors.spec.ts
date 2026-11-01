import { expect, test, type Page } from '@playwright/test'

import { login } from './support'

/**
 * Los seis flujos por actor sobre una misma orden: la registra el counter, la cobra
 * el cajero, la embarca el supervisor y Atención le abre una incidencia y una nota de
 * crédito. Admin y analista cierran con configuración y reportes.
 */
test.describe.configure({ mode: 'serial' })

let orderId = ''
let ticketCode = ''
let total = ''
let paymentId = ''

async function pickCustomer(page: Page, search: string, name: string): Promise<void> {
  await page.getByPlaceholder('Name or document number').fill(search)
  await page.getByRole('button', { name: 'Search' }).click()
  await page.getByRole('button', { name: new RegExp(name) }).click()
  await page.getByRole('button', { name: 'Continue' }).click()
}

async function selectAgencyByCode(page: Page, label: string, code: string): Promise<void> {
  const select = page.getByRole('combobox', { name: label })
  await expect(select.locator('option', { hasText: code })).toHaveCount(1)
  await select.selectOption({ label: await select.locator('option', { hasText: code }).innerText() })
}

test('counter: alta guiada de una orden con precio del motor', async ({ page }) => {
  await login(page, 'counter')
  await page.goto('/orders')
  await page.getByRole('button', { name: 'New order' }).click()

  await pickCustomer(page, '70000001', 'E2E Sender')
  await pickCustomer(page, '70000002', 'E2E Receiver')

  await selectAgencyByCode(page, 'Origin agency', 'E2E-A')
  await selectAgencyByCode(page, 'Destination agency', 'E2E-B')
  await page.getByPlaceholder('5', { exact: true }).fill('4')
  await page.getByRole('button', { name: 'Continue' }).click()

  // 5.00 de base + 4 kg × 2.50: lo calcula la tarifa sembrada, no el navegador.
  await expect(page.getByTestId('quote-total')).toHaveText('S/ 15')

  await page.getByRole('button', { name: 'Register order' }).click()

  await expect(page).toHaveURL(/\/orders\/\d+$/)
  await expect(page.getByTestId('order-status')).toHaveText('pending')

  orderId = page.url().split('/').pop() ?? ''
  ticketCode = (await page.getByTestId('ticket-code').innerText()).trim()
  total = '15'

  // El counter no confirma ni anula: esas acciones no se le ofrecen.
  await expect(page.getByRole('button', { name: 'Confirm' })).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Cancel order' })).toHaveCount(0)
})

test('cajero: abre caja, cobra la orden y cierra cuadrado', async ({ page }) => {
  await login(page, 'cashier')

  await page.goto('/finance/cash')
  await page.getByRole('button', { name: 'Open session' }).first().click()
  await page.getByPlaceholder('0.00').fill('100')
  await page.locator('form').getByRole('button', { name: 'Open session' }).click()
  await expect(page.getByRole('button', { name: 'Close session' })).toBeVisible()

  await page.goto('/finance/payments')
  await page.getByRole('button', { name: 'Register payment' }).first().click()
  await page.getByPlaceholder('42').fill(orderId)
  await page.getByPlaceholder('25.90').fill(total)
  const registered = page.waitForResponse(
    (response) =>
      response.url().endsWith('/finance/payments') && response.request().method() === 'POST',
  )
  await page.locator('form').getByRole('button', { name: 'Register payment' }).click()
  const response = await registered
  expect(response.status()).toBe(201)
  paymentId = String(((await response.json()) as { data: { id: number } }).data.id)

  await page.goto('/finance/payments')
  await expect(page.getByRole('row').filter({ hasText: `#${orderId}` }).first()).toBeVisible()

  await page.goto('/finance/cash')
  await page.getByRole('button', { name: 'Close session' }).first().click()
  await page.getByPlaceholder('0.00').fill(String(100 + Number(total)))
  await page.locator('form').getByRole('button', { name: 'Close session' }).click()
  await expect(page.getByRole('button', { name: 'Open session' })).toBeVisible()
})

test('supervisor: confirma, recibe y embarca', async ({ page }) => {
  await login(page, 'agency-supervisor')

  await page.goto(`/orders/${orderId}`)
  await page.getByRole('button', { name: 'Confirm' }).click()
  await expect(page.getByTestId('order-status')).toHaveText('confirmed')

  // El envío lo proyecta el outbox: se espera a que exista antes de recibirlo.
  await expect(async () => {
    await page.goto('/operations/shipments')
    await page.getByPlaceholder('A7F3Q8X4').fill(ticketCode)
    await page.getByRole('button', { name: 'Apply' }).click()
    await expect(page.getByRole('cell', { name: ticketCode, exact: true })).toBeVisible({ timeout: 2000 })
  }).toPass({ timeout: 30_000 })

  await page.goto('/operations/reception')
  await page.locator('form select').first().selectOption({ index: 1 })
  await page.getByPlaceholder(/A7F3Q8X4/).fill(ticketCode)
  await page.locator('form').getByRole('button', { name: /receiv|reception/i }).click()
  await expect(page.getByText('Reception registered')).toBeVisible()

  await page.goto('/operations/embarks')
  await page.getByRole('button', { name: 'New manifest' }).click()
  await page.locator('form select').first().selectOption({ index: 1 })
  await page.getByPlaceholder('12', { exact: true }).fill('1')
  await page.getByPlaceholder('48', { exact: true }).fill('1')
  await page.getByPlaceholder(/A7F3Q8X4/).fill(ticketCode)
  await page.getByRole('button', { name: 'Create manifest' }).click()
  await expect(page.getByRole('button', { name: 'Create manifest' })).toHaveCount(0)

  // `shipment.embarked` mueve la orden: lo procesa el outbox, en segundo plano.
  await expect(async () => {
    await page.goto(`/orders/${orderId}`)
    await expect(page.getByTestId('order-status')).toHaveText('in_transit', { timeout: 2000 })
  }).toPass({ timeout: 45_000 })
})

test('atención: consulta por ticket, atiende una incidencia y emite una nota de crédito', async ({
  page,
}) => {
  await login(page, 'customer-service')

  await page.goto('/orders')
  await page.getByPlaceholder('AB12CD34').fill(ticketCode)
  await page.getByRole('button', { name: 'Find' }).click()
  await expect(page).toHaveURL(new RegExp(`/orders/${orderId}$`))

  await expect(page.getByTestId('ticket-code')).toHaveText(ticketCode)
  await page.getByRole('main').getByRole('link', { name: 'Incidents' }).click()
  await page.getByRole('button', { name: 'New incident' }).click()
  await page.getByPlaceholder('What happened').fill('Box arrived crushed')
  await page.getByRole('button', { name: 'Open incident' }).click()

  const row = page.getByRole('row').filter({ hasText: ticketCode })
  await expect(row).toBeVisible()
  await row.getByRole('button', { name: 'Attend' }).click()

  await page.getByRole('combobox', { name: 'Responsible' }).selectOption({ label: 'E2E Customer-service' })
  await page.getByRole('button', { name: 'Assign', exact: true }).click()
  await page.getByRole('button', { name: 'Start' }).click()
  await page.getByPlaceholder('What was done').fill('Replacement sent')
  await page.getByRole('button', { name: 'Resolve' }).click()
  await page.getByRole('button', { name: 'Close', exact: true }).last().click()
  await page.keyboard.press('Escape')
  await expect(row.getByText('Closed')).toBeVisible()

  // El comprobante se emite en segundo plano: se reintenta hasta que esté aceptado.
  await page.goto('/finance/credit-notes')
  await page.getByRole('button', { name: 'Issue credit note' }).first().click()
  await page.getByPlaceholder('42').fill(paymentId)
  await page.getByPlaceholder('25.90').fill('1')

  await expect(async () => {
    await page.locator('form').getByRole('button', { name: 'Issue credit note' }).click()
    await expect(page.getByText('Credit note issued')).toBeVisible({ timeout: 3000 })
  }).toPass({ timeout: 45_000 })

  await expect(page.getByRole('row').filter({ hasText: `#${paymentId}` }).first()).toBeVisible()
})

test('admin: crea un tarifario y cambia un parámetro', async ({ page }) => {
  await login(page, 'admin')

  await page.goto('/tariffs')
  await page.getByRole('button', { name: 'New tariff' }).click()
  await page.getByPlaceholder('LIM-NOR-2026').fill('E2E-FLOW')
  await page.getByPlaceholder('Lima to the north').fill('E2E flow')
  // Otro servicio: el nacional estándar ya está vigente y el backend rechaza solapes.
  await page.getByRole('combobox', { name: 'Service' }).selectOption('express')
  await page.getByPlaceholder('5', { exact: true }).fill('6')
  await page.getByPlaceholder('2.5').fill('3')
  await page.getByPlaceholder('10', { exact: true }).fill('6')
  await page.getByPlaceholder('100', { exact: true }).fill('50')
  await page.locator('form').getByRole('button', { name: 'Save' }).click()
  await expect(page.getByRole('row').filter({ hasText: 'E2E-FLOW' })).toBeVisible()

  await page.goto('/settings')
  await page.getByRole('button', { name: 'Parameters' }).click()
  const limit = page.getByLabel('Per diem limit per route (PEN)')
  await limit.fill('650')
  await page.getByRole('button', { name: 'Save changes' }).click()
  await expect(page.getByText('Settings saved')).toBeVisible()
  await page.reload()
  await page.getByRole('button', { name: 'Parameters' }).click()
  await expect(page.getByLabel('Per diem limit per route (PEN)')).toHaveValue('650.00')
})

test('analista: solo lectura y exportación descargable', async ({ page }) => {
  await login(page, 'analyst')

  await page.goto('/orders')
  await expect(page.getByRole('button', { name: 'New order' })).toHaveCount(0)

  await page.goto('/reports')
  await expect(page.getByRole('combobox', { name: 'Report' })).toHaveValue(/.+/)
  await page.getByRole('combobox', { name: 'Report' }).selectOption('orders')
  await page.getByRole('button', { name: 'Generate report' }).click()

  const row = page.getByRole('row').filter({ hasText: 'Orders by agency and status' }).first()
  await expect(row.getByText('ready')).toBeVisible({ timeout: 30_000 })

  const download = page.waitForEvent('download')
  await row.getByRole('button', { name: 'Download' }).click()
  expect((await download).suggestedFilename()).toMatch(/^orders-\d+\.csv$/)
})
