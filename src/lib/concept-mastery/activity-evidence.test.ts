import { describe, expect, it } from 'vitest'
import {
  calculateActivityEvidencePercent,
  calculateChapterFlashcardStudyPercent,
  calculateChapterScenarioApplicationPercent,
  type ChapterActivityEvidenceRow,
} from './activity-evidence'
import {
  getFlashcardEvidenceConcept,
  getFlashcardEvidenceInventory,
  getScenarioEvidenceConcept,
  getScenarioEvidenceInventory,
} from './activity-evidence-registry'
import { getChapterContent } from '../chapter-content'
import { calculateChapterProgress } from '../progress'

function row(
  source: 'flashcard' | 'scenario_application',
  itemId: string,
  isCorrect: boolean,
): ChapterActivityEvidenceRow {
  return {
    id: `row-${source}-${itemId}`,
    user_id: 'student-1',
    chapter_id: 'ch-1',
    concept_id: 'concept-1',
    source,
    item_id: itemId,
    selected_answer: isCorrect ? 'got_it' : 'needs_practice',
    is_correct: isCorrect,
    answered_at: '2026-09-28T04:30:00.000Z',
    created_at: '2026-09-28T04:30:00.000Z',
  }
}

describe('G7-1 durable activity evidence', () => {
  it('scores against the full eligible inventory rather than only attempted items', () => {
    const result = calculateActivityEvidencePercent(
      [row('flashcard', 'f1', true)],
      'flashcard',
      ['f1', 'f2', 'f3', 'f4'],
    )

    expect(result.percent).toBe(25)
    expect(result.coveragePercent).toBe(25)
    expect(result.correctCount).toBe(1)
    expect(result.evidencedCount).toBe(1)
  })

  it('preserves first evidence per item during percentage calculation', () => {
    const result = calculateActivityEvidencePercent(
      [row('scenario_application', 's1', false), row('scenario_application', 's1', true)],
      'scenario_application',
      ['s1'],
    )

    expect(result.percent).toBe(0)
    expect(result.evidencedCount).toBe(1)
  })

  it('keeps chapter completion mathematically separate from academic evidence', () => {
    const completion = calculateChapterProgress(true, true, {
      lessonCompleted: true,
      knowledgeChecksCompleted: true,
    })
    const academicStudy = calculateActivityEvidencePercent(
      [row('flashcard', 'f1', false)],
      'flashcard',
      ['f1', 'f2'],
    )

    expect(completion).toBe(100)
    expect(academicStudy.percent).toBe(0)
  })

  it('maps every active Chapter 1-11 flashcard used for study evidence to a canonical concept', () => {
    for (let chapter = 1; chapter <= 11; chapter += 1) {
      const chapterId = `ch-${chapter}`
      const ids = getFlashcardEvidenceInventory(chapterId)
      expect(ids.length, chapterId).toBeGreaterThan(0)
      for (const id of ids) {
        expect(getFlashcardEvidenceConcept(chapterId, id), `${chapterId}:${id}`).not.toBeNull()
      }
    }
  })

  it('maps every scored scenario section in Chapters 1-11 to a canonical concept', () => {
    for (let chapter = 1; chapter <= 11; chapter += 1) {
      const chapterId = `ch-${chapter}`
      const content = getChapterContent(chapter)
      expect(content, chapterId).not.toBeNull()
      for (const section of content?.sections ?? []) {
        if (section.type !== 'scenarioBlock' && section.type !== 'proScenario') continue
        section.scenarios.forEach((_, scenarioIndex) => {
          expect(
            getScenarioEvidenceConcept(chapterId, section.id, scenarioIndex),
            `${chapterId}:${section.id}:${scenarioIndex}`,
          ).not.toBeNull()
        })
      }
    }
  })

  it('calculates chapter-specific study and scenario percentages from canonical inventories', () => {
    const flashcards = getFlashcardEvidenceInventory('ch-1')
    expect(flashcards.length).toBeGreaterThan(0)
    const flashResult = calculateChapterFlashcardStudyPercent('ch-1', [
      row('flashcard', flashcards[0], true),
    ])
    expect(flashResult.totalEligibleCount).toBe(flashcards.length)
    expect(flashResult.percent).toBeGreaterThan(0)
    expect(flashResult.percent).toBeLessThan(100)

    const scenarios = getScenarioEvidenceInventory('ch-2')
    if (scenarios.length > 0) {
      const scenarioResult = calculateChapterScenarioApplicationPercent('ch-2', [
        { ...row('scenario_application', scenarios[0], true), chapter_id: 'ch-2' },
      ])
      expect(scenarioResult.totalEligibleCount).toBe(scenarios.length)
      expect(scenarioResult.coveragePercent).toBeGreaterThan(0)
    }
  })
})
