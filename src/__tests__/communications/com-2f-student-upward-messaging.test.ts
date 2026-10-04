import fs from 'fs'
import path from 'path'
import { beforeAll, describe, expect, it } from 'vitest'

const STUDENT_PAGE = path.join(
  process.cwd(),
  'src/app/(dashboard)/dashboard/messages/page.tsx'
)
const RECIPIENTS = path.join(
  process.cwd(),
  'src/lib/communications/authorized-recipients.ts'
)
const ACTIONS = path.join(process.cwd(), 'src/app/communications/actions.ts')

describe('COM-2F student upward messaging', () => {
  let studentPage = ''
  let recipients = ''
  let actions = ''

  beforeAll(() => {
    studentPage = fs.readFileSync(STUDENT_PAGE, 'utf-8')
    recipients = fs.readFileSync(RECIPIENTS, 'utf-8')
    actions = fs.readFileSync(ACTIONS, 'utf-8')
  })

  it('drives student compose choices from the canonical authorized-recipient resolver', () => {
    expect(studentPage).toContain('resolveAuthorizedMessagingRecipients')
    expect(studentPage).toContain('authorizedRecipients')
    expect(studentPage).toContain('authorizedIds')
    expect(studentPage).toContain('availableCounterparts')
  })

  it('keeps assigned instructor evidence active and unended', () => {
    expect(studentPage).toContain(".from('student_instructor_assignments')")
    expect(studentPage).toContain(".eq('student_id', user.id)")
    expect(studentPage).toContain(".eq('is_active', true)")
    expect(studentPage).toContain(".is('ended_at', null)")
  })

  it('allows learners upward to assigned instructors and school admins only', () => {
    expect(recipients).toContain("candidate.role === 'instructor'")
    expect(recipients).toContain("relationship = 'assigned_instructor'")
    expect(recipients).toContain('isAdminRecipient(candidate.role)')
    expect(recipients).toContain("relationship = 'school_admin'")
  })

  it('does not add any learner-to-learner relationship', () => {
    expect(recipients).not.toContain("relationship = 'school_student'")
    expect(actions).toContain('communication_pair_authorized')
  })

  it('keeps recipient eligibility and school scope enforced', () => {
    expect(recipients).toContain("candidate.schoolId !== actor.schoolId")
    expect(recipients).toContain("candidate.approvalStatus && candidate.approvalStatus !== 'approved'")
    expect(recipients).toContain('candidate.isDisabled === true')
  })

  it('explains the upward messaging scope in the student UI', () => {
    expect(studentPage).toContain(
      'Private conversations with your assigned instructor and authorized school administrators.'
    )
  })

  it('keeps Bulletins and Realtime out of this slice', () => {
    expect(studentPage.toLowerCase()).not.toContain('bulletin')
    expect(actions).not.toContain('.channel(')
  })
})
