import type {
  Chapter15ConceptFamily,
  Chapter15ConceptFamilyId,
  Chapter15LearningObjective,
} from './types'

const sourceBasis =
  'Current ASCYN PRO Chapter 15 runtime lesson, 90 flashcards, and 72-question assessment. C15-1 defines architecture and mappings only; it does not independently verify Milady textbook pages, regulatory claims, state-board requirements, medical claims, or safety wording.'

export const chapter15LearningObjectives: readonly Chapter15LearningObjective[] = [
  {
    id: 'LO-15-01',
    statement: 'Use professional terminology, private consultation practices, expectation setting, ethical communication, and responsible marketing when discussing hair replacement services.',
    sourceBasis,
    conceptFamilyIds: ['ch15-client-consultation-ethics-marketing'],
  },
  {
    id: 'LO-15-02',
    statement: 'Differentiate source-presented nonsurgical and surgical alternatives while maintaining barber scope boundaries and appropriate medical referral.',
    sourceBasis,
    conceptFamilyIds: ['ch15-alternatives-scope-referral'],
  },
  {
    id: 'LO-15-03',
    statement: 'Differentiate source-presented hair materials, base constructions, knotting methods, and manufacturer-selection considerations for replacement systems.',
    sourceBasis,
    conceptFamilyIds: ['ch15-hair-materials-base-construction'],
  },
  {
    id: 'LO-15-04',
    statement: 'Compare stock and custom systems and apply source-presented supply, measurement, and template concepts used to plan a replacement system.',
    sourceBasis,
    conceptFamilyIds: ['ch15-system-selection-measurement-template'],
  },
  {
    id: 'LO-15-05',
    statement: 'Differentiate source-presented attachment methods, bonding considerations, cure timing, and facial-hair-piece attachment decisions.',
    sourceBasis,
    conceptFamilyIds: ['ch15-attachment-methods-bonding'],
  },
  {
    id: 'LO-15-06',
    statement: 'Apply source-presented cleaning, storage, maintenance, and chemical-care limits while protecting system materials and service outcomes.',
    sourceBasis,
    conceptFamilyIds: ['ch15-cleaning-maintenance-chemical-care'],
  },
  {
    id: 'LO-15-07',
    statement: 'Apply source-presented cutting, thinning, slide-cutting, blending, and stock-system customization principles conservatively and safely.',
    sourceBasis,
    conceptFamilyIds: ['ch15-cutting-blending-customization'],
  },
] as const

export const chapter15ConceptFamilies: readonly Chapter15ConceptFamily[] = [
  {
    id: 'ch15-client-consultation-ethics-marketing',
    name: 'Client Consultation, Terminology, Ethics & Marketing',
    learningObjectiveIds: ['LO-15-01'],
    description: 'Professional terminology, consultation privacy, client expectations, ethical communication, model releases, sample presentation, and responsible marketing.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch15-alternatives-scope-referral',
    name: 'Hair-Loss Alternatives, Scope Boundaries & Referral',
    learningObjectiveIds: ['LO-15-02'],
    description: 'Source-presented nonsurgical and surgical alternatives, medication discussion boundaries, barber scope of practice, and referral decisions.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch15-hair-materials-base-construction',
    name: 'Hair Materials, Base Construction & Knotting',
    learningObjectiveIds: ['LO-15-03'],
    description: 'Human, synthetic, and mixed hair; base materials; knotting and injection approaches; and source-presented manufacturer evaluation considerations.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch15-system-selection-measurement-template',
    name: 'System Selection, Measurement & Template Creation',
    learningObjectiveIds: ['LO-15-04'],
    description: 'Stock-versus-custom selection, supplies, measurement, color matching, and template or mold planning for replacement systems.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch15-attachment-methods-bonding',
    name: 'Attachment Methods, Bonding & Cure Control',
    learningObjectiveIds: ['LO-15-05'],
    description: 'Full bonding, tape, lace-front attachment, facial-hair-piece attachment, full wigs, cure timing, and attachment-selection scenarios.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch15-cleaning-maintenance-chemical-care',
    name: 'Cleaning, Maintenance & Chemical Care',
    learningObjectiveIds: ['LO-15-06'],
    description: 'Cleaning methods, water and product limits, storage, maintenance schedules, system rotation, and source-presented chemical-service restrictions.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch15-cutting-blending-customization',
    name: 'Cutting, Blending & System Customization',
    learningObjectiveIds: ['LO-15-07'],
    description: 'Cutting sequence, elevation, slide cutting, thinning, tapering, blending, conservative customization, and tool-quality considerations.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
] as const

export const CHAPTER15_CONCEPT_FAMILY_IDS =
  chapter15ConceptFamilies.map((concept) => concept.id) as readonly Chapter15ConceptFamilyId[]

export const ACTIVE_CHAPTER15_CONCEPT_FAMILY_IDS = CHAPTER15_CONCEPT_FAMILY_IDS

export const isChapter15ConceptFamilyId = (value: string): value is Chapter15ConceptFamilyId =>
  (CHAPTER15_CONCEPT_FAMILY_IDS as readonly string[]).includes(value)

export function getChapter15ConceptFamily(id: Chapter15ConceptFamilyId): Chapter15ConceptFamily {
  const concept = chapter15ConceptFamilies.find((item) => item.id === id)
  if (!concept) throw new Error(`Unknown Chapter 15 concept family: ${id}`)
  return concept
}
