import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import ComplianceReportingCenter from '@/components/compliance/ComplianceReportingCenter'
import ReportingCenter from './ReportingCenter'
import type {
  ComplianceReport,
  ComplianceReportType,
  SchoolReport,
  SchoolReportType,
} from '@/types'

const generatedAt = '2026-09-25T22:00:00.000Z'

function complianceReport(type: ComplianceReportType, title: string): ComplianceReport {
  return {
    type,
    title,
    generatedAt,
    summary: 'Mobile verification summary',
    rows: [{ Metric: 'Example', Value: 1 }],
  }
}

function schoolReport(type: SchoolReportType, title: string): SchoolReport {
  return {
    type,
    title,
    generatedAt,
    summary: 'Mobile verification summary',
    rows: [{ Metric: 'Example', Value: 1 }],
  }
}

const complianceReports: Record<ComplianceReportType, ComplianceReport> = {
  student_compliance: complianceReport('student_compliance', 'Student Compliance Report'),
  graduation_readiness: complianceReport('graduation_readiness', 'Graduation Readiness Report'),
  board_eligibility: complianceReport('board_eligibility', 'Board Eligibility Report'),
  instructor_compliance: complianceReport('instructor_compliance', 'Instructor Compliance Report'),
  school_compliance: complianceReport('school_compliance', 'School Compliance Report'),
}

const schoolReports: Record<SchoolReportType, SchoolReport> = {
  attendance: schoolReport('attendance', 'Attendance Report'),
  readiness: schoolReport('readiness', 'Readiness Report'),
  grade: schoolReport('grade', 'Grade Report'),
  hours: schoolReport('hours', 'Hours Report'),
  assessment: schoolReport('assessment', 'Assessment Report'),
  school_summary: schoolReport('school_summary', 'School Summary Report'),
}

function verifyMobileReportStructure(container: HTMLElement) {
  const exportButton = screen.getByRole('button', { name: /Export CSV/i })
  expect(exportButton).toHaveClass('w-full')
  expect(exportButton).toHaveClass('sm:w-auto')

  const scrollRegion = container.querySelector('.overflow-x-auto')
  expect(scrollRegion).not.toBeNull()

  const table = scrollRegion?.querySelector('table')
  expect(table).toHaveClass('min-w-[36rem]')
  expect(table).toHaveClass('w-full')
}

describe('school reporting mobile layout safeguards', () => {
  it('keeps Audit Preparation Center controls mobile-safe', () => {
    const { container } = render(
      <ComplianceReportingCenter reports={complianceReports} />,
    )

    expect(screen.getByText('Audit Preparation Center')).toBeInTheDocument()
    expect(screen.getAllByRole('button')).toHaveLength(6)

    const tabGrid = screen.getByRole('button', { name: /Student Compliance/i }).parentElement
    expect(tabGrid).toHaveClass('grid-cols-2')
    expect(tabGrid).toHaveClass('sm:grid-cols-3')
    expect(tabGrid).toHaveClass('lg:grid-cols-5')

    verifyMobileReportStructure(container)
  })

  it('keeps Reporting Center controls mobile-safe', () => {
    const { container } = render(
      <ReportingCenter reports={schoolReports} />,
    )

    expect(screen.getByText('Reporting Center')).toBeInTheDocument()
    expect(screen.getAllByRole('button')).toHaveLength(7)

    const tabGrid = screen.getByRole('button', { name: /Attendance Report/i }).parentElement
    expect(tabGrid).toHaveClass('grid-cols-2')
    expect(tabGrid).toHaveClass('sm:grid-cols-3')
    expect(tabGrid).toHaveClass('lg:grid-cols-6')

    verifyMobileReportStructure(container)
  })
})
