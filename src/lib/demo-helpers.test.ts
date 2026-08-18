import { describe, it, expect, vi, afterEach } from 'vitest'
import { isLocalSupabaseUrl, isDemoDataAllowed, isExplicitDemoMode } from './demo-helpers'

describe('isLocalSupabaseUrl', () => {
  it.each([
    'http://127.0.0.1:54321',
    'http://127.0.0.1:55321',
    'http://localhost:54321',
    'http://localhost:55321',
    'http://[::1]:54321',
    'http://[::1]:55321',
    'http://127.0.0.1:80',
    'http://localhost:3000',
  ])('accepts %s', (url) => {
    expect(isLocalSupabaseUrl(url)).toBe(true)
  })

  it.each([
    'https://127.0.0.1:54321',
    'https://localhost:54321',
    'http://127.0.0.1.example.com:54321',
    'http://localhost.example.com:54321',
    'http://127.0.0.1:***@evil.com',
    'http://user:pass@127.0.0.1:55321',
    'http://127.0.0.1:99999',
    'http://localhost:abc',
    'http://192.168.1.1:54321',
    'http://10.0.0.1:54321',
    'http://example.supabase.co',
    'http://your-project.supabase.co',
    'http://fake.localhost:54321',
    'http://localhost.local:54321',
    '',
  ])('rejects %s', (url) => {
    expect(isLocalSupabaseUrl(url)).toBe(false)
  })
})

describe('isDemoDataAllowed — Phase 6B-1 R-3 production safeguard', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns true in development with demo mode enabled', () => {
    vi.stubEnv('NODE_ENV', 'development')
    vi.stubEnv('NEXT_PUBLIC_DEMO_MODE', 'true')
    expect(isDemoDataAllowed()).toBe(true)
  })

  it('returns false in development with demo mode disabled', () => {
    vi.stubEnv('NODE_ENV', 'development')
    vi.stubEnv('NEXT_PUBLIC_DEMO_MODE', 'false')
    expect(isDemoDataAllowed()).toBe(false)
  })

  it('returns false in development with demo mode unset', () => {
    vi.stubEnv('NODE_ENV', 'development')
    vi.stubEnv('NEXT_PUBLIC_DEMO_MODE', '')
    expect(isDemoDataAllowed()).toBe(false)
  })

  it('returns false in production even when demo mode is explicitly enabled', () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('NEXT_PUBLIC_DEMO_MODE', 'true')
    expect(isDemoDataAllowed()).toBe(false)
  })

  it('returns false in production with demo mode disabled', () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('NEXT_PUBLIC_DEMO_MODE', 'false')
    expect(isDemoDataAllowed()).toBe(false)
  })

  it('returns false in production with demo mode unset', () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('NEXT_PUBLIC_DEMO_MODE', '')
    expect(isDemoDataAllowed()).toBe(false)
  })

  it('returns true in test environment with demo mode enabled (test is not production)', () => {
    vi.stubEnv('NODE_ENV', 'test')
    vi.stubEnv('NEXT_PUBLIC_DEMO_MODE', 'true')
    // Test environment is not production, so demo data is allowed when demo mode is on
    expect(isDemoDataAllowed()).toBe(true)
  })

  it('isExplicitDemoMode still returns true when NEXT_PUBLIC_DEMO_MODE is true regardless of NODE_ENV', () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('NEXT_PUBLIC_DEMO_MODE', 'true')
    expect(isExplicitDemoMode()).toBe(true)
    // But isDemoDataAllowed must still block it
    expect(isDemoDataAllowed()).toBe(false)
  })
})
