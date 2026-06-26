'use server'

import { createClient } from '@/lib/supabase-server'
import { isInstructorOrAdmin } from '@/lib/auth-helpers'
import { logPermissionDenied, logUnauthorizedAccess } from '@/lib/security/audit-logger'
import { mapInstructorNoteFromDb } from '@/lib/mappers/operational-data-mappers'
import { isExplicitDemoMode, isSupabaseConfigured } from '@/lib/demo-helpers'
import { InstructorNote } from '@/types'

export type NoteType = 'coaching' | 'remediation' | 'readiness' | 'general'

export interface AddNoteResult {
  success: boolean
  message: string
  code?: 'not_found' | 'unauthorized' | 'db_error' | 'network_error' | 'unknown'
}

export interface GetInstructorNotesResult {
  success: boolean
  data: InstructorNote[]
  message: string
  code?: 'not_found' | 'unauthorized' | 'db_error' | 'network_error' | 'unknown'
}

function isSafeDemoEnvironment(): boolean {
  return isExplicitDemoMode() && !isSupabaseConfigured()
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
  if (isSafeDemoEnvironment()) {
    return {
      success: false,
      message: 'Notes are read-only in demo mode. To enable note creation, configure Supabase.',
    }
  }

  // Real Supabase: attempt insert using snake_case columns
  try {
    const { error } = await supabase.from('instructor_notes').insert({
      school_id: profile.school_id,
      student_id: studentId,
      instructor_id: user.id,
      instructor_name: profile.full_name || user.email || 'Instructor',
      note_type: noteType,
      note_text: noteText.trim(),
    })

    if (error) {
      if (error.message?.includes('relation') || error.code === '42P01') {
        return {
          success: false,
          message: 'The instructor_notes table is not set up yet. Run migrations first.',
          code: 'db_error',
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

export async function getInstructorNotes(
  studentId: string,
  schoolId: string
): Promise<GetInstructorNotesResult> {
  // Authorization: verify the caller is staff at the requested school.
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return {
      success: false,
      data: [],
      message: 'You must be signed in to view notes.',
      code: 'unauthorized',
    }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, school_id')
    .eq('id', user.id)
    .single()

  if (!profile || !isInstructorOrAdmin(profile.role)) {
    return {
      success: false,
      data: [],
      message: 'Only instructors and admins can view notes.',
      code: 'unauthorized',
    }
  }

  if (!profile.school_id || profile.school_id !== schoolId) {
    return {
      success: false,
      data: [],
      message: 'You can only view notes for your school.',
      code: 'unauthorized',
    }
  }

  try {
    const { data, error } = await supabase
      .from('instructor_notes')
      .select('*')
      .eq('student_id', studentId)
      .eq('school_id', schoolId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[InstructorNotes] getInstructorNotes error:', error)
      if (error.message?.includes('relation') || error.code === '42P01') {
        return {
          success: false,
          data: [],
          message: 'The instructor_notes table is not set up yet. Run migrations first.',
          code: 'db_error',
        }
      }
      return {
        success: false,
        data: [],
        message: `Failed to load notes: ${error.message}`,
        code: 'db_error',
      }
    }

    return {
      success: true,
      data: (data || []).map(mapInstructorNoteFromDb),
      message: data && data.length > 0 ? 'Notes loaded.' : 'No notes found.',
    }
  } catch (err) {
    console.error('[InstructorNotes] getInstructorNotes exception:', err)
    return {
      success: false,
      data: [],
      message: err instanceof Error ? err.message : 'Failed to load notes due to an unexpected error.',
      code: 'unknown',
    }
  }
}
