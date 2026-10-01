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

  it('keeps chapter assessment and micro-check evidence inside the same school tenant', () => {
    const quizRls = readFileSync(
      join(process.cwd(), 'supabase/migrations/20260714010000_fix_quiz_progress_missed_rls.sql'),
      'utf8',
    )
    const oversight = readFileSync(
      join(process.cwd(), 'src/lib/oversight/chapters-1-10-role-connection.test.ts'),
      'utf8',
    )
    expect(quizRls).toContain('quiz_attempts_staff_select')
    expect(quizRls).toContain('public.current_user_school_id() = public.user_school_id(user_id)')
    expect(oversight).toContain('chapter_micro_check_attempts_staff_select')
    expect(oversight).toContain('current_user_school_id() = user_school_id(user_id)')
  })

  it('blocks forged reassessment/exhaustion and direct escalation lifecycle writes', () => {
    expect(migration).toContain('drop policy if exists concept_question_pool_exhaustion_insert')
    expect(migration).toContain('revoke insert, update, delete on public.concept_question_pool_exhaustion from authenticated')
    expect(migration).toContain('drop policy if exists instructor_escalations_instructor_update')
    expect(migration).toContain('revoke insert, update, delete on public.instructor_escalations from authenticated')
    expect(migration).toContain('revoke insert, update, delete on public.instructor_escalation_events from authenticated')
  })

  it('binds instructor-note creation to actor, target student, and one school', () => {
    expect(migration).toContain('drop policy if exists instructor_notes_all')
    expect(migration).toContain('create policy instructor_notes_insert')
    expect(migration).toContain('public.current_user_school_id() = school_id')
    expect(migration).toContain('public.user_school_id(student_id) = school_id')
    expect(migration).toContain('instructor_id = auth.uid()')
    expect(migration).toContain('revoke update, delete on public.instructor_notes from authenticated')
  })

  it('gives the canonical platform admin read-only cross-school diagnostics', () => {
    const expected = [
      'Remediation cycles: platform admin read all',
      'Reassessment history: platform admin read all',
      'Remediation evaluations: platform admin read all',
      'Instructor escalations: platform admin read all',
      'Sustained performance: platform admin read all',
      'Follow-up evidence: platform admin read all',
    ]
    for (const policy of expected) expect(migration).toContain(policy)
    expect(migration).toContain('for select to authenticated using (public.is_platform_admin())')
  })

  it('binds instructor note read actions to the target student tenant', () => {
    const actions = readFileSync(
      join(process.cwd(), 'src/app/instructor/student/[studentId]/actions.ts'),
      'utf8',
    )
    expect(actions).toContain(".eq('id', studentId)")
    expect(actions).toContain(".in('role', ['student', 'apprentice'])")
    expect(actions).toContain('student.school_id !== profile.school_id')
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
