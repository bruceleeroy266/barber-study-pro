import { describe, expect, it } from 'vitest'
import { chapter8PremiumQuizQuestions } from '../chapter-8-premium-quiz'
import { chapter8QuizQuestionConceptMappings } from './mappings'

const serializedAssessment = () => JSON.stringify(chapter8PremiumQuizQuestions).toLowerCase()

describe('C8-5 hardened Chapter 8 assessment', () => {
  it('preserves 30 unique existing question IDs', () => {
    const ids = chapter8PremiumQuizQuestions.map((question) => question.id)
    expect(ids).toHaveLength(30)
    expect(new Set(ids).size).toBe(30)
    expect(ids).toEqual(
      Array.from({ length: 30 }, (_, index) =>
        `qq-8-${String(index + 1).padStart(3, '0')}`,
      ),
    )
  })

  it('uses the Chapter 7+ difficulty shape: 3 easy, 12 medium, 15 hard', () => {
    const counts = chapter8PremiumQuizQuestions.reduce<Record<string, number>>(
      (result, question) => {
        result[question.difficulty] = (result[question.difficulty] ?? 0) + 1
        return result
      },
      {},
    )

    expect(counts).toEqual({ easy: 3, medium: 12, hard: 15 })
  })

  it('maps every question exactly once to a canonical concept', () => {
    expect(chapter8QuizQuestionConceptMappings).toHaveLength(30)
    expect(new Set(chapter8QuizQuestionConceptMappings.map((mapping) => mapping.questionId)).size).toBe(30)
    expect(new Set(chapter8QuizQuestionConceptMappings.map((mapping) => mapping.questionId))).toEqual(
      new Set(chapter8PremiumQuizQuestions.map((question) => question.id)),
    )
  })

  it('gives explicit assessment evidence to all ten concept families', () => {
    const concepts = new Set(chapter8QuizQuestionConceptMappings.map((mapping) => mapping.conceptFamilyId))
    expect(concepts).toEqual(
      new Set([
        'ch8-electricity-circuits',
        'ch8-current-conversion',
        'ch8-electrical-measurements',
        'ch8-equipment-safety',
        'ch8-electrotherapy-terminology',
        'ch8-galvanic-current',
        'ch8-microcurrent-high-frequency',
        'ch8-electromagnetic-spectrum',
        'ch8-light-modalities',
        'ch8-light-therapy-safety',
      ]),
    )
  })

  it('removes legacy unsafe or overbroad assessment claims', () => {
    const assessment = serializedAssessment()
    const banned = [
      'required near sinks and all water sources',
      '5 minutes or less',
      '30–36 inches',
      'absolute contraindications',
      'waiver does not protect',
      'oily skin is not a contraindication',
      'short wavelengths carry more energy but penetrate less',
      'blue led reduces acne and kills bacteria',
      'a 20-amp circuit can handle one dryer plus small tools',
      'charger uses ac only',
    ]

    for (const phrase of banned) {
      expect(assessment).not.toContain(phrase)
    }
  })

  it('includes the five-step ASCYN test-taking strategy in every explanation', () => {
    for (const question of chapter8PremiumQuizQuestions) {
      expect(question.explanation).toContain(
        'Read carefully, identify the keyword, eliminate wrong answers, apply safety/procedure logic, then choose the best remaining answer.',
      )
    }
  })

  it('keeps all answer keys valid and exactly one correct answer per item', () => {
    for (const question of chapter8PremiumQuizQuestions) {
      expect(['a', 'b', 'c', 'd']).toContain(question.correct_answer)
      for (const key of ['answer_a', 'answer_b', 'answer_c', 'answer_d'] as const) {
        expect(question[key].trim().length).toBeGreaterThan(0)
      }
    }
  })

  it('keeps light-therapy safety and microcurrent/high-frequency assessment evidence non-trivial', () => {
    const counts = chapter8QuizQuestionConceptMappings.reduce<Record<string, number>>(
      (result, mapping) => {
        result[mapping.conceptFamilyId] = (result[mapping.conceptFamilyId] ?? 0) + 1
        return result
      },
      {},
    )
    expect(counts['ch8-microcurrent-high-frequency']).toBeGreaterThanOrEqual(3)
    expect(counts['ch8-light-therapy-safety']).toBeGreaterThanOrEqual(3)
  })
})
