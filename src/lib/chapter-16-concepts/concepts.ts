import type {
  Chapter16ConceptFamily,
  Chapter16ConceptFamilyId,
  Chapter16LearningObjective,
} from './types'

const sourceBasis =
  'Current ASCYN PRO Chapter 16 runtime lesson, 68 flashcards, and 30-question assessment. C16-1 defines architecture and mappings only; it does not independently certify Milady textbook wording, regulatory claims, safety claims, or board-exam certainty.'

export const chapter16LearningObjectives: readonly Chapter16LearningObjective[] = [
  {
    id: 'LO-16-01',
    statement: 'Explain haircut design fundamentals and distinguish the four foundational haircut structures by shape, weight, elevation, movement, and texture.',
    sourceBasis,
    conceptFamilyIds: ['ch16-design-foundations'],
  },
  {
    id: 'LO-16-02',
    statement: 'Recognize and apply the source-presented principles, guides, procedure controls, and common-error checks for blunt cutting.',
    sourceBasis,
    conceptFamilyIds: ['ch16-blunt-cut'],
  },
  {
    id: 'LO-16-03',
    statement: 'Recognize and apply the source-presented principles, elevation, guide control, weight buildup, and procedure checks for graduated cutting.',
    sourceBasis,
    conceptFamilyIds: ['ch16-graduated-cut'],
  },
  {
    id: 'LO-16-04',
    statement: 'Recognize and apply the source-presented 90-degree elevation, equal-length layering, balance, and control principles for uniform layering.',
    sourceBasis,
    conceptFamilyIds: ['ch16-uniform-layer'],
  },
  {
    id: 'LO-16-05',
    statement: 'Recognize and apply the source-presented 180-degree elevation, perimeter preservation, interior layering, and control principles for long layering.',
    sourceBasis,
    conceptFamilyIds: ['ch16-long-layer'],
  },
  {
    id: 'LO-16-06',
    statement: 'Analyze texture, density, growth pattern, curl behavior, and shrinkage when adapting haircut design and technique.',
    sourceBasis,
    conceptFamilyIds: ['ch16-hair-analysis-texture'],
  },
  {
    id: 'LO-16-07',
    statement: 'Differentiate and apply source-presented overdirection, razor, point-cutting, notching, slithering, slicing, carving, and related texturizing decisions.',
    sourceBasis,
    conceptFamilyIds: ['ch16-advanced-techniques-texturizing'],
  },
  {
    id: 'LO-16-08',
    statement: 'Apply source-presented wet styling, wrapping, blow-drying, thermal-styling, finishing, client-education, cleanup, and service-safety principles.',
    sourceBasis,
    conceptFamilyIds: ['ch16-styling-finishing-safety'],
  },
] as const

export const chapter16ConceptFamilies: readonly Chapter16ConceptFamily[] = [
  {
    id: 'ch16-design-foundations',
    name: 'Haircut Design Foundations & Four Core Structures',
    learningObjectiveIds: ['LO-16-01'],
    description: 'Design philosophy, shape, weight, elevation, movement, texture, consultation framing, and comparison of blunt, graduated, uniform-layered, and long-layered structures.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch16-blunt-cut',
    name: 'Blunt Cutting & Perimeter Control',
    learningObjectiveIds: ['LO-16-02'],
    description: 'Natural fall, zero elevation, perimeter and weight line, guides, head position, cutting-line direction, cross-checking, tools, procedures, and common blunt-cut errors.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch16-graduated-cut',
    name: 'Graduated Cutting & Weight Buildup',
    learningObjectiveIds: ['LO-16-03'],
    description: 'Graduation, elevation, traveling and stationary guides, finger angle, silhouette, weight buildup, tools, procedure sequence, and common graduation errors.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch16-uniform-layer',
    name: 'Uniform Layering & 90-Degree Control',
    learningObjectiveIds: ['LO-16-04'],
    description: 'Uniform-layer structure, 90-degree elevation, traveling guide use, equal-length layers, movement, balance, distribution, tools, procedure sequence, and common errors.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch16-long-layer',
    name: 'Long Layering & Perimeter Preservation',
    learningObjectiveIds: ['LO-16-05'],
    description: 'Long-layer structure, 180-degree elevation, perimeter preservation, interior layers, movement, weight reduction, guide control, procedure sequence, and common errors.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch16-hair-analysis-texture',
    name: 'Hair Analysis, Texture, Density & Curl Behavior',
    learningObjectiveIds: ['LO-16-06'],
    description: 'Texture, density, growth patterns, cowlicks, curl pattern, shrinkage, analysis checklist, technique adaptation, and expectation setting.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch16-advanced-techniques-texturizing',
    name: 'Advanced Cutting, Overdirection & Texturizing',
    learningObjectiveIds: ['LO-16-07'],
    description: 'Overdirection, razor cutting, point cutting, notching, freehand notching, slithering, slicing, carving, bulk control, and technique-selection decisions.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch16-styling-finishing-safety',
    name: 'Styling, Finishing, Thermal Safety & Client Education',
    learningObjectiveIds: ['LO-16-08'],
    description: 'Wet styling, wrapping, blow-drying, airflow, brush choice, thermal protection, temperature selection, finishing, client education, sanitation, and cleanup.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
] as const

export const CHAPTER16_CONCEPT_FAMILY_IDS =
  chapter16ConceptFamilies.map((concept) => concept.id) as readonly Chapter16ConceptFamilyId[]

export const ACTIVE_CHAPTER16_CONCEPT_FAMILY_IDS = CHAPTER16_CONCEPT_FAMILY_IDS

export const isChapter16ConceptFamilyId = (value: string): value is Chapter16ConceptFamilyId =>
  (CHAPTER16_CONCEPT_FAMILY_IDS as readonly string[]).includes(value)

export function getChapter16ConceptFamily(id: Chapter16ConceptFamilyId): Chapter16ConceptFamily {
  const concept = chapter16ConceptFamilies.find((item) => item.id === id)
  if (!concept) throw new Error(`Unknown Chapter 16 concept family: ${id}`)
  return concept
}
