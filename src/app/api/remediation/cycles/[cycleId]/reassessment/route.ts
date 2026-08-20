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
import { getQuizQuestionById } from '@/lib/remediation/content-filter'
import { STUDENT_STATE_LABELS, STUDENT_STATE_DESCRIPTIONS } from '@/lib/remediation/student-service'

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

    // Fetch the reserved question
    const question = getQuizQuestionById(reservationResult.questionId!)
    if (!question) {
      return NextResponse.json(
        { error: 'Reserved question not found in question bank' },
        { status: 500 }
      )
    }

    // Record reassessment started
    await service.recordReassessmentStarted(cycleId, user.id)

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
