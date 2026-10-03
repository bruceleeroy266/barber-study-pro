import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { convertRowsToCSV } from '@/lib/export-utils'
import { generateSchoolReport, type SchoolAnalyticsInputs } from '@/lib/school-owner/school-analytics'
import type { HourLog, Profile } from '@/types'

function student(id: string): Profile {
  return {
    id,
    email: `${id}@example.com`,
    full_name: `Student ${id}`,
    role: 'student',
    school_id: 'school-1',
    barber_shop_name: null,
    mentor_name: null,
    avatar_url: null,
    approval_status: 'approved',
    is_disabled: false,
    approved_by: null,
    approved_at: null,
    requires_password_change: false,
    created_at: '2026-10-03T00:00:00Z',
    updated_at: '2026-10-03T00:00:00Z',
  }
}

function inputs(): SchoolAnalyticsInputs {
  return {
    students: [student('s1')],
    instructors: [],
    attendanceRecords: [],
    hourLogs: [],
    quizAttempts: [],
    progress: [],
    grades: [],
    gradeCategories: [],
    assessments: [],
    notifications: [],
  }
}

describe('ADM-1G reporting + CSV parity', () => {
  it('serializes report rows with quotes, commas, CRLF and embedded line breaks safely', () => {
    const csv = convertRowsToCSV([
      {
        Student: 'Arcaina, Gabriel',
        Note: 'He said "ready"\nand continued',
      },
    ])

    expect(csv).toBe(
      'Student,Note\r\n"Arcaina, Gabriel","He said ""ready""\nand continued"'
    )
  })

  it('preserves report column order from the first row', () => {
    expect(convertRowsToCSV([{ B: 2, A: 1 }])).toBe('B,A\r\n2,1')
  })

  it('school reports use explicit no-data summaries rather than false zeros', () => {
    const data = inputs()

    expect(generateSchoolReport('attendance', data).summary).toBe('Average attendance: No Data')
    expect(generateSchoolReport('readiness', data).summary).toBe('Average readiness: No Data')
    expect(generateSchoolReport('grade', data).summary).toBe('Average grade: No Grade')
    expect(generateSchoolReport('assessment', data).summary).toBe('Average pass rate: No Assessments')
  })

  it('preserves partial official hours instead of rounding report values to whole hours', () => {
    const data = inputs()
    data.hourLogs = [{
      id: 'hour-1',
      user_id: 's1',
      date: '2026-10-03',
      category: 'Clinic',
      minutes: 450,
      status: 'approved',
      notes: null,
      created_at: '2026-10-03T00:00:00Z',
      updated_at: '2026-10-03T00:00:00Z',
      effective_minutes: 450,
      integrity_status: 'valid_unadjusted',
    } as HourLog]
    data.requiredHoursByStudentId = { s1: 1200 }

    const report = generateSchoolReport('hours', data)
    expect(report.summary).toBe('Total completed hours: 7h 30m')
    expect(report.rows[0]).toMatchObject({
      Completed: '7h 30m',
      Required: '1200h',
      Remaining: '1192h 30m',
    })
  })

  it('school summary keeps no-evidence metrics distinct from a measured zero', () => {
    const report = generateSchoolReport('school_summary', inputs())
    const values = Object.fromEntries(
      report.rows.map((row) => [String(row.Metric), row.Value])
    )

    expect(values['Average Attendance']).toBe('No Data')
    expect(values['Average Readiness']).toBe('No Data')
    expect(values['Average Grade']).toBe('No Grade')
  })

  it('attendance exports the same filtered records visible on screen', () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), 'src/app/instructor/attendance/AttendanceClient.tsx'),
      'utf8',
    )

    expect(source).toContain(
      'useAttendanceExport({ records: filteredRecords, students, schoolName })'
    )
  })

  it('school and compliance reporting centers share the canonical CSV serializer', () => {
    const school = fs.readFileSync(
      path.join(process.cwd(), 'src/components/school-owner/ReportingCenter.tsx'),
      'utf8',
    )
    const compliance = fs.readFileSync(
      path.join(process.cwd(), 'src/components/compliance/ComplianceReportingCenter.tsx'),
      'utf8',
    )

    expect(school).toContain('convertRowsToCSV(report.rows)')
    expect(compliance).toContain('convertRowsToCSV(report.rows)')
  })

  it('hours PDF renders approval timestamps in the configured school timezone', () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), 'src/lib/hours/export-pdf.ts'),
      'utf8',
    )

    expect(source).toContain("toLocaleString('en-US', { timeZone })")
  })
})
