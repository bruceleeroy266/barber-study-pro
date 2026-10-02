import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const migration = fs.readFileSync(
  path.join(
    process.cwd(),
    'supabase/migrations/20261002122100_po1c1_comprehensive_exam_database_foundation.sql',
  ),
  'utf8',
)

describe('PO-1C.1 comprehensive exam database foundation', () => {
  it('creates exactly the seven planned comprehensive-exam tables', () => {
    const tables = [
      'comprehensive_exam_configs',
      'comprehensive_exam_config_domains',
      'comprehensive_exam_questions',
      'comprehensive_exam_config_questions',
      'comprehensive_exam_attempts',
      'comprehensive_exam_attempt_items',
      'comprehensive_exam_attempt_events',
    ]

    for (const table of tables) {
      expect(migration).toContain(`create table if not exists public.${table}`)
    }
  })

  it('locks the standard exam to 100 scored plus 10 unscored questions', () => {
    expect(migration).toContain('scored_question_count integer not null default 100')
    expect(migration).toContain('unscored_question_count integer not null default 10')
    expect(migration).toContain('check (scored_question_count = 100)')
    expect(migration).toContain('check (unscored_question_count = 10)')
    expect(migration).toContain('scored_total integer not null default 100')
    expect(migration).toContain('unscored_total integer not null default 10')
  })

  it('locks the verified four-domain blueprint at activation', () => {
    expect(migration).toContain(
      "(domain = 'scientific_concepts' and weight_percent = 35 and scored_question_count = 35)",
    )
    expect(migration).toContain(
      "(domain = 'implements_equipment' and weight_percent = 10 and scored_question_count = 10)",
    )
    expect(migration).toContain(
      "(domain = 'hair_care_services' and weight_percent = 40 and scored_question_count = 40)",
    )
    expect(migration).toContain(
      "(domain = 'facial_hair_skin_care_services' and weight_percent = 15 and scored_question_count = 15)",
    )
    expect(migration).toContain('v_weight_total <> 100')
    expect(migration).toContain('v_scored_total <> 100')
  })

  it('keeps comprehensive attempts separate from chapter quiz_attempts', () => {
    expect(migration).toContain('public.comprehensive_exam_attempts')
    expect(migration).not.toContain(
      'references public.quiz_attempts(id)',
    )
    expect(migration.toLowerCase()).not.toContain(
      'insert into public.quiz_attempts',
    )
    expect(migration.toLowerCase()).not.toContain(
      'update public.quiz_attempts',
    )
  })

  it('stores private authoritative answer keys only in protected tables', () => {
    expect(migration).toContain('correct_option text not null')
    expect(migration).toContain('correct_option_snapshot text not null')
    expect(migration).toContain('explanation_snapshot text not null')
    expect(migration).toContain(
      'revoke all on public.comprehensive_exam_questions from anon, authenticated',
    )
    expect(migration).toContain(
      'revoke all on public.comprehensive_exam_attempt_items from anon, authenticated',
    )
    expect(migration).not.toContain(
      'grant select on public.comprehensive_exam_questions to authenticated',
    )
    expect(migration).not.toContain(
      'grant select on public.comprehensive_exam_attempt_items to authenticated',
    )
  })

  it('persists immutable attempt identity, timer, versioning, retake, and telemetry linkage fields', () => {
    expect(migration).toContain('config_version integer not null')
    expect(migration).toContain('blueprint_version text not null')
    expect(migration).toContain('question_bank_version text not null')
    expect(migration).toContain('scoring_policy_version text not null')
    expect(migration).toContain('started_at timestamptz not null')
    expect(migration).toContain('expires_at timestamptz not null')
    expect(migration).toContain('attempt_number integer not null')
    expect(migration).toContain('previous_attempt_id uuid references public.comprehensive_exam_attempts')
    expect(migration).toContain(
      'study_session_id uuid not null references public.study_sessions(id) on delete restrict',
    )
  })

  it('prevents duplicate active attempts and duplicate attempt numbering', () => {
    expect(migration).toContain('uq_comprehensive_exam_attempt_active_user_config')
    expect(migration).toContain("where status = 'active'")
    expect(migration).toContain('uq_comprehensive_exam_attempt_number')
    expect(migration).toContain('(user_id, config_id, attempt_number)')
  })

  it('protects one active configuration version per slug', () => {
    expect(migration).toContain('uq_comprehensive_exam_configs_active_slug')
    expect(migration).toContain('on public.comprehensive_exam_configs(slug)')
    expect(migration).toContain("where status = 'active'")
  })

  it('creates the planned attempt and event query indexes', () => {
    const indexes = [
      'idx_comprehensive_exam_attempts_user_started',
      'idx_comprehensive_exam_attempts_school_started',
      'idx_comprehensive_exam_attempts_school_user_started',
      'idx_comprehensive_exam_attempts_config_started',
      'idx_comprehensive_exam_attempts_status_expires',
      'uq_comprehensive_exam_attempt_items_position',
      'uq_comprehensive_exam_attempt_items_question',
      'idx_comprehensive_exam_attempt_items_attempt_flagged',
      'idx_comprehensive_exam_attempt_items_attempt_answered',
      'idx_comprehensive_exam_attempt_items_domain',
      'idx_comprehensive_exam_attempt_events_attempt_received',
      'idx_comprehensive_exam_attempt_events_user_received',
      'idx_comprehensive_exam_attempt_events_school_received',
    ]

    for (const index of indexes) {
      expect(migration).toContain(index)
    }
  })

  it('enables RLS across every new public table', () => {
    const tables = [
      'comprehensive_exam_configs',
      'comprehensive_exam_config_domains',
      'comprehensive_exam_questions',
      'comprehensive_exam_config_questions',
      'comprehensive_exam_attempts',
      'comprehensive_exam_attempt_items',
      'comprehensive_exam_attempt_events',
    ]

    for (const table of tables) {
      expect(migration).toContain(
        `alter table public.${table} enable row level security`,
      )
    }
  })

  it('permits authenticated users to read only safe attempt summaries directly', () => {
    expect(migration).toContain(
      'grant select on public.comprehensive_exam_attempts to authenticated',
    )
    expect(migration).toContain('(select auth.uid()) = user_id')
    expect(migration).toContain('public.is_school_staff(school_id)')
    expect(migration).toContain('public.user_school_id(user_id) = school_id')
    expect(migration).toContain('public.is_platform_admin()')

    const forbiddenDirectGrants = [
      'comprehensive_exam_configs',
      'comprehensive_exam_config_domains',
      'comprehensive_exam_questions',
      'comprehensive_exam_config_questions',
      'comprehensive_exam_attempt_items',
      'comprehensive_exam_attempt_events',
    ]

    for (const table of forbiddenDirectGrants) {
      expect(migration).not.toContain(
        `grant select on public.${table} to authenticated`,
      )
    }
  })

  it('does not grant direct authenticated mutation on exam tables', () => {
    const sql = migration.toLowerCase()
    expect(sql).not.toContain(
      'grant insert on public.comprehensive_exam_attempts to authenticated',
    )
    expect(sql).not.toContain(
      'grant update on public.comprehensive_exam_attempts to authenticated',
    )
    expect(sql).not.toContain(
      'grant delete on public.comprehensive_exam_attempts to authenticated',
    )
    expect(sql).not.toContain(
      'grant insert on public.comprehensive_exam_attempt_items to authenticated',
    )
    expect(sql).not.toContain(
      'grant update on public.comprehensive_exam_attempt_items to authenticated',
    )
  })

  it('extends PO-1B with an explicit comprehensive_exam telemetry surface', () => {
    expect(migration).toContain("'comprehensive_exam'")
    expect(migration).toContain(
      'drop constraint if exists study_sessions_surface_type_check',
    )
    expect(migration).toContain(
      'drop constraint if exists study_session_events_surface_type_check',
    )
    expect(migration).toContain(
      'create or replace function public.begin_study_session',
    )
    expect(migration).toContain(
      "if p_surface_type not in (",
    )
  })

  it('does not overload the legacy quiz_attempt telemetry foreign key', () => {
    expect(migration).toContain("'comprehensive_exam'")
    expect(migration).not.toContain(
      'comprehensive_exam_attempt_id uuid references public.quiz_attempts',
    )
  })

  it('creates a privileged fail-closed configuration activation boundary', () => {
    expect(migration).toContain(
      'create or replace function public.activate_comprehensive_exam_config',
    )
    expect(migration).toContain('if not public.is_platform_admin() then')
    expect(migration).toContain("raise exception 'Platform admin required'")
    expect(migration).toContain('for update;')
    expect(migration).toContain(
      "raise exception 'Exam time limit must be configured before activation'",
    )
    expect(migration).toContain(
      "raise exception 'Passing percentage must be configured before activation'",
    )
    expect(migration).toContain(
      "raise exception 'Insufficient scored question inventory for configured blueprint'",
    )
    expect(migration).toContain(
      "raise exception 'Insufficient unique unscored capacity after preserving scored quotas'",
    )
    expect(migration).toContain(
      'revoke execute on function public.activate_comprehensive_exam_config(uuid)',
    )
    expect(migration).toContain(
      'grant execute on function public.activate_comprehensive_exam_config(uuid)',
    )
  })

  it('keeps the question registry empty in the database-foundation slice', () => {
    const sql = migration.toLowerCase()
    expect(sql).not.toContain('insert into public.comprehensive_exam_questions')
    expect(sql).not.toContain(
      'insert into public.comprehensive_exam_config_questions',
    )
  })

  it('does not implement attempt runtime RPCs in PO-1C.1', () => {
    const sql = migration.toLowerCase()
    expect(sql).not.toContain('start_or_resume_comprehensive_exam')
    expect(sql).not.toContain('save_comprehensive_exam_answer')
    expect(sql).not.toContain('set_comprehensive_exam_flag')
    expect(sql).not.toContain('submit_comprehensive_exam_attempt')
    expect(sql).not.toContain('_finalize_comprehensive_exam_attempt')
    expect(sql).not.toContain('get_my_comprehensive_exam_history')
  })

  it('contains no simulator UI or API-route implementation', () => {
    const sql = migration.toLowerCase()
    expect(sql).not.toContain('/api/comprehensive-exam/')
    expect(sql).not.toContain('examshell.tsx')
    expect(sql).not.toContain('questionnavigator.tsx')
    expect(sql).not.toContain('examresults.tsx')
  })

  it('preserves the H&A firewall', () => {
    const sql = migration.toLowerCase()
    expect(sql).not.toContain('public.hour_logs')
    expect(sql).not.toContain('effective_hour_logs')
    expect(sql).not.toContain('attendance_records')
    expect(sql).not.toContain('attendance_corrections')
    expect(sql).not.toContain('hour_adjustments')
    expect(sql).not.toContain('adjust_approved_hour')
  })

  it('does not create a new readiness formula or write student mastery', () => {
    const sql = migration.toLowerCase()
    expect(sql).not.toContain('insert into public.student_progress')
    expect(sql).not.toContain('update public.student_progress')
    expect(sql).not.toContain('board_readiness')
    expect(sql).not.toContain('readiness_score')
  })
})
