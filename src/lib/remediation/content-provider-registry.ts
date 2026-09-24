/**
 * Remediation Content Provider Registry (C3-3 Stage 1)
 *
 * Chapter-aware provider/registry for the remediation content-serving layer.
 * Replaces Chapter-2-only assumptions with per-chapter providers that serve
 * concept-targeted content from each chapter's CANONICAL assets. Nothing is
 * duplicated or restated — providers project from the canonical concept
 * runtimes (chapter-2-concepts/, chapter-3-concepts/).
 *
 * Fail-closed: chapters without a registered provider resolve to undefined.
 *
 * Client-safe: imports pure data modules only (no Supabase, no server-only
 * dependencies).
 */

import type { ChapterId } from '@/lib/reassessment/types'
import type { ChapterSection } from '@/lib/chapter-content'
import type { Flashcard, QuizQuestion } from '@/types'
import type { ChapterKeyTerm } from '@/lib/chapter-2-key-terms'
import type { RemediationContentBundle } from './student-service'

import {
  chapter2ContentMappings,
  chapter2FlashcardMappings,
  chapter2QuizQuestionMappings,
} from '@/lib/chapter-2-concepts/mappings'
import { chapter2Concepts, ACTIVE_CONCEPT_IDS } from '@/lib/chapter-2-concepts/concepts'
import { chapter2PremiumFlashcards } from '@/lib/chapter-2-premium-flashcards'
import { chapter2KeyTerms } from '@/lib/chapter-2-key-terms'
import { chapter2PremiumQuizQuestions } from '@/lib/chapter-2-premium-quiz'
import { chapter2ReassessmentQuestions } from '@/lib/chapter-2-reassessment-questions'

import {
  chapter3ContentConceptMappings,
  chapter3FlashcardConceptMappings,
  chapter3QuizQuestionConceptMappings,
} from '@/lib/chapter-3-concepts/mappings'
import {
  CHAPTER3_CONCEPT_FAMILY_IDS,
  chapter3ConceptFamilies,
} from '@/lib/chapter-3-concepts/concepts'
import { chapter3PremiumFlashcards } from '@/lib/chapter-3-premium-flashcards'
import { chapter3KeyTerms } from '@/lib/chapter-3-key-terms'
import { chapter3PremiumQuizQuestions } from '@/lib/chapter-3-premium-quiz'
import { chapter3ReassessmentQuestions } from '@/lib/chapter-3-reassessment-questions'

import {
  chapter4ContentConceptMappings,
  chapter4FlashcardConceptMappings,
  chapter4QuizQuestionConceptMappings,
} from '@/lib/chapter-4-concepts/mappings'
import {
  ACTIVE_CHAPTER4_CONCEPT_FAMILY_IDS,
  chapter4ConceptFamilies,
} from '@/lib/chapter-4-concepts/concepts'
import { chapter4PremiumFlashcards } from '@/lib/chapter-4-premium-flashcards'
import { chapter4PremiumQuizQuestions } from '@/lib/chapter-4-premium-quiz'
import { chapter4ReassessmentQuestions } from '@/lib/chapter-4-reassessment-questions'

import {
  chapter5ContentConceptMappings,
  chapter5FlashcardConceptMappings,
  chapter5QuizQuestionConceptMappings,
  chapter5ReassessmentQuestionConceptMappings,
} from '@/lib/chapter-5-concepts/mappings'
import {
  ACTIVE_CHAPTER5_CONCEPT_FAMILY_IDS,
  chapter5ConceptFamilies,
} from '@/lib/chapter-5-concepts/concepts'
import { chapter5PremiumFlashcards } from '@/lib/chapter-5-premium-flashcards'
import { chapter5PremiumQuizQuestions } from '@/lib/chapter-5-premium-quiz'
import { chapter5ReassessmentQuestions } from '@/lib/chapter-5-reassessment-questions'

import {
  chapter6ContentConceptMappings,
  chapter6FlashcardConceptMappings,
  chapter6QuizQuestionConceptMappings,
  chapter6ReassessmentQuestionConceptMappings,
} from '@/lib/chapter-6-concepts/mappings'
import { ACTIVE_CHAPTER6_CONCEPT_FAMILY_IDS, chapter6ConceptFamilies } from '@/lib/chapter-6-concepts/concepts'
import { chapter6PremiumFlashcards } from '@/lib/chapter-6-premium-flashcards'
import { chapter6PremiumQuizQuestions } from '@/lib/chapter-6-premium-quiz'
import { chapter6ReassessmentQuestions } from '@/lib/chapter-6-reassessment-questions'

