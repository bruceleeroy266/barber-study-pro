import type {
  Chapter12ConceptFamily,
  Chapter12ConceptFamilyId,
  Chapter12LearningObjective,
} from './types'

const sourceBasis =
  'Current ASCYN PRO Chapter 12 runtime lesson, 115 flashcards, and 45-question assessment. C12-1 defines architecture and mappings only; it does not independently verify textbook pages, numerical claims, medical claims, or board-exam certainty.'

export const chapter12LearningObjectives: readonly Chapter12LearningObjective[] = [
  {
    id: 'LO-12-01',
    statement: 'Identify facial, head, and neck anatomy, nerves, muscles, arteries, and veins relevant to facial-service application.',
    sourceBasis,
    conceptFamilyIds: ['ch12-facial-anatomy-neurovascular'],
  },
  {
    id: 'LO-12-02',
    statement: 'Differentiate facial massage principles, manipulations, direction, pressure, duration, and service application.',
    sourceBasis,
    conceptFamilyIds: ['ch12-massage-principles-manipulations', 'ch12-contraindications-service-safety'],
  },
  {
    id: 'LO-12-03',
    statement: 'Describe source-presented facial equipment and electrotherapy modalities and apply their operating and safety boundaries.',
    sourceBasis,
    conceptFamilyIds: ['ch12-equipment-electrotherapy', 'ch12-contraindications-service-safety'],
  },
  {
    id: 'LO-12-04',
    statement: 'Analyze observable skin characteristics and select cosmetic products appropriate to the service plan.',
    sourceBasis,
    conceptFamilyIds: ['ch12-skin-analysis-product-selection'],
  },
  {
    id: 'LO-12-05',
    statement: 'Sequence and apply source-presented facial-treatment procedures, masks, massage, heat, and finishing steps within barbering scope.',
    sourceBasis,
    conceptFamilyIds: ['ch12-facial-treatment-procedures'],
  },
  {
    id: 'LO-12-06',
    statement: 'Apply sanitation, infection-control, product-handling, and contamination-prevention practices during facial services.',
    sourceBasis,
    conceptFamilyIds: ['ch12-sanitation-infection-control'],
  },
  {
    id: 'LO-12-07',
    statement: 'Recognize contraindications and unsafe-service conditions and choose appropriate service-stop, scope, and referral decisions.',
    sourceBasis,
    conceptFamilyIds: ['ch12-contraindications-service-safety'],
  },
  {
    id: 'LO-12-08',
    statement: 'Apply consultation, client-comfort, service-planning, product-presentation, and professional-practice decisions within Chapter 12 scope.',
    sourceBasis,
    conceptFamilyIds: ['ch12-client-care-professional-practice'],
  },
] as const

export const chapter12ConceptFamilies: readonly Chapter12ConceptFamily[] = [
  {
    id: 'ch12-facial-anatomy-neurovascular',
    name: 'Facial Anatomy, Muscles, Nerves & Circulation',
    learningObjectiveIds: ['LO-12-01'],
    description: 'Muscles, cranial and cervical nerves, arteries, veins, and other anatomical structures used to understand facial-service application.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch12-massage-principles-manipulations',
    name: 'Massage Principles, Manipulations & Direction',
    learningObjectiveIds: ['LO-12-02'],
    description: 'Massage effects, motor/trigger points, effleurage, petrissage, friction, tapotement, vibration, feathering, direction, pressure, and duration.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch12-equipment-electrotherapy',
    name: 'Facial Equipment & Electrotherapy',
    learningObjectiveIds: ['LO-12-03'],
    description: 'Electric massagers, brush machines, steamers, hot-towel equipment, high-frequency, galvanic, microcurrent, microdermabrasion, and light/heat modalities as presented in the current runtime.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch12-skin-analysis-product-selection',
    name: 'Skin Analysis & Product Selection',
    learningObjectiveIds: ['LO-12-04'],
    description: 'Skin types, consultation findings, analysis tools, cleansers, tonics/astringents, moisturizers, exfoliation, masks, and matching cosmetic products to observable needs.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch12-facial-treatment-procedures',
    name: 'Facial Treatment Procedures & Service Sequence',
    learningObjectiveIds: ['LO-12-05'],
    description: 'Basic and specialty facial procedures, masks, treatment sequence, massage integration, heat/cooling steps, and service finishing.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch12-sanitation-infection-control',
    name: 'Sanitation, Infection Control & Product Handling',
    learningObjectiveIds: ['LO-12-06'],
    description: 'Hand hygiene, surface/tool disinfection, clean linens, single-use items, contamination prevention, spatula use, gloves, and safe product handling.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch12-contraindications-service-safety',
    name: 'Contraindications, Service Safety & Referral',
    learningObjectiveIds: ['LO-12-02', 'LO-12-03', 'LO-12-07'],
    description: 'Massage/equipment contraindications, inflamed or unsafe conditions, electrical safety, heat/towel safety, scope boundaries, and appropriate referral without diagnosis.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch12-client-care-professional-practice',
    name: 'Client Consultation, Care & Professional Practice',
    learningObjectiveIds: ['LO-12-08'],
    description: 'Consultation, client expectations, male-grooming service context, product presentation, comfort, service planning, and other professional-practice decisions.',
    importance: 'supporting',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
] as const

export const CHAPTER12_CONCEPT_FAMILY_IDS =
  chapter12ConceptFamilies.map((concept) => concept.id) as readonly Chapter12ConceptFamilyId[]

export const ACTIVE_CHAPTER12_CONCEPT_FAMILY_IDS = CHAPTER12_CONCEPT_FAMILY_IDS

export const isChapter12ConceptFamilyId = (value: string): value is Chapter12ConceptFamilyId =>
  (CHAPTER12_CONCEPT_FAMILY_IDS as readonly string[]).includes(value)

export function getChapter12ConceptFamily(id: Chapter12ConceptFamilyId): Chapter12ConceptFamily {
  const concept = chapter12ConceptFamilies.find((item) => item.id === id)
  if (!concept) throw new Error(`Unknown Chapter 12 concept family: ${id}`)
  return concept
}
