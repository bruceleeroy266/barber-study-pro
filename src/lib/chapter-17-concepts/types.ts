import type {
  SourceProvenance,
  ExamRelevance,
  ConceptImportance,
  ProfessionalRelevance,
  ConceptStatus,
} from '../chapter-2-concepts/types'

export type Chapter17ConceptFamilyId =
  | 'ch17-consultation-hair-analysis'
  | 'ch17-chemistry-bond-transformation'
  | 'ch17-permanent-waving-procedures'
  | 'ch17-chemical-relaxing-procedures'
  | 'ch17-curl-reformation'
  | 'ch17-safety-strand-tests-compatibility'
  | 'ch17-texturizers-chemical-blowouts'

export type Chapter17LearningObjectiveId =
  | 'LO-17-01'
  | 'LO-17-02'
  | 'LO-17-03'
  | 'LO-17-04'
  | 'LO-17-05'
  | 'LO-17-06'
  | 'LO-17-07'

export interface Chapter17LearningObjective {
  id: Chapter17LearningObjectiveId
  statement: string
  sourceBasis: string
  conceptFamilyIds: readonly Chapter17ConceptFamilyId[]
}

export interface Chapter17ConceptFamily {
  id: Chapter17ConceptFamilyId
  name: string
  learningObjectiveIds: readonly Chapter17LearningObjectiveId[]
  description: string
  importance: ConceptImportance
  professionalRelevance: ProfessionalRelevance
  examRelevance: ExamRelevance
  sourceProvenance: SourceProvenance
  status: ConceptStatus
}
