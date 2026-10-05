import fs from 'fs'
import path from 'path'
import { describe, expect, it } from 'vitest'

const root = process.cwd()
const read = (relativePath: string) => fs.readFileSync(path.join(root, relativePath), 'utf8')

describe('G6-A H1 heavy audit hardening', () => {
  it('keeps school compliance aggregates on the metric-eligible cohort only', () => {
    const dashboard = read('src/components/school-owner/SchoolDashboard.tsx')
    expect(dashboard).toContain("students.filter((student) => student.include_in_school_metrics !== false)")
    expect(dashboard).toContain('const metricStudentCompliances = studentCompliances.filter')
    expect(dashboard).toContain("generateComplianceReport('school_compliance', metricComplianceInputs")
    expect(dashboard).toContain("generateComplianceReport('student_compliance', metricComplianceInputs")
  })

  it('keeps gradebook class averages out of excluded learner grades while preserving the full roster', () => {
    const table = read('src/components/gradebook/GradebookTable.tsx')
    expect(table).toContain('student.include_in_school_metrics !== false')
    expect(table).toContain('metricStudentIds.has(g.studentId)')
    expect(table).toContain('filteredStudents.map((student)')
  })

  it('keeps attendance summary metrics on the eligible cohort while preserving individual records', () => {
    const attendance = read('src/app/instructor/attendance/AttendanceClient.tsx')
    expect(attendance).toContain('const metricFilteredRecords = useMemo')
    expect(attendance).toContain('metricStudentIds.has(record.userId)')
    expect(attendance).toContain('<AttendanceSummary records={metricFilteredRecords} />')
    expect(attendance).toContain('Individual records remain visible below.')
  })

  it('keeps instructor assessment snapshot aggregates on the eligible cohort', () => {
    const instructor = read('src/app/instructor/page.tsx')
    expect(instructor).toContain('const metricAssessmentRecords = assessmentRecords.filter')
    expect(instructor).toContain('metricStudentIdSet.has(assessment.studentId)')
    expect(instructor).toContain('{metricAssessmentRecords.length}')
    expect(instructor).toContain('const failedAssessments = metricAssessmentRecords.filter')
  })

  it('prevents learners from changing their own school-metrics membership', () => {
    const migration = read('supabase/migrations/20261005173500_g6a_h1_metrics_inclusion_security_hardening.sql')
    expect(migration).toContain('new.include_in_school_metrics := old.include_in_school_metrics')
    expect(migration).toContain('new.include_in_school_metrics := true')
    expect(migration).toContain('before insert on public.profiles')
    expect(migration).toContain("current_user not in ('service_role', 'postgres', 'supabase_admin')")
  })
})
