/**
 * Chapter 3 Key Terms — Canonical Typed Dataset (C3-1)
 *
 * 7 terms covering established professional subject matter and expressed in
 * original ASCYN PRO wording. No publisher branding or board-exam claims.
 *
 * Each term maps to one canonical Chapter 3 concept family (and its 1:1 LO).
 * Self-contained: imports shared vocabulary only from the concept runtimes.
 */

import type {
  Chapter3ConceptFamilyId,
  Chapter3LearningObjectiveId,
} from './chapter-3-concepts/types'
import {
  chapter3ConceptFamilies,
  chapter3LearningObjectives,
} from './chapter-3-concepts/concepts'
import type { ChapterKeyTerm } from './chapter-2-key-terms'

// ───────────────────────────────────────────────
// Types
// ───────────────────────────────────────────────

/** Chapter 3 key term — shared chapter-standard shape, Ch3-branded IDs. */
export interface Chapter3KeyTerm extends ChapterKeyTerm {
  /** Stable ID: kt-3-### */
  id: `kt-3-${string}`
  conceptId: Chapter3ConceptFamilyId
  learningObjectiveId: Chapter3LearningObjectiveId
}

export interface Chapter3KeyTermGroup {
  conceptId: string
  conceptName: string
  terms: readonly ChapterKeyTerm[]
}

// ───────────────────────────────────────────────
// Dataset (7 terms)
// ───────────────────────────────────────────────

export const chapter3KeyTerms: readonly Chapter3KeyTerm[] = [
  {
    id: 'kt-3-001',
    term: 'Personal Hygiene',
    definition:
      'The daily maintenance of cleanliness through good healthful habits — bathing, hand washing, oral care, and staying fresh — so you can work comfortably in close contact with clients.',
    conceptId: 'ch3-healthful-habits',
    learningObjectiveId: 'LO-3-01',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    priority: 'CORE',
    assessed: 'partial',
  },
  {
    id: 'kt-3-002',
    term: 'Professional Image',
    definition:
      'The impression you project through both your outward appearance and your conduct in the workplace — how you look and how you behave, working together.',
    conceptId: 'ch3-professional-image',
    learningObjectiveId: 'LO-3-02',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    priority: 'CORE',
    assessed: 'partial',
  },
  {
    id: 'kt-3-003',
    term: 'Personal Grooming',
    definition:
      'The process of caring for the parts of your body — hair, skin, nails, and overall presentation — to maintain an overall polished, professional look.',
    conceptId: 'ch3-professional-image',
    learningObjectiveId: 'LO-3-02',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    priority: 'CORE',
    assessed: 'partial',
  },
  {
    id: 'kt-3-004',
    term: 'Physical Presentation',
    definition:
      'Your posture and the way you walk and move — the physical signals that convey an image of confidence and help prevent fatigue and other physical problems.',
    conceptId: 'ch3-ergonomics',
    learningObjectiveId: 'LO-3-03',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    priority: 'CORE',
    assessed: 'flashcard-only',
  },
  {
    id: 'kt-3-005',
    term: 'Ergonomics',
    definition:
      'The science of designing the workplace, along with its equipment and tools, so the specific body movements your work requires stay more comfortable, efficient, and safe.',
    conceptId: 'ch3-ergonomics',
    learningObjectiveId: 'LO-3-03',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    priority: 'CORE',
    assessed: 'quiz',
  },
  {
    id: 'kt-3-006',
    term: 'Human Relations',
    definition:
      'The interactions and relationships between two or more people — in the shop, the everyday skill of building rapport with clients and coworkers.',
    conceptId: 'ch3-human-relations',
    learningObjectiveId: 'LO-3-04',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    priority: 'CORE',
    assessed: 'flashcard-only',
  },
  {
    id: 'kt-3-007',
    term: 'Effective Communication',
    definition:
      'Successfully sharing information between two people so that it is understood — sending and receiving messages until you and the client mean the same thing.',
    conceptId: 'ch3-human-relations',
    learningObjectiveId: 'LO-3-04',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    priority: 'CORE',
    assessed: 'partial',
  },
] as const

// ───────────────────────────────────────────────
// Typed helpers
// ───────────────────────────────────────────────

/** Key terms mapped to a Chapter 3 concept family. */
export function getChapter3KeyTermsForConcept(
  conceptFamilyId: Chapter3ConceptFamilyId
): readonly Chapter3KeyTerm[] {
  return chapter3KeyTerms.filter((t) => t.conceptId === conceptFamilyId)
}

/** Look up a single Chapter 3 term by stable ID. */
export function getChapter3KeyTermById(id: string): Chapter3KeyTerm | undefined {
  return chapter3KeyTerms.find((t) => t.id === id)
}

/**
 * Group Chapter 3 terms by concept family for glossary presentation.
 * Groups follow canonical LO order, then term order within each family.
 * Accepts the shared chapter key-term shape so generic panels can call it.
 */
export function groupChapter3KeyTermsByConcept(
  terms: readonly ChapterKeyTerm[] = chapter3KeyTerms
): Chapter3KeyTermGroup[] {
  const groups: Chapter3KeyTermGroup[] = []
  const seen = new Set<string>()

  for (const lo of chapter3LearningObjectives) {
    const familyId = lo.conceptFamilyId
    if (seen.has(familyId)) continue
    const familyTerms = terms.filter((t) => t.conceptId === familyId)
    if (familyTerms.length === 0) continue
    const family = chapter3ConceptFamilies.find((f) => f.id === familyId)
    if (!family) continue
    seen.add(familyId)
    groups.push({ conceptId: familyId, conceptName: family.name, terms: familyTerms })
  }

  return groups
}
