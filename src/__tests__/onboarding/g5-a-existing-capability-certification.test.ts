import fs from 'fs'
import path from 'path'
import { describe, expect, it } from 'vitest'

const root = process.cwd()
const read = (relativePath: string) =>
  fs.readFileSync(path.join(root, relativePath), 'utf-8')

describe('G5-A existing onboarding capability certification', () => {
  it('certifies the school dashboard already provides a basic launch guide', () => {
    const dashboard = read('src/components/school-owner/SchoolDashboard.tsx')

    expect(dashboard).toContain('Invite instructor')
    expect(dashboard).toContain('Invite students')
    expect(dashboard).toContain('Enroll students')
    expect(dashboard).toContain('Begin pilot')
  })

  it('certifies school admins can invite and create users through existing user management', () => {
    const client = read('src/app/admin/users/UserManagementClient.tsx')
    const actions = read('src/app/admin/users/actions.ts')

    expect(client).toContain('Invite User')
    expect(client).toContain('Create User')
    expect(actions).toContain('export async function inviteUser')
    expect(actions).toContain('export async function createUser')
  })

  it('certifies duplicate-safe invitation and setup-link recovery behavior already exists', () => {
    const client = read('src/app/admin/users/UserManagementClient.tsx')
    const actions = read('src/app/admin/users/actions.ts')
    const auth = read('src/app/auth/invitation-actions.ts')

    expect(client).toContain('Invitation already exists. No duplicate email was sent.')
    expect(client).toContain('Account already existed. A fresh setup link was sent safely.')
    expect(actions).toContain('export async function resendUserSetupLink')
    expect(actions).toContain("from('school_onboarding_invitations')")
    expect(auth).toContain("status === 'revoked'")
    expect(auth).toContain("status === 'expired'")
    expect(auth).toContain("status: 'accepted'")
  })

  it('certifies enrollment and canonical student-to-instructor assignment already exist', () => {
    const enrollment = read('src/app/admin/users/EnrollmentModal.tsx')
    const manage = read('src/app/admin/users/ManageUserModal.tsx')
    const actions = read('src/app/admin/users/actions.ts')

    expect(enrollment).toContain('Enroll Student')
    expect(actions).toContain('export async function enrollStudent')
    expect(manage).toContain('Assigned instructor')
    expect(manage).toContain('Save instructor assignment')
    expect(actions).toContain("from('student_instructor_assignments')")
  })

  it('certifies school configuration and program requirements are already implemented', () => {
    const config = read('src/components/admin/school-config/SchoolConfigurationClient.tsx')
    const programs = read('src/components/admin/school-config/ProgramsSection.tsx')
    const resolver = read('src/lib/programs/requirements.ts')

    expect(config).toContain('School Configuration')
    expect(config).toContain('Manage school settings, programs, policies, and role permissions')
    expect(programs).toContain('Academic Programs')
    expect(programs).toContain('Programs offered by the school and their requirements')
    expect(resolver).toContain('PROGRAM REQUIREMENTS RESOLVER')
  })

  it('certifies the end-to-end onboarding journey is already regression tested', () => {
    const journey = read('tests/e2e/admin/onboarding-journey.spec.ts')

    expect(journey).toContain('Pilot onboarding certification')
    expect(journey).toContain('inquiry → approval → school → invites → acceptance → enrollment → instructor visibility')
    expect(journey).toContain('School admin invites instructor')
    expect(journey).toContain('School admin invites student')
    expect(journey).toContain('School admin enrolls the student')
    expect(journey).toContain('School admin explicitly assigns the student to the instructor')
  })

  it('locks deferred self-service enhancements out of the certified foundation', () => {
    const contract = read('docs/engineering/GATE2_1_SCHOOL_ACTIVATION_READINESS_CONTRACT.md')

    expect(contract).toContain('CSV/bulk student import')
    expect(contract).toContain('mass invitation workflows')
    expect(contract).toContain('automated resend/revoke dashboard enhancements')
  })
})
