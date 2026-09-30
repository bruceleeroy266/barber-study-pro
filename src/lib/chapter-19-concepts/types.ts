import type {
  SourceProvenance,
  ExamRelevance,
  ConceptImportance,
  ProfessionalRelevance,
  ConceptStatus,
} from '../chapter-2-concepts/types'

export type Chapter19ConceptFamilyId =
  | 'ch19-licensing-requirements-verification'
  | 'ch19-exam-preparation-test-reasoning'
  | 'ch19-practical-exam-safety-readiness'
  | 'ch19-employment-readiness-professionalism'
  | 'ch19-resume-portfolio-application-materials'
  | 'ch19-job-search-shop-research-interview'
  | 'ch19-employment-law-contracts-compliance'

export type Chapter19LearningObjectiveId =
  | 'LO-19-01'
  | 'LO-19-02'
  | 'LO-19-03'
  | 'LO-19-04'
  | 'LO-19-05'
  | 'LO-19-06'
  | 'LO-19-07'

export interface Chapter19LearningObjective {
  id: Chapter19LearningObjectiveId
  statement: string
  sourceBasis: string
  conceptFamilyIds: readonly Chapter19ConceptFamilyId[]
}

export interface Chapter19ConceptFamily {
  id: Chapter19ConceptFamilyId
  name: string
  learningObjectiveIds: readonly Chapter19LearningObjectiveId[]
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
