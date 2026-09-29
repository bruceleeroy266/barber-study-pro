import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter15PremiumQuizQuestions } from '../chapter-15-premium-quiz'
import { chapter15QuizQuestionConceptMappings } from './mappings'
import { ACTIVE_CHAPTER15_CONCEPT_FAMILY_IDS } from './concepts'

const root = process.cwd()
const source = readFileSync(join(root, 'src/lib/chapter-15-premium-quiz.ts'), 'utf8')

describe('C15-4 assessment source-grounding and answer-key certification', () => {
  it('preserves exactly 72 unique stable question IDs', () => {
    const ids = chapter15PremiumQuizQuestions.map((question) => question.id)

    expect(ids).toHaveLength(72)
    expect(new Set(ids).size).toBe(72)
    expect(ids).toEqual(
      Array.from({ length: 72 }, (_, index) => `qq-15-${String(index + 1).padStart(3, '0')}`),
    )
  })

  it('preserves exact 72/72 C15-1 concept mappings', () => {
    const ids = chapter15PremiumQuizQuestions.map((question) => question.id)
    const mappedIds = chapter15QuizQuestionConceptMappings.map((mapping) => mapping.questionId)

    expect(mappedIds).toHaveLength(72)
    expect(new Set(mappedIds).size).toBe(72)
    expect([...mappedIds].sort()).toEqual([...ids].sort())
  })

  it('retains assessment coverage for every active Chapter 15 concept family', () => {
    for (const conceptFamilyId of ACTIVE_CHAPTER15_CONCEPT_FAMILY_IDS) {
      expect(
        chapter15QuizQuestionConceptMappings.some((mapping) => mapping.conceptFamilyId === conceptFamilyId),
        conceptFamilyId,
      ).toBe(true)
    }
  })

  it('has a valid key and four distinct non-empty choices for every question', () => {
    for (const question of chapter15PremiumQuizQuestions) {
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
      expect(question.explanation.trim().length, question.id).toBeGreaterThan(0)
    }
  })

  it('removes rejected market, medical, regulatory, and exam-certainty claims', () => {
    const rejected = [
      'second fastest-growing category in barbering',
      'moderately effective for about 50% of men after 4 months',
      'weight gain and loss of sexual function',
      'results can last a lifetime when performed properly',
      'only physicians can recommend dosages',
      'state boards frequently test',
      'most frequently tested facts on state board exams',
      'Board Exam Trap:',
      'keep release forms on file for at least three years',
    ]

    for (const phrase of rejected) {
      expect(source.toLowerCase(), phrase).not.toContain(phrase.toLowerCase())
    }
  })

  it('removes rejected attachment, cure-time, fit, maintenance, and chemical absolutes', () => {
    const rejected = [
      'fit perfectly',
      'most secure, waterproof',
      'the client must wait 24 to 48 hours',
      'clients own at least two hair replacement systems',
      'lightening and cold-waving destroy the base material',
      'temporary color rinses are the only safe coloring option',
      'combination bases considered the industry standard',
      'never apply tape directly to lace',
    ]

    for (const phrase of rejected) {
      expect(source.toLowerCase(), phrase).not.toContain(phrase.toLowerCase())
    }
  })

  it('uses manufacturer-dependent and jurisdiction-aware safety language', () => {
    expect(source).toContain('adhesive manufacturer’s cure and water-exposure instructions')
    expect(source).toContain('permitted scope varies by jurisdiction')
    expect(source).toContain('verify the rules in the jurisdiction where you practice')
    expect(source).toContain('Fiber type, base construction, prior processing, and manufacturer approval')
  })

  it('keeps the certified 90-card flashcard bank intact', () => {
    const flashcardSource = readFileSync(join(root, 'src/lib/chapter-15-premium-flashcards.ts'), 'utf8')
    expect((flashcardSource.match(/id: 'fc-ch15-/g) ?? [])).toHaveLength(90)
    expect(flashcardSource).toContain("id: 'fc-ch15-090'")
  })
})
