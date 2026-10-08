import fs from 'fs'
import { describe, expect, it } from 'vitest'

const source = (path: string) => fs.readFileSync(path, 'utf8')

describe('NZD-1 zero-data platform contract', () => {
  it('locks the No Evidence -> No Status platform rule', () => {
    const contract = source('docs/engineering/NZD1_ZERO_DATA_PLATFORM_CONTRACT.md')
    expect(contract).toContain('No Evidence → No Status')
    expect(contract).toContain('hasTrackingEvidence')
    expect(contract).toContain('Alerts are evidence-triggered')
  })

  it('gates student compliance UI on tracking evidence', () => {
    const page = source('src/app/(dashboard)/dashboard/compliance/page.tsx')
    expect(page).toContain('compliance.hasTrackingEvidence ?')
    expect(page).toContain('Not enough data yet')
    expect(page).toContain('compliance.hasAttendanceEvidence && compliance.attendanceSummary.isAtRisk')
    expect(page).toContain('compliance.hasReadinessEvidence && compliance.readiness.score < 70')
  })

  it('gates instructor compliance negative counts on domain evidence', () => {
    const page = source('src/app/instructor/compliance/page.tsx')
    expect(page).toContain('c.hasTrackingEvidence && c.complianceScore.score < 70')
    expect(page).toContain('c.hasHoursEvidence && c.completedHours < c.graduationReadiness.requiredHours * 0.5')
    expect(page).toContain('c.hasAssessmentEvidence &&')
    expect(page).toContain("c.hasTrackingEvidence ? c.boardEligibility.label : 'No Data'")
  })

  it('requires canonical learning evidence before instructor roster risk status', () => {
    const page = source('src/app/instructor/students/page.tsx')
    expect(page).toContain('hasProgressEvidence: boolean')
    expect(page).toContain('hasReadinessEvidence: boolean')
    expect(page).toContain('const lowReadiness = s.hasReadinessEvidence && s.readinessScore < 70')
    expect(page).toContain('const lowProgress = s.hasProgressEvidence && s.overallProgress < 50')
  })
})
