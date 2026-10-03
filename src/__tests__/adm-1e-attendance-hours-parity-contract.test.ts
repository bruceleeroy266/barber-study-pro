import fs from 'fs'
import { describe, expect, it } from 'vitest'

const source = (path: string) => fs.readFileSync(path, 'utf8')

describe('ADM-1E attendance/hours parity contract', () => {
  it('routes student, instructor-detail, and staff hours totals through one calculator', () => {
    for (const path of [
      'src/app/(dashboard)/dashboard/hours/page.tsx',
      'src/app/instructor/student/[studentId]/page.tsx',
      'src/components/hours/StaffHoursManager.tsx',
    ]) {
      expect(source(path)).toContain('calculateHoursProgressSummary')
    }
  })

  it('keeps attendance-rate surfaces on the canonical attendance summary', () => {
    for (const path of [
      'src/app/(dashboard)/dashboard/page.tsx',
      'src/app/(dashboard)/dashboard/progress/page.tsx',
      'src/app/(dashboard)/dashboard/hours/page.tsx',
      'src/app/instructor/student/[studentId]/page.tsx',
      'src/lib/school-owner/school-analytics.ts',
    ]) {
      expect(source(path)).toContain('calculateAttendanceSummary')
    }
  })

  it('does not inject demo attendance into a production progress page', () => {
    const progress = source('src/app/(dashboard)/dashboard/progress/page.tsx')
    expect(progress).toContain('attendanceRecords.length === 0 && isDemoFallbackEnabled()')
  })

  it('does not describe lifetime attendance math as an 11-day window', () => {
    const detail = source('src/app/instructor/student/[studentId]/page.tsx')
    expect(detail).not.toContain('Last 11 school days')
    expect(detail).toContain('All recorded school days')
  })

  it('prevents instructor-detail completion from exceeding the shared 100-percent cap', () => {
    const detail = source('src/app/instructor/student/[studentId]/page.tsx')
    expect(detail).toContain('calculateHoursProgressSummary')
    expect(detail).not.toContain('Math.round((approvedMinutes / REQUIRED_MINUTES) * 100)')
  })
})
