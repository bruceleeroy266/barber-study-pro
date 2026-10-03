import fs from 'fs'
import path from 'path'
import { beforeAll, describe, expect, it } from 'vitest'

const ACTIONS = path.join(process.cwd(), 'src/app/communications/actions.ts')
const INSTRUCTOR_PAGE = path.join(
  process.cwd(),
  'src/app/instructor/messages/page.tsx'
)
const STUDENT_PAGE = path.join(
  process.cwd(),
  'src/app/(dashboard)/dashboard/messages/page.tsx'
)
const CENTER = path.join(
  process.cwd(),
  'src/components/messaging/ProductionMessageCenter.tsx'
)

describe('COM-2E admin and instructor messaging expansion', () => {
  let actions = ''
  let instructorPage = ''
  let studentPage = ''
  let center = ''

  beforeAll(() => {
    actions = fs.readFileSync(ACTIONS, 'utf-8')
    instructorPage = fs.readFileSync(INSTRUCTOR_PAGE, 'utf-8')
    studentPage = fs.readFileSync(STUDENT_PAGE, 'utf-8')
    center = fs.readFileSync(CENTER, 'utf-8')
  })

  it('accepts school-attached admin roles in the messaging runtime', () => {
    expect(actions).toContain("'school_admin'")
    expect(actions).toContain("'admin'")
    expect(actions).toContain("communication_pair_authorized")
  })

  it('uses generic participant columns for all private thread pairs', () => {
    expect(actions).toContain('participant_one_id')
    expect(actions).toContain('participant_two_id')
    expect(actions).toContain('participantOneId')
    expect(actions).toContain('participantTwoId')
  })

  it('keeps legacy student/instructor evidence only when that pair exists', () => {
    expect(actions).toContain('actorIsLearner')
    expect(actions).toContain('counterpartIsLearner')
    expect(actions).toContain('actorIsInstructor')
    expect(actions).toContain('counterpartIsInstructor')
    expect(actions).toContain('student_id: studentId')
    expect(actions).toContain('instructor_id: instructorId')
  })

  it('drives instructor and admin compose choices from the canonical COM-2B resolver', () => {
    expect(instructorPage).toContain('resolveAuthorizedMessagingRecipients')
    expect(instructorPage).toContain('authorizedIds')
    expect(instructorPage).toContain('availableCounterparts')
    expect(instructorPage).toContain('School Messaging')
    expect(instructorPage).toContain('your school administrators')
  })

  it('supports admin and instructor labels in the shared message center', () => {
    expect(center).toContain("'school_admin'")
    expect(center).toContain("'admin'")
    expect(center).toContain('School Admin')
    expect(center).toContain('participantOneId')
    expect(center).toContain('participantTwoId')
  })

  it('lets students display authorized admin-started threads without enabling student admin compose yet', () => {
    expect(studentPage).toContain('thread.participantOneId')
    expect(studentPage).toContain('thread.participantTwoId')
    expect(studentPage).toContain("'school_admin'")
    expect(studentPage).toContain("'admin'")
    expect(studentPage).toContain('const assignedSet = new Set(assignedInstructorIds)')
    expect(studentPage).toContain('assignedSet.has(person.id)')
  })

  it('keeps Bulletins and Realtime out of this slice', () => {
    expect(actions.toLowerCase()).not.toContain('bulletin')
    expect(center.toLowerCase()).not.toContain('realtime')
  })
})
