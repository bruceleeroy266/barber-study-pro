import type {
  SourceProvenance,
  ExamRelevance,
  ConceptImportance,
  ProfessionalRelevance,
  ConceptStatus,
} from '../chapter-2-concepts/types'

export type Chapter18ConceptFamilyId =
  | 'ch18-analysis-structure'
  | 'ch18-color-theory'
  | 'ch18-color-products'
  | 'ch18-developers-lighteners-toners'
  | 'ch18-application-consultation-procedures'
  | 'ch18-correction-gray-porosity'
  | 'ch18-service-safety-chemical-handling'

export type Chapter18LearningObjectiveId =
  | 'LO-18-01'
  | 'LO-18-02'
  | 'LO-18-03'
  | 'LO-18-04'
  | 'LO-18-05'
  | 'LO-18-06'
  | 'LO-18-07'

export interface Chapter18LearningObjective {
  id: Chapter18LearningObjectiveId
  statement: string
  sourceBasis: string
  conceptFamilyIds: readonly Chapter18ConceptFamilyId[]
}

export interface Chapter18ConceptFamily {
  id: Chapter18ConceptFamilyId
  name: string
  learningObjectiveIds: readonly Chapter18LearningObjectiveId[]
  description: string
  importance: ConceptImportance
  professionalRelevance: ProfessionalRelevance
  examRelevance: ExamRelevance
  sourceProvenance: SourceProvenance
  status: ConceptStatus
  safetyCritical: boolean
  safetyRationale?: string
}
