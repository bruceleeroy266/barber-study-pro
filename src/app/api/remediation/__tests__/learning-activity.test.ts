/**
 * Phase P1/P2 — Learning-Activity Wiring Tests
 *
 * Proves that meaningful Chapter 2 remediation/reassessment activity advances
 * the student's learning-activity timestamp through the shared server-side
 * mechanism (recordLearningActivity), and that nothing else does:
 *
 *   - POST events (review_started / content_viewed / flashcard_reviewed /
 *     review_completed) → learning activity recorded for the cycle's chapter
 *   - POST reassessment (knowledge check started) → recorded
 *   - POST reassessment/submit (answer submitted) → recorded
 *   - Invalid/unauthenticated/failed requests → NOT recorded
 *   - Pool-exhausted reservation (no knowledge check started) → NOT recorded
 *   - Failed reservation consumption → NOT recorded
 *
 * The mechanism itself is unit-tested in src/lib/learning-activity.test.ts.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// ── Mocks (before route imports) ────────────────────────────────────────────

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

vi.mock('@/lib/chapter-2-concepts/mappings', () => ({
  chapter2QuizQuestionMappings: [
    { questionId: 'q-1', conceptId: 'C-2-01' },
  ],
}))

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(),
}))

vi.mock('@/lib/learning-activity', () => ({
  recordLearningActivity: vi.fn().mockResolvedValue({ ok: true }),
}))

// ── Imports under test ──────────────────────────────────────────────────────

import { createClient } from '@/lib/supabase-server'
import { createSupabaseStudentRemediationClient } from '@/lib/remediation/supabase-client'
import { createStudentRemediationService } from '@/lib/remediation/student-service'
import { getQuizQuestionById } from '@/lib/remediation/content-filter'
import { createReassessmentService } from '@/lib/reassessment/reassessment-service'
import { createEvaluationService } from '@/lib/evaluation/evaluation-service'
import { createClient as createSupabaseJsClient } from '@supabase/supabase-js'
import { recordLearningActivity } from '@/lib/learning-activity'

// ── Constants ───────────────────────────────────────────────────────────────

const USER_ID = 'user-123'
const CYCLE_ID = 'cycle-1'
const CYCLE = {
  id: CYCLE_ID,
  userId: USER_ID,
  conceptId: 'C-2-01',
  chapterId: 'ch-2',
  status: 'review_completed',
}

function mockAuth(user: { id: string } | null) {
  const supabaseServerClient = {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user }, error: null }),
    },
  }
  vi.mocked(createClient).mockResolvedValue(supabaseServerClient as never)
  return supabaseServerClient
}

function jsonPost(url: string, body: unknown): NextRequest {
  return new NextRequest(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

// ── Events route ────────────────────────────────────────────────────────────

describe('POST /api/remediation/cycles/[cycleId]/events — learning activity', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(recordLearningActivity).mockResolvedValue({ ok: true })
  })

  function setupService(overrides: Record<string, unknown> = {}) {
    const dbClient = {
      getCycleById: vi.fn().mockResolvedValue(CYCLE),
    }
    const service = {
      startReview: vi.fn().mockResolvedValue({ success: true }),
      markContentViewed: vi.fn().mockResolvedValue({ success: true }),
      markFlashcardReviewed: vi.fn().mockResolvedValue({ success: true }),
      completeReview: vi.fn().mockResolvedValue({ success: true }),
      ...overrides,
    }
    vi.mocked(createSupabaseStudentRemediationClient).mockReturnValue(dbClient as never)
    vi.mocked(createStudentRemediationService).mockReturnValue(service as never)
    return { dbClient, service }
  }

  it.each([
    ['review_started', {}],
    ['content_viewed', { assetId: 'block-1' }],
    ['flashcard_reviewed', { assetId: 'fc-1' }],
    ['review_completed', {}],
  ])('records learning activity on %s', async (eventType, extra) => {
    const supabaseServerClient = mockAuth({ id: USER_ID })
    setupService()

    const { POST } = await import('../cycles/[cycleId]/events/route')
    const response = await POST(
      jsonPost(`http://localhost/api/remediation/cycles/${CYCLE_ID}/events`, { eventType, ...extra }),
      { params: Promise.resolve({ cycleId: CYCLE_ID }) }
    )

    expect(response.status).toBe(200)
    expect(recordLearningActivity).toHaveBeenCalledTimes(1)
    expect(recordLearningActivity).toHaveBeenCalledWith(
      supabaseServerClient,
      USER_ID,
      'ch-2'
    )
  })

  it('does not record learning activity when the event handling fails', async () => {
    mockAuth({ id: USER_ID })
    setupService({ startReview: vi.fn().mockResolvedValue({ success: false, error: 'Review cannot be started at this time' }) })

    const { POST } = await import('../cycles/[cycleId]/events/route')
    const response = await POST(
      jsonPost(`http://localhost/api/remediation/cycles/${CYCLE_ID}/events`, { eventType: 'review_started' }),
      { params: Promise.resolve({ cycleId: CYCLE_ID }) }
    )

    expect(response.status).toBe(400)
    expect(recordLearningActivity).not.toHaveBeenCalled()
  })

  it('does not record learning activity for an invalid event type', async () => {
    mockAuth({ id: USER_ID })
    setupService()

    const { POST } = await import('../cycles/[cycleId]/events/route')
    const response = await POST(
      jsonPost(`http://localhost/api/remediation/cycles/${CYCLE_ID}/events`, { eventType: 'page_opened' }),
      { params: Promise.resolve({ cycleId: CYCLE_ID }) }
    )

    expect(response.status).toBe(400)
    expect(recordLearningActivity).not.toHaveBeenCalled()
  })

  it('does not record learning activity when unauthenticated', async () => {
    mockAuth(null)
    setupService()

    const { POST } = await import('../cycles/[cycleId]/events/route')
    const response = await POST(
      jsonPost(`http://localhost/api/remediation/cycles/${CYCLE_ID}/events`, { eventType: 'review_started' }),
      { params: Promise.resolve({ cycleId: CYCLE_ID }) }
    )

    expect(response.status).toBe(401)
    expect(recordLearningActivity).not.toHaveBeenCalled()
  })
})

// ── Reassessment reservation route ──────────────────────────────────────────

describe('POST /api/remediation/cycles/[cycleId]/reassessment — learning activity', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(recordLearningActivity).mockResolvedValue({ ok: true })
  })

  function setup(reservationResult: unknown) {
    const service = {
      isReassessmentAvailable: vi.fn().mockResolvedValue({ available: true }),
      getCycleForStudent: vi.fn().mockResolvedValue({ cycle: CYCLE, assignments: [] }),
      recordReassessmentStarted: vi.fn().mockResolvedValue({ success: true }),
    }
    vi.mocked(createSupabaseStudentRemediationClient).mockReturnValue({} as never)
    vi.mocked(createStudentRemediationService).mockReturnValue(service as never)
    vi.mocked(createReassessmentService).mockReturnValue({
      selectAndReserveQuestion: vi.fn().mockResolvedValue(reservationResult),
    } as never)
    vi.mocked(getQuizQuestionById).mockReturnValue({
      id: 'q-1',
      quiz_id: 'quiz-2',
      question: 'Question?',
      answer_a: 'A',
      answer_b: 'B',
      answer_c: 'C',
      answer_d: 'D',
      correct_answer: 'a',
      explanation: null,
    } as never)
    return service
  }

  it('records learning activity when a knowledge check is successfully started', async () => {
    const supabaseServerClient = mockAuth({ id: USER_ID })
    setup({ success: true, questionId: 'q-1', reservationId: 'res-1' })

    const { POST } = await import('../cycles/[cycleId]/reassessment/route')
    const response = await POST(
      jsonPost(`http://localhost/api/remediation/cycles/${CYCLE_ID}/reassessment`, {}),
      { params: Promise.resolve({ cycleId: CYCLE_ID }) }
    )

    expect(response.status).toBe(200)
    expect(recordLearningActivity).toHaveBeenCalledTimes(1)
    expect(recordLearningActivity).toHaveBeenCalledWith(
      supabaseServerClient,
      USER_ID,
      'ch-2'
    )
  })

  it('does not record learning activity when the question pool is exhausted (no knowledge check started)', async () => {
    mockAuth({ id: USER_ID })
    setup({ success: false, poolExhaustion: { isExhausted: true } })

    const { POST } = await import('../cycles/[cycleId]/reassessment/route')
    const response = await POST(
      jsonPost(`http://localhost/api/remediation/cycles/${CYCLE_ID}/reassessment`, {}),
      { params: Promise.resolve({ cycleId: CYCLE_ID }) }
    )

    expect(response.status).toBe(200)
    expect(recordLearningActivity).not.toHaveBeenCalled()
  })
})

// ── Reassessment submission route ───────────────────────────────────────────

describe('POST /api/remediation/cycles/[cycleId]/reassessment/submit — learning activity', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(recordLearningActivity).mockResolvedValue({ ok: true })
  })

  function setup(rpcResult: { data: unknown; error: { message: string } | null }) {
    const service = {
      getCycleForStudent: vi.fn().mockResolvedValue({ cycle: CYCLE, assignments: [] }),
      recordReassessmentCompleted: vi.fn().mockResolvedValue({ success: true }),
    }
    vi.mocked(createSupabaseStudentRemediationClient).mockReturnValue({} as never)
    vi.mocked(createStudentRemediationService).mockReturnValue(service as never)
    vi.mocked(getQuizQuestionById).mockReturnValue({
      id: 'q-1',
      quiz_id: 'quiz-2',
      question: 'Question?',
      answer_a: 'A',
      answer_b: 'B',
      answer_c: 'C',
      answer_d: 'D',
      correct_answer: 'a',
      explanation: null,
    } as never)
    vi.mocked(createSupabaseJsClient).mockReturnValue({
      rpc: vi.fn().mockResolvedValue(rpcResult),
      from: vi.fn(),
    } as never)
    vi.mocked(createEvaluationService).mockReturnValue({
      evaluateCycleWithDetection: vi.fn().mockResolvedValue({
        success: true,
        outcome: 'successful',
        evaluationId: 'eval-1',
        alreadyEvaluated: false,
      }),
    } as never)
    return service
  }

  it('records learning activity when a knowledge-check answer is successfully submitted', async () => {
    const supabaseServerClient = mockAuth({ id: USER_ID })
    setup({ data: 'attempt-1', error: null })

    const { POST } = await import('../cycles/[cycleId]/reassessment/submit/route')
    const response = await POST(
      jsonPost(`http://localhost/api/remediation/cycles/${CYCLE_ID}/reassessment/submit`, {
        questionId: 'q-1',
        reservationId: 'res-1',
        answer: 'a',
      }),
      { params: Promise.resolve({ cycleId: CYCLE_ID }) }
    )

    expect(response.status).toBe(200)
    expect(recordLearningActivity).toHaveBeenCalledTimes(1)
    expect(recordLearningActivity).toHaveBeenCalledWith(
      supabaseServerClient,
      USER_ID,
      'ch-2'
    )
  })

  it('does not record learning activity when reservation consumption fails', async () => {
    mockAuth({ id: USER_ID })
    setup({ data: null, error: { message: 'Reservation not found' } })

    const { POST } = await import('../cycles/[cycleId]/reassessment/submit/route')
    const response = await POST(
      jsonPost(`http://localhost/api/remediation/cycles/${CYCLE_ID}/reassessment/submit`, {
        questionId: 'q-1',
        reservationId: 'res-bogus',
        answer: 'a',
      }),
      { params: Promise.resolve({ cycleId: CYCLE_ID }) }
    )

    expect(response.status).toBe(404)
    expect(recordLearningActivity).not.toHaveBeenCalled()
  })
})
