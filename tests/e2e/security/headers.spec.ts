import { expect, test } from '@playwright/test'

const representativeRoutes = [
  '/',
  '/login',
  '/pilot',
  '/dashboard',
  '/instructor',
  '/api/email',
]

test.describe('production security header contract', () => {
  test('representative routes enforce the approved CSP', async ({ request }) => {
    for (const route of representativeRoutes) {
      const response = await request.get(route, { maxRedirects: 0 })
      const policy = response.headers()['content-security-policy']

      expect(policy, `CSP missing on ${route}`).toBeTruthy()
      expect(policy).toContain("default-src 'self'")
      expect(policy).toContain("object-src 'none'")
      expect(policy).toContain("base-uri 'self'")
      expect(policy).toContain("form-action 'self'")
      expect(policy).toContain("frame-ancestors 'none'")
      expect(policy).not.toContain("'unsafe-eval'")
      expect(policy).not.toContain('localhost')
      expect(policy).not.toContain('127.0.0.1')
    }
  })

  test('representative routes expose one deliberate HSTS contract', async ({ request }) => {
    for (const route of representativeRoutes) {
      const response = await request.get(route, { maxRedirects: 0 })
      expect(response.headers()['strict-transport-security'], `HSTS mismatch on ${route}`).toBe(
        'max-age=31536000'
      )
    }
  })

  test('companion headers and pilot GET protection remain active', async ({ request }) => {
    const homepage = await request.get('/')
    const headers = homepage.headers()

    expect(headers['x-content-type-options']).toBe('nosniff')
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin')
    expect(headers['permissions-policy']).toContain('camera=()')
    expect(headers['x-frame-options']).toBe('DENY')

    const getMutationAttempt = await request.get(
      '/api/email?formType=pilot&email=must-not-mutate%40example.com'
    )
    expect(getMutationAttempt.status()).toBe(405)
    expect(getMutationAttempt.headers()['allow']).toBe('POST')
  })
})
