/**
 * ASCYN PRO — Chapter 3 Content Integrity Tests (C3-1)
 *
 * Protects the rebuilt Chapter 3 content foundation against regression:
 *   1. exactly 4 canonical concept families
 *   2. exactly 48 active core flashcards
 *   3. exactly 12 active core cards per LO
 *   4. every active card maps to one valid concept
 *   5. exactly 30 initial quiz questions
 *   6. quiz distribution = 8/7/8/7
 *   7. quiz difficulty = 12E/12M/6H
 *   8. every quiz question maps to one concept
 *   9. all 7 key terms exist
 *  10. key terms map correctly to concepts + LOs
 *  11. prohibited claims absent from ACTIVE/SERVED content
 *  12. non-Ch3 re-home material absent from the initial quiz
 *  13. IDs unique across banks
 *  14. no orphan concept mappings
 *  15. student-serving imports point to canonical banks
 *  16. Chapter 2 key-term behavior remains valid
 *
 * Behavioral assertions over data, not snapshots.
 */

import { describe, it, expect } from 'vitest'
import {
  chapter3PremiumFlashcards,
  chapter3EnrichmentFlashcards,
  chapter3RetiredFlashcards,
} from './chapter-3-premium-flashcards'
import { chapter3PremiumQuizQuestions } from './chapter-3-premium-quiz'
import { chapter3KeyTerms } from './chapter-3-key-terms'
import {
  CHAPTER3_CONCEPT_FAMILY_IDS,
  chapter3ConceptFamilies,
  chapter3LearningObjectives,
  isChapter3ConceptFamilyId,
} from './chapter-3-concepts/concepts'
import {
  chapter3FlashcardConceptMappings,
  chapter3QuizQuestionConceptMappings,
  chapter3ContentConceptMappings,
  getChapter3FlashcardConcept,
  getChapter3QuizQuestionConcept,
} from './chapter-3-concepts/mappings'
import {
  chapterKeyTerms,
  chapter2KeyTerms,
  groupKeyTermsByConcept,
} from './chapter-2-key-terms'
import {
  ACTIVE_CONCEPT_IDS,
  chapter2LearningObjectives,
} from './chapter-2-concepts/concepts'
import { getChapterContent } from './chapter-content'
import { chapterFlashcards } from './flashcards-data'
import { allQuizQuestions } from './quiz-data'
import {
  getLocalFlashcards,
  getLocalQuiz,
  getLocalQuizQuestions,
} from './local-data'

const coreCards = chapter3PremiumFlashcards
const quiz = chapter3PremiumQuizQuestions

const fcMapById = new Map<string, string>(
  chapter3FlashcardConceptMappings.map((m) => [m.flashcardId, m.conceptFamilyId])
)
const qqMapById = new Map<string, string>(
  chapter3QuizQuestionConceptMappings.map((m) => [m.questionId, m.conceptFamilyId])
)

const EXPECTED_FAMILY_IDS = [
  'ch3-healthful-habits',
  'ch3-professional-image',
  'ch3-ergonomics',
  'ch3-human-relations',
] as const

const PROHIBITED_CLAIMS = [
  '7 seconds',
  'state board law',
  'legally required',
  'maintains licensure',
  'federal law',
  'state law',
  'osha',
  'fire department',
  'prohibited by law',
  'licensing boards',
  'extreme colors',
  'elbow level',
  'flat back',
  'artificial nails',
  'privacy laws',
]

describe('Chapter 3 — concept foundation', () => {
  it('1. has exactly the four locked canonical concept families', () => {
    expect(CHAPTER3_CONCEPT_FAMILY_IDS).toHaveLength(4)
    expect([...CHAPTER3_CONCEPT_FAMILY_IDS]).toEqual([...EXPECTED_FAMILY_IDS])
    expect(chapter3ConceptFamilies).toHaveLength(4)
    expect(chapter3LearningObjectives).toHaveLength(4)
    for (const family of chapter3ConceptFamilies) {
      expect(family.status).toBe('active')
      // 1:1 family ↔ LO
      const lo = chapter3LearningObjectives.find(
        (l) => l.conceptFamilyId === family.id
      )
      expect(lo, `LO missing for ${family.id}`).toBeDefined()
      expect(lo?.id).toBe(family.learningObjectiveId)
    }
  })
})

