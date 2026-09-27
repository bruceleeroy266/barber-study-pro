import { describe, expect, it } from 'vitest'
import { chapter6MicroChecks } from './micro-checks'
import { ACTIVE_CHAPTER6_CONCEPT_FAMILY_IDS } from './concepts'
import { chapter6ContentConceptMappings, chapter6QuizQuestionConceptMappings, chapter6ReassessmentQuestionConceptMappings } from './mappings'
import { chapter6PremiumQuizQuestions } from '../chapter-6-premium-quiz'
import { chapter6ReassessmentQuestions } from '../chapter-6-reassessment-questions'
import { chapter6PremiumFlashcards } from '../chapter-6-premium-flashcards'
import { getChapter6MappingProvider, resetChapter6MappingProvider } from '../reassessment/adapters/chapter-6-adapter'
import { getKnowledgeCheckLength } from '../remediation/knowledge-check'
import { buildChapter6InstructorDiagnostics, type Chapter6InstructorQuizAttempt } from './instructor-diagnostics'
import type { Chapter6MicroCheckAttemptRow } from './micro-check-persistence'

describe('G5-6 Chapter 6 unified grading certification', () => {
  it('preserves the hardened Chapter 6 content assets', () => {
    expect(chapter6PremiumFlashcards).toHaveLength(125)
    expect(chapter6PremiumQuizQuestions).toHaveLength(50)
    expect(chapter6ReassessmentQuestions).toHaveLength(150)
    expect(chapter6QuizQuestionConceptMappings).toHaveLength(50)
    expect(chapter6ReassessmentQuestionConceptMappings).toHaveLength(150)
  })

  it('preserves all ten locked concept families and the five-question remediation policy', () => {
    expect(ACTIVE_CHAPTER6_CONCEPT_FAMILY_IDS).toHaveLength(10)
    expect(getKnowledgeCheckLength('ch-6')).toBe(5)
  })

  it('adds one two-question immutable micro-check for every Chapter 6 concept family', () => {
    expect(chapter6MicroChecks).toHaveLength(10)
    expect(chapter6MicroChecks.flatMap((check) => check.questions)).toHaveLength(20)
    expect(new Set(chapter6MicroChecks.map((check) => check.conceptFamilyId))).toEqual(
      new Set(ACTIVE_CHAPTER6_CONCEPT_FAMILY_IDS),
    )
    const mappedBlocks = new Set(chapter6ContentConceptMappings.map((mapping) => mapping.contentBlockId))
    for (const check of chapter6MicroChecks) {
      expect(mappedBlocks.has(check.afterSectionId), check.afterSectionId).toBe(true)
      expect(check.questions.every((question) => question.conceptFamilyId === check.conceptFamilyId)).toBe(true)
    }
  })

  it('preserves Chapter 6 safety/scope boundaries in the new micro-check layer', () => {
    const text = chapter6MicroChecks.flatMap((check) => check.questions)
      .map((question) => [question.question, question.answer_a, question.answer_b, question.answer_c, question.answer_d, question.explanation].join(' '))
      .join('\n')
    expect(text).toMatch(/do not diagnose|not diagnos|without diagnosing|scope boundaries/i)
    expect(text).toMatch(/persistent swollen|numbness|dry skin|thyroid|blood supply/i)
  })

  it('formal reassessment selection is reserve-only with 15 fresh questions per family', () => {
    resetChapter6MappingProvider()
    const provider = getChapter6MappingProvider()
    const initialIds = new Set(chapter6PremiumQuizQuestions.map((question) => question.id))
    expect(provider.getAllQuestionIds()).toHaveLength(200)
    for (const family of ACTIVE_CHAPTER6_CONCEPT_FAMILY_IDS) {
      const pool = provider.getQuestionsForConcept(family)
      expect(pool, family).toHaveLength(15)
      expect(pool.every((id) => !initialIds.has(id)), family).toBe(true)
    }
  })

  it('requires all five persisted reassessment questions before applying formal recovery', () => {
    const family = 'ch6-lymphatic'
    const reserve = chapter6ReassessmentQuestions.filter(
      (question) => chapter6ReassessmentQuestionConceptMappings.find((mapping) => mapping.questionId === question.id)?.conceptFamilyId === family,
    ).slice(0, 5)
    const attempts: Chapter6InstructorQuizAttempt[] = reserve.slice(0, 4).map((question, index) => ({
      quiz_id:'quiz-6', percentage:100, answers_json:{[question.id]:question.correct_answer},
      completed_at:`2026-09-27T18:0${index}:00.000Z`, is_reassessment:true,
      target_concept_id:family, remediation_cycle_id:'cycle-ch6',
    }))
    const partial=buildChapter6InstructorDiagnostics({studentId:'student-6',completionPercent:60,microCheckRows:[],quizAttempts:attempts,referenceTime:'2026-09-27T19:00:00.000Z'})
    expect(partial.remediationReassessmentPercent).toBeNull()
    expect(partial.latestReassessment).toContain('4/5 in progress')

    const fifth=reserve[4]
    const complete=buildChapter6InstructorDiagnostics({
      studentId:'student-6',completionPercent:60,microCheckRows:[],
      quizAttempts:[...attempts,{quiz_id:'quiz-6',percentage:100,answers_json:{[fifth.id]:fifth.correct_answer},completed_at:'2026-09-27T18:04:00.000Z',is_reassessment:true,target_concept_id:family,remediation_cycle_id:'cycle-ch6'}],
      referenceTime:'2026-09-27T19:00:00.000Z',
    })
    expect(complete.remediationReassessmentPercent).toBe(100)
    expect(complete.latestReassessment).toContain('100%')
  })

  it('preserves original misses while adding five-question recovery evidence', () => {
    const family='ch6-endocrine'
    const initialQuestions=chapter6PremiumQuizQuestions.filter(
      (question)=>chapter6QuizQuestionConceptMappings.find((mapping)=>mapping.questionId===question.id)?.conceptFamilyId===family,
    )
    const wrong=(correct:string)=>(['a','b','c','d'].find((value)=>value!==correct)??'a')
    const initial:Chapter6InstructorQuizAttempt={quiz_id:'quiz-6',percentage:0,answers_json:Object.fromEntries(initialQuestions.map((q)=>[q.id,wrong(q.correct_answer)])),completed_at:'2026-09-27T17:00:00.000Z',is_reassessment:false,target_concept_id:null,remediation_cycle_id:null}
    const reserve=chapter6ReassessmentQuestions.filter(
      (question)=>chapter6ReassessmentQuestionConceptMappings.find((mapping)=>mapping.questionId===question.id)?.conceptFamilyId===family,
    ).slice(0,5)
    const reassessment:Chapter6InstructorQuizAttempt[]=reserve.map((q,index)=>({quiz_id:'quiz-6',percentage:100,answers_json:{[q.id]:q.correct_answer},completed_at:`2026-09-27T18:0${index}:00.000Z`,is_reassessment:true,target_concept_id:family,remediation_cycle_id:'cycle-ch6-recovery'}))
    const result=buildChapter6InstructorDiagnostics({studentId:'student-6',completionPercent:80,microCheckRows:[],quizAttempts:[initial,...reassessment],referenceTime:'2026-09-27T19:00:00.000Z'})
    const diagnostic=result.concepts.find((concept)=>concept.conceptFamilyId===family)!
    expect(diagnostic.initialMisses).toBe(initialQuestions.length)
    expect(diagnostic.reassessmentCorrect).toBe(5)
    expect(result.remediationReassessmentPercent).toBe(100)
  })

  it('combines immutable micro-check and assessment evidence in instructor diagnostics', () => {
    const row:Chapter6MicroCheckAttemptRow={id:'mc-row-6',user_id:'student-6',chapter_id:'ch-6',check_id:'mc-6-07',question_id:'mcq-6-013',concept_id:'ch6-lymphatic',difficulty:'understanding',selected_answer:'a',is_correct:true,answered_at:'2026-09-27T17:00:00.000Z',created_at:'2026-09-27T17:00:00.000Z'}
    const initialQuestion=chapter6PremiumQuizQuestions.find((q)=>chapter6QuizQuestionConceptMappings.find((m)=>m.questionId===q.id)?.conceptFamilyId==='ch6-lymphatic')!
    const attempt:Chapter6InstructorQuizAttempt={quiz_id:'quiz-6',percentage:80,answers_json:{[initialQuestion.id]:initialQuestion.correct_answer},completed_at:'2026-09-27T18:00:00.000Z',is_reassessment:false,target_concept_id:null,remediation_cycle_id:null}
    const result=buildChapter6InstructorDiagnostics({studentId:'student-6',completionPercent:60,microCheckRows:[row],quizAttempts:[attempt],referenceTime:'2026-09-27T19:00:00.000Z'})
    const concept=result.concepts.find((item)=>item.conceptFamilyId==='ch6-lymphatic')!
    expect(concept.observations).toBe(2)
    expect(result.microCheckPercent).toBe(100)
    expect(result.chapterAssessmentPercent).toBe(80)
  })
})
