/**
 * Phase 6C-3 — Remediation Cycle API Route
 *
 * GET /api/remediation/cycles/[cycleId]
 *
 * Fetches a remediation cycle with assignments for the authenticated student.
 * Server-side authorization: student must own the cycle.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { createSupabaseStudentRemediationClient } from '@/lib/remediation/supabase-client'
import { createStudentRemediationService } from '@/lib/remediation/student-service'
import { getChapterContentProvider } from '@/lib/remediation/content-provider-registry'
import {
  createSupabaseKnowledgeCheckClient,
  getKnowledgeCheckLength,
  getKnowledgeCheckProgress,
} from '@/lib/remediation/knowledge-check'
import { STUDENT_STATE_LABELS, STUDENT_STATE_DESCRIPTIONS } from '@/lib/remediation/student-service'
import type { ConceptId } from '@/lib/chapter-2-concepts/types'

export async function GET(
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

    // Create service
    const dbClient = createSupabaseStudentRemediationClient()
    const service = createStudentRemediationService(dbClient)

    // Fetch cycle with authorization
    const result = await service.getCycleForStudent(cycleId, user.id)

    if ('error' in result) {
      const status = result.error === 'Access denied' ? 403 : 404
      return NextResponse.json(
        { error: result.error },
        { status }
      )
    }

    const { cycle, assignments } = result

    // Derive student-facing state
    const studentState = service.deriveStudentState(cycle)

    // Build content bundle from the cycle's chapter provider (C3-3: resolved
    // from cycle.chapterId — no chapter-2-only assumption). Fail closed.
    const contentProvider = getChapterContentProvider(cycle.chapterId)
    if (!contentProvider) {
      return NextResponse.json(
        { error: `Chapter ${cycle.chapterId} does not support remediation` },
        { status: 400 }
      )
    }
    const contentBundle = contentProvider.buildRemediationContentBundle(cycle.conceptId as ConceptId)

    // Get review progress
    const progress = await service.getReviewProgress(cycleId, user.id)

    // Knowledge-check progress (C3-3 stages 5–6) for reload-safe recovery.
    const knowledgeCheckClient = createSupabaseKnowledgeCheckClient()
    const requiredCount = getKnowledgeCheckLength(cycle.chapterId)
    const kcProgress = await getKnowledgeCheckProgress(
      knowledgeCheckClient,
      cycleId,
      user.id,
      requiredCount
    )

    let openQuestion = null
    if (kcProgress.openReservation) {
      const q = contentProvider.getQuizQuestionById(kcProgress.openReservation.questionId)
      if (q) {
        openQuestion = {
          questionId: q.id,
          reservationId: kcProgress.openReservation.reservationId,
          question: {
            id: q.id,
            question: q.question,
            answer_a: q.answer_a,
            answer_b: q.answer_b,
            answer_c: q.answer_c,
            answer_d: q.answer_d,
            explanation: q.explanation,
          },
        }
      }
    }

    return NextResponse.json({
      cycle: {
        id: cycle.id,
        conceptId: cycle.conceptId,
        chapterId: cycle.chapterId,
        status: cycle.status,
        studentState,
        studentStateLabel: STUDENT_STATE_LABELS[studentState],
        studentStateDescription: STUDENT_STATE_DESCRIPTIONS[studentState],
        outcome: cycle.outcome,
        reviewCompletedAt: cycle.reviewCompletedAt,
        reassessmentStartedAt: cycle.reassessmentStartedAt,
        reassessmentCompletedAt: cycle.reassessmentCompletedAt,
      },
      assignments: assignments.map((a) => ({
        id: a.id,
        assignmentType: a.assignmentType,
        assetId: a.assetId,
        priority: a.priority,
        isPrimary: a.isPrimary,
        status: a.status,
        completedAt: a.completedAt,
      })),
      contentBundle: {
        conceptName: contentBundle.conceptName,
        contentBlockCount: contentBundle.contentBlockCount,
        flashcardCount: contentBundle.flashcardCount,
        hasSufficientMaterial: contentBundle.hasSufficientMaterial,
      },
      progress: 'error' in progress ? { completed: 0, total: 0, percentage: 0 } : progress,
      knowledgeCheck: {
        answeredCount: kcProgress.answeredCount,
        totalQuestions: requiredCount,
        openQuestion,
      },
    })
  } catch (error) {
    console.error('[Remediation API] Error fetching cycle:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
