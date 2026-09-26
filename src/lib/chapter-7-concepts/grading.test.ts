import { describe, expect, it } from 'vitest'
import {
  CHAPTER7_GRADE_WEIGHTS,
  calculateChapter7ConceptMastery,
  calculateChapter7Grade,
  type Chapter7EvidenceRecord,
} from './grading'

const baseRecord: Omit<Chapter7EvidenceRecord, 'source' | 'itemId' | 'difficulty' | 'correct' | 'attemptPhase' | 'timestamp'> = {
  studentId: 'student-1',
  chapterId: 'ch-7',
  conceptFamilyId: 'ch7-water-ph',
}

function record(
  source: Chapter7EvidenceRecord['source'],
  itemId: string,
  difficulty: Chapter7EvidenceRecord['difficulty'],
  correct: boolean,
  attemptPhase: Chapter7EvidenceRecord['attemptPhase'] = 'initial',
  timestamp = '2026-09-20T12:00:00.000Z',
): Chapter7EvidenceRecord {
  return { ...baseRecord, source, itemId, difficulty, correct, attemptPhase, timestamp }
}

describe('Chapter 7 grade model', () => {
  it('keeps the assessment as the heaviest ordinary component and all declared weights sum to 100%', () => {
    const values = Object.values(CHAPTER7_GRADE_WEIGHTS)
    expect(values.reduce((sum, value) => sum + value, 0)).toBeCloseTo(1)
    expect(CHAPTER7_GRADE_WEIGHTS.chapter_assessment).toBeGreaterThan(CHAPTER7_GRADE_WEIGHTS.micro_check)
    expect(CHAPTER7_GRADE_WEIGHTS.chapter_assessment).toBeGreaterThan(CHAPTER7_GRADE_WEIGHTS.flashcard)
    expect(CHAPTER7_GRADE_WEIGHTS.chapter_assessment).toBeGreaterThan(CHAPTER7_GRADE_WEIGHTS.scenario_application)
  })

  it('does not penalize a student who never needs remediation', () => {
    const result = calculateChapter7Grade({
      microCheckPercent: 90,
      flashcardPercent: 100,
      chapterAssessmentPercent: 88,
      scenarioApplicationPercent: 92,
    })
    expect(result.recoveryApplied).toBe(false)
    expect(result.finalGrade).toBe(result.baseGrade)
    expect(result.finalGrade).toBeGreaterThan(88)
  })

  it('allows reassessment to recover grade without ever lowering the base grade', () => {
    const weakRecovery = calculateChapter7Grade({
      microCheckPercent: 80,
      flashcardPercent: 100,
      chapterAssessmentPercent: 80,
      scenarioApplicationPercent: 80,
      remediationReassessmentPercent: 60,
    })
    expect(weakRecovery.finalGrade).toBe(weakRecovery.baseGrade)

    const strongRecovery = calculateChapter7Grade({
      microCheckPercent: 70,
      flashcardPercent: 80,
      chapterAssessmentPercent: 65,
      scenarioApplicationPercent: 60,
      remediationReassessmentPercent: 100,
    })
    expect(strongRecovery.finalGrade).toBeGreaterThan(strongRecovery.baseGrade)
    expect(strongRecovery.recoveryApplied).toBe(true)
  })
})

describe('Chapter 7 deterministic concept mastery', () => {
  const now = '2026-09-25T12:00:00.000Z'

  it('gives harder scenario evidence more influence than a recall flashcard', () => {
    const recallMissScenarioHit = calculateChapter7ConceptMastery([
      record('flashcard', 'f1', 'recall', false),
      record('scenario_application', 's1', 'scenario', true),
    ], now)

    expect(recallMissScenarioHit.mastery).toBeGreaterThan(50)
  })

  it('does not double-count scenario evidence as chapter assessment evidence', () => {
    const records = [
      record('scenario_application', 's1', 'scenario', true),
    ]
    const result = calculateChapter7ConceptMastery(records, now)
    expect(result.observationCount).toBe(1)
    expect(result.sourceTypeCount).toBe(1)
  })

  it('cannot produce stable confidence from only one or two correct answers', () => {
    const result = calculateChapter7ConceptMastery([
      record('chapter_assessment', 'q1', 'application', true),
      record('scenario_application', 'q2', 'scenario', true),
    ], now)
    expect(result.mastery).toBe(100)
    expect(result.confidence).toBe('insufficient_evidence')
  })

  it('requires diversity and repeated evidence before Strong confidence', () => {
    const result = calculateChapter7ConceptMastery([
      record('micro_check', 'm1', 'understanding', true),
      record('micro_check', 'm2', 'application', true),
      record('chapter_assessment', 'q1', 'application', true),
      record('chapter_assessment', 'q2', 'scenario', true),
      record('scenario_application', 's1', 'scenario', true),
      record('scenario_application', 's2', 'application', true),
      record('remediation_reassessment', 'r1', 'application', true, 'reassessment'),
      record('remediation_reassessment', 'r2', 'scenario', true, 'reassessment'),
    ], now)
    expect(result.confidence).toBe('strong')
  })

  it('preserves initial weakness while recognizing later reassessment success', () => {
    const result = calculateChapter7ConceptMastery([
      record('chapter_assessment', 'q1', 'application', false),
      record('chapter_assessment', 'q2', 'application', false),
      record('remediation_reassessment', 'r1', 'application', true, 'reassessment'),
      record('remediation_reassessment', 'r2', 'scenario', true, 'reassessment'),
      record('scenario_application', 's1', 'scenario', true),
    ], now)
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
    expect(calculateChapter7ConceptMastery(records, now))
      .toEqual(calculateChapter7ConceptMastery(records, now))
  })

  it('lets older evidence matter less without deleting it', () => {
    const result = calculateChapter7ConceptMastery([
      record('chapter_assessment', 'old-miss', 'application', false, 'initial', '2026-05-01T12:00:00.000Z'),
      record('chapter_assessment', 'new-hit', 'application', true),
      record('scenario_application', 'new-hit-2', 'scenario', true),
    ], now)
    expect(result.initialMissCount).toBe(1)
    expect(result.mastery).toBeGreaterThan(60)
  })
})
