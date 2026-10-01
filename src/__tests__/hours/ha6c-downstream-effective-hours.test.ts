import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  calculateApprovedPeriodTotals,
  calculateOfficialApprovedMinutes,
  getOfficialMinutes,
  type HoursReportLog,
} from '@/lib/hours/reporting'

const read = (file: string) => fs.readFileSync(path.join(process.cwd(), file), 'utf8')

const studentHours = read('src/app/(dashboard)/dashboard/hours/page.tsx')
const staffHours = read('src/components/hours/StaffHoursManager.tsx')
const instructorStudent = read('src/app/instructor/student/[studentId]/page.tsx')
const instructorCompliance = read('src/app/instructor/compliance/page.tsx')
const studentCompliance = read('src/app/(dashboard)/dashboard/compliance/page.tsx')
const schoolDashboard = read('src/components/school-owner/SchoolDashboard.tsx')
const complianceEngine = read('src/lib/compliance/compliance-engine.ts')
const schoolAnalytics = read('src/lib/school-owner/school-analytics.ts')
const notificationEngine = read('src/lib/messaging/notification-engine.ts')
const pdf = read('src/lib/hours/export-pdf.ts')
const mapper = read('src/lib/mappers/operational-data-mappers.ts')

function reportLog(
  id: string,
  minutes: number,
  status: HoursReportLog['status'],
  effectiveMinutes?: number | null,
  integrityStatus?: HoursReportLog['integrity_status'],
): HoursReportLog {
  return {
    id,
    user_id: 'student-1',
    date: '2026-10-01',
    category: 'Clinic',
    minutes,
    status,
    notes: null,
    submitted_by: 'instructor-1',
    reviewed_by: status === 'approved' ? 'admin-1' : null,
    reviewed_at: status === 'approved' ? '2026-10-01T18:00:00Z' : null,
    created_at: '2026-10-01T12:00:00Z',
    effective_minutes: effectiveMinutes,
    integrity_status: integrityStatus,
  }
}

describe('H&A-6C downstream effective-hours migration', () => {
  it('keeps unadjusted legacy/demo approved records numerically unchanged', () => {
    const logs = [
      reportLog('approved-a', 450, 'approved'),
      reportLog('approved-b', 120, 'approved'),
      reportLog('pending', 300, 'pending'),
      reportLog('rejected', 240, 'rejected'),
    ]

    expect(calculateOfficialApprovedMinutes(logs)).toBe(570)
  })

  it('counts 7h30 original evidence as 7h00 after a certified adjustment', () => {
    const adjusted = reportLog('adjusted', 450, 'approved', 420, 'valid_adjusted')
    expect(getOfficialMinutes(adjusted)).toBe(420)
    expect(calculateOfficialApprovedMinutes([adjusted])).toBe(420)

    const periods = calculateApprovedPeriodTotals(
      [adjusted],
      new Date('2026-10-01T12:00:00-05:00'),
      'America/Chicago',
    )
    expect(periods.weekMinutes).toBe(420)
    expect(periods.monthMinutes).toBe(420)
    expect(periods.yearMinutes).toBe(420)
  })

  it('never lets pending or rejected hours enter official totals even if a value is present', () => {
    const logs = [
      reportLog('pending', 450, 'pending', 450, 'not_approved'),
      reportLog('rejected', 450, 'rejected', 450, 'not_approved'),
    ]
    expect(calculateOfficialApprovedMinutes(logs)).toBe(0)
  })

  it('fails closed instead of falling back to raw evidence when an approved chain is invalid', () => {
    const invalid = reportLog('invalid', 450, 'approved', null, 'invalid')
    expect(() => calculateOfficialApprovedMinutes([invalid])).toThrow(
      'invalid adjustment chain',
    )
  })

  it('moves every primary production hour-reading surface to effective_hour_logs', () => {
    for (const source of [
      studentHours,
      staffHours,
      instructorStudent,
      instructorCompliance,
      studentCompliance,
      schoolDashboard,
    ]) {
      expect(source).toContain("from('effective_hour_logs')")
    }
  })

  it('routes totals, compliance, analytics, notifications, and PDF output through official minutes', () => {
    expect(studentHours).toContain('calculateOfficialApprovedMinutes(reportingHours)')
    expect(staffHours).toContain('calculateOfficialApprovedMinutes(studentLogs)')
    expect(instructorStudent).toContain('getOfficialMinutes(h)')
    expect(complianceEngine).toContain('getOfficialMinutes(h)')
    expect(schoolAnalytics).toContain('getOfficialMinutes(h)')
    expect(notificationEngine).toContain('getOfficialMinutes(h)')
    expect(pdf).toContain('calculateOfficialApprovedMinutes(studentLogs)')
    expect(pdf).toContain('getOfficialMinutes(log)')
  })

  it('maps canonical effective fields instead of discarding them', () => {
    expect(mapper).toContain('effective_minutes?: number | null')
    expect(mapper).toContain('integrity_status?: string | null')
    expect(mapper).toContain('effective_minutes:')
    expect(mapper).toContain('integrity_status:')
  })

  it('keeps pending calculations raw and separate from official effective totals', () => {
    expect(studentHours).toContain(".filter((row) => row.status === 'pending')")
    expect(staffHours).toContain(".filter((log) => log.status === 'pending')")
    expect(notificationEngine).toContain(".filter((h) => h.status === 'pending')")
  })

  it('does not alter TLS or chapter-learning implementation from H&A consumers', () => {
    const combined = [
      studentHours,
      staffHours,
      complianceEngine,
      schoolAnalytics,
      notificationEngine,
      pdf,
    ].join('\n')

    expect(combined).not.toContain("from '@/lib/tls")
    expect(combined).not.toContain('remediation_cycles')
  })
})
