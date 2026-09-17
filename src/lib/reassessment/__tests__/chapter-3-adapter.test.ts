/**
 * Chapter 3 Canonical Mapping Provider Tests (C3-3 Stage 3)
 *
 * Proves the Chapter 3 adapter plugs the locked concept taxonomy into the
 * chapter-agnostic exclusion engine correctly:
 *   - question→concept resolution spans initial + reserve banks
 *   - the per-family pool is the union of initial (8/7/8/7) and reserve (15)
 *   - every mapping resolves to a real question in one of the two banks
 *   - the registry registers ch-3 and unsupported chapters fail closed
 */

import { describe, it, expect } from 'vitest'
import {
  Chapter3MappingProvider,
  getChapter3MappingProvider,
  resetChapter3MappingProvider,
} from '../adapters/chapter-3-adapter'
import {
  getCanonicalMappingProvider,
  hasCanonicalMappingProvider,
  getMappingProviderRegistry,
  resetMappingProviderRegistry,
} from '../provider-registry'
import { chapter3PremiumQuizQuestions } from '@/lib/chapter-3-premium-quiz'
import { chapter3ReassessmentQuestions } from '@/lib/chapter-3-reassessment-questions'
import { CHAPTER3_CONCEPT_FAMILY_IDS } from '@/lib/chapter-3-concepts/concepts'

const INITIAL_PER_FAMILY: Record<string, number> = {
  'ch3-healthful-habits': 8,
  'ch3-professional-image': 7,
  'ch3-ergonomics': 8,
  'ch3-human-relations': 7,
}

describe('Chapter 3 mapping provider — resolution', () => {
  const provider = new Chapter3MappingProvider()

  it('serves ch-3 as its chapter', () => {
    expect(provider.chapterId).toBe('ch-3')
  })

  it('resolves every initial and reserve question to exactly one locked family', () => {
    const allQuestions = [...chapter3PremiumQuizQuestions, ...chapter3ReassessmentQuestions]
    for (const q of allQuestions) {
      const concept = provider.getConceptForQuestion(q.id)
      expect(concept, q.id).toBeDefined()
      expect(CHAPTER3_CONCEPT_FAMILY_IDS as readonly string[]).toContain(concept)
      expect(provider.isQuestionMappedToConcept(q.id, concept!)).toBe(true)
    }
  })

  it('returns undefined for unknown and foreign-chapter questions', () => {
    expect(provider.getConceptForQuestion('qq-3-999')).toBeUndefined()
    expect(provider.getConceptForQuestion('qq-2-001')).toBeUndefined()
  })

  it('per-family pool is exactly initial (8/7/8/7) + reserve (15)', () => {
    for (const family of CHAPTER3_CONCEPT_FAMILY_IDS) {
      const pool = provider.getQuestionsForConcept(family)
      expect(pool.length, family).toBe(INITIAL_PER_FAMILY[family] + 15)
      // No duplicates within a family pool.
      expect(new Set(pool).size, family).toBe(pool.length)
    }
  })

  it('getAllConceptIds returns exactly the four locked families', () => {
    expect([...provider.getAllConceptIds()].sort()).toEqual(
      [...CHAPTER3_CONCEPT_FAMILY_IDS].sort(),
    )
  })

  it('getAllQuestionIds covers all 90 chapter questions (30 + 60)', () => {
    const all = provider.getAllQuestionIds()
    expect(all.length).toBe(90)
    expect(new Set(all).size).toBe(90)
  })

  it('singleton accessor returns the same instance and resets cleanly', () => {
    resetChapter3MappingProvider()
    const a = getChapter3MappingProvider()
    const b = getChapter3MappingProvider()
    expect(a).toBe(b)
    resetChapter3MappingProvider()
    const c = getChapter3MappingProvider()
    expect(c).not.toBe(a)
  })
})

describe('Chapter 3 mapping provider — registry integration', () => {
  it('registers ch-3 in the mapping provider registry alongside ch-2', () => {
    resetMappingProviderRegistry()
    expect(hasCanonicalMappingProvider('ch-2')).toBe(true)
    expect(hasCanonicalMappingProvider('ch-3')).toBe(true)
    const provider = getCanonicalMappingProvider('ch-3')
    expect(provider.chapterId).toBe('ch-3')
  })

  it('unsupported chapters fail closed', () => {
    resetMappingProviderRegistry()
    expect(hasCanonicalMappingProvider('ch-5')).toBe(false)
    expect(() => getCanonicalMappingProvider('ch-5')).toThrow(
      /No canonical mapping provider registered/,
    )
  })

  it('registry exposes both registered chapter IDs', () => {
    resetMappingProviderRegistry()
    const ids = getMappingProviderRegistry().getRegisteredChapterIds()
    expect(ids).toContain('ch-2')
    expect(ids).toContain('ch-3')
  })
})
