import type { Chapter16ConceptFamilyId } from './types'

export interface Chapter16InstructionalSectionMapping {
  sectionNumber: number
  label: string
  conceptFamilyId: Chapter16ConceptFamilyId
}

export interface Chapter16ContentConceptMapping {
  contentBlockId: string
  conceptFamilyId: Chapter16ConceptFamilyId
}

export interface Chapter16FlashcardConceptMapping {
  flashcardId: `fc-ch16-${string}`
  conceptFamilyId: Chapter16ConceptFamilyId
}

export interface Chapter16QuizQuestionConceptMapping {
  questionId: `qq-16-${string}`
  conceptFamilyId: Chapter16ConceptFamilyId
}

export interface Chapter16MicroCheckPlacement {
  id: `mc-16-${string}`
  afterSectionId: string
  conceptFamilyId: Chapter16ConceptFamilyId
  plannedQuestionCount: number
  purpose: string
}

export const chapter16InstructionalSections: readonly Chapter16InstructionalSectionMapping[] = [
  { sectionNumber: 1, label: 'Chapter Purpose / Welcome', conceptFamilyId: 'ch16-design-foundations' },
  { sectionNumber: 2, label: "Why Women's Haircutting Matters", conceptFamilyId: 'ch16-design-foundations' },
  { sectionNumber: 3, label: 'Haircut Design Philosophy', conceptFamilyId: 'ch16-design-foundations' },
  { sectionNumber: 4, label: 'Four Foundational Haircuts', conceptFamilyId: 'ch16-design-foundations' },
  { sectionNumber: 5, label: 'The Blunt Cut', conceptFamilyId: 'ch16-blunt-cut' },
  { sectionNumber: 6, label: 'The Graduated Cut', conceptFamilyId: 'ch16-graduated-cut' },
  { sectionNumber: 7, label: 'The Uniform Layered Cut', conceptFamilyId: 'ch16-uniform-layer' },
  { sectionNumber: 8, label: 'The Long Layered Cut', conceptFamilyId: 'ch16-long-layer' },
  { sectionNumber: 9, label: 'Hair Analysis: Texture, Density & Curl', conceptFamilyId: 'ch16-hair-analysis-texture' },
  { sectionNumber: 10, label: 'Advanced Cutting & Texturizing Techniques', conceptFamilyId: 'ch16-advanced-techniques-texturizing' },
  { sectionNumber: 11, label: 'Styling & Finishing', conceptFamilyId: 'ch16-styling-finishing-safety' },
]

const mapBlocks = (
  conceptFamilyId: Chapter16ConceptFamilyId,
  ids: readonly string[],
): readonly Chapter16ContentConceptMapping[] =>
  ids.map((contentBlockId) => ({ contentBlockId, conceptFamilyId }))

