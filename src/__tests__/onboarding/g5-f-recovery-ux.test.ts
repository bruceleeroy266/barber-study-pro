import fs from 'fs'
import path from 'path'
import { describe, expect, it } from 'vitest'

const root = process.cwd()
const read = (relativePath: string) =>
  fs.readFileSync(path.join(root, relativePath), 'utf-8')

describe('G5-F Recovery UX', () => {
  it('shows invitation lifecycle state in user management data', () => {
    const actions = read('src/app/admin/users/actions.ts')

    expect(actions).toContain("invitation_status?: 'pending' | 'accepted' | 'expired' | 'revoked' | null")
    expect(actions).toContain("from('school_onboarding_invitations')")
    expect(actions).toContain("select('school_id, email, role, status, expires_at')")
  })

  it('refreshes onboarding lifecycle when a fresh setup link is sent', () => {
    const actions = read('src/app/admin/users/actions.ts')

    expect(actions).toContain('const lifecycleResult = await ensurePendingInvitationLifecycle')
    expect(actions).toContain("status: 'pending'")
    expect(actions).toContain("revalidatePath('/school')")
  })

  it('provides one recovery center for setup-link, enrollment, and assignment repair', () => {
    const client = read('src/app/admin/users/UserManagementClient.tsx')

    expect(client).toContain('School Setup Recovery')
    expect(client).toContain('Send fresh setup link')
    expect(client).toContain('Fix enrollment')
    expect(client).toContain('Assign instructor')
    expect(client).toContain("user.invitation_status === 'expired'")
    expect(client).toContain("user.invitation_status === 'revoked'")
    expect(client).toContain("user.invitation_status === 'pending'")
  })

  it('reuses certified mutations rather than creating a parallel recovery system', () => {
    const client = read('src/app/admin/users/UserManagementClient.tsx')

    expect(client).toContain('resendUserSetupLink(user.id)')
    expect(client).toContain('setEnrollmentStudent(user)')
    expect(client).toContain('setManageCandidate(user)')
    expect(client).not.toContain('recoverInvitationById')
    expect(client).not.toContain('createRecoveryEnrollment')
  })
})
