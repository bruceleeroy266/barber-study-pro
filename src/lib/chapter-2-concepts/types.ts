/**
 * Chapter 2 Concept Runtime Architecture — Type Definitions
 *
 * Phase 6B-2: Typed runtime metadata for deterministic
 * Question/Flashcard/Content → Concept → LO resolution.
 *
 * Governing documents:
 *   - ASCYN_PRO_CH02_CONCEPT_OBJECTIVE_MAP_v1.1.md (APPROVED)
 *   - ASCYN_PRO_CH02_PHASE6B2_TYPED_CONCEPT_RUNTIME_ARCHITECTURE_REVIEW.md
 *
 * Scope: Runtime metadata only. No learning-gap detection, no automated
 * diagnosis, no remediation routing, no learning_events, no mastery scoring.
 */

// ───────────────────────────────────────────────
// Branded ID Types
// ───────────────────────────────────────────────

/** Stable concept identifier. Format: C-{chapter}-{sequence} */
export type ConceptId = `C-2-${string}`

/** Stable subconcept identifier. Format: SC-{chapter}-{sequence}-{letter} */
export type SubconceptId = `SC-2-${string}`

/** Stable learning objective identifier. Format: LO-{chapter}-{sequence} */
export type LearningObjectiveId = `LO-2-${string}`

/** Content block identifier (free-form string from chapter-content.ts) */
export type ContentBlockId = string

/** Flashcard identifier. Format: fc-{chapter}-{sequence} */
export type FlashcardId = `fc-2-${string}`

/** Quiz question identifier. Format: qq-{chapter}-{sequence} */
export type QuizQuestionId = `qq-2-${string}`

// ───────────────────────────────────────────────
// Classification Enums
// ───────────────────────────────────────────────

/** Source provenance classification */
export type SourceProvenance =
  | 'TEXTBOOK_DERIVED'       // Underlying knowledge domain from textbook
  | 'ASCYN_ORIGINAL'         // Original ASCYN PRO content
  | 'ASCYN_EXTENSION'        // ASCYN expansion beyond textbook scope

/** Concept importance level */
export type ConceptImportance = 'core' | 'supporting' | 'enrichment'

/** Professional relevance classification */
export type ProfessionalRelevance = 'CORE' | 'SUPPORTING' | 'ENRICHMENT'

/** Exam relevance classification */
export type ExamRelevance =
  | 'DIRECT_VERIFIED'           // Confirmed on NIC/state exam blueprint
  | 'INDIRECT_REFERENCE_ONLY'   // Indirectly relevant through professional practice
  | 'NONE'                      // Not exam-relevant

/** Concept status */
export type ConceptStatus = 'active' | 'retired'

// ───────────────────────────────────────────────
// Core Entity Definitions
// ───────────────────────────────────────────────

/**
 * A subconcept — a finer-grained decomposition of a parent concept.
 */
export interface Chapter2Subconcept {
  /** Stable subconcept ID (e.g., 'SC-2-01-a') */
  id: SubconceptId
  /** Parent concept ID */
  parentConceptId: ConceptId
  /** Canonical subconcept name */
  name: string
  /** Justification for subconcept existence */
  justification: string
}

/**
 * A single concept in the Chapter 2 concept taxonomy.
 * This is the canonical definition — the single source of truth.
 */
export interface Chapter2Concept {
  /** Stable concept ID (e.g., 'C-2-01') */
  id: ConceptId
  /** Canonical concept name (e.g., 'Life Skills Foundations') */
  name: string
  /** Concept importance for learning prioritization */
  importance: ConceptImportance
  /** Professional relevance classification */
  professionalRelevance: ProfessionalRelevance
  /** Exam relevance classification */
  examRelevance: ExamRelevance
  /** Source provenance */
  sourceProvenance: SourceProvenance
  /** Primary learning objective this concept serves */
  learningObjectiveId: LearningObjectiveId
  /** Concept status — active or retired */
  status: ConceptStatus
  /** Subconcepts belonging to this concept (empty array if none) */
  subconcepts: Chapter2Subconcept[]
}

/**
 * A learning objective for Chapter 2.
 */
export interface Chapter2LearningObjective {
  /** Stable LO ID (e.g., 'LO-2-01') */
  id: LearningObjectiveId
  /** LO statement in original ASCYN PRO language */
  statement: string
  /** Source basis (e.g., 'Textbook LO1; ASCYN Section 1') */
  sourceBasis: string
  /** Professional relevance */
  professionalRelevance: ProfessionalRelevance
  /** Exam relevance */
  examRelevance: ExamRelevance
  /** Concepts that serve this LO */
  conceptIds: ConceptId[]
}

// ───────────────────────────────────────────────
// Asset-to-Concept Mappings
// ───────────────────────────────────────────────

/**
 * Maps a single content block to its associated concept(s).
 */
export interface ContentConceptMapping {
  /** Content block ID from chapter-content.ts */
  contentBlockId: ContentBlockId
  /** Primary concept mapping */
  conceptId: ConceptId
  /** Optional subconcept mapping */
  subconceptId?: SubconceptId
  /** Additional concept mappings (if content spans multiple concepts) */
  secondaryConceptIds?: ConceptId[]
}

/**
 * Maps a single flashcard to its associated concept(s).
 */
export interface FlashcardConceptMapping {
  /** Flashcard ID */
  flashcardId: FlashcardId
  /** Primary concept mapping */
  conceptId: ConceptId
  /** Optional subconcept mapping */
  subconceptId?: SubconceptId
  /** Additional concept mappings */
  secondaryConceptIds?: ConceptId[]
}

/**
 * Maps a single quiz question to its associated concept(s).
 */
export interface QuizQuestionConceptMapping {
  /** Quiz question ID */
  questionId: QuizQuestionId
  /** Primary concept mapping */
  conceptId: ConceptId
  /** Optional subconcept mapping */
  subconceptId?: SubconceptId
  /** Additional concept mappings */
  secondaryConceptIds?: ConceptId[]
}

// ───────────────────────────────────────────────
// Runtime Registry (Derived View)
// ───────────────────────────────────────────────

/**
 * Runtime view of a concept with all associated assets resolved.
 * This is a derived/computed view — not stored directly.
 */
export interface Chapter2ConceptRuntime {
  /** The canonical concept definition */
  concept: Chapter2Concept
  /** Content blocks mapped to this concept */
  contentBlockIds: ContentBlockId[]
  /** Active flashcards mapped to this concept */
  activeFlashcardIds: FlashcardId[]
  /** Quiz questions mapped to this concept */
  quizQuestionIds: QuizQuestionId[]
  /** Total asset count across all types */
  totalAssetCount: number
  /** Whether this concept has at least one instructional asset */
  hasInstructionalAssets: boolean
}

/**
 * The complete Chapter 2 concept runtime registry.
 */
export interface Chapter2ConceptRegistry {
  /** All concept definitions (including retired) */
  concepts: ReadonlyMap<ConceptId, Chapter2Concept>
  /** All learning objectives */
  learningObjectives: ReadonlyMap<LearningObjectiveId, Chapter2LearningObjective>
  /** All subconcepts */
  subconcepts: ReadonlyMap<SubconceptId, Chapter2Subconcept>
  /** Content-to-concept mappings */
  contentMappings: readonly ContentConceptMapping[]
  /** Flashcard-to-concept mappings */
  flashcardMappings: readonly FlashcardConceptMapping[]
  /** Quiz question-to-concept mappings */
  quizQuestionMappings: readonly QuizQuestionConceptMapping[]
  /** Retired concept IDs (for validation — must not be referenced) */
  retiredConceptIds: readonly ConceptId[]
}
