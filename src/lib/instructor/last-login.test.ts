/**
 * @vitest-environment node
 *
 * Tests for the server-side instructor "Last Login" signal.
 *
 * Proves:
 *   - auth.users.last_sign_in_at is fetched via the service-role client only
 *     (server-side; Auth admin API never reaches the browser).
 *   - The signal degrades gracefully: unconfigured service role or failed
 *     lookups yield an absent signal, never a crash.
 *   - Lookups are scoped to exactly the requested (already school-verified)
 *     student IDs.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('server-only', () => ({}))
vi.mock('@/lib/supabase-service-role', () => ({
  createServiceRoleClient: vi.fn(),
}))

import { createServiceRoleClient } from '@/lib/supabase-service-role'
import { getLastSignInAtMap } from './last-login'

function mockServiceClient(getUserById: (id: string) => Promise<unknown>) {
  vi.mocked(createServiceRoleClient).mockReturnValue({
    auth: { admin: { getUserById: vi.fn(getUserById) } },
  } as unknown as ReturnType<typeof createServiceRoleClient>)
}

describe('getLastSignInAtMap', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns an empty map for empty input without touching the service role', async () => {
    const result = await getLastSignInAtMap([])
    expect(result).toEqual({})
    expect(createServiceRoleClient).not.toHaveBeenCalled()
  })

  it('returns an empty map (and warns) when the service role is not configured', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.mocked(createServiceRoleClient).mockImplementation(() => {
      throw new Error('Service role client is not configured')
    })

    const result = await getLastSignInAtMap(['user-1'])

    expect(result).toEqual({})
    expect(warnSpy).toHaveBeenCalledOnce()
  })

  it('maps each requested student to their last_sign_in_at (null when never signed in)', async () => {
    mockServiceClient(async (id: string) => {
      if (id === 'user-1') {
        return { data: { user: { id, last_sign_in_at: '2026-09-08T15:00:00.000Z' } }, error: null }
      }
      return { data: { user: { id, last_sign_in_at: null } }, error: null }
    })

    const result = await getLastSignInAtMap(['user-1', 'user-2'])

    expect(result).toEqual({
      'user-1': '2026-09-08T15:00:00.000Z',
      'user-2': null,
    })
  })

  it('queries exactly the requested student IDs, deduplicated', async () => {
    const getUserById = vi.fn(async (id: string) => ({
      data: { user: { id, last_sign_in_at: '2026-09-01T00:00:00.000Z' } },
      error: null,
    }))
    mockServiceClient(getUserById)

    await getLastSignInAtMap(['user-1', 'user-1', 'user-2'])

    expect(getUserById).toHaveBeenCalledTimes(2)
    expect(getUserById).toHaveBeenCalledWith('user-1')
    expect(getUserById).toHaveBeenCalledWith('user-2')
  })

  it('marks a student null (never throws) when an individual lookup fails', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    mockServiceClient(async (id: string) => {
      if (id === 'user-bad') {
        return { data: { user: null }, error: { message: 'User not found' } }
      }
      return { data: { user: { id, last_sign_in_at: '2026-09-05T10:00:00.000Z' } }, error: null }
    })

    const result = await getLastSignInAtMap(['user-ok', 'user-bad'])

    expect(result['user-ok']).toBe('2026-09-05T10:00:00.000Z')
    expect(result['user-bad']).toBeNull()
  })

  it('marks a student null (never throws) when the admin API throws unexpectedly', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    mockServiceClient(async (id: string) => {
      if (id === 'user-boom') throw new Error('network failure')
      return { data: { user: { id, last_sign_in_at: '2026-09-05T10:00:00.000Z' } }, error: null }
    })

    const result = await getLastSignInAtMap(['user-ok', 'user-boom'])

    expect(result['user-ok']).toBe('2026-09-05T10:00:00.000Z')
    expect(result['user-boom']).toBeNull()
  })
})
