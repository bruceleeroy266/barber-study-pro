import fs from 'fs'
import path from 'path'
import { describe, expect, it } from 'vitest'
import { resolveGuidedOnboardingAction } from '@/lib/onboarding/guided-actions'

const root = process.cwd()
const read = (relativePath: string) =>
  fs.readFileSync(path.join(root, relativePath), 'utf-8')

describe('G5-D guided setup actions', () => {
  it('routes each blocker to the existing certified workflow', () => {
    expect(resolveGuidedOnboardingAction({
      code: 'instructor_missing',
      message: 'Instructor missing',
      action: 'Add instructor',
      href: '/admin/users',
    }).href).toBe('/admin/users?setup=invite-instructor')

    expect(resolveGuidedOnboardingAction({
      code: 'students_missing',
      message: 'Students missing',
      action: 'Add students',
      href: '/admin/users',
    }).href).toBe('/admin/users?setup=invite-student')

    expect(resolveGuidedOnboardingAction({
      code: 'enrollment_incomplete',
      message: 'Enrollment incomplete',
      action: 'Complete enrollments',
      href: '/admin/users',
    }).href).toBe('/admin/users?setup=enrollment')

    expect(resolveGuidedOnboardingAction({
      code: 'assignment_incomplete',
      message: 'Assignment incomplete',
      action: 'Assign instructors',
      href: '/admin/users',
    }).href).toBe('/admin/users?setup=assignment')

    expect(resolveGuidedOnboardingAction({
      code: 'invitations_problem',
      message: 'Invitation problem',
      action: 'Fix invitations',
      href: '/admin/users',
    }).href).toBe('/admin/users?setup=recover-invitations')
  })

  it('keeps school settings and program blockers on the existing configuration surface', () => {
    for (const code of ['school_profile_incomplete', 'program_missing']) {
      expect(resolveGuidedOnboardingAction({
        code,
        message: code,
        action: 'Configure',
        href: '/admin/school/configuration',
      }).href).toBe('/admin/school/configuration')
    }
  })

  it('wires setup mode through the existing user management page', () => {
    const page = read('src/app/admin/users/page.tsx')
    const client = read('src/app/admin/users/UserManagementClient.tsx')

    expect(page).toContain('searchParams: Promise<{ setup?: string }>')
    expect(page).toContain('setupMode={setup ?? null}')
    expect(client).toContain("setupMode === 'invite-instructor'")
    expect(client).toContain("setupMode === 'invite-student'")
    expect(client).toContain("setupMode === 'enrollment'")
    expect(client).toContain("setupMode === 'assignment'")
    expect(client).toContain("setupMode === 'recover-invitations'")
  })

  it('opens existing enrollment and assignment controls rather than creating parallel actions', () => {
    const client = read('src/app/admin/users/UserManagementClient.tsx')

    expect(client).toContain('setEnrollmentStudent(studentNeedingEnrollment)')
    expect(client).toContain('setManageCandidate(learnerNeedingAssignment)')
    expect(client).toContain('(user.enrollment_count ?? 0) === 0')
    expect(client).toContain('!user.assigned_instructor_id')
    expect(client).not.toContain('insertEnrollment')
    expect(client).not.toContain('createInstructorAssignment')
  })

  it('uses guided actions in the School Setup Center for both next action and blockers', () => {
    const center = read('src/components/school-owner/SchoolSetupCenter.tsx')

    expect(center).toContain('resolveGuidedOnboardingAction(status.nextAction)')
    expect(center).toContain('resolveGuidedOnboardingAction(blocker)')
    expect(center).toContain('guided.guidance')
    expect(center).toContain('guided.href')
    expect(center).toContain('guided.label')
  })
})
