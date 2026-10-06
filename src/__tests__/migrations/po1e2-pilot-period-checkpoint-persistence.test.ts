import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const migrationPath = path.join(
  process.cwd(),
  'supabase/migrations/20261006020000_po1e2_pilot_period_checkpoint_persistence.sql',
)
const migration = fs.readFileSync(migrationPath, 'utf8')

describe('PO-1E.2 pilot period + checkpoint persistence', () => {
  it('creates explicit pilot period and checkpoint persistence', () => {
    expect(migration).toContain('create table if not exists public.pilot_measurement_periods')
    expect(migration).toContain('pilot_start_date date not null')
    expect(migration).toContain('pilot_end_date date not null')
    expect(migration).toContain('create table if not exists public.pilot_measurement_checkpoints')
    expect(migration).toContain("check (checkpoint_type in ('baseline','day_30','day_60','day_90'))")
    expect(migration).toContain('included_student_ids uuid[]')
    expect(migration).toContain('excluded_student_ids uuid[]')
  })

  it('enforces deterministic checkpoint target dates', () => {
    expect(migration).toContain('create or replace function public.pilot_checkpoint_target_date')
    expect(migration).toContain("when 'baseline' then return p_start_date")
    expect(migration).toContain("when 'day_30' then return p_start_date + 30")
    expect(migration).toContain("when 'day_60' then return p_start_date + 60")
    expect(migration).toContain("when 'day_90' then return p_start_date + 90")
  })

  it('limits official mutation to narrow platform-admin RPCs', () => {
    expect(migration).toContain("if not public.is_platform_admin() then")
    expect(migration).toContain("raise exception 'Platform admin required'")
    expect(migration).toContain('revoke all on public.pilot_measurement_periods from anon, authenticated')
    expect(migration).toContain('revoke all on public.pilot_measurement_checkpoints from anon, authenticated')
    expect(migration).not.toContain('for insert to authenticated')
    expect(migration).not.toContain('for update to authenticated')
    expect(migration).not.toContain('for delete to authenticated')
  })

  it('allows only same-school staff and platform admin to read', () => {
    expect(migration).toContain('public.is_school_staff(school_id)')
    expect(migration).toContain('public.current_user_school_id() = school_id')
    expect(migration).toContain('using (public.is_platform_admin())')
  })

  it('enforces one active period and one finalized checkpoint per type', () => {
    expect(migration).toContain('uq_pilot_measurement_periods_one_active_per_school')
    expect(migration).toContain("where status = 'active'")
    expect(migration).toContain('uq_pilot_measurement_checkpoints_finalized_type')
    expect(migration).toContain("where status = 'finalized'")
  })

  it('makes finalized checkpoint history immutable', () => {
    expect(migration).toContain('create or replace function public.prevent_finalized_pilot_checkpoint_mutation')
    expect(migration).toContain("old.status = 'finalized'")
    expect(migration).toContain("raise exception 'Finalized pilot measurement checkpoints are immutable'")
    expect(migration).toContain('before update or delete on public.pilot_measurement_checkpoints')
  })

  it('requires Day 90 finalization before completing the pilot period', () => {
    expect(migration).toContain("checkpoint_type = 'day_90'")
    expect(migration).toContain("and status = 'finalized'")
    expect(migration).toContain("raise exception 'Finalized Day 90 checkpoint required'")
  })

  it('keeps PO-1E persistence observational and separated from H&A/grade writes', () => {
    const lower = migration.toLowerCase()
    for (const forbidden of [
      'insert into public.hour_logs',
      'update public.hour_logs',
      'insert into public.attendance_records',
      'update public.attendance_records',
      'insert into public.student_progress',
      'update public.student_progress',
      'insert into public.quiz_attempts',
      'update public.quiz_attempts',
      'insert into public.grades',
      'update public.grades',
    ]) {
      expect(lower).not.toContain(forbidden)
    }
  })
})
