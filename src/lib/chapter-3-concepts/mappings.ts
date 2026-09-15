/**
 * Chapter 3 Concept Foundation — Asset-to-Concept Mappings
 *
 * Maps all Chapter 3 production assets to the four locked concept families:
 *   ch3-healthful-habits   (LO-3-01)
 *   ch3-professional-image (LO-3-02)
 *   ch3-ergonomics         (LO-3-03)
 *   ch3-human-relations    (LO-3-04)
 *
 * Future systems (detection, remediation, reassessment — C3-2+) consume
 * this stable concept identity. C3-1 wires no behavior.
 *
 * Verified against the canonical banks at authoring time; integrity tests
 * (chapter-3-content-integrity.test.ts) enforce coverage and orphan-freedom.
 */

import type {
  Chapter3ConceptFamilyId,
  Chapter3ContentConceptMapping,
  Chapter3FlashcardConceptMapping,
  Chapter3QuizQuestionConceptMapping,
} from './types'

// ───────────────────────────────────────────────
// Flashcard → Concept (48 active core cards)
// ───────────────────────────────────────────────

export const chapter3FlashcardConceptMappings: readonly Chapter3FlashcardConceptMapping[] = [
  // LO1 · Healthful Habits (12)
  { flashcardId: 'fc-3-001', conceptFamilyId: 'ch3-healthful-habits' },
  { flashcardId: 'fc-3-002', conceptFamilyId: 'ch3-healthful-habits' },
  { flashcardId: 'fc-3-004', conceptFamilyId: 'ch3-healthful-habits' },
  { flashcardId: 'fc-3-040', conceptFamilyId: 'ch3-healthful-habits' },
  { flashcardId: 'fc-3-041', conceptFamilyId: 'ch3-healthful-habits' },
  { flashcardId: 'fc-3-042', conceptFamilyId: 'ch3-healthful-habits' },
  { flashcardId: 'fc-3-043', conceptFamilyId: 'ch3-healthful-habits' },
  { flashcardId: 'fc-3-044', conceptFamilyId: 'ch3-healthful-habits' },
  { flashcardId: 'fc-3-045', conceptFamilyId: 'ch3-healthful-habits' },
  { flashcardId: 'fc-3-046', conceptFamilyId: 'ch3-healthful-habits' },
  { flashcardId: 'fc-3-047', conceptFamilyId: 'ch3-healthful-habits' },
  { flashcardId: 'fc-3-048', conceptFamilyId: 'ch3-healthful-habits' },

  // LO2 · Professional Image & Grooming (12)
  { flashcardId: 'fc-3-003', conceptFamilyId: 'ch3-professional-image' },
  { flashcardId: 'fc-3-005', conceptFamilyId: 'ch3-professional-image' },
  { flashcardId: 'fc-3-006', conceptFamilyId: 'ch3-professional-image' },
  { flashcardId: 'fc-3-007', conceptFamilyId: 'ch3-professional-image' },
  { flashcardId: 'fc-3-008', conceptFamilyId: 'ch3-professional-image' },
  { flashcardId: 'fc-3-009', conceptFamilyId: 'ch3-professional-image' },
  { flashcardId: 'fc-3-010', conceptFamilyId: 'ch3-professional-image' },
  { flashcardId: 'fc-3-011', conceptFamilyId: 'ch3-professional-image' },
  { flashcardId: 'fc-3-012', conceptFamilyId: 'ch3-professional-image' },
  { flashcardId: 'fc-3-033', conceptFamilyId: 'ch3-professional-image' },
  { flashcardId: 'fc-3-049', conceptFamilyId: 'ch3-professional-image' },
  { flashcardId: 'fc-3-050', conceptFamilyId: 'ch3-professional-image' },

  // LO3 · Ergonomics & Body Mechanics (12)
  { flashcardId: 'fc-3-014', conceptFamilyId: 'ch3-ergonomics' },
  { flashcardId: 'fc-3-028', conceptFamilyId: 'ch3-ergonomics' },
  { flashcardId: 'fc-3-037', conceptFamilyId: 'ch3-ergonomics' },
  { flashcardId: 'fc-3-038', conceptFamilyId: 'ch3-ergonomics' },
  { flashcardId: 'fc-3-039', conceptFamilyId: 'ch3-ergonomics' },
  { flashcardId: 'fc-3-051', conceptFamilyId: 'ch3-ergonomics' },
  { flashcardId: 'fc-3-052', conceptFamilyId: 'ch3-ergonomics' },
  { flashcardId: 'fc-3-053', conceptFamilyId: 'ch3-ergonomics' },
  { flashcardId: 'fc-3-054', conceptFamilyId: 'ch3-ergonomics' },
  { flashcardId: 'fc-3-055', conceptFamilyId: 'ch3-ergonomics' },
  { flashcardId: 'fc-3-056', conceptFamilyId: 'ch3-ergonomics' },
  { flashcardId: 'fc-3-057', conceptFamilyId: 'ch3-ergonomics' },

  // LO4 · Human Relations & Communication (12)
  { flashcardId: 'fc-3-016', conceptFamilyId: 'ch3-human-relations' },
  { flashcardId: 'fc-3-018', conceptFamilyId: 'ch3-human-relations' },
  { flashcardId: 'fc-3-019', conceptFamilyId: 'ch3-human-relations' },
  { flashcardId: 'fc-3-021', conceptFamilyId: 'ch3-human-relations' },
  { flashcardId: 'fc-3-022', conceptFamilyId: 'ch3-human-relations' },
  { flashcardId: 'fc-3-031', conceptFamilyId: 'ch3-human-relations' },
  { flashcardId: 'fc-3-034', conceptFamilyId: 'ch3-human-relations' },
  { flashcardId: 'fc-3-035', conceptFamilyId: 'ch3-human-relations' },
  { flashcardId: 'fc-3-058', conceptFamilyId: 'ch3-human-relations' },
  { flashcardId: 'fc-3-059', conceptFamilyId: 'ch3-human-relations' },
  { flashcardId: 'fc-3-060', conceptFamilyId: 'ch3-human-relations' },
  { flashcardId: 'fc-3-061', conceptFamilyId: 'ch3-human-relations' },
] as const

