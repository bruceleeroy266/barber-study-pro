import fs from 'fs'
import { describe, expect, it } from 'vitest'
import { generateStudyPlan } from '@/lib/recommendations/study-plan'
import type { BoardReadiness } from '@/types'

const source = (path: string) => fs.readFileSync(path, 'utf8')

const emptyReadiness: BoardReadiness = {
  userId: 'new-student',
  score: 0,
  level: 'At Risk',
  quizAverage: 0,
  quizCompletionRate: 0,
  chapterCompletionRate: 0,
  flashcardEngagementRate: 0,
  consistencyScore: 0,
  improvementTrend: 'stable',
  totalQuestionsAnswered: 0,
  chaptersCompleted: 0,
  totalChapters: 21,
  recommendedStudyMinutes: 60,
  updatedAt: '2026-10-08T00:00:00.000Z',
}

describe('NZD-2 high-severity learning surfaces', () => {
  it('returns neutral start guidance instead of remediation when no learning evidence exists', () => {
    const recommendations = generateStudyPlan({
      userId: 'new-student',
      readiness: emptyReadiness,
      weakAreas: [],
      strongAreas: [],
      missedQuestions: [],
      totalChapters: 21,
      hasEvidence: false,
    })

    expect(recommendations).toHaveLength(1)
    expect(recommendations[0]?.title).toBe('Start your first learning activity')
    expect(recommendations[0]?.priority).toBe('medium')
    expect(recommendations[0]?.description).not.toMatch(/gap|weak|risk|remediation/i)
  })

  it('keeps the student progress page from presenting no-evidence attendance/readiness as zero performance', () => {
    const page = source('src/app/(dashboard)/dashboard/progress/page.tsx')
    expect(page).toContain("value={attendanceRecords.length > 0 ?")
    expect(page).toContain("value={hasProgressEvidence ?")
    expect(page).toContain('hasEvidence={hasReadinessEvidence}')
    expect(page).toContain('hasReadinessEvidence={hasReadinessEvidence}')
  })

  it('keeps instructor student detail readiness neutral until canonical evidence exists', () => {
    const page = source('src/app/instructor/student/[studentId]/page.tsx')
    expect(page).toContain("hasReadinessEvidence ? readiness.score : '—'")
    expect(page).toContain("hasReadinessEvidence ? readiness.label : 'No Data'")
    expect(page).toContain('hasEvidence={hasReadinessEvidence}')
  })
})
