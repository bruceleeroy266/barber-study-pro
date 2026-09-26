import type {
  SourceProvenance,
  ExamRelevance,
  ConceptImportance,
  ProfessionalRelevance,
  ConceptStatus,
} from '../chapter-2-concepts/types'

export type Chapter8ConceptFamilyId =
  | 'ch8-electricity-circuits'
  | 'ch8-current-conversion'
  | 'ch8-electrical-measurements'
  | 'ch8-equipment-safety'
  | 'ch8-electrotherapy-terminology'
  | 'ch8-galvanic-current'
  | 'ch8-microcurrent-high-frequency'
  | 'ch8-electromagnetic-spectrum'
  | 'ch8-light-modalities'
  | 'ch8-light-therapy-safety'

export type Chapter8LearningObjectiveId =
  | 'LO-8-01'
  | 'LO-8-02'
  | 'LO-8-03'
  | 'LO-8-04'
  | 'LO-8-05'
  | 'LO-8-06'

export interface Chapter8LearningObjective {
  id: Chapter8LearningObjectiveId
  statement: string
  sourceBasis: string
  conceptFamilyIds: readonly Chapter8ConceptFamilyId[]
}

export interface Chapter8ConceptFamily {
  id: Chapter8ConceptFamilyId
  name: string
  learningObjectiveIds: readonly Chapter8LearningObjectiveId[]
  description: string
  importance: ConceptImportance
  professionalRelevance: ProfessionalRelevance
  examRelevance: ExamRelevance
  sourceProvenance: SourceProvenance
  status: ConceptStatus
}
