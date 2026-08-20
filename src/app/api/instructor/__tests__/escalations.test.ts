/**
 * Phase 6C-4 — Instructor Escalation API Tests
 *
 * Tests for instructor escalation list, detail, and acknowledge endpoints.
 * Covers authorization, school boundary enforcement, and idempotent
 * acknowledgement.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock the modules before importing the routes
vi.mock('@/lib/supabase-server', () => ({
  createClient: vi.fn(),
}))

vi.mock('@/lib/instructor/supabase-client', () => ({
  createSupabaseInstructorClient: vi.fn(),
}))

// ───────────────────────────────────────────────
// Test Constants
// ───────────────────────────────────────────────

const INSTRUCTOR_ID = 'instructor-user-123'
const STUDENT_ID = 'student-user-456'
const SCHOOL_ID = 'school-uuid-abc'
const OTHER_SCHOOL_ID = 'school-uuid-xyz'
const ESCALATION_ID = 'escalation-uuid-001'

const MOCK_INSTRUCTOR_PROFILE = {
  id: INSTRUCTOR_ID,
  email: 'instructor@test.com',
  full_name: 'Test Instructor',
  role: 'instructor',
  school_id: SCHOOL_ID,
}

const MOCK_STUDENT_PROFILE = {
  id: STUDENT_ID,
  email: 'student@test.com',
  full_name: 'Test Student',
  role: 'student',
  school_id: SCHOOL_ID,
}

const MOCK_ESCALATION = {
  id: ESCALATION_ID,
  userId: STUDENT_ID,
  conceptId: 'C-2-01',
  chapterId: 'ch-2',
  schoolId: SCHOOL_ID,
  triggeringCycleIds: ['cycle-1', 'cycle-2'],
  unsuccessfulCycleCount: 2,
  detectionEvidence: {},
  status: 'pending' as const,
  acknowledgedBy: null,
  acknowledgedAt: null,
  instructorNotes: null,
  interventionPlan: null,
  resolutionSummary: null,
  followUpRequired: null,
  autoClearedAt: null,
  autoClearedByResetId: null,
  expiredAt: null,
  createdAt: new Date('2026-08-20T08:00:00Z'),
  updatedAt: new Date('2026-08-20T08:00:00Z'),
  student: MOCK_STUDENT_PROFILE,
  acknowledgedByProfile: null,
}

// ───────────────────────────────────────────────
// Helpers
// ───────────────────────────────────────────────

async function setupMocks(options: {
  authenticatedUser?: string | null
  profile?: Record<string, unknown> | null
  escalations?: unknown[]
  escalation?: unknown | null
  acknowledgeResult?: { success: boolean; error?: string; alreadyAcknowledged?: boolean }
  student?: Record<string, unknown> | null
  history?: unknown[]
}) {
  const { createClient } = await import('@/lib/supabase-server')
  const { createSupabaseInstructorClient } = await import('@/lib/instructor/supabase-client')

  const user = options.authenticatedUser
    ? { id: options.authenticatedUser }
    : null

  vi.mocked(createClient).mockResolvedValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user },
        error: user ? null : { message: 'Not authenticated' },
      }),
    },
  } as any)

  const mockClient = {
    getProfileById: vi.fn().mockResolvedValue(
      options.profile !== undefined ? options.profile : MOCK_INSTRUCTOR_PROFILE
    ),
    getStudentById: vi.fn().mockResolvedValue(
      options.student !== undefined ? options.student : MOCK_STUDENT_PROFILE
    ),
    listEscalationsForSchool: vi.fn().mockResolvedValue(
      options.escalations !== undefined ? options.escalations : [MOCK_ESCALATION]
    ),
    getEscalationForSchool: vi.fn().mockResolvedValue(
      options.escalation !== undefined ? options.escalation : MOCK_ESCALATION
    ),
    acknowledgeEscalationForSchool: vi.fn().mockResolvedValue(
      options.acknowledgeResult ?? { success: true }
    ),
    getInterventionHistoryForStudent: vi.fn().mockResolvedValue(
      options.history !== undefined ? options.history : []
    ),
  }

  vi.mocked(createSupabaseInstructorClient).mockReturnValue(mockClient as any)

  return { mockClient }
}

// ───────────────────────────────────────────────
// Tests
// ───────────────────────────────────────────────

describe('Instructor Escalation API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/instructor/escalations', () => {
    it('returns 401 for unauthenticated request', async () => {
      await setupMocks({ authenticatedUser: null })

      const { GET } = await import('../escalations/route')
      const response = await GET(new NextRequest('http://localhost/api/instructor/escalations'))

      expect(response.status).toBe(401)
    })

    it('returns 403 for non-instructor role', async () => {
      await setupMocks({
        authenticatedUser: STUDENT_ID,
        profile: { ...MOCK_STUDENT_PROFILE, role: 'student' },
      })

      const { GET } = await import('../escalations/route')
      const response = await GET(new NextRequest('http://localhost/api/instructor/escalations'))

      expect(response.status).toBe(403)
    })

    it('returns 403 when instructor has no school', async () => {
      await setupMocks({
        authenticatedUser: INSTRUCTOR_ID,
        profile: { ...MOCK_INSTRUCTOR_PROFILE, school_id: null },
      })

      const { GET } = await import('../escalations/route')
      const response = await GET(new NextRequest('http://localhost/api/instructor/escalations'))

      expect(response.status).toBe(403)
    })

    it('returns escalations for the instructor school', async () => {
      const { mockClient } = await setupMocks({
        authenticatedUser: INSTRUCTOR_ID,
      })

      const { GET } = await import('../escalations/route')
      const response = await GET(new NextRequest('http://localhost/api/instructor/escalations'))

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.escalations).toHaveLength(1)
      expect(data.escalations[0].id).toBe(ESCALATION_ID)
      expect(data.escalations[0].student.fullName).toBe('Test Student')
      expect(mockClient.listEscalationsForSchool).toHaveBeenCalledWith(SCHOOL_ID)
    })

    it('returns empty array when no escalations exist', async () => {
      await setupMocks({
        authenticatedUser: INSTRUCTOR_ID,
        escalations: [],
      })

      const { GET } = await import('../escalations/route')
      const response = await GET(new NextRequest('http://localhost/api/instructor/escalations'))

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.escalations).toHaveLength(0)
    })

    it('allows admin role to access escalations', async () => {
      await setupMocks({
        authenticatedUser: INSTRUCTOR_ID,
        profile: { ...MOCK_INSTRUCTOR_PROFILE, role: 'admin' },
      })

      const { GET } = await import('../escalations/route')
      const response = await GET(new NextRequest('http://localhost/api/instructor/escalations'))

      expect(response.status).toBe(200)
    })
  })

  describe('GET /api/instructor/escalations/[id]', () => {
    it('returns 401 for unauthenticated request', async () => {
      await setupMocks({ authenticatedUser: null })

      const { GET } = await import('../escalations/[id]/route')
      const response = await GET(
        new NextRequest(`http://localhost/api/instructor/escalations/${ESCALATION_ID}`),
        { params: Promise.resolve({ id: ESCALATION_ID }) }
      )

      expect(response.status).toBe(401)
    })

    it('returns 404 for non-existent escalation', async () => {
      await setupMocks({
        authenticatedUser: INSTRUCTOR_ID,
        escalation: null,
      })

      const { GET } = await import('../escalations/[id]/route')
      const response = await GET(
        new NextRequest(`http://localhost/api/instructor/escalations/${ESCALATION_ID}`),
        { params: Promise.resolve({ id: ESCALATION_ID }) }
      )

      expect(response.status).toBe(404)
    })

    it('returns escalation detail for authorized instructor', async () => {
      const { mockClient } = await setupMocks({
        authenticatedUser: INSTRUCTOR_ID,
      })

      const { GET } = await import('../escalations/[id]/route')
      const response = await GET(
        new NextRequest(`http://localhost/api/instructor/escalations/${ESCALATION_ID}`),
        { params: Promise.resolve({ id: ESCALATION_ID }) }
      )

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.escalation.id).toBe(ESCALATION_ID)
      expect(data.escalation.triggeringCycleIds).toEqual(['cycle-1', 'cycle-2'])
      expect(mockClient.getEscalationForSchool).toHaveBeenCalledWith(ESCALATION_ID, SCHOOL_ID)
    })

    it('scopes query to instructor school (cross-school protection)', async () => {
      const { mockClient } = await setupMocks({
        authenticatedUser: INSTRUCTOR_ID,
      })

      const { GET } = await import('../escalations/[id]/route')
      await GET(
        new NextRequest(`http://localhost/api/instructor/escalations/${ESCALATION_ID}`),
        { params: Promise.resolve({ id: ESCALATION_ID }) }
      )

      // Verify school scoping
      expect(mockClient.getEscalationForSchool).toHaveBeenCalledWith(ESCALATION_ID, SCHOOL_ID)
    })
  })

  describe('POST /api/instructor/escalations/[id]/acknowledge', () => {
    it('returns 401 for unauthenticated request', async () => {
      await setupMocks({ authenticatedUser: null })

      const { POST } = await import('../escalations/[id]/acknowledge/route')
      const response = await POST(
        new NextRequest(`http://localhost/api/instructor/escalations/${ESCALATION_ID}/acknowledge`, {
          method: 'POST',
        }),
        { params: Promise.resolve({ id: ESCALATION_ID }) }
      )

      expect(response.status).toBe(401)
    })

    it('returns 403 for non-instructor role', async () => {
      await setupMocks({
        authenticatedUser: STUDENT_ID,
        profile: { ...MOCK_STUDENT_PROFILE, role: 'student' },
      })

      const { POST } = await import('../escalations/[id]/acknowledge/route')
      const response = await POST(
        new NextRequest(`http://localhost/api/instructor/escalations/${ESCALATION_ID}/acknowledge`, {
          method: 'POST',
        }),
        { params: Promise.resolve({ id: ESCALATION_ID }) }
      )

      expect(response.status).toBe(403)
    })

    it('acknowledges a pending escalation', async () => {
      const { mockClient } = await setupMocks({
        authenticatedUser: INSTRUCTOR_ID,
      })

      const { POST } = await import('../escalations/[id]/acknowledge/route')
      const response = await POST(
        new NextRequest(`http://localhost/api/instructor/escalations/${ESCALATION_ID}/acknowledge`, {
          method: 'POST',
        }),
        { params: Promise.resolve({ id: ESCALATION_ID }) }
      )

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.alreadyAcknowledged).toBe(false)
      expect(mockClient.acknowledgeEscalationForSchool).toHaveBeenCalledWith(
        ESCALATION_ID,
        SCHOOL_ID,
        INSTRUCTOR_ID
      )
    })

    it('handles already-acknowledged escalation idempotently', async () => {
      await setupMocks({
        authenticatedUser: INSTRUCTOR_ID,
        acknowledgeResult: {
          success: false,
          error: 'Escalation already acknowledged by this instructor',
          alreadyAcknowledged: true,
        },
        escalation: {
          ...MOCK_ESCALATION,
          status: 'acknowledged',
          acknowledgedBy: INSTRUCTOR_ID,
          acknowledgedAt: new Date('2026-08-20T09:00:00Z'),
        },
      })

      const { POST } = await import('../escalations/[id]/acknowledge/route')
      const response = await POST(
        new NextRequest(`http://localhost/api/instructor/escalations/${ESCALATION_ID}/acknowledge`, {
          method: 'POST',
        }),
        { params: Promise.resolve({ id: ESCALATION_ID }) }
      )

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.alreadyAcknowledged).toBe(true)
    })

    it('returns 404 for non-existent escalation', async () => {
      await setupMocks({
        authenticatedUser: INSTRUCTOR_ID,
        acknowledgeResult: { success: false, error: 'Escalation not found' },
      })

      const { POST } = await import('../escalations/[id]/acknowledge/route')
      const response = await POST(
        new NextRequest(`http://localhost/api/instructor/escalations/${ESCALATION_ID}/acknowledge`, {
          method: 'POST',
        }),
        { params: Promise.resolve({ id: ESCALATION_ID }) }
      )

      expect(response.status).toBe(404)
    })

    it('prevents acknowledgement by instructor from different school', async () => {
      // The school scoping in acknowledgeEscalationForSchool handles this
      const { mockClient } = await setupMocks({
        authenticatedUser: INSTRUCTOR_ID,
        acknowledgeResult: { success: false, error: 'Escalation not found' },
      })

      const { POST } = await import('../escalations/[id]/acknowledge/route')
      await POST(
        new NextRequest(`http://localhost/api/instructor/escalations/${ESCALATION_ID}/acknowledge`, {
          method: 'POST',
        }),
        { params: Promise.resolve({ id: ESCALATION_ID }) }
      )

      // Verify school scoping was applied
      expect(mockClient.acknowledgeEscalationForSchool).toHaveBeenCalledWith(
        ESCALATION_ID,
        SCHOOL_ID, // instructor's school, not the escalation's school
        INSTRUCTOR_ID
      )
    })
  })

  describe('GET /api/instructor/students/[studentId]/intervention-history', () => {
    it('returns 401 for unauthenticated request', async () => {
      await setupMocks({ authenticatedUser: null })

      const { GET } = await import('../students/[studentId]/intervention-history/route')
      const response = await GET(
        new NextRequest(`http://localhost/api/instructor/students/${STUDENT_ID}/intervention-history`),
        { params: Promise.resolve({ studentId: STUDENT_ID }) }
      )

      expect(response.status).toBe(401)
    })

    it('returns 403 for non-instructor role', async () => {
      await setupMocks({
        authenticatedUser: STUDENT_ID,
        profile: { ...MOCK_STUDENT_PROFILE, role: 'student' },
      })

      const { GET } = await import('../students/[studentId]/intervention-history/route')
      const response = await GET(
        new NextRequest(`http://localhost/api/instructor/students/${STUDENT_ID}/intervention-history`),
        { params: Promise.resolve({ studentId: STUDENT_ID }) }
      )

      expect(response.status).toBe(403)
    })

    it('returns 403 for cross-school student access', async () => {
      await setupMocks({
        authenticatedUser: INSTRUCTOR_ID,
        student: { ...MOCK_STUDENT_PROFILE, school_id: OTHER_SCHOOL_ID },
      })

      const { GET } = await import('../students/[studentId]/intervention-history/route')
      const response = await GET(
        new NextRequest(`http://localhost/api/instructor/students/${STUDENT_ID}/intervention-history`),
        { params: Promise.resolve({ studentId: STUDENT_ID }) }
      )

      expect(response.status).toBe(403)
      const data = await response.json()
      expect(data.error).toContain('different school')
    })

    it('returns 404 for non-existent student', async () => {
      await setupMocks({
        authenticatedUser: INSTRUCTOR_ID,
        student: null,
      })

      const { GET } = await import('../students/[studentId]/intervention-history/route')
      const response = await GET(
        new NextRequest(`http://localhost/api/instructor/students/${STUDENT_ID}/intervention-history`),
        { params: Promise.resolve({ studentId: STUDENT_ID }) }
      )

      expect(response.status).toBe(404)
    })

    it('returns intervention history for same-school student', async () => {
      const mockHistory = [
        {
          cycleId: 'cycle-1',
          conceptId: 'C-2-01',
          chapterId: 'ch-2',
          status: 'evaluated',
          outcome: 'successful',
          targetedAt: '2026-08-15T00:00:00Z',
          reviewCompletedAt: '2026-08-15T01:00:00Z',
          reassessmentCompletedAt: '2026-08-15T02:00:00Z',
          evaluatedAt: '2026-08-15T03:00:00Z',
          detectionSummary: 'Persistent learning gap identified (high evidence)',
          evaluationSummary: 'Gap resolved',
          escalation: null,
          events: [
            { type: 'targeted', timestamp: '2026-08-15T00:00:00Z', summary: 'Gap identified' },
          ],
        },
      ]

      await setupMocks({
        authenticatedUser: INSTRUCTOR_ID,
        history: mockHistory,
      })

      const { GET } = await import('../students/[studentId]/intervention-history/route')
      const response = await GET(
        new NextRequest(`http://localhost/api/instructor/students/${STUDENT_ID}/intervention-history`),
        { params: Promise.resolve({ studentId: STUDENT_ID }) }
      )

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.student.fullName).toBe('Test Student')
      expect(data.history).toHaveLength(1)
      expect(data.history[0].cycleId).toBe('cycle-1')
    })
  })
})
