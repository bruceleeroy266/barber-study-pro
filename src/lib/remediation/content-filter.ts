/**
 * Phase 6C-3 — Remediation Content Filter
 *
 * Filters Chapter 2 content by concept using the canonical concept mappings.
 * Does NOT create duplicate mappings — uses existing chapter-2-concepts/mappings.ts.
 *
 * Binding Rules:
 *   - Canonical concept mapping remains application-authoritative
 *   - No duplicate curriculum content
 *   - No duplicate question→concept mappings
 *   - Thin remediation-specific wrappers only
 */

import type { ConceptId } from '../chapter-2-concepts/types'
import type { ChapterSection } from '../chapter-content'
import type { Flashcard } from '@/types'
import {
  chapter2ContentMappings,
  chapter2FlashcardMappings,
  chapter2QuizQuestionMappings,
} from '../chapter-2-concepts/mappings'
import { chapter2Concepts } from '../chapter-2-concepts/concepts'
import { chapter2PremiumFlashcards } from '../chapter-2-premium-flashcards'
import { getChapterContent } from '../chapter-content'
import type { RemediationContentBundle } from './student-service'

// ───────────────────────────────────────────────
// Content Filter Functions
// ───────────────────────────────────────────────

/**
 * Get the concept name for display.
 */
export function getConceptName(conceptId: ConceptId): string {
  const concept = chapter2Concepts.find((c) => c.id === conceptId)
  return concept?.name ?? 'Unknown Topic'
}

/**
 * Get content block IDs mapped to a concept.
 * Includes primary and secondary concept mappings.
 */
export function getContentBlockIdsForConcept(conceptId: ConceptId): string[] {
  const blockIds: string[] = []

  for (const mapping of chapter2ContentMappings) {
    // Primary mapping
    if (mapping.conceptId === conceptId) {
      blockIds.push(mapping.contentBlockId)
      continue
    }
    // Secondary mappings
    if (mapping.secondaryConceptIds?.includes(conceptId)) {
      blockIds.push(mapping.contentBlockId)
    }
  }

  return blockIds
}

/**
 * Get flashcard IDs mapped to a concept.
 * Only includes active flashcards.
 */
export function getFlashcardIdsForConcept(conceptId: ConceptId): string[] {
  const flashcardIds: string[] = []

  for (const mapping of chapter2FlashcardMappings) {
    // Primary mapping
    if (mapping.conceptId === conceptId) {
      flashcardIds.push(mapping.flashcardId)
      continue
    }
    // Secondary mappings
    if (mapping.secondaryConceptIds?.includes(conceptId)) {
      flashcardIds.push(mapping.flashcardId)
    }
  }

  return flashcardIds
}

/**
 * Filter Chapter 2 content sections by concept.
 *
 * Returns only the sections whose IDs match the concept's content mappings.
 * Preserves the original section structure and order.
 */
export function filterContentByConcept(conceptId: ConceptId): ChapterSection[] {
  const chapterContent = getChapterContent(2)
  if (!chapterContent) {
    return []
  }

  const mappedBlockIds = new Set(getContentBlockIdsForConcept(conceptId))

  return chapterContent.sections.filter((section) => {
    // Check if the section ID is mapped to this concept
    if (mappedBlockIds.has(section.id)) {
      return true
    }

    // For tabbed sections, check if any tab ID is mapped
    if (section.type === 'tabbed' && 'tabs' in section) {
      return section.tabs.some((tab: { id: string }) => mappedBlockIds.has(tab.id))
    }

    return false
  })
}

/**
 * Filter flashcards by concept.
 *
 * Returns only active flashcards mapped to the concept.
 */
export function filterFlashcardsByConcept(conceptId: ConceptId): Flashcard[] {
  const mappedFlashcardIds = new Set(getFlashcardIdsForConcept(conceptId))

  return chapter2PremiumFlashcards.filter(
    (card) => card.is_active && mappedFlashcardIds.has(card.id)
  )
}

/**
 * Build a remediation content bundle for a concept.
 *
 * Includes gap detection for concepts with insufficient material.
 */
export function buildRemediationContentBundle(conceptId: ConceptId): RemediationContentBundle {
  const contentBlocks = filterContentByConcept(conceptId)
  const flashcards = filterFlashcardsByConcept(conceptId)
  const conceptName = getConceptName(conceptId)

  const contentBlockCount = contentBlocks.length
  const flashcardCount = flashcards.length

  // Gap detection: flag concepts with < 2 content blocks or < 3 flashcards
  const hasSufficientMaterial = contentBlockCount >= 2 && flashcardCount >= 3

  return {
    conceptId,
    conceptName,
    contentBlocks,
    flashcards,
    hasSufficientMaterial,
    contentBlockCount,
    flashcardCount,
  }
}

/**
 * Get the quiz question for a reassessment.
 *
 * Looks up the question from the premium quiz questions by ID.
 * The question must already be reserved via selectAndReserveQuestion().
 */
export function getQuizQuestionById(questionId: string): import('@/types').QuizQuestion | null {
  // Dynamic import to avoid circular dependencies
  const { chapter2PremiumQuizQuestions } = require('../chapter-2-premium-quiz')
  return chapter2PremiumQuizQuestions.find(
    (q: import('@/types').QuizQuestion) => q.id === questionId
  ) ?? null
}

/**
 * Check if a concept has sufficient unseen questions for reassessment.
 *
 * This is a read-only check — the authoritative check is performed
 * by the exclusion engine during selectAndReserveQuestion().
 */
export function getConceptQuestionCount(conceptId: ConceptId): number {
  return chapter2QuizQuestionMappings.filter(
    (m) => m.conceptId === conceptId
  ).length
}
