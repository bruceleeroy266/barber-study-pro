/**
 * Phase 6C-3 — Remediation API Route Tests
 *
 * Tests for the remediation API routes including authorization,
 * reassessment reservation, and submission.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock the modules before importing the routes
vi.mock('@/lib/supabase-server', () => ({
  createClient: vi.fn(),
}))

vi.mock('@/lib/remediation/supabase-client', () => ({
  createSupabaseStudentRemediationClient: vi.fn(),
}))

vi.mock('@/lib/remediation/student-service', () => ({
  createStudentRemediationService: vi.fn(),
  STUDENT_STATE_LABELS: {
    targeted_review: 'Getting Started',
    review_in_progress: 'Reviewing Materials',
    review_completed: 'Ready for Knowledge Check',
    reassessment_in_progress: 'Knowledge Check in Progress',
    pending_evaluation: 'Checking Your Answer',
    pending_more_evidence: 'Keep Practicing',
    successful: 'Great Progress!',
    unsuccessful: 'Additional Support Available',
    pool_exhausted: 'Additional Practice Recommended',
    already_completed: 'Completed',
  },
  STUDENT_STATE_DESCRIPTIONS: {
    targeted_review: 'Your instructor has identified an area to focus on.',
    review_in_progress: 'You are making progress through your review materials.',
    review_completed: 'You have completed your review.',
    reassessment_in_progress: 'Answer the question below.',
    pending_evaluation: 'Your answer is being reviewed...',
    pending_more_evidence: 'You are building your foundation.',
    successful: 'You have demonstrated strong understanding.',
    unsuccessful: 'Your instructor will provide additional support.',
    pool_exhausted: 'You have completed all available practice questions.',
    already_completed: 'This focus area has already been completed.',
  },
}))

vi.mock('@/lib/remediation/content-filter', () => ({
  buildRemediationContentBundle: vi.fn(),
  getQuizQuestionById: vi.fn(),
}))

vi.mock('@/lib/reassessment/supabase-client', () => ({
  createSupabaseExclusionClient: vi.fn(),
}))

vi.mock('@/lib/reassessment/reassessment-service', () => ({
  createReassessmentService: vi.fn(),
}))

vi.mock('@/lib/evaluation/supabase-client', () => ({
  createSupabaseEvaluationClient: vi.fn(),
}))

vi.mock('@/lib/evaluation/evaluation-service', () => ({
  createEvaluationService: vi.fn(),
}))

vi.mock('@/lib/reassessment/provider-registry', () => ({
  initializeChapter2DetectionProvider: vi.fn(),
}))

describe('Remediation API Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/remediation/cycles/[cycleId]', () => {
    it('should return 401 for unauthenticated request', async () => {
      const { createClient } = await import('@/lib/supabase-server')
      vi.mocked(createClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
        },
      } as any)

      const { GET } = await import('../cycles/[cycleId]/route')
      const request = new NextRequest('http://localhost/api/remediation/cycles/cycle-123')
      const response = await GET(request, { params: Promise.resolve({ cycleId: 'cycle-123' }) })

      expect(response.status).toBe(401)
    })

    it('should return 404 for non-existent cycle', async () => {
      const { createClient } = await import('@/lib/supabase-server')
      const { createSupabaseStudentRemediationClient } = await import('@/lib/remediation/supabase-client')
      const { createStudentRemediationService } = await import('@/lib/remediation/student-service')

      vi.mocked(createClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: 'user-123' } },
            error: null,
          }),
        },
      } as any)

      const mockService = {
        getCycleForStudent: vi.fn().mockResolvedValue({ error: 'Remediation cycle not found' }),
      }
      vi.mocked(createStudentRemediationService).mockReturnValue(mockService as any)
      vi.mocked(createSupabaseStudentRemediationClient).mockReturnValue({} as any)

      const { GET } = await import('../cycles/[cycleId]/route')
      const request = new NextRequest('http://localhost/api/remediation/cycles/cycle-123')
      const response = await GET(request, { params: Promise.resolve({ cycleId: 'cycle-123' }) })

      expect(response.status).toBe(404)
    })

    it('should return 403 for cross-student access', async () => {
      const { createClient } = await import('@/lib/supabase-server')
      const { createSupabaseStudentRemediationClient } = await import('@/lib/remediation/supabase-client')
      const { createStudentRemediationService } = await import('@/lib/remediation/student-service')

      vi.mocked(createClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: 'user-123' } },
            error: null,
          }),
        },
      } as any)

      const mockService = {
        getCycleForStudent: vi.fn().mockResolvedValue({ error: 'Access denied' }),
      }
      vi.mocked(createStudentRemediationService).mockReturnValue(mockService as any)
      vi.mocked(createSupabaseStudentRemediationClient).mockReturnValue({} as any)

      const { GET } = await import('../cycles/[cycleId]/route')
      const request = new NextRequest('http://localhost/api/remediation/cycles/cycle-123')
      const response = await GET(request, { params: Promise.resolve({ cycleId: 'cycle-123' }) })

      expect(response.status).toBe(403)
    })
  })

  describe('POST /api/remediation/cycles/[cycleId]/reassessment', () => {
    it('should return 401 for unauthenticated request', async () => {
      const { createClient } = await import('@/lib/supabase-server')
      vi.mocked(createClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
        },
      } as any)

      const { POST } = await import('../cycles/[cycleId]/reassessment/route')
      const request = new NextRequest('http://localhost/api/remediation/cycles/cycle-123/reassessment', {
        method: 'POST',
      })
      const response = await POST(request, { params: Promise.resolve({ cycleId: 'cycle-123' }) })

      expect(response.status).toBe(401)
    })

    it('should return 400 when review not completed', async () => {
      const { createClient } = await import('@/lib/supabase-server')
      const { createSupabaseStudentRemediationClient } = await import('@/lib/remediation/supabase-client')
      const { createStudentRemediationService } = await import('@/lib/remediation/student-service')

      vi.mocked(createClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: 'user-123' } },
            error: null,
          }),
        },
      } as any)

      const mockService = {
        isReassessmentAvailable: vi.fn().mockResolvedValue({
          available: false,
          error: 'Please complete your review before starting the knowledge check',
        }),
      }
      vi.mocked(createStudentRemediationService).mockReturnValue(mockService as any)
      vi.mocked(createSupabaseStudentRemediationClient).mockReturnValue({} as any)

      const { POST } = await import('../cycles/[cycleId]/reassessment/route')
      const request = new NextRequest('http://localhost/api/remediation/cycles/cycle-123/reassessment', {
        method: 'POST',
      })
      const response = await POST(request, { params: Promise.resolve({ cycleId: 'cycle-123' }) })

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toContain('complete your review')
    })
  })

  describe('POST /api/remediation/cycles/[cycleId]/reassessment/submit', () => {
    it('should return 400 for missing required fields', async () => {
      const { createClient } = await import('@/lib/supabase-server')
      vi.mocked(createClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: 'user-123' } },
            error: null,
          }),
        },
      } as any)

      const { POST } = await import('../cycles/[cycleId]/reassessment/submit/route')
      const request = new NextRequest('http://localhost/api/remediation/cycles/cycle-123/reassessment/submit', {
        method: 'POST',
        body: JSON.stringify({}),
      })
      const response = await POST(request, { params: Promise.resolve({ cycleId: 'cycle-123' }) })

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toContain('Missing required fields')
    })

    it('should return 401 for unauthenticated request', async () => {
      const { createClient } = await import('@/lib/supabase-server')
      vi.mocked(createClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
        },
      } as any)

      const { POST } = await import('../cycles/[cycleId]/reassessment/submit/route')
      const request = new NextRequest('http://localhost/api/remediation/cycles/cycle-123/reassessment/submit', {
        method: 'POST',
        body: JSON.stringify({
          questionId: 'qq-2-001',
          reservationId: 'res-123',
          quizAttemptId: 'attempt-123',
          answer: 'a',
        }),
      })
      const response = await POST(request, { params: Promise.resolve({ cycleId: 'cycle-123' }) })

      expect(response.status).toBe(401)
    })
  })
})
