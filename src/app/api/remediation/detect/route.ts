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
import { detectAllConceptGaps } from '@/lib/chapter-2-concepts/detection'
import { createSupabaseEscalationClient } from '@/lib/escalation/supabase-client'
import { createSustainedPerformanceService } from '@/lib/escalation/sustained-performance-service'
import { syncChapter2SustainedPerformance } from '@/lib/escalation/chapter-2-sustained-runtime'
import { getChapter2MappingProvider } from '@/lib/reassessment/adapters/chapter-2-adapter'
import type { ChapterId } from '@/lib/reassessment/types'
import type { QuizAttempt } from '@/types'

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

    // 3. Verify the exact quiz attempt exists and belongs to the authenticated user.
    // answers_json is fetched here because the same persisted attempt may become
    // verified follow-up evidence for an already-active sustained-performance period.
    const { data: exactAttempt, error: attemptError } = await supabase
      .from('quiz_attempts')
      .select('id, quiz_id, user_id, completed_at, answers_json')
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

    if (exactAttempt.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Quiz attempt does not belong to authenticated user' },
        { status: 403 }
      )
    }

    if (!exactAttempt.completed_at) {
      return NextResponse.json(
        { error: 'Quiz attempt is not completed' },
        { status: 400 }
      )
    }

    const expectedQuizId = `quiz-${chapterId.replace('ch-', '')}`
    if (exactAttempt.quiz_id !== expectedQuizId) {
      return NextResponse.json(
        { error: 'Quiz attempt does not match chapter' },
        { status: 400 }
      )
    }

    // 4. Run weakness detection/remediation orchestration with exact-attempt binding.
    const orchestrator = createSupabaseDetectionOrchestrator()
    const result = await orchestrator.orchestrateAfterQuizCompletion(user.id, chapterId, quizAttemptId)

    if (!result.success) {
      console.error('[Detection API] Orchestration failed:', result.error)
      return NextResponse.json(
        { error: result.error ?? 'Detection orchestration failed' },
        { status: 500 }
      )
    }

    // 5. Chapter 2 sustained-performance lifecycle.
    // This is intentionally non-blocking for the student quiz result: remediation
    // cycle creation remains authoritative even if reset bookkeeping has a problem.
    let sustainedPerformance = {
      transitionsRecorded: 0,
      followUpEvidenceRecorded: 0,
      resetsExecuted: 0,
    }

    if (chapterId === 'ch-2') {
      try {
        const { data: attemptsData, error: attemptsError } = await supabase
          .from('quiz_attempts')
          .select('*')
          .eq('user_id', user.id)
          .not('completed_at', 'is', null)
          .order('completed_at', { ascending: false })

        if (attemptsError) {
          console.warn('[Detection API] Sustained-performance evidence fetch failed:', attemptsError)
        } else {
          const detectionResults = detectAllConceptGaps((attemptsData ?? []) as QuizAttempt[])
          const escalationDb = createSupabaseEscalationClient()
          const sustainedService = createSustainedPerformanceService(
            escalationDb,
            getChapter2MappingProvider(),
          )

          const lifecycle = await syncChapter2SustainedPerformance({
            userId: user.id,
            chapterId,
            quizAttemptId,
            quizAttemptAnswers: (exactAttempt.answers_json ?? {}) as Record<string, unknown>,
            detectionResults: detectionResults.values(),
            service: sustainedService,
          })

          sustainedPerformance = {
            transitionsRecorded: lifecycle.transitionsRecorded,
            followUpEvidenceRecorded: lifecycle.followUpEvidenceRecorded,
            resetsExecuted: lifecycle.resetsExecuted,
          }

          if (lifecycle.errors.length > 0) {
            console.warn('[Detection API] Sustained-performance sync warnings:', lifecycle.errors)
          }
        }
      } catch (lifecycleError) {
        console.warn('[Detection API] Sustained-performance lifecycle failed:', lifecycleError)
      }
    }

    // 6. Return result.
    return NextResponse.json({
      success: true,
      cyclesCreated: result.cyclesCreated,
      existingCyclesFound: result.existingCyclesFound,
      cycleIds: result.cycleIds,
      conceptsDetected: result.conceptsDetected,
      sustainedPerformance,
    })
  } catch (err) {
    console.error('[Detection API] Unexpected error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
