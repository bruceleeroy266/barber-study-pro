/**
 * Chapter 2 Key Terms — Canonical Typed Dataset (Phase 2B)
 *
 * 37 terms. Founder-curated inventory (Phase 2B-1, approved 2026-09-09).
 *
 * Governing architecture:
 *   - Concept/LO references resolve against chapter-2-concepts (25 active
 *     concepts + 14 LOs). C-2-22 is retired and holds no terms by design.
 *   - Term-level sourceProvenance is set per TERM, not blindly inherited
 *     from the concept. Named external frameworks (SMART, 2-Minute Rule,
 *     Pomodoro, Service Recovery Paradox, 50/30/20) are never DIRECT MILADY.
 *   - All definitions are original ASCYN PRO wording. No publisher prose.
 *   - No board-exam claims. examRelevance stays on the concept runtime.
 *
 * Six disconnected legacy terms (Affect, Aptitude, Body Language, Competence,
 * Constructive Criticism, Emotional Intelligence) and six removed/merged
 * entries (Goal Tracking, Study System, Complaint Recovery System, Three
 * Components of Effective Communication, Booth Renter Tax Set-Aside,
 * Inclusive Service Practices) are intentionally absent.
 */

import type {
  ConceptId,
  LearningObjectiveId,
  SourceProvenance,
} from './chapter-2-concepts/types'
import {
  chapter2Concepts,
  chapter2LearningObjectives,
} from './chapter-2-concepts/concepts'

// ───────────────────────────────────────────────
// Types
// ───────────────────────────────────────────────

/** How thoroughly current assessments cover the term. */
export type KeyTermAssessment = 'quiz' | 'flashcard-only' | 'partial'

export interface Chapter2KeyTerm {
  /** Stable ID: kt-2-### */
  id: string
  term: string
  /** Original ASCYN PRO wording — concise, student-friendly. */
  definition: string
  conceptId: ConceptId
  learningObjectiveId: LearningObjectiveId
  /** Term-level provenance (never blindly inherited from the concept). */
  sourceProvenance: SourceProvenance
  priority: 'CORE' | 'SUPPORTING' | 'ENRICHMENT'
  assessed: KeyTermAssessment
}

export interface KeyTermGroup {
  conceptId: ConceptId
  conceptName: string
  terms: readonly Chapter2KeyTerm[]
}

// ───────────────────────────────────────────────
// Dataset (37 terms)
// ───────────────────────────────────────────────

