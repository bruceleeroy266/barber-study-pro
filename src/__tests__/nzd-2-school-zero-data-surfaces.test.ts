import fs from 'fs'
import { describe, expect, it } from 'vitest'

const source = (path: string) => fs.readFileSync(path, 'utf8')

describe('NZD-2 school zero-data presentation contract', () => {
  it('renders school overview averages as no-data until domain evidence exists', () => {
    const component = source('src/components/school-owner/SchoolOverviewMetrics.tsx')
    expect(component).toContain("metrics.hasAttendanceEvidence ?")
    expect(component).toContain("metrics.hasReadinessEvidence ?")
    expect(component).toContain("metrics.hasAssessmentEvidence ?")
    expect(component).toContain('Not enough data yet')
  })

  it('does not filter or label no-evidence students as low attendance, missing hours, or on track', () => {
    const component = source('src/components/school-owner/StudentPerformancePanel.tsx')
    expect(component).toContain('r.hasAttendanceEvidence && r.attendancePercentage < 80')
    expect(component).toContain('r.hasHoursEvidence && r.completedHours < r.requiredHours * 0.5')
    expect(component).toContain("row.hasAttendanceEvidence ?")
    expect(component).toContain("row.hasHoursEvidence ?")
    expect(component).toContain('!row.hasAnyEvidence ?')
    expect(component).toContain('No Data')
  })

  it('uses empty trend arrays and a No Data risk bucket for zero-evidence schools', () => {
    const analytics = source('src/lib/school-owner/school-analytics.ts')
    expect(analytics).toContain("label: 'No Data'")
    expect(analytics).toContain('attendanceEvidence.size > 0')
    expect(analytics).toContain('readinessEvidence.size > 0')
    expect(analytics).toContain('assessmentEvidence.size > 0')
    expect(analytics).toContain('hoursEvidence.size > 0')
  })
})
