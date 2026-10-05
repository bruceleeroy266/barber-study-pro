import { describe, expect, it } from 'vitest'
import {
  buildSchoolLaunchPreflight,
  type SchoolOnboardingStatus,
} from '@/lib/onboarding'

function readyStatus(): SchoolOnboardingStatus {
  return {
    schoolId: 'school-1',
    readyToLaunch: true,
    progressPercent: 100,
    completedSteps: 8,
    totalSteps: 8,
    steps: [
      { id: 'school_profile', title: 'School profile', complete: true, detail: 'ok' },
      { id: 'program', title: 'Academic program', complete: true, detail: 'ok' },
      { id: 'school_admin', title: 'School administrator', complete: true, detail: 'ok' },
      { id: 'instructor', title: 'Instructor', complete: true, detail: 'ok' },
      { id: 'students', title: 'Students', complete: true, detail: 'ok' },
      { id: 'accounts', title: 'Account activation', complete: true, detail: 'ok' },
      { id: 'enrollment', title: 'Program enrollment', complete: true, detail: 'ok' },
      { id: 'assignment', title: 'Instructor assignment', complete: true, detail: 'ok' },
    ],
    blockers: [],
    nextAction: null,
    counts: {
      instructors: 1,
      learners: 1,
      pendingInvitations: 0,
      incompleteEnrollments: 0,
      unassignedLearners: 0,
    },
    sourceErrors: [],
  }
}

describe('G5-G school launch preflight', () => {
  it('authorizes launch only when every canonical onboarding check passes', () => {
    const result = buildSchoolLaunchPreflight(readyStatus())

    expect(result.authorized).toBe(true)
    expect(result.decision).toBe('authorized')
    expect(result.checks).toHaveLength(8)
    expect(result.failedChecks).toHaveLength(0)
    expect(result.blockerCount).toBe(0)
    expect(result.sourceErrorCount).toBe(0)
  })

  it('locks launch when a canonical setup step is incomplete', () => {
    const status = readyStatus()
    status.readyToLaunch = false
    status.progressPercent = 88
    status.completedSteps = 7
    status.steps = status.steps.map((step) =>
      step.id === 'assignment'
        ? { ...step, complete: false, detail: '1 learner needs an instructor assignment.' }
        : step
    )
    status.blockers = [{
      code: 'assignment_incomplete',
      message: '1 learner needs an instructor assignment.',
      action: 'Assign instructors',
      href: '/admin/users',
      count: 1,
    }]
    status.nextAction = status.blockers[0]

    const result = buildSchoolLaunchPreflight(status)

    expect(result.authorized).toBe(false)
    expect(result.decision).toBe('locked')
    expect(result.failedChecks.map((check) => check.id)).toEqual(['assignment'])
    expect(result.blockerCount).toBe(1)
  })

  it('fails closed when required onboarding data cannot be verified', () => {
    const status = readyStatus()
    status.readyToLaunch = false
    status.sourceErrors = ['Failed to load invitations']
    status.blockers = [{
      code: 'source_data_unavailable',
      message: 'ASCYN PRO could not verify all onboarding data.',
      action: 'Retry setup check',
      href: '/school',
      count: 1,
    }]
    status.nextAction = status.blockers[0]

    const result = buildSchoolLaunchPreflight(status)

    expect(result.authorized).toBe(false)
    expect(result.sourceErrorCount).toBe(1)
  })

  it('fails closed if a required canonical step is unexpectedly missing', () => {
    const status = readyStatus()
    status.steps = status.steps.filter((step) => step.id !== 'program')

    const result = buildSchoolLaunchPreflight(status)

    expect(result.authorized).toBe(false)
    expect(result.failedChecks.map((check) => check.id)).toContain('program')
  })
})
