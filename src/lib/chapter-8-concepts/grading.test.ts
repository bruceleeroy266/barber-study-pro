import { describe, expect, it } from 'vitest'
import {
  CHAPTER8_GRADE_WEIGHTS,
  calculateChapter8ConceptMastery,
  calculateChapter8Grade,
  type Chapter8EvidenceRecord,
} from './grading'

const baseRecord: Omit<Chapter8EvidenceRecord, 'source' | 'itemId' | 'difficulty' | 'correct' | 'attemptPhase' | 'timestamp'> = {
  studentId: 'student-1',
  chapterId: 'ch-8',
  conceptFamilyId: 'ch8-equipment-safety',
}

function record(
  source: Chapter8EvidenceRecord['source'],
  itemId: string,
  difficulty: Chapter8EvidenceRecord['difficulty'],
  correct: boolean,
  attemptPhase: Chapter8EvidenceRecord['attemptPhase'] = 'initial',
  timestamp = '2026-09-26T12:00:00.000Z',
): Chapter8EvidenceRecord {
  return { ...baseRecord, source, itemId, difficulty, correct, attemptPhase, timestamp }
}

describe('C8-1 Chapter 8 grading model', () => {
  it('preserves the Chapters 7+ 20/10/40/15/15 hierarchy', () => {
    expect(CHAPTER8_GRADE_WEIGHTS).toEqual({
      micro_check: 0.20,
      flashcard: 0.10,
      chapter_assessment: 0.40,
      scenario_application: 0.15,
      remediation_reassessment: 0.15,
    })
    expect(Object.values(CHAPTER8_GRADE_WEIGHTS).reduce((sum, value) => sum + value, 0)).toBeCloseTo(1)
    expect(CHAPTER8_GRADE_WEIGHTS.chapter_assessment).toBeGreaterThan(CHAPTER8_GRADE_WEIGHTS.micro_check)
  })

  it('keeps remediation recovery non-punitive', () => {
    const weak = calculateChapter8Grade({
      microCheckPercent: 80,
      flashcardPercent: 90,
      chapterAssessmentPercent: 80,
      scenarioApplicationPercent: 80,
      remediationReassessmentPercent: 50,
    })
    expect(weak.finalGrade).toBe(weak.baseGrade)

    const strong = calculateChapter8Grade({
      microCheckPercent: 60,
      flashcardPercent: 70,
      chapterAssessmentPercent: 65,
      scenarioApplicationPercent: 60,
      remediationReassessmentPercent: 100,
    })
    expect(strong.finalGrade).toBeGreaterThan(strong.baseGrade)
  })

  it('weights scenario evidence more strongly than recall flashcards', () => {
    const result = calculateChapter8ConceptMastery([
      record('flashcard', 'f1', 'recall', false),
      record('scenario_application', 's1', 'scenario', true),
    ], '2026-09-26T12:00:00.000Z')
    expect(result.mastery).toBeGreaterThan(50)
  })

  it('does not award stable confidence from only two correct items', () => {
    const result = calculateChapter8ConceptMastery([
      record('chapter_assessment', 'q1', 'application', true),
      record('scenario_application', 'q2', 'scenario', true),
    ], '2026-09-26T12:00:00.000Z')
    expect(result.mastery).toBe(100)
    expect(result.confidence).toBe('insufficient_evidence')
  })

  it('preserves initial misses after reassessment recovery', () => {
    const result = calculateChapter8ConceptMastery([
      record('chapter_assessment', 'q1', 'application', false),
      record('chapter_assessment', 'q2', 'scenario', false),
      record('remediation_reassessment', 'r1', 'application', true, 'reassessment'),
      record('remediation_reassessment', 'r2', 'scenario', true, 'reassessment'),
      record('scenario_application', 's1', 'scenario', true),
    ], '2026-09-26T12:00:00.000Z')
    expect(result.initialMissCount).toBe(2)
    expect(result.reassessmentCorrectCount).toBe(2)
    expect(result.mastery).toBeGreaterThan(50)
  })

  it('is deterministic for identical evidence and reference time', () => {
    const records = [
      record('micro_check', 'm1', 'understanding', true),
      record('chapter_assessment', 'q1', 'application', false),
      record('scenario_application', 's1', 'scenario', true),
    ]
    const now = '2026-09-26T12:00:00.000Z'
    expect(calculateChapter8ConceptMastery(records, now))
      .toEqual(calculateChapter8ConceptMastery(records, now))
  })
})
