import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const migration = readFileSync(
  join(process.cwd(), 'supabase/migrations/20260930223000_ha5_chapters_1_18_authorization_rls.sql'),
  'utf8',
)
const rpcSecurity = readFileSync(
  join(process.cwd(), 'supabase/migrations/20260930200000_c19_h2_remediation_rpc_security.sql'),
  'utf8',
)
const interventionRoute = readFileSync(
  join(process.cwd(), 'src/app/api/instructor/students/[studentId]/intervention-history/route.ts'),
  'utf8',
)

describe('HA-5 Chapters 1-18 authorization and tenant boundaries', () => {
  it('students can read only their own remediation state', () => {
    expect(migration).toContain('using (auth.uid() = user_id)')
    expect(migration).toContain('where rc.id = cycle_id and rc.user_id = auth.uid()')
  })

  it('students cannot directly mutate server-authoritative remediation state', () => {
    expect(migration).toContain('drop policy if exists remediation_cycles_insert')
    expect(migration).toContain('drop policy if exists remediation_cycles_update')
    expect(migration).toContain('revoke insert, update, delete on public.remediation_cycles from authenticated')
    expect(migration).toContain('revoke insert, update, delete on public.remediation_cycle_events from authenticated')
    expect(migration).toContain('revoke insert, update, delete on public.remediation_assignments from authenticated')
  })

  it('staff reads require authoritative same-school membership', () => {
    expect(migration).toContain('public.is_school_staff(public.current_user_school_id())')
    expect(migration).toContain('public.current_user_school_id() = public.user_school_id(user_id)')
    expect(migration).toContain('public.current_user_school_id() = public.user_school_id(rc.user_id)')
  })

  it('cross-school instructor API access is rejected before service-role history reads', () => {
    expect(interventionRoute).toContain("if (!['instructor', 'admin', 'school_admin'].includes(profile.role))")
    expect(interventionRoute).toContain('if (!profile.school_id)')
    expect(interventionRoute).toContain('if (student.school_id !== profile.school_id)')
    expect(interventionRoute).toContain("status: 403")
    expect(interventionRoute.indexOf('student.school_id !== profile.school_id'))
      .toBeLessThan(interventionRoute.indexOf('getInterventionHistoryForStudent'))
  })

  it('security-definer remediation RPCs are unavailable to anon/authenticated clients', () => {
    expect(rpcSecurity).toContain('from public, anon, authenticated')
    expect(rpcSecurity).toContain('to service_role')
    expect(rpcSecurity).toContain('create_remediation_cycle_with_assignments')
    expect(rpcSecurity).toContain('evaluate_remediation_cycle')
    expect(rpcSecurity).toContain('consume_reservation_and_create_attempt')
  })

  it('retains explicit platform-super-admin policy instead of widening school staff scope', () => {
    const foundation = readFileSync(
      join(process.cwd(), 'supabase/migrations/20260818000000_phase_6c2a_remediation_foundation.sql'),
      'utf8',
    )
    expect(foundation).toContain('remediation_cycles_super_admin')
    expect(foundation).toContain('public.is_platform_super_admin()')
  })
})
