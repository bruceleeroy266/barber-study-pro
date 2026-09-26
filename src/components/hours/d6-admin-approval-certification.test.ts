import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { calculateApprovedPeriodTotals } from '@/lib/hours/reporting'
import type { HoursReportLog } from '@/lib/hours/reporting'

const root = process.cwd()
const actions = readFileSync(
  join(root, 'src/app/instructor/hours/actions.ts'),
  'utf-8',
)
const manager = readFileSync(
  join(root, 'src/components/hours/StaffHoursManager.tsx'),
  'utf-8',
)
const generation = readFileSync(
  join(root, 'src/app/instructor/attendance/hour-generation-actions.ts'),
  'utf-8',
)
const resubmissionMigration = readFileSync(
  join(root, 'supabase/migrations/20260926072000_rejected_attendance_hour_resubmission.sql'),
  'utf-8',
)

describe('D6 final Admin Approval certification', () => {
  it('keeps single approval school-scoped, pending-only, reviewed, and idempotent', () => {
    expect(actions).toContain('export async function reviewStudentHours')
    expect(actions).toContain("if (target.status !== 'pending')")
    expect(actions).toContain(".eq('school_id', actor.school_id)")
    expect(actions).toContain(".eq('status', 'pending')")
    expect(actions).toContain('reviewed_by: user.id')
    expect(actions).toContain('reviewed_at: new Date().toISOString()')
    expect(actions).toContain('alreadyReviewed=')
  })

  it('bulk approves only the currently filtered pending ids and leaves rejection individual', () => {
    expect(actions).toContain('export async function bulkApproveStudentHours')
    expect(actions).toContain(".eq('school_id', actor.school_id)")
    expect(actions).toContain(".eq('status', 'pending')")
    expect(actions).toContain(".in('id', hourLogIds)")
    expect(manager).toContain('<form action={bulkApproveStudentHours}')
    expect(manager).toContain('filteredPendingLogs.map((log) => (')
    expect(manager).toContain('Rejections remain individual.')
    expect(manager).toContain('name="rejectionReason"')
    expect(manager).toContain('required')
  })

  it('requires and preserves rejection evidence', () => {
    expect(actions).toContain("if (decision === 'rejected' && !rejectionReason)")
    expect(actions).toContain("rejection_reason: decision === 'rejected' ? rejectionReason.slice(0, 500) : null")
    expect(manager).toContain("log.status === 'rejected' && log.rejection_reason")
    expect(manager).toContain('Rejection reason:')
  })

  it('preserves rejected attendance-generated history and creates a linked corrected resubmission', () => {
    expect(generation).toContain('latestRejected')
    expect(generation).toContain('latestRejected.minutes === attendance.minutes_present')
    expect(generation).toContain('latestRejected.category === category')
    expect(generation).toContain('resubmission_of_hour_log_id: latestRejected?.id ?? null')
    expect(generation).toContain("Corrected attendance resubmitted after hour rejection.")
    expect(resubmissionMigration).toContain('uq_hour_logs_source_attendance_active')
    expect(resubmissionMigration).toContain("status in ('pending', 'approved')")
    expect(resubmissionMigration).toContain('rejected.id = hour_logs.resubmission_of_hour_log_id')
  })

  it('keeps reviewed history separate from the pending queue with reviewer/time provenance', () => {
    expect(manager).toContain("const pendingLogs = logs.filter((log) => log.status === 'pending')")
    expect(manager).toContain("const reviewedLogs = logs.filter((log) => log.status === 'approved' || log.status === 'rejected')")
    expect(manager).toContain('{filteredPendingLogs.map((log) => {')
    expect(manager).toContain('{reviewedLogs.slice(0, 25).map((log) => {')
    expect(manager).toContain('actorNameMap.get(log.reviewed_by)')
    expect(manager).toContain('log.reviewed_at')
    expect(manager).toContain('Corrected resubmission')
  })

  it('counts only approved rows in official period totals after mixed review outcomes', () => {
    const logs: HoursReportLog[] = [
      {
        id: 'approved-single',
        user_id: 'student-1',
        date: '2026-09-24',
        category: 'Clinic',
        minutes: 360,
        status: 'approved',
        notes: null,
        submitted_by: 'instructor-1',
        reviewed_by: 'admin-1',
        reviewed_at: '2026-09-24T18:00:00.000Z',
        created_at: '2026-09-24T12:00:00.000Z',
      },
      {
        id: 'approved-bulk',
        user_id: 'student-1',
        date: '2026-09-25',
        category: 'Other',
        minutes: 420,
        status: 'approved',
        notes: null,
        submitted_by: 'instructor-1',
        reviewed_by: 'admin-1',
        reviewed_at: '2026-09-25T18:00:00.000Z',
        created_at: '2026-09-25T12:00:00.000Z',
      },
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
        created_at: '2026-09-25T11:00:00.000Z',
      },
      {
        id: 'pending-correction',
        user_id: 'student-1',
        date: '2026-09-26',
        category: 'Other',
        minutes: 390,
        status: 'pending',
        notes: 'Corrected attendance resubmitted after hour rejection.',
        submitted_by: 'instructor-1',
        reviewed_by: null,
        reviewed_at: null,
        created_at: '2026-09-26T12:00:00.000Z',
      },
    ]

    const totals = calculateApprovedPeriodTotals(
      logs,
      new Date('2026-09-26T16:00:00.000Z'),
      'America/Chicago',
    )

    expect(totals.weekMinutes).toBe(780)
    expect(totals.monthMinutes).toBe(780)
    expect(totals.yearMinutes).toBe(780)
  })

  it('keeps the staff-view accumulated and period totals approved-only', () => {
    expect(manager).toContain(".filter((log) => log.status === 'approved')")
    expect(manager).toContain(".filter((log) => log.status === 'pending')")
    expect(manager).toContain('calculateApprovedPeriodTotals(studentLogs, new Date(), schoolTimeZone)')
    expect(manager).toContain('Accumulated')
    expect(manager).toContain('This Week')
    expect(manager).toContain('This Month')
    expect(manager).toContain('This Year')
  })
})
