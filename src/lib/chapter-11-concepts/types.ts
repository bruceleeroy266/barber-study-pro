import type {
  SourceProvenance,
  ExamRelevance,
  ConceptImportance,
  ProfessionalRelevance,
  ConceptStatus,
} from '../chapter-2-concepts/types'

export type Chapter11ConceptFamilyId =
  | 'ch11-shampoo-draping-service'
  | 'ch11-analysis-product-selection'
  | 'ch11-scalp-massage'
  | 'ch11-scalp-hair-treatments'
  | 'ch11-treatment-equipment'
  | 'ch11-scalp-condition-recognition'
  | 'ch11-service-safety-referral'
  | 'ch11-client-care-professional-practice'

export type Chapter11LearningObjectiveId =
  | 'LO-11-01'
  | 'LO-11-02'
  | 'LO-11-03'
  | 'LO-11-04'
  | 'LO-11-05'
  | 'LO-11-06'
  | 'LO-11-07'
  | 'LO-11-08'

export interface Chapter11LearningObjective {
  id: Chapter11LearningObjectiveId
  statement: string
  sourceBasis: string
  conceptFamilyIds: readonly Chapter11ConceptFamilyId[]
}

export interface Chapter11ConceptFamily {
  id: Chapter11ConceptFamilyId
  name: string
  learningObjectiveIds: readonly Chapter11LearningObjectiveId[]
  description: string
  importance: ConceptImportance
  professionalRelevance: ProfessionalRelevance
  examRelevance: ExamRelevance
  sourceProvenance: SourceProvenance
  status: ConceptStatus
}
