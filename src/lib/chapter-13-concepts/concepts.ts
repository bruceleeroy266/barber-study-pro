import type {
  Chapter13ConceptFamily,
  Chapter13ConceptFamilyId,
  Chapter13LearningObjective,
} from './types'

const sourceBasis =
  'Current ASCYN PRO Chapter 13 runtime lesson, 90 active flashcards, and 45-question assessment on the G7-aligned main baseline. C13-1 defines architecture and mappings only; it does not independently certify Milady pages, medical/safety claims, state-rule claims, assessment answer positions, or licensing-exam certainty.'

export const chapter13LearningObjectives: readonly Chapter13LearningObjective[] = [
  {
    id: 'LO-13-01',
    statement: 'Use consultation, observable skin/hair findings, beard preparation, lather, towel, and product-selection decisions to prepare a shaving service.',
    sourceBasis,
    conceptFamilyIds: ['ch13-consultation-service-preparation', 'ch13-infection-control-service-safety'],
  },
  {
    id: 'LO-13-02',
    statement: 'Interpret facial-hair growth direction, grain changes, curly-hair patterns, and ingrown-hair risk when planning shaving technique.',
    sourceBasis,
    conceptFamilyIds: ['ch13-hair-growth-ingrown-prevention'],
  },
  {
    id: 'LO-13-03',
    statement: 'Apply the current Chapter 13 shaving-area sequence and barber body-positioning model to service execution.',
    sourceBasis,
    conceptFamilyIds: ['ch13-shaving-areas-body-positioning'],
  },
  {
    id: 'LO-13-04',
    statement: 'Differentiate razor positions, handling, stroke control, skin stretching, and razor anatomy used in a professional shave.',
    sourceBasis,
    conceptFamilyIds: ['ch13-razor-handling-stretching-technique', 'ch13-infection-control-service-safety'],
  },
  {
    id: 'LO-13-05',
    statement: 'Sequence preparation, hair removal, finishing, shave types, and neck/outline service steps in the professional shave.',
    sourceBasis,
    conceptFamilyIds: ['ch13-professional-shave-procedure'],
  },
  {
    id: 'LO-13-06',
    statement: 'Apply facial-feature analysis and controlled trimming principles to mustache and beard design.',
    sourceBasis,
    conceptFamilyIds: ['ch13-facial-hair-design'],
  },
  {
    id: 'LO-13-07',
    statement: 'Apply infection-control, blade disposal, cut/nick response, equipment stability, service-deferral, and jurisdiction-aware safety decisions.',
    sourceBasis,
    conceptFamilyIds: ['ch13-infection-control-service-safety'],
  },
  {
    id: 'LO-13-08',
    statement: 'Apply client comfort, communication, expectations, satisfaction, and professional-practice decisions throughout shaving and facial-hair services.',
    sourceBasis,
    conceptFamilyIds: ['ch13-client-care-professional-practice'],
  },
] as const

export const chapter13ConceptFamilies: readonly Chapter13ConceptFamily[] = [
  {
    id: 'ch13-consultation-service-preparation',
    name: 'Consultation, Skin/Hair Analysis & Service Preparation',
    learningObjectiveIds: ['LO-13-01'],
    description: 'Observable skin and beard analysis, grain review, product selection, hot-towel/lather preparation, and other pre-service decisions in the current Chapter 13 runtime.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch13-hair-growth-ingrown-prevention',
    name: 'Hair Growth, Grain & Ingrown-Hair Prevention',
    learningObjectiveIds: ['LO-13-02'],
    description: 'Hair-growth direction, grain changes, curly facial-hair patterns, pseudofolliculitis/ingrown-hair discussion, and shave-planning implications.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch13-shaving-areas-body-positioning',
    name: 'Shaving Areas & Barber Body Positioning',
    learningObjectiveIds: ['LO-13-03'],
    description: 'The current 14-area service map, freehand/backhand/reverse-freehand area assignments, head positioning, and barber body placement.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch13-razor-handling-stretching-technique',
    name: 'Razor Handling, Skin Stretching & Stroke Technique',
    learningObjectiveIds: ['LO-13-04'],
    description: 'Razor positions and anatomy, grip, cutting stroke, angle, stroke length/speed, point control, skin stretching, and hand coordination.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch13-professional-shave-procedure',
    name: 'Professional Shave Procedure & Shave Types',
    learningObjectiveIds: ['LO-13-05'],
    description: 'Preparation/shaving/finishing sequence, first- and second-time-over concepts, once-over/close shave, neck shave, outline shave, and service completion.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch13-facial-hair-design',
    name: 'Mustache & Beard Design',
    learningObjectiveIds: ['LO-13-06'],
    description: 'Facial-feature consultation, mustache design, beard design, natural hairlines, trimming tools, proportions, and controlled shaping decisions.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch13-infection-control-service-safety',
    name: 'Infection Control, Service Safety & Regulatory Boundaries',
    learningObjectiveIds: ['LO-13-01', 'LO-13-04', 'LO-13-07'],
    description: 'Unsafe skin findings, towel/heat precautions, blade disposal, cut/nick response, razor-path safety, chair stability, contamination control, and jurisdiction-aware rule checks.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch13-client-care-professional-practice',
    name: 'Client Care, Satisfaction & Professional Practice',
    learningObjectiveIds: ['LO-13-08'],
    description: 'Client expectations, comfort, service quality, dissatisfaction prevention, professional communication, and the role of shaving/facial-hair services in barbering practice.',
    importance: 'supporting',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
] as const

export const CHAPTER13_CONCEPT_FAMILY_IDS =
  chapter13ConceptFamilies.map((concept) => concept.id) as readonly Chapter13ConceptFamilyId[]

export const ACTIVE_CHAPTER13_CONCEPT_FAMILY_IDS = CHAPTER13_CONCEPT_FAMILY_IDS

export const isChapter13ConceptFamilyId = (value: string): value is Chapter13ConceptFamilyId =>
  (CHAPTER13_CONCEPT_FAMILY_IDS as readonly string[]).includes(value)

export function getChapter13ConceptFamily(id: Chapter13ConceptFamilyId): Chapter13ConceptFamily {
  const concept = chapter13ConceptFamilies.find((item) => item.id === id)
  if (!concept) throw new Error(`Unknown Chapter 13 concept family: ${id}`)
  return concept
}
