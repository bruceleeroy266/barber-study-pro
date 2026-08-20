/**
 * Phase 6C-4 — Instructor Escalation API: List
 *
 * GET /api/instructor/escalations
 *
 * Returns all escalations for the authenticated instructor's school.
 * Authorization: authenticated user must have instructor/admin role and
 * belong to a school. RLS provides defense-in-depth.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { createSupabaseInstructorClient } from '@/lib/instructor/supabase-client'
import type { EscalationListItem } from '@/lib/instructor/types'

export async function GET(request: NextRequest) {
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

    // 3. Fetch escalations for the instructor's school
    const escalations = await instructorClient.listEscalationsForSchool(profile.school_id)

    // 4. Map to list items
    const items: EscalationListItem[] = escalations.map((esc) => ({
      id: esc.id,
      student: {
        id: esc.student.id,
        fullName: esc.student.full_name,
        email: esc.student.email,
        role: esc.student.role,
      },
      conceptId: esc.conceptId,
      chapterId: esc.chapterId,
      status: esc.status,
      unsuccessfulCycleCount: esc.unsuccessfulCycleCount,
      createdAt: esc.createdAt.toISOString(),
      acknowledgedBy: esc.acknowledgedBy,
      acknowledgedAt: esc.acknowledgedAt?.toISOString() ?? null,
      acknowledgedByName: esc.acknowledgedByProfile?.full_name ?? null,
    }))

    return NextResponse.json({ escalations: items })
  } catch (err) {
    console.error('[Instructor API] Escalation list error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
