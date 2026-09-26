import { describe, expect, it } from 'vitest'
import { chapter7PremiumQuizQuestions } from '../chapter-7-premium-quiz'
import { CHAPTER7_CONCEPT_FAMILY_IDS } from './concepts'
import { chapter7QuizQuestionConceptMappings } from './mappings'

describe('Chapter 7 hardened assessment', () => {
  it('contains exactly 50 uniquely identified scored questions', () => {
    expect(chapter7PremiumQuizQuestions).toHaveLength(50)
    const ids = chapter7PremiumQuizQuestions.map((q) => q.id)
    expect(new Set(ids).size).toBe(50)
  })

  it('uses the locked 5 easy / 20 medium / 25 hard profile', () => {
    const counts = chapter7PremiumQuizQuestions.reduce<Record<string, number>>((acc, q) => {
      acc[q.difficulty] = (acc[q.difficulty] ?? 0) + 1
      return acc
    }, {})
    expect(counts).toEqual({ easy: 5, medium: 20, hard: 25 })
  })

  it('has four distinct options and one valid stored answer for every question', () => {
    for (const q of chapter7PremiumQuizQuestions) {
      const answers = [q.answer_a, q.answer_b, q.answer_c, q.answer_d]
      expect(answers.every((a) => typeof a === 'string' && a.trim().length > 0)).toBe(true)
      expect(new Set(answers).size).toBe(4)
      expect(['a', 'b', 'c', 'd']).toContain(q.correct_answer)
      expect((q.explanation ?? '').trim().length).toBeGreaterThan(0)
    }
  })

  it('maps every assessment question exactly once to a canonical concept', () => {
    const questionIds = chapter7PremiumQuizQuestions.map((q) => q.id).sort()
    const mappedIds = chapter7QuizQuestionConceptMappings.map((m) => m.questionId).sort()
    expect(mappedIds).toEqual(questionIds)
    expect(new Set(mappedIds).size).toBe(50)

    const validConcepts = new Set<string>(CHAPTER7_CONCEPT_FAMILY_IDS)
    expect(chapter7QuizQuestionConceptMappings.every((m) => validConcepts.has(m.conceptFamilyId))).toBe(true)
  })

  it('uses the locked concept distribution for deterministic remediation', () => {
    const counts = chapter7QuizQuestionConceptMappings.reduce<Record<string, number>>((acc, m) => {
      acc[m.conceptFamilyId] = (acc[m.conceptFamilyId] ?? 0) + 1
      return acc
    }, {})
    expect(counts).toEqual({
      'ch7-organic-inorganic': 3,
      'ch7-matter-structure': 4,
      'ch7-properties-changes': 4,
      'ch7-redox-reactions': 6,
      'ch7-mixtures': 6,
      'ch7-water-ph': 7,
      'ch7-shampoos': 5,
      'ch7-conditioners': 4,
      'ch7-other-preparations': 4,
      'ch7-chemical-safety': 7,
    })
  })

  it('is application-heavy rather than definition-heavy', () => {
    const stems = chapter7PremiumQuizQuestions.map((q) => q.question)
    const whatCount = stems.filter((s) => /^What\b/i.test(s)).length
    const applicationCount = stems.filter((s) =>
      /(client|barber|service|product|formula|during|before|after|student|label|mix|select|choose|sample|reaction|condition)/i.test(s),
    ).length

    expect(whatCount).toBeLessThanOrEqual(8)
    expect(applicationCount).toBeGreaterThanOrEqual(30)
  })

  it('does not reintroduce removed unsafe or unsupported shortcuts', () => {
    const text = JSON.stringify(chapter7PremiumQuizQuestions)
    expect(text).not.toContain('living or once-living')
    expect(text).not.toContain('Organic substances burn')
    expect(text).not.toContain('Inorganic substances do NOT burn')
    expect(text).not.toContain('Chemical changes are permanent')
    expect(text).not.toContain('mild alkalis (pH 5.5–10)')
    expect(text).not.toContain('Use weekly, not daily')
    expect(text).not.toContain('Required before haircolor, relaxers, perms, and depilatories')
    expect(text).not.toContain('BOARD EXAM')
  })

  it('keeps acid-alkali neutralization separate from permanent-wave oxidation neutralization', () => {
    const text = JSON.stringify(chapter7PremiumQuizQuestions)
    expect(text).toContain('acid-alkali neutralization')
    expect(text).toContain('permanent-wave oxidation neutralization')
    expect(text).not.toContain('neutralizing shampoo is used AFTER chemical services')
  })

  it('does not expose textbook publisher names in runtime assessment copy', () => {
    expect(JSON.stringify(chapter7PremiumQuizQuestions).toLowerCase()).not.toContain('milady')
  })
})
