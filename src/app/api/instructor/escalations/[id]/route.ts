/**
 * Phase 6C-4 — Instructor Escalation API: Detail
 *
 * GET /api/instructor/escalations/[id]
 *
 * Returns a single escalation with full detail for the authenticated
 * instructor's school. Authorization enforced at both application
 * and RLS layers.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { createSupabaseInstructorClient } from '@/lib/instructor/supabase-client'
import type { EscalationDetail } from '@/lib/instructor/types'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
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

    // 3. Fetch escalation scoped to instructor's school
    const escalation = await instructorClient.getEscalationForSchool(id, profile.school_id)

    if (!escalation) {
      return NextResponse.json(
        { error: 'Escalation not found' },
        { status: 404 }
      )
    }

    // 4. Map to detail response
    const detail: EscalationDetail = {
      id: escalation.id,
      student: {
        id: escalation.student.id,
        fullName: escalation.student.full_name,
        email: escalation.student.email,
        role: escalation.student.role,
      },
      conceptId: escalation.conceptId,
      chapterId: escalation.chapterId,
      status: escalation.status,
      unsuccessfulCycleCount: escalation.unsuccessfulCycleCount,
      createdAt: escalation.createdAt.toISOString(),
      acknowledgedBy: escalation.acknowledgedBy,
      acknowledgedAt: escalation.acknowledgedAt?.toISOString() ?? null,
      acknowledgedByName: escalation.acknowledgedByProfile?.full_name ?? null,
      triggeringCycleIds: escalation.triggeringCycleIds,
      instructorNotes: escalation.instructorNotes,
      interventionPlan: escalation.interventionPlan,
      resolutionSummary: escalation.resolutionSummary,
      followUpRequired: escalation.followUpRequired,
      events: [], // Events fetched separately if needed
    }

    return NextResponse.json({ escalation: detail })
  } catch (err) {
    console.error('[Instructor API] Escalation detail error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
