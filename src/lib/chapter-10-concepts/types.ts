import type {
  SourceProvenance,
  ExamRelevance,
  ConceptImportance,
  ProfessionalRelevance,
  ConceptStatus,
} from '../chapter-2-concepts/types'

export type Chapter10ConceptFamilyId =
  | 'ch10-hair-anatomy-structure'
  | 'ch10-hair-chemistry-bonds'
  | 'ch10-pigment-wave-growth-patterns'
  | 'ch10-growth-cycle-hair-types'
  | 'ch10-analysis-properties'
  | 'ch10-alopecia-hair-loss'
  | 'ch10-hair-shaft-disorders'
  | 'ch10-infectious-parasitic-scalp'
  | 'ch10-service-safety-referral'

export type Chapter10LearningObjectiveId =
  | 'LO-10-01'
  | 'LO-10-02'
  | 'LO-10-03'
  | 'LO-10-04'
  | 'LO-10-05'
  | 'LO-10-06'
  | 'LO-10-07'
  | 'LO-10-08'
  | 'LO-10-09'

export interface Chapter10LearningObjective {
  id: Chapter10LearningObjectiveId
  statement: string
  sourceBasis: string
  conceptFamilyIds: readonly Chapter10ConceptFamilyId[]
}

export interface Chapter10ConceptFamily {
  id: Chapter10ConceptFamilyId
  name: string
  learningObjectiveIds: readonly Chapter10LearningObjectiveId[]
  description: string
  importance: ConceptImportance
  professionalRelevance: ProfessionalRelevance
  examRelevance: ExamRelevance
  sourceProvenance: SourceProvenance
  status: ConceptStatus
}
