/**
 * Phase 6C-3 — Remediation Content Filter Tests
 *
 * Tests for concept-based content filtering using canonical mappings.
 */

import { describe, it, expect } from 'vitest'
import {
  getConceptName,
  getContentBlockIdsForConcept,
  getFlashcardIdsForConcept,
  filterContentByConcept,
  filterFlashcardsByConcept,
  buildRemediationContentBundle,
  getConceptQuestionCount,
} from '../content-filter'
import type { ConceptId } from '../../chapter-2-concepts/types'

describe('Remediation Content Filter', () => {
  describe('getConceptName', () => {
    it('should return concept name for valid concept', () => {
      const name = getConceptName('C-2-05' as ConceptId)
      expect(name).toBe('Positive Professional Attitude')
    })

    it('should return Unknown Topic for invalid concept', () => {
      const name = getConceptName('C-99-99' as ConceptId)
      expect(name).toBe('Unknown Topic')
    })
  })

  describe('getContentBlockIdsForConcept', () => {
    it('should return primary content blocks for concept', () => {
      const blockIds = getContentBlockIdsForConcept('C-2-05' as ConceptId)
      expect(blockIds).toContain('attitude-framework')
      expect(blockIds).toContain('attitude-composure')
      expect(blockIds).toContain('attitude-communication')
    })

    it('should include secondary concept mappings', () => {
      // C-2-09 is secondary for time-tools and time-scenarios
      const blockIds = getContentBlockIdsForConcept('C-2-09' as ConceptId)
      expect(blockIds).toContain('time-tools')
      expect(blockIds).toContain('time-scenarios')
    })

    it('should return empty array for unmapped concept', () => {
      const blockIds = getContentBlockIdsForConcept('C-99-99' as ConceptId)
      expect(blockIds).toEqual([])
    })
  })

  describe('getFlashcardIdsForConcept', () => {
    it('should return flashcards for concept', () => {
      const flashcardIds = getFlashcardIdsForConcept('C-2-05' as ConceptId)
      expect(flashcardIds).toContain('fc-2-014')
      expect(flashcardIds).toContain('fc-2-043')
      expect(flashcardIds).toContain('fc-2-053')
    })

    it('should include all mapped flashcards (active filtering happens in filterFlashcardsByConcept)', () => {
      // Note: getFlashcardIdsForConcept returns all mapped IDs including inactive
      // The active filtering is done in filterFlashcardsByConcept
      const flashcardIds = getFlashcardIdsForConcept('C-2-05' as ConceptId)
      // fc-2-045 is mapped but inactive - it will be included in IDs but filtered out later
      expect(flashcardIds).toContain('fc-2-045')
    })
  })

  describe('filterContentByConcept', () => {
    it('should filter content sections by concept', () => {
      const sections = filterContentByConcept('C-2-05' as ConceptId)
      expect(sections.length).toBeGreaterThan(0)

      const sectionIds = sections.map((s) => s.id)
      expect(sectionIds).toContain('attitude-framework')
    })

    it('should return empty array for unmapped concept', () => {
      const sections = filterContentByConcept('C-99-99' as ConceptId)
      expect(sections).toEqual([])
    })
  })

  describe('filterFlashcardsByConcept', () => {
    it('should filter flashcards by concept', () => {
      const flashcards = filterFlashcardsByConcept('C-2-05' as ConceptId)
      expect(flashcards.length).toBeGreaterThan(0)

      const flashcardIds = flashcards.map((f) => f.id)
      expect(flashcardIds).toContain('fc-2-014')
    })

    it('should only return active flashcards', () => {
      const flashcards = filterFlashcardsByConcept('C-2-05' as ConceptId)
      const inactiveCards = flashcards.filter((f) => !f.is_active)
      expect(inactiveCards).toEqual([])
    })
  })

  describe('buildRemediationContentBundle', () => {
    it('should build complete content bundle', () => {
      const bundle = buildRemediationContentBundle('C-2-05' as ConceptId)

      expect(bundle.conceptId).toBe('C-2-05')
      expect(bundle.conceptName).toBe('Positive Professional Attitude')
      expect(bundle.contentBlocks.length).toBeGreaterThan(0)
      expect(bundle.flashcards.length).toBeGreaterThan(0)
      expect(bundle.contentBlockCount).toBe(bundle.contentBlocks.length)
      expect(bundle.flashcardCount).toBe(bundle.flashcards.length)
    })

    it('should detect sufficient material', () => {
      const bundle = buildRemediationContentBundle('C-2-05' as ConceptId)
      expect(bundle.hasSufficientMaterial).toBe(true)
    })

    it('should detect insufficient material for gap concepts', () => {
      // C-2-16 has critical gap (1 content block, 1 flashcard)
      const bundle = buildRemediationContentBundle('C-2-16' as ConceptId)
      expect(bundle.hasSufficientMaterial).toBe(false)
    })
  })

  describe('getConceptQuestionCount', () => {
    it('should return question count for concept', () => {
      const count = getConceptQuestionCount('C-2-05' as ConceptId)
      expect(count).toBeGreaterThan(0)
    })

    it('should return 0 for unmapped concept', () => {
      const count = getConceptQuestionCount('C-99-99' as ConceptId)
      expect(count).toBe(0)
    })
  })
})
