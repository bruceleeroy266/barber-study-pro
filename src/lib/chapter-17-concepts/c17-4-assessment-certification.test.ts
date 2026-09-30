import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter17PremiumContent } from '../chapter-17-premium'
import { chapter17PremiumFlashcards } from '../chapter-17-premium-flashcards'
import { chapter17PremiumQuizQuestions, chapter17LearningQuestions } from '../chapter-17-premium-quiz'
import {
  chapter17QuizQuestionConceptMappings,
  chapter17ContentConceptMappings,
  chapter17FlashcardConceptMappings,
  chapter17LearningQuestionConceptMappings,
} from './mappings'
import { ACTIVE_CHAPTER17_CONCEPT_FAMILY_IDS } from './concepts'

const source = readFileSync(join(process.cwd(), 'src/lib/chapter-17-premium-quiz.ts'), 'utf8')
const assessmentSource = source.slice(0, source.indexOf('export const chapter17LearningQuestions'))

describe('C17-4 assessment source-grounding and answer-key certification', () => {
  it('preserves the certified 24/60/30/16 inventories and seven concept families', () => {
    expect(chapter17PremiumContent.sections).toHaveLength(24)
    expect(chapter17PremiumFlashcards).toHaveLength(60)
    expect(chapter17PremiumQuizQuestions).toHaveLength(30)
    expect(chapter17LearningQuestions).toHaveLength(16)
    expect(ACTIVE_CHAPTER17_CONCEPT_FAMILY_IDS).toHaveLength(7)

    expect(chapter17ContentConceptMappings).toHaveLength(24)
    expect(chapter17FlashcardConceptMappings).toHaveLength(60)
    expect(chapter17QuizQuestionConceptMappings).toHaveLength(30)
    expect(chapter17LearningQuestionConceptMappings).toHaveLength(16)
  })

  it('preserves exactly the 30 stable qq-17 IDs and C17-1 mappings', () => {
    const runtimeIds = chapter17PremiumQuizQuestions.map((question) => question.id)
    const mappedIds = chapter17QuizQuestionConceptMappings.map((mapping) => mapping.questionId)
    const expected = Array.from({ length: 30 }, (_, index) =>
      `qq-17-${String(index + 1).padStart(3, '0')}`,
    )

    expect(runtimeIds).toEqual(expected)
    expect(mappedIds).toEqual(expected)
    expect(new Set(runtimeIds).size).toBe(30)
    expect(new Set(mappedIds).size).toBe(30)
  })

  it('retains assessment coverage for every canonical concept family', () => {
    for (const conceptFamilyId of ACTIVE_CHAPTER17_CONCEPT_FAMILY_IDS) {
      expect(
        chapter17QuizQuestionConceptMappings.some(
          (mapping) => mapping.conceptFamilyId === conceptFamilyId,
        ),
        conceptFamilyId,
      ).toBe(true)
    }
  })

  it('certifies every answer key, choice set, and explanation', () => {
    for (const question of chapter17PremiumQuizQuestions) {
      const choices = {
        a: question.answer_a,
        b: question.answer_b,
        c: question.answer_c,
        d: question.answer_d,
      }

      expect(['a', 'b', 'c', 'd'], question.id).toContain(question.correct_answer)
      expect(Object.values(choices).every((choice) => choice.trim().length > 0), question.id).toBe(true)
      expect(new Set(Object.values(choices)).size, question.id).toBe(4)
      expect(choices[question.correct_answer as keyof typeof choices].trim().length, question.id).toBeGreaterThan(0)
      expect((question.explanation ?? '').trim().length, question.id).toBeGreaterThan(0)
    }
  })

  it('removes one-chemistry-for-all-service claims and distinguishes hydroxide lanthionization', () => {
    expect(assessmentSource).not.toContain('permanently altered by all chemical texture services')
    expect(assessmentSource).not.toContain('Chemical texture services break and rebuild them')
    expect(assessmentSource).not.toContain('straighten hair by breaking disulfide bonds')
    expect(assessmentSource).toContain('hydroxide relaxers, which use different chemistry')
    expect(assessmentSource.toLowerCase()).toContain('hydroxide relaxers require a different post-service finishing process')
    expect(assessmentSource).toContain('straighten through highly alkaline chemistry and lanthionization')
  })

  it('removes fixed pH, blanket heat, fixed test-curl count, and generic product-strength prescriptions', () => {
    expect(assessmentSource).not.toContain('pH around 9.0–9.6')
    expect(assessmentSource).not.toContain('usually require heat')
    expect(assessmentSource).not.toContain('at least three areas')
    expect(assessmentSource).not.toContain('choose a milder acid formula')
    const highlightedHairQuestion = chapter17PremiumQuizQuestions.find((question) => question.id === 'qq-17-002')!
    expect(highlightedHairQuestion.correct_answer).toBe('b')
    expect(highlightedHairQuestion.answer_b).toContain('manufacturer directions support')
    expect(highlightedHairQuestion.explanation).toContain('not a generic milder-formula prescription')
    expect(assessmentSource).toContain('heat use and timing depend on the specific product directions')
    expect(assessmentSource).toContain('intervals and locations directed by the product instructions and service plan')
    expect(assessmentSource).toContain('manufacturer directions rather than porosity alone')
  })

  it('hardens hydroxide/thio compatibility and rejects strand-test override logic', () => {
    expect(assessmentSource).not.toContain('a compatibility test is needed')
    expect(assessmentSource).not.toContain('making them compatible when hair is healthy')
    expect(assessmentSource).toContain('A strand test does not override a known incompatibility')
    expect(assessmentSource).toContain('known incompatibility unless verified guidance explicitly supports the planned service')
    expect(assessmentSource).toContain('Do not assume compatibility from the chemical-family name alone')
  })

  it('removes diagnostic scalp language and unsafe continue-processing responses', () => {
    expect(assessmentSource).not.toContain('Open cuts, infections, or scalp disease')
    expect(assessmentSource).not.toContain('Burning is a sign of irritation or chemical injury')
    expect(assessmentSource).toContain('visibly open, abraded, irritated, or otherwise compromised scalp tissue')
    expect(assessmentSource).toContain('refer medical concerns appropriately rather than diagnosing the condition')
    expect(assessmentSource).toContain('Stop the service and remove the product according to the product’s safety directions')
    expect(assessmentSource).toContain('rather than diagnosing the cause or continuing exposure')
  })

  it('does not define texturizing only by mild formula or shorter processing', () => {
    expect(assessmentSource).not.toContain('uses a mild relaxer formula and shorter processing')
    expect(assessmentSource).toContain('Texturizing aims to loosen or soften curl rather than maximize straightening')
    expect(assessmentSource).toContain('Do not define texturizing only by a mild formula or shorter processing time')
  })

  it('removes exam-certainty framing from the assessment source', () => {
    expect(assessmentSource).not.toContain('30 board-style questions')
    expect(assessmentSource).not.toContain('BOARD-STYLE QUESTION BANK')
    expect(assessmentSource).toContain('30 chapter-assessment questions')
    expect(assessmentSource).toContain('CHAPTER-ASSESSMENT QUESTION BANK')
  })

  it('keeps the 16 learning-question bank outside C17-4 unchanged in count and namespace', () => {
    expect(chapter17LearningQuestions).toHaveLength(16)
    expect(chapter17LearningQuestions.every((question) => question.id.startsWith('lq-17-'))).toBe(true)
    expect(new Set(chapter17LearningQuestions.map((question) => question.id)).size).toBe(16)
  })
})
