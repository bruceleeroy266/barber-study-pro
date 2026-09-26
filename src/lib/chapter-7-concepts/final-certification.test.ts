import { describe, expect, it } from 'vitest'
import {
  CHAPTER7_GRADE_WEIGHTS,
  calculateChapter7ConceptMastery,
  calculateChapter7Grade,
  type Chapter7EvidenceRecord,
} from './grading'
import {
  CHAPTER7_CONCEPT_FAMILY_IDS,
} from './concepts'
import {
  chapter7QuizQuestionConceptMappings,
  chapter7ReassessmentQuestionConceptMappings,
  getChapter7ReassessmentQuestionsForConcept,
} from './mappings'
import { chapter7PremiumQuizQuestions } from '../chapter-7-premium-quiz'
import { chapter7ReassessmentQuestions } from '../chapter-7-reassessment-questions'
import { getKnowledgeCheckLength } from '../remediation/knowledge-check'
import { getCanonicalMappingProvider, hasCanonicalMappingProvider } from '../reassessment/provider-registry'
import { getChapterContentProvider, hasChapterContentProvider } from '../remediation/content-provider-registry'
import { HistoricalExclusionEngine } from '../reassessment/exclusion-engine'
import type {
  ChapterId,
  ConceptId,
  HistoricalQuizAttempt,
  IExclusionDatabaseClient,
  QuizQuestionId,
  ReassessmentQuestionHistoryRecord,
} from '../reassessment/types'
import { buildChapter7InstructorDiagnostics } from './instructor-diagnostics'

class MemoryExclusionDb implements IExclusionDatabaseClient {
  historical: HistoricalQuizAttempt[] = []
  history: ReassessmentQuestionHistoryRecord[] = []

  async getHistoricalQuizAttempts() {
    return this.historical
  }

  async getReassessmentQuestionHistory(_userId: string, conceptId: ConceptId) {
    return this.history.filter((row) => row.conceptId === conceptId)
  }

  async recordQuestionAttempt() {
    return 'reservation'
  }

  async checkAndRecordPoolExhaustion() {
    return 'exhaustion'
  }
}

function evidence(
  itemId: string,
  correct: boolean,
  source: Chapter7EvidenceRecord['source'],
  attemptPhase: Chapter7EvidenceRecord['attemptPhase'],
  timestamp: string,
): Chapter7EvidenceRecord {
  return {
    studentId: 'student-1',
    chapterId: 'ch-7',
    conceptFamilyId: 'ch7-water-ph',
    source,
    itemId,
    difficulty: source === 'micro_check' ? 'understanding' : 'scenario',
    correct,
    attemptPhase,
    timestamp,
  }
}