import { getChapterContent } from '@/lib/chapter-content'

// ───────────────────────────────────────────────
// Provider Contract
// ───────────────────────────────────────────────

/**
 * A chapter's remediation content provider. One per chapter that supports
 * concept-targeted remediation content serving.
 */
export interface ChapterRemediationContentProvider {
  readonly chapterId: ChapterId

  /** Display name for a concept ('Unknown Topic' when unknown). */
  getConceptName(conceptId: string): string

  /** Content block IDs mapped to a concept (primary + secondary). */
  getContentBlockIdsForConcept(conceptId: string): string[]

  /** Flashcard IDs mapped to a concept (primary + secondary). */
  getFlashcardIdsForConcept(conceptId: string): string[]

  /** Chapter content sections mapped to a concept (structure/order preserved). */
  filterContentByConcept(conceptId: string): ChapterSection[]

  /** ACTIVE flashcards mapped to a concept. Inactive/enrichment/retired cards never leak. */
  filterFlashcardsByConcept(conceptId: string): Flashcard[]

  /** Concept-filtered bundle with material-sufficiency flag. */
  buildRemediationContentBundle(conceptId: string): RemediationContentBundle

  /** Question lookup across the chapter's initial + reassessment banks. */
  getQuizQuestionById(questionId: string): QuizQuestion | null

  /** Key terms for a concept ([] for retired/unknown concepts). */
  filterKeyTermsByConcept(conceptId: string): readonly ChapterKeyTerm[]

  /** Count of questions mapped to a concept (read-only pool hint). */
  getConceptQuestionCount(conceptId: string): number
}

// ───────────────────────────────────────────────
// Shared helpers
// ───────────────────────────────────────────────

function filterSectionsByMappedBlockIds(
  chapterNumber: number,
  mappedBlockIds: Set<string>,
): ChapterSection[] {
  const chapterContent = getChapterContent(chapterNumber)
  if (!chapterContent) {
    return []
  }

  return chapterContent.sections.filter((section) => {
    if (mappedBlockIds.has(section.id)) {
      return true
    }
    // For tabbed sections, include when any tab ID is mapped
    if (section.type === 'tabbed' && 'tabs' in section) {
      return section.tabs.some((tab: { id: string }) => mappedBlockIds.has(tab.id))
    }
    return false
  })
}

