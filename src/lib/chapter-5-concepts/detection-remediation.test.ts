import { describe, expect, it } from 'vitest'
import { chapter5PremiumContent } from '@/lib/chapter-5-premium'
import { chapter5PremiumFlashcards } from '@/lib/chapter-5-premium-flashcards'
import { chapter5PremiumQuizQuestions } from '@/lib/chapter-5-premium-quiz'
import { chapter5ConceptFamilies, ACTIVE_CHAPTER5_CONCEPT_FAMILY_IDS } from './concepts'
import { chapter5ContentConceptMappings, chapter5FlashcardConceptMappings, chapter5QuizQuestionConceptMappings } from './mappings'
import { getChapterContentProvider } from '@/lib/remediation/content-provider-registry'
import { createChapter5DetectionProvider } from '@/lib/reassessment/adapters/chapter-5-detection-provider'
import type { QuizAttempt } from '@/types'

describe('Chapter 5 detection/remediation integrity (C5-3)', () => {
  it('maps all served content blocks to real sections or tabs and covers all six families', () => {
    const ids = new Set<string>()
    for (const section of chapter5PremiumContent.sections) {
      ids.add(section.id)
      if (section.type === 'tabbed' && 'tabs' in section) for (const tab of section.tabs) ids.add(tab.id)
    }
    for (const mapping of chapter5ContentConceptMappings) expect(ids.has(mapping.contentBlockId), mapping.contentBlockId).toBe(true)
    for (const conceptId of ACTIVE_CHAPTER5_CONCEPT_FAMILY_IDS) {
      expect(chapter5ContentConceptMappings.some(m => m.conceptFamilyId === conceptId)).toBe(true)
    }
  })

  it('keeps the canonical 70 flashcards and 50 questions mapped exactly once', () => {
    expect(chapter5PremiumFlashcards).toHaveLength(70)
    expect(chapter5PremiumQuizQuestions).toHaveLength(50)
    expect(chapter5FlashcardConceptMappings).toHaveLength(70)
    expect(chapter5QuizQuestionConceptMappings).toHaveLength(50)
    expect(new Set(chapter5FlashcardConceptMappings.map(m => m.flashcardId)).size).toBe(70)
    expect(new Set(chapter5QuizQuestionConceptMappings.map(m => m.questionId)).size).toBe(50)
  })

  it('serves targeted active remediation for every family', () => {
    const provider = getChapterContentProvider('ch-5')
    expect(provider).toBeDefined()
    for (const family of chapter5ConceptFamilies) {
      const bundle = provider!.buildRemediationContentBundle(family.id)
      expect(bundle.conceptId).toBe(family.id)
      expect(bundle.contentBlockCount).toBeGreaterThanOrEqual(2)
      expect(bundle.flashcardCount).toBeGreaterThan(0)
      expect(bundle.hasSufficientMaterial).toBe(true)
      expect(provider!.filterFlashcardsByConcept(family.id).every(card => card.is_active)).toBe(true)
    }
  })

  it('filters evidence to the requested concept and scores canonical answers', async () => {
    const conceptId = 'ch5-clippers-trimmers'
    const mapped = chapter5QuizQuestionConceptMappings.filter(m => m.conceptFamilyId === conceptId).slice(0, 5)
    const answers: Record<string,string> = {}
    for (const m of mapped) {
      const q = chapter5PremiumQuizQuestions.find(q => q.id === m.questionId)!
      answers[q.id] = q.correct_answer
    }
    answers['qq-5-035'] = 'a'
    const attempt: QuizAttempt = {
      id:'c5-att-1', user_id:'student-1', quiz_id:'quiz-5', score:5, total_questions:6,
      percentage:83, answers_json:answers, completed_at:'2026-09-19T12:00:00.000Z',
    }
    const provider = createChapter5DetectionProvider({ fetchQuizAttempts: async () => [attempt] })
    const result = await provider.detectConceptState(conceptId, [attempt.id])
    expect(result).not.toBeNull()
    expect(result!.conceptId).toBe(conceptId)
    expect(result!.evidence.totalObservations).toBe(5)
    expect(result!.evidence.correct).toBe(5)
    expect(result!.state).toBe('currently_performing_well')
  })

  it('fails closed for invalid concepts and missing attempts', async () => {
    const provider = createChapter5DetectionProvider({ fetchQuizAttempts: async () => [] })
    expect(provider.chapterId).toBe('ch-5')
    expect(provider.isValidConcept('ch5-razors')).toBe(true)
    expect(provider.isValidConcept('ch5-unknown')).toBe(false)
    expect(await provider.detectConceptState('ch5-unknown', ['x'])).toBeNull()
    expect(await provider.detectConceptState('ch5-razors', ['x'])).toBeNull()
  })
})
