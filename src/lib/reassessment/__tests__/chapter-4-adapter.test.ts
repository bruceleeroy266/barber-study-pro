/**
 * Chapter 4 Canonical Mapping Provider Tests (C4-3)
 *
 * Proves the Chapter 4 adapter plugs the locked concept taxonomy into the
 * chapter-agnostic exclusion engine correctly:
 *   - question→concept resolution spans initial + reserve banks
 *   - the per-family pool is the union of initial (5/6/5/5/4/5) and reserve (15)
 *   - every mapping resolves to a real question in one of the two banks
 *   - the registry registers ch-4 and unsupported chapters fail closed
 */

import { describe, it, expect } from 'vitest'
import {
  Chapter4MappingProvider,
  getChapter4MappingProvider,
  resetChapter4MappingProvider,
} from '../adapters/chapter-4-adapter'
import {
  getCanonicalMappingProvider,
  hasCanonicalMappingProvider,
  getMappingProviderRegistry,
  resetMappingProviderRegistry,
} from '../provider-registry'
import { chapter4PremiumQuizQuestions } from '@/lib/chapter-4-premium-quiz'
import { chapter4ReassessmentQuestions } from '@/lib/chapter-4-reassessment-questions'
import { ACTIVE_CHAPTER4_CONCEPT_FAMILY_IDS } from '@/lib/chapter-4-concepts/concepts'

const INITIAL_PER_FAMILY: Record<string, number> = {
  'ch4-pathogens-transmission': 5,
  'ch4-disinfection-sterilization': 6,
  'ch4-cross-contamination': 5,
  'ch4-blood-exposure-ppe': 5,
  'ch4-regulatory-chemical-safety': 4,
  'ch4-safe-practice-compliance': 5,
}

describe('Chapter 4 mapping provider — resolution', () => {
  const provider = new Chapter4MappingProvider()

  it('serves ch-4 as its chapter', () => {
    expect(provider.chapterId).toBe('ch-4')
  })

  it('resolves every initial and reserve question to exactly one locked family', () => {
    const allQuestions = [...chapter4PremiumQuizQuestions, ...chapter4ReassessmentQuestions]
    for (const q of allQuestions) {
      const concept = provider.getConceptForQuestion(q.id)
      expect(concept, q.id).toBeDefined()
      expect(ACTIVE_CHAPTER4_CONCEPT_FAMILY_IDS as readonly string[]).toContain(concept)
      expect(provider.isQuestionMappedToConcept(q.id, concept!)).toBe(true)
    }
  })

  it('returns undefined for unknown and foreign-chapter questions', () => {
    expect(provider.getConceptForQuestion('qq-4-999')).toBeUndefined()
    expect(provider.getConceptForQuestion('qq-3-001')).toBeUndefined()
  })

  it('per-family pool is exactly initial (5/6/5/5/4/5) + reserve (15)', () => {
    for (const family of ACTIVE_CHAPTER4_CONCEPT_FAMILY_IDS) {
      const pool = provider.getQuestionsForConcept(family)
      expect(pool.length, family).toBe(INITIAL_PER_FAMILY[family] + 15)
      // No duplicates within a family pool.
      expect(new Set(pool).size, family).toBe(pool.length)
    }
  })

  it('getAllConceptIds returns exactly the six locked families', () => {
    expect([...provider.getAllConceptIds()].sort()).toEqual(
      [...ACTIVE_CHAPTER4_CONCEPT_FAMILY_IDS].sort(),
    )
  })

  it('getAllQuestionIds covers all 120 chapter questions (30 + 90)', () => {
    const all = provider.getAllQuestionIds()
    expect(all.length).toBe(120)
    expect(new Set(all).size).toBe(120)
  })

  it('singleton accessor returns the same instance and resets cleanly', () => {
    resetChapter4MappingProvider()
    const a = getChapter4MappingProvider()
    const b = getChapter4MappingProvider()
    expect(a).toBe(b)
    resetChapter4MappingProvider()
    const c = getChapter4MappingProvider()
    expect(c).not.toBe(a)
  })
})

describe('Chapter 4 mapping provider — registry integration', () => {
  it('registers ch-4 in the mapping provider registry alongside ch-2 and ch-3', () => {
    resetMappingProviderRegistry()
    expect(hasCanonicalMappingProvider('ch-2')).toBe(true)
    expect(hasCanonicalMappingProvider('ch-3')).toBe(true)
    expect(hasCanonicalMappingProvider('ch-4')).toBe(true)
    const provider = getCanonicalMappingProvider('ch-4')
    expect(provider.chapterId).toBe('ch-4')
  })

  it('unsupported chapters fail closed', () => {
    resetMappingProviderRegistry()
    expect(hasCanonicalMappingProvider('ch-5')).toBe(false)
    expect(() => getCanonicalMappingProvider('ch-5')).toThrow(
      /No canonical mapping provider registered/,
    )
  })

  it('registry exposes all three registered chapter IDs', () => {
    resetMappingProviderRegistry()
    const ids = getMappingProviderRegistry().getRegisteredChapterIds()
    expect(ids).toContain('ch-2')
    expect(ids).toContain('ch-3')
    expect(ids).toContain('ch-4')
  })
})
