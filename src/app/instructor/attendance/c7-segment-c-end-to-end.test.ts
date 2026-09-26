import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { calculateApprovedPeriodTotals } from '@/lib/hours/reporting'
import type { HoursReportLog } from '@/lib/hours/reporting'

const root = process.cwd()
const attendanceClient = readFileSync(
  join(root, 'src/app/instructor/attendance/AttendanceClient.tsx'),
  'utf-8',
)
const generationAction = readFileSync(
  join(root, 'src/app/instructor/attendance/hour-generation-actions.ts'),
  'utf-8',
)
const approvalAction = readFileSync(
  join(root, 'src/app/instructor/hours/actions.ts'),
  'utf-8',
)
const staffHoursManager = readFileSync(
  join(root, 'src/components/hours/StaffHoursManager.tsx'),
  'utf-8',
)
const generationMigration = readFileSync(
  join(root, 'supabase/migrations/20260926070000_attendance_generated_hour_logs.sql'),
  'utf-8',
)
const qualificationHotfix = readFileSync(
  join(root, 'supabase/migrations/20260926071000_fix_attendance_hour_policy_qualification.sql'),
  'utf-8',
)

describe('C7 final Segment C end-to-end certification', () => {
  it('connects Submit Day to attendance persistence and pending hour generation', () => {
    expect(attendanceClient).toContain('submitDailyAttendance(entries)')
    expect(attendanceClient).toContain('generatePendingHoursFromAttendance(defaultDate)')
    expect(attendanceClient.indexOf('submitDailyAttendance(entries)')).toBeLessThan(
      attendanceClient.indexOf('generatePendingHoursFromAttendance(defaultDate)'),
    )
  })

  it('creates pending hour rows from attended Present/Tardy records only', () => {
    expect(generationAction).toContain(".in('status', ['Present', 'Tardy'])")
    expect(generationAction).toContain(".gt('minutes_present', 0)")
    expect(generationAction).toContain("status: 'pending'")
    expect(generationAction).toContain("source_type: 'attendance'")
    expect(generationAction).toContain('source_attendance_id: attendance.id')
  })

  it('prevents duplicate generated hours at both application and database layers', () => {
    expect(generationAction).toContain('existingByAttendanceId')
    expect(generationAction).toContain("error.code === '23505'")
    expect(generationMigration).toContain(
      'create unique index if not exists uq_hour_logs_source_attendance',
    )
    expect(generationMigration).toContain('where source_attendance_id is not null')
  })

  it('refreshes only still-pending generated entries and preserves reviewed rows', () => {
    expect(generationAction).toContain("if (existing.status !== 'pending')")
    expect(generationAction).toContain(".eq('status', 'pending')")
    expect(generationAction).toContain(".is('reviewed_by', null)")
    expect(generationAction).toContain(".is('reviewed_at', null)")
    expect(generationAction).toContain('if (!refreshed)')
  })

  it('routes pending generated hours through the existing idempotent admin approval gate', () => {
    expect(approvalAction).toContain("if (target.status !== 'pending')")
    expect(approvalAction).toContain(".eq('status', 'pending')")
    expect(approvalAction).toContain('reviewed_by: user.id')
    expect(approvalAction).toContain('reviewed_at: new Date().toISOString()')
    expect(approvalAction).toContain('alreadyReviewed=')
  })

  it('binds generated rows to matching same-school attendance evidence', () => {
    expect(qualificationHotfix).toContain('ar.id = hour_logs.source_attendance_id')
    expect(qualificationHotfix).toContain('ar.school_id = hour_logs.school_id')
    expect(qualificationHotfix).toContain('ar.user_id = hour_logs.user_id')
    expect(qualificationHotfix).toContain('ar.date = hour_logs.date')
    expect(qualificationHotfix).toContain('ar.minutes_present = hour_logs.minutes')
    expect(qualificationHotfix).toContain("ar.status in ('Present', 'Tardy')")
  })

  it('keeps pending hours out of official accumulated totals until approved', () => {
    const logs: HoursReportLog[] = [
      {
        id: 'pending-generated',
        user_id: 'student-1',
        date: '2026-09-25',
        category: 'Other',
        minutes: 420,
        status: 'pending',
        notes: 'Generated from submitted Daily Attendance & Hours.',
        submitted_by: 'instructor-1',
        reviewed_by: null,
        reviewed_at: null,
        created_at: '2026-09-25T12:00:00.000Z',
      },
      {
        id: 'approved-existing',
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

    const beforeApproval = calculateApprovedPeriodTotals(
      logs,
      new Date('2026-09-26T12:00:00.000Z'),
      'America/Chicago',
    )

    expect(beforeApproval.weekMinutes).toBe(360)

    const afterApproval = calculateApprovedPeriodTotals(
      logs.map((log) =>
        log.id === 'pending-generated'
          ? {
              ...log,
              status: 'approved' as const,
              reviewed_by: 'admin-1',
              reviewed_at: '2026-09-25T18:00:00.000Z',
            }
          : log,
      ),
      new Date('2026-09-26T12:00:00.000Z'),
      'America/Chicago',
    )

    expect(afterApproval.weekMinutes).toBe(780)
  })

  it('calculates official accumulated totals from approved rows only in the staff view', () => {
    expect(staffHoursManager).toContain(".filter((log) => log.status === 'approved')")
    expect(staffHoursManager).toContain(".filter((log) => log.status === 'pending')")
    expect(staffHoursManager).toContain('approvedMinutes')
    expect(staffHoursManager).toContain('pendingMinutes')
    expect(staffHoursManager).toContain('Accumulated')
    expect(staffHoursManager).toContain('Pending')
  })

  it('preserves source visibility through the admin and student-hour views', () => {
    expect(staffHoursManager).toContain('Attendance-generated')
    expect(staffHoursManager).toContain('Manual entry')
    expect(staffHoursManager).toContain('<HourSourceBadge sourceType={log.source_type} />')
  })
})