export const chapter2KeyTerms: readonly Chapter2KeyTerm[] = [
  {
    id: 'kt-2-001',
    term: 'Life Skills',
    definition:
      'The everyday abilities that turn technical talent into a lasting career — managing time, communicating well, handling money, and staying professional under pressure.',
    conceptId: 'C-2-01',
    learningObjectiveId: 'LO-2-01',
    sourceProvenance: 'TEXTBOOK_DERIVED',
    priority: 'CORE',
    assessed: 'quiz',
  },
  {
    id: 'kt-2-002',
    term: 'Self-Actualization',
    definition:
      'Becoming the fullest version of yourself over time — growing your skills, character, and confidence through a lifelong commitment to improvement.',
    conceptId: 'C-2-02',
    learningObjectiveId: 'LO-2-02',
    sourceProvenance: 'TEXTBOOK_DERIVED',
    priority: 'CORE',
    assessed: 'quiz',
  },
  {
    id: 'kt-2-003',
    term: 'Motivation',
    definition:
      'The internal drive that gets you started toward a goal. Motivation rises and falls, which is why successful barbers pair it with discipline.',
    conceptId: 'C-2-03',
    learningObjectiveId: 'LO-2-02',
    sourceProvenance: 'TEXTBOOK_DERIVED',
    priority: 'CORE',
    assessed: 'quiz',
  },
  {
    id: 'kt-2-004',
    term: 'Discipline',
    definition:
      "The habit of doing what needs to be done even when you don't feel like it. Discipline carries you on the days motivation doesn't show up.",
    conceptId: 'C-2-03',
    learningObjectiveId: 'LO-2-02',
    sourceProvenance: 'TEXTBOOK_DERIVED',
    priority: 'CORE',
    assessed: 'quiz',
  },
  {
    id: 'kt-2-005',
    term: 'Self-Esteem',
    definition:
      'The belief in your own value and ability. Healthy self-esteem helps a barber accept feedback, recover from mistakes, and keep improving.',
    conceptId: 'C-2-03',
    learningObjectiveId: 'LO-2-02',
    sourceProvenance: 'TEXTBOOK_DERIVED',
    priority: 'CORE',
    assessed: 'quiz',
  },
  {
    id: 'kt-2-006',
    term: 'Mission Statement',
    definition:
      "A short written declaration of who you are as a professional, what you stand for, and where you're going — a personal compass for career decisions.",
    conceptId: 'C-2-04',
    learningObjectiveId: 'LO-2-03',
    sourceProvenance: 'TEXTBOOK_DERIVED',
    priority: 'CORE',
    assessed: 'quiz',
  },
  {
    id: 'kt-2-007',
    term: 'Positive Professional Attitude',
    definition:
      'Bringing constructive energy to every client and coworker: staying composed, showing genuine interest, and keeping a professional outlook even on hard days.',
    conceptId: 'C-2-05',
    learningObjectiveId: 'LO-2-03',
    sourceProvenance: 'TEXTBOOK_DERIVED',
    priority: 'CORE',
    assessed: 'quiz',
  },
  {
    id: 'kt-2-008',
    term: 'Emotional Stability',
    definition:
      'Staying calm and steady when situations get tense — so a frustrated client or a chaotic Saturday never rattles your service.',
    conceptId: 'C-2-05',
    learningObjectiveId: 'LO-2-03',
    sourceProvenance: 'TEXTBOOK_DERIVED',
    priority: 'CORE',
    assessed: 'quiz',
  },
  {
    id: 'kt-2-009',
    term: 'SMART Goals',
    definition:
      'A goal-setting tool ASCYN teaches: make goals Specific, Measurable, Achievable, Relevant, and Time-bound so progress is trackable instead of vague.',
    conceptId: 'C-2-06',
    learningObjectiveId: 'LO-2-04',
    sourceProvenance: 'MILADY_SUPPORTED_EXPANSION',
    priority: 'CORE',
    assessed: 'quiz',
  },
  {
    id: 'kt-2-010',
    term: 'Short-Term & Long-Term Goals',
    definition:
      'Short-term goals are targets you can reach soon; long-term goals shape your career over years. Strong plans connect the two.',
    conceptId: 'C-2-07',
    learningObjectiveId: 'LO-2-04',
    sourceProvenance: 'TEXTBOOK_DERIVED',
    priority: 'SUPPORTING',
    assessed: 'quiz',
  },
  {
    id: 'kt-2-011',
    term: 'Time Management',
    definition:
      'Planning and protecting your time so appointments, walk-ins, and personal life all fit — the difference between controlling your day and chasing it.',
    conceptId: 'C-2-08',
    learningObjectiveId: 'LO-2-05',
    sourceProvenance: 'TEXTBOOK_DERIVED',
    priority: 'CORE',
    assessed: 'quiz',
  },
  {
    id: 'kt-2-012',
    term: 'Procrastination',
    definition:
      'Putting off tasks that matter, usually because they feel big or uncomfortable. It is one of the destructive habits that quietly stalls a career.',
    conceptId: 'C-2-08',
    learningObjectiveId: 'LO-2-05',
    sourceProvenance: 'TEXTBOOK_DERIVED',
    priority: 'CORE',
    assessed: 'quiz',
  },
  {
    id: 'kt-2-013',
    term: '2-Minute Rule',
    definition:
      'A quick-action technique ASCYN teaches: if a task takes less than two minutes — wipe the station, reply to a client — do it now instead of listing it.',
    conceptId: 'C-2-08',
    learningObjectiveId: 'LO-2-05',
    sourceProvenance: 'ASCYN_ORIGINAL',
    priority: 'SUPPORTING',
    assessed: 'quiz',
  },
  {
    id: 'kt-2-014',
    term: 'Pomodoro Technique',
    definition:
      'A focus technique ASCYN teaches for study sessions: work in 25-minute focused blocks separated by short breaks to keep concentration sharp.',
    conceptId: 'C-2-09',
    learningObjectiveId: 'LO-2-05',
    sourceProvenance: 'ASCYN_ORIGINAL',
    priority: 'SUPPORTING',
    assessed: 'quiz',
  },
  {
    id: 'kt-2-015',
    term: 'Spaced Repetition',
    definition:
      'Reviewing material repeatedly with growing gaps between sessions. Spreading review over time beats cramming for long-term retention.',
    conceptId: 'C-2-10',
    learningObjectiveId: 'LO-2-06',
    sourceProvenance: 'MILADY_SUPPORTED_EXPANSION',
    priority: 'CORE',
    assessed: 'quiz',
  },
  {
    id: 'kt-2-016',
    term: 'Mind Mapping',
    definition:
      'A visual note-taking tool: the main topic sits in the center with branches radiating outward, using key words, colors, and symbols to connect ideas.',
    conceptId: 'C-2-11',
    learningObjectiveId: 'LO-2-06',
    sourceProvenance: 'MILADY_SUPPORTED_EXPANSION',
    priority: 'SUPPORTING',
    assessed: 'flashcard-only',
  },
  {
    id: 'kt-2-017',
    term: 'Note-Taking',
    definition:
      'Capturing key information in your own words while you learn, then reviewing it — a process that turns class time into lasting knowledge.',
    conceptId: 'C-2-11',
    learningObjectiveId: 'LO-2-06',
    sourceProvenance: 'TEXTBOOK_DERIVED',
    priority: 'SUPPORTING',
    assessed: 'quiz',
  },
  {
    id: 'kt-2-018',
    term: 'Ethics',
    definition:
      'The moral principles that guide professional behavior — honesty, integrity, fairness, and doing right by every client even when no one is watching.',
    conceptId: 'C-2-12',
    learningObjectiveId: 'LO-2-07',
    sourceProvenance: 'TEXTBOOK_DERIVED',
    priority: 'CORE',
    assessed: 'quiz',
  },
  {
    id: 'kt-2-019',
    term: 'Continuing Education',
    definition:
      'Ongoing learning after licensure — classes, certifications, and practice that keep your skills current. ASCYN treats it as a professional responsibility to clients.',
    conceptId: 'C-2-12',
    learningObjectiveId: 'LO-2-07',
    sourceProvenance: 'MILADY_SUPPORTED_EXPANSION',
    priority: 'SUPPORTING',
    assessed: 'quiz',
  },
  {
    id: 'kt-2-020',
    term: 'Client Confidentiality',
    definition:
      'Protecting what clients share in your chair. Personal conversations, health details, and private matters stay private — even from coworkers.',
    conceptId: 'C-2-13',
    learningObjectiveId: 'LO-2-07',
    sourceProvenance: 'TEXTBOOK_DERIVED',
    priority: 'CORE',
    assessed: 'quiz',
  },
  {
    id: 'kt-2-021',
    term: 'Service Recovery Paradox',
    definition:
      'A service concept ASCYN teaches: a complaint handled exceptionally well can build more client loyalty than if nothing had gone wrong at all.',
    conceptId: 'C-2-14',
    learningObjectiveId: 'LO-2-07',
    sourceProvenance: 'ASCYN_ORIGINAL',
    priority: 'CORE',
    assessed: 'quiz',
  },
  {
    id: 'kt-2-022',
    term: 'Burnout',
    definition:
      'Physical and emotional exhaustion from sustained overwork — dreading work, irritability, slipping quality. Recognizing it early protects you and your clients.',
    conceptId: 'C-2-15',
    learningObjectiveId: 'LO-2-08',
    sourceProvenance: 'MILADY_SUPPORTED_EXPANSION',
    priority: 'CORE',
    assessed: 'quiz',
  },
  {
    id: 'kt-2-023',
    term: 'Work-Life Balance',
    definition:
      "Setting boundaries so work doesn't consume your health, relationships, or rest. ASCYN treats balance as a safety issue, not a luxury.",
    conceptId: 'C-2-16',
    learningObjectiveId: 'LO-2-08',
    sourceProvenance: 'MILADY_SUPPORTED_EXPANSION',
    priority: 'SUPPORTING',
    assessed: 'flashcard-only',
  },
  {
    id: 'kt-2-024',
    term: 'Diplomacy (Tact)',
    definition:
      "Being honest without being harsh — choosing words that tell the truth while respecting the client's feelings. Essential for consultations and corrections.",
    conceptId: 'C-2-17',
    learningObjectiveId: 'LO-2-09',
    sourceProvenance: 'TEXTBOOK_DERIVED',
    priority: 'CORE',
    assessed: 'quiz',
  },
  {
    id: 'kt-2-025',
    term: 'Active Listening',
    definition:
      'Fully concentrating on what the client says, processing it, and responding thoughtfully — hearing to understand, not just waiting for your turn to talk.',
    conceptId: 'C-2-18',
    learningObjectiveId: 'LO-2-09',
    sourceProvenance: 'MILADY_SUPPORTED_EXPANSION',
    priority: 'CORE',
    assessed: 'quiz',
  },
  {
    id: 'kt-2-026',
    term: 'Client Consultation',
    definition:
      'The structured conversation before service: ask, listen, repeat back what the client wants, and get approval before picking up any tool.',
    conceptId: 'C-2-18',
    learningObjectiveId: 'LO-2-09',
    sourceProvenance: 'MILADY_SUPPORTED_EXPANSION',
    priority: 'SUPPORTING',
    assessed: 'flashcard-only',
  },
  {
    id: 'kt-2-027',
    term: 'Conflict Resolution',
    definition:
      'Handling disagreements professionally — staying calm, hearing the other side, and working toward a solution without escalating the situation.',
    conceptId: 'C-2-19',
    learningObjectiveId: 'LO-2-09',
    sourceProvenance: 'MILADY_SUPPORTED_EXPANSION',
    priority: 'SUPPORTING',
    assessed: 'partial',
  },
  {
    id: 'kt-2-028',
    term: 'Professional Networking',
    definition:
      'Building genuine professional relationships — with barbers, shops, educators, and your community — that create learning, referrals, and career opportunities.',
    conceptId: 'C-2-20',
    learningObjectiveId: 'LO-2-10',
    sourceProvenance: 'ASCYN_ORIGINAL',
    priority: 'ENRICHMENT',
    assessed: 'quiz',
  },
  {
    id: 'kt-2-029',
    term: '50/30/20 Budget Rule',
    definition:
      'A budgeting guideline ASCYN teaches: split income into roughly 50% needs, 30% wants, and 20% savings and debt repayment.',
    conceptId: 'C-2-21',
    learningObjectiveId: 'LO-2-11',
    sourceProvenance: 'ASCYN_ORIGINAL',
    priority: 'ENRICHMENT',
    assessed: 'quiz',
  },
  {
    id: 'kt-2-030',
    term: 'Emergency Fund',
    definition:
      'Money set aside for unexpected expenses. Start with a small first target and build toward covering about three months of expenses.',
    conceptId: 'C-2-21',
    learningObjectiveId: 'LO-2-11',
    sourceProvenance: 'ASCYN_ORIGINAL',
    priority: 'ENRICHMENT',
    assessed: 'quiz',
  },
  {
    id: 'kt-2-031',
    term: 'Cultural Competence',
    definition:
      'Serving every client well across different backgrounds, hair textures, and preferences — with respect, curiosity, and zero assumptions.',
    conceptId: 'C-2-23',
    learningObjectiveId: 'LO-2-12',
    sourceProvenance: 'MILADY_SUPPORTED_EXPANSION',
    priority: 'CORE',
    assessed: 'quiz',
  },
  {
    id: 'kt-2-032',
    term: 'Career Roadmap',
    definition:
      'Your written plan from student to professional and beyond — a living document you revisit and adjust as your skills and goals evolve.',
    conceptId: 'C-2-24',
    learningObjectiveId: 'LO-2-10',
    sourceProvenance: 'MILADY_SUPPORTED_EXPANSION',
    priority: 'SUPPORTING',
    assessed: 'quiz',
  },
  {
    id: 'kt-2-033',
    term: 'Specialization',
    definition:
      'Developing deep expertise in a focus area — like precision fades, beard sculpting, or education — to stand out and grow your value.',
    conceptId: 'C-2-24',
    learningObjectiveId: 'LO-2-10',
    sourceProvenance: 'MILADY_SUPPORTED_EXPANSION',
    priority: 'SUPPORTING',
    assessed: 'quiz',
  },
  {
    id: 'kt-2-034',
    term: 'Leadership',
    definition:
      'Raising the standard of everyone around you: leading by example, giving constructive feedback, and building team culture — no title required.',
    conceptId: 'C-2-25',
    learningObjectiveId: 'LO-2-13',
    sourceProvenance: 'ASCYN_ORIGINAL',
    priority: 'ENRICHMENT',
    assessed: 'quiz',
  },
  {
    id: 'kt-2-035',
    term: 'Mentorship',
    definition:
      "Investing in someone else's growth — sharing knowledge, modeling standards, and helping the next barber shorten their learning curve.",
    conceptId: 'C-2-25',
    learningObjectiveId: 'LO-2-13',
    sourceProvenance: 'ASCYN_ORIGINAL',
    priority: 'ENRICHMENT',
    assessed: 'partial',
  },
  {
    id: 'kt-2-036',
    term: 'Shop Etiquette',
    definition:
      "The unwritten rules of professional shop behavior — respect others' clients and stations, keep your space clean, and never disparage a coworker's work.",
    conceptId: 'C-2-26',
    learningObjectiveId: 'LO-2-14',
    sourceProvenance: 'MILADY_SUPPORTED_EXPANSION',
    priority: 'CORE',
    assessed: 'quiz',
  },
  {
    id: 'kt-2-037',
    term: 'Workplace Professionalism',
    definition:
      'The daily standard that separates professionals from amateurs: punctuality, reliability, a maintained station, and respect for everyone in the shop.',
    conceptId: 'C-2-26',
    learningObjectiveId: 'LO-2-14',
    sourceProvenance: 'MILADY_SUPPORTED_EXPANSION',
    priority: 'CORE',
    assessed: 'partial',
  },
] as const

