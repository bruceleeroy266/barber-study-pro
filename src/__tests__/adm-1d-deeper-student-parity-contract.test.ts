import fs from 'fs'
import { describe, expect, it } from 'vitest'

const source = (path: string) => fs.readFileSync(path, 'utf8')

describe('ADM-1D deeper student-level parity contract', () => {
  it('uses one canonical resolver for last learning activity across instructor surfaces', () => {
    for (const path of [
      'src/app/instructor/page.tsx',
      'src/app/instructor/students/page.tsx',
      'src/app/instructor/student/[studentId]/page.tsx',
    ]) {
      expect(source(path)).toContain('resolveLastLearningActivityAt')
    }
  })

  it('includes trusted activity on instructor detail so report and roster agree', () => {
    const detail = source('src/app/instructor/student/[studentId]/page.tsx')
    expect(detail).toContain("from('trusted_study_activity_days')")
    expect(detail).toContain("select('last_active_at')")
    expect(detail).toContain('trustedActivity: (trustedStudyActivityRows ?? [])')
  })

  it('uses canonical analytics weak areas for the printable progress report', () => {
    const detail = source('src/app/instructor/student/[studentId]/page.tsx')
    const report = source('src/app/instructor/student/[studentId]/ProgressReportModal.tsx')

    expect(detail).toContain('const reportWeakAreas = analytics.weakAreas.slice(0, 5)')
    expect(detail).toContain('weakAreas={reportWeakAreas}')
    expect(report).toContain('weakAreas: AreaPerformance[]')
  })

  it('distinguishes a real zero quiz score from no quiz evidence', () => {
    const detail = source('src/app/instructor/student/[studentId]/page.tsx')
    const report = source('src/app/instructor/student/[studentId]/ProgressReportModal.tsx')
    const instructor = source('src/app/instructor/page.tsx')
    const roster = source('src/app/instructor/students/page.tsx')

    expect(detail).toContain('hasQuizEvidence')
    expect(report).toContain('hasQuizEvidence ?')
    expect(instructor).toContain('student.quizzesTaken > 0')
    expect(roster).toContain('student.quizzesTaken > 0')
  })

  it('does not label a learner with no quiz evidence as high board-exam risk', () => {
    const detail = source('src/app/instructor/student/[studentId]/page.tsx')
    expect(detail).toContain("!hasQuizEvidence")
    expect(detail).toContain("{ label: 'No Data' }")
    expect(detail).toContain('boardRisk={reportBoardRisk}')
  })
})
