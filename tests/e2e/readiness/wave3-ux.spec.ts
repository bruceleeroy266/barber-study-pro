import { expect, test, type Page } from '@playwright/test'

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }))
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1)
}

test.describe('Wave 3 UX corrections', () => {
  test('unauthenticated 404 preserves Sign In navigation', async ({ page }) => {
    await page.goto('/wave-3-missing-route')

    await expect(page.getByRole('heading', { name: '404' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Sign In' })).toHaveAttribute('href', '/login')
    await expect(page.getByRole('link', { name: 'Return to Dashboard' })).toHaveCount(0)
  })

  test('password toggle is keyboard operable, preserves value, and never submits', async ({ page }) => {
    let authAttempts = 0
    await page.route('**/auth/v1/token**', async (route) => {
      authAttempts += 1
      await route.abort()
    })
    await page.goto('/login', { waitUntil: 'networkidle' })
    const password = page.getByLabel('Password', { exact: true })
    const toggle = page.getByRole('button', { name: 'Show password' })

    await page.getByLabel('Email Address').fill('toggle-check@example.test')
    await expect(password).toHaveAttribute('type', 'password')
    await expect(password).toHaveAttribute('autocomplete', 'current-password')
    await password.fill('wave3-secret-value')
    await toggle.focus()
    await expect(toggle).toBeFocused()
    await page.keyboard.press('Enter')

    await expect(password).toHaveAttribute('type', 'text')
    await expect(password).toHaveValue('wave3-secret-value')
    const hideToggle = page.getByRole('button', { name: 'Hide password' })
    await expect(hideToggle).toHaveAttribute('aria-pressed', 'true')
    await expect(page).toHaveURL(/\/login$/)

    await page.keyboard.press('Enter')
    await expect(password).toHaveAttribute('type', 'password')
    await expect(password).toHaveValue('wave3-secret-value')
    await expect(page).toHaveURL(/\/login$/)
    expect(authAttempts).toBe(0)
  })

  for (const viewport of [
    { name: '390x844', width: 390, height: 844 },
    { name: '393x873', width: 393, height: 873 },
    { name: 'keyboard-proxy-390x430', width: 390, height: 430 },
    { name: 'desktop-1366x768', width: 1366, height: 768 },
    { name: 'desktop-1920x1080', width: 1920, height: 1080 },
  ]) {
    test(`login controls remain reachable at ${viewport.name}`, async ({ page }) => {
      const isKeyboardProxy = viewport.name.startsWith('keyboard-proxy')
      await page.setViewportSize({
        width: viewport.width,
        height: isKeyboardProxy ? 844 : viewport.height,
      })
      await page.goto('/login?error=not_approved')

      const email = page.getByLabel('Email Address')
      const password = page.getByLabel('Password', { exact: true })
      const toggle = page.getByRole('button', { name: 'Show password' })
      const submit = page.getByRole('button', { name: 'Sign In' })
      const error = page.locator('#login-error')

      if (isKeyboardProxy) {
        await password.focus()
        await expect(password).toBeFocused()
        await page.setViewportSize({ width: viewport.width, height: viewport.height })
      }

      for (const control of [error, email, password, toggle, submit]) {
        await control.scrollIntoViewIfNeeded()
        await expect(control).toBeVisible()
      }

      await expectNoHorizontalOverflow(page)

      if (viewport.height <= 430) {
        const scrollState = await page.evaluate(() => ({
          scrollHeight: document.documentElement.scrollHeight,
          clientHeight: document.documentElement.clientHeight,
        }))
        expect(scrollState.scrollHeight).toBeGreaterThan(scrollState.clientHeight)
      }
    })
  }
})
