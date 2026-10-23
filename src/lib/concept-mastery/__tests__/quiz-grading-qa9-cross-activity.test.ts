import { describe, expect, it } from 'vitest'
import { calculateSharedConceptMastery, calculateSharedGrade } from '@/lib/concept-mastery/shared-grading'
import { getFlashcardEvidenceConcept, getFlashcardEvidenceInventory } from '@/lib/concept-mastery/activity-evidence-registry'
import { buildLiveInstructorChapterGrade } from '@/lib/concept-mastery/live-instructor-grade'

const time = '2026-10-22T10:00:00Z'

describe('QUIZ-GRADING-QA-9 deterministic cross-activity evidence', () => {
  it('identifies a weak objective when flashcard and quiz evidence both fail', () => {
    const flashcard = getFlashcardEvidenceInventory('ch-21')[0]
    expect(flashcard).toBeDefined()
    const concept = getFlashcardEvidenceConcept('ch-21', flashcard)
    expect(concept).toBeTruthy()
    const records = [
      { source: 'flashcard' as const, itemId: flashcard, difficulty: 'recall' as const, correct: false, attemptPhase: 'initial' as const, timestamp: time },
      { source: 'chapter_assessment' as const, itemId: 'objective-quiz-item', difficulty: 'application' as const, correct: false, attemptPhase: 'initial' as const, timestamp: time },
    ]
    const result = calculateSharedConceptMastery(records, time)
    expect(result.mastery).toBe(0)
    expect(result.initialMissCount).toBe(2)
    expect(result.sourceTypeCount).toBe(2)
    expect(result.confidence).toBe('insufficient_evidence')
  })

  it('remediation improves mastery without erasing first-attempt failure', () => {
    const initial = [
      { source: 'flashcard' as const, itemId: 'fc-1', difficulty: 'recall' as const, correct: false, attemptPhase: 'initial' as const, timestamp: time },
      { source: 'chapter_assessment' as const, itemId: 'qa-1', difficulty: 'application' as const, correct: false, attemptPhase: 'initial' as const, timestamp: time },
    ]
    const before = calculateSharedConceptMastery(initial, time)
    const recovery = Array.from({ length: 5 }, (_, index) => ({
      source: 'remediation_reassessment' as const,
      itemId: `re-${index}`,
      difficulty: 'application' as const,
      correct: true,
      attemptPhase: 'reassessment' as const,
      timestamp: time,
    }))
    const after = calculateSharedConceptMastery([...initial, ...recovery], time)
    expect(before.mastery).toBe(0)
    expect(after.mastery).toBeGreaterThan(0)
    expect(after.initialMissCount).toBe(2)
    expect(after.reassessmentCorrectCount).toBe(5)
  })

  it('uses identical component arithmetic for instructor summary and academic grade engine', () => {
    const result = buildLiveInstructorChapterGrade({
      chapterId: 'ch-1',
      microCheckPercent: 75,
      chapterAssessmentPercent: 60,
      remediationReassessmentPercent: null,
      activityRows: [],
    })
    expect(result.grade).toEqual(calculateSharedGrade(result.components))
    expect(result.components.chapterAssessmentPercent).toBe(60)
    expect(result.grade.finalGrade).toBeLessThan(100)
  })
})
