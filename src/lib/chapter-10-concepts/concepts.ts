import type {
  Chapter10ConceptFamily,
  Chapter10ConceptFamilyId,
  Chapter10LearningObjective,
} from './types'

const sourceBasis =
  'Current Chapter 10 runtime lesson plus repository Chapter 10 analysis/material reports; architecture-only in C10-1 and not independently reverified against the underlying textbook pages or current exam blueprint.'

export const chapter10LearningObjectives: readonly Chapter10LearningObjective[] = [
  {
    id: 'LO-10-01',
    statement: 'Describe the major structures of the hair root, follicle, bulb, dermal papilla, sebaceous gland, and hair shaft.',
    sourceBasis,
    conceptFamilyIds: ['ch10-hair-anatomy-structure'],
  },
  {
    id: 'LO-10-02',
    statement: 'Explain keratinization, peptide bonds, side bonds, and the structural chemistry that affects hair behavior and chemical services.',
    sourceBasis,
    conceptFamilyIds: ['ch10-hair-chemistry-bonds'],
  },
  {
    id: 'LO-10-03',
    statement: 'Describe hair pigment, wave pattern, and common natural growth patterns.',
    sourceBasis,
    conceptFamilyIds: ['ch10-pigment-wave-growth-patterns'],
  },
  {
    id: 'LO-10-04',
    statement: 'Distinguish hair types and explain the normal hair growth cycle.',
    sourceBasis,
    conceptFamilyIds: ['ch10-growth-cycle-hair-types'],
  },
  {
    id: 'LO-10-05',
    statement: 'Analyze hair texture, density, porosity, elasticity, and scalp condition before service decisions.',
    sourceBasis,
    conceptFamilyIds: ['ch10-analysis-properties', 'ch10-service-safety-referral'],
  },
  {
    id: 'LO-10-06',
    statement: 'Recognize the major forms and patterns of abnormal hair loss covered in Chapter 10.',
    sourceBasis,
    conceptFamilyIds: ['ch10-alopecia-hair-loss', 'ch10-service-safety-referral'],
  },
  {
    id: 'LO-10-07',
    statement: 'Recognize common hair-shaft disorders and other noninfectious hair/scalp abnormalities covered in Chapter 10.',
    sourceBasis,
    conceptFamilyIds: ['ch10-hair-shaft-disorders'],
  },
  {
    id: 'LO-10-08',
    statement: 'Recognize contagious, infectious, and parasitic scalp conditions and their service-safety implications.',
    sourceBasis,
    conceptFamilyIds: ['ch10-infectious-parasitic-scalp', 'ch10-service-safety-referral'],
  },
  {
    id: 'LO-10-09',
    statement: 'Apply professional observation, service-pause, sanitation, communication, and referral boundaries without diagnosing or treating medical conditions.',
    sourceBasis,
    conceptFamilyIds: ['ch10-service-safety-referral'],
  },
] as const

export const chapter10ConceptFamilies: readonly Chapter10ConceptFamily[] = [
  {
    id: 'ch10-hair-anatomy-structure',
    name: 'Hair Anatomy, Root Structures & Shaft Layers',
    learningObjectiveIds: ['LO-10-01'],
    description: 'Hair root and shaft anatomy, follicle, bulb, dermal papilla, arrector pili, sebaceous gland, cuticle, cortex, medulla, and supporting structural terminology.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch10-hair-chemistry-bonds',
    name: 'Keratinization, Protein Chemistry & Hair Bonds',
    learningObjectiveIds: ['LO-10-02'],
    description: 'Keratinization, peptide/polypeptide structure, COHNS framing, hydrogen, salt, and disulfide side bonds, and service-relevant bond behavior.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch10-pigment-wave-growth-patterns',
    name: 'Pigment, Wave Pattern & Natural Growth Patterns',
    learningObjectiveIds: ['LO-10-03'],
    description: 'Melanin, gray/white hair distinctions, wave/curl pattern concepts, hair streams, whorls, cowlicks, and other natural directional-growth patterns.',
    importance: 'supporting',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch10-growth-cycle-hair-types',
    name: 'Hair Types, Growth Rate & Growth Cycle',
    learningObjectiveIds: ['LO-10-04'],
    description: 'Growth rate, anagen/catagen/telogen sequence, normal shedding, and other source-supported normal growth-cycle concepts.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch10-analysis-properties',
    name: 'Hair & Scalp Analysis: Texture, Density, Porosity & Elasticity',
    learningObjectiveIds: ['LO-10-05'],
    description: 'Pre-service analysis, observable scalp condition, texture, density, porosity, elasticity, sensory assessment, and chemical-service readiness.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch10-alopecia-hair-loss',
    name: 'Alopecia & Hair-Loss Patterns',
    learningObjectiveIds: ['LO-10-06'],
    description: 'Chapter-covered alopecia terminology, androgenic hair loss, areata, totalis, universalis, and hair-loss recognition without treatment overreach.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch10-hair-shaft-disorders',
    name: 'Hair-Shaft Disorders & Noninfectious Abnormalities',
    learningObjectiveIds: ['LO-10-07'],
    description: 'Trichoptilosis, trichorrhexis nodosa, monilethrix, canities, hypertrichosis, ringed hair, and related source-supported noninfectious recognition targets.',
    importance: 'supporting',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch10-infectious-parasitic-scalp',
    name: 'Infectious, Contagious & Parasitic Scalp Conditions',
    learningObjectiveIds: ['LO-10-08'],
    description: 'Furuncle/carbuncle, folliculitis barbae, tinea conditions, pediculosis, scabies, and other contagious/infectious scalp-condition recognition.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch10-service-safety-referral',
    name: 'Service Safety, Observation Boundaries & Referral',
    learningObjectiveIds: ['LO-10-05', 'LO-10-06', 'LO-10-08', 'LO-10-09'],
    description: 'Barber-facing decisions about analysis, affected-area service safety, sanitation, communication, referral, and the boundary between recognition and medical diagnosis/treatment.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
] as const

export const CHAPTER10_CONCEPT_FAMILY_IDS =
  chapter10ConceptFamilies.map((concept) => concept.id) as readonly Chapter10ConceptFamilyId[]

export const ACTIVE_CHAPTER10_CONCEPT_FAMILY_IDS = CHAPTER10_CONCEPT_FAMILY_IDS

export const isChapter10ConceptFamilyId = (value: string): value is Chapter10ConceptFamilyId =>
  (CHAPTER10_CONCEPT_FAMILY_IDS as readonly string[]).includes(value)

export function getChapter10ConceptFamily(id: Chapter10ConceptFamilyId): Chapter10ConceptFamily {
  const concept = chapter10ConceptFamilies.find((item) => item.id === id)
  if (!concept) throw new Error(`Unknown Chapter 10 concept family: ${id}`)
  return concept
}
