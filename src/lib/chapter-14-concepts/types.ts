import type {
  SourceProvenance,
  ExamRelevance,
  ConceptImportance,
  ProfessionalRelevance,
  ConceptStatus,
} from '../chapter-2-concepts/types'

export type Chapter14ConceptFamilyId =
  | 'ch14-consultation-professional-design'
  | 'ch14-facial-head-design-analysis'
  | 'ch14-cutting-geometry-guides'
  | 'ch14-shear-clipper-razor-texturizing'
  | 'ch14-haircut-styles-procedures'
  | 'ch14-styling-volume-locks'
  | 'ch14-service-safety-sanitation'

export type Chapter14LearningObjectiveId =
  | 'LO-14-01'
  | 'LO-14-02'
  | 'LO-14-03'
  | 'LO-14-04'
  | 'LO-14-05'
  | 'LO-14-06'
  | 'LO-14-07'

export interface Chapter14LearningObjective {
  id: Chapter14LearningObjectiveId
  statement: string
  sourceBasis: string
  conceptFamilyIds: readonly Chapter14ConceptFamilyId[]
}

export interface Chapter14ConceptFamily {
  id: Chapter14ConceptFamilyId
  name: string
  learningObjectiveIds: readonly Chapter14LearningObjectiveId[]
  description: string
  importance: ConceptImportance
  professionalRelevance: ProfessionalRelevance
  examRelevance: ExamRelevance
  sourceProvenance: SourceProvenance
  status: ConceptStatus
}
