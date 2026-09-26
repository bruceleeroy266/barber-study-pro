import type {
  Chapter8ConceptFamily,
  Chapter8ConceptFamilyId,
  Chapter8LearningObjective,
} from './types'

export const chapter8LearningObjectives: readonly Chapter8LearningObjective[] = [
  {
    id: 'LO-8-01',
    statement: 'Explain electricity as energy and describe how a complete circuit, conductors, and insulators affect electrical flow.',
    sourceBasis: 'Chapter 8 source pages 206–207; rewritten in ASCYN PRO language.',
    conceptFamilyIds: ['ch8-electricity-circuits'],
  },
  {
    id: 'LO-8-02',
    statement: 'Differentiate common current types and electrical measurements used to reason about barbering equipment.',
    sourceBasis: 'Chapter 8 source pages 207–209; rewritten in ASCYN PRO language.',
    conceptFamilyIds: ['ch8-current-conversion', 'ch8-electrical-measurements'],
  },
  {
    id: 'LO-8-03',
    statement: 'Apply electrical-equipment safety principles, including overload protection, grounding, protected outlets, inspection, and safe handling.',
    sourceBasis: 'Chapter 8 source pages 209–211 with official exam-guide relevance for electrical tools and equipment safety.',
    conceptFamilyIds: ['ch8-equipment-safety'],
  },
  {
    id: 'LO-8-04',
    statement: 'Explain electrotherapy terminology, polarity, and barber-relevant current modalities within licensing and manufacturer-use boundaries.',
    sourceBasis: 'Chapter 8 source pages 211–213 with official exam-guide relevance for electrotherapy.',
    conceptFamilyIds: [
      'ch8-electrotherapy-terminology',
      'ch8-galvanic-current',
      'ch8-microcurrent-high-frequency',
    ],
  },
  {
    id: 'LO-8-05',
    statement: 'Explain electromagnetic energy, wavelength and frequency relationships, and visible versus invisible light.',
    sourceBasis: 'Chapter 8 source pages 213–216; rewritten in ASCYN PRO language.',
    conceptFamilyIds: ['ch8-electromagnetic-spectrum'],
  },
  {
    id: 'LO-8-06',
    statement: 'Identify light-therapy devices and reason about their professional purpose, client protection, contraindication checks, and safe use.',
    sourceBasis: 'Chapter 8 source pages 216–217 with official exam-guide relevance for light therapy.',
    conceptFamilyIds: ['ch8-light-modalities', 'ch8-light-therapy-safety'],
  },
] as const

export const chapter8ConceptFamilies: readonly Chapter8ConceptFamily[] = [
  {
    id: 'ch8-electricity-circuits',
    name: 'Electricity, Circuits, Conductors & Insulators',
    learningObjectiveIds: ['LO-8-01'],
    description: 'Electricity as energy, electron movement, complete electrical paths, and materials that conduct or resist electrical flow.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'DIRECT_VERIFIED',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch8-current-conversion',
    name: 'Direct Current, Alternating Current & Conversion',
    learningObjectiveIds: ['LO-8-02'],
    description: 'Direct and alternating current plus equipment that changes current form for professional devices.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'DIRECT_VERIFIED',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch8-electrical-measurements',
    name: 'Volts, Amperes, Ohms & Watts',
    learningObjectiveIds: ['LO-8-02'],
    description: 'Electrical pressure, current strength, resistance, power, and relationships used to interpret equipment ratings safely.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'DIRECT_VERIFIED',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch8-equipment-safety',
    name: 'Electrical Equipment Safety & Protective Devices',
    learningObjectiveIds: ['LO-8-03'],
    description: 'Fuses, breakers, grounding, protected outlets, equipment inspection, cords, plugs, overload prevention, and safe handling.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'DIRECT_VERIFIED',
    sourceProvenance: 'OFFICIAL_EXAM_GUIDE',
    status: 'active',
  },
  {
    id: 'ch8-electrotherapy-terminology',
    name: 'Electrotherapy Terminology, Polarity & Electrodes',
    learningObjectiveIds: ['LO-8-04'],
    description: 'Core electrotherapy language, positive and negative poles, electrodes, and modality selection boundaries.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'DIRECT_VERIFIED',
    sourceProvenance: 'OFFICIAL_EXAM_GUIDE',
    status: 'active',
  },
  {
    id: 'ch8-galvanic-current',
    name: 'Galvanic Current & Polarity Effects',
    learningObjectiveIds: ['LO-8-04'],
    description: 'Galvanic-current behavior, pole effects, and service concepts such as ion movement without turning textbook examples into universal treatment rules.',
    importance: 'supporting',
    professionalRelevance: 'CORE',
    examRelevance: 'DIRECT_VERIFIED',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch8-microcurrent-high-frequency',
    name: 'Microcurrent & High-Frequency Modalities',
    learningObjectiveIds: ['LO-8-04'],
    description: 'Characteristics and professional-use reasoning for microcurrent and high-frequency electrotherapy modalities.',
    importance: 'supporting',
    professionalRelevance: 'CORE',
    examRelevance: 'DIRECT_VERIFIED',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch8-electromagnetic-spectrum',
    name: 'Electromagnetic Spectrum, Wavelength & Light',
    learningObjectiveIds: ['LO-8-05'],
    description: 'Electromagnetic energy, wavelength and frequency relationships, and visible, ultraviolet, and infrared regions.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'DIRECT_VERIFIED',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
  },
  {
    id: 'ch8-light-modalities',
    name: 'Light-Therapy Devices & Modalities',
    learningObjectiveIds: ['LO-8-06'],
    description: 'Professional light-therapy devices and modality concepts, including therapeutic lamps and other source-covered device categories.',
    importance: 'supporting',
    professionalRelevance: 'CORE',
    examRelevance: 'DIRECT_VERIFIED',
    sourceProvenance: 'OFFICIAL_EXAM_GUIDE',
    status: 'active',
  },
  {
    id: 'ch8-light-therapy-safety',
    name: 'Light-Therapy Safety, Client Protection & Contraindications',
    learningObjectiveIds: ['LO-8-06'],
    description: 'Client protection, eye protection, supervision, product/skin checks, equipment directions, contraindication reasoning, and scope-of-practice boundaries.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'DIRECT_VERIFIED',
    sourceProvenance: 'OFFICIAL_EXAM_GUIDE',
    status: 'active',
  },
] as const

export const CHAPTER8_CONCEPT_FAMILY_IDS = chapter8ConceptFamilies.map((x) => x.id) as readonly Chapter8ConceptFamilyId[]
export const ACTIVE_CHAPTER8_CONCEPT_FAMILY_IDS = CHAPTER8_CONCEPT_FAMILY_IDS

export const isChapter8ConceptFamilyId = (value: string): value is Chapter8ConceptFamilyId =>
  (CHAPTER8_CONCEPT_FAMILY_IDS as readonly string[]).includes(value)

export function getChapter8ConceptFamily(id: Chapter8ConceptFamilyId): Chapter8ConceptFamily {
  const family = chapter8ConceptFamilies.find((x) => x.id === id)
  if (!family) throw new Error(`Unknown Chapter 8 concept family: ${id}`)
  return family
}
