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
import { buildRemediationContentBundle } from '@/lib/remediation/content-filter'
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

    // Build content bundle
    const contentBundle = buildRemediationContentBundle(cycle.conceptId as ConceptId)

    // Get review progress
    const progress = await service.getReviewProgress(cycleId, user.id)

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
    })
  } catch (error) {
    console.error('[Remediation API] Error fetching cycle:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
