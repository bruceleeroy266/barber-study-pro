import fs from 'fs'
import path from 'path'
import { beforeAll, describe, expect, it } from 'vitest'

const ACTIONS_PATH = path.join(
  process.cwd(),
  'src/app/communications/actions.ts'
)

describe('COM-1D.2 open-thread runtime', () => {
  let source = ''

  beforeAll(() => {
    source = fs.readFileSync(ACTIONS_PATH, 'utf-8')
  })

  it('adds an open-or-create thread server action without activating UI', () => {
    expect(source).toContain('export async function openCommunicationThread')
    expect(source).not.toContain("from '@/components/")
    expect(source).not.toContain('MessageCenter')
  })

  it('derives the student/instructor pair from the authenticated actor role', () => {
    expect(source).toContain("actor.role === 'instructor' ? counterpartId : actor.id")
    expect(source).toContain("actor.role === 'instructor' ? actor.id : counterpartId")
  })

  it('requires the exact active same-school assignment before opening a thread', () => {
    expect(source).toContain(".from('student_instructor_assignments')")
    expect(source).toContain(".eq('school_id', actor.schoolId)")
    expect(source).toContain(".eq('student_id', studentId)")
    expect(source).toContain(".eq('instructor_id', instructorId)")
    expect(source).toContain(".eq('is_active', true)")
    expect(source).toContain(".is('ended_at', null)")
  })

  it('reuses an existing active thread before creating a new one', () => {
    expect(source).toContain(".from('communication_threads')")
    expect(source).toContain(".eq('status', 'active')")
    expect(source).toContain(".order('created_at', { ascending: false })")
    expect(source).toContain('.limit(1)')
    expect(source).toContain('created: false')
  })

  it('creates a thread only from assignment-derived identities and authenticated creator', () => {
    expect(source).toContain('school_id: assignment.school_id')
    expect(source).toContain('student_id: assignment.student_id')
    expect(source).toContain('instructor_id: assignment.instructor_id')
    expect(source).toContain('created_by: actor.id')
    expect(source).toContain("status: 'active'")
    expect(source).toContain('created: true')
  })

  it('validates the subject against the database contract', () => {
    expect(source).toContain('subject.trim()')
    expect(source).toContain('trimmedSubject.length > 160')
  })

  it('does not use service-role bypass, realtime, or bulletin runtime', () => {
    expect(source).not.toContain('SUPABASE_SERVICE_ROLE')
    expect(source).not.toContain('createAdmin')
    expect(source).not.toContain('.channel(')
    expect(source).not.toContain(".from('bulletins')")
  })
})
