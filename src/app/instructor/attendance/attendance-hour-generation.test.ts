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

  it('handles races by treating unique violations as duplicate-safe skips', () => {
    expect(action).toContain("error.code === '23505'")
    expect(action).toContain('skipped += 1')
  })
})
