import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const migration = fs.readFileSync(
  path.join(
    process.cwd(),
    'supabase/migrations/20261003135000_academic_reset_baseline.sql',
  ),
  'utf8',
)

describe('academic reset baseline', () => {
  it('creates an auditable reset event table and guarded RPC', () => {
    expect(migration).toContain('create table if not exists public.academic_reset_events')
    expect(migration).toContain('create or replace function public.reset_student_academic_state')
    expect(migration).toContain("v_target_role not in ('student', 'apprentice')")
    expect(migration).toContain('public.is_platform_admin()')
    expect(migration).toContain("v_actor_role in ('school_admin', 'admin')")
    expect(migration).toContain('pg_advisory_xact_lock')
  })

  it('resets the current learning evidence surfaces', () => {
    const requiredDeletes = [
      'public.comprehensive_exam_attempts',
      'public.study_sessions',
      'public.study_activity_days',
      'public.flagged_flashcards',
      'public.chapter_activity_evidence',
      'public.chapter_micro_check_attempts',
      'public.missed_questions',
      'public.follow_up_evidence',
      'public.concept_question_pool_exhaustion',
      'public.reassessment_question_history',
      'public.remediation_cycles',
      'public.quiz_attempts',
      'public.student_progress',
    ]

    for (const table of requiredDeletes) {
      expect(migration).toContain(`delete from ${table}`)
    }
  })

  it('retires carry-over learning state while preserving instructor-owned escalation history', () => {
    expect(migration).toContain('update public.sustained_performance_tracking')
    expect(migration).toContain('is_active = false')
    expect(migration).toContain('update public.instructor_escalations')
    expect(migration).toContain("and status = 'pending'")
    expect(migration).toContain("status = 'expired'")
  })

  it('keeps formal gradebook deletion opt-in', () => {
    expect(migration).toContain('p_include_gradebook boolean default false')
    expect(migration).toContain('if p_include_gradebook then')
    expect(migration).toContain('delete from public.grades')
    expect(migration).toContain('delete from public.assessments')
  })

  it('does not delete operational or identity records', () => {
    const forbiddenDeletes = [
      'public.profiles',
      'public.schools',
      'public.enrollments',
      'public.student_instructor_assignments',
      'public.attendance_records',
      'public.attendance_audit_log',
      'public.attendance_notes',
      'public.hour_logs',
      'public.hour_adjustments',
      'public.student_schedule_profiles',
      'public.student_schedule_overrides',
      'public.communication_threads',
      'public.bulletin_acknowledgments',
      'public.instructor_notes',
      'public.security_logs',
    ]

    for (const table of forbiddenDeletes) {
      expect(migration).not.toContain(`delete from ${table}`)
    }
  })

  it('does not expose a direct anonymous reset lane', () => {
    expect(migration).toContain(
      'revoke all on function public.reset_student_academic_state(uuid, text, boolean)',
    )
    expect(migration).toContain('from public, anon')
    expect(migration).toContain(
      'grant execute on function public.reset_student_academic_state(uuid, text, boolean)',
    )
    expect(migration).toContain('to authenticated')
  })
})
