/**
 * Phase 6C-3 — Reassessment Reservation API Route
 *
 * POST /api/remediation/cycles/[cycleId]/reassessment
 *
 * Starts a reassessment by reserving a question via selectAndReserveQuestion().
 * Server-side authorization: student must own the cycle.
 * Targeted review must be completed before reassessment.
 * No clock-based cooldown.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { createSupabaseStudentRemediationClient } from '@/lib/remediation/supabase-client'
import { createStudentRemediationService } from '@/lib/remediation/student-service'
import { createSupabaseExclusionClient } from '@/lib/reassessment/supabase-client'
import { createReassessmentService } from '@/lib/reassessment/reassessment-service'
import { getChapterContentProvider } from '@/lib/remediation/content-provider-registry'
import {
  createSupabaseKnowledgeCheckClient,
  getKnowledgeCheckLength,
  getKnowledgeCheckProgress,
} from '@/lib/remediation/knowledge-check'
import { STUDENT_STATE_LABELS, STUDENT_STATE_DESCRIPTIONS } from '@/lib/remediation/student-service'
import { recordLearningActivity } from '@/lib/learning-activity'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ cycleId: string }> }
) {
  try {
    const { cycleId } = await params

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

    // Verify cycle ownership and reassessment availability
    const availability = await service.isReassessmentAvailable(cycleId, user.id)
    if (!availability.available) {
      return NextResponse.json(
        { error: availability.error },
        { status: 400 }
      )
    }

    // Get cycle to extract concept/chapter
    const cycleResult = await service.getCycleForStudent(cycleId, user.id)
    if ('error' in cycleResult) {
      return NextResponse.json(
        { error: cycleResult.error },
        { status: 404 }
      )
    }

    const { cycle } = cycleResult

    // Chapter awareness (C3-3): resolve the content provider for the cycle's
    // chapter. Unsupported chapters fail closed.
    const contentProvider = getChapterContentProvider(cycle.chapterId)
    if (!contentProvider) {
      return NextResponse.json(
        { error: `Chapter ${cycle.chapterId} does not support reassessment` },
        { status: 400 }
      )
    }

    // Knowledge-check sequencing (C3-3 stages 5–6): progress derives from
    // persisted evidence only, so reload/replay is safe and idempotent.
    const knowledgeCheckClient = createSupabaseKnowledgeCheckClient()
    const requiredCount = getKnowledgeCheckLength(cycle.chapterId)
    const kcProgress = await getKnowledgeCheckProgress(
      knowledgeCheckClient,
      cycleId,
      user.id,
      requiredCount
    )

    // The knowledge check is already complete — never reserve beyond it.
    if (kcProgress.isComplete) {
      return NextResponse.json(
        {
          success: false,
          knowledgeCheckComplete: true,
          knowledgeCheck: {
            questionNumber: kcProgress.answeredCount,
            totalQuestions: requiredCount,
            answeredCount: kcProgress.answeredCount,
          },
          error: 'The knowledge check for this focus area is already complete.',
        },
        { status: 409 }
      )
    }

    // Idempotent replay (C3-3 stage 6): an open (reserved-but-not-consumed)
    // reservation returns the SAME question instead of reserving a new one.
    // Reloading mid-check can never duplicate questions or lose one from the pool.
    if (kcProgress.openReservation) {
      const openQuestion = contentProvider.getQuizQuestionById(
        kcProgress.openReservation.questionId
      )
      if (!openQuestion) {
        return NextResponse.json(
          { error: 'Reserved question not found in question bank' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        replayed: true,
        questionId: kcProgress.openReservation.questionId,
        reservationId: kcProgress.openReservation.reservationId,
        question: {
          id: openQuestion.id,
          question: openQuestion.question,
          answer_a: openQuestion.answer_a,
          answer_b: openQuestion.answer_b,
          answer_c: openQuestion.answer_c,
          answer_d: openQuestion.answer_d,
          explanation: openQuestion.explanation,
        },
        knowledgeCheck: {
          questionNumber: kcProgress.answeredCount + 1,
          totalQuestions: requiredCount,
          answeredCount: kcProgress.answeredCount,
        },
        studentState: 'reassessment_in_progress',
        studentStateLabel: STUDENT_STATE_LABELS.reassessment_in_progress,
        studentStateDescription: STUDENT_STATE_DESCRIPTIONS.reassessment_in_progress,
      })
    }

    // Create a placeholder quiz attempt ID for the reservation.
    // CORRECTION 3: This UUID is a reservation placeholder stored in
    // reassessment_question_history.quiz_attempt_id. It is NOT a real
    // quiz_attempts row. The actual quiz attempt ID is server-generated
    // during submission via consume_reservation_and_create_attempt().
    // The client must NOT send this ID back as proof of legitimacy.
    const quizAttemptId = crypto.randomUUID()

    // Reserve a question via the existing 6C-2b service
    const exclusionDbClient = createSupabaseExclusionClient()
    const reassessmentService = createReassessmentService(exclusionDbClient, cycle.chapterId)

    const reservationResult = await reassessmentService.selectAndReserveQuestion(
      user.id,
      cycle.conceptId,
      cycleId,
      quizAttemptId
    )

    if (!reservationResult.success) {
      // Check for pool exhaustion
      if (reservationResult.poolExhaustion?.isExhausted) {
        return NextResponse.json({
          success: false,
          poolExhausted: true,
          studentState: 'pool_exhausted',
          studentStateLabel: STUDENT_STATE_LABELS.pool_exhausted,
          studentStateDescription: STUDENT_STATE_DESCRIPTIONS.pool_exhausted,
          error: 'No unseen questions available for this topic',
        })
      }

      return NextResponse.json(
        { error: reservationResult.error || 'Failed to reserve a question' },
        { status: 500 }
      )
    }

    // Fetch the reserved question from the chapter's bank (initial + reserve)
    const question = contentProvider.getQuizQuestionById(reservationResult.questionId!)
    if (!question) {
      return NextResponse.json(
        { error: 'Reserved question not found in question bank' },
        { status: 500 }
      )
    }

    // Record reassessment started
    await service.recordReassessmentStarted(cycleId, user.id)

    // Learning-activity tracking: starting a knowledge check is meaningful
    // Chapter 2 learning work. Advance last_studied_at via the shared
    // server-side mechanism (student-scoped client, RLS). Never blocks.
    await recordLearningActivity(supabase, user.id, cycle.chapterId)

    return NextResponse.json({
      success: true,
      questionId: reservationResult.questionId,
      reservationId: reservationResult.reservationId,
      quizAttemptId,
      question: {
        id: question.id,
        question: question.question,
        answer_a: question.answer_a,
        answer_b: question.answer_b,
        answer_c: question.answer_c,
        answer_d: question.answer_d,
        explanation: question.explanation,
      },
      knowledgeCheck: {
        questionNumber: kcProgress.answeredCount + 1,
        totalQuestions: requiredCount,
        answeredCount: kcProgress.answeredCount,
      },
      studentState: 'reassessment_in_progress',
      studentStateLabel: STUDENT_STATE_LABELS.reassessment_in_progress,
      studentStateDescription: STUDENT_STATE_DESCRIPTIONS.reassessment_in_progress,
    })
  } catch (error) {
    console.error('[Remediation API] Error starting reassessment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
