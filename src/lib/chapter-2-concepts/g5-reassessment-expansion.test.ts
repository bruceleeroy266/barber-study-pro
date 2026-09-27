import { describe, expect, it } from 'vitest'
import { chapterContentData } from '../chapter-content'
import { chapter2G5ReassessmentQuestions, chapter2G5ReassessmentMappings, chapter2G5ReassessmentSourceAudit } from '../chapter-2-reassessment-g5'
import { chapter2ReassessmentQuestions } from '../chapter-2-reassessment-questions'
import { chapter2PremiumQuizQuestions } from '../chapter-2-premium-quiz'
import { chapter2QuizQuestionMappings } from './mappings'
import { ACTIVE_CONCEPT_IDS } from './concepts'
import { getChapter2MappingProvider, resetChapter2MappingProvider } from '../reassessment/adapters/chapter-2-adapter'
import { getKnowledgeCheckLength, getKnowledgeCheckProgress, type IKnowledgeCheckDbClient, type ReassessmentAttemptRow, type ReassessmentReservationRow } from '../remediation/knowledge-check'
import { buildChapter2InstructorDiagnostics, type Chapter2InstructorQuizAttempt } from './instructor-diagnostics'

describe('G5-2 Chapter 2 five-question reassessment expansion', () => {
  it('adds exactly 100 new questions with stable IDs qq-2-076 through qq-2-175', () => {
    expect(chapter2G5ReassessmentQuestions).toHaveLength(100)
    expect(chapter2G5ReassessmentQuestions[0]?.id).toBe('qq-2-076')
    expect(chapter2G5ReassessmentQuestions.at(-1)?.id).toBe('qq-2-175')
    expect(new Set(chapter2G5ReassessmentQuestions.map((question) => question.id)).size).toBe(100)
  })

  it('source-audits every new question to canonical Chapter 2 lesson blocks and the same concept mapping', () => {
    const validSectionIds = new Set(chapterContentData['ch-2'].sections.map((section) => section.id))
    expect(chapter2G5ReassessmentSourceAudit).toHaveLength(100)
    expect(chapter2G5ReassessmentMappings).toHaveLength(100)

    for (const audit of chapter2G5ReassessmentSourceAudit) {
      const mapping = chapter2G5ReassessmentMappings.find((item) => item.questionId === audit.questionId)
      expect(mapping?.conceptId).toBe(audit.conceptId)
      expect(audit.sourceBlockIds.length).toBeGreaterThan(0)
      expect(audit.sourceBasis.length).toBeGreaterThan(40)
      for (const blockId of audit.sourceBlockIds) {
        expect(validSectionIds.has(blockId), `${audit.questionId}: unknown source block ${blockId}`).toBe(true)
      }
    }
  })

  it('contains exactly five reserve questions for every active concept and none for retired C-2-22', () => {
    expect(chapter2ReassessmentQuestions).toHaveLength(125)
    for (const conceptId of ACTIVE_CONCEPT_IDS) {
      const reserveIds = chapter2ReassessmentQuestions
        .filter((question) => chapter2QuizQuestionMappings.find((mapping) => mapping.questionId === question.id)?.conceptId === conceptId)
        .map((question) => question.id)
      expect(reserveIds, conceptId).toHaveLength(5)
    }
    expect(chapter2QuizQuestionMappings.filter((mapping) => mapping.conceptId === 'C-2-22')).toHaveLength(0)
  })

  it('keeps the initial 48-question assessment unchanged and outside the formal reassessment pool', () => {
    resetChapter2MappingProvider()
    const provider = getChapter2MappingProvider()
    const initialIds = new Set(chapter2PremiumQuizQuestions.map((question) => question.id))
    expect(chapter2PremiumQuizQuestions).toHaveLength(48)

    for (const conceptId of ACTIVE_CONCEPT_IDS) {
      const reserve = provider.getQuestionsForConcept(conceptId)
      expect(reserve).toHaveLength(5)
      expect(reserve.every((id) => !initialIds.has(id))).toBe(true)
    }
  })

  it('enables the shared five-question completion gate for Chapter 2', async () => {
    class Db implements IKnowledgeCheckDbClient {
      attempts: ReassessmentAttemptRow[] = []
      reservations: ReassessmentReservationRow[] = []
      async getReassessmentAttemptsForCycle() { return this.attempts }
      async getReassessmentReservationsForCycle() { return this.reservations }
      async quizAttemptExists(attemptId: string) { return this.attempts.some((attempt) => attempt.id === attemptId) }
    }
    const db = new Db()
    expect(getKnowledgeCheckLength('ch-2')).toBe(5)

    for (let i = 1; i <= 5; i++) {
      db.attempts.push({ id: `attempt-${i}`, completed_at: `2026-09-27T16:0${i}:00.000Z` })
      db.reservations.push({
        id: `reservation-${i}`,
        question_id: `qq-2-${String(75 + i).padStart(3, '0')}`,
        quiz_attempt_id: `attempt-${i}`,
        is_correct: true,
        created_at: `2026-09-27T16:0${i}:00.000Z`,
      })
      const progress = await getKnowledgeCheckProgress(db, 'cycle-c2', 'student-2', 5)
      expect(progress.isComplete).toBe(i === 5)
    }
  })

  it('aggregates five persisted one-question attempts into one formal recovery result without erasing initial misses', () => {
    const conceptId = 'C-2-01'
    const initialQuestions = chapter2PremiumQuizQuestions.filter(
      (question) => chapter2QuizQuestionMappings.find((mapping) => mapping.questionId === question.id)?.conceptId === conceptId,
    )
    const wrong = (correct: string) => (['a','b','c','d'].find((value) => value !== correct) ?? 'a')
    const initial: Chapter2InstructorQuizAttempt = {
      quiz_id: 'quiz-2',
      percentage: 0,
      answers_json: Object.fromEntries(initialQuestions.map((question) => [question.id, wrong(question.correct_answer)])),
      completed_at: '2026-09-27T15:00:00.000Z',
      is_reassessment: false,
      target_concept_id: null,
      remediation_cycle_id: null,
    }

    const reserve = chapter2ReassessmentQuestions.filter(
      (question) => chapter2QuizQuestionMappings.find((mapping) => mapping.questionId === question.id)?.conceptId === conceptId,
    )
    const reassessment: Chapter2InstructorQuizAttempt[] = reserve.map((question, index) => ({
      quiz_id: 'quiz-2',
      percentage: 100,
      answers_json: { [question.id]: question.correct_answer },
      completed_at: `2026-09-27T16:0${index}:00.000Z`,
      is_reassessment: true,
      target_concept_id: conceptId,
      remediation_cycle_id: 'cycle-c2-recovery',
    }))

    const result = buildChapter2InstructorDiagnostics({
      studentId: 'student-2',
      completionPercent: 75,
      microCheckRows: [],
      quizAttempts: [initial, ...reassessment],
      referenceTime: '2026-09-27T17:00:00.000Z',
    })

    const diagnostic = result.concepts.find((concept) => concept.conceptId === conceptId)!
    expect(diagnostic.initialMisses).toBe(initialQuestions.length)
    expect(diagnostic.reassessmentCorrect).toBe(5)
    expect(result.remediationReassessmentPercent).toBe(100)
    expect(result.latestReassessment).toContain('100%')
    expect(result.chapterGrade.finalGrade).toBeGreaterThanOrEqual(result.chapterGrade.baseGrade)
  })

  it('keeps the 100 new items free of publisher-name and direct-board-certainty claims', () => {
    const combinedText = chapter2G5ReassessmentQuestions
      .map((question) => [question.question, question.answer_a, question.answer_b, question.answer_c, question.answer_d, question.explanation].join(' '))
      .join('\n')
    expect(combinedText).not.toMatch(/Milady|Pivot Point/i)
    expect(combinedText).not.toMatch(/will be on the board|guaranteed board|official board exam/i)
  })
})