function buildBundle(
  provider: ChapterRemediationContentProvider,
  conceptId: string,
): RemediationContentBundle {
  const contentBlocks = provider.filterContentByConcept(conceptId)
  const flashcards = provider.filterFlashcardsByConcept(conceptId)
  const conceptName = provider.getConceptName(conceptId)

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

// ───────────────────────────────────────────────
// Chapter 2 Provider
// ───────────────────────────────────────────────

function getChapter2ContentBlockIds(conceptId: string): string[] {
  const blockIds: string[] = []
  for (const mapping of chapter2ContentMappings) {
    if (mapping.conceptId === conceptId) {
      blockIds.push(mapping.contentBlockId)
      continue
    }
    if (mapping.secondaryConceptIds?.includes(conceptId as never)) {
      blockIds.push(mapping.contentBlockId)
    }
  }
  return blockIds
}

function getChapter2FlashcardIds(conceptId: string): string[] {
  const flashcardIds: string[] = []
  for (const mapping of chapter2FlashcardMappings) {
    if (mapping.conceptId === conceptId) {
      flashcardIds.push(mapping.flashcardId)
      continue
    }
    if (mapping.secondaryConceptIds?.includes(conceptId as never)) {
      flashcardIds.push(mapping.flashcardId)
    }
  }
  return flashcardIds
}

const chapter2Provider: ChapterRemediationContentProvider = {
  chapterId: 'ch-2',

  getConceptName(conceptId) {
    return chapter2Concepts.find((c) => c.id === conceptId)?.name ?? 'Unknown Topic'
  },

  getContentBlockIdsForConcept: getChapter2ContentBlockIds,

  getFlashcardIdsForConcept: getChapter2FlashcardIds,

  filterContentByConcept(conceptId) {
    return filterSectionsByMappedBlockIds(
      2,
      new Set(getChapter2ContentBlockIds(conceptId)),
    )
  },

  filterFlashcardsByConcept(conceptId) {
    const mappedIds = new Set(getChapter2FlashcardIds(conceptId))
    return chapter2PremiumFlashcards.filter(
      (card) => card.is_active && mappedIds.has(card.id),
    )
  },

  buildRemediationContentBundle(conceptId) {
    return buildBundle(this, conceptId)
  },

  getQuizQuestionById(questionId) {
    return (
      chapter2PremiumQuizQuestions.find((q) => q.id === questionId) ??
      chapter2ReassessmentQuestions.find((q) => q.id === questionId) ??
      null
    )
  },

  filterKeyTermsByConcept(conceptId) {
    if (!ACTIVE_CONCEPT_IDS.includes(conceptId as never)) {
      return []
    }
    return chapter2KeyTerms.filter((term) => term.conceptId === conceptId)
  },

  getConceptQuestionCount(conceptId) {
    return chapter2QuizQuestionMappings.filter((m) => m.conceptId === conceptId).length
  },
}

// ───────────────────────────────────────────────
// Chapter 3 Provider
// ───────────────────────────────────────────────

// Project the canonical Ch3 mappings (conceptFamilyId field) into the shared
// provider shape. chapter-3-concepts/mappings.ts remains the single source
// of truth — nothing is duplicated or restated.
const chapter3ContentMappingsProjected: readonly { contentBlockId: string; conceptId: string }[] =
  chapter3ContentConceptMappings.map((m) => ({
    contentBlockId: m.contentBlockId,
    conceptId: m.conceptFamilyId as string,
  }))
const chapter3FlashcardMappingsProjected: readonly { flashcardId: string; conceptId: string }[] =
  chapter3FlashcardConceptMappings.map((m) => ({
    flashcardId: m.flashcardId as string,
    conceptId: m.conceptFamilyId as string,
  }))
const chapter3QuizMappingsProjected: readonly { questionId: string; conceptId: string }[] =
  chapter3QuizQuestionConceptMappings.map((m) => ({
    questionId: m.questionId as string,
    conceptId: m.conceptFamilyId as string,
  }))

function isChapter3ConceptFamilyId(conceptId: string): boolean {
  return (CHAPTER3_CONCEPT_FAMILY_IDS as readonly string[]).includes(conceptId)
}

const chapter3Provider: ChapterRemediationContentProvider = {
  chapterId: 'ch-3',

  getConceptName(conceptId) {
    return chapter3ConceptFamilies.find((c) => c.id === conceptId)?.name ?? 'Unknown Topic'
  },

  getContentBlockIdsForConcept(conceptId) {
    return chapter3ContentMappingsProjected
      .filter((m) => m.conceptId === conceptId)
      .map((m) => m.contentBlockId)
  },

  getFlashcardIdsForConcept(conceptId) {
    return chapter3FlashcardMappingsProjected
      .filter((m) => m.conceptId === conceptId)
      .map((m) => m.flashcardId)
  },

  filterContentByConcept(conceptId) {
    const mappedIds = new Set(
      chapter3ContentMappingsProjected
        .filter((m) => m.conceptId === conceptId)
        .map((m) => m.contentBlockId),
    )
    return filterSectionsByMappedBlockIds(3, mappedIds)
  },

  filterFlashcardsByConcept(conceptId) {
    const mappedIds = new Set(
      chapter3FlashcardMappingsProjected
        .filter((m) => m.conceptId === conceptId)
        .map((m) => m.flashcardId),
    )
    return chapter3PremiumFlashcards.filter(
      (card) => card.is_active && mappedIds.has(card.id),
    )
  },

  buildRemediationContentBundle(conceptId) {
    return buildBundle(this, conceptId)
  },

  getQuizQuestionById(questionId) {
    return (
      chapter3PremiumQuizQuestions.find((q) => q.id === questionId) ??
      chapter3ReassessmentQuestions.find((q) => q.id === questionId) ??
      null
    )
  },

  filterKeyTermsByConcept(conceptId) {
    if (!isChapter3ConceptFamilyId(conceptId)) {
      return []
    }
    return chapter3KeyTerms.filter((term) => term.conceptId === conceptId)
  },

  getConceptQuestionCount(conceptId) {
    return chapter3QuizMappingsProjected.filter((m) => m.conceptId === conceptId).length
  },
}

// ───────────────────────────────────────────────
// Chapter 4 Provider (C4-3)
// ───────────────────────────────────────────────

// Project the canonical Ch4 mappings (conceptFamilyId field) into the shared
// provider shape. chapter-4-concepts/mappings.ts remains the single source
// of truth — nothing is duplicated or restated.
const chapter4ContentMappingsProjected: readonly { contentBlockId: string; conceptId: string }[] =
  chapter4ContentConceptMappings.map((m) => ({
    contentBlockId: m.contentBlockId,
    conceptId: m.conceptFamilyId as string,
  }))
const chapter4FlashcardMappingsProjected: readonly { flashcardId: string; conceptId: string }[] =
  chapter4FlashcardConceptMappings.map((m) => ({
    flashcardId: m.flashcardId as string,
    conceptId: m.conceptFamilyId as string,
  }))
const chapter4QuizMappingsProjected: readonly { questionId: string; conceptId: string }[] =
  chapter4QuizQuestionConceptMappings.map((m) => ({
    questionId: m.questionId as string,
    conceptId: m.conceptFamilyId as string,
  }))

function isChapter4ConceptFamilyId(conceptId: string): boolean {
  return (ACTIVE_CHAPTER4_CONCEPT_FAMILY_IDS as readonly string[]).includes(conceptId)
}

const chapter4Provider: ChapterRemediationContentProvider = {
  chapterId: 'ch-4',

  getConceptName(conceptId) {
    return chapter4ConceptFamilies.find((c) => c.id === conceptId)?.name ?? 'Unknown Topic'
  },

  getContentBlockIdsForConcept(conceptId) {
    return chapter4ContentMappingsProjected
      .filter((m) => m.conceptId === conceptId)
      .map((m) => m.contentBlockId)
  },

  getFlashcardIdsForConcept(conceptId) {
    return chapter4FlashcardMappingsProjected
      .filter((m) => m.conceptId === conceptId)
      .map((m) => m.flashcardId)
  },

  filterContentByConcept(conceptId) {
    const mappedIds = new Set(
      chapter4ContentMappingsProjected
        .filter((m) => m.conceptId === conceptId)
        .map((m) => m.contentBlockId),
    )
    return filterSectionsByMappedBlockIds(4, mappedIds)
  },

  filterFlashcardsByConcept(conceptId) {
    const mappedIds = new Set(
      chapter4FlashcardMappingsProjected
        .filter((m) => m.conceptId === conceptId)
        .map((m) => m.flashcardId),
    )
    return chapter4PremiumFlashcards.filter(
      (card) => card.is_active && mappedIds.has(card.id),
    )
  },

  buildRemediationContentBundle(conceptId) {
    return buildBundle(this, conceptId)
  },

  getQuizQuestionById(questionId) {
    return (
      chapter4PremiumQuizQuestions.find((q) => q.id === questionId) ??
      chapter4ReassessmentQuestions.find((q) => q.id === questionId) ??
      null
    )
  },

  filterKeyTermsByConcept(conceptId) {
    // Chapter 4 has no key-terms dataset (deferred: student-page KeyTermsPanel
    // scope, not C4-3). No C4-3 consumer renders key terms — the remediation
    // page client has no key-term path. Contract requires [] for
    // retired/unknown concepts; a valid-but-undataseted family also serves [].
    if (!isChapter4ConceptFamilyId(conceptId)) {
      return []
    }
    return []
  },

  getConceptQuestionCount(conceptId) {
    return chapter4QuizMappingsProjected.filter((m) => m.conceptId === conceptId).length
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
  flashcardId: m.flashcardId as string,
  conceptId: m.conceptFamilyId as string,
}))
const chapter5QuizMappingsProjected = [
  ...chapter5QuizQuestionConceptMappings,
  ...chapter5ReassessmentQuestionConceptMappings,
].map((m) => ({
  questionId: m.questionId as string,
  conceptId: m.conceptFamilyId as string,
}))

