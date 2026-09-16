/**
 * Phase 6C-3 — Remediation Content Filter
 *
 * Filters Chapter 2 content by concept using the canonical concept mappings.
 * Does NOT create duplicate mappings — uses existing chapter-2-concepts/mappings.ts.
 *
 * C3-3 Stage 1: This module is now a thin Chapter 2 facade over the
 * chapter-aware remediation content provider registry
 * (src/lib/remediation/content-provider-registry.ts). The export surface is
 * preserved exactly for existing consumers; the Chapter 2 provider holds the
 * canonical-data logic. Chapter 3 is served by its own registered provider.
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
import type { Chapter2KeyTerm } from '../chapter-2-key-terms'
import type { RemediationContentBundle } from './student-service'
import { getChapterContentProvider } from './content-provider-registry'

// ───────────────────────────────────────────────
// Chapter 2 provider (canonical source)
// ───────────────────────────────────────────────

function ch2Provider() {
  const provider = getChapterContentProvider('ch-2')
  if (!provider) {
    throw new Error('Chapter 2 remediation content provider is not registered')
  }
  return provider
}

// ───────────────────────────────────────────────
// Content Filter Functions (Chapter 2 facade)
// ───────────────────────────────────────────────

/**
 * Get the concept name for display.
 */
export function getConceptName(conceptId: ConceptId): string {
  return ch2Provider().getConceptName(conceptId)
}

/**
 * Get content block IDs mapped to a concept.
 * Includes primary and secondary concept mappings.
 */
export function getContentBlockIdsForConcept(conceptId: ConceptId): string[] {
  return ch2Provider().getContentBlockIdsForConcept(conceptId)
}

/**
 * Get flashcard IDs mapped to a concept.
 * Only includes active flashcards.
 */
export function getFlashcardIdsForConcept(conceptId: ConceptId): string[] {
  return ch2Provider().getFlashcardIdsForConcept(conceptId)
}

/**
 * Filter Chapter 2 content sections by concept.
 *
 * Returns only the sections whose IDs match the concept's content mappings.
 * Preserves the original section structure and order.
 */
export function filterContentByConcept(conceptId: ConceptId): ChapterSection[] {
  return ch2Provider().filterContentByConcept(conceptId)
}

/**
 * Filter flashcards by concept.
 *
 * Returns only active flashcards mapped to the concept.
 */
export function filterFlashcardsByConcept(conceptId: ConceptId): Flashcard[] {
  return ch2Provider().filterFlashcardsByConcept(conceptId)
}

/**
 * Build a remediation content bundle for a concept.
 *
 * Includes gap detection for concepts with insufficient material.
 */
export function buildRemediationContentBundle(conceptId: ConceptId): RemediationContentBundle {
  return ch2Provider().buildRemediationContentBundle(conceptId)
}

/**
 * Get the quiz question for a reassessment.
 *
 * Looks up the question from the premium quiz questions by ID.
 * The question must already be reserved via selectAndReserveQuestion().
 */
export function getQuizQuestionById(questionId: string): import('@/types').QuizQuestion | null {
  // Both quiz modules are pure data (import only '@/types'), so no circular
  // dependency is possible. The reassessment reserve (added post-lock,
  // Option A) is resolvable here so the 6C reassessment start/submit paths
  // can serve and score reserve questions, while the initial quiz serving
  // path continues to read the premium bank only.
  return ch2Provider().getQuizQuestionById(questionId)
}

/**
 * Filter Chapter 2 key terms by concept.
 *
 * Thin remediation-compatible wrapper over the canonical key-term dataset.
 * Returns only terms whose inline concept mapping matches an ACTIVE concept;
 * retired (C-2-22) and unknown concepts return [].
 *
 * Phase 2B boundary: key terms are a study aid and are NOT part of
 * RemediationContentBundle. This helper only exposes the data; it does not
 * change 6C detection, reassessment, or outcome evaluation.
 */
export function filterKeyTermsByConcept(conceptId: ConceptId): readonly Chapter2KeyTerm[] {
  return ch2Provider().filterKeyTermsByConcept(conceptId) as readonly Chapter2KeyTerm[]
}

/**
 * Check if a concept has sufficient unseen questions for reassessment.
 *
 * This is a read-only check — the authoritative check is performed
 * by the exclusion engine during selectAndReserveQuestion().
 */
export function getConceptQuestionCount(conceptId: ConceptId): number {
  return ch2Provider().getConceptQuestionCount(conceptId)
}
