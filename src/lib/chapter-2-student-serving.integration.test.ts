import { describe, expect, it } from 'vitest'
import {
  getLocalChapterByNumber,
  getLocalFlashcards,
  getLocalQuiz,
  getLocalQuizQuestions,
} from './local-data'
import { getChapterContent } from './chapter-content'
import { chapterKeyTerms } from './chapter-2-key-terms'
import { chapter2PremiumFlashcards } from './chapter-2-premium-flashcards'
import { chapter2PremiumQuizQuestions } from './chapter-2-premium-quiz'
import { chapter2ReassessmentQuestions } from './chapter-2-reassessment-questions'
import { getQuizQuestionById } from './remediation/content-filter'

describe('Chapter 2 student-serving integration', () => {
  it('serves the active Chapter 2 lesson and student key terms', () => {
    const chapter = getLocalChapterByNumber(2)
    const content = getChapterContent(2)

    expect(chapter).toBeDefined()
    expect(chapter?.id).toBe('ch-2')
    expect(chapter?.is_active).toBe(true)

    expect(content).not.toBeNull()
    expect(content?.chapterNumber).toBe(2)
    expect(content?.sections.length).toBeGreaterThan(0)

    expect(chapterKeyTerms['ch-2']?.length ?? 0).toBeGreaterThan(0)
  })

  it('serves only active Chapter 2 flashcards', () => {
    const served = getLocalFlashcards('ch-2')
    const expectedActive = chapter2PremiumFlashcards.filter((card) => card.is_active)

    expect(served).toHaveLength(expectedActive.length)
    expect(served.every((card) => card.is_active)).toBe(true)
    expect(served.map((card) => card.id)).toEqual(expectedActive.map((card) => card.id))

    // Canonical history may retain inactive cards, but students must never see them.
    expect(chapter2PremiumFlashcards.some((card) => card.id === 'fc-2-045' && !card.is_active)).toBe(true)
    expect(served.some((card) => card.id === 'fc-2-045')).toBe(false)
  })

  it('keeps the initial student quiz locked to the canonical 48 questions', () => {
    const quiz = getLocalQuiz('ch-2')

    expect(quiz).not.toBeNull()
    expect(quiz?.id).toBe('quiz-2')
    expect(quiz?.passing_score).toBe(80)

    const served = getLocalQuizQuestions('quiz-2')
    expect(served).toHaveLength(48)
    expect(served.map((question) => question.id)).toEqual(
      chapter2PremiumQuizQuestions.map((question) => question.id),
    )

    const servedIds = new Set(served.map((question) => question.id))
    for (const reserveQuestion of chapter2ReassessmentQuestions) {
      expect(servedIds.has(reserveQuestion.id)).toBe(false)
    }
  })

  it('keeps all 25 reassessment reserve questions resolvable through the live remediation lookup', () => {
    expect(chapter2ReassessmentQuestions).toHaveLength(25)

    for (const reserveQuestion of chapter2ReassessmentQuestions) {
      const resolved = getQuizQuestionById(reserveQuestion.id)
      expect(resolved, `${reserveQuestion.id} must resolve`).not.toBeNull()
      expect(resolved?.quiz_id).toBe('quiz-2')
      expect(resolved?.correct_answer).toBe(reserveQuestion.correct_answer)
    }
  })
})
