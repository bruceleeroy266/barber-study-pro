import type {
  SourceProvenance,
  ExamRelevance,
  ConceptImportance,
  ProfessionalRelevance,
  ConceptStatus,
} from '../chapter-2-concepts/types'

export type Chapter9ConceptFamilyId =
  | 'ch9-epidermis-skin-barrier'
  | 'ch9-dermis-subcutaneous-support'
  | 'ch9-skin-functions-glands'
  | 'ch9-primary-lesions'
  | 'ch9-secondary-lesions'
  | 'ch9-sebaceous-sudoriferous-disorders'
  | 'ch9-inflammatory-infectious-conditions'
  | 'ch9-pigmentation-hypertrophies'
  | 'ch9-skin-cancer-recognition'
  | 'ch9-service-safety-referral'

export type Chapter9LearningObjectiveId =
  | 'LO-9-01'
  | 'LO-9-02'
  | 'LO-9-03'
  | 'LO-9-04'
  | 'LO-9-05'
  | 'LO-9-06'
  | 'LO-9-07'
  | 'LO-9-08'

export interface Chapter9LearningObjective {
  id: Chapter9LearningObjectiveId
  statement: string
  sourceBasis: string
  conceptFamilyIds: readonly Chapter9ConceptFamilyId[]
}

export interface Chapter9ConceptFamily {
  id: Chapter9ConceptFamilyId
  name: string
  learningObjectiveIds: readonly Chapter9LearningObjectiveId[]
  description: string
  importance: ConceptImportance
  professionalRelevance: ProfessionalRelevance
  examRelevance: ExamRelevance
  sourceProvenance: SourceProvenance
  status: ConceptStatus
}
