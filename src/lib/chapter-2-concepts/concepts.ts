/**
 * Chapter 2 Concept Runtime Architecture — Canonical Concept Definitions
 *
 * 25 active concepts + 1 retired (C-2-22) + 18 subconcepts + 14 learning objectives.
 *
 * Governing document: ASCYN_PRO_CH02_CONCEPT_OBJECTIVE_MAP_v1.1.md (APPROVED)
 */

import type {
  Chapter2Concept,
  Chapter2LearningObjective,
  Chapter2Subconcept,
  ConceptId,
  LearningObjectiveId,
  SubconceptId,
} from './types'

// ───────────────────────────────────────────────
// Learning Objectives (14)
// ───────────────────────────────────────────────

export const chapter2LearningObjectives: readonly Chapter2LearningObjective[] = [
  {
    id: 'LO-2-01',
    statement: 'Identify the life skills essential for barbering career success and explain why they matter beyond technical skills',
    sourceBasis: 'Textbook LO1; ASCYN Section 1',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    conceptIds: ['C-2-01'],
  },
  {
    id: 'LO-2-02',
    statement: 'Apply principles of personal and professional success, including motivation, self-management, and self-esteem building',
    sourceBasis: 'Textbook LO2; ASCYN Section 11',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    conceptIds: ['C-2-02', 'C-2-03'],
  },
  {
    id: 'LO-2-03',
    statement: 'Create a personal mission statement and demonstrate characteristics of a healthy, positive professional attitude',
    sourceBasis: 'Textbook LO3, LO8; ASCYN flashcards',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    conceptIds: ['C-2-04', 'C-2-05'],
  },
  {
    id: 'LO-2-04',
    statement: 'Design and track short-term and long-term goals using structured frameworks (SMART, goal levels)',
    sourceBasis: 'Textbook LO4; ASCYN Section 2',
    professionalRelevance: 'SUPPORTING',
    examRelevance: 'NONE',
    conceptIds: ['C-2-06', 'C-2-07'],
  },
  {
    id: 'LO-2-05',
    statement: 'Apply time management strategies to optimize barbershop productivity and client service',
    sourceBasis: 'Textbook LO5; ASCYN Section 3',
    professionalRelevance: 'SUPPORTING',
    examRelevance: 'NONE',
    conceptIds: ['C-2-08', 'C-2-09'],
  },
  {
    id: 'LO-2-06',
    statement: 'Demonstrate effective study habits and learning techniques for barbering education',
    sourceBasis: 'Textbook LO6; ASCYN Section 4',
    professionalRelevance: 'SUPPORTING',
    examRelevance: 'NONE',
    conceptIds: ['C-2-10', 'C-2-11'],
  },
  {
    id: 'LO-2-07',
    statement: 'Define professional ethics and apply ethical principles to barbering practice, including client confidentiality and service recovery',
    sourceBasis: 'Textbook LO7; ASCYN Section 9',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    conceptIds: ['C-2-12', 'C-2-13', 'C-2-14'],
  },
  {
    id: 'LO-2-08',
    statement: 'Apply stress management and work-life balance strategies to maintain professional performance and personal well-being',
    sourceBasis: 'ASCYN Section 5',
    professionalRelevance: 'SUPPORTING',
    examRelevance: 'NONE',
    conceptIds: ['C-2-15', 'C-2-16'],
  },
  {
    id: 'LO-2-09',
    statement: 'Demonstrate professional communication skills, including active listening, client consultation, and conflict resolution',
    sourceBasis: 'ASCYN Sections 8, 10',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    conceptIds: ['C-2-17', 'C-2-18', 'C-2-19'],
  },
  {
    id: 'LO-2-10',
    statement: 'Develop a career advancement plan incorporating professional networking and specialization pathways',
    sourceBasis: 'ASCYN Sections 6, 13',
    professionalRelevance: 'SUPPORTING',
    examRelevance: 'NONE',
    conceptIds: ['C-2-20', 'C-2-24'],
  },
  {
    id: 'LO-2-11',
    statement: 'Apply financial literacy principles to manage barbering business finances',
    sourceBasis: 'ASCYN Section 7',
    professionalRelevance: 'SUPPORTING',
    examRelevance: 'NONE',
    conceptIds: ['C-2-21'],
  },
  {
    id: 'LO-2-12',
    statement: 'Demonstrate cultural competence and inclusive service practices for diverse clients',
    sourceBasis: 'ASCYN Section 12',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    conceptIds: ['C-2-23'],
  },
  {
    id: 'LO-2-13',
    statement: 'Demonstrate leadership and mentorship skills in professional barbering settings',
    sourceBasis: 'ASCYN Section 14',
    professionalRelevance: 'SUPPORTING',
    examRelevance: 'NONE',
    conceptIds: ['C-2-25'],
  },
  {
    id: 'LO-2-14',
    statement: 'Apply workplace professionalism and shop etiquette standards',
    sourceBasis: 'ASCYN Section 15',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    conceptIds: ['C-2-26'],
  },
] as const

