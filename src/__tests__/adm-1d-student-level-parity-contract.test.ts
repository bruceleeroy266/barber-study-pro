import fs from 'fs'
import { describe, expect, it } from 'vitest'

const source = (path: string) => fs.readFileSync(path, 'utf8')

describe('ADM-1D student-level metric parity contract', () => {
  const paritySurfaces = [
    'src/app/(dashboard)/dashboard/page.tsx',
    'src/app/(dashboard)/dashboard/progress/page.tsx',
    'src/app/(dashboard)/dashboard/chapters/page.tsx',
    'src/app/instructor/page.tsx',
    'src/app/instructor/students/page.tsx',
    'src/app/instructor/student/[studentId]/page.tsx',
  ]

  it('routes shared learning metrics through one canonical calculation', () => {
    for (const path of paritySurfaces) {
      expect(source(path)).toContain('calculateCanonicalStudentLearningMetrics')
    }
  })

  it('does not use completed-chapters-only math as overall progress on student surfaces', () => {
    for (const path of [
      'src/app/(dashboard)/dashboard/progress/page.tsx',
      'src/app/(dashboard)/dashboard/chapters/page.tsx',
    ]) {
      const text = source(path)
      expect(text).not.toContain('(completedChapters / totalChapters) * 100')
    }
  })

  it('removes the instructor legacy 50/50 readiness estimate', () => {
    const detail = source('src/app/instructor/student/[studentId]/page.tsx')
    expect(detail).not.toContain('getReadinessEstimate')
    expect(detail).not.toContain('overallProgress * 0.5 + avgQuizScore * 0.5')
    expect(detail).toContain('readiness: boardReadiness')
  })

  it('prevents a dashboard-only streak from changing board readiness', () => {
    const dashboard = source('src/app/(dashboard)/dashboard/page.tsx')
    expect(dashboard).not.toContain('streakDays: studyStreakDays')
    expect(dashboard).toContain('readiness,')
  })

  it('keeps the progress report supplied by the canonical instructor-detail values', () => {
    const detail = source('src/app/instructor/student/[studentId]/page.tsx')
    const report = source('src/app/instructor/student/[studentId]/ProgressReportModal.tsx')

    expect(detail).toContain('overallProgress={overallProgress}')
    expect(detail).toContain('avgQuizScore={avgQuizScore}')
    expect(detail).toContain('readiness={readiness}')
    expect(report).not.toContain('calculateBoardReadiness(')
  })
})
