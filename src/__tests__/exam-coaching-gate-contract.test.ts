import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const migration = fs.readFileSync(
  path.join(
    process.cwd(),
    'supabase/migrations/20261027120000_exam_coaching_gate.sql',
  ),
  'utf8',
)

describe('exam coaching gate migration contract', () => {
  it('stores the flag in the private schema with no application-role access', () => {
    expect(migration).toContain('create table if not exists private.deployment_flags')
    expect(migration).toContain(
      'revoke all on private.deployment_flags from public, anon, authenticated',
    )
    // The flag table must never be granted to any application role.
    expect(migration).not.toMatch(
      /grant\s+\w+.*on\s+private\.deployment_flags\s+to\s+(public|anon|authenticated)/i,
    )
  })

  it('defaults the flag to disabled and seeds a deny row', () => {
    expect(migration).toContain('enabled boolean not null default false')
    expect(migration).toContain("values ('exam_coaching', false)")
    expect(migration).toContain('on conflict (key) do nothing')
  })

  it('fails closed when the flag table or row is missing', () => {
    expect(migration).toContain("to_regclass('private.deployment_flags') is null")
    expect(migration).toContain(
      "(select enabled from private.deployment_flags where key='exam_coaching')",
    )
    expect(migration).toContain('Coaching is not enabled in this environment')
  })

  it('evaluates the gate before authorization and before any data access', () => {
    const gateIdx = migration.indexOf('Coaching is not enabled in this environment')
    const authzIdx = migration.indexOf('Instructor access required')
    const dataIdx = migration.indexOf('from public.comprehensive_exam_attempt_items')
    expect(gateIdx).toBeGreaterThan(-1)
    expect(authzIdx).toBeGreaterThan(gateIdx)
    expect(dataIdx).toBeGreaterThan(gateIdx)
  })

  it('preserves the existing instructor role, school, assignment, and completion checks', () => {
    const preserved = [
      "role='instructor'",
      "approval_status='approved'",
      'coalesce(is_disabled,false)=false',
      'a.instructor_id=v_caller and a.is_active=true and a.ended_at is null',
      "s.role in ('student','apprentice')",
      "t.status in ('completed','expired','recovered_finalized')",
      't.completed_at is not null',
    ]
    for (const fragment of preserved) {
      expect(migration).toContain(fragment)
    }
  })

  it('keeps the execute surface unchanged: authenticated only, never public/anon', () => {
    expect(migration).toContain(
      'revoke all on function public.get_assigned_student_exam_coaching(uuid,uuid) from public,anon',
    )
    expect(migration).toContain(
      'grant execute on function public.get_assigned_student_exam_coaching(uuid,uuid) to authenticated',
    )
    expect(migration).not.toMatch(
      /grant execute on function public\.get_assigned_student_exam_coaching.*to (public|anon)/i,
    )
  })
})
