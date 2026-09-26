import type {
  Chapter7ConceptFamily,
  Chapter7ConceptFamilyId,
  Chapter7LearningObjective,
} from './types'

export const chapter7LearningObjectives: readonly Chapter7LearningObjective[] = [
  {
    id: 'LO-7-01',
    statement: 'Differentiate organic and inorganic chemistry in ways that matter to professional barbering products and services.',
    sourceBasis: 'Established professional chemistry subject matter; Chapter 7 source coverage reviewed and rewritten in ASCYN PRO language.',
    conceptFamilyIds: ['ch7-organic-inorganic'],
  },
  {
    id: 'LO-7-02',
    statement: 'Explain matter and the relationships among elements, atoms, molecules, and compounds.',
    sourceBasis: 'Established professional chemistry subject matter; Chapter 7 source coverage reviewed and rewritten in ASCYN PRO language.',
    conceptFamilyIds: ['ch7-matter-structure'],
  },
  {
    id: 'LO-7-03',
    statement: 'Distinguish physical properties and changes from chemical properties and changes.',
    sourceBasis: 'Established professional chemistry subject matter; Chapter 7 source coverage reviewed and rewritten in ASCYN PRO language.',
    conceptFamilyIds: ['ch7-properties-changes'],
  },
  {
    id: 'LO-7-04',
    statement: 'Explain oxidation-reduction and other chemical reactions relevant to barbering services.',
    sourceBasis: 'Established professional chemistry subject matter with official exam-guide relevance for chemical interactions and reactions.',
    conceptFamilyIds: ['ch7-redox-reactions', 'ch7-chemical-safety'],
  },
  {
    id: 'LO-7-05',
    statement: 'Differentiate solutions, suspensions, and emulsions and apply water, pH, acid, alkali, and neutralization concepts safely.',
    sourceBasis: 'Established professional chemistry subject matter with official exam-guide relevance for pH, products, ingredients, and interactions.',
    conceptFamilyIds: ['ch7-mixtures', 'ch7-water-ph', 'ch7-chemical-safety'],
  },
  {
    id: 'LO-7-06',
    statement: 'Select and explain shampoo types using chemistry, hair and scalp needs, and product-purpose reasoning.',
    sourceBasis: 'Established professional product-chemistry subject matter; Chapter 7 source coverage reviewed and rewritten in ASCYN PRO language.',
    conceptFamilyIds: ['ch7-shampoos', 'ch7-chemical-safety'],
  },
  {
    id: 'LO-7-07',
    statement: 'Differentiate conditioner classifications and match conditioner function to client and service needs.',
    sourceBasis: 'Established professional product-chemistry subject matter; Chapter 7 source coverage reviewed and rewritten in ASCYN PRO language.',
    conceptFamilyIds: ['ch7-conditioners', 'ch7-chemical-safety'],
  },
  {
    id: 'LO-7-08',
    statement: 'Recognize other cosmetic preparations used in barbering and reason about their purpose, selection, labeling, and safe use.',
    sourceBasis: 'Established professional product-chemistry subject matter with official exam-guide relevance for ingredients, labeling, product safety, and interactions.',
    conceptFamilyIds: ['ch7-other-preparations', 'ch7-chemical-safety'],
  },
] as const

export const chapter7ConceptFamilies: readonly Chapter7ConceptFamily[] = [
  {
    id: 'ch7-organic-inorganic',
    name: 'Organic & Inorganic Chemistry',
    learningObjectiveIds: ['LO-7-01'],
    description: 'Core differences between organic and inorganic substances, framed around safe professional product understanding.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch7-matter-structure',
    name: 'Matter, Elements, Atoms, Molecules & Compounds',
    learningObjectiveIds: ['LO-7-02'],
    description: 'Matter and basic chemical structure needed to understand professional products and reactions.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'DIRECT_VERIFIED',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch7-properties-changes',
    name: 'Physical & Chemical Properties and Changes',
    learningObjectiveIds: ['LO-7-03'],
    description: 'Physical versus chemical properties and changes, including state changes and service-relevant transformations.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'DIRECT_VERIFIED',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch7-redox-reactions',
    name: 'Oxidation-Reduction & Chemical Reactions',
    learningObjectiveIds: ['LO-7-04'],
    description: 'Oxidation, reduction, reaction behavior, and service applications without unsupported shortcuts or universal claims.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'DIRECT_VERIFIED',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch7-mixtures',
    name: 'Solutions, Suspensions & Emulsions',
    learningObjectiveIds: ['LO-7-05'],
    description: 'Mixture types, their stability and behavior, and how those differences affect professional products.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'DIRECT_VERIFIED',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch7-water-ph',
    name: 'Water, pH, Acids, Alkalis & Neutralization',
    learningObjectiveIds: ['LO-7-05'],
    description: 'Water properties, pH reasoning, acids, alkalis, and neutralization as applied to product selection and chemical services.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'DIRECT_VERIFIED',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch7-shampoos',
    name: 'Shampoo Chemistry & Selection',
    learningObjectiveIds: ['LO-7-06'],
    description: 'Shampoo chemistry, categories, cleansing behavior, and selection based on client and service needs.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'DIRECT_VERIFIED',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch7-conditioners',
    name: 'Conditioner Chemistry & Selection',
    learningObjectiveIds: ['LO-7-07'],
    description: 'Conditioner classifications, purpose, and selection based on hair condition and service needs.',
    importance: 'supporting',
    professionalRelevance: 'CORE',
    examRelevance: 'DIRECT_VERIFIED',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch7-other-preparations',
    name: 'Other Cosmetic Preparations',
    learningObjectiveIds: ['LO-7-08'],
    description: 'Other barbering cosmetic preparations, their professional purposes, product selection, labeling, and safe use.',
    importance: 'supporting',
    professionalRelevance: 'CORE',
    examRelevance: 'DIRECT_VERIFIED',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch7-chemical-safety',
    name: 'Chemical Safety, Labels & Interactions',
    learningObjectiveIds: ['LO-7-04', 'LO-7-05', 'LO-7-06', 'LO-7-07', 'LO-7-08'],
    description: 'Safe product handling, labels, interactions, overexposure risks, and response boundaries across Chapter 7 chemical services.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'DIRECT_VERIFIED',
    sourceProvenance: 'OFFICIAL_EXAM_GUIDE',
    status: 'active',
  },
] as const

export const CHAPTER7_CONCEPT_FAMILY_IDS = chapter7ConceptFamilies.map((x) => x.id) as readonly Chapter7ConceptFamilyId[]
export const ACTIVE_CHAPTER7_CONCEPT_FAMILY_IDS = CHAPTER7_CONCEPT_FAMILY_IDS

export const isChapter7ConceptFamilyId = (value: string): value is Chapter7ConceptFamilyId =>
  (CHAPTER7_CONCEPT_FAMILY_IDS as readonly string[]).includes(value)

export function getChapter7ConceptFamily(id: Chapter7ConceptFamilyId): Chapter7ConceptFamily {
  const family = chapter7ConceptFamilies.find((x) => x.id === id)
  if (!family) throw new Error(`Unknown Chapter 7 concept family: ${id}`)
  return family
}
