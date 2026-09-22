import { describe, expect, it } from 'vitest'
import {
  areKnowledgeCheckSectionsComplete,
  calculateChapterProgress,
  CHAPTER_PROGRESS_WEIGHTS,
  preserveLegacyFullCompletion,
} from './progress'

describe('chapter progress weighting', () => {
  it('keeps the agreed 15/15/20/50 weights', () => {
    expect(CHAPTER_PROGRESS_WEIGHTS).toEqual({
      lesson: 15,
      flashcards: 15,
      knowledgeChecks: 20,
      quiz: 50,
    })
  })

  it.each([
    ['nothing complete', false, false, false, false, 0],
    ['lesson only', false, false, true, false, 15],
    ['flashcards only', true, false, false, false, 15],
    ['knowledge checks only', false, false, false, true, 20],
    ['quiz only', false, true, false, false, 50],
    ['lesson + flashcards', true, false, true, false, 30],
    ['all except quiz', true, false, true, true, 50],
    ['quiz + flashcards', true, true, false, false, 65],
    ['all complete', true, true, true, true, 100],
  ])('%s', (_label, flashcards, quiz, lesson, knowledgeChecks, expected) => {
    expect(
      calculateChapterProgress(flashcards, quiz, {
        lessonCompleted: lesson,
        knowledgeChecksCompleted: knowledgeChecks,
      })
    ).toBe(expected)
  })

  it('does not award quiz credit when quizCompleted is false', () => {
    expect(
      calculateChapterProgress(true, false, {
        lessonCompleted: true,
        knowledgeChecksCompleted: true,
      })
    ).toBe(50)
  })

  it('requires every knowledge-check section before awarding the 20% signal', () => {
    const required = ['scenario-a', 'scenario-b', 'pro-scenario']
    expect(areKnowledgeCheckSectionsComplete(required, new Set(['scenario-a']))).toBe(false)
    expect(
      areKnowledgeCheckSectionsComplete(required, new Set(['scenario-a', 'scenario-b']))
    ).toBe(false)
    expect(
      areKnowledgeCheckSectionsComplete(
        required,
        new Set(['scenario-a', 'scenario-b', 'pro-scenario'])
      )
    ).toBe(true)
    expect(areKnowledgeCheckSectionsComplete([], new Set())).toBe(false)
  })

  it('grandfathers only previously stored 100% completion', () => {
    expect(preserveLegacyFullCompletion(15, 100)).toBe(100)
    expect(preserveLegacyFullCompletion(65, 100)).toBe(100)
    expect(preserveLegacyFullCompletion(15, 50)).toBe(15)
    expect(preserveLegacyFullCompletion(15, null)).toBe(15)
  })
})
