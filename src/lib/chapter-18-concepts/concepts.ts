import type {
  Chapter18ConceptFamily,
  Chapter18ConceptFamilyId,
  Chapter18LearningObjective,
} from './types'

const sourceBasis =
  'Current ASCYN PRO Chapter 18 runtime lesson shell, 50 flashcards, and 15-question chapter assessment. C18-1 defines architecture and mappings only; it does not independently source-certify inherited chemical, safety, manufacturer, regulatory, timing, or exam-certainty wording.'

export const chapter18LearningObjectives: readonly Chapter18LearningObjective[] = [
  {
    id: 'LO-18-01',
    statement: 'Apply hair and scalp analysis concepts that affect haircolor and lightening decisions.',
    sourceBasis,
    conceptFamilyIds: ['ch18-analysis-structure'],
  },
  {
    id: 'LO-18-02',
    statement: 'Apply level, tone, primary/secondary/tertiary, complementary-color, and neutralization concepts.',
    sourceBasis,
    conceptFamilyIds: ['ch18-color-theory'],
  },
  {
    id: 'LO-18-03',
    statement: 'Differentiate temporary, semipermanent, demipermanent, permanent, oxidative, and nonoxidative color products.',
    sourceBasis,
    conceptFamilyIds: ['ch18-color-products'],
  },
  {
    id: 'LO-18-04',
    statement: 'Explain the source-presented roles of developers, lighteners, toners, activators, and decolorization.',
    sourceBasis,
    conceptFamilyIds: ['ch18-developers-lighteners-toners'],
  },
  {
    id: 'LO-18-05',
    statement: 'Apply consultation, strand-testing, application, retouch, highlighting, facial-hair, and record-keeping procedure concepts.',
    sourceBasis,
    conceptFamilyIds: ['ch18-application-consultation-procedures'],
  },
  {
    id: 'LO-18-06',
    statement: 'Apply source-presented correction, gray-coverage, porosity-equalization, tint-back, and filler concepts.',
    sourceBasis,
    conceptFamilyIds: ['ch18-correction-gray-porosity'],
  },
  {
    id: 'LO-18-07',
    statement: 'Apply source-presented chemical-service safety, contraindication, incompatibility, handling, and facial-hair protection concepts.',
    sourceBasis,
    conceptFamilyIds: ['ch18-service-safety-chemical-handling'],
  },
] as const

export const chapter18ConceptFamilies: readonly Chapter18ConceptFamily[] = [
  {
    id: 'ch18-analysis-structure',
    name: 'Hair Analysis & Structure',
    learningObjectiveIds: ['LO-18-01'],
    description: 'Elasticity, texture, density, porosity, natural pigment, gray/white hair, and contributing pigment as inputs to color-service decisions.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
    safetyCritical: false,
  },
  {
    id: 'ch18-color-theory',
    name: 'Color Theory & Neutralization',
    learningObjectiveIds: ['LO-18-02'],
    description: 'Color wheel relationships, primary/secondary/tertiary colors, level, tone, saturation, base color, and complementary neutralization.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
    safetyCritical: false,
  },
  {
    id: 'ch18-color-products',
    name: 'Haircolor Product Classes',
    learningObjectiveIds: ['LO-18-03'],
    description: 'Temporary, semipermanent, demipermanent, permanent, oxidative, and nonoxidative color product distinctions.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
    safetyCritical: false,
  },
  {
    id: 'ch18-developers-lighteners-toners',
    name: 'Developers, Lighteners & Toners',
    learningObjectiveIds: ['LO-18-04'],
    description: 'Developer strength, hydrogen peroxide, activators, lightener classes, decolorization, toning, and overlap/processing considerations.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
    safetyCritical: true,
    safetyRationale: 'Inherited Chapter 18 content ties this concept to peroxide handling, developer strength, lightener overlap, scalp exposure, and overprocessing risk. C18-2 must source-harden the exact rules before C18-6 defines escalation.',
  },
  {
    id: 'ch18-application-consultation-procedures',
    name: 'Consultation & Application Procedures',
    learningObjectiveIds: ['LO-18-05'],
    description: 'Consultation, strand tests, virgin/retouch application, single/double process, highlighting/lowlighting, facial-hair procedure, and record keeping.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
    safetyCritical: false,
  },
  {
    id: 'ch18-correction-gray-porosity',
    name: 'Corrective Color, Gray Coverage & Porosity',
    learningObjectiveIds: ['LO-18-06'],
    description: 'Porosity-sensitive formulation, fillers, tint-back, gray coverage, resistant gray, and corrective support decisions.',
    importance: 'supporting',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
    safetyCritical: false,
  },
  {
    id: 'ch18-service-safety-chemical-handling',
    name: 'Service Safety, Contraindications & Chemical Handling',
    learningObjectiveIds: ['LO-18-07'],
    description: 'Predisposition/patch testing, scalp/skin contraindications, metallic/compound dye incompatibility, PPE, peroxide storage/handling, lightener overlap, and facial-hair product restrictions.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
    safetyCritical: true,
    safetyRationale: 'The current Chapter 18 content explicitly presents allergy testing, scalp irritation, metallic-salt/peroxide incompatibility, peroxide handling, lightener overlap, and facial-hair restrictions as harm-prevention decisions. Exact claims remain pending C18-2 source hardening.',
  },
] as const

export const CHAPTER18_CONCEPT_FAMILY_IDS =
  chapter18ConceptFamilies.map((concept) => concept.id) as readonly Chapter18ConceptFamilyId[]

export const ACTIVE_CHAPTER18_CONCEPT_FAMILY_IDS = CHAPTER18_CONCEPT_FAMILY_IDS

export const CHAPTER18_SAFETY_CRITICAL_CONCEPT_FAMILY_IDS =
  chapter18ConceptFamilies.filter((concept) => concept.safetyCritical).map((concept) => concept.id) as readonly Chapter18ConceptFamilyId[]

export const isChapter18ConceptFamilyId = (value: string): value is Chapter18ConceptFamilyId =>
  (CHAPTER18_CONCEPT_FAMILY_IDS as readonly string[]).includes(value)

export function getChapter18ConceptFamily(id: Chapter18ConceptFamilyId): Chapter18ConceptFamily {
  const concept = chapter18ConceptFamilies.find((item) => item.id === id)
  if (!concept) throw new Error(`Unknown Chapter 18 concept family: ${id}`)
  return concept
}
