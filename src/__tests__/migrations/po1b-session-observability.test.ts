import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const migration = fs.readFileSync(
  path.join(
    process.cwd(),
    'supabase/migrations/20261002055000_po1b_session_observability.sql',
  ),
  'utf8',
)

describe('PO-1B pilot session observability database foundation', () => {
  it('creates authoritative session and append-only event tables', () => {
    expect(migration).toContain('create table if not exists public.study_sessions')
    expect(migration).toContain('create table if not exists public.study_session_events')
    expect(migration).toContain(
      'quiz_attempt_id uuid references public.quiz_attempts(id) on delete set null',
    )
    expect(migration).toContain('active_seconds integer not null default 0')
    expect(migration).toContain('credited_seconds integer not null default 0')
    expect(migration).toContain('client_event_at timestamptz')
    expect(migration).toContain("jsonb_typeof(metadata) = 'object'")
  })

  it('limits telemetry to registered learning surfaces and explicit event types', () => {
    expect(migration).toContain(
      "surface_type in ('lesson','flashcards','quiz','remediation','reassessment')",
    )
    expect(migration).toContain(
      "event_type in ('qualifying_activity','heartbeat','explicit_end','quiz_attempt_linked')",
    )
    expect(migration).toContain(
      "end_reason in ('explicit_end','idle_timeout','auth_end','recovered_abandonment')",
    )
  })

  it('builds the planned query indexes', () => {
    expect(migration).toContain('idx_study_sessions_user_opened')
    expect(migration).toContain('idx_study_sessions_school_user_opened')
    expect(migration).toContain('idx_study_sessions_active_user')
    expect(migration).toContain('idx_study_sessions_quiz_attempt')
    expect(migration).toContain('idx_study_sessions_surface')
    expect(migration).toContain('idx_study_session_events_session_received')
    expect(migration).toContain('idx_study_session_events_user_received')
    expect(migration).toContain('idx_study_session_events_school_received')
    expect(migration).toContain('idx_study_session_events_quiz_attempt')
  })

  it('enables RLS and permits read-only authenticated table access', () => {
    expect(migration).toContain(
      'alter table public.study_sessions enable row level security',
    )
    expect(migration).toContain(
      'alter table public.study_session_events enable row level security',
    )
    expect(migration).toContain('auth.uid() = user_id')
    expect(migration).toContain('public.is_school_staff(school_id)')
    expect(migration).toContain('public.user_school_id(user_id) = school_id')
    expect(migration).toContain('public.is_platform_admin()')
    expect(migration).toContain(
      'revoke all on public.study_sessions from anon, authenticated',
    )
    expect(migration).toContain(
      'revoke all on public.study_session_events from anon, authenticated',
    )
    expect(migration).toContain(
      'grant select on public.study_sessions to authenticated',
    )
    expect(migration).toContain(
      'grant select on public.study_session_events to authenticated',
    )
    expect(migration).not.toContain(
      'grant insert on public.study_sessions to authenticated',
    )
    expect(migration).not.toContain(
      'grant update on public.study_sessions to authenticated',
    )
    expect(migration).not.toContain(
      'grant delete on public.study_sessions to authenticated',
    )
  })

  it('derives identity and school server-side instead of trusting client IDs', () => {
    expect(migration).toContain('v_user_id uuid := auth.uid()')
    expect(migration).toContain('select role, school_id')
    expect(migration).toContain("v_profile.role not in ('student', 'apprentice')")
    expect(migration).toContain("raise exception 'School assignment required'")
    expect(migration).not.toContain('p_user_id uuid')
    expect(migration).not.toContain('p_school_id uuid')
  })

  it('opens sessions at zero credit and requires meaningful activity before heartbeat', () => {
    expect(migration).toContain('create or replace function public.begin_study_session')
    expect(migration).toContain(
      "if p_event_type = 'heartbeat' and v_session.first_active_at is null then",
    )
    expect(migration).toContain(
      "raise exception 'Heartbeat requires prior qualifying activity'",
    )
    expect(migration).toContain('v_credit_seconds := 0')
    expect(migration).toContain('set first_active_at = v_now')
  })

  it('uses one server-authoritative elapsed-time budget per user', () => {
    expect(migration).toContain('pg_advisory_xact_lock')
    expect(migration).toContain("hashtext('po1b-study-session')")
    expect(migration).toContain('v_now := clock_timestamp()')
    expect(migration).toContain('select max(last_credited_at)')
    expect(migration).toContain('where user_id = v_user_id')
    expect(migration).toContain('v_credit_seconds := least(v_elapsed_seconds, 300)')
    expect(migration).not.toContain('p_seconds integer')
    expect(migration).not.toContain('p_credited_seconds')
  })

  it('treats client event time as diagnostic only', () => {
    expect(migration).toContain('p_client_event_at timestamptz default null')
    expect(migration).toContain('client_event_at,')
    expect(migration).toContain('p_client_event_at,')
    expect(migration).not.toContain('v_now := p_client_event_at')
    expect(migration).not.toContain('v_elapsed_seconds := p_client_event_at')
  })

  it('rolls up only authoritative credited seconds into the existing daily aggregate', () => {
    expect(migration).toContain('if v_credit_seconds > 0 then')
    expect(migration).toContain('insert into public.study_activity_days')
    expect(migration).toContain(
      'active_seconds = study_activity_days.active_seconds + excluded.active_seconds',
    )
    expect(migration).toContain('v_credit_seconds,')
  })

  it('ends sessions idempotently without manufacturing close-time duration', () => {
    expect(migration).toContain('create or replace function public.end_study_session')
    expect(migration).toContain("if p_reason <> 'explicit_end' then")
    expect(migration).toContain('if v_session.ended_at is not null then')
    expect(migration).toContain('return;')
    expect(migration).toContain("'explicit_end',")
    expect(migration).not.toContain('active_seconds = study_sessions.active_seconds + 300')
  })

  it('links quiz telemetry only to the caller-owned matching quiz attempt', () => {
    expect(migration).toContain(
      'create or replace function public.link_study_quiz_attempt',
    )
    expect(migration).toContain("if v_session.surface_type <> 'quiz' then")
    expect(migration).toContain('from public.quiz_attempts')
    expect(migration).toContain('v_attempt.user_id <> v_user_id')
    expect(migration).toContain(
      'v_session.surface_id is distinct from v_attempt.quiz_id',
    )
    expect(migration).toContain(
      "raise exception 'Study session already linked to another quiz attempt'",
    )
    expect(migration).toContain("'quiz_attempt_linked',")
  })

  it('keeps telemetry out of grading, mastery, remediation, and readiness writes', () => {
    const sql = migration.toLowerCase()
    expect(sql).not.toContain('update public.quiz_attempts')
    expect(sql).not.toContain('insert into public.student_progress')
    expect(sql).not.toContain('update public.student_progress')
    expect(sql).not.toContain('insert into public.remediation_cycles')
    expect(sql).not.toContain('update public.remediation_cycles')
    expect(sql).not.toContain('board_readiness')
  })

  it('contains a hard H&A non-interference boundary', () => {
    const sql = migration.toLowerCase()
    expect(sql).not.toContain('public.hour_logs')
    expect(sql).not.toContain('effective_hour_logs')
    expect(sql).not.toContain('attendance_records')
    expect(sql).not.toContain('attendance_corrections')
    expect(sql).not.toContain('hour_adjustments')
    expect(sql).not.toContain('adjust_approved_hour')
  })

  it('uses narrow RPC execution grants and no anonymous mutation lane', () => {
    expect(migration).toContain(
      'revoke all on function public.begin_study_session(text, text) from public, anon',
    )
    expect(migration).toContain(
      'revoke all on function public.record_learning_activity(uuid, text, timestamptz) from public, anon',
    )
    expect(migration).toContain(
      'revoke all on function public.end_study_session(uuid, text) from public, anon',
    )
    expect(migration).toContain(
      'revoke all on function public.link_study_quiz_attempt(uuid, uuid) from public, anon',
    )
    expect(migration).toContain(
      'grant execute on function public.record_learning_activity(uuid, text, timestamptz) to authenticated',
    )
  })

  it('preserves the legacy tracker RPC until the later runtime cutover', () => {
    expect(migration).toContain(
      'Legacy record_study_activity(integer,text) intentionally remains available',
    )
    expect(migration).not.toContain(
      'revoke execute on function public.record_study_activity(integer, text) from authenticated',
    )
  })

  it('does not wire the student runtime in this database-only slice', () => {
    const sql = migration.toLowerCase()
    expect(sql).not.toContain('studyactivitytracker.tsx')
    expect(sql).not.toContain('usestudysession.ts')
    expect(sql).not.toContain('/api/study-sessions/')
  })
})
