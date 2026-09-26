import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { calculateApprovedPeriodTotals } from '@/lib/hours/reporting'
import type { HoursReportLog } from '@/lib/hours/reporting'

const root = process.cwd()
const action = readFileSync(
  join(root, 'src/app/instructor/attendance/hour-generation-actions.ts'),
  'utf-8',
)
const migration = readFileSync(
  join(root, 'supabase/migrations/20260926072000_rejected_attendance_hour_resubmission.sql'),
  'utf-8',
)

describe('D2 rejected attendance-hour correction/resubmission', () => {
  it('preserves rejected history and allows only one active row per attendance source', () => {
    expect(migration).toContain('drop index if exists public.uq_hour_logs_source_attendance')
    expect(migration).toContain('create unique index if not exists uq_hour_logs_source_attendance_active')
    expect(migration).toContain("status in ('pending', 'approved')")
    expect(migration).toContain('resubmission_of_hour_log_id')
  })

  it('requires a resubmission to point to a rejected row for the same school, student, and attendance source', () => {
    expect(migration).toContain('rejected.id = hour_logs.resubmission_of_hour_log_id')
    expect(migration).toContain('rejected.source_attendance_id = hour_logs.source_attendance_id')
    expect(migration).toContain('rejected.school_id = hour_logs.school_id')
    expect(migration).toContain('rejected.user_id = hour_logs.user_id')
    expect(migration).toContain("rejected.status = 'rejected'")
  })

  it('does not resubmit an unchanged rejected generated entry', () => {
    expect(action).toContain('latestRejected.minutes === attendance.minutes_present')
    expect(action).toContain('latestRejected.category === category')
    expect(action).toContain('re-enter the admin queue')
  })

  it('creates a new pending revision instead of mutating the rejected row', () => {
    expect(action).toContain('resubmission_of_hour_log_id: latestRejected?.id ?? null')
    expect(action).toContain("status: 'pending'")
    expect(action).toContain("reviewed_by: null")
    expect(action).toContain("reviewed_at: null")
    expect(action).toContain("rejection_reason: null")
    expect(action).toContain("Corrected attendance resubmitted after hour rejection.")
  })

  it('keeps approved rows terminal and pending rows refreshable', () => {
    expect(action).toContain("if (existing.status !== 'pending')")
    expect(action).toContain(".eq('status', 'pending')")
    expect(action).toContain(".is('reviewed_by', null)")
    expect(action).toContain(".is('reviewed_at', null)")
  })

  it('prevents rejected history from double-counting official totals', () => {
    const logs: HoursReportLog[] = [
      {
        id: 'rejected-original',
        user_id: 'student-1',
        date: '2026-09-25',
        category: 'Other',
        minutes: 420,
        status: 'rejected',
        notes: null,
        rejection_reason: 'Arrival time was incorrect.',
        submitted_by: 'instructor-1',
        reviewed_by: 'admin-1',
        reviewed_at: '2026-09-25T17:00:00.000Z',
        created_at: '2026-09-25T12:00:00.000Z',
      },
      {
        id: 'approved-correction',
        user_id: 'student-1',
        date: '2026-09-25',
        category: 'Other',
        minutes: 390,
        status: 'approved',
        notes: 'Corrected attendance resubmitted after hour rejection.',
        submitted_by: 'instructor-1',
        reviewed_by: 'admin-1',
        reviewed_at: '2026-09-25T19:00:00.000Z',
        created_at: '2026-09-25T18:00:00.000Z',
      },
    ]

    const totals = calculateApprovedPeriodTotals(
      logs,
      new Date('2026-09-26T12:00:00.000Z'),
      'America/Chicago',
    )

    expect(totals.weekMinutes).toBe(390)
  })
})
