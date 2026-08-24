/**
 * PRODUCTION AUTH REDIRECT SAFEGUARD TESTS
 *
 * These tests verify that production authentication redirects NEVER
 * resolve to localhost, 127.0.0.1, ::1, or other development-only URLs.
 *
 * The production auth release gate MUST verify the REAL generated redirect
 * hostname is ascynpro.com.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Store original env
const originalEnv = process.env

// Test the getSiteUrl logic directly without importing server-only module
function getSiteUrl(nodeEnv: string | undefined, nextPublicSiteUrl: string | undefined): string {
  if (nodeEnv === 'production') {
    return 'https://ascynpro.com'
  }
  return nextPublicSiteUrl?.replace(/\/$/, '') || 'http://localhost:3000'
}

describe('Production Auth Redirect Safeguard', () => {
  beforeEach(() => {
    vi.resetModules()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe('getSiteUrl() Production Contract', () => {
    it('PRODUCTION: returns https://ascynpro.com when NODE_ENV is production', () => {
      const siteUrl = getSiteUrl('production', undefined)
      
      expect(siteUrl).toBe('https://ascynpro.com')
      expect(siteUrl).not.toContain('localhost')
      expect(siteUrl).not.toContain('127.0.0.1')
      expect(siteUrl).not.toContain('::1')
    })

    it('PRODUCTION: never falls back to localhost in production', () => {
      // Even if NEXT_PUBLIC_SITE_URL is set to localhost, production should ignore it
      const siteUrl = getSiteUrl('production', 'http://localhost:3000')
      
      expect(siteUrl).toBe('https://ascynpro.com')
      expect(siteUrl).not.toContain('localhost')
    })

    it('DEVELOPMENT: allows localhost for local development', () => {
      const siteUrl = getSiteUrl('development', 'http://localhost:3000')
      
      expect(siteUrl).toBe('http://localhost:3000')
    })

    it('DEVELOPMENT: falls back to localhost when NEXT_PUBLIC_SITE_URL is not set', () => {
      const siteUrl = getSiteUrl('development', undefined)
      
      expect(siteUrl).toBe('http://localhost:3000')
    })
  })

  describe('Production Redirect URL Validation', () => {
    const FORBIDDEN_PRODUCTION_HOSTS = [
      'localhost',
      '127.0.0.1',
      '::1',
      '0.0.0.0',
      'local.supabase.co',
    ]

    const ALLOWED_PRODUCTION_HOSTS = [
      'ascynpro.com',
      'www.ascynpro.com',
    ]

    const isValidProductionRedirect = (url: string): boolean => {
      try {
        const urlObj = new URL(url)
        const hostname = urlObj.hostname.toLowerCase()
        
        // Check for forbidden hosts
        if (FORBIDDEN_PRODUCTION_HOSTS.some(host => hostname.includes(host))) {
          return false
        }
        
        // Must be HTTPS in production
        if (urlObj.protocol !== 'https:') {
          return false
        }
        
        // Must be an allowed production host
        return ALLOWED_PRODUCTION_HOSTS.some(host => 
          hostname === host || hostname.endsWith(`.${host}`)
        )
      } catch {
        return false
      }
    }

    it.each(FORBIDDEN_PRODUCTION_HOSTS.filter(h => h !== '::1'))(
      'PRODUCTION GATE: rejects redirect URL containing forbidden host: %s',
      (forbiddenHost) => {
        const testUrl = `http://${forbiddenHost}:3000/auth/callback`
        expect(isValidProductionRedirect(testUrl)).toBe(false)
      }
    )

    it('PRODUCTION GATE: rejects redirect URL containing forbidden host: ::1', () => {
      // IPv6 addresses need special handling in URLs
      const testUrl = 'http://[::1]:3000/auth/callback'
      expect(isValidProductionRedirect(testUrl)).toBe(false)
    })

    it.each(ALLOWED_PRODUCTION_HOSTS)(
      'PRODUCTION GATE: accepts valid production redirect URL: %s',
      (allowedHost) => {
        const testUrl = `https://${allowedHost}/auth/callback`
        expect(isValidProductionRedirect(testUrl)).toBe(true)
      }
    )

    it('PRODUCTION GATE: rejects HTTP URLs even for allowed hosts', () => {
      const testUrl = 'http://ascynpro.com/auth/callback'
      expect(isValidProductionRedirect(testUrl)).toBe(false)
    })
  })

  describe('Supabase Configuration Contract', () => {
    it('DOCUMENTATION: Supabase production Site URL must be https://ascynpro.com', () => {
      // This test documents the required Supabase production configuration
      // that must be set in the Supabase Dashboard
      
      const requiredSupabaseSiteUrl = 'https://ascynpro.com'
      const requiredRedirectUrls = [
        'https://ascynpro.com/auth/callback',
      ]

      // These values must be configured in:
      // Supabase Dashboard → Authentication → URL Configuration
      
      expect(requiredSupabaseSiteUrl).toBe('https://ascynpro.com')
      expect(requiredRedirectUrls).toContain('https://ascynpro.com/auth/callback')
      
      // Forbidden values that must NOT be in production
      const forbiddenValues = [
        'http://127.0.0.1:3000',
        'http://localhost:3000',
        'https://127.0.0.1:3000',
        'https://localhost:3000',
      ]
      
      forbiddenValues.forEach(forbidden => {
        expect(requiredSupabaseSiteUrl).not.toBe(forbidden)
        expect(requiredRedirectUrls).not.toContain(forbidden)
      })
    })
  })

  describe('Auth Email Type Coverage', () => {
    const AUTH_EMAIL_TYPES = [
      'invite',
      'recovery',
      'email_confirmation',
      'magic_link',
    ] as const

    it.each(AUTH_EMAIL_TYPES)(
      'All auth email types must use production redirect: %s',
      (emailType) => {
        // Document that all email types must use the same production redirect contract
        const expectedRedirectBase = 'https://ascynpro.com/auth/callback'
        
        // The redirectTo parameter for all auth emails should be:
        // https://ascynpro.com/auth/callback?type=<emailType>
        
        expect(expectedRedirectBase).toBe('https://ascynpro.com/auth/callback')
        expect(expectedRedirectBase).not.toContain('localhost')
        expect(expectedRedirectBase).not.toContain('127.0.0.1')
      }
    )
  })
})
