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

import { detectAllConceptGaps as detectAllChapter1ConceptGaps } from '@/lib/chapter-1-concepts/detection'
import { chapter1ConceptFamilies } from '@/lib/chapter-1-concepts/concepts'
import { chapter1ContentConceptMappings, chapter1FlashcardConceptMappings } from '@/lib/chapter-1-concepts/mappings'

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

import { detectAllConceptGaps as detectAllChapter7ConceptGaps } from '@/lib/chapter-7-concepts/detection'
import { chapter7ConceptFamilies } from '@/lib/chapter-7-concepts/concepts'
import { chapter7ContentConceptMappings, chapter7FlashcardConceptMappings } from '@/lib/chapter-7-concepts/mappings'

import { detectAllConceptGaps as detectAllChapter8ConceptGaps } from '@/lib/chapter-8-concepts/detection'
import { chapter8ConceptFamilies } from '@/lib/chapter-8-concepts/concepts'
import { chapter8ContentConceptMappings, chapter8FlashcardConceptMappings } from '@/lib/chapter-8-concepts/mappings'

import { detectAllConceptGaps as detectAllChapter9ConceptGaps } from '@/lib/chapter-9-concepts/detection'
import { chapter9ConceptFamilies } from '@/lib/chapter-9-concepts/concepts'
import { chapter9ContentConceptMappings, chapter9FlashcardConceptMappings } from '@/lib/chapter-9-concepts/mappings'

import { detectAllConceptGaps as detectAllChapter10ConceptGaps } from '@/lib/chapter-10-concepts/detection'
import { chapter10ConceptFamilies } from '@/lib/chapter-10-concepts/concepts'
import { chapter10ContentConceptMappings, chapter10FlashcardConceptMappings } from '@/lib/chapter-10-concepts/mappings'

import { detectAllConceptGaps as detectAllChapter11ConceptGaps } from '@/lib/chapter-11-concepts/detection'
import { chapter11ConceptFamilies } from '@/lib/chapter-11-concepts/concepts'
import { chapter11ContentConceptMappings, chapter11FlashcardConceptMappings } from '@/lib/chapter-11-concepts/mappings'

import { detectAllConceptGaps as detectAllChapter12ConceptGaps } from '@/lib/chapter-12-concepts/detection'
import { chapter12ConceptFamilies } from '@/lib/chapter-12-concepts/concepts'
import { chapter12FlashcardConceptMappings, chapter12RemediationContentConceptMappings } from '@/lib/chapter-12-concepts/mappings'

import { detectAllConceptGaps as detectAllChapter13ConceptGaps } from '@/lib/chapter-13-concepts/detection'
import { chapter13ConceptFamilies } from '@/lib/chapter-13-concepts/concepts'
import { chapter13ContentConceptMappings, chapter13FlashcardConceptMappings } from '@/lib/chapter-13-concepts/mappings'

import { detectAllConceptGaps as detectAllChapter14ConceptGaps } from '@/lib/chapter-14-concepts/detection'
import { chapter14ConceptFamilies } from '@/lib/chapter-14-concepts/concepts'
import { chapter14ContentConceptMappings, chapter14FlashcardConceptMappings } from '@/lib/chapter-14-concepts/mappings'

import { detectAllConceptGaps as detectAllChapter15ConceptGaps } from '@/lib/chapter-15-concepts/detection'
import { chapter15ConceptFamilies } from '@/lib/chapter-15-concepts/concepts'
import { chapter15ContentConceptMappings, chapter15FlashcardConceptMappings } from '@/lib/chapter-15-concepts/mappings'

import { detectAllConceptGaps as detectAllChapter16ConceptGaps } from '@/lib/chapter-16-concepts/detection'
import { chapter16ConceptFamilies } from '@/lib/chapter-16-concepts/concepts'
import { chapter16ContentConceptMappings, chapter16FlashcardConceptMappings } from '@/lib/chapter-16-concepts/mappings'

