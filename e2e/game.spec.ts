import { expect, test } from '@playwright/test'

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

test('dialog customer mencatat briefing sebelum berangkat', async ({ page }) => {
  await expect(page.locator('.office-room')).toBeVisible()
  await page.locator('.office-actor-customer').click()
  await expect(page.locator('.office-dialogue')).toBeVisible()

  await page
    .locator('.office-dialogue')
    .getByRole('button', { name: 'Dengarkan keluhan' })
    .click()
  await expect(page.locator('.office-briefing-note')).toContainText(
    'dengarkan keluhan pelanggan',
  )

  await page
    .locator('.office-dialogue')
    .getByRole('button', { name: 'Buka papan order' })
    .click()
  await expect(page.locator('.order-board-overlay')).toBeVisible()
})

test('kantor 2D memakai sprite pixel tanpa kanvas 3D', async ({ page }) => {
  await expect(page.locator('.office-room-art')).toBeVisible()
  await expect(page.locator('.office-room .pixel-sprite')).toHaveCount(4)
  await expect(page.locator('.office-room canvas')).toHaveCount(0)
})

test('jurnal kantor mengikuti progres misi', async ({ page }) => {
  await page.evaluate(() => {
    localStorage.setItem(
      'netforge.profile.v1',
      JSON.stringify({
        money: 500,
        xp: 300,
        reputation: 35,
        day: 4,
        levels: {
          'first-cable': {
            bestScore: 95,
            stars: 3,
            completions: 1,
          },
          'tiny-switch': {
            bestScore: 92,
            stars: 3,
            completions: 1,
          },
        },
        upgrades: {
          toolbox: false,
          cableTray: true,
          ups: false,
        },
      }),
    )
  })
  await page.reload()

  await expect(page.locator('.office-room-top small')).toHaveText(
    'Kantor yang lebih tenang',
  )
  await expect(page.locator('.office-room-briefing p')).toContainText(
    'Kantor Pak Hasan berhenti berteriak',
  )
  await expect(page.locator('.office-room')).toHaveAttribute('data-tier', '2')
})