describe('Chapter 3 — flashcard bank', () => {
  it('2. serves exactly 48 active core flashcards', () => {
    expect(coreCards).toHaveLength(48)
    for (const card of coreCards) {
      expect(card.is_active, `${card.id} must be active`).toBe(true)
      expect(card.chapter_id).toBe('ch-3')
    }
    // Enrichment + retired sets exist separately and are never active
    expect(chapter3EnrichmentFlashcards.length).toBeGreaterThan(0)
    expect(chapter3RetiredFlashcards.length).toBeGreaterThan(0)
    for (const card of [
      ...chapter3EnrichmentFlashcards,
      ...chapter3RetiredFlashcards,
    ]) {
      expect(card.is_active, `${card.id} must not be active`).toBe(false)
    }
    // No enrichment/retired ID leaks into the core bank
    const coreIds = new Set(coreCards.map((c) => c.id))
    for (const card of [
      ...chapter3EnrichmentFlashcards,
      ...chapter3RetiredFlashcards,
    ]) {
      expect(coreIds.has(card.id), `${card.id} leaked into core bank`).toBe(false)
    }
  })

  it('3. has exactly 12 active core cards per LO', () => {
    const counts = new Map<string, number>()
    for (const card of coreCards) {
      const family = fcMapById.get(card.id)
      expect(family, `${card.id} unmapped`).toBeDefined()
      counts.set(family!, (counts.get(family!) ?? 0) + 1)
    }
    for (const familyId of EXPECTED_FAMILY_IDS) {
      expect(counts.get(familyId), familyId).toBe(12)
    }
  })

  it('4. every active card maps to exactly one valid concept', () => {
    for (const card of coreCards) {
      const family = getChapter3FlashcardConcept(card.id)
      expect(family, `${card.id} unmapped`).toBeDefined()
      expect(isChapter3ConceptFamilyId(family!), `${card.id} -> ${family}`).toBe(true)
    }
    expect(chapter3FlashcardConceptMappings).toHaveLength(48)
  })

  it('13a. flashcard IDs are unique across all exports and order_index is sequential', () => {
    const all = [
      ...coreCards,
      ...chapter3EnrichmentFlashcards,
      ...chapter3RetiredFlashcards,
    ]
    const ids = all.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
    // Core serving order deterministic: order_index 1..48 sequential
    coreCards.forEach((card, idx) => {
      expect(card.order_index, card.id).toBe(idx + 1)
    })
  })
})

