import { chromium, expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/?skipIntro=1')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await expect(page.locator('.office-ready-panel')).toBeVisible()
})

test('order customer sampai laporan dan kembali ke kantor', async ({
  page,
}) => {
  await page.locator('.office-ready-button').click()
  await expect(page.locator('.order-board-overlay')).toBeVisible()

  await page.locator('.order-choice:not([disabled])').first().click()
  await expect(page.locator('.order-overlay')).toBeVisible()
  await page.getByRole('button', { name: /Terima order/ }).click()

  await expect(page.locator('.loadout-overlay')).toBeVisible()
  await page.locator('.loadout-option').filter({ hasText: 'Charger' }).click()
  await page
    .locator('.loadout-option')
    .filter({ hasText: 'Token listrik' })
    .click()
  await page.getByRole('button', { name: /Mulai misi/ }).click()

  const source = page.locator(
    '.react-flow__node[data-id="pc-a"] .device-port-out',
  )
  const target = page.locator(
    '.react-flow__node[data-id="pc-b"] .device-port-in',
  )
  await expect(source).toBeVisible()
  const sourceBox = await source.boundingBox()
  const targetBox = await target.boundingBox()
  if (!sourceBox || !targetBox) throw new Error('Port tidak ditemukan')

  await page.mouse.move(
    sourceBox.x + sourceBox.width / 2,
    sourceBox.y + sourceBox.height / 2,
  )
  await page.mouse.down()
  await page.mouse.move(
    targetBox.x + targetBox.width / 2,
    targetBox.y + targetBox.height / 2,
    { steps: 16 },
  )
  await page.mouse.up()

  await expect(page.locator('.mission-report')).toBeVisible()
  await page.locator('.return-office-button').click()
  await expect(page.locator('.office-ready-panel')).toBeVisible()
})

test('modal order bisa ditutup dengan Escape', async ({ page }) => {
  await page.locator('.office-ready-button').click()
  await expect(page.locator('.order-board-overlay')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.locator('.order-board-overlay')).toBeHidden()
})

test('fallback 2D tampil saat WebGL dimatikan', async () => {
  const fallbackBrowser = await chromium.launch({
    args: ['--disable-webgl', '--disable-webgl2'],
  })
  const page = await fallbackBrowser.newPage()
  await page.goto('http://127.0.0.1:4173/?skipIntro=1')
  await expect(page.locator('.office-fallback')).toBeVisible()
  await fallbackBrowser.close()
})