function isChapter5ConceptFamilyId(conceptId: string): boolean {
  return (ACTIVE_CHAPTER5_CONCEPT_FAMILY_IDS as readonly string[]).includes(conceptId)
}

const chapter5Provider: ChapterRemediationContentProvider = {
  chapterId: 'ch-5',

  getConceptName(conceptId) {
    return chapter5ConceptFamilies.find((c) => c.id === conceptId)?.name ?? 'Unknown Topic'
  },

  getContentBlockIdsForConcept(conceptId) {
    return chapter5ContentMappingsProjected
      .filter((m) => m.conceptId === conceptId)
      .map((m) => m.contentBlockId)
  },

  getFlashcardIdsForConcept(conceptId) {
    return chapter5FlashcardMappingsProjected
      .filter((m) => m.conceptId === conceptId)
      .map((m) => m.flashcardId)
  },

  filterContentByConcept(conceptId) {
    const mappedIds = new Set(
      chapter5ContentMappingsProjected
        .filter((m) => m.conceptId === conceptId)
        .map((m) => m.contentBlockId),
    )
    return filterSectionsByMappedBlockIds(5, mappedIds)
  },

  filterFlashcardsByConcept(conceptId) {
    const mappedIds = new Set(
      chapter5FlashcardMappingsProjected
        .filter((m) => m.conceptId === conceptId)
        .map((m) => m.flashcardId),
    )
    return chapter5PremiumFlashcards.filter(
      (card) => card.is_active && mappedIds.has(card.id),
    )
  },

  buildRemediationContentBundle(conceptId) {
    return buildBundle(this, conceptId)
  },

  getQuizQuestionById(questionId) {
    return (
      chapter5PremiumQuizQuestions.find((q) => q.id === questionId) ??
      chapter5ReassessmentQuestions.find((q) => q.id === questionId) ??
      null
    )
  },

  filterKeyTermsByConcept(conceptId) {
    if (!isChapter5ConceptFamilyId(conceptId)) {
      return []
    }
    return []
  },

  getConceptQuestionCount(conceptId) {
    return chapter5QuizMappingsProjected.filter((m) => m.conceptId === conceptId).length
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
  flashcardId: m.flashcardId as string,
  conceptId: m.conceptFamilyId as string,
}))
const chapter6QuizMappingsProjected = [
  ...chapter6QuizQuestionConceptMappings,
  ...chapter6ReassessmentQuestionConceptMappings,
].map((m) => ({
  questionId: m.questionId as string,
  conceptId: m.conceptFamilyId as string,
}))

