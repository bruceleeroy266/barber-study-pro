/**
 * Phase 6C-3 — Remediation Cycle Events API Route
 *
 * POST /api/remediation/cycles/[cycleId]/events
 *
 * Records remediation cycle events (review started, content viewed,
 * flashcard reviewed, review completed).
 * Server-side authorization: student must own the cycle.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { createSupabaseStudentRemediationClient } from '@/lib/remediation/supabase-client'
import { createStudentRemediationService } from '@/lib/remediation/student-service'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ cycleId: string }> }
) {
  try {
    const { cycleId } = await params
    const body = await request.json()
    const { eventType, assetId } = body

    // Validate event type
    const validEventTypes = [
      'review_started',
      'content_viewed',
      'flashcard_reviewed',
      'review_completed',
    ]
    if (!validEventTypes.includes(eventType)) {
      return NextResponse.json(
        { error: 'Invalid event type' },
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

    // Create service
    const dbClient = createSupabaseStudentRemediationClient()
    const service = createStudentRemediationService(dbClient)

    // Handle event
    let result: { success: boolean; error?: string }

    switch (eventType) {
      case 'review_started':
        result = await service.startReview(cycleId, user.id)
        break

      case 'content_viewed':
        if (!assetId) {
          return NextResponse.json(
            { error: 'assetId is required for content_viewed events' },
            { status: 400 }
          )
        }
        result = await service.markContentViewed(cycleId, user.id, assetId)
        break

      case 'flashcard_reviewed':
        if (!assetId) {
          return NextResponse.json(
            { error: 'assetId is required for flashcard_reviewed events' },
            { status: 400 }
          )
        }
        result = await service.markFlashcardReviewed(cycleId, user.id, assetId)
        break

      case 'review_completed':
        result = await service.completeReview(cycleId, user.id)
        break

      default:
        return NextResponse.json(
          { error: 'Invalid event type' },
          { status: 400 }
        )
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Remediation API] Error recording event:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
