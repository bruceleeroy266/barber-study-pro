/**
 * Chapter Registry — Concept Detection Providers (C3-2)
 *
 * Registry/provider architecture that lets the generic detection/orchestration
 * pipeline resolve a chapter's canonical detection binding by chapter ID
 * instead of hard-coding `chapterId === 'ch-2'` gates.
 *
 * Chapters register a ChapterDetectionProvider that:
 *   - runs concept-gap detection over that chapter's locked concept runtime
 *     (shared engine + chapter binding)
 *   - builds targeted remediation assignments from the chapter's canonical
 *     content/flashcard mappings (projected — never duplicated or restated)
 *   - resolves concept display names
 *
 * Client-safe: imports only pure data modules and the shared detection
 * engine. No server-only dependencies (no Supabase, no orchestrator), so
 * QuizClient can consult isConceptDetectionSupported in the browser.
 *
 * Scope: detection → remediation-cycle handoff. Remediation content serving
 * and reassessment are C3-3; escalation/instructor behavior is C3-4 and is
 * deliberately NOT part of this registry.
 */

import type { QuizAttempt } from '@/types'
import type { ChapterId, ConceptId } from '@/lib/reassessment/types'
import type { ConceptDetectionResult } from '@/lib/concept-detection/engine'

import { detectAllConceptGaps as detectAllChapter2ConceptGaps } from '@/lib/chapter-2-concepts/detection'
import { chapter2Concepts } from '@/lib/chapter-2-concepts/concepts'
import {
  chapter2ContentMappings,
  chapter2FlashcardMappings,
} from '@/lib/chapter-2-concepts/mappings'

import { detectAllConceptGaps as detectAllChapter3ConceptGaps } from '@/lib/chapter-3-concepts/detection'
import { chapter3ConceptFamilies } from '@/lib/chapter-3-concepts/concepts'
import {
  chapter3ContentConceptMappings,
  chapter3FlashcardConceptMappings,
} from '@/lib/chapter-3-concepts/mappings'

import { detectAllConceptGaps as detectAllChapter4ConceptGaps } from '@/lib/chapter-4-concepts/detection'
import { chapter4ConceptFamilies } from '@/lib/chapter-4-concepts/concepts'
import {
  chapter4ContentConceptMappings,
  chapter4FlashcardConceptMappings,
} from '@/lib/chapter-4-concepts/mappings'

import { detectAllConceptGaps as detectAllChapter5ConceptGaps } from '@/lib/chapter-5-concepts/detection'
import { chapter5ConceptFamilies } from '@/lib/chapter-5-concepts/concepts'
import { chapter5ContentConceptMappings, chapter5FlashcardConceptMappings } from '@/lib/chapter-5-concepts/mappings'

import { detectAllConceptGaps as detectAllChapter6ConceptGaps } from '@/lib/chapter-6-concepts/detection'
import { chapter6ConceptFamilies } from '@/lib/chapter-6-concepts/concepts'
import { chapter6ContentConceptMappings, chapter6FlashcardConceptMappings } from '@/lib/chapter-6-concepts/mappings'

import { detectAllConceptGaps as detectAllChapter8ConceptGaps } from '@/lib/chapter-8-concepts/detection'
import { chapter8ConceptFamilies } from '@/lib/chapter-8-concepts/concepts'
import { chapter8ContentConceptMappings, chapter8FlashcardConceptMappings } from '@/lib/chapter-8-concepts/mappings'

// ───────────────────────────────────────────────
// Provider Contract
// ───────────────────────────────────────────────

/** A targeted-review assignment built from canonical chapter mappings. */
export interface ChapterRemediationAssignment {
  assignmentType: 'content_block' | 'flashcard'
  assetId: string
  priority: number
  isPrimary: boolean
}

/**
 * A chapter's detection handoff provider. One per chapter that supports
 * concept-level detection.
 */
export interface ChapterDetectionProvider {
  readonly chapterId: ChapterId

  /**
   * Run concept-gap detection over ALL of the user's completed quiz attempts.
   * Returns results keyed by plain-string concept ID (registry-wide type).
   */
  detectAll(attempts: QuizAttempt[]): Map<ConceptId, ConceptDetectionResult>

  /** Display name for a concept, or the ID itself when unknown. */
  getConceptName(conceptId: ConceptId): string

  /**
   * Build targeted-review assignments for a concept from the chapter's
   * canonical content-block and flashcard mappings. Content blocks are
   * primary; flashcards are supplementary; priority is sequential.
   */
  buildAssignmentsForConcept(conceptId: ConceptId): ChapterRemediationAssignment[]
}

