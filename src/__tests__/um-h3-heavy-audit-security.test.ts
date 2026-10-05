import fs from 'fs'
import path from 'path'
import { describe, expect, it } from 'vitest'

const root = process.cwd()
const migrationPath = path.join(
  root,
  'supabase/migrations/20261005231000_um_h3_heavy_audit_identity_email_guard.sql'
)
const migration = fs.readFileSync(migrationPath, 'utf8')

describe('UM-H3 heavy-audit identity boundary', () => {
  it('prevents ordinary clients from drifting profile email away from Auth', () => {
    expect(migration).toContain('new.email := old.email;')
    expect(migration).toContain("current_user in ('service_role', 'postgres', 'supabase_admin')")
  })

  it('preserves the existing tenant and metrics protected columns', () => {
    for (const column of [
      'school_id',
      'role',
      'approval_status',
      'is_disabled',
      'approved_by',
      'approved_at',
      'include_in_school_metrics',
    ]) {
      expect(migration).toContain(`new.${column} := old.${column};`)
    }
  })

  it('keeps full_name self-service compatible while protecting login identity', () => {
    expect(migration).not.toContain('new.full_name := old.full_name;')
    expect(migration).not.toContain('new.requires_password_change := old.requires_password_change;')
  })

  it('keeps the trigger function unavailable to browser roles', () => {
    expect(migration).toContain(
      'revoke execute on function public.enforce_profile_protected_columns() from authenticated'
    )
    expect(migration).toContain(
      'revoke execute on function public.enforce_profile_protected_columns() from anon'
    )
    expect(migration).toContain(
      'grant execute on function public.enforce_profile_protected_columns() to service_role'
    )
  })
})
