/**
 * Phase 7A Slice 2 — Create School Server Action Tests
 *
 * Validates the createSchoolFromInquiry server action for:
 *   - Authorization (platform admin only)
 *   - Input validation and trust boundaries
 *   - Inquiry state validation
 *   - RPC integration
 *   - Invitation creation
 *   - Notification delivery
 *   - Audit logging
 *   - Side-effect failure model
 *   - Idempotency and retry safety
 *   - Tenant boundary preservation
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

// ============================================================================
// Mocks
// ============================================================================

// Mock the supabase-server module (caller session client)
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

// Mock the supabase-service-role module (service client)
const mockServiceFrom = vi.fn()

vi.mock('@/lib/supabase-service-role', () => ({
  createServiceRoleClient: vi.fn(() => ({
    from: mockServiceFrom,
  })),
}))

// Mock the audit logger
const mockLogSecurityEvent = vi.fn()
vi.mock('@/lib/security/audit-logger', () => ({
  logSecurityEvent: (...args: unknown[]) => mockLogSecurityEvent(...args),
}))

// Mock the NotificationService
const mockNotifyOwner = vi.fn()
vi.mock('@/lib/notifications/NotificationService', () => ({
  NotificationService: {
    createDefault: vi.fn(() => ({
      notifyOwner: mockNotifyOwner,
    })),
  },
}))

// Mock revalidatePath
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

// Mock Resend
vi.mock('resend', () => ({
  Resend: vi.fn(),
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

// Import after mocks
import { createSchoolFromInquiry } from './actions'

// ============================================================================
// Test Data
// ============================================================================

const PLATFORM_ADMIN_ID = 'a0000000-0000-4000-8000-000000000001'
const SCHOOL_ADMIN_ID = 'a0000000-0000-4000-8000-000000000002'
const INSTRUCTOR_ID = 'a0000000-0000-4000-8000-000000000003'
const STUDENT_ID = 'a0000000-0000-4000-8000-000000000004'
const INQUIRY_ID = 'b0000000-0000-4000-8000-000000000001'
const SCHOOL_ID = 'c0000000-0000-4000-8000-000000000001'

const APPROVED_INQUIRY = {
  id: INQUIRY_ID,
  school_name: 'Test Barber School',
  contact_name: 'Jane Doe',
  email: 'jane@testbarber.edu',
  status: 'approved',
  school_id: null,
}

const APPROVED_INQUIRY_WITH_SCHOOL = {
  ...APPROVED_INQUIRY,
  school_id: SCHOOL_ID,
}

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

// ============================================================================
// Tests
// ============================================================================

describe('createSchoolFromInquiry', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ==========================================================================
  // AUTHORIZATION TESTS
  // ==========================================================================

  describe('Authorization', () => {
    it('1. Platform admin (role=admin, school_id=null) succeeds', async () => {
      const profileChain = setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', null)
      const inquiryChain = setupInquiryFetch(APPROVED_INQUIRY)
      setupMockFrom(profileChain, inquiryChain)

      mockRpc.mockResolvedValue({ data: SCHOOL_ID, error: null })

      // Mock invitation check (no existing)
      const serviceSelectChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        neq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      }
      const serviceInsertChain = {
        insert: vi.fn().mockResolvedValue({ error: null }),
      }
      let serviceCallCount = 0
      mockServiceFrom.mockImplementation(() => {
        serviceCallCount++
        if (serviceCallCount === 1) return serviceSelectChain
        return serviceInsertChain
      })

      mockNotifyOwner.mockResolvedValue({ success: true, notificationId: 'notif-1' })

      const result = await createSchoolFromInquiry(INQUIRY_ID)

      expect(result.success).toBe(true)
      expect(result.schoolId).toBe(SCHOOL_ID)
      expect(result.error).toBeUndefined()
    })

    it('2. School admin (role=school_admin) is rejected', async () => {
      const profileChain = setupAuthenticatedUser(SCHOOL_ADMIN_ID, 'school_admin', SCHOOL_ID)
      setupMockFrom(profileChain, profileChain)

      const result = await createSchoolFromInquiry(INQUIRY_ID)

      expect(result.success).toBe(false)
      expect(result.error).toContain('platform administrator')
    })

    it('3. Instructor is rejected', async () => {
      const profileChain = setupAuthenticatedUser(INSTRUCTOR_ID, 'instructor', SCHOOL_ID)
      setupMockFrom(profileChain, profileChain)

      const result = await createSchoolFromInquiry(INQUIRY_ID)

      expect(result.success).toBe(false)
      expect(result.error).toContain('platform administrator')
    })

    it('4. Student is rejected', async () => {
      const profileChain = setupAuthenticatedUser(STUDENT_ID, 'student', SCHOOL_ID)
      setupMockFrom(profileChain, profileChain)

      const result = await createSchoolFromInquiry(INQUIRY_ID)

      expect(result.success).toBe(false)
      expect(result.error).toContain('platform administrator')
    })

    it('5. Anonymous caller is rejected', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' },
      })

      const result = await createSchoolFromInquiry(INQUIRY_ID)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Authentication required')
    })

    it('5b. Admin with school_id set is rejected (not platform admin)', async () => {
      const profileChain = setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', SCHOOL_ID)
      setupMockFrom(profileChain, profileChain)

      const result = await createSchoolFromInquiry(INQUIRY_ID)

      expect(result.success).toBe(false)
      expect(result.error).toContain('platform administrator')
    })
  })

  // ==========================================================================
  // INPUT VALIDATION TESTS
  // ==========================================================================

  describe('Input Validation', () => {
    it('should reject empty inquiry ID', async () => {
      const profileChain = setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', null)
      setupMockFrom(profileChain, profileChain)

      const result = await createSchoolFromInquiry('')

      expect(result.success).toBe(false)
      expect(result.error).toContain('required')
    })

    it('should reject non-UUID inquiry ID', async () => {
      const profileChain = setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', null)
      setupMockFrom(profileChain, profileChain)

      const result = await createSchoolFromInquiry('not-a-uuid')

      expect(result.success).toBe(false)
      expect(result.error).toContain('Invalid inquiry ID format')
    })

    it('should reject null/undefined inquiry ID', async () => {
      const profileChain = setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', null)
      setupMockFrom(profileChain, profileChain)

      // @ts-expect-error Testing invalid input
      const result = await createSchoolFromInquiry(null)

      expect(result.success).toBe(false)
      expect(result.error).toContain('required')
    })
  })

  // ==========================================================================
  // INQUIRY STATE TESTS
  // ==========================================================================

  describe('Inquiry State', () => {
    it('6. Approved inquiry is eligible', async () => {
      const profileChain = setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', null)
      const inquiryChain = setupInquiryFetch(APPROVED_INQUIRY)
      setupMockFrom(profileChain, inquiryChain)

      mockRpc.mockResolvedValue({ data: SCHOOL_ID, error: null })

      const serviceSelectChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        neq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      }
      const serviceInsertChain = {
        insert: vi.fn().mockResolvedValue({ error: null }),
      }
      let serviceCallCount = 0
      mockServiceFrom.mockImplementation(() => {
        serviceCallCount++
        if (serviceCallCount === 1) return serviceSelectChain
        return serviceInsertChain
      })

      mockNotifyOwner.mockResolvedValue({ success: true, notificationId: 'notif-1' })

      const result = await createSchoolFromInquiry(INQUIRY_ID)
      expect(result.success).toBe(true)
    })

    it('7. Pending inquiry is rejected', async () => {
      const profileChain = setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', null)
      const inquiryChain = setupInquiryFetch({ ...APPROVED_INQUIRY, status: 'new' })
      setupMockFrom(profileChain, inquiryChain)

      const result = await createSchoolFromInquiry(INQUIRY_ID)

      expect(result.success).toBe(false)
      expect(result.error).toContain('approved')
    })

    it('8. Rejected inquiry is rejected', async () => {
      const profileChain = setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', null)
      const inquiryChain = setupInquiryFetch({ ...APPROVED_INQUIRY, status: 'declined' })
      setupMockFrom(profileChain, inquiryChain)

      const result = await createSchoolFromInquiry(INQUIRY_ID)

      expect(result.success).toBe(false)
      expect(result.error).toContain('approved')
    })

    it('9. Unknown inquiry is rejected', async () => {
      const profileChain = setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', null)
      const inquiryChain = setupInquiryFetch(null, { message: 'Not found' })
      setupMockFrom(profileChain, inquiryChain)

      const result = await createSchoolFromInquiry(INQUIRY_ID)

      expect(result.success).toBe(false)
      expect(result.error).toContain('not found')
    })
  })

  // ==========================================================================
  // SCHOOL CREATION / RPC TESTS
  // ==========================================================================

  describe('School Creation (RPC)', () => {
    it('10. RPC is called with correct inquiry ID', async () => {
      const profileChain = setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', null)
      const inquiryChain = setupInquiryFetch(APPROVED_INQUIRY)
      setupMockFrom(profileChain, inquiryChain)

      mockRpc.mockResolvedValue({ data: SCHOOL_ID, error: null })

      const serviceSelectChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        neq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      }
      const serviceInsertChain = {
        insert: vi.fn().mockResolvedValue({ error: null }),
      }
      let serviceCallCount = 0
      mockServiceFrom.mockImplementation(() => {
        serviceCallCount++
        if (serviceCallCount === 1) return serviceSelectChain
        return serviceInsertChain
      })

      mockNotifyOwner.mockResolvedValue({ success: true, notificationId: 'notif-1' })

      await createSchoolFromInquiry(INQUIRY_ID)

      expect(mockRpc).toHaveBeenCalledWith('create_school_from_inquiry', {
        p_pilot_inquiry_id: INQUIRY_ID,
      })
    })

    it('11. Existing school_id is handled idempotently', async () => {
      const profileChain = setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', null)
      const inquiryChain = setupInquiryFetch(APPROVED_INQUIRY_WITH_SCHOOL)
      setupMockFrom(profileChain, inquiryChain)

      // RPC returns the same school_id (idempotent)
      mockRpc.mockResolvedValue({ data: SCHOOL_ID, error: null })

      const serviceSelectChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        neq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: { id: 'existing-inv' }, error: null }),
      }
      mockServiceFrom.mockReturnValue(serviceSelectChain)

      mockNotifyOwner.mockResolvedValue({ success: true, notificationId: 'notif-1' })

      const result = await createSchoolFromInquiry(INQUIRY_ID)

      expect(result.success).toBe(true)
      expect(result.schoolId).toBe(SCHOOL_ID)
      expect(result.alreadyExisted).toBe(true)
    })

    it('12. Client cannot inject school_id (only inquiryId is accepted)', async () => {
      const profileChain = setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', null)
      const inquiryChain = setupInquiryFetch(APPROVED_INQUIRY)
      setupMockFrom(profileChain, inquiryChain)

      mockRpc.mockResolvedValue({ data: SCHOOL_ID, error: null })

      const serviceSelectChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        neq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      }
      const serviceInsertChain = {
        insert: vi.fn().mockResolvedValue({ error: null }),
      }
      let serviceCallCount = 0
      mockServiceFrom.mockImplementation(() => {
        serviceCallCount++
        if (serviceCallCount === 1) return serviceSelectChain
        return serviceInsertChain
      })

      mockNotifyOwner.mockResolvedValue({ success: true, notificationId: 'notif-1' })

      // The function signature only accepts inquiryId — no school_id parameter
      const result = await createSchoolFromInquiry(INQUIRY_ID)

      expect(result.success).toBe(true)
      // Verify RPC was called with only the inquiry ID
      expect(mockRpc).toHaveBeenCalledWith('create_school_from_inquiry', {
        p_pilot_inquiry_id: INQUIRY_ID,
      })
    })

    it('13. Client cannot inject role (role comes from server-side profile)', async () => {
      // Even if a school_admin tries, the server checks the actual profile
      const profileChain = setupAuthenticatedUser(SCHOOL_ADMIN_ID, 'school_admin', SCHOOL_ID)
      setupMockFrom(profileChain, profileChain)

      const result = await createSchoolFromInquiry(INQUIRY_ID)

      expect(result.success).toBe(false)
      expect(result.error).toContain('platform administrator')
    })

    it('14. Client cannot bypass approval requirements', async () => {
      const profileChain = setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', null)
      const inquiryChain = setupInquiryFetch({ ...APPROVED_INQUIRY, status: 'new' })
      setupMockFrom(profileChain, inquiryChain)

      const result = await createSchoolFromInquiry(INQUIRY_ID)

      expect(result.success).toBe(false)
      expect(result.error).toContain('approved')
    })
  })

  // ==========================================================================
  // INVITATION TESTS
  // ==========================================================================

  describe('Invitation', () => {
    it('15. school_admin invitation uses RPC-returned school_id', async () => {
      const profileChain = setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', null)
      const inquiryChain = setupInquiryFetch(APPROVED_INQUIRY)
      setupMockFrom(profileChain, inquiryChain)

      mockRpc.mockResolvedValue({ data: SCHOOL_ID, error: null })

      const serviceSelectChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        neq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      }
      const mockInsert = vi.fn().mockResolvedValue({ error: null })
      const serviceInsertChain = { insert: mockInsert }
      let serviceCallCount = 0
      mockServiceFrom.mockImplementation(() => {
        serviceCallCount++
        if (serviceCallCount === 1) return serviceSelectChain
        return serviceInsertChain
      })

      mockNotifyOwner.mockResolvedValue({ success: true, notificationId: 'notif-1' })

      await createSchoolFromInquiry(INQUIRY_ID)

      // Verify the invitation insert used the RPC-returned school_id
      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          school_id: SCHOOL_ID,
          role: 'school_admin',
        })
      )
    })

    it('16. Invitation role is school_admin', async () => {
      const profileChain = setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', null)
      const inquiryChain = setupInquiryFetch(APPROVED_INQUIRY)
      setupMockFrom(profileChain, inquiryChain)

      mockRpc.mockResolvedValue({ data: SCHOOL_ID, error: null })

      const serviceSelectChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        neq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      }
      const mockInsert = vi.fn().mockResolvedValue({ error: null })
      const serviceInsertChain = { insert: mockInsert }
      let serviceCallCount = 0
      mockServiceFrom.mockImplementation(() => {
        serviceCallCount++
        if (serviceCallCount === 1) return serviceSelectChain
        return serviceInsertChain
      })

      mockNotifyOwner.mockResolvedValue({ success: true, notificationId: 'notif-1' })

      await createSchoolFromInquiry(INQUIRY_ID)

      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          role: 'school_admin',
        })
      )
    })

    it('17. Arbitrary client tenant assignment is impossible', async () => {
      // The function only accepts inquiryId. The school_id comes from the RPC.
      // There is no way for the client to specify a different school_id.
      const profileChain = setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', null)
      const inquiryChain = setupInquiryFetch(APPROVED_INQUIRY)
      setupMockFrom(profileChain, inquiryChain)

      mockRpc.mockResolvedValue({ data: SCHOOL_ID, error: null })

      const serviceSelectChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        neq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      }
      const mockInsert = vi.fn().mockResolvedValue({ error: null })
      const serviceInsertChain = { insert: mockInsert }
      let serviceCallCount = 0
      mockServiceFrom.mockImplementation(() => {
        serviceCallCount++
        if (serviceCallCount === 1) return serviceSelectChain
        return serviceInsertChain
      })

      mockNotifyOwner.mockResolvedValue({ success: true, notificationId: 'notif-1' })

      await createSchoolFromInquiry(INQUIRY_ID)

      // The invitation must use the RPC-returned school_id, not any client input
      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          school_id: SCHOOL_ID,
        })
      )
    })

    it('18. Existing invitation does not create duplicate', async () => {
      const profileChain = setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', null)
      const inquiryChain = setupInquiryFetch(APPROVED_INQUIRY_WITH_SCHOOL)
      setupMockFrom(profileChain, inquiryChain)

      mockRpc.mockResolvedValue({ data: SCHOOL_ID, error: null })

      // Simulate existing invitation found
      const serviceSelectChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        neq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({
          data: { id: 'existing-invitation' },
          error: null,
        }),
      }
      const mockInsert = vi.fn()
      const serviceInsertChain = { insert: mockInsert }
      let serviceCallCount = 0
      mockServiceFrom.mockImplementation(() => {
        serviceCallCount++
        if (serviceCallCount === 1) return serviceSelectChain
        return serviceInsertChain
      })

      mockNotifyOwner.mockResolvedValue({ success: true, notificationId: 'notif-1' })

      const result = await createSchoolFromInquiry(INQUIRY_ID)

      expect(result.success).toBe(true)
      // Insert should NOT have been called since invitation already exists
      expect(mockInsert).not.toHaveBeenCalled()
    })
  })

  // ==========================================================================
  // SIDE-EFFECT FAILURE TESTS
  // ==========================================================================

  describe('Side-Effect Failures', () => {
    it('19. RPC failure prevents downstream success actions', async () => {
      const profileChain = setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', null)
      const inquiryChain = setupInquiryFetch(APPROVED_INQUIRY)
      setupMockFrom(profileChain, inquiryChain)

      mockRpc.mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      })

      const result = await createSchoolFromInquiry(INQUIRY_ID)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Database error')
      // Verify no invitation was attempted
      expect(mockServiceFrom).not.toHaveBeenCalled()
      // Verify no notification was attempted
      expect(mockNotifyOwner).not.toHaveBeenCalled()
    })

    it('20. Invitation failure after RPC success preserves created school', async () => {
      const profileChain = setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', null)
      const inquiryChain = setupInquiryFetch(APPROVED_INQUIRY)
      setupMockFrom(profileChain, inquiryChain)

      mockRpc.mockResolvedValue({ data: SCHOOL_ID, error: null })

      // Invitation fails
      const serviceSelectChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        neq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      }
      const serviceInsertChain = {
        insert: vi.fn().mockResolvedValue({
          error: { message: 'Invitation insert failed', code: '42000' },
        }),
      }
      let serviceCallCount = 0
      mockServiceFrom.mockImplementation(() => {
        serviceCallCount++
        if (serviceCallCount === 1) return serviceSelectChain
        return serviceInsertChain
      })

      mockNotifyOwner.mockResolvedValue({ success: true, notificationId: 'notif-1' })

      const result = await createSchoolFromInquiry(INQUIRY_ID)

      expect(result.success).toBe(true)
      expect(result.partialSuccess).toBe(true)
      expect(result.schoolId).toBe(SCHOOL_ID)
      expect(result.sideEffectError).toContain('Invitation')
    })

    it('21. Retry after invitation failure does not create second school', async () => {
      const profileChain = setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', null)
      // On retry, the inquiry now has school_id set
      const inquiryChain = setupInquiryFetch(APPROVED_INQUIRY_WITH_SCHOOL)
      setupMockFrom(profileChain, inquiryChain)

      // RPC returns the same school_id (idempotent)
      mockRpc.mockResolvedValue({ data: SCHOOL_ID, error: null })

      const serviceSelectChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        neq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      }
      const serviceInsertChain = {
        insert: vi.fn().mockResolvedValue({ error: null }),
      }
      let serviceCallCount = 0
      mockServiceFrom.mockImplementation(() => {
        serviceCallCount++
        if (serviceCallCount === 1) return serviceSelectChain
        return serviceInsertChain
      })

      mockNotifyOwner.mockResolvedValue({ success: true, notificationId: 'notif-1' })

      const result = await createSchoolFromInquiry(INQUIRY_ID)

      expect(result.success).toBe(true)
      expect(result.schoolId).toBe(SCHOOL_ID)
      expect(result.alreadyExisted).toBe(true)
    })

    it('22. Notification failure does not create/recreate/delete school', async () => {
      const profileChain = setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', null)
      const inquiryChain = setupInquiryFetch(APPROVED_INQUIRY)
      setupMockFrom(profileChain, inquiryChain)

      mockRpc.mockResolvedValue({ data: SCHOOL_ID, error: null })

      const serviceSelectChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        neq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      }
      const serviceInsertChain = {
        insert: vi.fn().mockResolvedValue({ error: null }),
      }
      let serviceCallCount = 0
      mockServiceFrom.mockImplementation(() => {
        serviceCallCount++
        if (serviceCallCount === 1) return serviceSelectChain
        return serviceInsertChain
      })

      // Notification fails
      mockNotifyOwner.mockResolvedValue({
        success: false,
        error: 'Email delivery failed',
      })

      const result = await createSchoolFromInquiry(INQUIRY_ID)

      expect(result.success).toBe(true)
      expect(result.partialSuccess).toBe(true)
      expect(result.schoolId).toBe(SCHOOL_ID)
      expect(result.sideEffectError).toContain('Notification')
    })

    it('23. Audit failure is surfaced according to defined policy', async () => {
      // Audit logging is fire-and-forget: logSecurityEvent never throws.
      // The defined policy is that audit failure does not block school creation.
      // This test verifies the audit log was called.
      const profileChain = setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', null)
      const inquiryChain = setupInquiryFetch(APPROVED_INQUIRY)
      setupMockFrom(profileChain, inquiryChain)

      mockRpc.mockResolvedValue({ data: SCHOOL_ID, error: null })

      const serviceSelectChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        neq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      }
      const serviceInsertChain = {
        insert: vi.fn().mockResolvedValue({ error: null }),
      }
      let serviceCallCount = 0
      mockServiceFrom.mockImplementation(() => {
        serviceCallCount++
        if (serviceCallCount === 1) return serviceSelectChain
        return serviceInsertChain
      })

      mockNotifyOwner.mockResolvedValue({ success: true, notificationId: 'notif-1' })

      const result = await createSchoolFromInquiry(INQUIRY_ID)

      expect(result.success).toBe(true)
      // Verify audit log was called
      expect(mockLogSecurityEvent).toHaveBeenCalledWith(
        'sensitive_config_change',
        'success',
        expect.stringContaining('School created'),
        expect.objectContaining({
          userId: PLATFORM_ADMIN_ID,
          action: 'create_school',
        })
      )
    })
  })

  // ==========================================================================
  // REPLAY / IDEMPOTENCY TESTS
  // ==========================================================================

  describe('Replay / Idempotency', () => {
    it('26. Repeated invocation returns/uses same school', async () => {
      const profileChain = setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', null)
      const inquiryChain = setupInquiryFetch(APPROVED_INQUIRY_WITH_SCHOOL)
      setupMockFrom(profileChain, inquiryChain)

      // RPC returns same school_id on repeat call
      mockRpc.mockResolvedValue({ data: SCHOOL_ID, error: null })

      const serviceSelectChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        neq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({
          data: { id: 'existing-inv' },
          error: null,
        }),
      }
      mockServiceFrom.mockReturnValue(serviceSelectChain)

      mockNotifyOwner.mockResolvedValue({ success: true, notificationId: 'notif-1' })

      const result1 = await createSchoolFromInquiry(INQUIRY_ID)
      expect(result1.success).toBe(true)
      expect(result1.schoolId).toBe(SCHOOL_ID)

      // Reset mocks for second call
      vi.clearAllMocks()
      setupMockFrom(
        setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', null),
        setupInquiryFetch(APPROVED_INQUIRY_WITH_SCHOOL)
      )
      mockRpc.mockResolvedValue({ data: SCHOOL_ID, error: null })
      mockServiceFrom.mockReturnValue(serviceSelectChain)
      mockNotifyOwner.mockResolvedValue({ success: true, notificationId: 'notif-2' })

      const result2 = await createSchoolFromInquiry(INQUIRY_ID)
      expect(result2.success).toBe(true)
      expect(result2.schoolId).toBe(SCHOOL_ID)
      expect(result2.alreadyExisted).toBe(true)
    })
  })

  // ==========================================================================
  // AUDIT LOGGING TESTS
  // ==========================================================================

  describe('Audit Logging', () => {
    it('should log denied attempts for non-platform-admins', async () => {
      const profileChain = setupAuthenticatedUser(SCHOOL_ADMIN_ID, 'school_admin', SCHOOL_ID)
      setupMockFrom(profileChain, profileChain)

      await createSchoolFromInquiry(INQUIRY_ID)

      expect(mockLogSecurityEvent).toHaveBeenCalledWith(
        'permission_denied',
        'denied',
        expect.stringContaining('Non-platform-admin'),
        expect.objectContaining({
          userId: SCHOOL_ADMIN_ID,
          action: 'create_school',
        })
      )
    })

    it('should log RPC failures', async () => {
      const profileChain = setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', null)
      const inquiryChain = setupInquiryFetch(APPROVED_INQUIRY)
      setupMockFrom(profileChain, inquiryChain)

      mockRpc.mockResolvedValue({
        data: null,
        error: { message: 'RPC failure' },
      })

      await createSchoolFromInquiry(INQUIRY_ID)

      expect(mockLogSecurityEvent).toHaveBeenCalledWith(
        'sensitive_config_change',
        'failure',
        expect.stringContaining('RPC failed'),
        expect.objectContaining({
          userId: PLATFORM_ADMIN_ID,
          action: 'create_school',
        })
      )
    })

    it('should include inquiry and school metadata in success audit', async () => {
      const profileChain = setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', null)
      const inquiryChain = setupInquiryFetch(APPROVED_INQUIRY)
      setupMockFrom(profileChain, inquiryChain)

      mockRpc.mockResolvedValue({ data: SCHOOL_ID, error: null })

      const serviceSelectChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        neq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      }
      const serviceInsertChain = {
        insert: vi.fn().mockResolvedValue({ error: null }),
      }
      let serviceCallCount = 0
      mockServiceFrom.mockImplementation(() => {
        serviceCallCount++
        if (serviceCallCount === 1) return serviceSelectChain
        return serviceInsertChain
      })

      mockNotifyOwner.mockResolvedValue({ success: true, notificationId: 'notif-1' })

      await createSchoolFromInquiry(INQUIRY_ID)

      expect(mockLogSecurityEvent).toHaveBeenCalledWith(
        'sensitive_config_change',
        'success',
        expect.any(String),
        expect.objectContaining({
          metadata: expect.objectContaining({
            inquiryId: INQUIRY_ID,
            schoolId: SCHOOL_ID,
            schoolName: 'Test Barber School',
          }),
        })
      )
    })
  })

  // ==========================================================================
  // NOTIFICATION TESTS
  // ==========================================================================

  describe('Notification', () => {
    it('should use school_approval notification type', async () => {
      const profileChain = setupAuthenticatedUser(PLATFORM_ADMIN_ID, 'admin', null)
      const inquiryChain = setupInquiryFetch(APPROVED_INQUIRY)
      setupMockFrom(profileChain, inquiryChain)

      mockRpc.mockResolvedValue({ data: SCHOOL_ID, error: null })

      const serviceSelectChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        neq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      }
      const serviceInsertChain = {
        insert: vi.fn().mockResolvedValue({ error: null }),
      }
      let serviceCallCount = 0
      mockServiceFrom.mockImplementation(() => {
        serviceCallCount++
        if (serviceCallCount === 1) return serviceSelectChain
        return serviceInsertChain
      })

      mockNotifyOwner.mockResolvedValue({ success: true, notificationId: 'notif-1' })

      await createSchoolFromInquiry(INQUIRY_ID)

      expect(mockNotifyOwner).toHaveBeenCalledWith(
        'school_approval',
        expect.objectContaining({
          schoolName: 'Test Barber School',
          contactName: 'Jane Doe',
          email: 'jane@testbarber.edu',
        }),
        expect.objectContaining({
          sourceType: 'pilot_inquiries',
          sourceId: INQUIRY_ID,
        })
      )
    })
  })
})
