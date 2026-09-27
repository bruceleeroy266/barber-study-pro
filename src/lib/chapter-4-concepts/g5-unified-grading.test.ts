import { describe, expect, it } from 'vitest'
import { chapter4MicroChecks } from './micro-checks'
import { ACTIVE_CHAPTER4_CONCEPT_FAMILY_IDS } from './concepts'
import { chapter4ContentConceptMappings, chapter4QuizQuestionConceptMappings, chapter4ReassessmentQuestionConceptMappings } from './mappings'
import { chapter4PremiumQuizQuestions } from '../chapter-4-premium-quiz'
import { chapter4ReassessmentQuestions } from '../chapter-4-reassessment-questions'
import { chapter4PremiumFlashcards } from '../chapter-4-premium-flashcards'
import { getChapter4MappingProvider, resetChapter4MappingProvider } from '../reassessment/adapters/chapter-4-adapter'
import { getKnowledgeCheckLength } from '../remediation/knowledge-check'
import { buildChapter4InstructorDiagnostics, type Chapter4InstructorQuizAttempt } from './instructor-diagnostics'
import type { Chapter4MicroCheckAttemptRow } from './micro-check-persistence'

describe('G5-4 Chapter 4 unified grading certification', () => {
  it('preserves the hardened Chapter 4 lesson/flashcard/assessment/reassessment assets', () => {
    expect(chapter4PremiumFlashcards).toHaveLength(70)
    expect(chapter4PremiumQuizQuestions).toHaveLength(30)
    expect(chapter4ReassessmentQuestions).toHaveLength(90)
    expect(chapter4QuizQuestionConceptMappings).toHaveLength(30)
    expect(chapter4ReassessmentQuestionConceptMappings).toHaveLength(90)
  })

  it('preserves all six locked concept families and the five-question remediation policy', () => {
    expect(ACTIVE_CHAPTER4_CONCEPT_FAMILY_IDS).toHaveLength(6)
    expect(getKnowledgeCheckLength('ch-4')).toBe(5)
  })

  it('adds one two-question immutable micro-check for every Chapter 4 concept family', () => {
    expect(chapter4MicroChecks).toHaveLength(6)
    expect(chapter4MicroChecks.flatMap((check) => check.questions)).toHaveLength(12)
    expect(new Set(chapter4MicroChecks.map((check) => check.conceptFamilyId))).toEqual(
      new Set(ACTIVE_CHAPTER4_CONCEPT_FAMILY_IDS),
    )
    const mappedBlocks = new Set(chapter4ContentConceptMappings.map((mapping) => mapping.contentBlockId))
    for (const check of chapter4MicroChecks) {
      expect(mappedBlocks.has(check.afterSectionId), check.afterSectionId).toBe(true)
      expect(check.questions.every((question) => question.conceptFamilyId === check.conceptFamilyId)).toBe(true)
    }
  })

  it('formal reassessment selection is reserve-only with 15 fresh questions per family', () => {
    resetChapter4MappingProvider()
    const provider = getChapter4MappingProvider()
    const initialIds = new Set(chapter4PremiumQuizQuestions.map((question) => question.id))
    for (const family of ACTIVE_CHAPTER4_CONCEPT_FAMILY_IDS) {
      const pool = provider.getQuestionsForConcept(family)
      expect(pool, family).toHaveLength(15)
      expect(pool.every((id) => !initialIds.has(id)), family).toBe(true)
    }
  })

  it('requires all five persisted reassessment questions before applying formal recovery', () => {
    const family = 'ch4-disinfection-sterilization'
    const reserve = chapter4ReassessmentQuestions.filter(
      (question) => chapter4ReassessmentQuestionConceptMappings.find((mapping) => mapping.questionId === question.id)?.conceptFamilyId === family,
    ).slice(0, 5)

    const attempts: Chapter4InstructorQuizAttempt[] = reserve.slice(0, 4).map((question, index) => ({
      quiz_id: 'quiz-4',
      percentage: 100,
      answers_json: { [question.id]: question.correct_answer },
      completed_at: `2026-09-27T18:0${index}:00.000Z`,
      is_reassessment: true,
      target_concept_id: family,
      remediation_cycle_id: 'cycle-ch4',
    }))

    const partial = buildChapter4InstructorDiagnostics({
      studentId: 'student-4',
      completionPercent: 60,
      microCheckRows: [],
      quizAttempts: attempts,
      referenceTime: '2026-09-27T19:00:00.000Z',
    })
    expect(partial.remediationReassessmentPercent).toBeNull()
    expect(partial.latestReassessment).toContain('4/5 in progress')

    const fifth = reserve[4]
    const complete = buildChapter4InstructorDiagnostics({
      studentId: 'student-4',
      completionPercent: 60,
      microCheckRows: [],
      quizAttempts: [...attempts, {
        quiz_id: 'quiz-4',
        percentage: 100,
        answers_json: { [fifth.id]: fifth.correct_answer },
        completed_at: '2026-09-27T18:04:00.000Z',
        is_reassessment: true,
        target_concept_id: family,
        remediation_cycle_id: 'cycle-ch4',
      }],
      referenceTime: '2026-09-27T19:00:00.000Z',
    })
    expect(complete.remediationReassessmentPercent).toBe(100)
    expect(complete.latestReassessment).toContain('100%')
  })

  it('preserves original misses while adding five-question recovery evidence', () => {
    const family = 'ch4-blood-exposure-ppe'
    const initialQuestions = chapter4PremiumQuizQuestions.filter(
      (question) => chapter4QuizQuestionConceptMappings.find((mapping) => mapping.questionId === question.id)?.conceptFamilyId === family,
    )
    const wrong = (correct: string) => (['a','b','c','d'].find((value) => value !== correct) ?? 'a')
    const initial: Chapter4InstructorQuizAttempt = {
      quiz_id: 'quiz-4',
      percentage: 0,
      answers_json: Object.fromEntries(initialQuestions.map((question) => [question.id, wrong(question.correct_answer)])),
      completed_at: '2026-09-27T17:00:00.000Z',
      is_reassessment: false,
      target_concept_id: null,
      remediation_cycle_id: null,
    }
    const reserve = chapter4ReassessmentQuestions.filter(
      (question) => chapter4ReassessmentQuestionConceptMappings.find((mapping) => mapping.questionId === question.id)?.conceptFamilyId === family,
    ).slice(0, 5)
    const reassessment: Chapter4InstructorQuizAttempt[] = reserve.map((question, index) => ({
      quiz_id: 'quiz-4',
      percentage: 100,
      answers_json: { [question.id]: question.correct_answer },
      completed_at: `2026-09-27T18:0${index}:00.000Z`,
      is_reassessment: true,
      target_concept_id: family,
      remediation_cycle_id: 'cycle-ch4-recovery',
    }))

    const result = buildChapter4InstructorDiagnostics({
      studentId: 'student-4',
      completionPercent: 80,
      microCheckRows: [],
      quizAttempts: [initial, ...reassessment],
      referenceTime: '2026-09-27T19:00:00.000Z',
    })
    const diagnostic = result.concepts.find((concept) => concept.conceptFamilyId === family)!
    expect(diagnostic.initialMisses).toBe(initialQuestions.length)
    expect(diagnostic.reassessmentCorrect).toBe(5)
    expect(result.remediationReassessmentPercent).toBe(100)
  })

  it('combines immutable micro-check and assessment evidence in instructor diagnostics', () => {
    const row: Chapter4MicroCheckAttemptRow = {
      id: 'mc-row-4',
      user_id: 'student-4',
      chapter_id: 'ch-4',
      check_id: 'mc-4-03',
      question_id: 'mcq-4-005',
      concept_id: 'ch4-cross-contamination',
      difficulty: 'application',
      selected_answer: 'a',
      is_correct: true,
      answered_at: '2026-09-27T17:00:00.000Z',
      created_at: '2026-09-27T17:00:00.000Z',
    }
    const initialQuestion = chapter4PremiumQuizQuestions.find(
      (question) => chapter4QuizQuestionConceptMappings.find((mapping) => mapping.questionId === question.id)?.conceptFamilyId === 'ch4-cross-contamination',
    )!
    const attempt: Chapter4InstructorQuizAttempt = {
      quiz_id: 'quiz-4',
      percentage: 80,
      answers_json: { [initialQuestion.id]: initialQuestion.correct_answer },
      completed_at: '2026-09-27T18:00:00.000Z',
      is_reassessment: false,
      target_concept_id: null,
      remediation_cycle_id: null,
    }
    const result = buildChapter4InstructorDiagnostics({
      studentId: 'student-4',
      completionPercent: 60,
      microCheckRows: [row],
      quizAttempts: [attempt],
      referenceTime: '2026-09-27T19:00:00.000Z',
    })
    const concept = result.concepts.find((item) => item.conceptFamilyId === 'ch4-cross-contamination')!
    expect(concept.observations).toBe(2)
    expect(result.microCheckPercent).toBe(100)
    expect(result.chapterAssessmentPercent).toBe(80)
  })
})
