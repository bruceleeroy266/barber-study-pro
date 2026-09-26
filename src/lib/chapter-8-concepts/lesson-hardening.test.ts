import { describe, expect, it } from 'vitest'
import { chapter8PremiumContent } from '../chapter-8-premium'

function serializedLesson(): string {
  return JSON.stringify(chapter8PremiumContent)
}

describe('C8-3 Chapter 8 lesson hardening', () => {
  it('removes public-runtime board-exam certainty language', () => {
    const lesson = serializedLesson()
    expect(lesson).not.toContain('BOARD EXAM ALERT')
    expect(lesson).not.toContain('EVERY state board exam')
    expect(lesson).not.toContain('Miss them, and you fail')
  })

  it('does not present the lesson as an electrical trade or safety credential', () => {
    const lesson = serializedLesson()
    expect(lesson).not.toContain('Electrical Safety Certification')
    expect(lesson).not.toContain('earn your electrical credentials')
    expect(lesson).not.toContain('Electrical Authority')
  })

  it('removes universal legal claims from GFCI and laser language', () => {
    const lesson = serializedLesson()
    expect(lesson).not.toContain('REQUIRED near sinks')
    expect(lesson).not.toContain('REQUIRED near water')
    expect(lesson).not.toContain('Most states do NOT permit barbers')
    expect(lesson).not.toContain('Level II or higher medical devices')
  })

  it('removes fixed universal light-therapy time and distance rules', () => {
    const lesson = serializedLesson()
    expect(lesson).not.toContain('5 minutes max')
    expect(lesson).not.toContain('LIMIT exposure time to 5 minutes or less per area')
    expect(lesson).not.toContain('MAINTAIN proper distance (30–36 inches for most lamps)')
    expect(lesson).not.toContain('Apply at 30–36 inches from the skin')
    expect(lesson).not.toContain('Approximately 30 inches from the skin')
  })

  it('removes unsupported electrical injury and protection absolutes', () => {
    const lesson = serializedLesson()
    expect(lesson).not.toContain('water + electricity = death')
    expect(lesson).not.toContain('0.1 amps (100 milliamps)')
    expect(lesson).not.toContain('220V shock is more lethal')
    expect(lesson).not.toContain('That third prong exists to save your life')
  })

  it('keeps scope-of-practice and manufacturer-direction boundaries explicit', () => {
    const lesson = serializedLesson()
    expect(lesson).toContain('scope of practice')
    expect(lesson).toContain('manufacturer')
    expect(lesson).toContain('device')
    expect(lesson).toContain('never leave a client unattended')
  })

  it('preserves the six source subject areas in the hardened lesson', () => {
    const lesson = serializedLesson()
    expect(lesson).toContain('WHAT IS ELECTRICITY?')
    expect(lesson).toContain('DC VS AC')
    expect(lesson).toContain('ELECTRICAL EQUIPMENT SAFETY')
    expect(lesson).toContain('ELECTROTHERAPY')
    expect(lesson).toContain('ELECTROMAGNETIC SPECTRUM')
    expect(lesson).toContain('LIGHT THERAPY')
  })

  it('does not mutate flashcard or assessment assets during C8-3', async () => {
    const flashcards = await import('../chapter-8-premium-flashcards')
    const quiz = await import('../chapter-8-premium-quiz')
    const originalIds = flashcards.chapter8PremiumFlashcards
      .filter((card) => Number(card.id.slice(-3)) <= 50)
      .map((card) => card.id)
    expect(originalIds).toHaveLength(50)
    expect(quiz.chapter8PremiumQuizQuestions).toHaveLength(30)
  })
})
