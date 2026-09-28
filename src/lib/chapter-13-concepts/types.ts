import type {
  SourceProvenance,
  ExamRelevance,
  ConceptImportance,
  ProfessionalRelevance,
  ConceptStatus,
} from '../chapter-2-concepts/types'

export type Chapter13ConceptFamilyId =
  | 'ch13-consultation-service-preparation'
  | 'ch13-hair-growth-ingrown-prevention'
  | 'ch13-shaving-areas-body-positioning'
  | 'ch13-razor-handling-stretching-technique'
  | 'ch13-professional-shave-procedure'
  | 'ch13-facial-hair-design'
  | 'ch13-infection-control-service-safety'
  | 'ch13-client-care-professional-practice'

export type Chapter13LearningObjectiveId =
  | 'LO-13-01'
  | 'LO-13-02'
  | 'LO-13-03'
  | 'LO-13-04'
  | 'LO-13-05'
  | 'LO-13-06'
  | 'LO-13-07'
  | 'LO-13-08'

export interface Chapter13LearningObjective {
  id: Chapter13LearningObjectiveId
  statement: string
  sourceBasis: string
  conceptFamilyIds: readonly Chapter13ConceptFamilyId[]
}

export interface Chapter13ConceptFamily {
  id: Chapter13ConceptFamilyId
  name: string
  learningObjectiveIds: readonly Chapter13LearningObjectiveId[]
  description: string
  importance: ConceptImportance
  professionalRelevance: ProfessionalRelevance
  examRelevance: ExamRelevance
  sourceProvenance: SourceProvenance
  status: ConceptStatus
}
