import type {
  SourceProvenance,
  ExamRelevance,
  ConceptImportance,
  ProfessionalRelevance,
  ConceptStatus,
} from '../chapter-2-concepts/types'

export type Chapter4ConceptFamilyId =
  | 'ch4-pathogens-transmission'
  | 'ch4-disinfection-sterilization'
  | 'ch4-cross-contamination'
  | 'ch4-blood-exposure-ppe'
  | 'ch4-regulatory-chemical-safety'
  | 'ch4-safe-practice-compliance'

export type Chapter4LearningObjectiveId = `LO-4-0${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}`
export type Chapter4FlashcardId = `fc-4-${string}`
export type Chapter4QuizQuestionId = `qq-4-${string}`

export interface Chapter4LearningObjective {
  id: Chapter4LearningObjectiveId
  statement: string
  sourceBasis: string
  conceptFamilyIds: readonly Chapter4ConceptFamilyId[]
}

export interface Chapter4ConceptFamily {
  id: Chapter4ConceptFamilyId
  name: string
  learningObjectiveIds: readonly Chapter4LearningObjectiveId[]
  /**
   * Primary learning objective this family rolls up to for detection (C4-2).
   * The shared concept-detection engine consumes exactly one primary LO per
   * concept; the full many-to-many relationships above are preserved and
   * remain canonical for content and mapping semantics.
   */
  learningObjectiveId: Chapter4LearningObjectiveId
  description: string
  importance: ConceptImportance
  professionalRelevance: ProfessionalRelevance
  examRelevance: ExamRelevance
  sourceProvenance: SourceProvenance
  status: ConceptStatus
}

export interface Chapter4FlashcardConceptMapping {
  flashcardId: Chapter4FlashcardId
  conceptFamilyId: Chapter4ConceptFamilyId
}

export interface Chapter4QuizQuestionConceptMapping {
  questionId: Chapter4QuizQuestionId
  conceptFamilyId: Chapter4ConceptFamilyId
}

export interface Chapter4ContentConceptMapping {
  contentBlockId: string
  conceptFamilyId: Chapter4ConceptFamilyId
}
