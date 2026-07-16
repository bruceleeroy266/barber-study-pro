/**
 * @vitest-environment node
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('server-only', () => ({}))
vi.mock('@/lib/supabase-service-role', () => ({
  createServiceRoleClient: vi.fn(),
}))

import { createServiceRoleClient } from '@/lib/supabase-service-role'
import {
  buildSecurityEvent,
  logSecurityEvent,
  isValidUuid,
  isValidSecurityEventType,
  isValidSecurityEventResult,
} from './audit-logger'

const insertMock = vi.fn().mockResolvedValue({ error: null })
const fromMock = vi.fn(() => ({ insert: insertMock }))

beforeEach(() => {
  vi.clearAllMocks()
  insertMock.mockResolvedValue({ error: null })
  vi.mocked(createServiceRoleClient).mockReturnValue({ from: fromMock } as unknown as ReturnType<typeof createServiceRoleClient>)
})

describe('isValidUuid', () => {
  it('accepts lowercase and uppercase UUIDs', () => {
    expect(isValidUuid('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11')).toBe(true)
    expect(isValidUuid('A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11')).toBe(true)
  })

  it('rejects non-UUIDs', () => {
    expect(isValidUuid('not-a-uuid')).toBe(false)
    expect(isValidUuid('')).toBe(false)
    expect(isValidUuid(null)).toBe(false)
    expect(isValidUuid(123)).toBe(false)
  })
})

describe('isValidSecurityEventType', () => {
  it('accepts known types', () => {
    expect(isValidSecurityEventType('failed_login')).toBe(true)
    expect(isValidSecurityEventType('logout')).toBe(true)
  })

  it('rejects unknown types', () => {
    expect(isValidSecurityEventType('hax')).toBe(false)
    expect(isValidSecurityEventType('')).toBe(false)
  })
})

describe('isValidSecurityEventResult', () => {
  it('accepts known results', () => {
    expect(isValidSecurityEventResult('success')).toBe(true)
    expect(isValidSecurityEventResult('failure')).toBe(true)
  })

  it('rejects unknown results', () => {
    expect(isValidSecurityEventResult('pending')).toBe(false)
  })
})

describe('buildSecurityEvent', () => {
  it('builds an event with a valid UUID', () => {
    const userId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
    const event = buildSecurityEvent('logout', 'success', 'User signed out', {
      userId,
      email: 'Test@Example.COM',
      action: 'signOut',
    })

    expect(event.type).toBe('logout')
    expect(event.result).toBe('success')
    expect(event.userId).toBe(userId)
    expect(event.email).toBe('test@example.com')
    expect(event.action).toBe('signOut')
    expect(event.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/)
  })

  it('preserves user_id as null for failed-login events', () => {
    const event = buildSecurityEvent('failed_login', 'failure', 'Invalid credentials', {
      email: 'attacker@example.com',
      resource: '/login',
      action: 'signInWithPassword',
    })

    expect(event.userId).toBeNull()
    expect(event.email).toBe('attacker@example.com')
    expect(event.result).toBe('failure')
  })

  it('rejects an invalid userId', () => {
    expect(() =>
      buildSecurityEvent('logout', 'success', 'x', { userId: 'not-a-uuid' })
    ).toThrow(/must be a UUID/)
  })

  it('rejects an invalid schoolId', () => {
    expect(() =>
      buildSecurityEvent('logout', 'success', 'x', { schoolId: 'bad' })
    ).toThrow(/must be a UUID/)
  })

  it('rejects an invalid type', () => {
    expect(() => buildSecurityEvent('bad_type' as never, 'success', 'x')).toThrow(/Invalid security event type/)
  })

  it('rejects an invalid result', () => {
    expect(() => buildSecurityEvent('logout', 'bad_result' as never, 'x')).toThrow(/Invalid security event result/)
  })

  it('rejects an unsafe action', () => {
    expect(() =>
      buildSecurityEvent('logout', 'success', 'x', { action: '<script>' })
    ).toThrow(/Invalid security event action/)
  })

  it('rejects oversized metadata', () => {
    const huge = 'x'.repeat(40000)
    expect(() =>
      buildSecurityEvent('logout', 'success', 'x', { metadata: { note: huge } })
    ).toThrow(/metadata exceeds maximum size/)
  })

  it('rejects too many metadata keys', () => {
    const metadata: Record<string, number> = {}
    for (let i = 0; i < 101; i += 1) {
      metadata[`key-${i}`] = i
    }
    expect(() =>
      buildSecurityEvent('logout', 'success', 'x', { metadata })
    ).toThrow(/metadata exceeds maximum key count/)
  })

  it('caps and normalizes email', () => {
    const event = buildSecurityEvent('failed_login', 'failure', 'x', {
      email: '  USER@EXAMPLE.COM  ',
    })
    expect(event.email).toBe('user@example.com')
  })

  it('uses only the first x-forwarded-for address', () => {
    const request = new Request('https://example.com/login', {
      headers: { 'x-forwarded-for': '  203.0.113.1 , 10.0.0.1 ', 'user-agent': 'TestBot/1.0' },
    })
    const event = buildSecurityEvent('failed_login', 'failure', 'x', { request })
    expect(event.ip).toBe('203.0.113.1')
    expect(event.userAgent).toBe('TestBot/1.0')
  })
})

describe('logSecurityEvent', () => {
  it('persists an authenticated event with a valid UUID', async () => {
    const userId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
    await logSecurityEvent('logout', 'success', 'User signed out', { userId })

    expect(createServiceRoleClient).toHaveBeenCalledTimes(1)
    expect(fromMock).toHaveBeenCalledWith('security_logs')
    expect(insertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'logout',
        result: 'success',
        user_id: userId,
      })
    )
  })

  it('persists a failed-login event with user_id = null', async () => {
    await logSecurityEvent('failed_login', 'failure', 'Bad password', {
      email: 'hacker@example.com',
      resource: '/login',
      action: 'signInWithPassword',
    })

    expect(insertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'failed_login',
        result: 'failure',
        user_id: null,
        email: 'hacker@example.com',
        resource: '/login',
        action: 'signInWithPassword',
      })
    )
  })

  it('does not call insert for invalid input', async () => {
    await logSecurityEvent('logout', 'success', 'x', { userId: 'bad' })
    expect(insertMock).not.toHaveBeenCalled()
  })

  it('does not break the calling auth flow when persistence fails', async () => {
    insertMock.mockRejectedValueOnce(new Error('database unavailable'))

    await expect(
      logSecurityEvent('failed_login', 'failure', 'Bad password', {
        email: 'test@example.com',
      })
    ).resolves.toBeUndefined()

    expect(insertMock).toHaveBeenCalledTimes(1)
  })
})
