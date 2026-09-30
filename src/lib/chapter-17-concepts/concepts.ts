import type {
  Chapter17ConceptFamily,
  Chapter17ConceptFamilyId,
  Chapter17LearningObjective,
} from './types'

const sourceBasis =
  'Current ASCYN PRO Chapter 17 runtime lesson, 60 flashcards, 30-question chapter assessment, 16 existing learning questions, seven competencies, and existing remediation traceability. C17-1 defines shared architecture and mappings only; it does not independently source-certify chemical, safety, manufacturer, regulatory, or exam-certainty wording.'

export const chapter17LearningObjectives: readonly Chapter17LearningObjective[] = [
  {
    id: 'LO-17-01',
    statement: 'Apply consultation and hair/scalp analysis concepts before selecting or performing a chemical texture service.',
    sourceBasis,
    conceptFamilyIds: ['ch17-consultation-hair-analysis'],
  },
  {
    id: 'LO-17-02',
    statement: 'Explain the bond chemistry and physical transformation principles shared by permanent waving, relaxing, and curl reformation.',
    sourceBasis,
    conceptFamilyIds: ['ch17-chemistry-bond-transformation'],
  },
  {
    id: 'LO-17-03',
    statement: 'Apply rod, wrapping, placement, processing, rinsing, and neutralization concepts used in permanent waving.',
    sourceBasis,
    conceptFamilyIds: ['ch17-permanent-waving-procedures'],
  },
  {
    id: 'LO-17-04',
    statement: 'Differentiate relaxer types and apply source-presented chemical relaxing procedure concepts.',
    sourceBasis,
    conceptFamilyIds: ['ch17-chemical-relaxing-procedures'],
  },
  {
    id: 'LO-17-05',
    statement: 'Explain the source-presented curl reformation sequence and its higher processing-risk considerations.',
    sourceBasis,
    conceptFamilyIds: ['ch17-curl-reformation'],
  },
  {
    id: 'LO-17-06',
    statement: 'Apply source-presented safety, contraindication, strand-testing, compatibility, and chemical-service protection concepts.',
    sourceBasis,
    conceptFamilyIds: ['ch17-safety-strand-tests-compatibility'],
  },
  {
    id: 'LO-17-07',
    statement: 'Differentiate texturizer and chemical blowout outcomes from full relaxing services.',
    sourceBasis,
    conceptFamilyIds: ['ch17-texturizers-chemical-blowouts'],
  },
] as const

export const chapter17ConceptFamilies: readonly Chapter17ConceptFamily[] = [
  {
    id: 'ch17-consultation-hair-analysis',
    name: 'Client Consultation & Hair Analysis',
    learningObjectiveIds: ['LO-17-01'],
    description: 'Consultation, service history, texture, porosity, elasticity, density, scalp condition, and client expectation analysis.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch17-chemistry-bond-transformation',
    name: 'Chemical Texture Chemistry & Bond Transformation',
    learningObjectiveIds: ['LO-17-02'],
    description: 'Disulfide-bond reduction, rearrangement, oxidation/neutralization, pH-related chemistry, and comparison of texture-service chemistries.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch17-permanent-waving-procedures',
    name: 'Permanent Waving Procedures',
    learningObjectiveIds: ['LO-17-03'],
    description: 'Perm rods, wrapping methods, rod placement, solution selection, test curls, rinsing, neutralization, and service sequence.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch17-chemical-relaxing-procedures',
    name: 'Chemical Relaxing Procedures',
    learningObjectiveIds: ['LO-17-04'],
    description: 'Hydroxide and thio relaxers, base/no-base distinctions, application, processing, rinsing, conditioning, and service sequence.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch17-curl-reformation',
    name: 'Curl Reformation Procedures',
    learningObjectiveIds: ['LO-17-05'],
    description: 'Straightening, rod wrapping, neutralization, and the source-presented higher-risk considerations of curl reformation.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch17-safety-strand-tests-compatibility',
    name: 'Safety, Strand Tests & Chemical Compatibility',
    learningObjectiveIds: ['LO-17-06'],
    description: 'Contraindications, strand/elasticity/porosity testing, protective setup, product compatibility, monitoring, and damage-prevention decisions.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch17-texturizers-chemical-blowouts',
    name: 'Texturizers & Chemical Blowouts',
    learningObjectiveIds: ['LO-17-07'],
    description: 'Source-presented texturizer and chemical blowout purposes, outcomes, and distinctions from full relaxing services.',
    importance: 'supporting',
    professionalRelevance: 'SUPPORTING',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
] as const

export const CHAPTER17_CONCEPT_FAMILY_IDS =
  chapter17ConceptFamilies.map((concept) => concept.id) as readonly Chapter17ConceptFamilyId[]

export const ACTIVE_CHAPTER17_CONCEPT_FAMILY_IDS = CHAPTER17_CONCEPT_FAMILY_IDS

export const isChapter17ConceptFamilyId = (value: string): value is Chapter17ConceptFamilyId =>
  (CHAPTER17_CONCEPT_FAMILY_IDS as readonly string[]).includes(value)

export function getChapter17ConceptFamily(id: Chapter17ConceptFamilyId): Chapter17ConceptFamily {
  const concept = chapter17ConceptFamilies.find((item) => item.id === id)
  if (!concept) throw new Error(`Unknown Chapter 17 concept family: ${id}`)
  return concept
}
