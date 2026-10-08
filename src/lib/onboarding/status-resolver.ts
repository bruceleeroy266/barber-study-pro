export type OnboardingStepId =
  | 'school_profile'
  | 'program'
  | 'school_admin'
  | 'instructor'
  | 'students'
  | 'accounts'
  | 'enrollment'
  | 'assignment'

export interface OnboardingSourceSnapshot {
  school: { id: string; name?: string | null; is_active?: boolean | null; deleted_at?: string | null } | null
  hasSchoolSettings: boolean
  activePrograms: Array<{ id: string; name?: string | null }>
  profiles: Array<{
    id: string
    role: string
    approval_status?: string | null
    is_disabled?: boolean | null
  }>
  invitations: Array<{
    role?: string | null
    status?: string | null
    expires_at?: string | null
  }>
  studentRows: Array<{ id: string; profile_id: string }>
  activeEnrollmentStudentIds: string[]
  activeAssignments: Array<{
    student_id: string
    instructor_id: string
  }>
  sourceErrors?: string[]
}

export interface OnboardingStep {
  id: OnboardingStepId
  title: string
  complete: boolean
  detail: string
}

export interface OnboardingBlocker {
  code: string
  message: string
  action: string
  href: string
  count?: number
}

export interface SchoolOnboardingStatus {
  schoolId: string | null
  readyToLaunch: boolean
  progressPercent: number
  completedSteps: number
  totalSteps: number
  steps: OnboardingStep[]
  blockers: OnboardingBlocker[]
  nextAction: OnboardingBlocker | null
  counts: {
    instructors: number
    learners: number
    pendingInvitations: number
    incompleteEnrollments: number
    unassignedLearners: number
  }
  sourceErrors: string[]
}

function isActiveProfile(profile: OnboardingSourceSnapshot['profiles'][number]) {
  return profile.approval_status === 'approved' && profile.is_disabled !== true
}

function step(id: OnboardingStepId, title: string, complete: boolean, detail: string): OnboardingStep {
  return { id, title, complete, detail }
}