describe('Chapter 3 — initial quiz', () => {
  it('5. has exactly 30 questions', () => {
    expect(quiz).toHaveLength(30)
    for (const q of quiz) {
      expect(q.quiz_id).toBe('quiz-3')
      expect(['a', 'b', 'c', 'd']).toContain(q.correct_answer)
      for (const opt of [q.answer_a, q.answer_b, q.answer_c, q.answer_d]) {
        expect(opt.trim().length, `${q.id} empty option`).toBeGreaterThan(0)
      }
      expect(q.explanation?.trim().length ?? 0, `${q.id} missing explanation`).toBeGreaterThan(0)
    }
  })

  it('6. distributes questions 8/7/8/7 across the four LOs', () => {
    const counts = new Map<string, number>()
    for (const q of quiz) {
      const family = qqMapById.get(q.id)
      expect(family, `${q.id} unmapped`).toBeDefined()
      counts.set(family!, (counts.get(family!) ?? 0) + 1)
    }
    expect(counts.get('ch3-healthful-habits')).toBe(8)
    expect(counts.get('ch3-professional-image')).toBe(7)
    expect(counts.get('ch3-ergonomics')).toBe(8)
    expect(counts.get('ch3-human-relations')).toBe(7)
  })

  it('7. difficulty is exactly 12 easy / 12 medium / 6 hard', () => {
    const tally = { easy: 0, medium: 0, hard: 0 }
    for (const q of quiz) tally[q.difficulty]++
    expect(tally).toEqual({ easy: 12, medium: 12, hard: 6 })
  })

  it('8. every quiz question maps to one valid concept', () => {
    for (const q of quiz) {
      const family = getChapter3QuizQuestionConcept(q.id)
      expect(family, `${q.id} unmapped`).toBeDefined()
      expect(isChapter3ConceptFamilyId(family!), `${q.id} -> ${family}`).toBe(true)
    }
    expect(chapter3QuizQuestionConceptMappings).toHaveLength(30)
  })

  it('12. contains no re-homed/non-Ch3 material and no retired question IDs', () => {
    const retiredQuizIds = [
      'qq-3-006', 'qq-3-010', 'qq-3-011', 'qq-3-013', 'qq-3-015',
      'qq-3-017', 'qq-3-020', 'qq-3-023', 'qq-3-024', 'qq-3-025',
      'qq-3-026', 'qq-3-027', 'qq-3-029', 'qq-3-030',
    ]
    const bankIds = new Set(quiz.map((q) => q.id))
    for (const id of retiredQuizIds) {
      expect(bankIds.has(id), `${id} still in quiz bank`).toBe(false)
    }
    const bannedTopics = [
      /disinfect/i,
      /cross-contamination/i,
      /state regulations/i,
      /portfolio/i,
      /scope of practice/i,
      /diagnos/i,
      /tattoo/i,
      /\btips?\b/i,
      /sweep/i,
    ]
    for (const q of quiz) {
      const text = [
        q.question,
        q.answer_a,
        q.answer_b,
        q.answer_c,
        q.answer_d,
        q.explanation ?? '',
      ].join(' ')
      for (const pattern of bannedTopics) {
        expect(pattern.test(text), `${q.id} hits ${pattern}`).toBe(false)
      }
    }
  })

  it('13b. quiz question IDs are unique', () => {
    const ids = quiz.map((q) => q.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('Chapter 3 — key terms', () => {
  it('9. all 7 canonical terms exist', () => {
    expect(chapter3KeyTerms).toHaveLength(7)
    const terms = chapter3KeyTerms.map((t) => t.term)
    expect(terms).toEqual([
      'Personal Hygiene',
      'Professional Image',
      'Personal Grooming',
      'Physical Presentation',
      'Ergonomics',
      'Human Relations',
      'Effective Communication',
    ])
  })

  it('10. every key term maps to a valid concept family and its 1:1 LO', () => {
    for (const term of chapter3KeyTerms) {
      expect(isChapter3ConceptFamilyId(term.conceptId), `${term.id} bad concept`).toBe(true)
      const family = chapter3ConceptFamilies.find((f) => f.id === term.conceptId)
      expect(family, `${term.id} family missing`).toBeDefined()
      expect(term.learningObjectiveId).toBe(family!.learningObjectiveId)
      expect(term.definition.trim().length).toBeGreaterThan(20)
    }
  })

  it('13c. key-term IDs are unique', () => {
    const ids = chapter3KeyTerms.map((t) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('Chapter 3 — prohibited content firewall', () => {
  it('11. prohibited claims are absent from all ACTIVE/SERVED content', () => {
    const servedBlobs: Array<[string, string]> = []
    for (const c of coreCards) {
      servedBlobs.push([c.id, `${c.front} ${c.back}`])
    }
    for (const q of quiz) {
      servedBlobs.push([
        q.id,
        [q.question, q.answer_a, q.answer_b, q.answer_c, q.answer_d, q.explanation ?? ''].join(' '),
      ])
    }
    for (const t of chapter3KeyTerms) {
      servedBlobs.push([t.id, `${t.term} ${t.definition}`])
    }
    const lesson = getChapterContent(3)
    expect(lesson).not.toBeNull()
    servedBlobs.push(['lesson-ch-3', JSON.stringify(lesson)])

    for (const [assetId, blob] of servedBlobs) {
      const lower = blob.toLowerCase()
      for (const claim of PROHIBITED_CLAIMS) {
        expect(lower.includes(claim), `${assetId} contains prohibited claim "${claim}"`).toBe(false)
      }
    }
  })
})

describe('Chapter 3 — mapping integrity', () => {
  it('14. no orphan mappings: every mapping resolves to a real asset and valid concept', () => {
    const cardIds = new Set(coreCards.map((c) => c.id))
    for (const m of chapter3FlashcardConceptMappings) {
      expect(cardIds.has(m.flashcardId), `orphan fc mapping ${m.flashcardId}`).toBe(true)
      expect(isChapter3ConceptFamilyId(m.conceptFamilyId)).toBe(true)
    }
    const quizIds = new Set(quiz.map((q) => q.id))
    for (const m of chapter3QuizQuestionConceptMappings) {
      expect(quizIds.has(m.questionId), `orphan qq mapping ${m.questionId}`).toBe(true)
      expect(isChapter3ConceptFamilyId(m.conceptFamilyId)).toBe(true)
    }
    const lesson = getChapterContent(3)
    const blockIds = new Set((lesson?.sections ?? []).map((s) => s.id))
    for (const m of chapter3ContentConceptMappings) {
      expect(blockIds.has(m.contentBlockId), `orphan content mapping ${m.contentBlockId}`).toBe(true)
      expect(isChapter3ConceptFamilyId(m.conceptFamilyId)).toBe(true)
    }
  })
})

describe('Chapter 3 — student serving truth', () => {
  it('15. serving imports resolve to the canonical banks', () => {
    // Flashcards: registry -> canonical 48-card bank (old 40-card bank gone)
    expect(chapterFlashcards['ch-3']).toBe(chapter3PremiumFlashcards)
    expect(getLocalFlashcards('ch-3')).toHaveLength(48)
    // Quiz: registry -> canonical 30-question bank
    expect(allQuizQuestions['quiz-3']).toBe(chapter3PremiumQuizQuestions)
    expect(getLocalQuizQuestions('quiz-3')).toHaveLength(30)
    expect(getLocalQuiz('ch-3')?.id).toBe('quiz-3')
    // Key terms: registry -> canonical ch3 dataset
    expect(chapterKeyTerms['ch-3']).toBe(chapter3KeyTerms)
    // Lesson present
    expect(getChapterContent(3)?.sections.length ?? 0).toBeGreaterThan(0)
  })
})

describe('Chapter 2 — regression protection', () => {
  it('16. Chapter 2 key-term behavior remains valid after shared widening', () => {
    expect(chapterKeyTerms['ch-2']).toBe(chapter2KeyTerms)
    expect(chapter2KeyTerms).toHaveLength(37)
    const groups = groupKeyTermsByConcept()
    expect(groups.length).toBeGreaterThan(0)
    const grouped = groups.reduce((n, g) => n + g.terms.length, 0)
    expect(grouped).toBe(37)
    expect(ACTIVE_CONCEPT_IDS).toHaveLength(25)
    expect(chapter2LearningObjectives).toHaveLength(14)
  })
})
