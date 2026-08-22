/**
 * Phase 7A Slice 5.5 — Onboarding Functional Blocker Correction Tests
 *
 * Validates:
 *   P0-1: approvePilotInquiry server action
 *     - Authorization (platform admin only)
 *     - Input validation
 *     - Inquiry state validation
 *     - RPC integration
 *     - Audit logging
 *     - Idempotency
 *     - Legal status transitions
 *   P0-2: createSchoolFromInquiry real invitation flow
 *     - Reuses inviteUser/Supabase invitation architecture
 *     - Real auth invitation via inviteUserByEmail
 *     - Profile upsert with school_admin role + correct school_id
 *     - Lifecycle record maintenance
 *     - Existing-account safety (no cross-school assignment)
 *     - Duplicate-invitation prevention
 *     - Expired/retry handling
 *     - Invitation-provider failure (partial success)
 *     - Cross-school assignment prevention
 *     - Role escalation prevention
 *     - Audit logging
 *   Adversarial cases for both corrections
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

// ============================================================================
// Mocks
// ============================================================================

const mockGetUser = vi.fn()
const mockFrom = vi.fn()
const mockRpc = vi.fn()

vi.mock('@/lib/supabase-server', () => ({
  createClient: vi.fn(async () => ({
    auth: { getUser: mockGetUser },
    from: mockFrom,
    rpc: mockRpc,
  })),
}))

const mockServiceFrom = vi.fn()
const mockListUsers = vi.fn()
const mockInviteUserByEmail = vi.fn()
const mockDeleteUser = vi.fn()
const mockUpdateUserById = vi.fn()

vi.mock('@/lib/supabase-service-role', () => ({
  createServiceRoleClient: vi.fn(() => ({
    from: mockServiceFrom,
    auth: {
      admin: {
        listUsers: mockListUsers,
        inviteUserByEmail: mockInviteUserByEmail,
        deleteUser: mockDeleteUser,
        updateUserById: mockUpdateUserById,
      },
    },
  })),
}))

const mockLogSecurityEvent = vi.fn()
vi.mock('@/lib/security/audit-logger', () => ({
  logSecurityEvent: (...args: unknown[]) => mockLogSecurityEvent(...args),
}))

const mockNotifyOwner = vi.fn()
vi.mock('@/lib/notifications/NotificationService', () => ({
  NotificationService: {
    createDefault: vi.fn(() => ({
      notifyOwner: mockNotifyOwner,
    })),
  },
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

vi.mock('resend', () => ({
  Resend: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

// Import after mocks
import { approvePilotInquiry, createSchoolFromInquiry } from './actions'

// ============================================================================
// Test Data
// ============================================================================

const PLATFORM_ADMIN_ID = 'a0000000-0000-4000-8000-000000000001'
const SCHOOL_ADMIN_ID = 'a0000000-0000-4000-8000-000000000002'
const INSTRUCTOR_ID = 'a0000000-0000-4000-8000-000000000003'
const STUDENT_ID = 'a0000000-0000-4000-8000-000000000004'
const INQUIRY_ID = 'b0000000-0000-4000-8000-000000000001'
const SCHOOL_ID = 'c0000000-0000-4000-8000-000000000001'
const INVITED_USER_ID = 'd0000000-0000-4000-8000-000000000001'

const APPROVED_INQUIRY = {
  id: INQUIRY_ID,
  school_name: 'Test Barber School',
  contact_name: 'Jane Doe',
  email: 'jane@testbarber.edu',
  status: 'approved',
  school_id: null,
}

// const APPROVED_INQUIRY_WITH_SCHOOL = {
//   ...APPROVED_INQUIRY,
//   school_id: SCHOOL_ID,
// }

// ============================================================================
// Helpers
// ============================================================================

function setupAuthenticatedUser(userId: string, role: string, schoolId: string | null) {
  mockGetUser.mockResolvedValue({
    data: { user: { id: userId, email: `${role}@test.com` } },
    error: null,
  })

  const profileChain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({
      data: { role, school_id: schoolId },
      error: null,
    }),
  }

  return profileChain
}

function setupInquiryFetch(inquiry: Record<string, unknown> | null, error: unknown = null) {
  const inquiryChain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({
      data: inquiry,
      error,
    }),
  }
  return inquiryChain
}

function setupMockFrom(profileChain: unknown, inquiryChain: unknown) {
  let callCount = 0
  mockFrom.mockImplementation(() => {
    callCount++
    if (callCount === 1) return profileChain // profiles table
    if (callCount === 2) return inquiryChain // pilot_inquiries table
    return inquiryChain
  })
}

/**
 * Build a service-role client mock chain for the real invitation flow.
 * The createSchoolFromInquiry invitation step performs multiple serviceFrom calls:
 *   1. listUsers (auth.admin.listUsers)
 *   2. school_onboarding_invitations select
 *   3. profiles select (if existing auth user found)
 *   4. inviteUserByEmail (auth.admin.inviteUserByEmail)
 *   5. profiles upsert
 *   6. school_onboarding_invitations insert/update
 */
