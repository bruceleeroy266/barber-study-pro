import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter19PremiumFlashcards } from '../chapter-19-premium-flashcards'
import { chapter19PremiumQuizQuestions } from '../chapter-19-premium-quiz'
import {
  ACTIVE_CHAPTER19_CONCEPT_FAMILY_IDS,
  CHAPTER19_COMPLIANCE_LEGAL_CRITICAL_CONCEPT_FAMILY_IDS,
  CHAPTER19_SAFETY_CRITICAL_CONCEPT_FAMILY_IDS,
} from './concepts'
import {
  chapter19FlashcardConceptMappings,
  chapter19QuizQuestionConceptMappings,
} from './mappings'
import { SHARED_GRADE_WEIGHTS } from '../concept-mastery/shared-grading'

const source = readFileSync(
  join(process.cwd(), 'src/lib/chapter-19-premium-quiz.ts'),
  'utf8',
)

const remediationSource = readFileSync(
  join(process.cwd(), 'src/lib/chapter-19-premium-remediation.ts'),
  'utf8',
)

const expectedQuestionIds = Array.from(
  { length: 15 },
  (_, index) => `qq-19-${String(index + 1).padStart(2, '0')}`,
)

const expectedStandardIds = Array.from(
  { length: 15 },
  (_, index) => `CH19-Q${String(index + 1).padStart(2, '0')}`,
)

const expectedCorrectAnswers = {
  'qq-19-01': 'b',
  'qq-19-02': 'c',
  'qq-19-03': 'd',
  'qq-19-04': 'c',
  'qq-19-05': 'b',
  'qq-19-06': 'b',
  'qq-19-07': 'a',
  'qq-19-08': 'b',
  'qq-19-09': 'b',
  'qq-19-10': 'c',
  'qq-19-11': 'b',
  'qq-19-12': 'b',
  'qq-19-13': 'b',
  'qq-19-14': 'c',
  'qq-19-15': 'b',
} as const

const expectedLearningObjectiveByQuestion = {
  'qq-19-01': 'LO-19-01',
  'qq-19-02': 'LO-19-02',
  'qq-19-03': 'LO-19-03',
  'qq-19-04': 'LO-19-04',
  'qq-19-05': 'LO-19-04',
  'qq-19-06': 'LO-19-04',
  'qq-19-07': 'LO-19-05',
  'qq-19-08': 'LO-19-05',
  'qq-19-09': 'LO-19-05',
  'qq-19-10': 'LO-19-06',
  'qq-19-11': 'LO-19-06',
  'qq-19-12': 'LO-19-06',
  'qq-19-13': 'LO-19-06',
  'qq-19-14': 'LO-19-07',
  'qq-19-15': 'LO-19-07',
} as const

const expectedConceptByQuestion = {
  'qq-19-01': 'ch19-licensing-requirements-verification',
  'qq-19-02': 'ch19-exam-preparation-test-reasoning',
  'qq-19-03': 'ch19-practical-exam-safety-readiness',
  'qq-19-04': 'ch19-employment-readiness-professionalism',
  'qq-19-05': 'ch19-employment-readiness-professionalism',
  'qq-19-06': 'ch19-employment-readiness-professionalism',
  'qq-19-07': 'ch19-resume-portfolio-application-materials',
  'qq-19-08': 'ch19-resume-portfolio-application-materials',
  'qq-19-09': 'ch19-resume-portfolio-application-materials',
  'qq-19-10': 'ch19-job-search-shop-research-interview',
  'qq-19-11': 'ch19-job-search-shop-research-interview',
  'qq-19-12': 'ch19-job-search-shop-research-interview',
  'qq-19-13': 'ch19-job-search-shop-research-interview',
  'qq-19-14': 'ch19-employment-law-contracts-compliance',
  'qq-19-15': 'ch19-employment-law-contracts-compliance',
} as const

