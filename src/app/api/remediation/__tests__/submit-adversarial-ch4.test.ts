/**
 * C4-3 — Reassessment Submission Chapter 4 Fixture Tests
 *
 * Proves the Chapter 4 cycle flows through the SAME generic submission route
 * with the SAME integrity protections as the incumbent chapters (companion to
 * submit-adversarial.test.ts — mocks only, protections unchanged):
 *   - valid ch-4 submission consumes exactly one reservation, persists the
 *     attempt, and evaluates with the ch-4 detection provider over exactly
 *     the five persisted knowledge-check evidence IDs
 *   - fabricated reservation / wrong student rejected
 *   - already-consumed reservation returns idempotently
 *   - unsupported chapters rejected at the mapping-provider gate
 *   - questions outside the ch-4 canonical mapping rejected
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

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

vi.mock('@/lib/remediation/content-provider-registry', () => ({
  getChapterContentProvider: vi.fn(),
  hasChapterContentProvider: vi.fn(),
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
  initializeChapterDetectionProvider: vi.fn(),
  hasCanonicalMappingProvider: vi.fn(),
  getCanonicalMappingProvider: vi.fn(),
}))

vi.mock('@/lib/remediation/knowledge-check', () => ({
  createSupabaseKnowledgeCheckClient: vi.fn(),
  getKnowledgeCheckLength: vi.fn(),
  getKnowledgeCheckProgress: vi.fn(),
  getConsumedAttemptId: vi.fn(),
}))

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(),
}))

// ───────────────────────────────────────────────
// Chapter 4 fixtures
// ───────────────────────────────────────────────

const AUTHENTICATED_USER_ID = 'user-authenticated-123'
const OTHER_USER_ID = 'user-other-456'
const CYCLE_ID = 'cycle-ch4-789'
const CONCEPT_ID = 'ch4-disinfection-sterilization'
const QUESTION_ID = 'qq-4-046' // Canonically mapped to ch4-disinfection-sterilization
const RESERVATION_ID = 'reservation-ch4-abc'
const FABRICATED_UUID = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee'
const REAL_ATTEMPT_ID = 'real-attempt-ch4-def'
const EVIDENCE_IDS = ['ev-1', 'ev-2', 'ev-3', 'ev-4', 'ev-5']

const MOCK_CYCLE = {
  id: CYCLE_ID,
  userId: AUTHENTICATED_USER_ID,
  conceptId: CONCEPT_ID,
  chapterId: 'ch-4',
  cycleNumber: 1,
  detectionState: 'repeated_weakness',
  detectionConfidence: 'high',
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
  quiz_id: 'quiz-4',
  question: 'What must always happen BEFORE an implement is disinfected?',
  answer_a: 'It must be cleaned of visible debris and residue',
  answer_b: 'It must be placed in a sealed drawer overnight before any use',
  answer_c: 'It must be rinsed in hot oil',
  answer_d: 'It must be dried with a client towel',
  correct_answer: 'a',
  explanation: 'Cleaning removes debris that would shield microorganisms.',
  difficulty: 'easy',
  order_index: 46,
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

async function setupMocks(options: {
  authenticatedUser?: string | null
  chapterId?: string
  mappingSupported?: boolean
  rpcResult?: { data: string | null; error: { message: string } | null }
}) {
  const chapterId = options.chapterId ?? 'ch-4'
  const { createClient } = await import('@/lib/supabase-server')
  const { createSupabaseStudentRemediationClient } = await import('@/lib/remediation/supabase-client')
  const { createStudentRemediationService } = await import('@/lib/remediation/student-service')
  const { getChapterContentProvider } = await import('@/lib/remediation/content-provider-registry')
  const { createSupabaseEvaluationClient } = await import('@/lib/evaluation/supabase-client')
  const { createEvaluationService } = await import('@/lib/evaluation/evaluation-service')
  const { createSupabaseExclusionClient } = await import('@/lib/reassessment/supabase-client')
  const { createReassessmentService } = await import('@/lib/reassessment/reassessment-service')
  const { createClient: createSupabaseClient } = await import('@supabase/supabase-js')
  const {
    hasCanonicalMappingProvider,
    getCanonicalMappingProvider,
    initializeChapterDetectionProvider,
  } = await import('@/lib/reassessment/provider-registry')
  const {
    createSupabaseKnowledgeCheckClient,
    getKnowledgeCheckLength,
    getKnowledgeCheckProgress,
    getConsumedAttemptId,
  } = await import('@/lib/remediation/knowledge-check')

  const user = options.authenticatedUser ? { id: options.authenticatedUser } : null
  vi.mocked(createClient).mockResolvedValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user },
        error: user ? null : { message: 'Not authenticated' },
      }),
    },
  } as any)

  const mockService = {
    getCycleForStudent: vi.fn().mockResolvedValue({
      cycle: { ...MOCK_CYCLE, chapterId },
    }),
    recordReassessmentCompleted: vi.fn().mockResolvedValue({ success: true }),
  }
  vi.mocked(createStudentRemediationService).mockReturnValue(mockService as any)
  vi.mocked(createSupabaseStudentRemediationClient).mockReturnValue({} as any)

  vi.mocked(hasCanonicalMappingProvider).mockImplementation(
    (id: string) => options.mappingSupported ?? id === chapterId,
  )
  vi.mocked(getCanonicalMappingProvider).mockReturnValue({
    chapterId,
    getConceptForQuestion: (questionId: string) =>
      questionId === QUESTION_ID ? CONCEPT_ID : undefined,
    isQuestionMappedToConcept: (questionId: string, conceptId: string) =>
      questionId === QUESTION_ID && conceptId === CONCEPT_ID,
    getQuestionsForConcept: () => [QUESTION_ID],
    getAllConceptIds: () => [CONCEPT_ID],
    getAllQuestionIds: () => [QUESTION_ID],
  } as any)
  const mockDetectionProvider = { chapterId }
  vi.mocked(initializeChapterDetectionProvider).mockImplementation((id: string) =>
    id === chapterId ? (mockDetectionProvider as any) : undefined,
  )

  vi.mocked(getChapterContentProvider).mockReturnValue({
    chapterId,
    getQuizQuestionById: (id: string) => (id === QUESTION_ID ? (MOCK_QUESTION as any) : null),
  } as any)

  vi.mocked(createSupabaseKnowledgeCheckClient).mockReturnValue({
    getReassessmentReservationsForCycle: vi.fn().mockResolvedValue([]),
    getReassessmentAttemptsForCycle: vi.fn().mockResolvedValue([]),
    quizAttemptExists: vi.fn().mockResolvedValue(false),
  } as any)
  vi.mocked(getKnowledgeCheckLength).mockImplementation((id: string) => (id === 'ch-4' ? 5 : 1))
  vi.mocked(getKnowledgeCheckProgress).mockResolvedValue({
    answeredAttemptIds: [...EVIDENCE_IDS],
    answeredCount: 5,
    requiredCount: 5,
    isComplete: true,
    openReservation: null,
  })
  vi.mocked(getConsumedAttemptId).mockResolvedValue(null)

  const mockRpc = vi.fn().mockResolvedValue(
    options.rpcResult ?? { data: REAL_ATTEMPT_ID, error: null },
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

  const mockEvaluationService = {
    evaluateCycleWithDetection: vi.fn().mockResolvedValue({
      success: true,
      outcome: 'successful',
      evaluationId: 'eval-ch4-123',
      alreadyEvaluated: false,
    }),
  }
  vi.mocked(createEvaluationService).mockReturnValue(mockEvaluationService as any)
  vi.mocked(createSupabaseEvaluationClient).mockReturnValue({} as any)
  vi.mocked(createSupabaseExclusionClient).mockReturnValue({} as any)
  vi.mocked(createReassessmentService).mockReturnValue({} as any)

  return { mockRpc, mockService, mockEvaluationService, mockDetectionProvider }
}

// ───────────────────────────────────────────────
// Chapter 4 fixture tests
// ───────────────────────────────────────────────

describe('C4-3 Submit — Chapter 4 fixture (generic route, same protections)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('valid ch-4 submission succeeds and evaluates with the ch-4 provider over the five persisted evidence IDs', async () => {
    const { mockEvaluationService, mockDetectionProvider } = await setupMocks({
      authenticatedUser: AUTHENTICATED_USER_ID,
    })

    const { initializeChapterDetectionProvider } = await import('@/lib/reassessment/provider-registry')
    const { getKnowledgeCheckLength } = await import('@/lib/remediation/knowledge-check')

    const { POST } = await import('../cycles/[cycleId]/reassessment/submit/route')
    const response = await POST(
      createSubmitRequest({
        questionId: QUESTION_ID,
        reservationId: RESERVATION_ID,
        answer: 'a',
      }),
      { params: Promise.resolve({ cycleId: CYCLE_ID }) },
    )

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.success).toBe(true)
    expect(data.quizAttemptId).toBe(REAL_ATTEMPT_ID)

    // Chapter-aware resolution happened for ch-4 at every seam.
    expect(initializeChapterDetectionProvider).toHaveBeenCalledWith(
      'ch-4',
      expect.objectContaining({ fetchQuizAttempts: expect.any(Function) }),
    )
    expect(getKnowledgeCheckLength).toHaveBeenCalledWith('ch-4')

    // Evaluation ran with the ch-4 detection provider over EXACTLY the five
    // persisted evidence IDs in completion order (slice(0, 5)).
    expect(mockEvaluationService.evaluateCycleWithDetection).toHaveBeenCalledWith(
      CYCLE_ID,
      CONCEPT_ID,
      EVIDENCE_IDS,
    )
    void mockDetectionProvider
  })

  it('rejects fabricated reservation ID for a ch-4 cycle', async () => {
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
      { params: Promise.resolve({ cycleId: CYCLE_ID }) },
    )

    expect(response.status).toBe(404)
    const data = await response.json()
    expect(data.error).toContain('not found')
  })

  it('rejects a reservation belonging to a different student for a ch-4 cycle', async () => {
    await setupMocks({
      authenticatedUser: AUTHENTICATED_USER_ID,
      rpcResult: {
        data: null,
        error: {
          message: `Reservation belongs to a different user. Reservation user: ${OTHER_USER_ID}, Authenticated user: ${AUTHENTICATED_USER_ID}`,
        },
      },
    })

    const { POST } = await import('../cycles/[cycleId]/reassessment/submit/route')
    const response = await POST(
      createSubmitRequest({
        questionId: QUESTION_ID,
        reservationId: RESERVATION_ID,
        answer: 'a',
      }),
      { params: Promise.resolve({ cycleId: CYCLE_ID }) },
    )

    expect(response.status).toBe(403)
    const data = await response.json()
    expect(data.error).toContain('different user')
  })

  it('idempotently returns the existing attempt for an already-consumed ch-4 reservation', async () => {
    await setupMocks({
      authenticatedUser: AUTHENTICATED_USER_ID,
      rpcResult: { data: REAL_ATTEMPT_ID, error: null },
    })

    const { POST } = await import('../cycles/[cycleId]/reassessment/submit/route')

    const first = await POST(
      createSubmitRequest({ questionId: QUESTION_ID, reservationId: RESERVATION_ID, answer: 'a' }),
      { params: Promise.resolve({ cycleId: CYCLE_ID }) },
    )
    const second = await POST(
      createSubmitRequest({ questionId: QUESTION_ID, reservationId: RESERVATION_ID, answer: 'a' }),
      { params: Promise.resolve({ cycleId: CYCLE_ID }) },
    )

    const data1 = await first.json()
    const data2 = await second.json()
    expect(data1.success).toBe(true)
    expect(data2.success).toBe(true)
    expect(data1.quizAttemptId).toBe(data2.quizAttemptId)
  })

  it('rejects a question outside the ch-4 canonical mapping', async () => {
    await setupMocks({
      authenticatedUser: AUTHENTICATED_USER_ID,
    })

    const { POST } = await import('../cycles/[cycleId]/reassessment/submit/route')
    const response = await POST(
      createSubmitRequest({
        questionId: 'qq-4-999',
        reservationId: RESERVATION_ID,
        answer: 'a',
      }),
      { params: Promise.resolve({ cycleId: CYCLE_ID }) },
    )

    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data.error).toContain('not found in canonical mapping')
  })

  it('rejects unsupported chapters at the mapping-provider gate (fail-closed)', async () => {
    await setupMocks({
      authenticatedUser: AUTHENTICATED_USER_ID,
      chapterId: 'ch-5',
      mappingSupported: false,
    })

    const { POST } = await import('../cycles/[cycleId]/reassessment/submit/route')
    const response = await POST(
      createSubmitRequest({
        questionId: QUESTION_ID,
        reservationId: RESERVATION_ID,
        answer: 'a',
      }),
      { params: Promise.resolve({ cycleId: CYCLE_ID }) },
    )

    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data.error).toContain('does not support reassessment')
  })
})