// ───────────────────────────────────────────────
// Quiz Question → Concept (30 questions)
// ───────────────────────────────────────────────

export const chapter3QuizQuestionConceptMappings: readonly Chapter3QuizQuestionConceptMapping[] = [
  // LO1 · Healthful Habits (8)
  { questionId: 'qq-3-001', conceptFamilyId: 'ch3-healthful-habits' },
  { questionId: 'qq-3-002', conceptFamilyId: 'ch3-healthful-habits' },
  { questionId: 'qq-3-004', conceptFamilyId: 'ch3-healthful-habits' },
  { questionId: 'qq-3-031', conceptFamilyId: 'ch3-healthful-habits' },
  { questionId: 'qq-3-032', conceptFamilyId: 'ch3-healthful-habits' },
  { questionId: 'qq-3-033', conceptFamilyId: 'ch3-healthful-habits' },
  { questionId: 'qq-3-034', conceptFamilyId: 'ch3-healthful-habits' },
  { questionId: 'qq-3-035', conceptFamilyId: 'ch3-healthful-habits' },

  // LO2 · Professional Image & Grooming (7)
  { questionId: 'qq-3-003', conceptFamilyId: 'ch3-professional-image' },
  { questionId: 'qq-3-005', conceptFamilyId: 'ch3-professional-image' },
  { questionId: 'qq-3-007', conceptFamilyId: 'ch3-professional-image' },
  { questionId: 'qq-3-008', conceptFamilyId: 'ch3-professional-image' },
  { questionId: 'qq-3-009', conceptFamilyId: 'ch3-professional-image' },
  { questionId: 'qq-3-012', conceptFamilyId: 'ch3-professional-image' },
  { questionId: 'qq-3-036', conceptFamilyId: 'ch3-professional-image' },

  // LO3 · Ergonomics & Body Mechanics (8)
  { questionId: 'qq-3-014', conceptFamilyId: 'ch3-ergonomics' },
  { questionId: 'qq-3-028', conceptFamilyId: 'ch3-ergonomics' },
  { questionId: 'qq-3-037', conceptFamilyId: 'ch3-ergonomics' },
  { questionId: 'qq-3-038', conceptFamilyId: 'ch3-ergonomics' },
  { questionId: 'qq-3-039', conceptFamilyId: 'ch3-ergonomics' },
  { questionId: 'qq-3-040', conceptFamilyId: 'ch3-ergonomics' },
  { questionId: 'qq-3-041', conceptFamilyId: 'ch3-ergonomics' },
  { questionId: 'qq-3-042', conceptFamilyId: 'ch3-ergonomics' },

  // LO4 · Human Relations & Communication (7)
  { questionId: 'qq-3-016', conceptFamilyId: 'ch3-human-relations' },
  { questionId: 'qq-3-018', conceptFamilyId: 'ch3-human-relations' },
  { questionId: 'qq-3-019', conceptFamilyId: 'ch3-human-relations' },
  { questionId: 'qq-3-021', conceptFamilyId: 'ch3-human-relations' },
  { questionId: 'qq-3-022', conceptFamilyId: 'ch3-human-relations' },
  { questionId: 'qq-3-043', conceptFamilyId: 'ch3-human-relations' },
  { questionId: 'qq-3-044', conceptFamilyId: 'ch3-human-relations' },
] as const

