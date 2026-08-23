import { describe, expect, it } from 'vitest'
import { buildContentSecurityPolicy, SECURITY_HEADERS } from '../../../next.config'

describe('production security header contract', () => {
  it('uses a restrictive production CSP with only the configured Supabase origin', () => {
    const policy = buildContentSecurityPolicy({
      NODE_ENV: 'production',
      NEXT_PUBLIC_SUPABASE_URL: 'https://project-ref.supabase.co/path',
    })

    expect(policy).toContain("default-src 'self'")
    expect(policy).toContain("object-src 'none'")
    expect(policy).toContain("base-uri 'self'")
    expect(policy).toContain("form-action 'self'")
    expect(policy).toContain("frame-ancestors 'none'")
    expect(policy).toContain('frame-src \'none\'')
    expect(policy).toContain('https://project-ref.supabase.co')
    expect(policy).toContain('wss://project-ref.supabase.co')
    expect(policy).toContain('upgrade-insecure-requests')
    expect(policy).not.toContain("'unsafe-eval'")
    expect(policy).not.toContain('localhost')
    expect(policy).not.toContain('127.0.0.1')
    expect(policy).not.toContain('https://*.supabase.co')
  })

  it('does not permit optional analytics or development origins in production', () => {
    const disabled = buildContentSecurityPolicy({ NODE_ENV: 'production' })
    expect(disabled).not.toContain('googletagmanager.com')
    expect(disabled).not.toContain('clarity.ms')
    expect(disabled).not.toContain('va.vercel-scripts.com')
    expect(disabled).not.toContain('vitals.vercel-insights.com')

    const enabled = buildContentSecurityPolicy({
      NODE_ENV: 'production',
      NEXT_PUBLIC_GA_MEASUREMENT_ID: 'G-TEST',
      NEXT_PUBLIC_CLARITY_PROJECT_ID: 'clarity-test',
    })
    expect(enabled).toContain('https://www.googletagmanager.com')
    expect(enabled).toContain('https://www.clarity.ms')

    const development = buildContentSecurityPolicy({ NODE_ENV: 'development' })
    expect(development).toContain('https://va.vercel-scripts.com')
    expect(development).toContain('https://vitals.vercel-insights.com')
  })

  it('sets deliberate HSTS and companion header values once', () => {
    const byKey = new Map(SECURITY_HEADERS.map((header) => [header.key, header.value]))

    expect(byKey.get('Strict-Transport-Security')).toBe('max-age=31536000')
    expect(byKey.get('Content-Security-Policy')).toBeTruthy()
    expect(byKey.get('X-Content-Type-Options')).toBe('nosniff')
    expect(byKey.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin')
    expect(byKey.get('Permissions-Policy')).toContain('camera=()')
    expect(SECURITY_HEADERS.filter((header) => header.key === 'Strict-Transport-Security')).toHaveLength(1)
    expect(SECURITY_HEADERS.filter((header) => header.key === 'Content-Security-Policy')).toHaveLength(1)
  })
})
