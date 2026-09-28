import type {
  Chapter14ConceptFamily,
  Chapter14ConceptFamilyId,
  Chapter14LearningObjective,
} from './types'

const sourceBasis =
  'Current ASCYN PRO Chapter 14 runtime lesson, 112 flashcards, and 70-question assessment. C14-1 defines architecture and mappings only; it does not independently verify Milady textbook pages, regulatory claims, state-board requirements, or safety wording.'

export const chapter14LearningObjectives: readonly Chapter14LearningObjective[] = [
  {
    id: 'LO-14-01',
    statement: 'Conduct a haircut consultation, clarify expectations, and connect client preferences and professional planning to the service design.',
    sourceBasis,
    conceptFamilyIds: ['ch14-consultation-professional-design'],
  },
  {
    id: 'LO-14-02',
    statement: 'Analyze facial shape, profile, neck, ears, sideburns, head structure, and reference points to support haircut design decisions.',
    sourceBasis,
    conceptFamilyIds: ['ch14-facial-head-design-analysis'],
  },
  {
    id: 'LO-14-03',
    statement: 'Apply haircut geometry, design elements, elevation, partings, guides, grain, tension, and cross-checking principles.',
    sourceBasis,
    conceptFamilyIds: ['ch14-cutting-geometry-guides'],
  },
  {
    id: 'LO-14-04',
    statement: 'Differentiate and apply source-presented shear, clipper, razor, tapering, thinning, and texturizing techniques.',
    sourceBasis,
    conceptFamilyIds: ['ch14-shear-clipper-razor-texturizing'],
  },
  {
    id: 'LO-14-05',
    statement: 'Recognize and sequence source-presented haircut procedures, classic styles, and finishing work.',
    sourceBasis,
    conceptFamilyIds: ['ch14-haircut-styles-procedures'],
  },
  {
    id: 'LO-14-06',
    statement: 'Apply source-presented styling, volume, blowdrying, cornrow, and lock concepts while preserving texture and service intent.',
    sourceBasis,
    conceptFamilyIds: ['ch14-styling-volume-locks'],
  },
  {
    id: 'LO-14-07',
    statement: 'Apply tool, thermal, sharp-implement, cleanup, sanitation, and service-safety decisions within Chapter 14 scope.',
    sourceBasis,
    conceptFamilyIds: ['ch14-service-safety-sanitation'],
  },
] as const

export const chapter14ConceptFamilies: readonly Chapter14ConceptFamily[] = [
  {
    id: 'ch14-consultation-professional-design',
    name: 'Consultation, Client Expectations & Professional Design Planning',
    learningObjectiveIds: ['LO-14-01'],
    description: 'Consultation, expectation clarification, service planning, professional decision-making, and Chapter 14 readiness framing.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch14-facial-head-design-analysis',
    name: 'Facial, Profile & Head-Shape Design Analysis',
    learningObjectiveIds: ['LO-14-02'],
    description: 'Facial shapes, profiles, neck/ear/sideburn considerations, head sections, reference points, and design analysis.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch14-cutting-geometry-guides',
    name: 'Haircut Geometry, Elevation, Guides & Control',
    learningObjectiveIds: ['LO-14-03'],
    description: 'Design lines, elevation, partings, stationary/traveling guides, grain, tension, cross-checking, and haircut control principles.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch14-shear-clipper-razor-texturizing',
    name: 'Shear, Clipper, Razor & Texturizing Techniques',
    learningObjectiveIds: ['LO-14-04'],
    description: 'Tool selection and source-presented cutting techniques using shears, clippers, razors, tapering, thinning, and texturizing methods.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch14-haircut-styles-procedures',
    name: 'Haircut Procedures, Classic Styles & Finish Work',
    learningObjectiveIds: ['LO-14-05'],
    description: 'Preparation, haircut sequencing, classic haircut forms, taper/fade/style recognition, and finishing services.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch14-styling-volume-locks',
    name: 'Styling, Volume, Blowdrying, Cornrows & Locks',
    learningObjectiveIds: ['LO-14-06'],
    description: 'Natural styling, volume building, blowdrying methods, cornrow procedures, and lock formation/maintenance as presented in the runtime.',
    importance: 'supporting',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch14-service-safety-sanitation',
    name: 'Service Safety, Tool Safety & Sanitation',
    learningObjectiveIds: ['LO-14-07'],
    description: 'Thermal safety, razor/sharp safety, head-shave preparation, cleanup, sanitation, cross-contamination prevention, and safe tool handling.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
] as const

export const CHAPTER14_CONCEPT_FAMILY_IDS =
  chapter14ConceptFamilies.map((concept) => concept.id) as readonly Chapter14ConceptFamilyId[]

export const ACTIVE_CHAPTER14_CONCEPT_FAMILY_IDS = CHAPTER14_CONCEPT_FAMILY_IDS

export const isChapter14ConceptFamilyId = (value: string): value is Chapter14ConceptFamilyId =>
  (CHAPTER14_CONCEPT_FAMILY_IDS as readonly string[]).includes(value)

export function getChapter14ConceptFamily(id: Chapter14ConceptFamilyId): Chapter14ConceptFamily {
  const concept = chapter14ConceptFamilies.find((item) => item.id === id)
  if (!concept) throw new Error(`Unknown Chapter 14 concept family: ${id}`)
  return concept
}
