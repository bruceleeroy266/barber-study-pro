import { describe, expect, it } from 'vitest'
import { chapter3MicroChecks } from './micro-checks'
import { CHAPTER3_CONCEPT_FAMILY_IDS } from './concepts'
import { chapter3ReassessmentQuestions } from '../chapter-3-reassessment-questions'
import { chapter3ReassessmentQuestionConceptMappings, chapter3QuizQuestionConceptMappings } from './mappings'
import { chapter3PremiumQuizQuestions } from '../chapter-3-premium-quiz'
import { getChapter3MappingProvider, resetChapter3MappingProvider } from '../reassessment/adapters/chapter-3-adapter'
import { buildChapter3InstructorDiagnostics, type Chapter3InstructorQuizAttempt } from './instructor-diagnostics'
import type { Chapter3MicroCheckAttemptRow } from './micro-check-persistence'
import { getKnowledgeCheckLength } from '../remediation/knowledge-check'

describe('G5-3 Chapter 3 unified grading certification', () => {
  it('preserves the existing four-family concept architecture', () => {
    expect(CHAPTER3_CONCEPT_FAMILY_IDS).toEqual([
      'ch3-healthful-habits',
      'ch3-professional-image',
      'ch3-ergonomics',
      'ch3-human-relations',
    ])
  })

  it('adds one immutable two-question micro-check per family', () => {
    expect(chapter3MicroChecks).toHaveLength(4)
    expect(chapter3MicroChecks.flatMap((check) => check.questions)).toHaveLength(8)
    expect(new Set(chapter3MicroChecks.map((check) => check.conceptFamilyId))).toEqual(
      new Set(CHAPTER3_CONCEPT_FAMILY_IDS),
    )
    expect(new Set(chapter3MicroChecks.flatMap((check) => check.questions.map((q) => q.id))).size).toBe(8)
  })

  it('keeps the existing five-question remediation length', () => {
    expect(getKnowledgeCheckLength('ch-3')).toBe(5)
  })

  it('keeps 15 fresh reserve questions per family and excludes initial quiz questions from formal selection', () => {
    resetChapter3MappingProvider()
    const provider = getChapter3MappingProvider()
    const initialIds = new Set(chapter3PremiumQuizQuestions.map((question) => question.id))
    for (const family of CHAPTER3_CONCEPT_FAMILY_IDS) {
      const reserve = provider.getQuestionsForConcept(family)
      expect(reserve).toHaveLength(15)
      expect(reserve.every((id) => !initialIds.has(id))).toBe(true)
    }
  })

  it('waits for five persisted reassessment questions before formal recovery', () => {
    const family = 'ch3-ergonomics'
    const reserve = chapter3ReassessmentQuestions.filter(
      (question) => chapter3ReassessmentQuestionConceptMappings.find((mapping) => mapping.questionId === question.id)?.conceptFamilyId === family,
    ).slice(0, 5)
    const attempts: Chapter3InstructorQuizAttempt[] = reserve.slice(0, 4).map((question, index) => ({
      quiz_id: 'quiz-3',
      percentage: 100,
      answers_json: { [question.id]: question.correct_answer },
      completed_at: `2026-09-27T18:0${index}:00.000Z`,
      is_reassessment: true,
      target_concept_id: family,
      remediation_cycle_id: 'cycle-ch3',
    }))
    const partial = buildChapter3InstructorDiagnostics({
      studentId:'student-3',completionPercent:50,microCheckRows:[],quizAttempts:attempts,referenceTime:'2026-09-27T19:00:00.000Z',
    })
    expect(partial.remediationReassessmentPercent).toBeNull()
    expect(partial.latestReassessment).toContain('4/5 in progress')

    const fifth=reserve[4]
    const complete = buildChapter3InstructorDiagnostics({
      studentId:'student-3',completionPercent:50,microCheckRows:[],quizAttempts:[...attempts,{
        quiz_id:'quiz-3',percentage:100,answers_json:{[fifth.id]:fifth.correct_answer},completed_at:'2026-09-27T18:04:00.000Z',is_reassessment:true,target_concept_id:family,remediation_cycle_id:'cycle-ch3',
      }],referenceTime:'2026-09-27T19:00:00.000Z',
    })
    expect(complete.remediationReassessmentPercent).toBe(100)
    expect(complete.latestReassessment).toContain('100%')
  })

  it('preserves original misses while adding reassessment recovery evidence', () => {
    const family='ch3-human-relations'
    const initialQuestions=chapter3PremiumQuizQuestions.filter(
      (question)=>chapter3QuizQuestionConceptMappings.find((mapping)=>mapping.questionId===question.id)?.conceptFamilyId===family,
    )
    const wrong=(correct:string)=>(['a','b','c','d'].find((value)=>value!==correct) ?? 'a')
    const initial:Chapter3InstructorQuizAttempt={
      quiz_id:'quiz-3',percentage:0,answers_json:Object.fromEntries(initialQuestions.map((q)=>[q.id,wrong(q.correct_answer)])),completed_at:'2026-09-27T17:00:00.000Z',is_reassessment:false,target_concept_id:null,remediation_cycle_id:null,
    }
    const reserve=chapter3ReassessmentQuestions.filter(
      (question)=>chapter3ReassessmentQuestionConceptMappings.find((mapping)=>mapping.questionId===question.id)?.conceptFamilyId===family,
    ).slice(0,5)
    const reassessment:Chapter3InstructorQuizAttempt[]=reserve.map((q,index)=>({
      quiz_id:'quiz-3',percentage:100,answers_json:{[q.id]:q.correct_answer},completed_at:`2026-09-27T18:0${index}:00.000Z`,is_reassessment:true,target_concept_id:family,remediation_cycle_id:'cycle-ch3-recovery',
    }))
    const result=buildChapter3InstructorDiagnostics({
      studentId:'student-3',completionPercent:75,microCheckRows:[],quizAttempts:[initial,...reassessment],referenceTime:'2026-09-27T19:00:00.000Z',
    })
    const diagnostic=result.concepts.find((concept)=>concept.conceptFamilyId===family)!
    expect(diagnostic.initialMisses).toBe(initialQuestions.length)
    expect(diagnostic.reassessmentCorrect).toBe(5)
    expect(result.remediationReassessmentPercent).toBe(100)
  })

  it('combines micro-check and assessment evidence in instructor diagnostics', () => {
    const row:Chapter3MicroCheckAttemptRow={
      id:'mc-row',user_id:'student-3',chapter_id:'ch-3',check_id:'mc-3-03',question_id:'mcq-3-005',concept_id:'ch3-ergonomics',difficulty:'application',selected_answer:'a',is_correct:true,answered_at:'2026-09-27T17:00:00.000Z',created_at:'2026-09-27T17:00:00.000Z',
    }
    const initialQuestion=chapter3PremiumQuizQuestions.find((q)=>chapter3QuizQuestionConceptMappings.find((m)=>m.questionId===q.id)?.conceptFamilyId==='ch3-ergonomics')!
    const attempt:Chapter3InstructorQuizAttempt={quiz_id:'quiz-3',percentage:80,answers_json:{[initialQuestion.id]:initialQuestion.correct_answer},completed_at:'2026-09-27T18:00:00.000Z',is_reassessment:false,target_concept_id:null,remediation_cycle_id:null}
    const result=buildChapter3InstructorDiagnostics({studentId:'student-3',completionPercent:60,microCheckRows:[row],quizAttempts:[attempt],referenceTime:'2026-09-27T19:00:00.000Z'})
    const concept=result.concepts.find((item)=>item.conceptFamilyId==='ch3-ergonomics')!
    expect(concept.observations).toBe(2)
    expect(result.microCheckPercent).toBe(100)
    expect(result.chapterAssessmentPercent).toBe(80)
  })
})