describe('C19-4 assessment hardening and mapping certification', () => {
  it('preserves the hardened 60-card bank, seven concepts, and shared grading', () => {
    expect(chapter19PremiumFlashcards).toHaveLength(60)
    expect(chapter19FlashcardConceptMappings).toHaveLength(60)
    expect(ACTIVE_CHAPTER19_CONCEPT_FAMILY_IDS).toHaveLength(7)
    expect(SHARED_GRADE_WEIGHTS).toEqual({
      micro_check: 0.2,
      flashcard: 0.1,
      chapter_assessment: 0.4,
      scenario_application: 0.15,
      remediation_reassessment: 0.15,
    })
  })

  it('preserves all 15 stable assessment IDs, standard IDs, order indexes, and quiz assignment', () => {
    expect(chapter19PremiumQuizQuestions).toHaveLength(15)
    expect(chapter19PremiumQuizQuestions.map((question) => question.id)).toEqual(expectedQuestionIds)
    expect(chapter19PremiumQuizQuestions.map((question) => question.standardId)).toEqual(expectedStandardIds)
    expect(chapter19PremiumQuizQuestions.map((question) => question.order_index)).toEqual(
      Array.from({ length: 15 }, (_, index) => index + 1),
    )
    expect(chapter19PremiumQuizQuestions.every((question) => question.quiz_id === 'quiz-19')).toBe(true)
    expect(new Set(chapter19PremiumQuizQuestions.map((question) => question.id)).size).toBe(15)
  })

  it('certifies the hardened answer key for every assessment item', () => {
    for (const question of chapter19PremiumQuizQuestions) {
      expect(question.correct_answer, question.id).toBe(
        expectedCorrectAnswers[question.id as keyof typeof expectedCorrectAnswers],
      )
    }
  })

  it('replaces stale LO-1/LO-2/LO-3 metadata with canonical LO-19-01 through LO-19-07', () => {
    for (const question of chapter19PremiumQuizQuestions) {
      expect(question.learningObjective, question.id).toBe(
        expectedLearningObjectiveByQuestion[
          question.id as keyof typeof expectedLearningObjectiveByQuestion
        ],
      )
    }

    expect(source).not.toMatch(/learningObjective:\s*['"]LO-[123]['"]/)
  })

  it('certifies every question maps exactly once to the intended valid concept family', () => {
    expect(chapter19QuizQuestionConceptMappings).toHaveLength(15)
    expect(
      new Set(chapter19QuizQuestionConceptMappings.map((mapping) => mapping.questionId)).size,
    ).toBe(15)

    for (const mapping of chapter19QuizQuestionConceptMappings) {
      expect(ACTIVE_CHAPTER19_CONCEPT_FAMILY_IDS).toContain(mapping.conceptFamilyId)
      expect(mapping.conceptFamilyId, mapping.questionId).toBe(
        expectedConceptByQuestion[
          mapping.questionId as keyof typeof expectedConceptByQuestion
        ],
      )
    }
  })

  it('keeps all seven canonical concepts represented in the 15-question bank', () => {
    for (const conceptFamilyId of ACTIVE_CHAPTER19_CONCEPT_FAMILY_IDS) {
      expect(
        chapter19QuizQuestionConceptMappings.some(
          (mapping) => mapping.conceptFamilyId === conceptFamilyId,
        ),
        conceptFamilyId,
      ).toBe(true)
    }
  })

  it('gives every question four distinct non-empty choices and a substantive explanation', () => {
    for (const question of chapter19PremiumQuizQuestions) {
      const choices = [
        question.answer_a,
        question.answer_b,
        question.answer_c,
        question.answer_d,
      ]
      expect(choices.every((choice) => choice.trim().length > 0), question.id).toBe(true)
      expect(new Set(choices).size, question.id).toBe(4)
      expect(question.explanation?.trim().length ?? 0, question.id).toBeGreaterThan(80)
    }
  })

  it('removes textbook page citations and inherited publisher-style review sourcing', () => {
    expect(source).not.toMatch(/\(p{1,2}\.\s*\d+/i)
    expect(source).not.toMatch(/Review:.*\bpp?\.\s*\d+/i)
    expect(source).not.toMatch(/Milady|Pivot Point|CIMA/i)
  })

  it('removes universal licensing and practical-exam claims', () => {
    expect(source).not.toContain(
      'You must be licensed to be hired as a barber',
    )
    expect(source).not.toContain(
      'Employers cannot legally hire unlicensed barbers in most states',
    )
    expect(source).not.toContain(
      'Practical exams typically evaluate haircutting, shaving, shampooing, infection control',
    )
    expect(source).toContain(
      'Requirements can differ by jurisdiction and can change',
    )
    expect(source).toContain(
      'Practical-exam requirements are not universal',
    )
  })

  it('removes unsupported resume timing and interview-law absolutes', () => {
    expect(source).not.toContain(
      'Employers typically scan a résumé for about 20 seconds',
    )
    expect(source).not.toContain(
      "'What is your native language?' is an illegal question",
    )
    expect(source).toContain(
      'There is no universal number of seconds that every employer spends on a résumé',
    )
    expect(source).toContain(
      'Interview-question rules and protected categories can vary by jurisdiction and situation',
    )
  })

  it('hardens contract language without claiming universal enforceability', () => {
    expect(source).not.toContain(
      'Employers can legally require contracts, such as noncompete or confidentiality agreements',
    )
    expect(source).not.toContain(
      'verbal promises are legally binding',
    )
    expect(source).toContain(
      'The meaning and enforceability of an agreement depend on its wording',
    )
    expect(source).toContain(
      'rather than assuming a clause is always valid or always invalid',
    )
  })

  it('quarantines stale legacy remediation question links instead of routing hardened questions through drifted content', () => {
    expect(remediationSource).toContain(
      'C19-4 removed the inherited direct qq-19-XX associations',
    )
    expect(remediationSource).not.toMatch(/quizQuestionId:\s*['"]qq-19-\d{2}['"]/)
  })

  it('preserves safety/compliance separation', () => {
    expect(CHAPTER19_SAFETY_CRITICAL_CONCEPT_FAMILY_IDS).toEqual([
      'ch19-practical-exam-safety-readiness',
    ])
    expect(CHAPTER19_COMPLIANCE_LEGAL_CRITICAL_CONCEPT_FAMILY_IDS).toEqual([
      'ch19-licensing-requirements-verification',
      'ch19-employment-law-contracts-compliance',
    ])
  })
})