// ───────────────────────────────────────────────
// Shared assignment builder (canonical-mapping driven)
// ───────────────────────────────────────────────

function buildAssignments(
  conceptId: ConceptId,
  contentMappings: readonly { contentBlockId: string; conceptId: string }[],
  flashcardMappings: readonly { flashcardId: string; conceptId: string }[],
): ChapterRemediationAssignment[] {
  const assignments: ChapterRemediationAssignment[] = []
  let priority = 1

  for (const mapping of contentMappings) {
    if (mapping.conceptId !== conceptId) continue
    assignments.push({
      assignmentType: 'content_block',
      assetId: mapping.contentBlockId,
      priority: priority++,
      isPrimary: true,
    })
  }

  for (const mapping of flashcardMappings) {
    if (mapping.conceptId !== conceptId) continue
    assignments.push({
      assignmentType: 'flashcard',
      assetId: mapping.flashcardId,
      priority: priority++,
      isPrimary: false,
    })
  }

  return assignments
}

// ───────────────────────────────────────────────
// Chapter 2 Provider
// ───────────────────────────────────────────────

const chapter2Provider: ChapterDetectionProvider = {
  chapterId: 'ch-2',

  detectAll(attempts) {
    const out = new Map<ConceptId, ConceptDetectionResult>()
    for (const [conceptId, result] of detectAllChapter2ConceptGaps(attempts)) {
      out.set(conceptId, result)
    }
    return out
  },

  getConceptName(conceptId) {
    return chapter2Concepts.find((c) => c.id === conceptId)?.name ?? conceptId
  },

  buildAssignmentsForConcept(conceptId) {
    return buildAssignments(conceptId, chapter2ContentMappings, chapter2FlashcardMappings)
  },
}

// ───────────────────────────────────────────────
// Chapter 3 Provider
// ───────────────────────────────────────────────

// Project the canonical Ch3 mappings (conceptFamilyId field) into the shared
// assignment-builder shape. mappings.ts remains the single source of truth.
const chapter3ContentMappingsProjected = chapter3ContentConceptMappings.map((m) => ({
  contentBlockId: m.contentBlockId,
  conceptId: m.conceptFamilyId as string,
}))
const chapter3FlashcardMappingsProjected = chapter3FlashcardConceptMappings.map((m) => ({
  flashcardId: m.flashcardId,
  conceptId: m.conceptFamilyId as string,
}))

const chapter3Provider: ChapterDetectionProvider = {
  chapterId: 'ch-3',

  detectAll(attempts) {
    const out = new Map<ConceptId, ConceptDetectionResult>()
    for (const [conceptId, result] of detectAllChapter3ConceptGaps(attempts)) {
      out.set(conceptId, result)
    }
    return out
  },

  getConceptName(conceptId) {
    return chapter3ConceptFamilies.find((c) => c.id === conceptId)?.name ?? conceptId
  },

  buildAssignmentsForConcept(conceptId) {
    return buildAssignments(
      conceptId,
      chapter3ContentMappingsProjected,
      chapter3FlashcardMappingsProjected,
    )
  },
}

// ───────────────────────────────────────────────
// Chapter 4 Provider (C4-2)
// ───────────────────────────────────────────────

// Project the canonical Ch4 mappings (conceptFamilyId field) into the shared
// assignment-builder shape. mappings.ts remains the single source of truth.
const chapter4ContentMappingsProjected = chapter4ContentConceptMappings.map((m) => ({
  contentBlockId: m.contentBlockId,
  conceptId: m.conceptFamilyId as string,
}))
const chapter4FlashcardMappingsProjected = chapter4FlashcardConceptMappings.map((m) => ({
  flashcardId: m.flashcardId,
  conceptId: m.conceptFamilyId as string,
}))

const chapter4Provider: ChapterDetectionProvider = {
  chapterId: 'ch-4',

  detectAll(attempts) {
    const out = new Map<ConceptId, ConceptDetectionResult>()
    for (const [conceptId, result] of detectAllChapter4ConceptGaps(attempts)) {
      out.set(conceptId, result)
    }
    return out
  },

  getConceptName(conceptId) {
    return chapter4ConceptFamilies.find((c) => c.id === conceptId)?.name ?? conceptId
  },

  buildAssignmentsForConcept(conceptId) {
    return buildAssignments(
      conceptId,
      chapter4ContentMappingsProjected,
      chapter4FlashcardMappingsProjected,
    )
  },
}

// ───────────────────────────────────────────────
// Chapter 5 Provider (C5-3)
// ───────────────────────────────────────────────