// ───────────────────────────────────────────────
// Chapter registry (reusable chapter-standard shape)
// ───────────────────────────────────────────────

export const chapterKeyTerms: Record<string, readonly Chapter2KeyTerm[]> = {
  'ch-2': chapter2KeyTerms,
}

// ───────────────────────────────────────────────
// Typed helpers
// ───────────────────────────────────────────────

/** Key terms mapped to a concept (empty for concepts with no terms, incl. retired C-2-22). */
export function getKeyTermsForConcept(conceptId: ConceptId): readonly Chapter2KeyTerm[] {
  return chapter2KeyTerms.filter((t) => t.conceptId === conceptId)
}

/** Key terms mapped to a learning objective. */
export function getKeyTermsForLO(learningObjectiveId: LearningObjectiveId): readonly Chapter2KeyTerm[] {
  return chapter2KeyTerms.filter((t) => t.learningObjectiveId === learningObjectiveId)
}

/** Look up a single term by stable ID. */
export function getKeyTermById(id: string): Chapter2KeyTerm | undefined {
  return chapter2KeyTerms.find((t) => t.id === id)
}

/**
 * Group terms by concept for glossary presentation.
 * Groups follow canonical LO order, then concept order within each LO.
 * Concepts without terms (and retired C-2-22) produce no group.
 */
export function groupKeyTermsByConcept(
  terms: readonly Chapter2KeyTerm[] = chapter2KeyTerms
): KeyTermGroup[] {
  const groups: KeyTermGroup[] = []
  const seen = new Set<string>()

  for (const lo of chapter2LearningObjectives) {
    for (const conceptId of lo.conceptIds) {
      if (seen.has(conceptId)) continue
      const conceptTerms = terms.filter((t) => t.conceptId === conceptId)
      if (conceptTerms.length === 0) continue
      const concept = chapter2Concepts.find((c) => c.id === conceptId)
      if (!concept) continue
      seen.add(conceptId)
      groups.push({ conceptId, conceptName: concept.name, terms: conceptTerms })
    }
  }

  return groups
}
