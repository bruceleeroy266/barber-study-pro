/**
 * Chapter 3 Concept Foundation — Canonical Concept Families & LOs
 *
 * C3-1: The locked Chapter 3 curriculum backbone. Exactly four concept
 * families, mapped 1:1 to the four textbook learning objectives verified
 * against the local Milady Chapter 3 source (pp. 40–50):
 *
 *   LO1 — healthful habits (four important personal hygiene habits)
 *   LO2 — dressing for success / professional image & grooming
 *   LO3 — ergonomically correct movement, postures, and principles
 *   LO4 — human relations and communication skills
 *
 * Do not add core concept families without a new founder authorization.
 */

import type {
  Chapter3ConceptFamily,
  Chapter3ConceptFamilyId,
  Chapter3LearningObjective,
} from './types'

// ───────────────────────────────────────────────
// Learning Objectives (locked Milady LO1–LO4 backbone)
// ───────────────────────────────────────────────

export const chapter3LearningObjectives: readonly Chapter3LearningObjective[] = [
  {
    id: 'LO-3-01',
    statement:
      'Name the four important personal hygiene habits and explain how rest, nutrition, hydration, exercise, and stress management support a healthful daily routine.',
    sourceBasis: 'Textbook LO1 — Apply Healthful Habits in Your Daily Routine',
    conceptFamilyId: 'ch3-healthful-habits',
  },
  {
    id: 'LO-3-02',
    statement:
      'Explain the concept of dressing for success and how personal grooming, wardrobe, and presentation choices project a professional image.',
    sourceBasis: 'Textbook LO2 — Follow Image-Building Basics',
    conceptFamilyId: 'ch3-professional-image',
  },
  {
    id: 'LO-3-03',
    statement:
      'Practice ergonomically correct movement, postures, and principles to protect the body across a barbering career.',
    sourceBasis: 'Textbook LO3 — Employ Proper Ergonomics to Protect Your Body',
    conceptFamilyId: 'ch3-ergonomics',
  },
  {
    id: 'LO-3-04',
    statement:
      'Demonstrate an understanding of human relations and communication skills, including rapport, client needs identification, and professional behavior online and in the shop.',
    sourceBasis: 'Textbook LO4 — Practice Effective Human Relations and Communication Skills',
    conceptFamilyId: 'ch3-human-relations',
  },
] as const

// ───────────────────────────────────────────────
// Canonical Concept Families (LOCKED — exactly four)
// ───────────────────────────────────────────────

export const chapter3ConceptFamilies: readonly Chapter3ConceptFamily[] = [
  {
    id: 'ch3-healthful-habits',
    name: 'Healthful Habits',
    learningObjectiveId: 'LO-3-01',
    description:
      'Daily personal maintenance that keeps a barber fit to serve: the four personal hygiene habits (hand washing, self-checks and freshening, oral care, no smoking during work hours), plus rest and sleep, relaxation, nutrition, hydration, exercise, and stress management.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'TEXTBOOK_DERIVED',
    status: 'active',
  },
  {
    id: 'ch3-professional-image',
    name: 'Professional Image & Grooming',
    learningObjectiveId: 'LO-3-02',
    description:
      'The impression projected through outward appearance and workplace conduct: personal grooming, dressing for success, wardrobe and footwear choices, fragrance sensitivity, and hair, beard, skin, and nail presentation.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'TEXTBOOK_DERIVED',
    status: 'active',
  },
  {
    id: 'ch3-ergonomics',
    name: 'Ergonomics & Body Mechanics',
    learningObjectiveId: 'LO-3-03',
    description:
      'Designing and using the workspace so body movements stay comfortable, efficient, and safe: physical presentation, standing and sitting posture, body alignment, safe working positions, neutral wrists and grip, arm and client positioning, repetitive-motion prevention, and musculoskeletal injury awareness.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'TEXTBOOK_DERIVED',
    status: 'active',
  },
  {
    id: 'ch3-human-relations',
    name: 'Human Relations & Communication',
    learningObjectiveId: 'LO-3-04',
    description:
      'Interactions that build trust: human relations and rapport, effective communication, identifying client needs and preferences, active listening, professional attitude, emotional control, positive approach, manners and mannerisms, punctuality, confidentiality and tact, the Organize/Clarify/Repeat framework, and professional social-media behavior.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'TEXTBOOK_DERIVED',
    status: 'active',
  },
] as const

// ───────────────────────────────────────────────
// Constants & Guards
// ───────────────────────────────────────────────

/** The four locked family IDs, in canonical LO order. */
export const CHAPTER3_CONCEPT_FAMILY_IDS = [
  'ch3-healthful-habits',
  'ch3-professional-image',
  'ch3-ergonomics',
  'ch3-human-relations',
] as const satisfies readonly Chapter3ConceptFamilyId[]

/** All families are active in C3-1; alias kept for symmetry with future states. */
export const ACTIVE_CHAPTER3_CONCEPT_FAMILY_IDS = CHAPTER3_CONCEPT_FAMILY_IDS

export function isChapter3ConceptFamilyId(
  value: string
): value is Chapter3ConceptFamilyId {
  return (CHAPTER3_CONCEPT_FAMILY_IDS as readonly string[]).includes(value)
}

export function getChapter3ConceptFamily(
  id: Chapter3ConceptFamilyId
): Chapter3ConceptFamily {
  const family = chapter3ConceptFamilies.find((f) => f.id === id)
  if (!family) throw new Error(`Unknown Chapter 3 concept family: ${id}`)
  return family
}

export function getChapter3LearningObjective(
  id: Chapter3ConceptFamilyId
): Chapter3LearningObjective {
  const lo = chapter3LearningObjectives.find((l) => l.conceptFamilyId === id)
  if (!lo) throw new Error(`No learning objective for concept family: ${id}`)
  return lo
}
