import { describe, expect, it } from 'vitest'
import { calculateSharedGrade, calculateSharedConceptMastery, SHARED_GRADE_WEIGHTS } from '@/lib/concept-mastery/shared-grading'
import { getFlashcardEvidenceConcept, getFlashcardEvidenceInventory } from '@/lib/concept-mastery/activity-evidence-registry'
import { buildLiveInstructorChapterGrade } from '@/lib/concept-mastery/live-instructor-grade'

describe('QUIZ-GRADING-QA-6 unified evidence regressions', () => {
  it('maps every eligible flashcard to a concept across 21 chapters', () => {
    for (let chapter = 1; chapter <= 21; chapter++) {
      const chapterId = `ch-${chapter}`
      const inventory = getFlashcardEvidenceInventory(chapterId)
      expect(inventory.length, chapterId).toBeGreaterThan(0)
      expect(new Set(inventory).size, chapterId).toBe(inventory.length)
      for (const id of inventory) {
        expect(getFlashcardEvidenceConcept(chapterId, id), `${chapterId}:${id}`).toBeTruthy()
      }
    }
  })

  it('does not award flashcard correctness for merely completing activity', () => {
    const chapterId = 'ch-1'
    const inventory = getFlashcardEvidenceInventory(chapterId)
    const rows = inventory.map((item_id) => ({
      chapter_id: chapterId,
      source: 'flashcard' as const,
      item_id,
      is_correct: false,
    }))
    const instructor = buildLiveInstructorChapterGrade({
      chapterId,
      microCheckPercent: 60,
      chapterAssessmentPercent: 60,
      remediationReassessmentPercent: null,
      activityRows: rows,
    })
    expect(instructor.components.flashcardPercent).toBe(0)
    expect(instructor.grade.finalGrade).toBeLessThan(60)
  })

  it('requires independent evidence before declaring reliable mastery despite a perfect self-rating', () => {
    const evidence = [{
      source: 'flashcard' as const,
      itemId: 'fc-1',
      difficulty: 'recall' as const,
      correct: true,
      attemptPhase: 'initial' as const,
      timestamp: '2026-10-22T12:00:00Z',
    }]
    const result = calculateSharedConceptMastery(evidence, '2026-10-22T12:01:00Z')
    expect(result.mastery).toBe(100)
    expect(result.confidence).toBe('insufficient_evidence')
    expect(result.sourceTypeCount).toBe(1)
  })

  it('maintains assessment-dominant weights and conditional recovery', () => {
    expect(SHARED_GRADE_WEIGHTS.chapter_assessment).toBeGreaterThan(SHARED_GRADE_WEIGHTS.flashcard)
    const base = calculateSharedGrade({ microCheckPercent: 100, flashcardPercent: 100, chapterAssessmentPercent: 0, scenarioApplicationPercent: 100 })
    expect(base.finalGrade).toBeLessThan(100)
    const recovered = calculateSharedGrade({ microCheckPercent: 100, flashcardPercent: 100, chapterAssessmentPercent: 0, scenarioApplicationPercent: 100, remediationReassessmentPercent: 100 })
    expect(recovered.finalGrade).toBeGreaterThanOrEqual(base.finalGrade)
  })
})
