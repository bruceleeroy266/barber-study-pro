import { describe, expect, it } from 'vitest'
import {
  buildLiveInstructorChapterGrade,
  type LiveInstructorActivityEvidenceRow,
} from './live-instructor-grade'
import {
  getFlashcardEvidenceInventory,
  getScenarioEvidenceInventory,
} from './activity-evidence-registry'
import { SHARED_GRADE_WEIGHTS } from './shared-grading'

function activity(
  chapterId: string,
  source: 'flashcard' | 'scenario_application',
  itemId: string,
  isCorrect: boolean,
): LiveInstructorActivityEvidenceRow {
  return { chapter_id: chapterId, source, item_id: itemId, is_correct: isCorrect }
}

describe('G7-2 live five-component instructor grade wiring', () => {
  it('keeps the canonical 20/10/40/15/15 contract', () => {
    expect(SHARED_GRADE_WEIGHTS).toEqual({
      micro_check: 0.20,
      flashcard: 0.10,
      chapter_assessment: 0.40,
      scenario_application: 0.15,
      remediation_reassessment: 0.15,
    })
  })

  it('has durable flashcard and scenario inventories for every Chapter 1-11 grade', () => {
    for (let chapter = 1; chapter <= 11; chapter += 1) {
      const chapterId = `ch-${chapter}`
      expect(getFlashcardEvidenceInventory(chapterId).length, `${chapterId} flashcards`).toBeGreaterThan(0)
      expect(getScenarioEvidenceInventory(chapterId).length, `${chapterId} scenarios`).toBeGreaterThan(0)
    }
  })

  it('feeds durable activity percentages into the shared instructor grade', () => {
    const chapterId = 'ch-11'
    const flashcards = getFlashcardEvidenceInventory(chapterId)
    const scenarios = getScenarioEvidenceInventory(chapterId)

    const rows: LiveInstructorActivityEvidenceRow[] = [
      ...flashcards.map((id, index) => activity(chapterId, 'flashcard', id, index < flashcards.length / 2)),
      ...scenarios.map((id) => activity(chapterId, 'scenario_application', id, true)),
    ]

    const result = buildLiveInstructorChapterGrade({
      chapterId,
      microCheckPercent: 80,
      chapterAssessmentPercent: 70,
      remediationReassessmentPercent: 100,
      activityRows: rows,
    })

    expect(result.components.flashcardPercent).toBeGreaterThan(0)
    expect(result.components.flashcardPercent).toBeLessThan(100)
    expect(result.components.scenarioApplicationPercent).toBe(100)
    expect(result.grade.componentWeights).toEqual(SHARED_GRADE_WEIGHTS)
    expect(result.evidenceComplete).toBe(true)
  })

  it('does not substitute chapter completion for academic component evidence', () => {
    const result = buildLiveInstructorChapterGrade({
      chapterId: 'ch-1',
      microCheckPercent: null,
      chapterAssessmentPercent: null,
      remediationReassessmentPercent: null,
      activityRows: [],
    })

    expect(result.grade.finalGrade).toBe(0)
    expect(result.evidenceComplete).toBe(false)
  })
})
