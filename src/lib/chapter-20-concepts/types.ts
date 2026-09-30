import type {
  SourceProvenance,
  ExamRelevance,
  ConceptImportance,
  ProfessionalRelevance,
  ConceptStatus,
} from '../chapter-2-concepts/types'

export type Chapter20ConceptFamilyId =
  | 'ch20-professional-transition-workplace-expectations'
  | 'ch20-teamwork-workplace-relationships'
  | 'ch20-employment-classification-compensation'
  | 'ch20-financial-responsibility-income-reporting'
  | 'ch20-ethical-selling-retailing'
  | 'ch20-client-retention-marketing-consent'

export type Chapter20LearningObjectiveId =
  | 'LO-20-01'
  | 'LO-20-02'
  | 'LO-20-03'
  | 'LO-20-04'
  | 'LO-20-05'
  | 'LO-20-06'

export interface Chapter20LearningObjective {
  id: Chapter20LearningObjectiveId
  statement: string
  sourceBasis: string
  conceptFamilyIds: readonly Chapter20ConceptFamilyId[]
}

export interface Chapter20ConceptFamily {
  id: Chapter20ConceptFamilyId
  name: string
  learningObjectiveIds: readonly Chapter20LearningObjectiveId[]
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
