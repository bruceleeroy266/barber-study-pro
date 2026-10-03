import { describe, expect, it } from 'vitest'
import {
  canMessageRecipient,
  resolveAuthorizedMessagingRecipients,
  type MessagingAssignmentEvidence,
  type MessagingRecipientActor,
  type MessagingRecipientCandidate,
} from '../../lib/communications/authorized-recipients'

const schoolA = 'school-a'
const schoolB = 'school-b'

const assignment: MessagingAssignmentEvidence = {
  studentId: 'student-1',
  instructorId: 'instructor-1',
  schoolId: schoolA,
  isActive: true,
  endedAt: null,
}

function actor(
  id: string,
  role: MessagingRecipientActor['role'],
  schoolId: string | null = schoolA
): MessagingRecipientActor {
  return {
    id,
    role,
    schoolId,
    approvalStatus: 'approved',
    isDisabled: false,
  }
}

function candidate(
  id: string,
  role: MessagingRecipientCandidate['role'],
  schoolId: string | null = schoolA,
  overrides: Partial<MessagingRecipientCandidate> = {}
): MessagingRecipientCandidate {
  return {
    id,
    fullName: id,
    role,
    schoolId,
    approvalStatus: 'approved',
    isDisabled: false,
    ...overrides,
  }
}

describe('COM-2B authorized recipient model', () => {
  it('allows a student to message only the assigned instructor and same-school admin', () => {
    const recipients = resolveAuthorizedMessagingRecipients(
      actor('student-1', 'student'),
      [
        candidate('instructor-1', 'instructor'),
        candidate('instructor-2', 'instructor'),
        candidate('admin-1', 'school_admin'),
        candidate('student-2', 'student'),
      ],
      [assignment]
    )

    expect(recipients.map((recipient) => recipient.id)).toEqual([
      'admin-1',
      'instructor-1',
    ])
  })

  it('never allows student-to-student messaging', () => {
    expect(
      canMessageRecipient(
        actor('student-1', 'student'),
        candidate('student-2', 'student'),
        [assignment]
      )
    ).toBe(false)
  })

  it('allows an instructor to message assigned learners and same-school admin only', () => {
    const recipients = resolveAuthorizedMessagingRecipients(
      actor('instructor-1', 'instructor'),
      [
        candidate('student-1', 'student'),
        candidate('student-2', 'student'),
        candidate('admin-1', 'school_admin'),
        candidate('instructor-2', 'instructor'),
      ],
      [assignment]
    )

    expect(recipients.map((recipient) => recipient.id)).toEqual([
      'admin-1',
      'student-1',
    ])
  })

  it('allows a school admin to message same-school learners and instructors', () => {
    const recipients = resolveAuthorizedMessagingRecipients(
      actor('admin-1', 'school_admin'),
      [
        candidate('student-1', 'student'),
        candidate('apprentice-1', 'apprentice'),
        candidate('instructor-1', 'instructor'),
        candidate('admin-2', 'school_admin'),
      ],
      [assignment]
    )

    expect(recipients.map((recipient) => recipient.id)).toEqual([
      'apprentice-1',
      'instructor-1',
      'student-1',
    ])
  })

  it('treats a school-attached admin as tenant-scoped admin but gives platform admin no automatic recipients', () => {
    expect(
      resolveAuthorizedMessagingRecipients(
        actor('admin-1', 'admin', schoolA),
        [candidate('student-1', 'student')],
        [assignment]
      )
    ).toHaveLength(1)

    expect(
      resolveAuthorizedMessagingRecipients(
        actor('platform-admin', 'admin', null),
        [candidate('student-1', 'student')],
        [assignment]
      )
    ).toEqual([])
  })

  it('blocks cross-school recipients for every role', () => {
    for (const role of ['student', 'apprentice', 'instructor', 'school_admin', 'admin'] as const) {
      expect(
        canMessageRecipient(
          actor('actor-1', role),
          candidate('other-school', role === 'student' ? 'instructor' : 'student', schoolB),
          [assignment]
        )
      ).toBe(false)
    }
  })

  it('removes assignment-based access as soon as an assignment ends or becomes inactive', () => {
    const ended = { ...assignment, endedAt: '2026-10-03T00:00:00.000Z' }
    const inactive = { ...assignment, isActive: false }

    expect(
      canMessageRecipient(
        actor('student-1', 'student'),
        candidate('instructor-1', 'instructor'),
        [ended]
      )
    ).toBe(false)

    expect(
      canMessageRecipient(
        actor('instructor-1', 'instructor'),
        candidate('student-1', 'student'),
        [inactive]
      )
    ).toBe(false)
  })

  it('excludes disabled, unapproved, self, and school-less candidates', () => {
    const recipients = resolveAuthorizedMessagingRecipients(
      actor('instructor-1', 'instructor'),
      [
        candidate('instructor-1', 'instructor'),
        candidate('disabled-student', 'student', schoolA, { isDisabled: true }),
        candidate('pending-admin', 'school_admin', schoolA, {
          approvalStatus: 'pending',
        }),
        candidate('school-less-admin', 'school_admin', null),
      ],
      [
        {
          ...assignment,
          studentId: 'disabled-student',
        },
      ]
    )

    expect(recipients).toEqual([])
  })

  it('returns stable plain-language relationship metadata for future recipient-picker use', () => {
    const recipients = resolveAuthorizedMessagingRecipients(
      actor('student-1', 'student'),
      [
        candidate('instructor-1', 'instructor', schoolA, {
          fullName: 'Jane Instructor',
        }),
        candidate('admin-1', 'school_admin', schoolA, {
          fullName: 'Aaron Admin',
        }),
      ],
      [assignment]
    )

    expect(recipients).toEqual([
      {
        id: 'admin-1',
        name: 'Aaron Admin',
        role: 'school_admin',
        relationship: 'school_admin',
      },
      {
        id: 'instructor-1',
        name: 'Jane Instructor',
        role: 'instructor',
        relationship: 'assigned_instructor',
      },
    ])
  })
})
