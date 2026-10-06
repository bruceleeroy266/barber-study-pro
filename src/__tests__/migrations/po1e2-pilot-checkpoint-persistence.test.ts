import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const migrationPath = path.join(
  process.cwd(),
  'supabase/migrations/20261006020000_po1e2_pilot_checkpoint_persistence.sql'
)
const migration = fs.readFileSync(migrationPath, 'utf8')

describe('PO-1E.2 pilot period and checkpoint persistence', () => {
  it('creates explicit pilot periods with deterministic lifecycle fields', () => {
    expect(migration).toContain('create table if not exists public.pilot_measurement_periods')
    expect(migration).toContain('pilot_start_date date not null')
    expect(migration).toContain('pilot_end_date date not null')
    expect(migration).toContain("status in ('draft', 'active', 'completed', 'cancelled')")
    expect(migration).toContain('uq_pilot_measurement_period_active_school')
  })

  it('creates Baseline/30/60/90 checkpoint snapshots with coverage and membership evidence', () => {
    expect(migration).toContain('create table if not exists public.pilot_measurement_checkpoints')
    expect(migration).toContain("checkpoint_type in ('baseline','day_30','day_60','day_90')")
    expect(migration).toContain('cohort_membership jsonb')
    expect(migration).toContain('coverage jsonb')
    expect(migration).toContain('metrics jsonb')
    expect(migration).toContain('schema_version text not null')
  })

  it('makes finalized checkpoints immutable and unique per period/type', () => {
    expect(migration).toContain('prevent_finalized_pilot_checkpoint_mutation')
    expect(migration).toContain("if old.status = 'finalized' then")
    expect(migration).toContain('trg_prevent_finalized_pilot_checkpoint_update')
    expect(migration).toContain('trg_prevent_finalized_pilot_checkpoint_delete')
    expect(migration).toContain('uq_pilot_checkpoint_finalized_period_type')
  })

  it('keeps reads tenant-scoped while allowing platform-admin audit', () => {
    expect(migration).toContain('school_id = public.current_user_school_id()')
    expect(migration).toContain('public.is_school_staff(school_id)')
    expect(migration).toContain('public.is_platform_admin()')
    expect(migration).toContain('enable row level security')
  })

  it('requires authorized server-side activation/finalization and is idempotent on finalized checkpoints', () => {
    expect(migration).toContain('create or replace function public.activate_pilot_measurement_period')
    expect(migration).toContain('public.is_school_admin(v_period.school_id)')
    expect(migration).toContain('create or replace function public.finalize_pilot_measurement_checkpoint')
    expect(migration).toContain('public.is_school_admin(v_checkpoint.school_id)')
    expect(migration).toContain("if v_checkpoint.status = 'finalized' then")
    expect(migration).toContain('return v_checkpoint')
  })

  it('does not write H&A or learning evidence tables', () => {
    expect(migration).not.toContain('insert into public.hour_logs')
    expect(migration).not.toContain('update public.hour_logs')
    expect(migration).not.toContain('insert into public.student_progress')
    expect(migration).not.toContain('update public.student_progress')
    expect(migration).not.toContain('insert into public.quiz_attempts')
    expect(migration).not.toContain('update public.quiz_attempts')
  })
})
