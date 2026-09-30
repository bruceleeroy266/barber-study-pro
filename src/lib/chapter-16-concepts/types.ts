import type {
  SourceProvenance,
  ExamRelevance,
  ConceptImportance,
  ProfessionalRelevance,
  ConceptStatus,
} from '../chapter-2-concepts/types'

export type Chapter16ConceptFamilyId =
  | 'ch16-design-foundations'
  | 'ch16-blunt-cut'
  | 'ch16-graduated-cut'
  | 'ch16-uniform-layer'
  | 'ch16-long-layer'
  | 'ch16-hair-analysis-texture'
  | 'ch16-advanced-techniques-texturizing'
  | 'ch16-styling-finishing-safety'

export type Chapter16LearningObjectiveId =
  | 'LO-16-01'
  | 'LO-16-02'
  | 'LO-16-03'
  | 'LO-16-04'
  | 'LO-16-05'
  | 'LO-16-06'
  | 'LO-16-07'
  | 'LO-16-08'

export interface Chapter16LearningObjective {
  id: Chapter16LearningObjectiveId
  statement: string
  sourceBasis: string
  conceptFamilyIds: readonly Chapter16ConceptFamilyId[]
}

export interface Chapter16ConceptFamily {
  id: Chapter16ConceptFamilyId
  name: string
  learningObjectiveIds: readonly Chapter16LearningObjectiveId[]
  description: string
  importance: ConceptImportance
  professionalRelevance: ProfessionalRelevance
  examRelevance: ExamRelevance
  sourceProvenance: SourceProvenance
  status: ConceptStatus
}
