import type { SourceProvenance, ExamRelevance, ConceptImportance, ProfessionalRelevance, ConceptStatus } from '../chapter-2-concepts/types'

export type Chapter6ConceptFamilyId =
  | 'ch6-cells-tissues'
  | 'ch6-body-systems'
  | 'ch6-skeletal'
  | 'ch6-muscular'
  | 'ch6-nervous'
  | 'ch6-cardiovascular'
  | 'ch6-lymphatic'
  | 'ch6-integumentary'
  | 'ch6-endocrine'
  | 'ch6-other-systems'

export type Chapter6LearningObjectiveId = `LO-6-${'01'|'02'|'03'|'04'|'05'|'06'|'07'|'08'|'09'|'10'}`
export type Chapter6FlashcardId = `fc-6-${string}`
export type Chapter6QuizQuestionId = `qq-6-${string}`

export interface Chapter6LearningObjective {
  id: Chapter6LearningObjectiveId
  statement: string
  sourceBasis: string
  conceptFamilyIds: readonly Chapter6ConceptFamilyId[]
}
export interface Chapter6ConceptFamily {
  id: Chapter6ConceptFamilyId
  name: string
  learningObjectiveIds: readonly Chapter6LearningObjectiveId[]
  learningObjectiveId: Chapter6LearningObjectiveId
  description: string
  importance: ConceptImportance
  professionalRelevance: ProfessionalRelevance
  examRelevance: ExamRelevance
  sourceProvenance: SourceProvenance
  status: ConceptStatus
}
export interface Chapter6ContentConceptMapping { contentBlockId: string; conceptFamilyId: Chapter6ConceptFamilyId }
export interface Chapter6FlashcardConceptMapping { flashcardId: Chapter6FlashcardId; conceptFamilyId: Chapter6ConceptFamilyId }
export interface Chapter6QuizQuestionConceptMapping { questionId: Chapter6QuizQuestionId; conceptFamilyId: Chapter6ConceptFamilyId }
