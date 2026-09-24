import { describe, expect, it } from 'vitest'
import { chapter6PremiumQuizQuestions } from './chapter-6-premium-quiz'
import { ACTIVE_CHAPTER6_CONCEPT_FAMILY_IDS } from './chapter-6-concepts/concepts'
import { getChapter6ConceptForQuizQuestion, getChapter6QuizEvidenceCount } from './chapter-6-concepts/mappings'

describe('Chapter 6 C6-3 assessment hardening', () => {
  it('locks an exact 50-question hard assessment bank', () => {
    expect(chapter6PremiumQuizQuestions).toHaveLength(50)
    expect(chapter6PremiumQuizQuestions.every((q) => q.difficulty === 'hard')).toBe(true)
    expect(new Set(chapter6PremiumQuizQuestions.map((q) => q.id)).size).toBe(50)
    expect(new Set(chapter6PremiumQuizQuestions.map((q) => q.order_index)).size).toBe(50)
  })

  it('keeps stable sequential question IDs and complete answer sets', () => {
    for (let i = 0; i < 50; i++) {
      const question = chapter6PremiumQuizQuestions[i]
      expect(question.id).toBe(`qq-6-${String(i + 1).padStart(3, '0')}`)
      expect(question.order_index).toBe(i + 1)
      expect([question.answer_a, question.answer_b, question.answer_c, question.answer_d].every(Boolean)).toBe(true)
      expect(['a', 'b', 'c', 'd']).toContain(question.correct_answer)
    }
  })

  it('requires the locked five-step test-taking strategy in every explanation', () => {
    const required = [
      'Read carefully.',
      'Identify the keyword:',
      'Eliminate wrong answers:',
      'Apply safety/procedure logic:',
      'Then make the best remaining choice:',
    ]
    for (const question of chapter6PremiumQuizQuestions) {
      for (const phrase of required) expect(question.explanation).toContain(phrase)
    }
  })

  it('keeps every canonical concept family diagnostic-ready', () => {
    for (const id of ACTIVE_CHAPTER6_CONCEPT_FAMILY_IDS) {
      expect(getChapter6QuizEvidenceCount(id)).toBeGreaterThanOrEqual(4)
    }
    for (const question of chapter6PremiumQuizQuestions) {
      expect(getChapter6ConceptForQuizQuestion(question.id)).not.toBeNull()
    }
  })

  it('prevents known unsafe or inaccurate legacy assessment wording from returning', () => {
    const serialized = JSON.stringify(chapter6PremiumQuizQuestions)
    const forbidden = [
      'elevate their feet',
      'probably cancer',
      'Arteries carry oxygenated blood AWAY',
      'Veins carry deoxygenated blood back',
      'primary driver during puberty',
      'only movable bone in the face. It moves when clients talk',
    ]
    for (const phrase of forbidden) expect(serialized).not.toContain(phrase)
  })
})
