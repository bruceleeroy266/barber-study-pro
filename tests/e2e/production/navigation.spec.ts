import { test, expect } from '@playwright/test'

type Role = 'admin' | 'instructor' | 'student'
const roles: { role: Role; route: string; control: string }[] = [
  { role: 'admin', route: '/admin', control: 'admin-mobile-navigation' },
  { role: 'instructor', route: '/instructor', control: 'instructor-mobile-navigation' },
  { role: 'student', route: '/dashboard', control: 'student-mobile-navigation' },
]
const widths = [320, 360, 390]
const stateKeys: Record<Role, string> = {
  admin: 'ASCYN_PROD_ADMIN_STATE',
  instructor: 'ASCYN_PROD_INSTRUCTOR_STATE',
  student: 'ASCYN_PROD_STUDENT_STATE',
}

for (const { role, route, control } of roles) {
  for (const width of widths) {
    test(`${role} navigation at ${width}px`, async ({ browser }) => {
      const state = process.env[stateKeys[role]]
      test.skip(!state, `Missing authorized ${role} browser state`)
      let parsed: unknown
      try {
        parsed = JSON.parse(Buffer.from(state!, 'base64').toString('utf8'))
      } catch {
        throw new Error(`Invalid authorized browser state for ${role}`)
      }

      const context = await browser.newContext({
        viewport: { width, height: 780 },
        storageState: parsed as NonNullable<Parameters<typeof browser.newContext>[0]>['storageState'],
        serviceWorkers: 'block',
      })
      const page = await context.newPage()
      try {
        await page.goto(route, { waitUntil: 'domcontentloaded' })
        await expect(page).toHaveURL(new RegExp(`^https://ascynpro\\.com${route.replace(/\\//g, '\\/')}(?:[/?#]|$)`))
        await expect.poll(() => page.evaluate(() => window.innerWidth)).toBe(width)
        const trigger = page.locator(`button[aria-controls="${control}"]`)
        await expect(trigger).toHaveCount(1)
        await expect(trigger).toBeVisible()
        await expect(trigger).toBeEnabled()
        await expect(trigger).toHaveAttribute('aria-expanded', 'false')
        const box = await trigger.boundingBox()
        expect(box).toBeTruthy()
        expect(box!.x).toBeGreaterThanOrEqual(0)
        expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1)
        await trigger.click()
        await expect(trigger).toHaveAttribute('aria-expanded', 'true')
        const dialog = page.locator(`#${control}`)
        await expect(dialog).toBeVisible()
        await expect(dialog).toHaveAttribute('aria-modal', 'true')
        await expect.poll(() => page.evaluate(id => !!document.activeElement?.closest(`#${id}`), control)).toBe(true)
        const focusable = dialog.locator('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
        expect(await focusable.count()).toBeGreaterThan(1)
        await focusable.last().focus()
        await page.keyboard.press('Tab')
        await expect(focusable.first()).toBeFocused()
        await page.keyboard.press('Shift+Tab')
        await expect(focusable.last()).toBeFocused()
        await page.keyboard.press('Escape')
        await expect(dialog).toHaveCount(0)
        await expect(trigger).toHaveAttribute('aria-expanded', 'false')
        await expect(trigger).toBeFocused()
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
        expect(overflow, `horizontal overflow in ${role} at ${width}px`).toBeLessThanOrEqual(1)
        if (role === 'student') {
          const clearance = await page.evaluate(() => {
            const header = document.querySelector('button[aria-controls="student-mobile-navigation"]')?.closest('.fixed')?.getBoundingClientRect()
            const main = document.querySelector('main')?.getBoundingClientRect()
            return { headerBottom: header?.bottom ?? null, mainTop: main?.top ?? null }
          })
          expect(clearance.headerBottom).not.toBeNull()
          expect(clearance.mainTop).not.toBeNull()
          expect(clearance.mainTop!).toBeGreaterThanOrEqual(clearance.headerBottom! - 1)
        }
      } finally {
        await context.close()
      }
    })
  }
}
