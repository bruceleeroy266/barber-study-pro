import type {
  Chapter11ConceptFamily,
  Chapter11ConceptFamilyId,
  Chapter11LearningObjective,
} from './types'

const sourceBasis =
  'Repository Chapter 11 material summary (pages 276–285) plus current Chapter 11 runtime lesson, flashcards, and assessment. C11-1 is architecture-only and does not independently reverify the underlying textbook pages or current exam blueprint.'

export const chapter11LearningObjectives: readonly Chapter11LearningObjective[] = [
  {
    id: 'LO-11-01',
    statement: 'Apply safe draping, shampoo preparation, water-temperature control, client positioning, and shampoo/rinse service procedures.',
    sourceBasis,
    conceptFamilyIds: ['ch11-shampoo-draping-service', 'ch11-service-safety-referral'],
  },
  {
    id: 'LO-11-02',
    statement: 'Analyze observable hair and scalp characteristics and match source-supported shampoo, conditioner, and treatment choices to client needs.',
    sourceBasis,
    conceptFamilyIds: ['ch11-analysis-product-selection'],
  },
  {
    id: 'LO-11-03',
    statement: 'Differentiate and apply Chapter 11 scalp-massage manipulations, sequence, pressure, and service-specific movement patterns.',
    sourceBasis,
    conceptFamilyIds: ['ch11-scalp-massage'],
  },
  {
    id: 'LO-11-04',
    statement: 'Explain the purpose, sequence, and source-supported use of scalp and hair treatments for common non-medical service needs.',
    sourceBasis,
    conceptFamilyIds: ['ch11-scalp-hair-treatments', 'ch11-scalp-condition-recognition'],
  },
  {
    id: 'LO-11-05',
    statement: 'Describe safe use of treatment equipment and adjuncts such as steam, hot towels, and electric massage devices.',
    sourceBasis,
    conceptFamilyIds: ['ch11-treatment-equipment', 'ch11-service-safety-referral'],
  },
  {
    id: 'LO-11-06',
    statement: 'Recognize source-covered scalp and hair conditions relevant to treatment selection without exceeding barbering scope.',
    sourceBasis,
    conceptFamilyIds: ['ch11-scalp-condition-recognition', 'ch11-service-safety-referral'],
  },
  {
    id: 'LO-11-07',
    statement: 'Apply service-stop, sanitation, contraindication, communication, and referral boundaries when a condition makes service unsafe or requires medical care.',
    sourceBasis,
    conceptFamilyIds: ['ch11-service-safety-referral'],
  },
  {
    id: 'LO-11-08',
    statement: 'Apply client-care, home-care, professional communication, and service-practice decisions within the Chapter 11 source scope.',
    sourceBasis,
    conceptFamilyIds: ['ch11-client-care-professional-practice'],
  },
] as const

export const chapter11ConceptFamilies: readonly Chapter11ConceptFamily[] = [
  {
    id: 'ch11-shampoo-draping-service',
    name: 'Draping, Shampoo Preparation & Shampoo/Rinse Service',
    learningObjectiveIds: ['LO-11-01'],
    description: 'Wet/chemical/haircut draping, client positioning, shampoo preparation, water temperature, reclined/inclined methods, and shampoo-service execution.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch11-analysis-product-selection',
    name: 'Hair/Scalp Analysis & Product Selection',
    learningObjectiveIds: ['LO-11-02'],
    description: 'Observable scalp/hair condition, density, texture, porosity, elasticity, consultation, label/manufacturer directions, and matching products to client needs.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch11-scalp-massage',
    name: 'Scalp Massage Manipulations & Sequence',
    learningObjectiveIds: ['LO-11-03'],
    description: 'Rotary, sliding, and back-and-forth manipulations; sequence, pressure, continuity, anatomical areas, and shampoo-versus-treatment movement distinctions.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch11-scalp-hair-treatments',
    name: 'Scalp & Hair Treatment Procedures',
    learningObjectiveIds: ['LO-11-04'],
    description: 'Source-supported treatment purposes, cleanliness/stimulation principles, treatment sequence, hair-tonic procedures, and non-medical corrective care.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch11-treatment-equipment',
    name: 'Treatment Equipment, Steam & Hot Towels',
    learningObjectiveIds: ['LO-11-05'],
    description: 'Scalp steam, hot-towel substitution, electric massage devices, operating variables, and equipment-supported treatment procedure.',
    importance: 'supporting',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch11-scalp-condition-recognition',
    name: 'Scalp Condition Recognition for Service Decisions',
    learningObjectiveIds: ['LO-11-04', 'LO-11-06'],
    description: 'Dry/oily scalp and hair, dandruff/pityriasis, source-covered treatment-relevant conditions, and observable distinctions used for service selection.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch11-service-safety-referral',
    name: 'Contraindications, Service Safety & Referral',
    learningObjectiveIds: ['LO-11-01', 'LO-11-05', 'LO-11-06', 'LO-11-07'],
    description: 'Unsafe-service conditions, parasites/infection boundaries, irritation/abrasion precautions, sanitation, scope limits, and appropriate referral without diagnosis or treatment overreach.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch11-client-care-professional-practice',
    name: 'Client Care, Home Care & Professional Practice',
    learningObjectiveIds: ['LO-11-08'],
    description: 'Client comfort, accommodation, home-care guidance, professional communication, service documentation, and other source-supported professional-practice decisions.',
    importance: 'supporting',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
] as const

export const CHAPTER11_CONCEPT_FAMILY_IDS =
  chapter11ConceptFamilies.map((concept) => concept.id) as readonly Chapter11ConceptFamilyId[]

export const ACTIVE_CHAPTER11_CONCEPT_FAMILY_IDS = CHAPTER11_CONCEPT_FAMILY_IDS

export const isChapter11ConceptFamilyId = (value: string): value is Chapter11ConceptFamilyId =>
  (CHAPTER11_CONCEPT_FAMILY_IDS as readonly string[]).includes(value)

export function getChapter11ConceptFamily(id: Chapter11ConceptFamilyId): Chapter11ConceptFamily {
  const concept = chapter11ConceptFamilies.find((item) => item.id === id)
  if (!concept) throw new Error(`Unknown Chapter 11 concept family: ${id}`)
  return concept
}
