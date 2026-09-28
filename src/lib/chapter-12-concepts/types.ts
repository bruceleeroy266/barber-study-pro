import type {
  SourceProvenance,
  ExamRelevance,
  ConceptImportance,
  ProfessionalRelevance,
  ConceptStatus,
} from '../chapter-2-concepts/types'

export type Chapter12ConceptFamilyId =
  | 'ch12-facial-anatomy-neurovascular'
  | 'ch12-massage-principles-manipulations'
  | 'ch12-equipment-electrotherapy'
  | 'ch12-skin-analysis-product-selection'
  | 'ch12-facial-treatment-procedures'
  | 'ch12-sanitation-infection-control'
  | 'ch12-contraindications-service-safety'
  | 'ch12-client-care-professional-practice'

export type Chapter12LearningObjectiveId =
  | 'LO-12-01'
  | 'LO-12-02'
  | 'LO-12-03'
  | 'LO-12-04'
  | 'LO-12-05'
  | 'LO-12-06'
  | 'LO-12-07'
  | 'LO-12-08'

export interface Chapter12LearningObjective {
  id: Chapter12LearningObjectiveId
  statement: string
  sourceBasis: string
  conceptFamilyIds: readonly Chapter12ConceptFamilyId[]
}

export interface Chapter12ConceptFamily {
  id: Chapter12ConceptFamilyId
  name: string
  learningObjectiveIds: readonly Chapter12LearningObjectiveId[]
  description: string
  importance: ConceptImportance
  professionalRelevance: ProfessionalRelevance
  examRelevance: ExamRelevance
  sourceProvenance: SourceProvenance
  status: ConceptStatus
}
