/**
 * @vitest-environment node
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const USER_ID = '33333333-3333-4333-8333-333333333333'
const SCHOOL_ID = '11111111-1111-4111-8111-111111111111'
const EMAIL = 'student@example.test'

function setup(status: 'pending' | 'accepted' | 'expired' | 'revoked' = 'pending', linkedUserId: string | null = USER_ID) {
  vi.doMock('@/lib/supabase-server', () => ({
    createClient: vi.fn().mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: USER_ID, email: EMAIL } },
          error: null,
        }),
      },
    }),
  }))

  const updateEqStatus = vi.fn().mockResolvedValue({ data: null, error: null })
  const updateEqId = vi.fn().mockReturnValue({ eq: updateEqStatus })
  const update = vi.fn().mockReturnValue({ eq: updateEqId })

  const serviceClient = {
    from: vi.fn((table: string) => {
      if (table === 'profiles') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { id: USER_ID, email: EMAIL, role: 'student', school_id: SCHOOL_ID },
                error: null,
              }),
            }),
          }),
        }
      }

      if (table === 'school_onboarding_invitations') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  maybeSingle: vi.fn().mockResolvedValue({
                    data: { id: 'invite-1', status, auth_user_id: linkedUserId },
                    error: null,
                  }),
                }),
              }),
            }),
          }),
          update,
        }
      }

      throw new Error(`Unexpected table: ${table}`)
    }),
  }

  vi.doMock('@/lib/supabase-service-role', () => ({
    createServiceRoleClient: vi.fn().mockReturnValue(serviceClient),
  }))

  return { update, updateEqId, updateEqStatus }
}

describe('markCurrentInvitationAccepted', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    vi.doUnmock('@/lib/supabase-server')
    vi.doUnmock('@/lib/supabase-service-role')
    vi.restoreAllMocks()
  })

  it('marks a pending invitation accepted for the authenticated matching user', async () => {
    const { update, updateEqStatus } = setup('pending')
    const { markCurrentInvitationAccepted } = await import('./invitation-actions')

    const result = await markCurrentInvitationAccepted()

    expect(result).toEqual({ success: true, tracked: true })
    expect(update).toHaveBeenCalledWith(expect.objectContaining({
      auth_user_id: USER_ID,
      status: 'accepted',
      accepted_at: expect.any(String),
    }))
    expect(updateEqStatus).toHaveBeenCalledWith('status', 'pending')
  })

  it('is idempotent when the invitation is already accepted', async () => {
    const { update } = setup('accepted')
    const { markCurrentInvitationAccepted } = await import('./invitation-actions')

    const result = await markCurrentInvitationAccepted()

    expect(result).toEqual({ success: true, tracked: true })
    expect(update).not.toHaveBeenCalled()
  })

  it('rejects an expired invitation', async () => {
    const { update } = setup('expired')
    const { markCurrentInvitationAccepted } = await import('./invitation-actions')

    const result = await markCurrentInvitationAccepted()

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/expired/i)
    expect(update).not.toHaveBeenCalled()
  })

  it('rejects a lifecycle row linked to a different auth user', async () => {
    const { update } = setup('pending', '44444444-4444-4444-8444-444444444444')
    const { markCurrentInvitationAccepted } = await import('./invitation-actions')

    const result = await markCurrentInvitationAccepted()

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/different account/i)
    expect(update).not.toHaveBeenCalled()
  })
})
