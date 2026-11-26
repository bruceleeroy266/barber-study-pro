/**
 * 02D: direct API requests must not use server service-role credentials
 * for disabled or unapproved existing sessions. In-process tests validate
 * every chapter evidence entrypoint before any input/persistence calls.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const mock = vi.hoisted(() => ({
  createClient: vi.fn(),
  createServiceRoleClient: vi.fn(),
}))
vi.mock('@/lib/supabase-server', () => ({ createClient: mock.createClient }))
vi.mock('@/lib/supabase-service-role', () => ({ createServiceRoleClient: mock.createServiceRoleClient }))

function session(profile: Record<string, unknown> | null) {
  const chain: Record<string, unknown> = {}
  chain.select = vi.fn(() => chain)
  chain.eq = vi.fn(() => chain)
  chain.maybeSingle = vi.fn().mockResolvedValue({ data: profile, error: null })
  return {
    auth: { getUser: vi.fn().mockResolvedValue({
      data: { user: { id: '02d-student' } }, error: null,
    }) },
    from: vi.fn(() => chain),
  }
}

const current = {
  role: 'student', approval_status: 'approved', is_disabled: false,
  requires_password_change: false, school_id: '02d-school',
}

const paths = [
  '../chapter-19/micro-check/route',
  '../chapter-20/micro-check/route',
  '../chapter-21/micro-check/route',
  '../chapter-19/activity-evidence/route',
  '../chapter-20/activity-evidence/route',
  '../chapter-21/activity-evidence/route',
] as const

describe('SEC-02D privileged academic API status boundary', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it.each([
    ['disabled', { ...current, is_disabled: true }],
    ['unapproved', { ...current, approval_status: 'pending' }],
    ['wrong role', { ...current, role: 'instructor' }],
    ['no school', { ...current, school_id: null }],
  ])('%s existing session is denied before service-role access on all six chapter endpoints', async (_name, profile) => {
    mock.createClient.mockResolvedValue(session(profile))
    for (const path of paths) {
      const route = await import(path)
      const response = await route.POST(new NextRequest('http://localhost/api/chapter-19/micro-check', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ questionId: 'irrelevant', selectedAnswer: 'a' }),
      }))
      expect(response.status, path).toBe(403)
      expect(mock.createServiceRoleClient, path).not.toHaveBeenCalled()
    }
  })

  it('enabled, approved student proceeds past the identity gate', async () => {
    mock.createClient.mockResolvedValue(session(current))
    const route = await import('../chapter-19/micro-check/route')
    const response = await route.POST(new NextRequest('http://localhost/api/chapter-19/micro-check', {
      method: 'POST', body: JSON.stringify({ questionId: 'unknown', selectedAnswer: 'a' }),
    }))
    expect(response.status).toBe(404) // content validation, not auth rejection
    expect(mock.createServiceRoleClient).not.toHaveBeenCalled()
  })
})
