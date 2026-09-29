import type {
  SourceProvenance,
  ExamRelevance,
  ConceptImportance,
  ProfessionalRelevance,
  ConceptStatus,
} from '../chapter-2-concepts/types'

export type Chapter15ConceptFamilyId =
  | 'ch15-client-consultation-ethics-marketing'
  | 'ch15-alternatives-scope-referral'
  | 'ch15-hair-materials-base-construction'
  | 'ch15-system-selection-measurement-template'
  | 'ch15-attachment-methods-bonding'
  | 'ch15-cleaning-maintenance-chemical-care'
  | 'ch15-cutting-blending-customization'

export type Chapter15LearningObjectiveId =
  | 'LO-15-01'
  | 'LO-15-02'
  | 'LO-15-03'
  | 'LO-15-04'
  | 'LO-15-05'
  | 'LO-15-06'
  | 'LO-15-07'

export interface Chapter15LearningObjective {
  id: Chapter15LearningObjectiveId
  statement: string
  sourceBasis: string
  conceptFamilyIds: readonly Chapter15ConceptFamilyId[]
}

export interface Chapter15ConceptFamily {
  id: Chapter15ConceptFamilyId
  name: string
  learningObjectiveIds: readonly Chapter15LearningObjectiveId[]
  description: string
  importance: ConceptImportance
  professionalRelevance: ProfessionalRelevance
  examRelevance: ExamRelevance
  sourceProvenance: SourceProvenance
  status: ConceptStatus
}
