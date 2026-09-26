import type {
  Chapter9ConceptFamily,
  Chapter9ConceptFamilyId,
  Chapter9LearningObjective,
} from './types'

const sourceBasis =
  'Current Chapter 9 lesson learning-objectives section plus repository Chapter 9 source-analysis reports citing pages 222–240; not independently reverified in C9-1.'

export const chapter9LearningObjectives: readonly Chapter9LearningObjective[] = [
  {
    id: 'LO-9-01',
    statement: 'Describe the structure and divisions of the skin.',
    sourceBasis,
    conceptFamilyIds: ['ch9-epidermis-skin-barrier', 'ch9-dermis-subcutaneous-support'],
  },
  {
    id: 'LO-9-02',
    statement: 'List the functions of the skin.',
    sourceBasis,
    conceptFamilyIds: ['ch9-skin-functions-glands'],
  },
  {
    id: 'LO-9-03',
    statement: 'Identify and describe common primary and secondary skin lesions.',
    sourceBasis,
    conceptFamilyIds: ['ch9-primary-lesions', 'ch9-secondary-lesions'],
  },
  {
    id: 'LO-9-04',
    statement: 'Describe common skin inflammations and infections.',
    sourceBasis,
    conceptFamilyIds: ['ch9-inflammatory-infectious-conditions', 'ch9-service-safety-referral'],
  },
  {
    id: 'LO-9-05',
    statement: 'List and describe disorders of the sebaceous and sudoriferous glands.',
    sourceBasis,
    conceptFamilyIds: ['ch9-sebaceous-sudoriferous-disorders'],
  },
  {
    id: 'LO-9-06',
    statement: 'List and describe types of skin pigmentations.',
    sourceBasis,
    conceptFamilyIds: ['ch9-pigmentation-hypertrophies'],
  },
  {
    id: 'LO-9-07',
    statement: 'Identify common skin hypertrophies.',
    sourceBasis,
    conceptFamilyIds: ['ch9-pigmentation-hypertrophies'],
  },
  {
    id: 'LO-9-08',
    statement: 'Identify and describe types of skin cancer.',
    sourceBasis,
    conceptFamilyIds: ['ch9-skin-cancer-recognition', 'ch9-service-safety-referral'],
  },
] as const

export const chapter9ConceptFamilies: readonly Chapter9ConceptFamily[] = [
  {
    id: 'ch9-epidermis-skin-barrier',
    name: 'Epidermis, Skin Divisions & Barrier Structure',
    learningObjectiveIds: ['LO-9-01'],
    description: 'Skin divisions, epidermal layers, keratinization, barrier structure, thickness, and surface protection concepts.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch9-dermis-subcutaneous-support',
    name: 'Dermis, Subcutaneous Tissue, Nerves & Support',
    learningObjectiveIds: ['LO-9-01'],
    description: 'Dermal layers, blood and lymph supply, nerve fibers, collagen, elastin, and subcutaneous support functions.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch9-skin-functions-glands',
    name: 'Skin Functions, Sebaceous Glands & Sudoriferous Glands',
    learningObjectiveIds: ['LO-9-02'],
    description: 'Protection, sensation, heat regulation, absorption, excretion, secretion, and normal oil/sweat-gland function.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch9-primary-lesions',
    name: 'Primary Skin Lesions',
    learningObjectiveIds: ['LO-9-03'],
    description: 'Recognition and terminology for lesions that first appear as part of a skin condition or injury process.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch9-secondary-lesions',
    name: 'Secondary Skin Lesions',
    learningObjectiveIds: ['LO-9-03'],
    description: 'Recognition and terminology for lesion changes associated with progression, accumulation, damage, or healing.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch9-sebaceous-sudoriferous-disorders',
    name: 'Sebaceous & Sudoriferous Gland Disorders',
    learningObjectiveIds: ['LO-9-05'],
    description: 'Source-covered disorders associated with oil and sweat glands, including acne-related, sebum-related, and perspiration-related conditions.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch9-inflammatory-infectious-conditions',
    name: 'Inflammatory & Infectious Skin Conditions',
    learningObjectiveIds: ['LO-9-04'],
    description: 'Recognition of source-covered inflammatory and infectious conditions and the distinction between condition recognition and diagnosis.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch9-pigmentation-hypertrophies',
    name: 'Pigmentation Changes & Skin Hypertrophies',
    learningObjectiveIds: ['LO-9-06', 'LO-9-07'],
    description: 'Changes in pigmentation plus source-covered skin hypertrophies and abnormal growth terminology.',
    importance: 'supporting',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch9-skin-cancer-recognition',
    name: 'Skin Cancer Recognition & ABCDE Warning Signs',
    learningObjectiveIds: ['LO-9-08'],
    description: 'Source-covered skin-cancer categories and observable warning-sign concepts, without converting recognition into diagnosis.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch9-service-safety-referral',
    name: 'Service Safety, Observation Boundaries & Referral Decisions',
    learningObjectiveIds: ['LO-9-04', 'LO-9-08'],
    description: 'Barber-facing decisions about observing skin, pausing or modifying services, contamination risk, professional boundaries, and referral when a condition is outside barber scope.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
] as const

export const CHAPTER9_CONCEPT_FAMILY_IDS =
  chapter9ConceptFamilies.map((concept) => concept.id) as readonly Chapter9ConceptFamilyId[]

export const ACTIVE_CHAPTER9_CONCEPT_FAMILY_IDS = CHAPTER9_CONCEPT_FAMILY_IDS

export const isChapter9ConceptFamilyId = (value: string): value is Chapter9ConceptFamilyId =>
  (CHAPTER9_CONCEPT_FAMILY_IDS as readonly string[]).includes(value)

export function getChapter9ConceptFamily(id: Chapter9ConceptFamilyId): Chapter9ConceptFamily {
  const concept = chapter9ConceptFamilies.find((item) => item.id === id)
  if (!concept) throw new Error(`Unknown Chapter 9 concept family: ${id}`)
  return concept
}