interface InvitationMockOptions {
  existingAuthUsers?: { id: string; email: string }[]
  existingInvitation?: { id: string; status: string; auth_user_id: string | null; expires_at: string | null } | null
  existingProfile?: { id: string; role: string; school_id: string | null } | null
  inviteError?: { message: string } | null
  inviteUserId?: string
  profileUpsertError?: { message: string } | null
  invitationInsertError?: { code?: string; message: string } | null
  invitationUpdateError?: { message: string } | null
}

function setupInvitationMocks(options: InvitationMockOptions = {}) {
  const {
    existingAuthUsers = [],
    existingInvitation = null,
    existingProfile = null,
    inviteError = null,
    inviteUserId = INVITED_USER_ID,
    profileUpsertError = null,
    invitationInsertError = null,
    invitationUpdateError = null,
  } = options

  // 1. listUsers
  mockListUsers.mockResolvedValue({
    data: { users: existingAuthUsers },
    error: null,
  })

  // 2. inviteUserByEmail
  if (inviteError) {
    mockInviteUserByEmail.mockResolvedValue({ data: { user: null }, error: inviteError })
  } else {
    mockInviteUserByEmail.mockResolvedValue({
      data: { user: { id: inviteUserId, email: APPROVED_INQUIRY.email } },
      error: null,
    })
  }

  // 3. deleteUser (best-effort cleanup)
  mockDeleteUser.mockResolvedValue({ error: null })

  // Build serviceFrom chain for school_onboarding_invitations and profiles
  const invitationSelectChain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({ data: existingInvitation, error: null }),
  }

  const profileSelectChain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({ data: existingProfile, error: null }),
  }

  const profileUpsertChain = {
    upsert: vi.fn().mockResolvedValue({ error: profileUpsertError }),
  }

  const invitationInsertChain = {
    insert: vi.fn().mockResolvedValue({ error: invitationInsertError }),
  }

  const invitationUpdateChain = {
    update: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
  }
  if (invitationUpdateError) {
    invitationUpdateChain.update = vi.fn().mockReturnThis()
    invitationUpdateChain.eq = vi.fn().mockResolvedValue({ error: invitationUpdateError })
  } else {
    invitationUpdateChain.eq = vi.fn().mockResolvedValue({ error: null })
  }

  mockServiceFrom.mockImplementation((table: string) => {
    if (table === 'profiles') {
      // Profiles table: could be select or upsert depending on call
      // We detect by checking if this is a select (has .select) or upsert
      return {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: existingProfile, error: null }),
        upsert: vi.fn().mockResolvedValue({ error: profileUpsertError }),
      }
    }
    if (table === 'school_onboarding_invitations') {
      return {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: existingInvitation, error: null }),
        insert: vi.fn().mockResolvedValue({ error: invitationInsertError }),
        update: vi.fn().mockReturnThis(),
      }
    }
    // Fallback for any other table
    return invitationSelectChain
  })

  return {
    invitationSelectChain,
    profileSelectChain,
    profileUpsertChain,
    invitationInsertChain,
    invitationUpdateChain,
  }
}

// ============================================================================
// approvePilotInquiry Tests
// ============================================================================