export function resolveSchoolOnboardingStatus(
  input: OnboardingSourceSnapshot
): SchoolOnboardingStatus {
  const sourceErrors = input.sourceErrors ?? []
  const activeProfiles = input.profiles.filter(isActiveProfile)
  const admins = activeProfiles.filter((p) => p.role === 'school_admin' || p.role === 'admin')
  const instructors = activeProfiles.filter((p) => p.role === 'instructor')
  const learners = activeProfiles.filter((p) => p.role === 'student' || p.role === 'apprentice')
  const learnerProfileIds = new Set(learners.map((p) => p.id))

  const pendingInvitations = input.invitations.filter((invite) => invite.status === 'pending')
  const problemInvitations = input.invitations.filter(
    (invite) => invite.status === 'expired' || invite.status === 'revoked'
  )

  const profileToStudentRow = new Map(
    input.studentRows.map((row) => [row.profile_id, row.id])
  )
  const activeEnrollmentStudentIds = new Set(input.activeEnrollmentStudentIds)
  const incompleteEnrollmentProfileIds = learners
    .filter((learner) => {
      const studentRowId = profileToStudentRow.get(learner.id)
      return !studentRowId || !activeEnrollmentStudentIds.has(studentRowId)
    })
    .map((learner) => learner.id)

  const activeInstructorIds = new Set(instructors.map((i) => i.id))
  const canonicalStudentIdToProfileId = new Map(
    input.studentRows.map((row) => [row.id, row.profile_id])
  )
  const assignedLearnerIds = new Set(
    input.activeAssignments
      .filter((assignment) => activeInstructorIds.has(assignment.instructor_id))
      .map(
        (assignment) =>
          canonicalStudentIdToProfileId.get(assignment.student_id) ?? assignment.student_id
      )
      .filter((studentProfileId) => learnerProfileIds.has(studentProfileId))
  )
  const unassignedLearnerIds = learners
    .filter((learner) => !assignedLearnerIds.has(learner.id))
    .map((learner) => learner.id)

  const schoolProfileComplete =
    Boolean(input.school?.id) &&
    input.school?.is_active !== false &&
    !input.school?.deleted_at &&
    input.hasSchoolSettings

  const programComplete = input.activePrograms.length > 0
  const adminComplete = admins.length > 0
  const instructorComplete = instructors.length > 0
  const studentsComplete = learners.length > 0
  const accountsComplete =
    pendingInvitations.length === 0 && problemInvitations.length === 0
  const enrollmentComplete =
    learners.length > 0 && incompleteEnrollmentProfileIds.length === 0
  const assignmentComplete =
    learners.length > 0 && unassignedLearnerIds.length === 0

  const steps: OnboardingStep[] = [
    step(
      'school_profile',
      'School profile',
      schoolProfileComplete,
      schoolProfileComplete ? 'School and settings are available.' : 'School settings still need attention.'
    ),
    step(
      'program',
      'Academic program',
      programComplete,
      programComplete ? 'At least one active program is configured.' : 'Add or activate a program.'
    ),
    step(
      'school_admin',
      'School administrator',
      adminComplete,
      adminComplete ? 'An active school administrator is available.' : 'Activate a school administrator.'
    ),
    step(
      'instructor',
      'Instructor',
      instructorComplete,
      instructorComplete
        ? `${instructors.length} active instructor${instructors.length === 1 ? '' : 's'} available.`
        : 'Add and activate an instructor.'
    ),
    step(
      'students',
      'Students',
      studentsComplete,
      studentsComplete
        ? `${learners.length} active learner${learners.length === 1 ? '' : 's'} added.`
        : 'Add at least one student.'
    ),
    step(
      'accounts',
      'Account activation',
      accountsComplete,
      accountsComplete
        ? 'No unresolved onboarding invitations remain.'
        : `${pendingInvitations.length + problemInvitations.length} invitation${pendingInvitations.length + problemInvitations.length === 1 ? '' : 's'} need attention.`
    ),
    step(
      'enrollment',
      'Program enrollment',
      enrollmentComplete,
      enrollmentComplete
        ? 'Every active learner has an active enrollment.'
        : `${incompleteEnrollmentProfileIds.length} learner${incompleteEnrollmentProfileIds.length === 1 ? '' : 's'} need enrollment.`
    ),
    step(
      'assignment',
      'Instructor assignment',
      assignmentComplete,
      assignmentComplete
        ? 'Every active learner has an active instructor assignment.'
        : `${unassignedLearnerIds.length} learner${unassignedLearnerIds.length === 1 ? '' : 's'} need an instructor assignment.`
    ),
  ]

  const blockers: OnboardingBlocker[] = []

  if (sourceErrors.length > 0) {
    blockers.push({
      code: 'source_data_unavailable',
      message: 'ASCYN PRO could not verify all onboarding data.',
      action: 'Retry setup check',
      href: '/school',
      count: sourceErrors.length,
    })
  }
  if (!schoolProfileComplete) {
    blockers.push({
      code: 'school_profile_incomplete',
      message: 'School settings are incomplete or unavailable.',
      action: 'Review school settings',
      href: '/admin/school/configuration',
    })
  }
  if (!programComplete) {
    blockers.push({
      code: 'program_missing',
      message: 'No active academic program is configured.',
      action: 'Configure program',
      href: '/admin/school/configuration',
    })
  }
  if (!adminComplete) {
    blockers.push({
      code: 'admin_missing',
      message: 'No active school administrator is available.',
      action: 'Manage users',
      href: '/admin/users',
    })
  }
  if (!instructorComplete) {
    blockers.push({
      code: 'instructor_missing',
      message: 'At least one active instructor is required.',
      action: 'Add instructor',
      href: '/admin/users',
    })
  }
  if (!studentsComplete) {
    blockers.push({
      code: 'students_missing',
      message: 'At least one active student is required.',
      action: 'Add students',
      href: '/admin/users',
    })
  }
  if (pendingInvitations.length > 0) {
    blockers.push({
      code: 'invitations_pending',
      message: `${pendingInvitations.length} onboarding invitation${pendingInvitations.length === 1 ? ' is' : 's are'} still pending.`,
      action: 'Review invitations',
      href: '/admin/users',
      count: pendingInvitations.length,
    })
  }
  if (problemInvitations.length > 0) {
    blockers.push({
      code: 'invitations_problem',
      message: `${problemInvitations.length} onboarding invitation${problemInvitations.length === 1 ? ' needs' : 's need'} recovery.`,
      action: 'Fix invitations',
      href: '/admin/users',
      count: problemInvitations.length,
    })
  }
  if (studentsComplete && incompleteEnrollmentProfileIds.length > 0) {
    blockers.push({
      code: 'enrollment_incomplete',
      message: `${incompleteEnrollmentProfileIds.length} learner${incompleteEnrollmentProfileIds.length === 1 ? ' needs' : 's need'} program enrollment.`,
      action: 'Complete enrollments',
      href: '/admin/users',
      count: incompleteEnrollmentProfileIds.length,
    })
  }
  if (studentsComplete && unassignedLearnerIds.length > 0) {
    blockers.push({
      code: 'assignment_incomplete',
      message: `${unassignedLearnerIds.length} learner${unassignedLearnerIds.length === 1 ? ' needs' : 's need'} an instructor assignment.`,
      action: 'Assign instructors',
      href: '/admin/users',
      count: unassignedLearnerIds.length,
    })
  }

  const completedSteps = steps.filter((item) => item.complete).length
  const progressPercent = Math.round((completedSteps / steps.length) * 100)
  const readyToLaunch =
    sourceErrors.length === 0 &&
    steps.every((item) => item.complete)

  return {
    schoolId: input.school?.id ?? null,
    readyToLaunch,
    progressPercent,
    completedSteps,
    totalSteps: steps.length,
    steps,
    blockers,
    nextAction: blockers[0] ?? null,
    counts: {
      instructors: instructors.length,
      learners: learners.length,
      pendingInvitations: pendingInvitations.length,
      incompleteEnrollments: incompleteEnrollmentProfileIds.length,
      unassignedLearners: unassignedLearnerIds.length,
    },
    sourceErrors,
  }
}
