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

  it('authorizes the authenticated actor and requested counterpart through the database pair policy', () => {
    expect(source).toContain('communication_pair_authorized')
    expect(source).toContain('p_actor_id: actor.id')
    expect(source).toContain('p_recipient_id: counterpartId')
    expect(source).toContain('p_school_id: actor.schoolId')
    expect(source).toContain("'You are not authorized to message this person.'")
  })

  it('keeps legacy learner/instructor evidence only when the authorized pair has those roles', () => {
    expect(source).toContain('actorIsLearner')
    expect(source).toContain('counterpartIsLearner')
    expect(source).toContain('actorIsInstructor')
    expect(source).toContain('counterpartIsInstructor')
    expect(source).toContain('student_id: studentId')
    expect(source).toContain('instructor_id: instructorId')
  })

  it('reuses an existing active thread before creating a new one', () => {
    expect(source).toContain(".from('communication_threads')")
    expect(source).toContain(".eq('status', 'active')")
    expect(source).toContain(".order('created_at', { ascending: false })")
    expect(source).toContain('.limit(1)')
    expect(source).toContain('created: false')
  })

  it('creates a generic participant thread from the authorized identities and authenticated creator', () => {
    expect(source).toContain('school_id: actor.schoolId')
    expect(source).toContain('participant_one_id: actor.id')
    expect(source).toContain('participant_two_id: counterpartId')
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
