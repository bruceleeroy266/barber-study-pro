import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const read = (p: string) => fs.readFileSync(path.join(process.cwd(), p), 'utf8')

describe('A21-5 Chapters 1-21 persistence and security certification', () => {
  const ha5 = read('supabase/migrations/20260930223000_ha5_chapters_1_18_authorization_rls.sql')
  const h1 = read('supabase/migrations/20260930193000_ch19_h1_production_integrity.sql')
  const a21 = read('supabase/migrations/20261001031500_a21_5_ch19_21_evidence_authority.sql')
  const history = read('supabase/migrations/20260818000001_phase_6c2b_reassessment_integrity.sql')
  const activity = read('supabase/migrations/20260928043000_create_chapter_activity_evidence.sql')

  it('keeps remediation lifecycle writes server-authoritative for every chapter', () => {
    expect(ha5).toContain('revoke insert, update, delete on public.remediation_cycles from authenticated')
    expect(ha5).toContain('revoke insert, update, delete on public.remediation_cycle_events from authenticated')
    expect(ha5).toContain('revoke insert, update, delete on public.remediation_assignments from authenticated')
    const rpc = read('supabase/migrations/20260930200000_c19_h2_remediation_rpc_security.sql')
    expect(rpc).toContain('to service_role')
  })

  it('keeps reassessment history append-only and collision-safe', () => {
    expect(history).toContain('unique_user_concept_question unique (user_id, concept_id, question_id)')
    expect(history).toContain('before update or delete on public.reassessment_question_history')
    expect(history).toContain('immutable audit trail')
  })

  it('keeps first-attempt activity evidence immutable after insertion', () => {
    expect(activity).toContain('chapter_activity_evidence_first_attempt_unique')
    expect(activity).toContain('grant select, insert on table public.chapter_activity_evidence to authenticated')
    expect(activity).not.toContain('grant update')
    expect(activity).not.toContain('grant delete')
  })

  it('extends server-authoritative first-attempt evidence to Chapters 19-21', () => {
    expect(a21).toContain("chapter_id not in ('ch-19', 'ch-20', 'ch-21')")
    expect(a21).toContain("quiz_id not in ('quiz-19', 'quiz-20', 'quiz-21')")
    for (const chapter of [19, 20, 21]) {
      const micro = read(`src/app/api/chapter-${chapter}/micro-check/route.ts`)
      const evidence = read(`src/app/api/chapter-${chapter}/activity-evidence/route.ts`)
      expect(micro).toContain('createServiceRoleClient')
      expect(micro).toContain(`chapter_id: 'ch-${chapter}'`)
      expect(evidence).toContain('createServiceRoleClient')
      expect(evidence).toContain(`chapter_id: 'ch-${chapter}'`)
    }
  })

  it('prevents student-side mutation of authoritative remediation and exhaustion state', () => {
    expect(ha5).toContain('revoke insert, update, delete on public.concept_question_pool_exhaustion from authenticated')
    expect(ha5).toContain('revoke insert, update, delete on public.instructor_escalations from authenticated')
    expect(ha5).toContain('revoke insert, update, delete on public.instructor_escalation_events from authenticated')
  })

  it('preserves same-school tenant isolation for staff evidence reads', () => {
    expect(activity).toContain('is_school_staff(current_user_school_id())')
    expect(activity).toContain('current_user_school_id() = user_school_id(user_id)')
    expect(history).toContain('public.is_school_staff(public.current_user_school_id())')
    expect(history).toContain('public.current_user_school_id() = public.user_school_id(user_id)')
  })

  it('keeps service-role security-definer remediation RPCs unavailable to clients', () => {
    const rpc = read('supabase/migrations/20260930200000_c19_h2_remediation_rpc_security.sql')
    expect(rpc).toContain('from public, anon, authenticated')
    expect(rpc).toContain('to service_role')
    expect(rpc).toContain('consume_reservation_and_create_attempt')
    expect(rpc).toContain('evaluate_remediation_cycle')
  })

  it('does not weaken the certified Chapters 1-18 first-attempt insertion contract', () => {
    expect(a21).toContain("chapter_id not in ('ch-19', 'ch-20', 'ch-21')")
    expect(a21).not.toContain("chapter_id not in ('ch-1'")
    expect(h1).toContain('other certified chapters retain their existing authenticated insert path')
  })
})