// ───────────────────────────────────────────────
// Subconcepts (18)
// ───────────────────────────────────────────────

export const chapter2Subconcepts: readonly Chapter2Subconcept[] = [
  // C-2-01 Life Skills Foundations
  {
    id: 'SC-2-01-a',
    parentConceptId: 'C-2-01',
    name: 'Why Life Skills Matter',
    justification: 'Distinct content section; foundational understanding',
  },
  {
    id: 'SC-2-01-b',
    parentConceptId: 'C-2-01',
    name: 'Seven Essential Life Skills',
    justification: 'Specific list assessed by flashcards/quiz',
  },
  // C-2-02 Success Psychology
  {
    id: 'SC-2-02-a',
    parentConceptId: 'C-2-02',
    name: 'Action Steps for Success',
    justification: 'Specific framework assessed by flashcards',
  },
  {
    id: 'SC-2-02-b',
    parentConceptId: 'C-2-02',
    name: 'Self-Esteem Building',
    justification: 'Distinct psychological component',
  },
  // C-2-03 Self-Motivation & Discipline
  {
    id: 'SC-2-03-a',
    parentConceptId: 'C-2-03',
    name: 'Destructive Habits (Procrastination, Perfectionism, Lack of Game Plan)',
    justification: 'Specific three-item framework assessed by flashcards/quiz',
  },
  {
    id: 'SC-2-03-b',
    parentConceptId: 'C-2-03',
    name: 'Motivation vs. Discipline',
    justification: 'Distinct conceptual distinction',
  },
  // C-2-06 Goal Setting Frameworks
  {
    id: 'SC-2-06-a',
    parentConceptId: 'C-2-06',
    name: 'SMART Goals Framework',
    justification: 'Specific acronym/framework assessed by flashcards/quiz',
  },
  {
    id: 'SC-2-06-b',
    parentConceptId: 'C-2-06',
    name: 'Short-term vs. Long-term Goals',
    justification: 'Distinct conceptual distinction',
  },
  // C-2-08 Time Management Strategies
  {
    id: 'SC-2-08-a',
    parentConceptId: 'C-2-08',
    name: '2-Minute Rule',
    justification: 'Specific technique assessed by flashcards/quiz',
  },
  {
    id: 'SC-2-08-b',
    parentConceptId: 'C-2-08',
    name: 'Pomodoro Technique',
    justification: 'Specific technique assessed by flashcards/quiz',
  },
  {
    id: 'SC-2-08-c',
    parentConceptId: 'C-2-08',
    name: 'Time Traps & Avoidance',
    justification: 'Distinct content section',
  },
  // C-2-12 Professional Ethics & Conduct
  {
    id: 'SC-2-12-a',
    parentConceptId: 'C-2-12',
    name: 'Five Professional Ethics Actions',
    justification: 'Specific list assessed by flashcards/quiz',
  },
  {
    id: 'SC-2-12-b',
    parentConceptId: 'C-2-12',
    name: 'Ethical Product Recommendation',
    justification: 'Specific ethical rule',
  },
  // C-2-15 Stress Management & Self-Care
  {
    id: 'SC-2-15-a',
    parentConceptId: 'C-2-15',
    name: 'Burnout Recognition & Prevention',
    justification: 'Specific warning signs assessed by flashcards/quiz',
  },
  // C-2-17 Professional Communication
  {
    id: 'SC-2-17-a',
    parentConceptId: 'C-2-17',
    name: 'Three Components of Effective Communication',
    justification: 'Specific framework assessed by flashcards/quiz',
  },
  // C-2-21 Financial Literacy for Barbers
  {
    id: 'SC-2-21-a',
    parentConceptId: 'C-2-21',
    name: '50/30/20 Budget Rule',
    justification: 'Specific framework assessed by flashcards/quiz',
  },
  {
    id: 'SC-2-21-b',
    parentConceptId: 'C-2-21',
    name: 'Booth Renter Tax Management',
    justification: 'Specific financial practice',
  },
  {
    id: 'SC-2-21-c',
    parentConceptId: 'C-2-21',
    name: 'Emergency Fund Planning',
    justification: 'Specific financial practice',
  },
] as const

