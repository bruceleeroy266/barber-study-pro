/**
 * @vitest-environment node
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextResponse } from 'next/server'

const mocks = vi.hoisted(() => ({
  exchangeCodeForSession: vi.fn().mockResolvedValue({ error: null }),
  getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
  single: vi.fn().mockResolvedValue({ data: null, error: null }),
  eq: vi.fn(),
  select: vi.fn(),
  from: vi.fn(),
  createServerClient: vi.fn(),
  cookies: vi.fn().mockResolvedValue({
    getAll: vi.fn().mockReturnValue([]),
    set: vi.fn(),
  }),
}))

vi.mock('@supabase/ssr', () => ({
  createServerClient: mocks.createServerClient,
}))

vi.mock('next/headers', () => ({
  cookies: mocks.cookies,
}))

describe('auth callback route', () => {
  beforeEach(() => {
    vi.resetModules()

    mocks.exchangeCodeForSession.mockResolvedValue({ error: null })
    mocks.getUser.mockResolvedValue({ data: { user: null }, error: null })
    mocks.single.mockResolvedValue({ data: null, error: null })

    mocks.eq.mockReturnValue({ single: mocks.single })
    mocks.select.mockReturnValue({ eq: mocks.eq })
    mocks.from.mockReturnValue({ select: mocks.select })

    mocks.createServerClient.mockReturnValue({
      auth: {
        exchangeCodeForSession: mocks.exchangeCodeForSession,
        getUser: mocks.getUser,
      },
      from: mocks.from,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  async function getRouteHandler() {
    const mod = await import('./route')
    return mod.GET
  }

  function getRedirect(response: NextResponse): string {
    return response.headers.get('location') ?? ''
  }

  it('redirects recovery callbacks to the update-password page', async () => {
    const GET = await getRouteHandler()
    const request = new Request('https://ascynpro.com/auth/callback?code=abc&type=recovery')
    const response = await GET(request)
    expect(getRedirect(response)).toBe('https://ascynpro.com/auth/update-password')
  }, 10000)

  it('redirects invite callbacks to the set-password page', async () => {
    const GET = await getRouteHandler()
    const request = new Request('https://ascynpro.com/auth/callback?code=abc&type=invite')
    const response = await GET(request)
    expect(getRedirect(response)).toBe('https://ascynpro.com/auth/set-password')
  })

  it('redirects an instructor to /instructor after a successful callback', async () => {
    mocks.getUser.mockResolvedValue({ data: { user: { id: 'instructor-user' } }, error: null })
    mocks.single.mockResolvedValue({ data: { role: 'instructor' }, error: null })
    const GET = await getRouteHandler()
    const request = new Request('https://ascynpro.com/auth/callback?code=abc')
    const response = await GET(request)
    expect(getRedirect(response)).toBe('https://ascynpro.com/instructor')
  })

  it('redirects a student to /dashboard after a successful callback', async () => {
    mocks.getUser.mockResolvedValue({ data: { user: { id: 'student-user' } }, error: null })
    mocks.single.mockResolvedValue({ data: { role: 'student' }, error: null })
    const GET = await getRouteHandler()
    const request = new Request('https://ascynpro.com/auth/callback?code=abc')
    const response = await GET(request)
    expect(getRedirect(response)).toBe('https://ascynpro.com/dashboard')
  })

  it('redirects an apprentice to /dashboard after a successful callback', async () => {
    mocks.getUser.mockResolvedValue({ data: { user: { id: 'apprentice-user' } }, error: null })
    mocks.single.mockResolvedValue({ data: { role: 'apprentice' }, error: null })
    const GET = await getRouteHandler()
    const request = new Request('https://ascynpro.com/auth/callback?code=abc')
    const response = await GET(request)
    expect(getRedirect(response)).toBe('https://ascynpro.com/dashboard')
  })

  it('falls back to the safe next param for allowed internal paths', async () => {
    const GET = await getRouteHandler()
    const request = new Request('https://ascynpro.com/auth/callback?code=abc&next=/dashboard/profile')
    const response = await GET(request)
    expect(getRedirect(response)).toBe('https://ascynpro.com/dashboard/profile')
  })

  it('ignores external open-redirect attempts in the next param', async () => {
    mocks.getUser.mockResolvedValue({ data: { user: { id: 'student-user' } }, error: null })
    mocks.single.mockResolvedValue({ data: { role: 'student' }, error: null })
    const GET = await getRouteHandler()
    const request = new Request('https://ascynpro.com/auth/callback?code=abc&next=https://evil.com/')
    const response = await GET(request)
    expect(getRedirect(response)).not.toContain('evil.com')
    expect(getRedirect(response)).toBe('https://ascynpro.com/dashboard')
  })

  it('ignores protocol-relative open-redirect attempts in the next param', async () => {
    mocks.getUser.mockResolvedValue({ data: { user: { id: 'student-user' } }, error: null })
    mocks.single.mockResolvedValue({ data: { role: 'student' }, error: null })
    const GET = await getRouteHandler()
    const request = new Request('https://ascynpro.com/auth/callback?code=abc&next=//evil.com/')
    const response = await GET(request)
    expect(getRedirect(response)).not.toContain('evil.com')
  })

  it('redirects to the auth-code-error page when code exchange fails', async () => {
    mocks.exchangeCodeForSession.mockResolvedValue({ error: { message: 'Invalid code' } })
    const GET = await getRouteHandler()
    const request = new Request('https://ascynpro.com/auth/callback?code=badcode')
    const response = await GET(request)
    expect(getRedirect(response)).toBe('https://ascynpro.com/auth/auth-code-error')
  })

  it('redirects to the auth-code-error page when no code is provided', async () => {
    const GET = await getRouteHandler()
    const request = new Request('https://ascynpro.com/auth/callback')
    const response = await GET(request)
    expect(getRedirect(response)).toBe('https://ascynpro.com/auth/auth-code-error')
  })
})
