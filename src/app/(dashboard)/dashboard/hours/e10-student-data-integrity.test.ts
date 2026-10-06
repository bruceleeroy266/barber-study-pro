import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { calculateApprovedPeriodTotals } from '@/lib/hours/reporting'
import type { HoursReportLog } from '@/lib/hours/reporting'

const root = process.cwd()
const studentPage = readFileSync(
  join(root, 'src/app/(dashboard)/dashboard/hours/page.tsx'),
  'utf-8',
)
const reviewActions = readFileSync(
  join(root, 'src/app/instructor/hours/actions.ts'),
  'utf-8',
)
const generationActions = readFileSync(
  join(root, 'src/app/instructor/attendance/hour-generation-actions.ts'),
  'utf-8',
)
const generatedHoursMigration = readFileSync(
  join(root, 'supabase/migrations/20260926070000_attendance_generated_hour_logs.sql'),
  'utf-8',
)
const resubmissionMigration = readFileSync(
  join(root, 'supabase/migrations/20260926072000_rejected_attendance_hour_resubmission.sql'),
  'utf-8',
)
const delegatedApproverMigration = readFileSync(
  join(root, 'supabase/migrations/20261006214500_delegated_hour_approver.sql'),
  'utf-8',
)

describe('E10 student data integrity audit', () => {
  it('keeps official student totals approved-only and pending isolated', () => {
    expect(studentPage).toContain(".from('effective_hour_logs')")
    expect(studentPage).toContain('calculateHoursProgressSummary(reportingHours, requirements.requiredHours)')
    expect(studentPage).toContain('pendingMinutes')
    expect(studentPage).toContain('Based on approved hours only')
    expect(studentPage).toContain('Pending hours remain separate until administrator approval.')
  })

  it('keeps single and bulk review school-scoped, pending-only, and review-provenanced', () => {
    expect(reviewActions).toContain(".eq('school_id', actor.school_id)")
    expect(reviewActions).toContain("'review_hour_log_as_authorized_approver'")
    expect(reviewActions).toContain("'bulk_approve_hour_logs_as_authorized_approver'")
    expect(delegatedApproverMigration).toContain("h.status = 'pending'")
    expect(delegatedApproverMigration).toContain('reviewed_by = v_actor_id')
    expect(delegatedApproverMigration).toContain('reviewed_at = clock_timestamp()')
    expect(reviewActions).toContain('alreadyReviewed=')
  })

  it('binds attendance-generated hours to the same school, student, date, and minutes', () => {
    expect(generatedHoursMigration).toContain('ar.school_id = school_id')
    expect(generatedHoursMigration).toContain('ar.user_id = user_id')
    expect(generatedHoursMigration).toContain('ar.date = date')
    expect(generatedHoursMigration).toContain('ar.minutes_present = minutes')
    expect(generationActions).toContain("source_type: 'attendance'")
    expect(generationActions).toContain('source_attendance_id: attendance.id')
  })

  it('permits only one active pending/approved hour row per attendance source', () => {
    expect(resubmissionMigration).toContain('uq_hour_logs_source_attendance_active')
    expect(resubmissionMigration).toContain("status in ('pending', 'approved')")
    expect(generationActions).toContain("if (error.code === '23505')")
  })

  it('preserves rejected history and links corrected resubmissions to the rejected revision', () => {
    expect(resubmissionMigration).toContain('resubmission_of_hour_log_id')
    expect(resubmissionMigration).toContain("rejected.status = 'rejected'")
    expect(resubmissionMigration).toContain('rejected.user_id = hour_logs.user_id')
    expect(resubmissionMigration).toContain('rejected.school_id = hour_logs.school_id')
    expect(generationActions).toContain('resubmission_of_hour_log_id: latestRejected?.id ?? null')
  })

  it('does not double-count rejected or pending revisions in official period totals', () => {
    const logs: HoursReportLog[] = [
      {
        id: 'rejected-original',
        user_id: 'student-1',
        date: '2026-09-25',
        category: 'Other',
        minutes: 420,
        status: 'rejected',
        notes: null,
        submitted_by: 'instructor-1',
        reviewed_by: 'admin-1',
        reviewed_at: '2026-09-25T16:00:00.000Z',
        created_at: '2026-09-25T12:00:00.000Z',
      },
      {
        id: 'pending-correction',
        user_id: 'student-1',
        date: '2026-09-25',
        category: 'Other',
        minutes: 390,
        status: 'pending',
        notes: null,
        submitted_by: 'instructor-1',
        reviewed_by: null,
        reviewed_at: null,
        created_at: '2026-09-25T17:00:00.000Z',
      },
      {
        id: 'approved-other-day',
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
    ]

    const totals = calculateApprovedPeriodTotals(
      logs,
      new Date('2026-09-26T16:00:00.000Z'),
      'America/Chicago',
    )

    expect(totals.weekMinutes).toBe(360)
    expect(totals.monthMinutes).toBe(360)
    expect(totals.yearMinutes).toBe(360)
  })
})
