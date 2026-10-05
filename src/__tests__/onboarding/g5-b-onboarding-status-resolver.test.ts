import { describe, expect, it } from 'vitest'
import { resolveSchoolOnboardingStatus, type OnboardingSourceSnapshot } from '@/lib/onboarding/status-resolver'

function completeSnapshot(): OnboardingSourceSnapshot {
  return {
    school: { id: 'school-1', name: 'AV', is_active: true, deleted_at: null },
    hasSchoolSettings: true,
    activePrograms: [{ id: 'program-1', name: 'Barbering' }],
    profiles: [
      { id: 'admin-1', role: 'school_admin', approval_status: 'approved', is_disabled: false },
      { id: 'inst-1', role: 'instructor', approval_status: 'approved', is_disabled: false },
      { id: 'student-1', role: 'student', approval_status: 'approved', is_disabled: false },
    ],
    invitations: [
      { role: 'school_admin', status: 'accepted', expires_at: null },
      { role: 'instructor', status: 'accepted', expires_at: null },
      { role: 'student', status: 'accepted', expires_at: null },
    ],
    studentRows: [{ id: 'student-row-1', profile_id: 'student-1' }],
    activeEnrollmentStudentIds: ['student-row-1'],
    activeAssignments: [{ student_id: 'student-1', instructor_id: 'inst-1' }],
    sourceErrors: [],
  }
}

describe('G5-B onboarding status resolver', () => {
  it('marks a fully configured school Ready to Launch', () => {
    const result = resolveSchoolOnboardingStatus(completeSnapshot())

    expect(result.readyToLaunch).toBe(true)
    expect(result.progressPercent).toBe(100)
    expect(result.completedSteps).toBe(result.totalSteps)
    expect(result.blockers).toEqual([])
    expect(result.nextAction).toBeNull()
  })

  it('reports missing learners without hiding already completed setup', () => {
    const input = completeSnapshot()
    input.profiles = input.profiles.filter((profile) => profile.role !== 'student')
    input.studentRows = []
    input.activeEnrollmentStudentIds = []
    input.activeAssignments = []

    const result = resolveSchoolOnboardingStatus(input)

    expect(result.readyToLaunch).toBe(false)
    expect(result.steps.find((item) => item.id === 'school_profile')?.complete).toBe(true)
    expect(result.steps.find((item) => item.id === 'students')?.complete).toBe(false)
    expect(result.blockers.some((blocker) => blocker.code === 'students_missing')).toBe(true)
    expect(result.progressPercent).toBeLessThan(100)
  })

  it('detects incomplete enrollment using canonical students.id rows', () => {
    const input = completeSnapshot()
    input.activeEnrollmentStudentIds = []

    const result = resolveSchoolOnboardingStatus(input)

    expect(result.counts.incompleteEnrollments).toBe(1)
    expect(result.steps.find((item) => item.id === 'enrollment')?.complete).toBe(false)
    expect(result.blockers.find((blocker) => blocker.code === 'enrollment_incomplete')).toMatchObject({
      count: 1,
      href: '/admin/users',
    })
  })

  it('detects missing canonical instructor assignment by profile id', () => {
    const input = completeSnapshot()
    input.activeAssignments = []

    const result = resolveSchoolOnboardingStatus(input)

    expect(result.counts.unassignedLearners).toBe(1)
    expect(result.steps.find((item) => item.id === 'assignment')?.complete).toBe(false)
    expect(result.blockers.find((blocker) => blocker.code === 'assignment_incomplete')).toMatchObject({
      count: 1,
      action: 'Assign instructors',
    })
  })

  it('treats pending, expired, and revoked onboarding invitations as launch blockers', () => {
    const pendingInput = completeSnapshot()
    pendingInput.invitations.push({ role: 'student', status: 'pending', expires_at: null })

    const pending = resolveSchoolOnboardingStatus(pendingInput)
    expect(pending.readyToLaunch).toBe(false)
    expect(pending.counts.pendingInvitations).toBe(1)
    expect(pending.blockers.some((blocker) => blocker.code === 'invitations_pending')).toBe(true)

    const recoveryInput = completeSnapshot()
    recoveryInput.invitations.push({ role: 'student', status: 'expired', expires_at: null })

    const recovery = resolveSchoolOnboardingStatus(recoveryInput)
    expect(recovery.readyToLaunch).toBe(false)
    expect(recovery.blockers.some((blocker) => blocker.code === 'invitations_problem')).toBe(true)
  })

  it('fails closed when source data cannot be verified', () => {
    const input = completeSnapshot()
    input.sourceErrors = ['assignments']

    const result = resolveSchoolOnboardingStatus(input)

    expect(result.readyToLaunch).toBe(false)
    expect(result.blockers[0]).toMatchObject({
      code: 'source_data_unavailable',
      action: 'Retry setup check',
    })
  })

  it('uses the first blocker as one canonical next action', () => {
    const input = completeSnapshot()
    input.activePrograms = []
    input.profiles = input.profiles.filter((profile) => profile.role !== 'instructor')

    const result = resolveSchoolOnboardingStatus(input)

    expect(result.nextAction).toEqual(result.blockers[0])
    expect(result.nextAction?.code).toBe('program_missing')
  })
})