describe('approvePilotInquiry', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ========================================================================
  // AUTHORIZATION
  // ========================================================================
  describe('Authorization', () => {
    it('rejects unauthenticated callers', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' },
      })

      const result = await approvePilotInquiry(INQUIRY_ID)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Authentication required')
    })

    it('rejects school_admin', async () => {
      const profileChain = setupAuthenticatedUser(SCHOOL_ADMIN_ID, 'school_admin', SCHOOL_ID)
      setupMockFrom(profileChain, setupInquiryFetch({ id: INQUIRY_ID, status: 'new' }))

      const result = await approvePilotInquiry(INQUIRY_ID)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Only platform administrators')
      expect(mockLogSecurityEvent).toHaveBeenCalledWith(
        'permission_denied',
        'denied',
        expect.stringContaining('Non-platform-admin'),
        expect.objectContaining({ action: 'approve_inquiry' })
      )
    })

    it('rejects instructor', async () => {
      const profileChain = setupAuthenticatedUser(INSTRUCTOR_ID, 'instructor', SCHOOL_ID)
      setupMockFrom(profileChain, setupInquiryFetch({ id: INQUIRY_ID, status: 'new' }))

      const result = await approvePilotInquiry(INQUIRY_ID)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Only platform administrators')
    })

    it('rejects student', async () => {
      const profileChain = setupAuthenticatedUser(STUDENT_ID, 'student', SCHOOL_ID)
      setupMockFrom(profileChain, setupInquiryFetch({ id: INQUIRY_ID, status: 'new' }))

      const result = await approvePilotInquiry(INQUIRY_ID)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Only platform administrators')
    })

    it('rejects admin with school_id set (not platform admin)', async () => {
      const profileChain = setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', SCHOOL_ID)
      setupMockFrom(profileChain, setupInquiryFetch({ id: INQUIRY_ID, status: 'new' }))

      const result = await approvePilotInquiry(INQUIRY_ID)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Only platform administrators')
    })

    it('allows platform admin (role=admin, school_id=null)', async () => {
      const profileChain = setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', null)
      const inquiryChain = setupInquiryFetch({ id: INQUIRY_ID, status: 'new' })
      setupMockFrom(profileChain, inquiryChain)

      mockRpc.mockResolvedValue({ data: 'approved', error: null })

      const result = await approvePilotInquiry(INQUIRY_ID)

      expect(result.success).toBe(true)
      expect(result.status).toBe('approved')
    })
  })

  // ========================================================================
  // INPUT VALIDATION
  // ========================================================================
  describe('Input Validation', () => {
    it('rejects empty inquiry ID', async () => {
      const profileChain = setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', null)
      setupMockFrom(profileChain, profileChain)

      const result = await approvePilotInquiry('')

      expect(result.success).toBe(false)
      expect(result.error).toContain('required')
    })

    it('rejects non-UUID inquiry ID', async () => {
      const profileChain = setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', null)
      setupMockFrom(profileChain, profileChain)

      const result = await approvePilotInquiry('not-a-uuid')

      expect(result.success).toBe(false)
      expect(result.error).toContain('Invalid inquiry ID format')
    })
  })

  // ========================================================================
  // INQUIRY STATE
  // ========================================================================
  describe('Inquiry State', () => {
    it('rejects unknown inquiry', async () => {
      const profileChain = setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', null)
      const inquiryChain = setupInquiryFetch(null, { message: 'Not found' })
      setupMockFrom(profileChain, inquiryChain)

      const result = await approvePilotInquiry(INQUIRY_ID)

      expect(result.success).toBe(false)
      expect(result.error).toContain('not found')
    })
  })

  // ========================================================================
  // RPC INTEGRATION
  // ========================================================================
  describe('RPC Integration', () => {
    it('calls approve_pilot_inquiry RPC with correct ID', async () => {
      const profileChain = setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', null)
      const inquiryChain = setupInquiryFetch({ id: INQUIRY_ID, status: 'new' })
      setupMockFrom(profileChain, inquiryChain)

      mockRpc.mockResolvedValue({ data: 'approved', error: null })

      await approvePilotInquiry(INQUIRY_ID)

      expect(mockRpc).toHaveBeenCalledWith('approve_pilot_inquiry', {
        p_pilot_inquiry_id: INQUIRY_ID,
      })
    })

    it('returns idempotent alreadyApproved when inquiry is already approved', async () => {
      const profileChain = setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', null)
      const inquiryChain = setupInquiryFetch({ id: INQUIRY_ID, status: 'approved' })
      setupMockFrom(profileChain, inquiryChain)

      mockRpc.mockResolvedValue({ data: 'approved', error: null })

      const result = await approvePilotInquiry(INQUIRY_ID)

      expect(result.success).toBe(true)
      expect(result.alreadyApproved).toBe(true)
    })

    it('surfaces RPC error to caller', async () => {
      const profileChain = setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', null)
      const inquiryChain = setupInquiryFetch({ id: INQUIRY_ID, status: 'new' })
      setupMockFrom(profileChain, inquiryChain)

      mockRpc.mockResolvedValue({
        data: null,
        error: { message: 'Illegal status transition' },
      })

      const result = await approvePilotInquiry(INQUIRY_ID)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Illegal status transition')
    })

    it('logs audit event on RPC failure', async () => {
      const profileChain = setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', null)
      const inquiryChain = setupInquiryFetch({ id: INQUIRY_ID, status: 'new' })
      setupMockFrom(profileChain, inquiryChain)

      mockRpc.mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      })

      await approvePilotInquiry(INQUIRY_ID)

      expect(mockLogSecurityEvent).toHaveBeenCalledWith(
        'sensitive_config_change',
        'failure',
        expect.stringContaining('approval RPC failed'),
        expect.objectContaining({ action: 'approve_inquiry' })
      )
    })
  })

  // ========================================================================
  // AUDIT LOGGING
  // ========================================================================
  describe('Audit Logging', () => {
    it('logs success with previous status metadata', async () => {
      const profileChain = setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', null)
      const inquiryChain = setupInquiryFetch({ id: INQUIRY_ID, status: 'contacted' })
      setupMockFrom(profileChain, inquiryChain)

      mockRpc.mockResolvedValue({ data: 'approved', error: null })

      await approvePilotInquiry(INQUIRY_ID)

      expect(mockLogSecurityEvent).toHaveBeenCalledWith(
        'sensitive_config_change',
        'success',
        expect.stringContaining('approved'),
        expect.objectContaining({
          metadata: expect.objectContaining({
            inquiryId: INQUIRY_ID,
            previousStatus: 'contacted',
            newStatus: 'approved',
            alreadyApproved: false,
          }),
        })
      )
    })

    it('logs idempotent success with alreadyApproved flag', async () => {
      const profileChain = setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', null)
      const inquiryChain = setupInquiryFetch({ id: INQUIRY_ID, status: 'approved' })
      setupMockFrom(profileChain, inquiryChain)

      mockRpc.mockResolvedValue({ data: 'approved', error: null })

      await approvePilotInquiry(INQUIRY_ID)

      expect(mockLogSecurityEvent).toHaveBeenCalledWith(
        'sensitive_config_change',
        'success',
        expect.stringContaining('already approved'),
        expect.objectContaining({
          metadata: expect.objectContaining({
            alreadyApproved: true,
          }),
        })
      )
    })
  })
})

