/**
 * Chapter 3 Concept Foundation — Type Definitions
 *
 * C3-1: Typed canonical concept families for deterministic
 * Question/Flashcard/Content → Concept → LO resolution.
 *
 * Scope: Concept foundation only. No learning-gap detection, no remediation
 * routing, no reassessment, no mastery scoring. Those are C3-2+ concerns.
 *
 * Architecture mirrors the Chapter 2 concept runtime (chapter-2-concepts/)
 * with Chapter-3-branded IDs. Classification vocabulary (SourceProvenance,
 * ExamRelevance, ConceptImportance, ProfessionalRelevance, ConceptStatus) is
 * reused from the shared Chapter 2 runtime types — not copied.
 */

import type {
  SourceProvenance,
  ExamRelevance,
  ConceptImportance,
  ProfessionalRelevance,
  ConceptStatus,
} from '../chapter-2-concepts/types'

export type {
  SourceProvenance,
  ExamRelevance,
  ConceptImportance,
  ProfessionalRelevance,
  ConceptStatus,
}

// ───────────────────────────────────────────────
// Branded ID Types
// ───────────────────────────────────────────────

/**
 * Canonical Chapter 3 concept family identifier.
 * LOCKED by founder authorization (C3-1). Exactly four families exist;
 * do not add core concept families without a new authorization.
 */
export type Chapter3ConceptFamilyId =
  | 'ch3-healthful-habits'
  | 'ch3-professional-image'
  | 'ch3-ergonomics'
  | 'ch3-human-relations'

/** Stable learning objective identifier. Format: LO-3-0# */
export type Chapter3LearningObjectiveId = `LO-3-0${1 | 2 | 3 | 4}`

/** Content block identifier (free-form string from chapter-content.ts) */
export type Chapter3ContentBlockId = string

/** Flashcard identifier. Format: fc-3-### */
export type Chapter3FlashcardId = `fc-3-${string}`

/** Quiz question identifier. Format: qq-3-### */
export type Chapter3QuizQuestionId = `qq-3-${string}`

// ───────────────────────────────────────────────
// Core Entity Definitions
// ───────────────────────────────────────────────

/**
 * A canonical Chapter 3 concept family — the single source of truth for
 * one locked curriculum domain. Families map 1:1 to learning objectives.
 */
export interface Chapter3ConceptFamily {
  /** Locked family ID (e.g., 'ch3-healthful-habits') */
  id: Chapter3ConceptFamilyId
  /** Canonical family name */
  name: string
  /** Primary learning objective this family serves (1:1) */
  learningObjectiveId: Chapter3LearningObjectiveId
  /** What this family covers, in original ASCYN wording */
  description: string
  /** Importance — all four families are core */
  importance: ConceptImportance
  /** Professional relevance classification */
  professionalRelevance: ProfessionalRelevance
  /**
   * Exam relevance — NIC blueprint is not verified from this environment,
   * so nothing in Chapter 3 is DIRECT_VERIFIED. Honest classification only.
   */
  examRelevance: ExamRelevance
  /** Source provenance */
  sourceProvenance: SourceProvenance
  /** Status — active or retired */
  status: ConceptStatus
}

/**
 * A Chapter 3 learning objective (locked Milady LO1–LO4 backbone,
 * expressed in original ASCYN wording).
 */
export interface Chapter3LearningObjective {
  /** Stable LO ID (e.g., 'LO-3-01') */
  id: Chapter3LearningObjectiveId
  /** LO statement in original ASCYN PRO language */
  statement: string
  /** Source basis (e.g., 'Textbook LO1') */
  sourceBasis: string
  /** The single concept family serving this LO (1:1) */
  conceptFamilyId: Chapter3ConceptFamilyId
}

// ───────────────────────────────────────────────
// Asset-to-Concept Mappings
// ───────────────────────────────────────────────

/** Maps a lesson content block to its primary concept family. */
export interface Chapter3ContentConceptMapping {
  contentBlockId: Chapter3ContentBlockId
  conceptFamilyId: Chapter3ConceptFamilyId
}

/** Maps a single flashcard to its primary concept family. */
export interface Chapter3FlashcardConceptMapping {
  flashcardId: Chapter3FlashcardId
  conceptFamilyId: Chapter3ConceptFamilyId
}

/** Maps a single quiz question to its primary concept family. */
export interface Chapter3QuizQuestionConceptMapping {
  questionId: Chapter3QuizQuestionId
  conceptFamilyId: Chapter3ConceptFamilyId
}
