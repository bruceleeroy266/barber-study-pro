import type {
  SourceProvenance,
  ExamRelevance,
  ConceptImportance,
  ProfessionalRelevance,
  ConceptStatus,
} from '../chapter-2-concepts/types'

export type Chapter7ConceptFamilyId =
  | 'ch7-organic-inorganic'
  | 'ch7-matter-structure'
  | 'ch7-properties-changes'
  | 'ch7-redox-reactions'
  | 'ch7-mixtures'
  | 'ch7-water-ph'
  | 'ch7-shampoos'
  | 'ch7-conditioners'
  | 'ch7-other-preparations'
  | 'ch7-chemical-safety'

export type Chapter7LearningObjectiveId =
  | 'LO-7-01'
  | 'LO-7-02'
  | 'LO-7-03'
  | 'LO-7-04'
  | 'LO-7-05'
  | 'LO-7-06'
  | 'LO-7-07'
  | 'LO-7-08'

export interface Chapter7LearningObjective {
  id: Chapter7LearningObjectiveId
  statement: string
  sourceBasis: string
  conceptFamilyIds: readonly Chapter7ConceptFamilyId[]
}

export interface Chapter7ConceptFamily {
  id: Chapter7ConceptFamilyId
  name: string
  learningObjectiveIds: readonly Chapter7LearningObjectiveId[]
  description: string
  importance: ConceptImportance
  professionalRelevance: ProfessionalRelevance
  examRelevance: ExamRelevance
  sourceProvenance: SourceProvenance
  status: ConceptStatus
}
