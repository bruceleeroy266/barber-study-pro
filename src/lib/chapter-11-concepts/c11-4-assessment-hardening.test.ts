import { describe, expect, it } from 'vitest'
import { chapter11PremiumQuizQuestions } from '../chapter-11-premium-quiz'
import { chapter11QuizQuestionConceptMappings } from './mappings'
import {
  CHAPTER11_ASSESSMENT_HARDENING_CLASSIFICATION,
  CHAPTER11_ASSESSMENT_KEEP,
  CHAPTER11_ASSESSMENT_REPAIR,
  CHAPTER11_ASSESSMENT_REWRITE,
  CHAPTER11_EXPECTED_ANSWER_KEYS,
} from './assessment-hardening'

describe('C11-4 assessment source & adversarial hardening', () => {
  it('classifies all 50 questions exactly once as KEEP / REPAIR / REWRITE', () => {
    expect(CHAPTER11_ASSESSMENT_KEEP).toHaveLength(18)
    expect(CHAPTER11_ASSESSMENT_REPAIR).toHaveLength(14)
    expect(CHAPTER11_ASSESSMENT_REWRITE).toHaveLength(18)

    const classified = [
      ...CHAPTER11_ASSESSMENT_KEEP,
      ...CHAPTER11_ASSESSMENT_REPAIR,
      ...CHAPTER11_ASSESSMENT_REWRITE,
    ]
    expect(classified).toHaveLength(50)
    expect(new Set(classified).size).toBe(50)
    expect(Object.keys(CHAPTER11_ASSESSMENT_HARDENING_CLASSIFICATION)).toHaveLength(50)
    expect(new Set(classified)).toEqual(new Set(chapter11PremiumQuizQuestions.map((q) => q.id)))
  })

  it('preserves stable IDs/order and one canonical concept mapping per question', () => {
    expect(chapter11PremiumQuizQuestions).toHaveLength(50)
    expect(chapter11PremiumQuizQuestions.map((q) => q.id)).toEqual(
      Array.from({ length: 50 }, (_, index) => `qq-11-${String(index + 1).padStart(3, '0')}`),
    )
    expect(chapter11PremiumQuizQuestions.map((q) => q.order_index)).toEqual(
      Array.from({ length: 50 }, (_, index) => index + 1),
    )
    expect(chapter11QuizQuestionConceptMappings).toHaveLength(50)
    expect(new Set(chapter11QuizQuestionConceptMappings.map((m) => m.questionId)).size).toBe(50)
    expect(new Set(chapter11QuizQuestionConceptMappings.map((m) => m.questionId))).toEqual(
      new Set(chapter11PremiumQuizQuestions.map((q) => q.id)),
    )
  })

  it('locks every verified answer key and requires complete explanations', () => {
    expect(Object.keys(CHAPTER11_EXPECTED_ANSWER_KEYS)).toHaveLength(50)

    for (const q of chapter11PremiumQuizQuestions) {
      expect(q.correct_answer).toBe(CHAPTER11_EXPECTED_ANSWER_KEYS[q.id])
      const correct = q[`answer_${q.correct_answer}` as 'answer_a' | 'answer_b' | 'answer_c' | 'answer_d']
      expect(typeof correct).toBe('string')
      expect(correct.trim().length).toBeGreaterThan(0)
      expect(q.explanation.trim().length).toBeGreaterThanOrEqual(30)
    }
  })

  it('removes the exploitable all-A answer pattern', () => {
    const counts = chapter11PremiumQuizQuestions.reduce<Record<string, number>>((acc, q) => {
      acc[q.correct_answer] = (acc[q.correct_answer] ?? 0) + 1
      return acc
    }, {})

    expect(counts).toEqual({ b: 13, c: 13, a: 12, d: 12 })
    expect(Math.max(...Object.values(counts)) - Math.min(...Object.values(counts))).toBeLessThanOrEqual(1)
  })

  it('raises application/scenario demand without relabeling the old bank', () => {
    const counts = chapter11PremiumQuizQuestions.reduce<Record<string, number>>((acc, q) => {
      acc[q.difficulty] = (acc[q.difficulty] ?? 0) + 1
      return acc
    }, {})

    expect(counts).toEqual({ easy: 15, hard: 12, medium: 23 })
    expect(counts.hard).toBeGreaterThan(5)

    const scenarioStems = chapter11PremiumQuizQuestions.filter((q) =>
      /client|during analysis|during a shampoo service|while massaging/i.test(q.question),
    )
    expect(scenarioStems.length).toBeGreaterThanOrEqual(10)
  })

  it('removes unsupported and cross-chapter carryover from the assessment', () => {
    const runtime = JSON.stringify(chapter11PremiumQuizQuestions).toLowerCase()

    for (const phrase of [
      '4.5 to 7.5',
      '3.0 to 5.5',
      'pyrithione zinc',
      'selenium sulfide',
      'ketoconazole',
      'seborrheic dermatitis',
      'pityriasis steatoides',
      'skin cancer',
      'tinea',
      'physician or pharmacist',
      'gloves as a precautionary measure',
      'approximately 100,000',
      '140,000 strands',
      '80,000 strands',
      'required by law in all states',
    ]) {
      expect(runtime).not.toContain(phrase)
    }
  })

  it('retains source-supported Chapter 11 assessment anchors', () => {
    const runtime = JSON.stringify(chapter11PremiumQuizQuestions).toLowerCase()

    for (const phrase of [
      'waterproof shampoo cape',
      'reclined',
      'inclined',
      'water temperature',
      'texture',
      'density',
      'porosity',
      'elasticity',
      'rotary',
      'sliding',
      'back-and-forth',
      'cleanliness and stimulation',
      'malassezia',
      'scalp steam',
      'hot towel',
      'electric massager',
      'intensity, duration, and pressure',
      'parasitic infestations',
      'staphylococcal infections',
      'refer the client to a physician',
    ]) {
      expect(runtime).toContain(phrase)
    }
  })
})
