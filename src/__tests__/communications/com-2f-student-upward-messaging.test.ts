import fs from 'fs'
import path from 'path'
import { beforeAll, describe, expect, it } from 'vitest'
import { resolveAuthorizedMessagingRecipients } from '@/lib/communications/authorized-recipients'

const STUDENT_PAGE = path.join(
  process.cwd(),
  'src/app/(dashboard)/dashboard/messages/page.tsx'
)
const ACTIONS = path.join(process.cwd(), 'src/app/communications/actions.ts')

describe('COM-2F student upward messaging', () => {
  let studentPage = ''
  let actions = ''

  beforeAll(() => {
    studentPage = fs.readFileSync(STUDENT_PAGE, 'utf-8')
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

  it('allows a learner to message an assigned instructor and same-school admin', () => {
    const actor = {
      id: 'student-1',
      role: 'student' as const,
      schoolId: 'school-1',
      approvalStatus: 'approved',
      isDisabled: false,
    }
    const candidates = [
      {
        id: 'instructor-1',
        fullName: 'Assigned Instructor',
        role: 'instructor' as const,
        schoolId: 'school-1',
        approvalStatus: 'approved',
        isDisabled: false,
      },
      {
        id: 'admin-1',
        fullName: 'School Admin',
        role: 'school_admin' as const,
        schoolId: 'school-1',
        approvalStatus: 'approved',
        isDisabled: false,
      },
    ]
    const assignments = [
      {
        studentId: 'student-1',
        instructorId: 'instructor-1',
        schoolId: 'school-1',
        isActive: true,
        endedAt: null,
      },
    ]

    expect(resolveAuthorizedMessagingRecipients(actor, candidates, assignments)).toEqual([
      expect.objectContaining({ id: 'instructor-1', relationship: 'assigned_instructor' }),
      expect.objectContaining({ id: 'admin-1', relationship: 'school_admin' }),
    ])
  })

  it('blocks learner-to-learner, unassigned instructor, and cross-school recipients', () => {
    const actor = {
      id: 'student-1',
      role: 'student' as const,
      schoolId: 'school-1',
      approvalStatus: 'approved',
      isDisabled: false,
    }
    const candidates = [
      {
        id: 'student-2',
        fullName: 'Other Student',
        role: 'student' as const,
        schoolId: 'school-1',
        approvalStatus: 'approved',
        isDisabled: false,
      },
      {
        id: 'instructor-2',
        fullName: 'Unassigned Instructor',
        role: 'instructor' as const,
        schoolId: 'school-1',
        approvalStatus: 'approved',
        isDisabled: false,
      },
      {
        id: 'admin-2',
        fullName: 'Other School Admin',
        role: 'school_admin' as const,
        schoolId: 'school-2',
        approvalStatus: 'approved',
        isDisabled: false,
      },
    ]

    expect(resolveAuthorizedMessagingRecipients(actor, candidates, [])).toEqual([])
    expect(actions).toContain('communication_pair_authorized')
  })

  it('blocks disabled and non-approved recipients', () => {
    const actor = {
      id: 'student-1',
      role: 'student' as const,
      schoolId: 'school-1',
      approvalStatus: 'approved',
      isDisabled: false,
    }
    const candidates = [
      {
        id: 'admin-disabled',
        fullName: 'Disabled Admin',
        role: 'school_admin' as const,
        schoolId: 'school-1',
        approvalStatus: 'approved',
        isDisabled: true,
      },
      {
        id: 'admin-pending',
        fullName: 'Pending Admin',
        role: 'admin' as const,
        schoolId: 'school-1',
        approvalStatus: 'pending',
        isDisabled: false,
      },
    ]

    expect(resolveAuthorizedMessagingRecipients(actor, candidates, [])).toEqual([])
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