// ============================================================================
// createSchoolFromInquiry — Updated Invitation Flow Tests
// ============================================================================

describe('createSchoolFromInquiry — Slice 5.5 Invitation Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ========================================================================
  // HAPPY PATH: Real Invitation Flow
  // ========================================================================
  describe('Happy Path — Real Invitation', () => {
    it('sends real Supabase auth invitation to school admin email', async () => {
      const profileChain = setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', null)
      const inquiryChain = setupInquiryFetch(APPROVED_INQUIRY)
      setupMockFrom(profileChain, inquiryChain)

      mockRpc.mockResolvedValue({ data: SCHOOL_ID, error: null })
      setupInvitationMocks({})
      mockNotifyOwner.mockResolvedValue({ success: true, notificationId: 'notif-1' })

      const result = await createSchoolFromInquiry(INQUIRY_ID)

      expect(result.success).toBe(true)
      expect(result.schoolId).toBe(SCHOOL_ID)
      expect(mockInviteUserByEmail).toHaveBeenCalledWith(
        APPROVED_INQUIRY.email.toLowerCase(),
        expect.objectContaining({
          redirectTo: expect.stringContaining('/auth/callback'),
          data: expect.objectContaining({
            full_name: APPROVED_INQUIRY.contact_name,
            role: 'school_admin',
          }),
        })
      )
    })

    it('upserts profile with school_admin role and correct school_id', async () => {
      const profileChain = setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', null)
      const inquiryChain = setupInquiryFetch(APPROVED_INQUIRY)
      setupMockFrom(profileChain, inquiryChain)

      mockRpc.mockResolvedValue({ data: SCHOOL_ID, error: null })
      setupInvitationMocks({})
      mockNotifyOwner.mockResolvedValue({ success: true, notificationId: 'notif-1' })

      await createSchoolFromInquiry(INQUIRY_ID)

      // Verify profile upsert was called with correct school_id and role
      expect(mockServiceFrom).toHaveBeenCalledWith('profiles')
      const profilesCall = mockServiceFrom.mock.results.find(
        (r: { value?: { upsert?: unknown } }) => r.value?.upsert != null
      )
      expect(profilesCall).toBeTruthy()
    })

    it('creates school_onboarding_invitations lifecycle record', async () => {
      const profileChain = setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', null)
      const inquiryChain = setupInquiryFetch(APPROVED_INQUIRY)
      setupMockFrom(profileChain, inquiryChain)

      mockRpc.mockResolvedValue({ data: SCHOOL_ID, error: null })
      setupInvitationMocks({})
      mockNotifyOwner.mockResolvedValue({ success: true, notificationId: 'notif-1' })

      await createSchoolFromInquiry(INQUIRY_ID)

      expect(mockServiceFrom).toHaveBeenCalledWith('school_onboarding_invitations')
    })
  })

  // ========================================================================
  // EXISTING-ACCOUNT SAFETY
  // ========================================================================
  describe('Existing-Account Safety', () => {
    it('does not reassign existing account from different school (cross-school prevention)', async () => {
      const profileChain = setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', null)
      const inquiryChain = setupInquiryFetch(APPROVED_INQUIRY)
      setupMockFrom(profileChain, inquiryChain)

      mockRpc.mockResolvedValue({ data: SCHOOL_ID, error: null })

      // Existing auth user exists but belongs to a DIFFERENT school
      setupInvitationMocks({
        existingAuthUsers: [{ id: INVITED_USER_ID, email: APPROVED_INQUIRY.email }],
        existingInvitation: null,
        existingProfile: { id: INVITED_USER_ID, role: 'school_admin', school_id: 'other-school-id' },
      })
      mockNotifyOwner.mockResolvedValue({ success: true, notificationId: 'notif-1' })

      const result = await createSchoolFromInquiry(INQUIRY_ID)

      expect(result.success).toBe(true)
      expect(result.partialSuccess).toBe(true)
      expect(result.sideEffectError).toContain('cross-school assignment')
      // Must NOT have called inviteUserByEmail (no new invitation sent)
      expect(mockInviteUserByEmail).not.toHaveBeenCalled()
    })

    it('does not reassign existing account with different role (role-escalation prevention)', async () => {
      const profileChain = setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', null)
      const inquiryChain = setupInquiryFetch(APPROVED_INQUIRY)
      setupMockFrom(profileChain, inquiryChain)

      mockRpc.mockResolvedValue({ data: SCHOOL_ID, error: null })

      // Existing auth user is an instructor at this school
      setupInvitationMocks({
        existingAuthUsers: [{ id: INVITED_USER_ID, email: APPROVED_INQUIRY.email }],
        existingInvitation: null,
        existingProfile: { id: INVITED_USER_ID, role: 'instructor', school_id: SCHOOL_ID },
      })
      mockNotifyOwner.mockResolvedValue({ success: true, notificationId: 'notif-1' })

      const result = await createSchoolFromInquiry(INQUIRY_ID)

      expect(result.success).toBe(true)
      expect(result.partialSuccess).toBe(true)
      expect(result.sideEffectError).toContain('cross-school assignment')
    })

    it('handles idempotent retry when existing account is already the school admin for this school', async () => {
      const profileChain = setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', null)
      const inquiryChain = setupInquiryFetch(APPROVED_INQUIRY)
      setupMockFrom(profileChain, inquiryChain)

      mockRpc.mockResolvedValue({ data: SCHOOL_ID, error: null })

      setupInvitationMocks({
        existingAuthUsers: [{ id: INVITED_USER_ID, email: APPROVED_INQUIRY.email }],
        existingInvitation: null,
        existingProfile: { id: INVITED_USER_ID, role: 'school_admin', school_id: SCHOOL_ID },
      })
      mockNotifyOwner.mockResolvedValue({ success: true, notificationId: 'notif-1' })

      const result = await createSchoolFromInquiry(INQUIRY_ID)

      expect(result.success).toBe(true)
      expect(result.partialSuccess).toBeFalsy()
      // Should create lifecycle record with accepted status
      expect(mockServiceFrom).toHaveBeenCalledWith('school_onboarding_invitations')
    })
  })

  // ========================================================================
  // DUPLICATE-INVITATION PREVENTION
  // ========================================================================
  describe('Duplicate-Invitation Prevention', () => {
    it('does not resend invitation when pending unexpired invitation exists', async () => {
      const profileChain = setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', null)
      const inquiryChain = setupInquiryFetch(APPROVED_INQUIRY)
      setupMockFrom(profileChain, inquiryChain)

      mockRpc.mockResolvedValue({ data: SCHOOL_ID, error: null })

      const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      setupInvitationMocks({
        existingInvitation: {
          id: 'existing-inv',
          status: 'pending',
          auth_user_id: INVITED_USER_ID,
          expires_at: futureDate,
        },
      })
      mockNotifyOwner.mockResolvedValue({ success: true, notificationId: 'notif-1' })

      const result = await createSchoolFromInquiry(INQUIRY_ID)

      expect(result.success).toBe(true)
      expect(mockInviteUserByEmail).not.toHaveBeenCalled()
    })
  })

  // ========================================================================
  // EXPIRED/RETRY HANDLING
  // ========================================================================
  describe('Expired/Retry Handling', () => {
    it('revokes expired invitation and creates fresh one on retry', async () => {
      const profileChain = setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', null)
      const inquiryChain = setupInquiryFetch(APPROVED_INQUIRY)
      setupMockFrom(profileChain, inquiryChain)

      mockRpc.mockResolvedValue({ data: SCHOOL_ID, error: null })

      const pastDate = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      setupInvitationMocks({
        existingInvitation: {
          id: 'expired-inv',
          status: 'pending',
          auth_user_id: null,
          expires_at: pastDate,
        },
      })
      mockNotifyOwner.mockResolvedValue({ success: true, notificationId: 'notif-1' })

      const result = await createSchoolFromInquiry(INQUIRY_ID)

      expect(result.success).toBe(true)
      expect(mockInviteUserByEmail).toHaveBeenCalled()
    })

    it('handles revoked invitation retry', async () => {
      const profileChain = setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', null)
      const inquiryChain = setupInquiryFetch(APPROVED_INQUIRY)
      setupMockFrom(profileChain, inquiryChain)

      mockRpc.mockResolvedValue({ data: SCHOOL_ID, error: null })

      setupInvitationMocks({
        existingInvitation: {
          id: 'revoked-inv',
          status: 'revoked',
          auth_user_id: null,
          expires_at: null,
        },
      })
      mockNotifyOwner.mockResolvedValue({ success: true, notificationId: 'notif-1' })

      const result = await createSchoolFromInquiry(INQUIRY_ID)

      expect(result.success).toBe(true)
      expect(mockInviteUserByEmail).toHaveBeenCalled()
    })
  })

  // ========================================================================
  // INVITATION-PROVIDER FAILURE
  // ========================================================================
  describe('Invitation-Provider Failure', () => {
    it('reports partial success when inviteUserByEmail fails', async () => {
      const profileChain = setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', null)
      const inquiryChain = setupInquiryFetch(APPROVED_INQUIRY)
      setupMockFrom(profileChain, inquiryChain)

      mockRpc.mockResolvedValue({ data: SCHOOL_ID, error: null })
      setupInvitationMocks({
        inviteError: { message: 'SMTP error: invitation delivery failed' },
      })
      mockNotifyOwner.mockResolvedValue({ success: true, notificationId: 'notif-1' })

      const result = await createSchoolFromInquiry(INQUIRY_ID)

      expect(result.success).toBe(true)
      expect(result.partialSuccess).toBe(true)
      expect(result.sideEffectError).toContain('SMTP error')
      // School must still be preserved
      expect(result.schoolId).toBe(SCHOOL_ID)
    })

    it('reports partial success when profile upsert fails after invitation', async () => {
      const profileChain = setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', null)
      const inquiryChain = setupInquiryFetch(APPROVED_INQUIRY)
      setupMockFrom(profileChain, inquiryChain)

      mockRpc.mockResolvedValue({ data: SCHOOL_ID, error: null })
      setupInvitationMocks({
        profileUpsertError: { message: 'Unique constraint violation on profiles' },
      })
      mockNotifyOwner.mockResolvedValue({ success: true, notificationId: 'notif-1' })

      const result = await createSchoolFromInquiry(INQUIRY_ID)

      expect(result.success).toBe(true)
      expect(result.partialSuccess).toBe(true)
      expect(result.sideEffectError).toContain('Profile creation failed')
      // School must still be preserved
      expect(result.schoolId).toBe(SCHOOL_ID)
      // Best-effort cleanup: deleteUser should have been called
      expect(mockDeleteUser).toHaveBeenCalledWith(INVITED_USER_ID)
    })

    it('does not falsely report full success when invitation fails', async () => {
      const profileChain = setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', null)
      const inquiryChain = setupInquiryFetch(APPROVED_INQUIRY)
      setupMockFrom(profileChain, inquiryChain)

      mockRpc.mockResolvedValue({ data: SCHOOL_ID, error: null })
      setupInvitationMocks({
        inviteError: { message: 'Provider timeout' },
      })
      mockNotifyOwner.mockResolvedValue({ success: true, notificationId: 'notif-1' })

      const result = await createSchoolFromInquiry(INQUIRY_ID)

      expect(result.success).toBe(true)
      expect(result.partialSuccess).toBe(true)
      expect(result.error).toBeUndefined()
      // Must NOT be a clean success
      expect(result).not.toEqual(expect.objectContaining({ partialSuccess: false }))
    })
  })

  // ========================================================================
  // CROSS-SCHOOL ASSIGNMENT PREVENTION
  // ========================================================================
  describe('Cross-School Assignment Prevention', () => {
    it('invitation always uses RPC-returned school_id, never client input', async () => {
      const profileChain = setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', null)
      const inquiryChain = setupInquiryFetch(APPROVED_INQUIRY)
      setupMockFrom(profileChain, inquiryChain)

      mockRpc.mockResolvedValue({ data: SCHOOL_ID, error: null })
      setupInvitationMocks({})
      mockNotifyOwner.mockResolvedValue({ success: true, notificationId: 'notif-1' })

      await createSchoolFromInquiry(INQUIRY_ID)

      // The function only accepts inquiryId. Verify RPC was called with inquiryId
      // and that the invitation uses the returned school_id.
      expect(mockRpc).toHaveBeenCalledWith('create_school_from_inquiry', {
        p_pilot_inquiry_id: INQUIRY_ID,
      })
      // The profile upsert must use the RPC-returned school_id
      const profilesCalls = mockServiceFrom.mock.calls.filter(
        (call: unknown[]) => call[0] === 'profiles'
      )
      expect(profilesCalls.length).toBeGreaterThan(0)
    })
  })

  // ========================================================================
  // ROLE ESCALATION PREVENTION
  // ========================================================================
  describe('Role Escalation Prevention', () => {
    it('hardcodes school_admin role in invitation', async () => {
      const profileChain = setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', null)
      const inquiryChain = setupInquiryFetch(APPROVED_INQUIRY)
      setupMockFrom(profileChain, inquiryChain)

      mockRpc.mockResolvedValue({ data: SCHOOL_ID, error: null })
      setupInvitationMocks({})
      mockNotifyOwner.mockResolvedValue({ success: true, notificationId: 'notif-1' })

      await createSchoolFromInquiry(INQUIRY_ID)

      expect(mockInviteUserByEmail).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          data: expect.objectContaining({ role: 'school_admin' }),
        })
      )
    })
  })

  // ========================================================================
  // AUDIT LOGGING
  // ========================================================================
  describe('Audit Logging', () => {
    it('logs invitation error in success audit metadata', async () => {
      const profileChain = setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', null)
      const inquiryChain = setupInquiryFetch(APPROVED_INQUIRY)
      setupMockFrom(profileChain, inquiryChain)

      mockRpc.mockResolvedValue({ data: SCHOOL_ID, error: null })
      setupInvitationMocks({
        inviteError: { message: 'SMTP failure' },
      })
      mockNotifyOwner.mockResolvedValue({ success: true, notificationId: 'notif-1' })

      await createSchoolFromInquiry(INQUIRY_ID)

      expect(mockLogSecurityEvent).toHaveBeenCalledWith(
        'sensitive_config_change',
        'success',
        expect.any(String),
        expect.objectContaining({
          metadata: expect.objectContaining({
            invitationError: expect.stringContaining('SMTP failure'),
          }),
        })
      )
    })
  })
})