// ───────────────────────────────────────────────
// Lesson Content Block → Concept (46 blocks)
// ───────────────────────────────────────────────

export const chapter3ContentConceptMappings: readonly Chapter3ContentConceptMapping[] = [
  // Why image matters + wardrobe/prep (LO2)
  { contentBlockId: 'why-image-matters', conceptFamilyId: 'ch3-professional-image' },
  { contentBlockId: 'daily-prep-checklist', conceptFamilyId: 'ch3-professional-image' },
  { contentBlockId: 'dress-standards', conceptFamilyId: 'ch3-professional-image' },
  { contentBlockId: 'professionalism-levels', conceptFamilyId: 'ch3-professional-image' },
  { contentBlockId: 'luxury-tips', conceptFamilyId: 'ch3-professional-image' },
  { contentBlockId: 'ch3-closing-quote', conceptFamilyId: 'ch3-professional-image' },

  // Healthful habits (LO1)
  { contentBlockId: 'hygiene-grooming', conceptFamilyId: 'ch3-healthful-habits' },
  { contentBlockId: 'healthful-habits', conceptFamilyId: 'ch3-healthful-habits' },
  { contentBlockId: 'physical-health', conceptFamilyId: 'ch3-healthful-habits' },
  { contentBlockId: 'health-tips', conceptFamilyId: 'ch3-healthful-habits' },
  { contentBlockId: 'stress-intro', conceptFamilyId: 'ch3-healthful-habits' },
  { contentBlockId: 'moment-techniques', conceptFamilyId: 'ch3-healthful-habits' },
  { contentBlockId: 'long-term-strategies', conceptFamilyId: 'ch3-healthful-habits' },
  { contentBlockId: 'burnout-signs', conceptFamilyId: 'ch3-healthful-habits' },

  // Ergonomics & body mechanics (LO3)
  { contentBlockId: 'ergonomics-foundations', conceptFamilyId: 'ch3-ergonomics' },
  { contentBlockId: 'client-chair', conceptFamilyId: 'ch3-ergonomics' },
  { contentBlockId: 'your-position', conceptFamilyId: 'ch3-ergonomics' },
  { contentBlockId: 'common-injuries', conceptFamilyId: 'ch3-ergonomics' },
  { contentBlockId: 'equipment-ergonomics', conceptFamilyId: 'ch3-ergonomics' },
  { contentBlockId: 'posture-intro', conceptFamilyId: 'ch3-ergonomics' },
  { contentBlockId: 'posture-guidelines', conceptFamilyId: 'ch3-ergonomics' },
  { contentBlockId: 'common-posture-problems', conceptFamilyId: 'ch3-ergonomics' },
  { contentBlockId: 'stress-relief-intro', conceptFamilyId: 'ch3-ergonomics' },
  { contentBlockId: 'stress-relief-exercises', conceptFamilyId: 'ch3-ergonomics' },

  // Human relations & communication (LO4)
  { contentBlockId: 'human-relations-foundations', conceptFamilyId: 'ch3-human-relations' },
  { contentBlockId: 'communication', conceptFamilyId: 'ch3-human-relations' },
  { contentBlockId: 'consultation-scenarios', conceptFamilyId: 'ch3-human-relations' },
  { contentBlockId: 'client-confidence', conceptFamilyId: 'ch3-human-relations' },
  { contentBlockId: 'showcasing-work', conceptFamilyId: 'ch3-human-relations' },
  { contentBlockId: 'what-to-avoid', conceptFamilyId: 'ch3-human-relations' },
  { contentBlockId: 'social-guidelines', conceptFamilyId: 'ch3-human-relations' },
  { contentBlockId: 'manners-intro', conceptFamilyId: 'ch3-human-relations' },
  { contentBlockId: 'mannerisms-do-dont', conceptFamilyId: 'ch3-human-relations' },
  { contentBlockId: 'good-manners-checklist', conceptFamilyId: 'ch3-human-relations' },
  { contentBlockId: 'communication-framework-intro', conceptFamilyId: 'ch3-human-relations' },
  { contentBlockId: 'communication-steps', conceptFamilyId: 'ch3-human-relations' },
  { contentBlockId: 'communication-pro-tip', conceptFamilyId: 'ch3-human-relations' },
  { contentBlockId: 'professional-reflections', conceptFamilyId: 'ch3-human-relations' },
  { contentBlockId: 'conversation-intro', conceptFamilyId: 'ch3-human-relations' },
  { contentBlockId: 'conversation-topics', conceptFamilyId: 'ch3-human-relations' },
  { contentBlockId: 'confidentiality-checklist', conceptFamilyId: 'ch3-human-relations' },
  { contentBlockId: 'social-media-expanded', conceptFamilyId: 'ch3-human-relations' },
  { contentBlockId: 'social-media-dos-donts', conceptFamilyId: 'ch3-human-relations' },
  { contentBlockId: 'social-media-activities', conceptFamilyId: 'ch3-human-relations' },
  { contentBlockId: 'final-professional-scenarios', conceptFamilyId: 'ch3-human-relations' },
] as const

// ───────────────────────────────────────────────
// Lookup helpers (future C3-2 consumers + tests)
// ───────────────────────────────────────────────

const flashcardMap = new Map(
  chapter3FlashcardConceptMappings.map((m) => [m.flashcardId, m.conceptFamilyId])
)
const quizQuestionMap = new Map(
  chapter3QuizQuestionConceptMappings.map((m) => [m.questionId, m.conceptFamilyId])
)
const contentBlockMap = new Map(
  chapter3ContentConceptMappings.map((m) => [m.contentBlockId, m.conceptFamilyId])
)

export function getChapter3FlashcardConcept(
  flashcardId: string
): Chapter3ConceptFamilyId | undefined {
  return flashcardMap.get(flashcardId as `fc-3-${string}`)
}

export function getChapter3QuizQuestionConcept(
  questionId: string
): Chapter3ConceptFamilyId | undefined {
  return quizQuestionMap.get(questionId as `qq-3-${string}`)
}

export function getChapter3ContentConcept(
  contentBlockId: string
): Chapter3ConceptFamilyId | undefined {
  return contentBlockMap.get(contentBlockId)
}
