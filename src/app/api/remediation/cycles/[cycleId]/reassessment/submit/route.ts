/**
 * Phase 6C-3 — Reassessment Submission API Route (CORRECTED)
 *
 * POST /api/remediation/cycles/[cycleId]/reassessment/submit
 *
 * Submits a reassessment answer, persists legitimate reassessment evidence,
 * and triggers the Phase 6C-2d evaluation service.
 *
 * CORRECTED Security/Integrity:
 *   - CORRECTION 1: Reservation is independently retrieved and validated from
 *     persisted reassessment_question_history. No caller-supplied identifier
 *     is trusted as proof of legitimacy.
 *   - CORRECTION 2: Quiz attempt is created server-side with all fields
 *     required by 6C-2d evidence validation (is_reassessment, remediation_cycle_id,
 *     target_concept_id, completed_at, answers_json).
 *   - CORRECTION 3: Quiz attempt ID is server/database-generated. The
 *     pre-allocated reservation UUID is replaced with the real attempt ID.
 *   - CORRECTION 4: Question→concept binding is verified against the canonical
 *     Chapter 2 mapping before accepting the answer.
 *   - CORRECTION 5: Single-consumption is enforced atomically at the database
 *     level via consume_reservation_and_create_attempt(). Replay returns the
 *     existing attempt ID idempotently.
 *   - CORRECTION 6: Evidence satisfies the existing 6C-2d validation contract.
 *     validate_evaluation_evidence() is NOT weakened.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { createSupabaseStudentRemediationClient } from '@/lib/remediation/supabase-client'
import { createStudentRemediationService } from '@/lib/remediation/student-service'
import { createSupabaseEvaluationClient } from '@/lib/evaluation/supabase-client'
import { createEvaluationService } from '@/lib/evaluation/evaluation-service'
import { createSupabaseExclusionClient } from '@/lib/reassessment/supabase-client'
import { createReassessmentService } from '@/lib/reassessment/reassessment-service'
import { getChapterContentProvider } from '@/lib/remediation/content-provider-registry'
import {
  createSupabaseKnowledgeCheckClient,
  getKnowledgeCheckLength,
  getKnowledgeCheckProgress,
  getConsumedAttemptId,
} from '@/lib/remediation/knowledge-check'
import {
  hasCanonicalMappingProvider,
  getCanonicalMappingProvider,
  initializeChapterDetectionProvider,
} from '@/lib/reassessment/provider-registry'
import { STUDENT_STATE_LABELS, STUDENT_STATE_DESCRIPTIONS } from '@/lib/remediation/student-service'
import type { StudentRemediationState } from '@/lib/remediation/student-service'
import { recordLearningActivity } from '@/lib/learning-activity'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { buildChapter8PersistedReassessmentEvent } from '@/lib/chapter-8-concepts/reassessment-evidence'
import type { Chapter8ConceptFamilyId } from '@/lib/chapter-8-concepts/types'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ cycleId: string }> }
) {
  try {
    const { cycleId } = await params
    const body = await request.json()
    const { questionId, reservationId, answer } = body

    // Validate required fields — quizAttemptId is NO LONGER accepted from caller
    if (!questionId || !reservationId || !answer) {
      return NextResponse.json(
        { error: 'Missing required fields: questionId, reservationId, answer' },
        { status: 400 }
      )
    }

    // Authenticate
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Create services
    const dbClient = createSupabaseStudentRemediationClient()
    const service = createStudentRemediationService(dbClient)

    // Verify cycle ownership — authoritative cycle data from persisted state
    const cycleResult = await service.getCycleForStudent(cycleId, user.id)
    if ('error' in cycleResult) {
      return NextResponse.json(
        { error: cycleResult.error },
        { status: 404 }
      )
    }

    const { cycle } = cycleResult

    // Chapter awareness (C3-3): all canonical resolution below is driven by
    // cycle.chapterId. Unsupported chapters fail closed.
    if (!hasCanonicalMappingProvider(cycle.chapterId)) {
      return NextResponse.json(
        { error: `Chapter ${cycle.chapterId} does not support reassessment` },
        { status: 400 }
      )
    }

    const contentProvider = getChapterContentProvider(cycle.chapterId)
    if (!contentProvider) {
      return NextResponse.json(
        { error: `Chapter ${cycle.chapterId} does not support reassessment` },
        { status: 400 }
      )
    }

    // CORRECTION 4: Verify question→concept binding against the canonical
    // mapping for the cycle's chapter (resolved from cycle.chapterId — no
    // direct chapter-2 mapping assumptions).
    const mappingProvider = getCanonicalMappingProvider(cycle.chapterId)
    if (!mappingProvider.getConceptForQuestion(questionId)) {
      return NextResponse.json(
        { error: 'Question not found in canonical mapping' },
        { status: 400 }
      )
    }
    if (!mappingProvider.isQuestionMappedToConcept(questionId, cycle.conceptId)) {
      return NextResponse.json(
        { error: 'Question is not mapped to this remediation cycle\'s concept' },
        { status: 400 }
      )
    }

    // Verify the question exists in the chapter's question bank and get the correct answer
    const question = contentProvider.getQuizQuestionById(questionId)
    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      )
    }

    // Determine if the answer is correct
    const isCorrect = answer === question.correct_answer

    // CORRECTIONS 1+2+3+5: Atomically validate reservation, create quiz attempt,
    // and consume the reservation — all at the database level.
    //
    // The database function:
    //   1. Retrieves and locks the reservation from reassessment_question_history
    //   2. Validates: exists, belongs to user, belongs to cycle, references question,
    //      not already consumed, cycle not terminal
    //   3. Creates quiz_attempts with server-generated ID and all 6C-2d fields
    //   4. Updates reservation with real quiz_attempt_id and is_correct
    //   5. Returns the real server-generated quiz attempt ID
    //
    // Idempotent: if already consumed, returns the existing attempt ID.

    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    )

    // Knowledge-check sequencing (C3-3 stages 5–6).
    const knowledgeCheckClient = createSupabaseKnowledgeCheckClient()
    const requiredCount = getKnowledgeCheckLength(cycle.chapterId)

    // Application-layer replay idempotency (C3-3 stage 6): if this reservation
    // is already consumed — including a consumed WRONG answer, which the
    // database function cannot distinguish from open — return the persisted
    // attempt instead of creating a duplicate.
    const cycleReservations = await knowledgeCheckClient.getReassessmentReservationsForCycle(
      cycleId,
      user.id
    )
    const existingAttemptId = await getConsumedAttemptId(
      knowledgeCheckClient,
      cycleReservations,
      reservationId
    )

    let attemptId: string | null = existingAttemptId
    const attemptWasReplay = !!existingAttemptId

    if (!attemptId) {
      const { data: consumedAttemptId, error: consumeError } = await supabaseAdmin.rpc(
        'consume_reservation_and_create_attempt',
        {
          p_reservation_id: reservationId,
          p_cycle_id: cycleId,
          p_question_id: questionId,
          p_authenticated_user_id: user.id,
          p_quiz_id: question.quiz_id,
          p_answers_json: { [questionId]: answer },
          p_score: isCorrect ? 1 : 0,
          p_total_questions: 1,
          p_is_correct: isCorrect,
          p_target_concept_id: cycle.conceptId,
        }
      )

      if (consumeError) {
        console.error('[Remediation API] Reservation consumption failed:', consumeError)

        // Map specific validation errors to appropriate status codes
        const message = consumeError.message || 'Reservation validation failed'

        if (message.includes('not found')) {
          return NextResponse.json({ error: message }, { status: 404 })
        }
        if (message.includes('different user') || message.includes('Access denied')) {
          return NextResponse.json({ error: message }, { status: 403 })
        }
        if (message.includes('terminal outcome')) {
          return NextResponse.json({ error: message }, { status: 409 })
        }
        if (message.includes('mismatch') || message.includes('does not belong')) {
          return NextResponse.json({ error: message }, { status: 400 })
        }

        return NextResponse.json({ error: message }, { status: 400 })
      }

      attemptId = consumedAttemptId
    }

    if (!attemptId) {
      return NextResponse.json(
        { error: 'Failed to persist reassessment evidence' },
        { status: 500 }
      )
    }

    if (cycle.chapterId === 'ch-8' && !attemptWasReplay) {
      const evidenceEvent = buildChapter8PersistedReassessmentEvent({
        attemptId,
        questionId,
        conceptFamilyId: cycle.conceptId as Chapter8ConceptFamilyId,
        correct: isCorrect,
        answeredAt: new Date().toISOString(),
      })

      await service.recordCycleEvent(
        cycleId,
        'chapter8_remediation_reassessment_evidence',
        evidenceEvent,
      )
    }

    // Learning-activity tracking: submitting a knowledge-check answer is
    // meaningful learning work. Advance last_studied_at via the shared
    // server-side mechanism (student-scoped client, RLS). Never blocks.
    await recordLearningActivity(supabase, user.id, cycle.chapterId)

    // Knowledge-check progress from persisted state (C3-3 stage 5).
    const kcProgress = await getKnowledgeCheckProgress(
      knowledgeCheckClient,
      cycleId,
      user.id,
      requiredCount
    )

    // Questions 1..(N-1): record evidence ONLY — no evaluation, no cycle
    // completion. The cycle must not terminally evaluate mid-sequence.
    if (kcProgress.answeredCount < requiredCount) {
      return NextResponse.json({
        success: true,
        isCorrect,
        outcome: 'pending',
        studentState: 'pending_more_evidence',
        studentStateLabel: STUDENT_STATE_LABELS.pending_more_evidence,
        studentStateDescription: STUDENT_STATE_DESCRIPTIONS.pending_more_evidence,
        knowledgeCheck: {
          answeredCount: kcProgress.answeredCount,
          totalQuestions: requiredCount,
          nextQuestionNumber: kcProgress.answeredCount + 1,
        },
        quizAttemptId: attemptId,
        message: 'Your answer has been recorded. Continue to the next question.',
      })
    }

    // The knowledge check is complete — record completion ONCE, then evaluate
    // with ALL persisted reassessment attempts for this cycle as the evidence set.
    await service.recordReassessmentCompleted(cycleId, user.id)

    // Initialize the chapter's detection provider for evaluation (C3-3:
    // resolved from cycle.chapterId instead of hard-coding Chapter 2).
    const exclusionDbClient = createSupabaseExclusionClient()
    const reassessmentService = createReassessmentService(exclusionDbClient, cycle.chapterId)

    // Initialize detection provider with a fetch callback
    const fetchQuizAttempts = async (attemptIds: string[]) => {
      const { data } = await supabaseAdmin
        .from('quiz_attempts')
        .select('*')
        .in('id', attemptIds)
        .order('completed_at', { ascending: true })
      return data || []
    }

    const detectionProvider = initializeChapterDetectionProvider(cycle.chapterId, { fetchQuizAttempts })
    if (!detectionProvider) {
      return NextResponse.json(
        { error: `Chapter ${cycle.chapterId} does not support reassessment` },
        { status: 400 }
      )
    }

    // Create evaluation service WITH the resolved detection provider.
    // C3-3 fix: the provider is actually supplied here — previously the
    // service was constructed without it, so evaluateCycleWithDetection could
    // never run and every submission remained permanently pending.
    const evaluationDbClient = createSupabaseEvaluationClient()
    const evaluationService = createEvaluationService(evaluationDbClient, detectionProvider)

    // Run the evaluation using the detection provider, with the complete
    // persisted evidence set for this knowledge check (N attempt IDs in
    // completion order — exactly one for Chapter 2, five for Chapter 3).
    // CORRECTION 6: The evidence now satisfies 6C-2d validate_evaluation_evidence()
    // because the quiz_attempt was created with is_reassessment=true,
    // remediation_cycle_id=cycleId, and target_concept_id=cycle.conceptId
    const evidenceIds = kcProgress.answeredAttemptIds.slice(0, requiredCount)
    const evaluationResult = await evaluationService.evaluateCycleWithDetection(
      cycleId,
      cycle.conceptId,
      evidenceIds
    )

    if (!evaluationResult.success) {
      console.error('[Remediation API] Evaluation failed:', evaluationResult.error)
      // Don't fail the submission — the evidence is persisted
      // The evaluation can be retried later
      return NextResponse.json({
        success: true,
        isCorrect,
        outcome: 'pending',
        studentState: 'pending_evaluation',
        studentStateLabel: STUDENT_STATE_LABELS.pending_evaluation,
        studentStateDescription: STUDENT_STATE_DESCRIPTIONS.pending_evaluation,
        evaluationPending: true,
        knowledgeCheck: {
          answeredCount: kcProgress.answeredCount,
          totalQuestions: requiredCount,
        },
        quizAttemptId: attemptId,
        message: 'Your answer has been recorded. Evaluation is pending.',
      })
    }

    // Map outcome to student state
    let studentState: StudentRemediationState
    switch (evaluationResult.outcome) {
      case 'successful':
        studentState = 'successful'
        break
      case 'unsuccessful':
        studentState = 'unsuccessful'
        break
      case 'pending':
      default:
        studentState = 'pending_more_evidence'
        break
    }

    return NextResponse.json({
      success: true,
      isCorrect,
      outcome: evaluationResult.outcome,
      studentState,
      studentStateLabel: STUDENT_STATE_LABELS[studentState],
      studentStateDescription: STUDENT_STATE_DESCRIPTIONS[studentState],
      evaluationId: evaluationResult.evaluationId,
      alreadyEvaluated: evaluationResult.alreadyEvaluated,
      knowledgeCheck: {
        answeredCount: kcProgress.answeredCount,
        totalQuestions: requiredCount,
      },
      quizAttemptId: attemptId,
    })
  } catch (error) {
    console.error('[Remediation API] Error submitting reassessment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
