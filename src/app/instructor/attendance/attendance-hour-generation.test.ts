import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const migration = readFileSync(
  join(root, 'supabase/migrations/20260926070000_attendance_generated_hour_logs.sql'),
  'utf-8',
)
const action = readFileSync(
  join(root, 'src/app/instructor/attendance/hour-generation-actions.ts'),
  'utf-8',
)

describe('Segment C attendance-generated hours', () => {
  it('enforces one hour log per attendance record at the database layer', () => {
    expect(migration).toContain('source_attendance_id')
    expect(migration).toContain('create unique index if not exists uq_hour_logs_source_attendance')
    expect(migration).toContain('where source_attendance_id is not null')
  })

  it('only generates hours for attended Present or Tardy records with positive minutes', () => {
    expect(action).toContain(".in('status', ['Present', 'Tardy'])")
    expect(action).toContain(".gt('minutes_present', 0)")
  })

  it('creates pending attendance-sourced hour logs for admin approval', () => {
    expect(action).toContain("status: 'pending'")
    expect(action).toContain("source_type: 'attendance'")
    expect(action).toContain('source_attendance_id: attendance.id')
    expect(action).toContain("reviewed_by: null")
    expect(action).toContain("reviewed_at: null")
  })

  it('reconciles still-pending generated hours but never overwrites reviewed rows', () => {
    expect(action).toContain("if (existing.status !== 'pending')")
    expect(action).toContain("notes: 'Updated from resubmitted Daily Attendance & Hours.'")
    expect(action).toContain(".eq('status', 'pending')")
    expect(action).toContain(".is('reviewed_by', null)")
    expect(action).toContain(".is('reviewed_at', null)")
    expect(action).toContain('if (!refreshed)')
  })

  it('handles races by treating unique violations as duplicate-safe skips', () => {
    expect(action).toContain("error.code === '23505'")
    expect(action).toContain('skipped += 1')
  })

  it('keeps manual submissions supported while binding generated rows to attendance evidence', () => {
    expect(migration).toContain("(source_type = 'manual' and source_attendance_id is null)")
    expect(migration).toContain("source_type = 'attendance'")
    expect(migration).toContain('ar.minutes_present = minutes')
    expect(migration).toContain("ar.status in ('Present', 'Tardy')")
  })

  it('preserves school-admin approval access while limiting instructor updates to pending generated rows', () => {
    expect(migration).toContain('public.is_school_admin(school_id)')
    expect(migration).toContain("public.current_user_role() = 'instructor'")
    expect(migration).toContain("status = 'pending'")
    expect(migration).toContain('submitted_by = auth.uid()')
  })
})
