/**
 * Phase 6C-5 — Detection Orchestration API
 *
 * POST /api/remediation/detect
 *
 * Triggers concept detection and remediation-cycle creation after quiz completion.
 * This endpoint is called by the QuizClient after a quiz attempt is persisted.
 *
 * Authorization: Student must own the quiz attempt (server-side verification).
 *
 * Binding Rules:
 *   - Persisted evidence is authoritative
 *   - Canonical mappings are authoritative
 *   - Caller-supplied detection state is never authoritative
 *   - Duplicate active cycles cannot be created
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { createSupabaseDetectionOrchestrator } from '@/lib/remediation/detection-orchestrator'
import type { ChapterId } from '@/lib/reassessment/types'

interface DetectRequestBody {
  chapterId: ChapterId
  quizAttemptId: string
}

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // 2. Parse request body
    let body: DetectRequestBody
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    const { chapterId, quizAttemptId } = body

    if (!chapterId) {
      return NextResponse.json(
        { error: 'chapterId is required' },
        { status: 400 }
      )
    }

    if (!quizAttemptId) {
      return NextResponse.json(
        { error: 'quizAttemptId is required' },
        { status: 400 }
      )
    }

    // 3. Verify the exact quiz attempt exists and belongs to the authenticated user
    // This ensures deterministic binding to the exact persisted attempt
    const { data: exactAttempt, error: attemptError } = await supabase
      .from('quiz_attempts')
      .select('id, quiz_id, user_id, completed_at')
      .eq('id', quizAttemptId)
      .maybeSingle()

    if (attemptError) {
      console.error('[Detection API] Error fetching quiz attempt:', attemptError)
      return NextResponse.json(
        { error: 'Failed to verify quiz attempt' },
        { status: 500 }
      )
    }

    if (!exactAttempt) {
      return NextResponse.json(
        { error: 'Quiz attempt not found' },
        { status: 404 }
      )
    }

    // Verify ownership - the attempt must belong to the authenticated user
    if (exactAttempt.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Quiz attempt does not belong to authenticated user' },
        { status: 403 }
      )
    }

    // Verify the attempt is completed (has completed_at timestamp)
    if (!exactAttempt.completed_at) {
      return NextResponse.json(
        { error: 'Quiz attempt is not completed' },
        { status: 400 }
      )
    }

    // Verify the quiz ID matches the chapter (e.g., 'quiz-2' for 'ch-2')
    const expectedQuizId = `quiz-${chapterId.replace('ch-', '')}`
    if (exactAttempt.quiz_id !== expectedQuizId) {
      return NextResponse.json(
        { error: 'Quiz attempt does not match chapter' },
        { status: 400 }
      )
    }

    // 4. Run detection orchestration with exact attempt binding
    const orchestrator = createSupabaseDetectionOrchestrator()
    const result = await orchestrator.orchestrateAfterQuizCompletion(user.id, chapterId, quizAttemptId)

    if (!result.success) {
      console.error('[Detection API] Orchestration failed:', result.error)
      return NextResponse.json(
        { error: result.error ?? 'Detection orchestration failed' },
        { status: 500 }
      )
    }

    // 5. Return result
    return NextResponse.json({
      success: true,
      cyclesCreated: result.cyclesCreated,
      existingCyclesFound: result.existingCyclesFound,
      cycleIds: result.cycleIds,
      conceptsDetected: result.conceptsDetected,
    })
  } catch (err) {
    console.error('[Detection API] Unexpected error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
