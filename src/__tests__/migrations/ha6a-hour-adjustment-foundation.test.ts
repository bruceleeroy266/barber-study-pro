import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const migration = fs.readFileSync(
  path.join(
    process.cwd(),
    'supabase/migrations/20261001153000_ha6a_hour_adjustment_foundation.sql',
  ),
  'utf8',
)

describe('H&A-6A hour adjustment database foundation', () => {
  it('adds a dedicated optimistic-concurrency version to hour_logs', () => {
    expect(migration).toContain(
      'add column if not exists adjustment_version integer not null default 0',
    )
    expect(migration).toContain('adjustment_version >= 0')
    expect(migration).toContain("(status = 'approved' or adjustment_version = 0)")
  })

  it('creates an immutable adjustment ledger with the complete audit contract', () => {
    expect(migration).toContain('create table if not exists public.hour_adjustments')
    expect(migration).toContain('hour_log_id uuid not null references public.hour_logs(id) on delete restrict')
    expect(migration).toContain('student_id uuid not null references public.profiles(id) on delete restrict')
    expect(migration).toContain('adjustment_sequence integer not null')
    expect(migration).toContain('original_minutes integer not null')
    expect(migration).toContain('previous_effective_minutes integer not null')
    expect(migration).toContain('new_effective_minutes integer not null')
    expect(migration).toContain(
      'delta_minutes integer generated always as (new_effective_minutes - previous_effective_minutes) stored',
    )
    expect(migration).toContain('adjusted_by uuid not null references public.profiles(id) on delete restrict')
    expect(migration).toContain('previous_adjustment_id uuid references public.hour_adjustments(id) on delete restrict')
    expect(migration).toContain('hour_adjustments_log_sequence_unique unique (hour_log_id, adjustment_sequence)')
    expect(migration).toContain('hour_adjustments_previous_link_unique unique (previous_adjustment_id)')
  })

  it('permits zero-credit corrections but rejects negative, oversized, no-op, or unexplained adjustments', () => {
    expect(migration).toContain('new_effective_minutes >= 0')
    expect(migration).toContain('new_effective_minutes <= 1440')
    expect(migration).toContain('new_effective_minutes <> previous_effective_minutes')
    expect(migration).toContain('char_length(btrim(reason)) between 10 and 500')
  })

  it('makes adjustment rows append-only and unavailable for direct client writes', () => {
    expect(migration).toContain('before update or delete on public.hour_adjustments')
    expect(migration).toContain(
      "raise exception 'hour_adjustments are immutable; create a new adjustment instead'",
    )
    expect(migration).toContain(
      'revoke insert, update, delete on public.hour_adjustments from anon, authenticated',
    )
    expect(migration).toContain('grant select on public.hour_adjustments to authenticated')
    expect(migration).not.toContain('create policy hour_adjustments_insert')
    expect(migration).not.toContain('create policy hour_adjustments_update')
    expect(migration).not.toContain('create policy hour_adjustments_delete')
  })

  it('keeps adjustment reads tenant-scoped while allowing students to see their own history', () => {
    expect(migration).toContain('student_id = auth.uid()')
    expect(migration).toContain('public.is_school_staff(school_id)')
    expect(migration).toContain('public.is_platform_admin()')
  })

  it('blocks direct authenticated deletion and direct edits of approved hour evidence', () => {
    expect(migration).toContain('revoke delete on public.hour_logs from authenticated')
    expect(migration).toContain('drop policy if exists hour_logs_delete on public.hour_logs')
    expect(migration).toContain("and hour_logs.status = 'pending'")
    expect(migration).toContain('and hour_logs.adjustment_version = 0')
  })

  it('preserves the existing pending admin review and instructor attendance-refresh lanes', () => {
    expect(migration).toContain("hour_logs.status in ('pending', 'approved', 'rejected')")
    expect(migration).toContain("public.current_user_role() = 'instructor'")
    expect(migration).toContain("hour_logs.source_type = 'attendance'")
    expect(migration).toContain('ar.minutes_present = hour_logs.minutes')
    expect(migration).toContain('rejected.id = hour_logs.resubmission_of_hour_log_id')
  })

  it('uses one atomic server-authoritative RPC for approved-hour corrections', () => {
    expect(migration).toContain('create or replace function public.adjust_approved_hour(')
    expect(migration).toContain('for update;')
    expect(migration).toContain("if v_hour.status <> 'approved' then")
    expect(migration).toContain(
      'if v_hour.adjustment_version <> p_expected_adjustment_version then',
    )
    expect(migration).toContain('insert into public.hour_adjustments')
    expect(migration).toContain('set adjustment_version = adjustment_version + 1')
    expect(migration).toContain(
      'and adjustment_version = p_expected_adjustment_version',
    )
    expect(migration).toContain('security definer')
  })

  it('derives chain state instead of trusting client-supplied audit values', () => {
    expect(migration).toContain('v_previous_effective := v_previous.new_effective_minutes')
    expect(migration).toContain('v_next_sequence := v_previous.adjustment_sequence + 1')
    expect(migration).toContain('v_previous_effective := v_hour.minutes')
    expect(migration).toContain('v_next_sequence := 1')
    expect(migration).toContain('v_hour.minutes,')
    expect(migration).toContain('auth.uid(),')
  })

  it('fails closed on broken adjustment chains', () => {
    expect(migration).toContain(
      "raise exception 'Hour adjustment chain integrity check failed'",
    )
    expect(migration).toContain(
      'v_previous.adjustment_sequence <> v_hour.adjustment_version',
    )
    expect(migration).toContain('v_previous.original_minutes <> v_hour.minutes')
  })

  it('requires attendance-generated adjustments to match authoritative attendance evidence', () => {
    expect(migration).toContain("if v_hour.source_type = 'attendance' then")
    expect(migration).toContain('ar.id = v_hour.source_attendance_id')
    expect(migration).toContain('ar.school_id = v_hour.school_id')
    expect(migration).toContain('ar.user_id = v_hour.user_id')
    expect(migration).toContain('ar.date = v_hour.date')
    expect(migration).toContain("ar.status in ('Present', 'Tardy')")
    expect(migration).toContain(
      'ar.minutes_present = p_new_effective_minutes',
    )
  })

  it('rejects inactive accounts, unauthorized roles, stale versions, and no-op adjustments', () => {
    expect(migration).toContain('coalesce(v_actor.is_disabled, false)')
    expect(migration).toContain("coalesce(v_actor.approval_status, '') <> 'approved'")
    expect(migration).toContain("v_actor.role in ('admin', 'school_admin')")
    expect(migration).toContain("v_actor.role = 'admin'")
    expect(migration).toContain(
      "raise exception 'Hour record changed since it was loaded; refresh before adjusting'",
    )
    expect(migration).toContain(
      "raise exception 'Corrected minutes must differ from the current official value'",
    )
  })

  it('does not cross the learning-system implementation boundary', () => {
    expect(migration.toLowerCase()).not.toContain('src/lib/tls')
    expect(migration.toLowerCase()).not.toContain('remediation_cycles')
    expect(migration.toLowerCase()).not.toContain('quiz_attempts')
    expect(migration.toLowerCase()).not.toContain('student_progress')
  })
})
