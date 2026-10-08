import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { convertRowsToCSV } from '@/lib/export-utils'
import { generateSchoolReport, type SchoolAnalyticsInputs } from '@/lib/school-owner/school-analytics'
import type { Profile } from '@/types'

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

  it('school summary keeps no-evidence metrics distinct from a measured zero', () => {
    const report = generateSchoolReport('school_summary', inputs())
    const values = Object.fromEntries(
      report.rows.map((row) => [String(row.Metric), row.Value])
    )

    expect(values['Average Attendance']).toBe('No Data')
    expect(values['Average Readiness']).toBe('No Data')
    expect(values['Average Grade']).toBe('No Grade')
  })

  it('NZD-3: untouched hours report does not turn absence of evidence into zero hours', () => {
    const data = { ...inputs(), requiredHours: 1000 }
    const report = generateSchoolReport('hours', data)
    expect(report.summary).toBe('Total completed hours: No Data')
    expect(report.rows[0]).toMatchObject({
      Completed: 'No Data',
      'Earned Here': 'No Data',
      'Prior Credit': 'No Data',
      Required: 1000,
      Remaining: 'No Data',
    })
    const summary = generateSchoolReport('school_summary', data)
    const values = Object.fromEntries(summary.rows.map((row) => [String(row.Metric), row.Value]))
    expect(values['Completed Hours']).toBe('No Data')
    expect(values['Assessment Completion']).toBe('No Assessments')
    expect(convertRowsToCSV(report.rows)).toContain('No Data')
  })

  it('NZD-3: genuine prior-credit evidence preserves measured hours and requirements', () => {
    const data = {
      ...inputs(),
      requiredHours: 1000,
      priorCreditMinutesByStudentId: { s1: 60 },
    }
    const report = generateSchoolReport('hours', data)
    expect(report.summary).toBe('Total completed hours: 1')
    expect(report.rows[0]).toMatchObject({
      Completed: 1,
      'Earned Here': 0,
      'Prior Credit': 1,
      Required: 1000,
      Remaining: 999,
    })
    const summary = generateSchoolReport('school_summary', data)
    const values = Object.fromEntries(summary.rows.map((row) => [String(row.Metric), row.Value]))
    expect(values['Completed Hours']).toBe(1)
    expect(values['Assessment Completion']).toBe('No Assessments')
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

  it('student grade report sorts grades and assessments before taking recent rows', () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), 'src/components/reports/StudentGradeReport.tsx'),
      'utf8',
    )

    expect(source).toContain(
      ".sort((a, b) => new Date(b.dateEntered).getTime() - new Date(a.dateEntered).getTime())"
    )
    expect(source).toContain(
      ".sort((a, b) => new Date(b.assessmentDate).getTime() - new Date(a.assessmentDate).getTime())"
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

  it('NZD-3 instructor class progress excludes learners without progress evidence', () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), 'src/app/instructor/page.tsx'),
      'utf8',
    )
    expect(source).toContain('metricStudentStats.filter((s) => s.hasProgressEvidence)')
    expect(source).toContain('studentsWithProgress.reduce((sum, s) => sum + s.overallProgress, 0) / studentsWithProgress.length')
    expect(source).toContain("studentsWithProgress.length > 0 ? \`${classAvgProgress}%\` : '—'")
    expect(source).toContain('No learning data yet. Have students begin their first lesson or practice activity.')
  })

  it('hours PDF renders approval timestamps in the configured school timezone', () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), 'src/lib/hours/export-pdf.ts'),
      'utf8',
    )

    expect(source).toContain("toLocaleString('en-US', { timeZone })")
  })
})
