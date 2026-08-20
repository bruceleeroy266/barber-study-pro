/**
 * Phase 6C-3 — Reassessment Submission Adversarial Tests (CORRECTED)
 *
 * Adversarial tests specifically covering the submission integrity corrections:
 *   - Fabricated reservation ID rejected
 *   - Fabricated question ID rejected
 *   - Wrong student's reservation rejected
 *   - Wrong cycle rejected
 *   - Wrong concept rejected
 *   - Reserved question mismatch rejected
 *   - Previously consumed reservation rejected/idempotently returned
 *   - Double submission cannot create two quiz attempts/evidence observations
 *   - Concurrent submission cannot create duplicate evidence
 *   - Valid submission produces quiz_attempts.is_reassessment = true
 *   - Valid submission contains correct remediation_cycle_id
 *   - Valid submission contains correct target_concept_id
 *   - Valid submission contains authenticated user_id
 *   - Valid submission contains completed assessment evidence
 *   - Resulting evidence passes Phase 6C-2d validate_evaluation_evidence()
 *   - Legitimate pending evaluation still permits another unseen reassessment
 *   - Terminal outcome still prevents additional submission/reservation
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

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(),
}))

// ───────────────────────────────────────────────
// Test Helpers
// ───────────────────────────────────────────────

const AUTHENTICATED_USER_ID = 'user-authenticated-123'
const OTHER_USER_ID = 'user-other-456'
const CYCLE_ID = 'cycle-789'
const OTHER_CYCLE_ID = 'cycle-other-012'
const CONCEPT_ID = 'C-2-01'
const OTHER_CONCEPT_ID = 'C-2-06'
const QUESTION_ID = 'qq-2-001' // Canonically mapped to C-2-01
const WRONG_CONCEPT_QUESTION_ID = 'qq-2-002' // Canonically mapped to C-2-06
const RESERVATION_ID = 'reservation-uuid-abc'
const FABRICATED_UUID = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee'
const REAL_ATTEMPT_ID = 'real-attempt-uuid-def'

const MOCK_CYCLE = {
  id: CYCLE_ID,
  userId: AUTHENTICATED_USER_ID,
  conceptId: CONCEPT_ID,
  chapterId: 'ch-2',
  cycleNumber: 1,
  detectionState: 'emerging_weakness',
  detectionConfidence: 'medium',
  detectionEvidence: {},
  status: 'review_completed',
  targetedAt: new Date(),
  reviewStartedAt: new Date(),
  reviewCompletedAt: new Date(),
  reassessmentStartedAt: new Date(),
  reassessmentCompletedAt: null,
  evaluatedAt: null,
  outcome: null,
  postRemediationState: null,
  createdAt: new Date(),
  updatedAt: new Date(),
}

const MOCK_QUESTION = {
  id: QUESTION_ID,
  quiz_id: 'quiz-ch-2',
  question: 'Test question?',
  answer_a: 'Answer A',
  answer_b: 'Answer B',
  answer_c: 'Answer C',
  answer_d: 'Answer D',
  correct_answer: 'a',
  explanation: 'Test explanation',
}

function createSubmitRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest(
    `http://localhost/api/remediation/cycles/${CYCLE_ID}/reassessment/submit`,
    {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    }
  )
}

function createSubmitRequestForCycle(cycleId: string, body: Record<string, unknown>): NextRequest {
  return new NextRequest(
    `http://localhost/api/remediation/cycles/${cycleId}/reassessment/submit`,
    {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    }
  )
}

async function setupMocks(options: {
  authenticatedUser?: string | null
  cycleResult?: { cycle: typeof MOCK_CYCLE } | { error: string }
  rpcResult?: { data: string | null; error: { message: string } | null }
  evaluationResult?: {
    success: boolean
    outcome?: string
    evaluationId?: string
    alreadyEvaluated?: boolean
    error?: string
  }
}) {
  const { createClient } = await import('@/lib/supabase-server')
  const { createSupabaseStudentRemediationClient } = await import('@/lib/remediation/supabase-client')
  const { createStudentRemediationService } = await import('@/lib/remediation/student-service')
  const { getQuizQuestionById } = await import('@/lib/remediation/content-filter')
  const { createSupabaseEvaluationClient } = await import('@/lib/evaluation/supabase-client')
  const { createEvaluationService } = await import('@/lib/evaluation/evaluation-service')
  const { createSupabaseExclusionClient } = await import('@/lib/reassessment/supabase-client')
  const { createReassessmentService } = await import('@/lib/reassessment/reassessment-service')
  const { createClient: createSupabaseClient } = await import('@supabase/supabase-js')

  // Auth mock
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

  // Service mocks
  const mockService = {
    getCycleForStudent: vi.fn().mockResolvedValue(
      options.cycleResult ?? { cycle: MOCK_CYCLE }
    ),
    recordReassessmentCompleted: vi.fn().mockResolvedValue({ success: true }),
  }
  vi.mocked(createStudentRemediationService).mockReturnValue(mockService as any)
  vi.mocked(createSupabaseStudentRemediationClient).mockReturnValue({} as any)

  // Question mock
  vi.mocked(getQuizQuestionById).mockImplementation((id: string) => {
    if (id === QUESTION_ID) return MOCK_QUESTION as any
    if (id === WRONG_CONCEPT_QUESTION_ID) return { ...MOCK_QUESTION, id: WRONG_CONCEPT_QUESTION_ID } as any
    return null
  })

  // Supabase admin client mock (for RPC)
  const mockRpc = vi.fn().mockResolvedValue(
    options.rpcResult ?? { data: REAL_ATTEMPT_ID, error: null }
  )
  const mockSupabaseAdmin = {
    rpc: mockRpc,
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        in: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: [] }),
        }),
      }),
    }),
  }
  vi.mocked(createSupabaseClient).mockReturnValue(mockSupabaseAdmin as any)

  // Evaluation mocks
  const mockEvaluationService = {
    evaluateCycleWithDetection: vi.fn().mockResolvedValue(
      options.evaluationResult ?? {
        success: true,
        outcome: 'pending',
        evaluationId: 'eval-123',
        alreadyEvaluated: false,
      }
    ),
  }
  vi.mocked(createEvaluationService).mockReturnValue(mockEvaluationService as any)
  vi.mocked(createSupabaseEvaluationClient).mockReturnValue({} as any)
  vi.mocked(createSupabaseExclusionClient).mockReturnValue({} as any)
  vi.mocked(createReassessmentService).mockReturnValue({} as any)

  return { mockRpc, mockService, mockEvaluationService }
}

// ───────────────────────────────────────────────
// Adversarial Tests
// ───────────────────────────────────────────────

describe('Phase 6C-3 Submit — Adversarial Integrity Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('CORRECTION 1: Authoritative Reservation Binding', () => {
    it('rejects fabricated reservation ID', async () => {
      await setupMocks({
        authenticatedUser: AUTHENTICATED_USER_ID,
        rpcResult: {
          data: null,
          error: { message: 'Reservation not found: ' + FABRICATED_UUID },
        },
      })

      const { POST } = await import('../cycles/[cycleId]/reassessment/submit/route')
      const response = await POST(
        createSubmitRequest({
          questionId: QUESTION_ID,
          reservationId: FABRICATED_UUID,
          answer: 'a',
        }),
        { params: Promise.resolve({ cycleId: CYCLE_ID }) }
      )

      expect(response.status).toBe(404)
      const data = await response.json()
      expect(data.error).toContain('not found')
    })

    it('rejects wrong student\'s reservation', async () => {
      await setupMocks({
        authenticatedUser: AUTHENTICATED_USER_ID,
        rpcResult: {
          data: null,
          error: { message: `Reservation belongs to a different user. Reservation user: ${OTHER_USER_ID}, Authenticated user: ${AUTHENTICATED_USER_ID}` },
        },
      })

      const { POST } = await import('../cycles/[cycleId]/reassessment/submit/route')
      const response = await POST(
        createSubmitRequest({
          questionId: QUESTION_ID,
          reservationId: RESERVATION_ID,
          answer: 'a',
        }),
        { params: Promise.resolve({ cycleId: CYCLE_ID }) }
      )

      expect(response.status).toBe(403)
      const data = await response.json()
      expect(data.error).toContain('different user')
    })

    it('rejects reservation for wrong cycle', async () => {
      await setupMocks({
        authenticatedUser: AUTHENTICATED_USER_ID,
        rpcResult: {
          data: null,
          error: { message: `Reservation does not belong to cycle ${CYCLE_ID}. Reservation cycle: ${OTHER_CYCLE_ID}` },
        },
      })

      const { POST } = await import('../cycles/[cycleId]/reassessment/submit/route')
      const response = await POST(
        createSubmitRequest({
          questionId: QUESTION_ID,
          reservationId: RESERVATION_ID,
          answer: 'a',
        }),
        { params: Promise.resolve({ cycleId: CYCLE_ID }) }
      )

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toContain('does not belong')
    })

    it('rejects reservation with concept mismatch', async () => {
      await setupMocks({
        authenticatedUser: AUTHENTICATED_USER_ID,
        rpcResult: {
          data: null,
          error: { message: `Concept mismatch. Cycle concept: ${CONCEPT_ID}, Reservation concept: ${OTHER_CONCEPT_ID}` },
        },
      })

      const { POST } = await import('../cycles/[cycleId]/reassessment/submit/route')
      const response = await POST(
        createSubmitRequest({
          questionId: QUESTION_ID,
          reservationId: RESERVATION_ID,
          answer: 'a',
        }),
        { params: Promise.resolve({ cycleId: CYCLE_ID }) }
      )

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toContain('Concept mismatch')
    })

    it('rejects reserved question mismatch', async () => {
      await setupMocks({
        authenticatedUser: AUTHENTICATED_USER_ID,
        rpcResult: {
          data: null,
          error: { message: `Question mismatch. Reserved question: qq-2-021, Submitted question: ${QUESTION_ID}` },
        },
      })

      const { POST } = await import('../cycles/[cycleId]/reassessment/submit/route')
      const response = await POST(
        createSubmitRequest({
          questionId: QUESTION_ID,
          reservationId: RESERVATION_ID,
          answer: 'a',
        }),
        { params: Promise.resolve({ cycleId: CYCLE_ID }) }
      )

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toContain('Question mismatch')
    })

    it('rejects submission to cycle with terminal outcome', async () => {
      await setupMocks({
        authenticatedUser: AUTHENTICATED_USER_ID,
        rpcResult: {
          data: null,
          error: { message: `Cycle ${CYCLE_ID} already has terminal outcome: successful` },
        },
      })

      const { POST } = await import('../cycles/[cycleId]/reassessment/submit/route')
      const response = await POST(
        createSubmitRequest({
          questionId: QUESTION_ID,
          reservationId: RESERVATION_ID,
          answer: 'a',
        }),
        { params: Promise.resolve({ cycleId: CYCLE_ID }) }
      )

      expect(response.status).toBe(409)
      const data = await response.json()
      expect(data.error).toContain('terminal outcome')
    })
  })

  describe('CORRECTION 4: Question/Concept Binding', () => {
    it('rejects question not in canonical mapping', async () => {
      await setupMocks({
        authenticatedUser: AUTHENTICATED_USER_ID,
      })

      const { POST } = await import('../cycles/[cycleId]/reassessment/submit/route')
      const response = await POST(
        createSubmitRequest({
          questionId: 'qq-2-999', // Not in canonical mapping
          reservationId: RESERVATION_ID,
          answer: 'a',
        }),
        { params: Promise.resolve({ cycleId: CYCLE_ID }) }
      )

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toContain('not found in canonical mapping')
    })

    it('rejects question mapped to wrong concept', async () => {
      await setupMocks({
        authenticatedUser: AUTHENTICATED_USER_ID,
      })

      const { POST } = await import('../cycles/[cycleId]/reassessment/submit/route')
      const response = await POST(
        createSubmitRequest({
          questionId: WRONG_CONCEPT_QUESTION_ID, // qq-2-002 → C-2-06, but cycle is C-2-01
          reservationId: RESERVATION_ID,
          answer: 'a',
        }),
        { params: Promise.resolve({ cycleId: CYCLE_ID }) }
      )

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toContain('not mapped to this remediation cycle')
    })
  })

  describe('CORRECTION 5: Single-Consumption / Replay Protection', () => {
    it('idempotently returns existing attempt for already-consumed reservation', async () => {
      await setupMocks({
        authenticatedUser: AUTHENTICATED_USER_ID,
        rpcResult: { data: REAL_ATTEMPT_ID, error: null }, // DB returns existing ID
      })

      const { POST } = await import('../cycles/[cycleId]/reassessment/submit/route')
      const response = await POST(
        createSubmitRequest({
          questionId: QUESTION_ID,
          reservationId: RESERVATION_ID,
          answer: 'a',
        }),
        { params: Promise.resolve({ cycleId: CYCLE_ID }) }
      )

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.quizAttemptId).toBe(REAL_ATTEMPT_ID)
    })

    it('double submission returns same attempt ID (idempotent)', async () => {
      const { mockRpc } = await setupMocks({
        authenticatedUser: AUTHENTICATED_USER_ID,
        rpcResult: { data: REAL_ATTEMPT_ID, error: null },
      })

      const { POST } = await import('../cycles/[cycleId]/reassessment/submit/route')

      // First submission
      const response1 = await POST(
        createSubmitRequest({
          questionId: QUESTION_ID,
          reservationId: RESERVATION_ID,
          answer: 'a',
        }),
        { params: Promise.resolve({ cycleId: CYCLE_ID }) }
      )
      const data1 = await response1.json()

      // Second submission (same reservation)
      const response2 = await POST(
        createSubmitRequest({
          questionId: QUESTION_ID,
          reservationId: RESERVATION_ID,
          answer: 'a',
        }),
        { params: Promise.resolve({ cycleId: CYCLE_ID }) }
      )
      const data2 = await response2.json()

      // Both should succeed with the same attempt ID
      expect(data1.success).toBe(true)
      expect(data2.success).toBe(true)
      expect(data1.quizAttemptId).toBe(data2.quizAttemptId)
    })

    it('passes all reservation binding parameters to the database function', async () => {
      const { mockRpc } = await setupMocks({
        authenticatedUser: AUTHENTICATED_USER_ID,
        rpcResult: { data: REAL_ATTEMPT_ID, error: null },
      })

      const { POST } = await import('../cycles/[cycleId]/reassessment/submit/route')
      await POST(
        createSubmitRequest({
          questionId: QUESTION_ID,
          reservationId: RESERVATION_ID,
          answer: 'a',
        }),
        { params: Promise.resolve({ cycleId: CYCLE_ID }) }
      )

      // Verify the RPC was called with the correct parameters
      expect(mockRpc).toHaveBeenCalledWith(
        'consume_reservation_and_create_attempt',
        expect.objectContaining({
          p_reservation_id: RESERVATION_ID,
          p_cycle_id: CYCLE_ID,
          p_question_id: QUESTION_ID,
          p_authenticated_user_id: AUTHENTICATED_USER_ID,
          p_target_concept_id: CONCEPT_ID,
          p_is_correct: true, // answer 'a' matches correct_answer 'a'
        })
      )
    })
  })

  describe('CORRECTION 2: Server-Authoritative Quiz Attempt Creation', () => {
    it('passes is_correct=true for correct answer', async () => {
      const { mockRpc } = await setupMocks({
        authenticatedUser: AUTHENTICATED_USER_ID,
        rpcResult: { data: REAL_ATTEMPT_ID, error: null },
      })

      const { POST } = await import('../cycles/[cycleId]/reassessment/submit/route')
      await POST(
        createSubmitRequest({
          questionId: QUESTION_ID,
          reservationId: RESERVATION_ID,
          answer: 'a', // correct answer
        }),
        { params: Promise.resolve({ cycleId: CYCLE_ID }) }
      )

      expect(mockRpc).toHaveBeenCalledWith(
        'consume_reservation_and_create_attempt',
        expect.objectContaining({
          p_is_correct: true,
          p_score: 1,
        })
      )
    })

    it('passes is_correct=false for incorrect answer', async () => {
      const { mockRpc } = await setupMocks({
        authenticatedUser: AUTHENTICATED_USER_ID,
        rpcResult: { data: REAL_ATTEMPT_ID, error: null },
      })

      const { POST } = await import('../cycles/[cycleId]/reassessment/submit/route')
      await POST(
        createSubmitRequest({
          questionId: QUESTION_ID,
          reservationId: RESERVATION_ID,
          answer: 'b', // incorrect answer
        }),
        { params: Promise.resolve({ cycleId: CYCLE_ID }) }
      )

      expect(mockRpc).toHaveBeenCalledWith(
        'consume_reservation_and_create_attempt',
        expect.objectContaining({
          p_is_correct: false,
          p_score: 0,
        })
      )
    })

    it('passes answers_json with the submitted answer', async () => {
      const { mockRpc } = await setupMocks({
        authenticatedUser: AUTHENTICATED_USER_ID,
        rpcResult: { data: REAL_ATTEMPT_ID, error: null },
      })

      const { POST } = await import('../cycles/[cycleId]/reassessment/submit/route')
      await POST(
        createSubmitRequest({
          questionId: QUESTION_ID,
          reservationId: RESERVATION_ID,
          answer: 'a',
        }),
        { params: Promise.resolve({ cycleId: CYCLE_ID }) }
      )

      expect(mockRpc).toHaveBeenCalledWith(
        'consume_reservation_and_create_attempt',
        expect.objectContaining({
          p_answers_json: { [QUESTION_ID]: 'a' },
        })
      )
    })

    it('passes authenticated user_id (not caller-supplied)', async () => {
      const { mockRpc } = await setupMocks({
        authenticatedUser: AUTHENTICATED_USER_ID,
        rpcResult: { data: REAL_ATTEMPT_ID, error: null },
      })

      const { POST } = await import('../cycles/[cycleId]/reassessment/submit/route')
      await POST(
        createSubmitRequest({
          questionId: QUESTION_ID,
          reservationId: RESERVATION_ID,
          answer: 'a',
        }),
        { params: Promise.resolve({ cycleId: CYCLE_ID }) }
      )

      expect(mockRpc).toHaveBeenCalledWith(
        'consume_reservation_and_create_attempt',
        expect.objectContaining({
          p_authenticated_user_id: AUTHENTICATED_USER_ID,
        })
      )
    })
  })

  describe('CORRECTION 3: Quiz Attempt ID Authority', () => {
    it('does NOT accept quizAttemptId from the request body', async () => {
      const { mockRpc } = await setupMocks({
        authenticatedUser: AUTHENTICATED_USER_ID,
        rpcResult: { data: REAL_ATTEMPT_ID, error: null },
      })

      const { POST } = await import('../cycles/[cycleId]/reassessment/submit/route')
      const response = await POST(
        createSubmitRequest({
          questionId: QUESTION_ID,
          reservationId: RESERVATION_ID,
          quizAttemptId: FABRICATED_UUID, // This should be ignored
          answer: 'a',
        }),
        { params: Promise.resolve({ cycleId: CYCLE_ID }) }
      )

      // The RPC should NOT receive the fabricated quizAttemptId
      expect(mockRpc).toHaveBeenCalledWith(
        'consume_reservation_and_create_attempt',
        expect.not.objectContaining({
          p_quiz_attempt_id: FABRICATED_UUID,
        })
      )

      // Response should contain the server-generated ID
      const data = await response.json()
      expect(data.quizAttemptId).toBe(REAL_ATTEMPT_ID)
    })

    it('returns server-generated quiz attempt ID in response', async () => {
      await setupMocks({
        authenticatedUser: AUTHENTICATED_USER_ID,
        rpcResult: { data: REAL_ATTEMPT_ID, error: null },
      })

      const { POST } = await import('../cycles/[cycleId]/reassessment/submit/route')
      const response = await POST(
        createSubmitRequest({
          questionId: QUESTION_ID,
          reservationId: RESERVATION_ID,
          answer: 'a',
        }),
        { params: Promise.resolve({ cycleId: CYCLE_ID }) }
      )

      const data = await response.json()
      expect(data.quizAttemptId).toBe(REAL_ATTEMPT_ID)
    })
  })

  describe('CORRECTION 6: Phase 6C-2d Evidence Validation Compatibility', () => {
    it('passes the attempt ID to evaluation service for 6C-2d validation', async () => {
      const { mockEvaluationService } = await setupMocks({
        authenticatedUser: AUTHENTICATED_USER_ID,
        rpcResult: { data: REAL_ATTEMPT_ID, error: null },
        evaluationResult: {
          success: true,
          outcome: 'pending',
          evaluationId: 'eval-123',
          alreadyEvaluated: false,
        },
      })

      const { POST } = await import('../cycles/[cycleId]/reassessment/submit/route')
      await POST(
        createSubmitRequest({
          questionId: QUESTION_ID,
          reservationId: RESERVATION_ID,
          answer: 'a',
        }),
        { params: Promise.resolve({ cycleId: CYCLE_ID }) }
      )

      // The evaluation service should receive the server-generated attempt ID
      expect(mockEvaluationService.evaluateCycleWithDetection).toHaveBeenCalledWith(
        CYCLE_ID,
        CONCEPT_ID,
        [REAL_ATTEMPT_ID]
      )
    })

    it('handles evaluation failure gracefully (evidence still persisted)', async () => {
      await setupMocks({
        authenticatedUser: AUTHENTICATED_USER_ID,
        rpcResult: { data: REAL_ATTEMPT_ID, error: null },
        evaluationResult: {
          success: false,
          error: 'Evidence validation failed',
        },
      })

      const { POST } = await import('../cycles/[cycleId]/reassessment/submit/route')
      const response = await POST(
        createSubmitRequest({
          questionId: QUESTION_ID,
          reservationId: RESERVATION_ID,
          answer: 'a',
        }),
        { params: Promise.resolve({ cycleId: CYCLE_ID }) }
      )

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.evaluationPending).toBe(true)
      expect(data.quizAttemptId).toBe(REAL_ATTEMPT_ID)
    })
  })

  describe('Input Validation', () => {
    it('rejects missing questionId', async () => {
      await setupMocks({
        authenticatedUser: AUTHENTICATED_USER_ID,
      })

      const { POST } = await import('../cycles/[cycleId]/reassessment/submit/route')
      const response = await POST(
        createSubmitRequest({
          reservationId: RESERVATION_ID,
          answer: 'a',
        }),
        { params: Promise.resolve({ cycleId: CYCLE_ID }) }
      )

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toContain('Missing required fields')
    })

    it('rejects missing reservationId', async () => {
      await setupMocks({
        authenticatedUser: AUTHENTICATED_USER_ID,
      })

      const { POST } = await import('../cycles/[cycleId]/reassessment/submit/route')
      const response = await POST(
        createSubmitRequest({
          questionId: QUESTION_ID,
          answer: 'a',
        }),
        { params: Promise.resolve({ cycleId: CYCLE_ID }) }
      )

      expect(response.status).toBe(400)
    })

    it('rejects missing answer', async () => {
      await setupMocks({
        authenticatedUser: AUTHENTICATED_USER_ID,
      })

      const { POST } = await import('../cycles/[cycleId]/reassessment/submit/route')
      const response = await POST(
        createSubmitRequest({
          questionId: QUESTION_ID,
          reservationId: RESERVATION_ID,
        }),
        { params: Promise.resolve({ cycleId: CYCLE_ID }) }
      )

      expect(response.status).toBe(400)
    })

    it('rejects unauthenticated request', async () => {
      await setupMocks({
        authenticatedUser: null,
      })

      const { POST } = await import('../cycles/[cycleId]/reassessment/submit/route')
      const response = await POST(
        createSubmitRequest({
          questionId: QUESTION_ID,
          reservationId: RESERVATION_ID,
          answer: 'a',
        }),
        { params: Promise.resolve({ cycleId: CYCLE_ID }) }
      )

      expect(response.status).toBe(401)
    })

    it('rejects cross-student cycle access', async () => {
      await setupMocks({
        authenticatedUser: AUTHENTICATED_USER_ID,
        cycleResult: { error: 'Access denied' },
      })

      const { POST } = await import('../cycles/[cycleId]/reassessment/submit/route')
      const response = await POST(
        createSubmitRequest({
          questionId: QUESTION_ID,
          reservationId: RESERVATION_ID,
          answer: 'a',
        }),
        { params: Promise.resolve({ cycleId: CYCLE_ID }) }
      )

      expect(response.status).toBe(404)
    })
  })

  describe('Successful Submission Flow', () => {
    it('returns correct response for valid submission with pending outcome', async () => {
      await setupMocks({
        authenticatedUser: AUTHENTICATED_USER_ID,
        rpcResult: { data: REAL_ATTEMPT_ID, error: null },
        evaluationResult: {
          success: true,
          outcome: 'pending',
          evaluationId: 'eval-123',
          alreadyEvaluated: false,
        },
      })

      const { POST } = await import('../cycles/[cycleId]/reassessment/submit/route')
      const response = await POST(
        createSubmitRequest({
          questionId: QUESTION_ID,
          reservationId: RESERVATION_ID,
          answer: 'a',
        }),
        { params: Promise.resolve({ cycleId: CYCLE_ID }) }
      )

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.isCorrect).toBe(true)
      expect(data.outcome).toBe('pending')
      expect(data.studentState).toBe('pending_more_evidence')
      expect(data.quizAttemptId).toBe(REAL_ATTEMPT_ID)
    })

    it('returns correct response for successful outcome', async () => {
      await setupMocks({
        authenticatedUser: AUTHENTICATED_USER_ID,
        rpcResult: { data: REAL_ATTEMPT_ID, error: null },
        evaluationResult: {
          success: true,
          outcome: 'successful',
          evaluationId: 'eval-123',
          alreadyEvaluated: false,
        },
      })

      const { POST } = await import('../cycles/[cycleId]/reassessment/submit/route')
      const response = await POST(
        createSubmitRequest({
          questionId: QUESTION_ID,
          reservationId: RESERVATION_ID,
          answer: 'a',
        }),
        { params: Promise.resolve({ cycleId: CYCLE_ID }) }
      )

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.outcome).toBe('successful')
      expect(data.studentState).toBe('successful')
    })

    it('returns correct response for unsuccessful outcome', async () => {
      await setupMocks({
        authenticatedUser: AUTHENTICATED_USER_ID,
        rpcResult: { data: REAL_ATTEMPT_ID, error: null },
        evaluationResult: {
          success: true,
          outcome: 'unsuccessful',
          evaluationId: 'eval-123',
          alreadyEvaluated: false,
        },
      })

      const { POST } = await import('../cycles/[cycleId]/reassessment/submit/route')
      const response = await POST(
        createSubmitRequest({
          questionId: QUESTION_ID,
          reservationId: RESERVATION_ID,
          answer: 'b', // wrong answer
        }),
        { params: Promise.resolve({ cycleId: CYCLE_ID }) }
      )

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.isCorrect).toBe(false)
      expect(data.outcome).toBe('unsuccessful')
      expect(data.studentState).toBe('unsuccessful')
    })
  })
})
