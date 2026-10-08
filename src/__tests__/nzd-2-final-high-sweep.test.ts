import fs from 'fs'
import { describe, expect, it } from 'vitest'

const source = (path: string) => fs.readFileSync(path, 'utf8')

describe('NZD-2 final HIGH-severity zero-data sweep', () => {
  it('keeps instructor roster progress and readiness neutral until evidence exists', () => {
    const page = source('src/app/instructor/students/page.tsx')

    expect(page).toContain("student.hasProgressEvidence ? `${student.overallProgress}%` : '—'")
    expect(page).toContain("student.hasReadinessEvidence ? student.readinessScore : '—'")
    expect(page).toContain("student.hasReadinessEvidence ? student.readinessLevel : 'No Data'")
    expect(page).toContain("s.hasReadinessEvidence && s.readinessLevel === 'Ready'")
  })

  it('keeps risk classification evidence-gated while preserving measured negatives', () => {
    const page = source('src/app/instructor/students/page.tsx')

    expect(page).toContain('s.hasReadinessEvidence && s.readinessScore < 70')
    expect(page).toContain('s.hasProgressEvidence && s.overallProgress < 50')
    expect(page).toContain('s.quizzesTaken > 0 && s.avgQuizScore < 70')
  })
})
