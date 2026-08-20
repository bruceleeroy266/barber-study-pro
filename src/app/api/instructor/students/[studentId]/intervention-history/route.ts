/**
 * Phase 6C-4 — Instructor Intervention History API
 *
 * GET /api/instructor/students/[studentId]/intervention-history
 *
 * Returns read-only remediation/intervention history for a specific student.
 * Authorization: authenticated instructor/admin from the same school as the
 * student. Uses authoritative persisted school relationships.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { createSupabaseInstructorClient } from '@/lib/instructor/supabase-client'

interface RouteParams {
  params: Promise<{ studentId: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { studentId } = await params

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

    // 3. Verify the student exists and belongs to the same school
    const student = await instructorClient.getStudentById(studentId)

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    if (student.school_id !== profile.school_id) {
      return NextResponse.json(
        { error: 'Access denied — student belongs to a different school' },
        { status: 403 }
      )
    }

    // 4. Fetch intervention history
    const history = await instructorClient.getInterventionHistoryForStudent(
      studentId,
      profile.school_id
    )

    return NextResponse.json({
      student: {
        id: student.id,
        fullName: student.full_name,
        email: student.email,
      },
      history,
    })
  } catch (err) {
    console.error('[Instructor API] Intervention history error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
