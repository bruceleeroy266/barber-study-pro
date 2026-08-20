/**
 * Phase 6C-4 — Instructor Escalation API: Acknowledge
 *
 * POST /api/instructor/escalations/[id]/acknowledge
 *
 * Acknowledges an escalation, taking ownership. Once acknowledged,
 * automation cannot silently clear the escalation (Phase 6C-2c invariant).
 *
 * Authorization: authenticated instructor/admin from the same school.
 * Idempotent: acknowledging an already-acknowledged escalation returns
 * the current state without error.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { createSupabaseInstructorClient } from '@/lib/instructor/supabase-client'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // 1. Authenticate
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // 2. Resolve instructor profile and school
    const instructorClient = createSupabaseInstructorClient()
    const profile = await instructorClient.getProfileById(user.id)

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    if (!['instructor', 'admin', 'school_admin'].includes(profile.role)) {
      return NextResponse.json(
        { error: 'Instructor access required' },
        { status: 403 }
      )
    }

    if (!profile.school_id) {
      return NextResponse.json(
        { error: 'No school association found' },
        { status: 403 }
      )
    }

    // 3. Acknowledge the escalation (school-scoped)
    const result = await instructorClient.acknowledgeEscalationForSchool(
      id,
      profile.school_id,
      user.id
    )

    if (!result.success) {
      if (result.alreadyAcknowledged) {
        // Idempotent: return current state
        const escalation = await instructorClient.getEscalationForSchool(id, profile.school_id)
        return NextResponse.json({
          success: true,
          alreadyAcknowledged: true,
          escalation: escalation
            ? {
                id: escalation.id,
                status: escalation.status,
                acknowledgedBy: escalation.acknowledgedBy,
                acknowledgedAt: escalation.acknowledgedAt?.toISOString() ?? null,
              }
            : null,
        })
      }

      const status = result.error === 'Escalation not found' ? 404 : 400
      return NextResponse.json(
        { error: result.error },
        { status }
      )
    }

    // 4. Fetch updated state
    const updated = await instructorClient.getEscalationForSchool(id, profile.school_id)

    return NextResponse.json({
      success: true,
      alreadyAcknowledged: false,
      escalation: updated
        ? {
            id: updated.id,
            status: updated.status,
            acknowledgedBy: updated.acknowledgedBy,
            acknowledgedAt: updated.acknowledgedAt?.toISOString() ?? null,
          }
        : null,
    })
  } catch (err) {
    console.error('[Instructor API] Escalation acknowledge error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