const chapter5ContentMappingsProjected = chapter5ContentConceptMappings.map((m) => ({
  contentBlockId: m.contentBlockId,
  conceptId: m.conceptFamilyId as string,
}))
const chapter5FlashcardMappingsProjected = chapter5FlashcardConceptMappings.map((m) => ({
  flashcardId: m.flashcardId,
  conceptId: m.conceptFamilyId as string,
}))

const chapter5Provider: ChapterDetectionProvider = {
  chapterId: 'ch-5',

  detectAll(attempts) {
    const out = new Map<ConceptId, ConceptDetectionResult>()
    for (const [conceptId, result] of detectAllChapter5ConceptGaps(attempts)) {
      out.set(conceptId, result)
    }
    return out
  },

  getConceptName(conceptId) {
    return chapter5ConceptFamilies.find((c) => c.id === conceptId)?.name ?? conceptId
  },

  buildAssignmentsForConcept(conceptId) {
    return buildAssignments(
      conceptId,
      chapter5ContentMappingsProjected,
      chapter5FlashcardMappingsProjected,
    )
  },
}


// ───────────────────────────────────────────────
// Chapter 6 Provider (C6-5)
// ───────────────────────────────────────────────

const chapter6ContentMappingsProjected = chapter6ContentConceptMappings.map((m) => ({
  contentBlockId: m.contentBlockId,
  conceptId: m.conceptFamilyId as string,
}))
const chapter6FlashcardMappingsProjected = chapter6FlashcardConceptMappings.map((m) => ({
  flashcardId: m.flashcardId,
  conceptId: m.conceptFamilyId as string,
}))

const chapter6Provider: ChapterDetectionProvider = {
  chapterId: 'ch-6',

  detectAll(attempts) {
    const out = new Map<ConceptId, ConceptDetectionResult>()
    for (const [conceptId, result] of detectAllChapter6ConceptGaps(attempts)) {
      out.set(conceptId, result)
    }
    return out
  },

  getConceptName(conceptId) {
    return chapter6ConceptFamilies.find((c) => c.id === conceptId)?.name ?? conceptId
  },

  buildAssignmentsForConcept(conceptId) {
    return buildAssignments(
      conceptId,
      chapter6ContentMappingsProjected,
      chapter6FlashcardMappingsProjected,
    )
  },
}


// ───────────────────────────────────────────────
// Chapter 8 Provider (C8-7)
// ───────────────────────────────────────────────

const chapter8ContentMappingsProjected = chapter8ContentConceptMappings.map((m) => ({
  contentBlockId: m.contentBlockId,
  conceptId: m.conceptFamilyId as string,
}))
const chapter8FlashcardMappingsProjected = chapter8FlashcardConceptMappings.map((m) => ({
  flashcardId: m.flashcardId,
  conceptId: m.conceptFamilyId as string,
}))

const chapter8Provider: ChapterDetectionProvider = {
  chapterId: 'ch-8',

  detectAll(attempts) {
    const out = new Map<ConceptId, ConceptDetectionResult>()
    for (const [conceptId, result] of detectAllChapter8ConceptGaps(attempts)) {
      out.set(conceptId, result)
    }
    return out
  },

  getConceptName(conceptId) {
    return chapter8ConceptFamilies.find((c) => c.id === conceptId)?.name ?? conceptId
  },

  buildAssignmentsForConcept(conceptId) {
    return buildAssignments(
      conceptId,
      chapter8ContentMappingsProjected,
      chapter8FlashcardMappingsProjected,
    )
  },
}

// ───────────────────────────────────────────────
// Registry
// ───────────────────────────────────────────────

const providers = new Map<ChapterId, ChapterDetectionProvider>([
  ['ch-2', chapter2Provider],
  ['ch-3', chapter3Provider],
  ['ch-4', chapter4Provider],
  ['ch-5', chapter5Provider],
  ['ch-6', chapter6Provider],
  ['ch-8', chapter8Provider],
])

/**
 * Resolve the detection provider for a chapter, or undefined when the
 * chapter has no concept-detection support.
 */
export function getChapterDetectionProvider(
  chapterId: ChapterId,
): ChapterDetectionProvider | undefined {
  return providers.get(chapterId)
}

/**
 * Whether a chapter supports concept-level detection (and therefore the
 * quiz-completion → detection handoff). Replaces the hard-coded
 * `chapterId === 'ch-2'` trigger check in QuizClient.
 */
export function isConceptDetectionSupported(chapterId: string): boolean {
  return providers.has(chapterId)
}