import { detectAllConceptGaps as detectAllChapter17ConceptGaps } from '@/lib/chapter-17-concepts/detection'
import { chapter17ConceptFamilies } from '@/lib/chapter-17-concepts/concepts'
import { chapter17ContentConceptMappings, chapter17FlashcardConceptMappings } from '@/lib/chapter-17-concepts/mappings'

import { detectAllConceptGaps as detectAllChapter18ConceptGaps } from '@/lib/chapter-18-concepts/detection'
import { chapter18ConceptFamilies } from '@/lib/chapter-18-concepts/concepts'
import { chapter18RemediationContentConceptMappings, chapter18FlashcardConceptMappings } from '@/lib/chapter-18-concepts/mappings'

import { detectAllConceptGaps as detectAllChapter19ConceptGaps } from '@/lib/chapter-19-concepts/detection'
import { chapter19ConceptFamilies } from '@/lib/chapter-19-concepts/concepts'
import { chapter19RemediationContentConceptMappings, chapter19FlashcardConceptMappings } from '@/lib/chapter-19-concepts/mappings'

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
// Chapter 1 Provider (G6)
// ───────────────────────────────────────────────

const chapter1ContentMappingsProjected = chapter1ContentConceptMappings.map((m) => ({
  contentBlockId: m.contentBlockId,
  conceptId: m.conceptFamilyId as string,
}))
const chapter1FlashcardMappingsProjected = chapter1FlashcardConceptMappings.map((m) => ({
  flashcardId: m.flashcardId as string,
  conceptId: m.conceptFamilyId as string,
}))

