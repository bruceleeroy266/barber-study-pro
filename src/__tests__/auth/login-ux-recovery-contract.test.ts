import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const source = (path: string) => readFileSync(join(process.cwd(), path), 'utf8')

describe('LOGIN-UX-3 non-mutating recovery contract', () => {
  it('links invalid invitation callbacks to self-service recovery', () => {
    const callback = source('src/app/auth/callback/page.tsx')
    expect(callback).toContain('href="/reset-password"')
    expect(callback).toContain('Request fresh access link')
  })
  it('reuses recovery email for existing Supabase identities', () => {
    const recovery = source('src/app/(auth)/reset-password/page.tsx')
    expect(recovery).toContain('resetPasswordForEmail(email')
    expect(recovery).toContain('/auth/callback?type=recovery')
    expect(recovery).not.toContain('auth.admin.deleteUser')
    expect(recovery).not.toContain('inviteUserByEmail')
  })
  it('retains admin identity and school authorization checks', () => {
    const actions = source('src/app/admin/users/actions.ts')
    const segment = actions.slice(actions.indexOf('export async function resendUserSetupLink'), actions.indexOf('export async function inviteUser'))
    expect(segment).toContain('getManagedUser(serviceClient, admin, id)')
    expect(segment).toContain('getUserById(target.id)')
    expect(segment).toContain('authData.user.email.toLowerCase() !== target.email.toLowerCase()')
    expect(segment).not.toContain('deleteUser(')
  })
})