// ───────────────────────────────────────────────
// Concepts (25 active + 1 retired)
// ───────────────────────────────────────────────

function getSubconceptsForConcept(conceptId: ConceptId): Chapter2Subconcept[] {
  return chapter2Subconcepts.filter((sc) => sc.parentConceptId === conceptId)
}

export const chapter2Concepts: readonly Chapter2Concept[] = [
  // ───────────────────────────────────────────
  // ACTIVE CONCEPTS (25)
  // ───────────────────────────────────────────
  {
    id: 'C-2-01',
    name: 'Life Skills Foundations',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'TEXTBOOK_DERIVED',
    learningObjectiveId: 'LO-2-01',
    status: 'active',
    subconcepts: getSubconceptsForConcept('C-2-01'),
  },
  {
    id: 'C-2-02',
    name: 'Success Psychology',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'TEXTBOOK_DERIVED',
    learningObjectiveId: 'LO-2-02',
    status: 'active',
    subconcepts: getSubconceptsForConcept('C-2-02'),
  },
  {
    id: 'C-2-03',
    name: 'Self-Motivation & Discipline',
    importance: 'core',
    professionalRelevance: 'SUPPORTING',
    examRelevance: 'NONE',
    sourceProvenance: 'TEXTBOOK_DERIVED',
    learningObjectiveId: 'LO-2-02',
    status: 'active',
    subconcepts: getSubconceptsForConcept('C-2-03'),
  },
  {
    id: 'C-2-04',
    name: 'Mission & Purpose',
    importance: 'supporting',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'TEXTBOOK_DERIVED',
    learningObjectiveId: 'LO-2-03',
    status: 'active',
    subconcepts: getSubconceptsForConcept('C-2-04'),
  },
  {
    id: 'C-2-05',
    name: 'Positive Professional Attitude',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'TEXTBOOK_DERIVED',
    learningObjectiveId: 'LO-2-03',
    status: 'active',
    subconcepts: getSubconceptsForConcept('C-2-05'),
  },
  {
    id: 'C-2-06',
    name: 'Goal Setting Frameworks',
    importance: 'core',
    professionalRelevance: 'SUPPORTING',
    examRelevance: 'NONE',
    sourceProvenance: 'TEXTBOOK_DERIVED',
    learningObjectiveId: 'LO-2-04',
    status: 'active',
    subconcepts: getSubconceptsForConcept('C-2-06'),
  },
  {
    id: 'C-2-07',
    name: 'Goal Tracking & Achievement',
    importance: 'supporting',
    professionalRelevance: 'SUPPORTING',
    examRelevance: 'NONE',
    sourceProvenance: 'TEXTBOOK_DERIVED',
    learningObjectiveId: 'LO-2-04',
    status: 'active',
    subconcepts: getSubconceptsForConcept('C-2-07'),
  },
  {
    id: 'C-2-08',
    name: 'Time Management Strategies',
    importance: 'core',
    professionalRelevance: 'SUPPORTING',
    examRelevance: 'NONE',
    sourceProvenance: 'TEXTBOOK_DERIVED',
    learningObjectiveId: 'LO-2-05',
    status: 'active',
    subconcepts: getSubconceptsForConcept('C-2-08'),
  },
  {
    id: 'C-2-09',
    name: 'Time Management Tools & Techniques',
    importance: 'supporting',
    professionalRelevance: 'SUPPORTING',
    examRelevance: 'NONE',
    sourceProvenance: 'TEXTBOOK_DERIVED',
    learningObjectiveId: 'LO-2-05',
    status: 'active',
    subconcepts: getSubconceptsForConcept('C-2-09'),
  },
  {
    id: 'C-2-10',
    name: 'Study Habits & Learning Systems',
    importance: 'core',
    professionalRelevance: 'SUPPORTING',
    examRelevance: 'NONE',
    sourceProvenance: 'TEXTBOOK_DERIVED',
    learningObjectiveId: 'LO-2-06',
    status: 'active',
    subconcepts: getSubconceptsForConcept('C-2-10'),
  },
  {
    id: 'C-2-11',
    name: 'Memory & Note-Taking Techniques',
    importance: 'supporting',
    professionalRelevance: 'SUPPORTING',
    examRelevance: 'NONE',
    sourceProvenance: 'TEXTBOOK_DERIVED',
    learningObjectiveId: 'LO-2-06',
    status: 'active',
    subconcepts: getSubconceptsForConcept('C-2-11'),
  },
  {
    id: 'C-2-12',
    name: 'Professional Ethics & Conduct',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'TEXTBOOK_DERIVED',
    learningObjectiveId: 'LO-2-07',
    status: 'active',
    subconcepts: getSubconceptsForConcept('C-2-12'),
  },
  {
    id: 'C-2-13',
    name: 'Client Confidentiality & Privacy',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'TEXTBOOK_DERIVED',
    learningObjectiveId: 'LO-2-07',
    status: 'active',
    subconcepts: getSubconceptsForConcept('C-2-13'),
  },
  {
    id: 'C-2-14',
    name: 'Service Recovery & Complaint Handling',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'TEXTBOOK_DERIVED',
    learningObjectiveId: 'LO-2-07',
    status: 'active',
    subconcepts: getSubconceptsForConcept('C-2-14'),
  },
  {
    id: 'C-2-15',
    name: 'Stress Management & Self-Care',
    importance: 'core',
    professionalRelevance: 'SUPPORTING',
    examRelevance: 'NONE',
    sourceProvenance: 'ASCYN_ORIGINAL',
    learningObjectiveId: 'LO-2-08',
    status: 'active',
    subconcepts: getSubconceptsForConcept('C-2-15'),
  },
  {
    id: 'C-2-16',
    name: 'Work-Life Balance',
    importance: 'supporting',
    professionalRelevance: 'SUPPORTING',
    examRelevance: 'NONE',
    sourceProvenance: 'ASCYN_ORIGINAL',
    learningObjectiveId: 'LO-2-08',
    status: 'active',
    subconcepts: getSubconceptsForConcept('C-2-16'),
  },
  {
    id: 'C-2-17',
    name: 'Professional Communication',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'ASCYN_ORIGINAL',
    learningObjectiveId: 'LO-2-09',
    status: 'active',
    subconcepts: getSubconceptsForConcept('C-2-17'),
  },
  {
    id: 'C-2-18',
    name: 'Active Listening & Consultation',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'ASCYN_ORIGINAL',
    learningObjectiveId: 'LO-2-09',
    status: 'active',
    subconcepts: getSubconceptsForConcept('C-2-18'),
  },
  {
    id: 'C-2-19',
    name: 'Conflict Resolution',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'ASCYN_ORIGINAL',
    learningObjectiveId: 'LO-2-09',
    status: 'active',
    subconcepts: getSubconceptsForConcept('C-2-19'),
  },
  {
    id: 'C-2-20',
    name: 'Professional Networking',
    importance: 'supporting',
    professionalRelevance: 'SUPPORTING',
    examRelevance: 'NONE',
    sourceProvenance: 'ASCYN_ORIGINAL',
    learningObjectiveId: 'LO-2-10',
    status: 'active',
    subconcepts: getSubconceptsForConcept('C-2-20'),
  },
  {
    id: 'C-2-21',
    name: 'Financial Literacy for Barbers',
    importance: 'supporting',
    professionalRelevance: 'SUPPORTING',
    examRelevance: 'NONE',
    sourceProvenance: 'ASCYN_ORIGINAL',
    learningObjectiveId: 'LO-2-11',
    status: 'active',
    subconcepts: getSubconceptsForConcept('C-2-21'),
  },
  // ───────────────────────────────────────────
  // RETIRED CONCEPT (1) — C-2-22
  // ───────────────────────────────────────────
  {
    id: 'C-2-22',
    name: 'Career Development & Professionalism',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'ASCYN_ORIGINAL',
    learningObjectiveId: 'LO-2-10', // Historical mapping; concept is retired
    status: 'retired',
    subconcepts: [],
  },
  // ───────────────────────────────────────────
  // ACTIVE CONCEPTS (continued)
  // ───────────────────────────────────────────
  {
    id: 'C-2-23',
    name: 'Cultural Competence & Inclusive Service',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'ASCYN_EXTENSION',
    learningObjectiveId: 'LO-2-12',
    status: 'active',
    subconcepts: getSubconceptsForConcept('C-2-23'),
  },
  {
    id: 'C-2-24',
    name: 'Career Planning & Specialization',
    importance: 'supporting',
    professionalRelevance: 'SUPPORTING',
    examRelevance: 'NONE',
    sourceProvenance: 'ASCYN_EXTENSION',
    learningObjectiveId: 'LO-2-10',
    status: 'active',
    subconcepts: getSubconceptsForConcept('C-2-24'),
  },
  {
    id: 'C-2-25',
    name: 'Leadership & Mentorship',
    importance: 'supporting',
    professionalRelevance: 'SUPPORTING',
    examRelevance: 'NONE',
    sourceProvenance: 'ASCYN_EXTENSION',
    learningObjectiveId: 'LO-2-13',
    status: 'active',
    subconcepts: getSubconceptsForConcept('C-2-25'),
  },
  {
    id: 'C-2-26',
    name: 'Workplace Professionalism & Shop Etiquette',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'ASCYN_EXTENSION',
    learningObjectiveId: 'LO-2-14',
    status: 'active',
    subconcepts: getSubconceptsForConcept('C-2-26'),
  },
] as const

// ───────────────────────────────────────────────
// Derived Constants
// ───────────────────────────────────────────────

/** All active concept IDs (25) */
export const ACTIVE_CONCEPT_IDS: readonly ConceptId[] = chapter2Concepts
  .filter((c) => c.status === 'active')
  .map((c) => c.id)

/** All retired concept IDs (1) */
export const RETIRED_CONCEPT_IDS: readonly ConceptId[] = chapter2Concepts
  .filter((c) => c.status === 'retired')
  .map((c) => c.id)

/** All learning objective IDs (14) */
export const LEARNING_OBJECTIVE_IDS: readonly LearningObjectiveId[] =
  chapter2LearningObjectives.map((lo) => lo.id)

/** All subconcept IDs (18) */
export const SUBCONCEPT_IDS: readonly SubconceptId[] = chapter2Subconcepts.map(
  (sc) => sc.id,
)
