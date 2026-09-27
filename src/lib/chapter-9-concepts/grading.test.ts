import { describe, expect, it } from 'vitest'
import { CHAPTER8_GRADE_WEIGHTS } from '../chapter-8-concepts/grading'
import { SHARED_GRADE_WEIGHTS } from '../concept-mastery/shared-grading'
import {
  CHAPTER9_GRADE_WEIGHTS,
  calculateChapter9ConceptMastery,
  calculateChapter9Grade,
  type Chapter9EvidenceRecord,
} from './grading'

const baseRecord: Omit<
  Chapter9EvidenceRecord,
  'source' | 'itemId' | 'difficulty' | 'correct' | 'attemptPhase' | 'timestamp'
> = {
  studentId: 'student-9',
  chapterId: 'ch-9',
  conceptFamilyId: 'ch9-service-safety-referral',
}

function record(
  source: Chapter9EvidenceRecord['source'],
  itemId: string,
  difficulty: Chapter9EvidenceRecord['difficulty'],
  correct: boolean,
  attemptPhase: Chapter9EvidenceRecord['attemptPhase'] = 'initial',
  timestamp = '2026-09-26T19:00:00.000Z',
): Chapter9EvidenceRecord {
  return { ...baseRecord, source, itemId, difficulty, correct, attemptPhase, timestamp }
}

describe('C9-1 shared Chapter 9 grading/evidence model', () => {
  it('uses the exact Chapters 7/8 20/10/40/15/15 hierarchy', () => {
    expect(CHAPTER9_GRADE_WEIGHTS).toBe(SHARED_GRADE_WEIGHTS)
    expect(CHAPTER9_GRADE_WEIGHTS).toEqual(CHAPTER8_GRADE_WEIGHTS)
    expect(CHAPTER9_GRADE_WEIGHTS).toEqual({
      micro_check: 0.20,
      flashcard: 0.10,
      chapter_assessment: 0.40,
      scenario_application: 0.15,
      remediation_reassessment: 0.15,
    })
  })

  it('keeps remediation recovery non-punitive', () => {
    const weakRecovery = calculateChapter9Grade({
      microCheckPercent: 80,
      flashcardPercent: 90,
      chapterAssessmentPercent: 80,
      scenarioApplicationPercent: 80,
      remediationReassessmentPercent: 40,
    })
    expect(weakRecovery.finalGrade).toBe(weakRecovery.baseGrade)

    const strongRecovery = calculateChapter9Grade({
      microCheckPercent: 60,
      flashcardPercent: 70,
      chapterAssessmentPercent: 65,
      scenarioApplicationPercent: 60,
      remediationReassessmentPercent: 100,
    })
    expect(strongRecovery.finalGrade).toBeGreaterThan(strongRecovery.baseGrade)
  })

  it('weights scenario evidence above recall flashcards through the shared mastery engine', () => {
    const result = calculateChapter9ConceptMastery([
      record('flashcard', 'f1', 'recall', false),
      record('scenario_application', 's1', 'scenario', true),
    ], '2026-09-26T19:00:00.000Z')
    expect(result.mastery).toBeGreaterThan(50)
  })

  it('preserves initial misses when later reassessment recovery is added', () => {
    const result = calculateChapter9ConceptMastery([
      record('chapter_assessment', 'q1', 'application', false),
      record('chapter_assessment', 'q2', 'scenario', false),
      record('remediation_reassessment', 'r1', 'application', true, 'reassessment'),
      record('remediation_reassessment', 'r2', 'scenario', true, 'reassessment'),
      record('scenario_application', 's1', 'scenario', true),
    ], '2026-09-26T19:00:00.000Z')
    expect(result.initialMissCount).toBe(2)
    expect(result.reassessmentCorrectCount).toBe(2)
    expect(result.mastery).toBeGreaterThan(50)
  })

  it('does not create strong confidence from sparse evidence', () => {
    const result = calculateChapter9ConceptMastery([
      record('chapter_assessment', 'q1', 'application', true),
      record('scenario_application', 'q2', 'scenario', true),
    ], '2026-09-26T19:00:00.000Z')
    expect(result.mastery).toBe(100)
    expect(result.confidence).toBe('insufficient_evidence')
  })
})
