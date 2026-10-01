import type {
  SourceProvenance,
  ExamRelevance,
  ConceptImportance,
  ProfessionalRelevance,
  ConceptStatus,
} from '../chapter-2-concepts/types'

export type Chapter21ConceptFamilyId =
  | 'ch21-business-entry-paths'
  | 'ch21-shop-opening-planning'
  | 'ch21-ownership-legal-structures'
  | 'ch21-business-plan-financial-planning'
  | 'ch21-recordkeeping-financial-compliance'
  | 'ch21-booth-rental-independent-business-responsibilities'
  | 'ch21-shop-operations-management'
  | 'ch21-advertising-marketing-client-consent'

export type Chapter21LearningObjectiveId =
  | 'LO-21-01'
  | 'LO-21-02'
  | 'LO-21-03'
  | 'LO-21-04'
  | 'LO-21-05'
  | 'LO-21-06'
  | 'LO-21-07'
  | 'LO-21-08'

export interface Chapter21LearningObjective {
  id: Chapter21LearningObjectiveId
  statement: string
  sourceBasis: string
  conceptFamilyIds: readonly Chapter21ConceptFamilyId[]
}

export interface Chapter21ConceptFamily {
  id: Chapter21ConceptFamilyId
  name: string
  learningObjectiveIds: readonly Chapter21LearningObjectiveId[]
  description: string
  importance: ConceptImportance
  professionalRelevance: ProfessionalRelevance
  examRelevance: ExamRelevance
  sourceProvenance: SourceProvenance
  status: ConceptStatus
  safetyCritical: boolean
  complianceLegalCritical: boolean
  criticalityRationale?: string
}