export const chapter16ContentConceptMappings: readonly Chapter16ContentConceptMapping[] = [
  ...mapBlocks('ch16-design-foundations', [
    'style-studio-welcome',
    'why-womens-haircutting-matters',
    'haircut-design-philosophy',
    'four-foundational-cuts-intro',
    'foundational-cuts-overview',
    'chapter-16-wrap-up',
    'continuous-practice',
    'chapter-16-closing-quote',
  ]),
  ...mapBlocks('ch16-blunt-cut', [
    'blunt-cut-introduction',
    'why-blunt-cut-matters',
    'blunt-design-principles',
    'blunt-cut-key-terms',
    'blunt-cut-figures',
    'blunt-cut-tools',
    'blunt-cut-procedure-sequence',
    'blunt-cut-board-alerts',
    'blunt-cut-memory-anchors',
    'blunt-cut-common-mistakes',
    'blunt-cut-instructor-tips',
    'blunt-cut-scenario',
  ]),
  ...mapBlocks('ch16-graduated-cut', [
    'graduated-cut-introduction',
    'why-graduated-cut-matters',
    'graduated-design-principles',
    'graduated-cut-key-terms',
    'graduated-cut-figure',
    'graduated-cut-tools',
    'graduated-cut-procedure-sequence',
    'graduated-cut-board-alerts',
    'graduated-cut-memory-anchors',
    'graduated-cut-common-mistakes',
    'graduated-cut-instructor-tips',
    'graduated-cut-scenario',
  ]),
  ...mapBlocks('ch16-uniform-layer', [
    'uniform-layer-introduction',
    'why-uniform-layer-matters',
    'uniform-layer-design-principles',
    'uniform-layer-key-terms',
    'uniform-layer-figures',
    'uniform-layer-tools',
    'uniform-layer-procedure-sequence',
    'uniform-layer-board-alerts',
    'uniform-layer-memory-anchors',
    'uniform-layer-common-mistakes',
    'uniform-layer-instructor-tips',
    'uniform-layer-scenario',
  ]),
  ...mapBlocks('ch16-long-layer', [
    'long-layer-introduction',
    'why-long-layer-matters',
    'long-layer-design-principles',
    'long-layer-key-terms',
    'long-layer-figures',
    'long-layer-tools',
    'long-layer-procedure-sequence',
    'long-layer-board-alerts',
    'long-layer-memory-anchors',
    'long-layer-common-mistakes',
    'long-layer-instructor-tips',
    'long-layer-scenario',
  ]),
  ...mapBlocks('ch16-hair-analysis-texture', [
    'texture-density-curly-introduction',
    'why-hair-analysis-matters',
    'hair-texture-types',
    'hair-density-types',
    'texture-density-effects',
    'curly-hair-fundamentals',
    'hair-analysis-checklist',
    'texture-curly-figures',
    'texture-curly-board-alerts',
    'texture-curly-memory-anchors',
    'texture-curly-common-mistakes',
    'texture-curly-instructor-tips',
    'texture-curly-scenario',
  ]),
  ...mapBlocks('ch16-advanced-techniques-texturizing', [
    'advanced-techniques-introduction',
    'why-advanced-techniques-matter',
    'overdirection-explained',
    'razor-cutting-explained',
    'texturizing-techniques',
    'advanced-techniques-figures',
    'advanced-techniques-board-alerts',
    'advanced-techniques-memory-anchors',
    'advanced-techniques-common-mistakes',
    'advanced-techniques-instructor-tips',
    'advanced-techniques-scenario',
  ]),
  ...mapBlocks('ch16-styling-finishing-safety', [
    'styling-introduction',
    'why-styling-matters',
    'wet-styling',
    'hair-wrapping',
    'blow-dry-styling',
    'thermal-styling',
    'finishing-the-service',
    'styling-figures',
    'styling-board-alerts',
    'styling-memory-anchors',
    'styling-common-mistakes',
    'styling-instructor-tips',
    'styling-scenario',
  ]),
]

const fc = (n: number): `fc-ch16-${string}` => `fc-ch16-${String(n).padStart(3, '0')}`
const q = (n: number): `qq-16-${string}` => `qq-16-${String(n).padStart(3, '0')}`
const mapped = <T extends number>(
  conceptFamilyId: Chapter16ConceptFamilyId,
  numbers: readonly T[],
): readonly { flashcardId: `fc-ch16-${string}`; conceptFamilyId: Chapter16ConceptFamilyId }[] =>
  numbers.map((n) => ({ flashcardId: fc(n), conceptFamilyId }))

export const chapter16FlashcardConceptMappings: readonly Chapter16FlashcardConceptMapping[] = [
  ...mapped('ch16-design-foundations', [1,2,3,4,5,6,7,8,9,44,45,56]),
  ...mapped('ch16-blunt-cut', [10,11,12,13,14,15,21,46,57]),
  ...mapped('ch16-graduated-cut', [16,17,18,22,23,47,58,59]),
  ...mapped('ch16-uniform-layer', [24,25,26,48,60]),
  ...mapped('ch16-long-layer', [27,28,29,30,49,61]),
  ...mapped('ch16-hair-analysis-texture', [19,20,31,32,33,34,50,51]),
  ...mapped('ch16-advanced-techniques-texturizing', [35,36,37,38,39,52,53,54,62,63]),
  ...mapped('ch16-styling-finishing-safety', [40,41,42,43,55,64,65,66,67,68]),
]

const mapQuestions = (
  conceptFamilyId: Chapter16ConceptFamilyId,
  start: number,
  end: number,
): readonly Chapter16QuizQuestionConceptMapping[] =>
  Array.from({ length: end - start + 1 }, (_, i) => ({
    questionId: q(start + i),
    conceptFamilyId,
  }))

