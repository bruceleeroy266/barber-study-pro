import { describe, expect, it } from 'vitest'
import { chapter5MicroChecks } from './micro-checks'
import { ACTIVE_CHAPTER5_CONCEPT_FAMILY_IDS } from './concepts'
import { chapter5ContentConceptMappings, chapter5QuizQuestionConceptMappings, chapter5ReassessmentQuestionConceptMappings } from './mappings'
import { chapter5PremiumQuizQuestions } from '../chapter-5-premium-quiz'
import { chapter5ReassessmentQuestions } from '../chapter-5-reassessment-questions'
import { chapter5PremiumFlashcards } from '../chapter-5-premium-flashcards'
import { getChapter5MappingProvider, resetChapter5MappingProvider } from '../reassessment/adapters/chapter-5-adapter'
import { getKnowledgeCheckLength } from '../remediation/knowledge-check'
import { buildChapter5InstructorDiagnostics, type Chapter5InstructorQuizAttempt } from './instructor-diagnostics'
import type { Chapter5MicroCheckAttemptRow } from './micro-check-persistence'

describe('G5-5 Chapter 5 unified grading certification', () => {
  it('preserves the hardened Chapter 5 flashcard/assessment/reassessment assets', () => {
    expect(chapter5PremiumFlashcards).toHaveLength(90)
    expect(chapter5PremiumQuizQuestions).toHaveLength(50)
    expect(chapter5ReassessmentQuestions).toHaveLength(90)
    expect(chapter5QuizQuestionConceptMappings).toHaveLength(50)
    expect(chapter5ReassessmentQuestionConceptMappings).toHaveLength(90)
  })

  it('preserves all six locked concept families and upgrades remediation to five questions', () => {
    expect(ACTIVE_CHAPTER5_CONCEPT_FAMILY_IDS).toHaveLength(6)
    expect(getKnowledgeCheckLength('ch-5')).toBe(5)
  })

  it('adds one two-question immutable micro-check for every Chapter 5 concept family', () => {
    expect(chapter5MicroChecks).toHaveLength(6)
    expect(chapter5MicroChecks.flatMap((check) => check.questions)).toHaveLength(12)
    expect(new Set(chapter5MicroChecks.map((check) => check.conceptFamilyId))).toEqual(
      new Set(ACTIVE_CHAPTER5_CONCEPT_FAMILY_IDS),
    )
    const mappedBlocks = new Set(chapter5ContentConceptMappings.map((mapping) => mapping.contentBlockId))
    for (const check of chapter5MicroChecks) {
      expect(mappedBlocks.has(check.afterSectionId), check.afterSectionId).toBe(true)
      expect(check.questions.every((question) => question.conceptFamilyId === check.conceptFamilyId)).toBe(true)
    }
  })

  it('formal reassessment selection is reserve-only with 15 fresh questions per family', () => {
    resetChapter5MappingProvider()
    const provider = getChapter5MappingProvider()
    const initialIds = new Set(chapter5PremiumQuizQuestions.map((question) => question.id))
    for (const family of ACTIVE_CHAPTER5_CONCEPT_FAMILY_IDS) {
      const pool = provider.getQuestionsForConcept(family)
      expect(pool, family).toHaveLength(15)
      expect(pool.every((id) => !initialIds.has(id)), family).toBe(true)
    }
  })

  it('requires all five persisted reassessment questions before applying formal recovery', () => {
    const family = 'ch5-clippers-trimmers'
    const reserve = chapter5ReassessmentQuestions.filter(
      (question) => chapter5ReassessmentQuestionConceptMappings.find((mapping) => mapping.questionId === question.id)?.conceptFamilyId === family,
    ).slice(0, 5)

    const attempts: Chapter5InstructorQuizAttempt[] = reserve.slice(0, 4).map((question, index) => ({
      quiz_id: 'quiz-5',
      percentage: 100,
      answers_json: { [question.id]: question.correct_answer },
      completed_at: `2026-09-27T18:0${index}:00.000Z`,
      is_reassessment: true,
      target_concept_id: family,
      remediation_cycle_id: 'cycle-ch5',
    }))

    const partial = buildChapter5InstructorDiagnostics({
      studentId: 'student-5',
      completionPercent: 60,
      microCheckRows: [],
      quizAttempts: attempts,
      referenceTime: '2026-09-27T19:00:00.000Z',
    })
    expect(partial.remediationReassessmentPercent).toBeNull()
    expect(partial.latestReassessment).toContain('4/5 in progress')

    const fifth = reserve[4]
    const complete = buildChapter5InstructorDiagnostics({
      studentId: 'student-5',
      completionPercent: 60,
      microCheckRows: [],
      quizAttempts: [...attempts, {
        quiz_id: 'quiz-5',
        percentage: 100,
        answers_json: { [fifth.id]: fifth.correct_answer },
        completed_at: '2026-09-27T18:04:00.000Z',
        is_reassessment: true,
        target_concept_id: family,
        remediation_cycle_id: 'cycle-ch5',
      }],
      referenceTime: '2026-09-27T19:00:00.000Z',
    })
    expect(complete.remediationReassessmentPercent).toBe(100)
    expect(complete.latestReassessment).toContain('100%')
  })

  it('preserves original misses while adding five-question recovery evidence', () => {
    const family = 'ch5-razors'
    const initialQuestions = chapter5PremiumQuizQuestions.filter(
      (question) => chapter5QuizQuestionConceptMappings.find((mapping) => mapping.questionId === question.id)?.conceptFamilyId === family,
    )
    const wrong = (correct: string) => (['a','b','c','d'].find((value) => value !== correct) ?? 'a')
    const initial: Chapter5InstructorQuizAttempt = {
      quiz_id: 'quiz-5',
      percentage: 0,
      answers_json: Object.fromEntries(initialQuestions.map((question) => [question.id, wrong(question.correct_answer)])),
      completed_at: '2026-09-27T17:00:00.000Z',
      is_reassessment: false,
      target_concept_id: null,
      remediation_cycle_id: null,
    }
    const reserve = chapter5ReassessmentQuestions.filter(
      (question) => chapter5ReassessmentQuestionConceptMappings.find((mapping) => mapping.questionId === question.id)?.conceptFamilyId === family,
    ).slice(0, 5)
    const reassessment: Chapter5InstructorQuizAttempt[] = reserve.map((question, index) => ({
      quiz_id: 'quiz-5',
      percentage: 100,
      answers_json: { [question.id]: question.correct_answer },
      completed_at: `2026-09-27T18:0${index}:00.000Z`,
      is_reassessment: true,
      target_concept_id: family,
      remediation_cycle_id: 'cycle-ch5-recovery',
    }))

    const result = buildChapter5InstructorDiagnostics({
      studentId: 'student-5',
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
    const row: Chapter5MicroCheckAttemptRow = {
      id: 'mc-row-5',
      user_id: 'student-5',
      chapter_id: 'ch-5',
      check_id: 'mc-5-03',
      question_id: 'mcq-5-005',
      concept_id: 'ch5-clippers-trimmers',
      difficulty: 'understanding',
      selected_answer: 'a',
      is_correct: true,
      answered_at: '2026-09-27T17:00:00.000Z',
      created_at: '2026-09-27T17:00:00.000Z',
    }
    const initialQuestion = chapter5PremiumQuizQuestions.find(
      (question) => chapter5QuizQuestionConceptMappings.find((mapping) => mapping.questionId === question.id)?.conceptFamilyId === 'ch5-clippers-trimmers',
    )!
    const attempt: Chapter5InstructorQuizAttempt = {
      quiz_id: 'quiz-5',
      percentage: 80,
      answers_json: { [initialQuestion.id]: initialQuestion.correct_answer },
      completed_at: '2026-09-27T18:00:00.000Z',
      is_reassessment: false,
      target_concept_id: null,
      remediation_cycle_id: null,
    }
    const result = buildChapter5InstructorDiagnostics({
      studentId: 'student-5',
      completionPercent: 60,
      microCheckRows: [row],
      quizAttempts: [attempt],
      referenceTime: '2026-09-27T19:00:00.000Z',
    })
    const concept = result.concepts.find((item) => item.conceptFamilyId === 'ch5-clippers-trimmers')!
    expect(concept.observations).toBe(2)
    expect(result.microCheckPercent).toBe(100)
    expect(result.chapterAssessmentPercent).toBe(80)
  })
})
