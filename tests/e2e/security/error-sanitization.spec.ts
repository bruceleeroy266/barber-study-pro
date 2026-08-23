import { expect, test } from '@playwright/test'

test('invalid login remains useful without exposing client-visible diagnostics', async ({ page }) => {
  const consoleOutput: string[] = []
  page.on('console', (message) => consoleOutput.push(message.text()))

  await page.goto('/login')
  await page.getByLabel(/email address/i).fill('wave1-invalid-login@invalid.test')
  await page.getByLabel(/^password$/i).fill('DefinitelyNotAValidCredential!')
  await page.getByRole('button', { name: /sign in/i }).click()

  await expect(page.getByText('Invalid email or password. Please try again.')).toBeVisible()

  const visibleOutput = consoleOutput.join('\n')
  expect(visibleOutput).not.toContain('AuthApiError')
  expect(visibleOutput).not.toContain('at async')
  expect(visibleOutput).not.toContain('/_next/static/chunks/')
  expect(visibleOutput).not.toContain('wave1-invalid-login@invalid.test')
})
