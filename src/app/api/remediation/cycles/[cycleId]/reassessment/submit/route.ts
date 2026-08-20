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
import { getQuizQuestionById } from '@/lib/remediation/content-filter'
import { initializeChapter2DetectionProvider } from '@/lib/reassessment/provider-registry'
import { STUDENT_STATE_LABELS, STUDENT_STATE_DESCRIPTIONS } from '@/lib/remediation/student-service'
import type { StudentRemediationState } from '@/lib/remediation/student-service'
import { chapter2QuizQuestionMappings } from '@/lib/chapter-2-concepts/mappings'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

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

    // CORRECTION 4: Verify question→concept binding against canonical mapping
    // The reserved question must be canonically mapped to the cycle's concept
    const canonicalMapping = chapter2QuizQuestionMappings.find(
      (m) => m.questionId === questionId
    )
    if (!canonicalMapping) {
      return NextResponse.json(
        { error: 'Question not found in canonical mapping' },
        { status: 400 }
      )
    }
    if (canonicalMapping.conceptId !== cycle.conceptId) {
      return NextResponse.json(
        { error: 'Question is not mapped to this remediation cycle\'s concept' },
        { status: 400 }
      )
    }

    // Verify the question exists in the question bank and get the correct answer
    const question = getQuizQuestionById(questionId)
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

    const { data: attemptId, error: consumeError } = await supabaseAdmin.rpc(
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

    if (!attemptId) {
      return NextResponse.json(
        { error: 'Failed to persist reassessment evidence' },
        { status: 500 }
      )
    }

    // Record reassessment completed
    await service.recordReassessmentCompleted(cycleId, user.id)

    // Initialize the Chapter 2 detection provider for evaluation
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

    initializeChapter2DetectionProvider({ fetchQuizAttempts })

    // Create evaluation service
    const evaluationDbClient = createSupabaseEvaluationClient()
    const evaluationService = createEvaluationService(evaluationDbClient)

    // Run the evaluation using the detection provider
    // CORRECTION 6: The evidence now satisfies 6C-2d validate_evaluation_evidence()
    // because the quiz_attempt was created with is_reassessment=true,
    // remediation_cycle_id=cycleId, and target_concept_id=cycle.conceptId
    const evaluationResult = await evaluationService.evaluateCycleWithDetection(
      cycleId,
      cycle.conceptId,
      [attemptId]
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