function isChapter6ConceptFamilyId(conceptId: string): boolean {
  return (ACTIVE_CHAPTER6_CONCEPT_FAMILY_IDS as readonly string[]).includes(conceptId)
}

const chapter6Provider: ChapterRemediationContentProvider = {
  chapterId: 'ch-6',

  getConceptName(conceptId) {
    return chapter6ConceptFamilies.find((c) => c.id === conceptId)?.name ?? 'Unknown Topic'
  },

  getContentBlockIdsForConcept(conceptId) {
    return chapter6ContentMappingsProjected.filter((m) => m.conceptId === conceptId).map((m) => m.contentBlockId)
  },

  getFlashcardIdsForConcept(conceptId) {
    return chapter6FlashcardMappingsProjected.filter((m) => m.conceptId === conceptId).map((m) => m.flashcardId)
  },

  filterContentByConcept(conceptId) {
    const mappedIds = new Set(this.getContentBlockIdsForConcept(conceptId))
    return filterSectionsByMappedBlockIds(6, mappedIds)
  },

  filterFlashcardsByConcept(conceptId) {
    const mappedIds = new Set(this.getFlashcardIdsForConcept(conceptId))
    return chapter6PremiumFlashcards.filter((card) => card.is_active && mappedIds.has(card.id))
  },

  buildRemediationContentBundle(conceptId) {
    return buildBundle(this, conceptId)
  },

  getQuizQuestionById(questionId) {
    return (
      chapter6PremiumQuizQuestions.find((q) => q.id === questionId) ??
      chapter6ReassessmentQuestions.find((q) => q.id === questionId) ??
      null
    )
  },

  filterKeyTermsByConcept(conceptId) {
    if (!isChapter6ConceptFamilyId(conceptId)) return []
    return []
  },

  getConceptQuestionCount(conceptId) {
    return chapter6QuizMappingsProjected.filter((m) => m.conceptId === conceptId).length
  },
}

// ───────────────────────────────────────────────
// Registry
// ───────────────────────────────────────────────

const contentProviders = new Map<ChapterId, ChapterRemediationContentProvider>([
  ['ch-2', chapter2Provider],
  ['ch-3', chapter3Provider],
  ['ch-4', chapter4Provider],
  ['ch-5', chapter5Provider],
  ['ch-6', chapter6Provider],
])

/**
 * Resolve the remediation content provider for a chapter, or undefined when
 * the chapter has no remediation content serving support (fail-closed).
 */
export function getChapterContentProvider(
  chapterId: ChapterId,
): ChapterRemediationContentProvider | undefined {
  return contentProviders.get(chapterId)
}

/** Whether a chapter has a registered remediation content provider. */
export function hasChapterContentProvider(chapterId: string): boolean {
  return contentProviders.has(chapterId)
}