const chapter1Provider: ChapterDetectionProvider = {
  chapterId: 'ch-1',
  detectAll(attempts) {
    const out = new Map<ConceptId, ConceptDetectionResult>()
    for (const [conceptId, result] of detectAllChapter1ConceptGaps(attempts)) out.set(conceptId, result)
    return out
  },
  getConceptName(conceptId) {
    return chapter1ConceptFamilies.find((c) => c.id === conceptId)?.name ?? conceptId
  },
  buildAssignmentsForConcept(conceptId) {
    return buildAssignments(conceptId, chapter1ContentMappingsProjected, chapter1FlashcardMappingsProjected)
  },
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
// Chapter 7 Provider (G6 registration repair)
// ───────────────────────────────────────────────

const chapter7ContentMappingsProjected = chapter7ContentConceptMappings.map((m) => ({
  contentBlockId: m.contentBlockId,
  conceptId: m.conceptFamilyId as string,
}))
const chapter7FlashcardMappingsProjected = chapter7FlashcardConceptMappings.map((m) => ({
  flashcardId: m.flashcardId as string,
  conceptId: m.conceptFamilyId as string,
}))

const chapter7Provider: ChapterDetectionProvider = {
  chapterId: 'ch-7',
  detectAll(attempts) {
    const out = new Map<ConceptId, ConceptDetectionResult>()
    for (const [conceptId, result] of detectAllChapter7ConceptGaps(attempts)) out.set(conceptId, result)
    return out
  },
  getConceptName(conceptId) {
    return chapter7ConceptFamilies.find((c) => c.id === conceptId)?.name ?? conceptId
  },
  buildAssignmentsForConcept(conceptId) {
    return buildAssignments(conceptId, chapter7ContentMappingsProjected, chapter7FlashcardMappingsProjected)
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
// Chapter 9 Provider (G3)
// ───────────────────────────────────────────────

const chapter9ContentMappingsProjected = chapter9ContentConceptMappings.map((m) => ({
  contentBlockId: m.contentBlockId,
  conceptId: m.conceptFamilyId as string,
}))
const chapter9FlashcardMappingsProjected = chapter9FlashcardConceptMappings.map((m) => ({
  flashcardId: m.flashcardId,
  conceptId: m.conceptFamilyId as string,
}))

const chapter9Provider: ChapterDetectionProvider = {
  chapterId: 'ch-9',

  detectAll(attempts) {
    const out = new Map<ConceptId, ConceptDetectionResult>()
    for (const [conceptId, result] of detectAllChapter9ConceptGaps(attempts)) {
      out.set(conceptId, result)
    }
    return out
  },

  getConceptName(conceptId) {
    return chapter9ConceptFamilies.find((c) => c.id === conceptId)?.name ?? conceptId
  },

  buildAssignmentsForConcept(conceptId) {
    return buildAssignments(
      conceptId,
      chapter9ContentMappingsProjected,
      chapter9FlashcardMappingsProjected,
    )
  },
}


const chapter10ContentMappingsProjected = chapter10ContentConceptMappings.map((m) => ({
  contentBlockId: m.contentBlockId,
  conceptId: m.conceptFamilyId as string,
}))
const chapter10FlashcardMappingsProjected = chapter10FlashcardConceptMappings.map((m) => ({
  flashcardId: m.flashcardId as string,
  conceptId: m.conceptFamilyId as string,
}))

const chapter10Provider: ChapterDetectionProvider = {
  chapterId: 'ch-10',
  detectAll(attempts) {
    const out = new Map<ConceptId, ConceptDetectionResult>()
    for (const [conceptId, result] of detectAllChapter10ConceptGaps(attempts)) out.set(conceptId, result)
    return out
  },
  getConceptName(conceptId) {
    return chapter10ConceptFamilies.find((concept) => concept.id === conceptId)?.name ?? conceptId
  },
  buildAssignmentsForConcept(conceptId) {
    return buildAssignments(conceptId, chapter10ContentMappingsProjected, chapter10FlashcardMappingsProjected)
  },
}


const chapter11ContentMappingsProjected = chapter11ContentConceptMappings.map((m) => ({
  contentBlockId: m.contentBlockId,
  conceptId: m.conceptFamilyId as string,
}))
const chapter11FlashcardMappingsProjected = chapter11FlashcardConceptMappings.map((m) => ({
  flashcardId: m.flashcardId as string,
  conceptId: m.conceptFamilyId as string,
}))

const chapter11Provider: ChapterDetectionProvider = {
  chapterId: 'ch-11',
  detectAll(attempts) {
    const out = new Map<ConceptId, ConceptDetectionResult>()
    for (const [conceptId, result] of detectAllChapter11ConceptGaps(attempts)) out.set(conceptId, result)
    return out
  },
  getConceptName(conceptId) {
    return chapter11ConceptFamilies.find((concept) => concept.id === conceptId)?.name ?? conceptId
  },
  buildAssignmentsForConcept(conceptId) {
    return buildAssignments(conceptId, chapter11ContentMappingsProjected, chapter11FlashcardMappingsProjected)
  },
}


const chapter12ContentMappingsProjected = chapter12RemediationContentConceptMappings.map((m) => ({
  contentBlockId: m.contentBlockId,
  conceptId: m.conceptFamilyId as string,
}))
const chapter12FlashcardMappingsProjected = chapter12FlashcardConceptMappings.map((m) => ({
  flashcardId: m.flashcardId as string,
  conceptId: m.conceptFamilyId as string,
}))

const chapter12Provider: ChapterDetectionProvider = {
  chapterId: 'ch-12',
  detectAll(attempts) {
    const out = new Map<ConceptId, ConceptDetectionResult>()
    for (const [conceptId, result] of detectAllChapter12ConceptGaps(attempts)) out.set(conceptId, result)
    return out
  },
  getConceptName(conceptId) {
    return chapter12ConceptFamilies.find((concept) => concept.id === conceptId)?.name ?? conceptId
  },
  buildAssignmentsForConcept(conceptId) {
    return buildAssignments(conceptId, chapter12ContentMappingsProjected, chapter12FlashcardMappingsProjected)
  },
}

const chapter13ContentMappingsProjected = chapter13ContentConceptMappings.map((mapping) => ({
  contentBlockId: mapping.contentBlockId,
  conceptId: mapping.conceptFamilyId as string,
}))
const chapter13FlashcardMappingsProjected = chapter13FlashcardConceptMappings.map((mapping) => ({
  flashcardId: mapping.flashcardId as string,
  conceptId: mapping.conceptFamilyId as string,
}))

const chapter13Provider: ChapterDetectionProvider = {
  chapterId: 'ch-13',
  detectAll(attempts) {
    const out = new Map<ConceptId, ConceptDetectionResult>()
    for (const [conceptId, result] of detectAllChapter13ConceptGaps(attempts)) out.set(conceptId, result)
    return out
  },
  getConceptName(conceptId) {
    return chapter13ConceptFamilies.find((concept) => concept.id === conceptId)?.name ?? conceptId
  },
  buildAssignmentsForConcept(conceptId) {
    return buildAssignments(conceptId, chapter13ContentMappingsProjected, chapter13FlashcardMappingsProjected)
  },
}


const chapter14ContentMappingsProjected = chapter14ContentConceptMappings.map((mapping) => ({
  contentBlockId: mapping.contentBlockId,
  conceptId: mapping.conceptFamilyId as string,
}))
const chapter14FlashcardMappingsProjected = chapter14FlashcardConceptMappings.map((mapping) => ({
  flashcardId: mapping.flashcardId as string,
  conceptId: mapping.conceptFamilyId as string,
}))

const chapter14Provider: ChapterDetectionProvider = {
  chapterId: 'ch-14',
  detectAll(attempts) {
    const out = new Map<ConceptId, ConceptDetectionResult>()
    for (const [conceptId, result] of detectAllChapter14ConceptGaps(attempts)) out.set(conceptId, result)
    return out
  },
  getConceptName(conceptId) {
    return chapter14ConceptFamilies.find((concept) => concept.id === conceptId)?.name ?? conceptId
  },
  buildAssignmentsForConcept(conceptId) {
    return buildAssignments(conceptId, chapter14ContentMappingsProjected, chapter14FlashcardMappingsProjected)
  },
}

const chapter15ContentMappingsProjected = chapter15ContentConceptMappings.map((mapping) => ({
  contentBlockId: mapping.contentBlockId,
  conceptId: mapping.conceptFamilyId as string,
}))
const chapter15FlashcardMappingsProjected = chapter15FlashcardConceptMappings.map((mapping) => ({
  flashcardId: mapping.flashcardId as string,
  conceptId: mapping.conceptFamilyId as string,
}))

const chapter15Provider: ChapterDetectionProvider = {
  chapterId: 'ch-15',
  detectAll(attempts) {
    const out = new Map<ConceptId, ConceptDetectionResult>()
    for (const [conceptId, result] of detectAllChapter15ConceptGaps(attempts)) out.set(conceptId, result)
    return out
  },
  getConceptName(conceptId) {
    return chapter15ConceptFamilies.find((concept) => concept.id === conceptId)?.name ?? conceptId
  },
  buildAssignmentsForConcept(conceptId) {
    return buildAssignments(conceptId, chapter15ContentMappingsProjected, chapter15FlashcardMappingsProjected)
  },
}

const chapter17ContentMappingsProjected = chapter17ContentConceptMappings.map((mapping) => ({
  contentBlockId: mapping.contentBlockId,
  conceptId: mapping.conceptFamilyId as string,
}))
const chapter17FlashcardMappingsProjected = chapter17FlashcardConceptMappings.map((mapping) => ({
  flashcardId: mapping.flashcardId as string,
  conceptId: mapping.conceptFamilyId as string,
}))

const chapter17Provider: ChapterDetectionProvider = {
  chapterId: 'ch-17',
  detectAll(attempts) {
    const out = new Map<ConceptId, ConceptDetectionResult>()
    for (const [conceptId, result] of detectAllChapter17ConceptGaps(attempts)) out.set(conceptId, result)
    return out
  },
  getConceptName(conceptId) {
    return chapter17ConceptFamilies.find((concept) => concept.id === conceptId)?.name ?? conceptId
  },
  buildAssignmentsForConcept(conceptId) {
    return buildAssignments(conceptId, chapter17ContentMappingsProjected, chapter17FlashcardMappingsProjected)
  },
}


const chapter18ContentMappingsProjected = chapter18RemediationContentConceptMappings.map((mapping) => ({
  contentBlockId: mapping.contentBlockId,
  conceptId: mapping.conceptFamilyId as string,
}))
const chapter18FlashcardMappingsProjected = chapter18FlashcardConceptMappings.map((mapping) => ({
  flashcardId: mapping.flashcardId as string,
  conceptId: mapping.conceptFamilyId as string,
}))

const chapter18Provider: ChapterDetectionProvider = {
  chapterId: 'ch-18',
  detectAll(attempts) {
    const out = new Map<ConceptId, ConceptDetectionResult>()
    for (const [conceptId, result] of detectAllChapter18ConceptGaps(attempts)) out.set(conceptId, result)
    return out
  },
  getConceptName(conceptId) {
    return chapter18ConceptFamilies.find((concept) => concept.id === conceptId)?.name ?? conceptId
  },
  buildAssignmentsForConcept(conceptId) {
    return buildAssignments(conceptId, chapter18ContentMappingsProjected, chapter18FlashcardMappingsProjected)
  },
}



const chapter19ContentMappingsProjected = chapter19RemediationContentConceptMappings.map((mapping) => ({
  contentBlockId: mapping.contentBlockId,
  conceptId: mapping.conceptFamilyId as string,
}))
const chapter19FlashcardMappingsProjected = chapter19FlashcardConceptMappings.map((mapping) => ({
  flashcardId: mapping.flashcardId as string,
  conceptId: mapping.conceptFamilyId as string,
}))

const chapter19Provider: ChapterDetectionProvider = {
  chapterId: 'ch-19',
  detectAll(attempts) {
    const out = new Map<ConceptId, ConceptDetectionResult>()
    for (const [conceptId, result] of detectAllChapter19ConceptGaps(attempts)) {
      out.set(conceptId, result)
    }
    return out
  },
  getConceptName(conceptId) {
    return chapter19ConceptFamilies.find((concept) => concept.id === conceptId)?.name ?? conceptId
  },
  buildAssignmentsForConcept(conceptId) {
    return buildAssignments(
      conceptId,
      chapter19ContentMappingsProjected,
      chapter19FlashcardMappingsProjected,
    )
  },
}

const chapter16ContentMappingsProjected = chapter16ContentConceptMappings.map((mapping) => ({
  contentBlockId: mapping.contentBlockId,
  conceptId: mapping.conceptFamilyId as string,
}))
const chapter16FlashcardMappingsProjected = chapter16FlashcardConceptMappings.map((mapping) => ({
  flashcardId: mapping.flashcardId as string,
  conceptId: mapping.conceptFamilyId as string,
}))

const chapter16Provider: ChapterDetectionProvider = {
  chapterId: 'ch-16',
  detectAll(attempts) {
    const out = new Map<ConceptId, ConceptDetectionResult>()
    for (const [conceptId, result] of detectAllChapter16ConceptGaps(attempts)) out.set(conceptId, result)
    return out
  },
  getConceptName(conceptId) {
    return chapter16ConceptFamilies.find((concept) => concept.id === conceptId)?.name ?? conceptId
  },
  buildAssignmentsForConcept(conceptId) {
    return buildAssignments(conceptId, chapter16ContentMappingsProjected, chapter16FlashcardMappingsProjected)
  },
}

// ───────────────────────────────────────────────
// Registry
// ───────────────────────────────────────────────

const providers = new Map<ChapterId, ChapterDetectionProvider>([
  ['ch-1', chapter1Provider],
  ['ch-2', chapter2Provider],
  ['ch-3', chapter3Provider],
  ['ch-4', chapter4Provider],
  ['ch-5', chapter5Provider],
  ['ch-6', chapter6Provider],
  ['ch-7', chapter7Provider],
  ['ch-8', chapter8Provider],
  ['ch-9', chapter9Provider],
  ['ch-10', chapter10Provider],
  ['ch-11', chapter11Provider],
  ['ch-12', chapter12Provider],
  ['ch-13', chapter13Provider],
  ['ch-14', chapter14Provider],
  ['ch-15', chapter15Provider],
  ['ch-16', chapter16Provider],
  ['ch-17', chapter17Provider],
  ['ch-18', chapter18Provider],
  ['ch-19', chapter19Provider],
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