describe('C7-9 final Chapter 7 grading/integrity certification', () => {
  it('locks the grade weights at 100% with the chapter assessment heaviest', () => {
    const total = Object.values(CHAPTER7_GRADE_WEIGHTS).reduce((sum, weight) => sum + weight, 0)
    expect(total).toBeCloseTo(1, 10)
    expect(CHAPTER7_GRADE_WEIGHTS.chapter_assessment).toBe(0.40)
    expect(CHAPTER7_GRADE_WEIGHTS.chapter_assessment).toBeGreaterThan(CHAPTER7_GRADE_WEIGHTS.micro_check)
    expect(CHAPTER7_GRADE_WEIGHTS.chapter_assessment).toBeGreaterThan(CHAPTER7_GRADE_WEIGHTS.flashcard)
    expect(CHAPTER7_GRADE_WEIGHTS.chapter_assessment).toBeGreaterThan(CHAPTER7_GRADE_WEIGHTS.scenario_application)
  })

  it('prevents flashcards or completion behavior from dominating the chapter grade', () => {
    const grade = calculateChapter7Grade({
      flashcardPercent: 100,
      chapterAssessmentPercent: 0,
    })
    expect(grade.finalGrade).toBeLessThan(25)
    expect(grade.componentWeights.flashcard).toBe(0.10)
    expect(grade.componentWeights.chapter_assessment).toBe(0.40)
  })

  it('maps every initial and reserve assessment question exactly once to a canonical concept', () => {
    expect(chapter7QuizQuestionConceptMappings).toHaveLength(50)
    expect(chapter7ReassessmentQuestionConceptMappings).toHaveLength(150)

    const initialIds = chapter7QuizQuestionConceptMappings.map((mapping) => mapping.questionId)
    const reserveIds = chapter7ReassessmentQuestionConceptMappings.map((mapping) => mapping.questionId)
    expect(new Set(initialIds).size).toBe(50)
    expect(new Set(reserveIds).size).toBe(150)
    expect(initialIds.some((id) => reserveIds.includes(id))).toBe(false)

    const validConcepts = new Set<string>(CHAPTER7_CONCEPT_FAMILY_IDS)
    expect(
      [...chapter7QuizQuestionConceptMappings, ...chapter7ReassessmentQuestionConceptMappings]
        .every((mapping) => validConcepts.has(mapping.conceptFamilyId)),
    ).toBe(true)
  })

  it('provides 15 reserve questions per concept family and a five-question formal check', () => {
    for (const conceptId of CHAPTER7_CONCEPT_FAMILY_IDS) {
      expect(getChapter7ReassessmentQuestionsForConcept(conceptId)).toHaveLength(15)
    }
    expect(chapter7ReassessmentQuestions).toHaveLength(150)
    expect(getKnowledgeCheckLength('ch-7')).toBe(5)
  })

  it('registers Chapter 7 with canonical mapping and remediation content providers', () => {
    expect(hasCanonicalMappingProvider('ch-7')).toBe(true)
    expect(hasChapterContentProvider('ch-7')).toBe(true)

    const mapping = getCanonicalMappingProvider('ch-7')
    const content = getChapterContentProvider('ch-7')
    expect(mapping.getAllConceptIds()).toHaveLength(10)
    expect(content?.getQuizQuestionById('qq-7-051')?.id).toBe('qq-7-051')
  })

  it('selects unseen reserve questions after excluding all initial questions and prior reserve history', async () => {
    const db = new MemoryExclusionDb()
    const conceptId = 'ch7-water-ph'
    const initialConceptIds = chapter7QuizQuestionConceptMappings
      .filter((mapping) => mapping.conceptFamilyId === conceptId)
      .map((mapping) => mapping.questionId)
    const reserveIds = getChapter7ReassessmentQuestionsForConcept(conceptId)

    db.historical = [{
      id: 'attempt-1',
      userId: 'student-1',
      quizId: 'quiz-7',
      answersJson: Object.fromEntries(initialConceptIds.map((id) => [id, 'a'])),
      completedAt: new Date('2026-09-20T12:00:00.000Z'),
      isReassessment: false,
    }]

    db.history = reserveIds.slice(0, 10).map((questionId, index) => ({
      id: `history-${index}`,
      userId: 'student-1',
      conceptId,
      questionId,
      quizAttemptId: `attempt-r-${index}`,
      cycleId: 'cycle-1',
      isCorrect: index % 2 === 0,
      attemptedAt: new Date(`2026-09-${String(21 + Math.min(index, 4)).padStart(2, '0')}T12:00:00.000Z`),
    }))

    const engine = new HistoricalExclusionEngine(db, 'ch-7')
    const selection = await engine.selectReassessmentQuestion('student-1', conceptId, 'cycle-2')

    expect(selection.success).toBe(true)
    expect(selection.selectedQuestionId).toBe(reserveIds[10])
    expect(initialConceptIds).not.toContain(selection.selectedQuestionId)
    expect(reserveIds.slice(0, 10)).not.toContain(selection.selectedQuestionId)
  })

  it('does not allow one or two correct observations to produce falsely high confidence', () => {
    const result = calculateChapter7ConceptMastery([
      evidence('one', true, 'chapter_assessment', 'initial', '2026-09-25T10:00:00.000Z'),
      evidence('two', true, 'scenario_application', 'initial', '2026-09-25T11:00:00.000Z'),
    ], '2026-09-26T12:00:00.000Z')
    expect(result.confidence).toBe('insufficient_evidence')
  })

  it('preserves first-attempt misses after remediation while allowing mastery to improve', () => {
    const initial = [
      evidence('q1', false, 'chapter_assessment', 'initial', '2026-09-20T10:00:00.000Z'),
      evidence('q2', false, 'chapter_assessment', 'initial', '2026-09-20T11:00:00.000Z'),
      evidence('q3', true, 'micro_check', 'initial', '2026-09-20T12:00:00.000Z'),
    ]
    const before = calculateChapter7ConceptMastery(initial, '2026-09-26T12:00:00.000Z')

    const after = calculateChapter7ConceptMastery([
      ...initial,
      evidence('r1', true, 'remediation_reassessment', 'reassessment', '2026-09-25T10:00:00.000Z'),
      evidence('r2', true, 'remediation_reassessment', 'reassessment', '2026-09-25T11:00:00.000Z'),
      evidence('r3', true, 'remediation_reassessment', 'reassessment', '2026-09-25T12:00:00.000Z'),
      evidence('r4', true, 'remediation_reassessment', 'reassessment', '2026-09-25T13:00:00.000Z'),
      evidence('r5', true, 'remediation_reassessment', 'reassessment', '2026-09-25T14:00:00.000Z'),
    ], '2026-09-26T12:00:00.000Z')

    expect(after.initialMissCount).toBe(2)
    expect(after.reassessmentCorrectCount).toBe(5)
    expect(after.mastery).toBeGreaterThan(before.mastery)
  })

  it('updates only the targeted concept and ignores unrelated chapter attempts in instructor diagnostics', () => {
    const result = buildChapter7InstructorDiagnostics({
      studentId: 'student-1',
      completionPercent: 50,
      referenceTime: '2026-09-26T12:00:00.000Z',
      microCheckRows: [],
      quizAttempts: [
        {
          quiz_id: 'quiz-6',
          percentage: 0,
          answers_json: { 'qq-6-001': 'd' },
          completed_at: '2026-09-25T10:00:00.000Z',
          is_reassessment: false,
          target_concept_id: null,
        },
        {
          quiz_id: 'quiz-7',
          percentage: 100,
          answers_json: { 'qq-7-024': 'a' },
          completed_at: '2026-09-25T11:00:00.000Z',
          is_reassessment: false,
          target_concept_id: null,
        },
      ],
      remediationCycles: [],
    })

    const water = result.concepts.find((concept) => concept.conceptName.startsWith('Water, pH'))
    const organic = result.concepts.find((concept) => concept.conceptName.startsWith('Organic'))
    expect(water?.observations).toBe(1)
    expect(organic?.observations).toBe(0)
    expect(result.evidenceCount).toBe(1)
  })

  it('keeps instructor presentation output free of internal database/question/cycle identifiers', () => {
    const result = buildChapter7InstructorDiagnostics({
      studentId: 'student-1',
      completionPercent: 25,
      referenceTime: '2026-09-26T12:00:00.000Z',
      microCheckRows: [{
        id: 'db-row-secret',
        user_id: 'student-1',
        chapter_id: 'ch-7',
        check_id: 'mc-7-06',
        question_id: 'mcq-7-012',
        concept_id: 'ch7-water-ph',
        difficulty: 'understanding',
        selected_answer: 'a',
        is_correct: true,
        answered_at: '2026-09-25T12:00:00.000Z',
        created_at: '2026-09-25T12:00:00.000Z',
      }],
      quizAttempts: [],
      remediationCycles: [{
        concept_id: 'ch7-water-ph',
        status: 'reviewing',
        outcome: null,
        reassessment_completed_at: null,
        created_at: '2026-09-25T12:00:00.000Z',
      }],
    })

    const output = JSON.stringify(result)
    expect(output).not.toContain('db-row-secret')
    expect(output).not.toContain('mc-7-06')
    expect(output).not.toContain('mcq-7-012')
    expect(output).not.toContain('ch7-water-ph')
  })

  it('produces deterministic grade and mastery outputs for identical evidence', () => {
    const gradeInput = {
      microCheckPercent: 80,
      flashcardPercent: 90,
      chapterAssessmentPercent: 76,
      scenarioApplicationPercent: 84,
      remediationReassessmentPercent: 100,
    }
    expect(calculateChapter7Grade(gradeInput)).toEqual(calculateChapter7Grade(gradeInput))

    const records = [
      evidence('q1', false, 'chapter_assessment', 'initial', '2026-09-20T10:00:00.000Z'),
      evidence('q2', true, 'scenario_application', 'initial', '2026-09-21T10:00:00.000Z'),
      evidence('r1', true, 'remediation_reassessment', 'reassessment', '2026-09-25T10:00:00.000Z'),
    ]
    const reference = '2026-09-26T12:00:00.000Z'
    expect(calculateChapter7ConceptMastery(records, reference))
      .toEqual(calculateChapter7ConceptMastery(records, reference))
  })

  it('keeps all 150 reserve questions distinct from the initial 50-question bank', () => {
    const initial = new Set(chapter7PremiumQuizQuestions.map((question) => question.id))
    const reserve = chapter7ReassessmentQuestions.map((question) => question.id)
    expect(reserve.every((id) => !initial.has(id))).toBe(true)
    expect(new Set(reserve).size).toBe(150)
  })
})
