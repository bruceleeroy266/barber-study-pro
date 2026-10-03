import type { AppRole } from '@/types'

export type MessagingRelationship =
  | 'assigned_instructor'
  | 'assigned_student'
  | 'school_admin'
  | 'school_student'
  | 'school_instructor'

export interface MessagingRecipientActor {
  id: string
  role: AppRole
  schoolId: string | null
  approvalStatus?: string | null
  isDisabled?: boolean | null
}

export interface MessagingRecipientCandidate {
  id: string
  fullName: string
  role: AppRole
  schoolId: string | null
  approvalStatus?: string | null
  isDisabled?: boolean | null
}

export interface MessagingAssignmentEvidence {
  studentId: string
  instructorId: string
  schoolId: string
  isActive: boolean
  endedAt?: string | null
}

export interface AuthorizedMessagingRecipient {
  id: string
  name: string
  role: 'student' | 'apprentice' | 'instructor' | 'school_admin' | 'admin'
  relationship: MessagingRelationship
}

function isEligibleProfile(profile: {
  schoolId: string | null
  approvalStatus?: string | null
  isDisabled?: boolean | null
}): boolean {
  if (!profile.schoolId) return false
  if (profile.approvalStatus && profile.approvalStatus !== 'approved') return false
  if (profile.isDisabled === true) return false
  return true
}

function isLearnerRole(role: AppRole): role is 'student' | 'apprentice' {
  return role === 'student' || role === 'apprentice'
}

function isSchoolAdminLike(actor: MessagingRecipientActor): boolean {
  if (!actor.schoolId) return false
  return actor.role === 'school_admin' || actor.role === 'admin'
}

function isAdminRecipient(role: AppRole): role is 'school_admin' | 'admin' {
  return role === 'school_admin' || role === 'admin'
}

function hasActiveAssignment(
  assignments: MessagingAssignmentEvidence[],
  schoolId: string,
  studentId: string,
  instructorId: string
): boolean {
  return assignments.some(
    (assignment) =>
      assignment.schoolId === schoolId &&
      assignment.studentId === studentId &&
      assignment.instructorId === instructorId &&
      assignment.isActive &&
      assignment.endedAt == null
  )
}

export function resolveAuthorizedMessagingRecipients(
  actor: MessagingRecipientActor,
  candidates: MessagingRecipientCandidate[],
  assignments: MessagingAssignmentEvidence[]
): AuthorizedMessagingRecipient[] {
  if (!isEligibleProfile(actor)) return []

  const recipients: AuthorizedMessagingRecipient[] = []

  for (const candidate of candidates) {
    if (candidate.id === actor.id) continue
    if (!isEligibleProfile(candidate)) continue
    if (candidate.schoolId !== actor.schoolId) continue

    let relationship: MessagingRelationship | null = null

    if (isLearnerRole(actor.role)) {
      if (
        candidate.role === 'instructor' &&
        hasActiveAssignment(assignments, actor.schoolId!, actor.id, candidate.id)
      ) {
        relationship = 'assigned_instructor'
      } else if (isAdminRecipient(candidate.role)) {
        relationship = 'school_admin'
      }
    } else if (actor.role === 'instructor') {
      if (
        isLearnerRole(candidate.role) &&
        hasActiveAssignment(assignments, actor.schoolId!, candidate.id, actor.id)
      ) {
        relationship = 'assigned_student'
      } else if (isAdminRecipient(candidate.role)) {
        relationship = 'school_admin'
      }
    } else if (isSchoolAdminLike(actor)) {
      if (isLearnerRole(candidate.role)) {
        relationship = 'school_student'
      } else if (candidate.role === 'instructor') {
        relationship = 'school_instructor'
      }
    }

    if (!relationship) continue

    recipients.push({
      id: candidate.id,
      name: candidate.fullName,
      role: candidate.role as AuthorizedMessagingRecipient['role'],
      relationship,
    })
  }

  return recipients.sort((a, b) => {
    const byName = a.name.localeCompare(b.name)
    if (byName !== 0) return byName
    return a.id.localeCompare(b.id)
  })
}

export function canMessageRecipient(
  actor: MessagingRecipientActor,
  candidate: MessagingRecipientCandidate,
  assignments: MessagingAssignmentEvidence[]
): boolean {
  return resolveAuthorizedMessagingRecipients(actor, [candidate], assignments).length === 1
}