export const chapter16QuizQuestionConceptMappings: readonly Chapter16QuizQuestionConceptMapping[] = [
  ...mapQuestions('ch16-design-foundations', 1, 6),
  ...mapQuestions('ch16-blunt-cut', 7, 10),
  ...mapQuestions('ch16-graduated-cut', 11, 14),
  ...mapQuestions('ch16-uniform-layer', 15, 16),
  ...mapQuestions('ch16-long-layer', 17, 18),
  ...mapQuestions('ch16-hair-analysis-texture', 19, 20),
  ...mapQuestions('ch16-advanced-techniques-texturizing', 21, 26),
  ...mapQuestions('ch16-styling-finishing-safety', 27, 30),
]

export const chapter16MicroCheckPlacements: readonly Chapter16MicroCheckPlacement[] = [
  {
    id: 'mc-16-01',
    afterSectionId: 'foundational-cuts-overview',
    conceptFamilyId: 'ch16-design-foundations',
    plannedQuestionCount: 2,
    purpose: 'Check design elements and differentiation of the four foundational haircut structures.',
  },
  {
    id: 'mc-16-02',
    afterSectionId: 'blunt-cut-scenario',
    conceptFamilyId: 'ch16-blunt-cut',
    plannedQuestionCount: 2,
    purpose: 'Check zero elevation, natural fall, guide control, head position, and blunt perimeter decisions.',
  },
  {
    id: 'mc-16-03',
    afterSectionId: 'graduated-cut-scenario',
    conceptFamilyId: 'ch16-graduated-cut',
    plannedQuestionCount: 2,
    purpose: 'Check elevation, guide selection, weight buildup, finger angle, and graduated-shape decisions.',
  },
  {
    id: 'mc-16-04',
    afterSectionId: 'uniform-layer-scenario',
    conceptFamilyId: 'ch16-uniform-layer',
    plannedQuestionCount: 2,
    purpose: 'Check 90-degree elevation, equal-length layering, balance, and traveling-guide control.',
  },
  {
    id: 'mc-16-05',
    afterSectionId: 'long-layer-scenario',
    conceptFamilyId: 'ch16-long-layer',
    plannedQuestionCount: 2,
    purpose: 'Check 180-degree elevation, perimeter preservation, interior layering, and weight reduction.',
  },
  {
    id: 'mc-16-06',
    afterSectionId: 'texture-curly-scenario',
    conceptFamilyId: 'ch16-hair-analysis-texture',
    plannedQuestionCount: 2,
    purpose: 'Check texture, density, growth pattern, curl shrinkage, and design adaptation.',
  },
  {
    id: 'mc-16-07',
    afterSectionId: 'advanced-techniques-scenario',
    conceptFamilyId: 'ch16-advanced-techniques-texturizing',
    plannedQuestionCount: 2,
    purpose: 'Check overdirection, razor suitability, and texturizing-technique selection.',
  },
  {
    id: 'mc-16-08',
    afterSectionId: 'styling-scenario',
    conceptFamilyId: 'ch16-styling-finishing-safety',
    plannedQuestionCount: 2,
    purpose: 'Check styling, thermal safety, finishing, client education, sanitation, and cleanup decisions.',
  },
]

export function getChapter16ContentBlocksForConcept(conceptFamilyId: Chapter16ConceptFamilyId) {
  return chapter16ContentConceptMappings
    .filter((mapping) => mapping.conceptFamilyId === conceptFamilyId)
    .map((mapping) => mapping.contentBlockId)
}

export function getChapter16FlashcardsForConcept(conceptFamilyId: Chapter16ConceptFamilyId) {
  return chapter16FlashcardConceptMappings
    .filter((mapping) => mapping.conceptFamilyId === conceptFamilyId)
    .map((mapping) => mapping.flashcardId)
}

export function getChapter16QuizQuestionsForConcept(conceptFamilyId: Chapter16ConceptFamilyId) {
  return chapter16QuizQuestionConceptMappings
    .filter((mapping) => mapping.conceptFamilyId === conceptFamilyId)
    .map((mapping) => mapping.questionId)
}
