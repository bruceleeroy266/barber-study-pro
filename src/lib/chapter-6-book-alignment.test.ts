import { describe, expect, it } from 'vitest'
import { chapter6PremiumContent } from './chapter-6-premium'
import { chapter6PremiumFlashcards } from './chapter-6-premium-flashcards'
import { chapter6PremiumQuizQuestions } from './chapter-6-premium-quiz'
import { chapter6ReassessmentQuestions } from './chapter-6-reassessment-questions'
import {
  chapter6ContentConceptMappings,
  chapter6FlashcardConceptMappings,
  chapter6ReassessmentQuestionConceptMappings,
} from './chapter-6-concepts/mappings'

describe('C6-8 source-book alignment', () => {
  it('serves every new book-aligned lesson block and maps it to a canonical concept', () => {
    const expected = [
      'skeletal-upper-body',
      'muscular-upper-body',
      'nervous-head-neck-branches',
      'cardiovascular-detail',
      'endocrine-exocrine',
    ]
    const ids = chapter6PremiumContent.sections.map((section) => section.id)

    for (const id of expected) {
      expect(ids).toContain(id)
      expect(chapter6ContentConceptMappings.some((mapping) => mapping.contentBlockId === id)).toBe(true)
    }
  })

  it('covers the source chapter gaps in original ASCYN PRO lesson language', () => {
    const lesson = JSON.stringify(chapter6PremiumContent)
    const required = [
      'humerus',
      'radius',
      'ulna',
      'carpal',
      'metacarpal',
      'phalanges',
      'Origin',
      'Insertion',
      'Pronator',
      'Supinator',
      'Temporal Branch',
      'Buccal Branch',
      'Greater Occipital Nerve',
      'Greater Auricular Nerve',
      'Submental',
      'Superior & Inferior Labial',
      'Supraorbital',
      'Endocrine',
      'Exocrine',
    ]

    for (const term of required) expect(lesson).toContain(term)
    expect(lesson).not.toContain('Milady')
  })

  it('preserves the original 105 flashcard identities and appends 20 mapped source-alignment cards', () => {
    expect(chapter6PremiumFlashcards).toHaveLength(125)
    expect(chapter6PremiumFlashcards[0].id).toBe('fc-6-001')
    expect(chapter6PremiumFlashcards[104].id).toBe('fc-6-105')
    expect(chapter6PremiumFlashcards[105].id).toBe('fc-6-106')
    expect(chapter6PremiumFlashcards[124].id).toBe('fc-6-125')

    const newIds = chapter6PremiumFlashcards.slice(105).map((card) => card.id)
    expect(newIds).toHaveLength(20)
    for (const id of newIds) {
      expect(chapter6FlashcardConceptMappings.some((mapping) => mapping.flashcardId === id)).toBe(true)
    }

    const newDeck = JSON.stringify(chapter6PremiumFlashcards.slice(105))
    for (const term of ['humerus', 'Radius', 'Carpals', 'Pronator', 'temporal branch', 'greater occipital', 'submental', 'labial', 'endocrine', 'exocrine']) {
      expect(newDeck).toMatch(new RegExp(term, 'i'))
    }
  })

  it('samples source-book detail in the hardened 50-question initial assessment', () => {
    expect(chapter6PremiumQuizQuestions).toHaveLength(50)
    const alignedIds = ['qq-6-011', 'qq-6-018', 'qq-6-024', 'qq-6-028', 'qq-6-045']
    const aligned = chapter6PremiumQuizQuestions.filter((question) => alignedIds.includes(question.id))
    expect(aligned).toHaveLength(5)

    const serialized = JSON.stringify(aligned)
    for (const term of ['carpals', 'Pronator', 'greater occipital', 'Submental', 'endocrine', 'exocrine']) {
      expect(serialized).toMatch(new RegExp(term, 'i'))
    }
    for (const question of aligned) {
      expect(question.difficulty).toBe('hard')
      expect(question.explanation).toContain('Read carefully')
      expect(question.explanation).toMatch(/Identify the keyword/i)
      expect(question.explanation).toMatch(/Eliminate/i)
      expect(question.explanation).toMatch(/safety\/procedure logic/i)
      expect(question.explanation).toMatch(/best remaining/i)
    }
  })

  it('makes source-book gaps diagnosable in the unseen reassessment reserve', () => {
    expect(chapter6ReassessmentQuestions).toHaveLength(150)
    const serialized = JSON.stringify(chapter6ReassessmentQuestions)
    for (const term of [
      'upper-arm bone',
      'pronation and supination',
      'facial nerve temporal branch',
      'blood functions',
      'submental artery territory',
      'endocrine versus exocrine glands',
    ]) {
      expect(serialized).toContain(term)
    }

    for (const family of ['ch6-skeletal', 'ch6-muscular', 'ch6-nervous', 'ch6-cardiovascular', 'ch6-endocrine']) {
      expect(chapter6ReassessmentQuestionConceptMappings.filter((m) => m.conceptFamilyId === family)).toHaveLength(15)
    }
  })
})
