'use server'

import { createClient } from '@/lib/supabase-server'
import { isInstructorOrAdmin } from '@/lib/auth-helpers'
import { logPermissionDenied, logUnauthorizedAccess } from '@/lib/security/audit-logger'

export type NoteType = 'coaching' | 'remediation' | 'readiness' | 'general'

export interface AddNoteResult {
  success: boolean
  message: string
}

export async function addInstructorNote(
  studentId: string,
  noteType: NoteType,
  noteText: string
): Promise<AddNoteResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'You must be signed in to add a note.' }
  }

  // Verify instructor or admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, school_id')
    .eq('id', user.id)
    .single()

  if (!profile || !isInstructorOrAdmin(profile.role)) {
    await logPermissionDenied('manage_students', {
      userId: user.id,
      email: user.email,
      role: profile?.role ?? null,
      schoolId: profile?.school_id ?? null,
      resource: 'instructor_notes',
      action: 'create',
    })
    return { success: false, message: 'Only instructors and admins can add notes.' }
  }

  // Multi-school isolation: verify the target student belongs to the same school.
  const { data: student } = await supabase
    .from('profiles')
    .select('school_id')
    .eq('id', studentId)
    .in('role', ['student', 'apprentice'])
    .single()

  if (!student) {
    return { success: false, message: 'Student not found.' }
  }

  if (!profile.school_id || student.school_id !== profile.school_id) {
    await logUnauthorizedAccess('student record', {
      userId: user.id,
      email: user.email,
      role: profile.role,
      schoolId: profile.school_id,
      resourceId: studentId,
      action: 'create_instructor_note',
      metadata: { studentSchoolId: student.school_id },
    })
    return { success: false, message: 'You can only add notes for students in your school.' }
  }

  if (!noteText.trim()) {
    return { success: false, message: 'Note text is required.' }
  }

  // Demo mode: notes are read-only in the current architecture
  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  const supabaseConfigured =
    url.startsWith('https://') &&
    !url.includes('your-project') &&
    !url.includes('example.supabase.co') &&
    key.length > 20

  if (demoMode || !supabaseConfigured) {
    return {
      success: false,
      message: 'Notes are read-only in demo mode. To enable note creation, configure Supabase and create the instructor_notes table per the implementation plan.',
    }
  }

  // Real Supabase: attempt insert
  try {
    const { error } = await supabase.from('instructor_notes').insert({
      student_id: studentId,
      instructor_id: user.id,
      instructor_name: profile.full_name || user.email || 'Instructor',
      note_type: noteType,
      note_text: noteText.trim(),
      created_at: new Date().toISOString(),
    })

    if (error) {
      // Likely the table does not exist yet
      if (error.message?.includes('relation') || error.code === '42P01') {
        return {
          success: false,
          message: 'The instructor_notes table is not set up yet. See INSTRUCTOR_PHASE_2D_NOTES_REPORT.md for the implementation plan.',
        }
      }
      return { success: false, message: error.message }
    }

    return { success: true, message: 'Note added successfully.' }
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Failed to add note.',
    }
  }
}
