/**
 * Chapter 2 Instructor Notes — Canonical Typed Dataset (Phase 2B)
 *
 * Instructor-only teaching material for Chapter 2 (Life Skills).
 * Rendered exclusively on the instructor-gated route
 * /instructor/chapters/[chapterNumber]. Never placed in chapter-content.ts
 * and never exposed to student-facing bundles or pages.
 *
 * All content is original ASCYN PRO wording. No publisher prose.
 * Provenance boundaries use the three approved classes only:
 *   - DIRECT MILADY (TEXTBOOK_DERIVED)
 *   - MILADY-SUPPORTED ASCYN EXPANSION
 *   - ASCYN ENRICHMENT (ASCYN_ORIGINAL)
 * No DIRECT_VERIFIED board-relevance claims are made anywhere.
 */

import type { ConceptId, LearningObjectiveId } from './chapter-2-concepts/types'

// ───────────────────────────────────────────────
// Types
// ───────────────────────────────────────────────

export interface InstructorConfusion {
  /** What students commonly mix up. */
  topic: string
  /** How to untangle it. */
  clarification: string
  conceptIds: readonly ConceptId[]
}

export interface InstructorActivity {
  title: string
  instructions: string
  conceptIds: readonly ConceptId[]
}

export interface InstructorMisconception {
  misconception: string
  correction: string
}

export interface EnrichmentIdentification {
  conceptId: ConceptId
  conceptName: string
  /** Must state ASCYN ENRICHMENT explicitly for enrichment concepts. */
  identification: string
}

export interface Chapter2InstructorNotes {
  chapterNumber: 2
  title: string
  /** Why this chapter exists and what it should accomplish. */
  purpose: string
  /** Canonical LO references — exactly the 14 approved LOs. */
  learningObjectiveIds: readonly LearningObjectiveId[]
  /** Where to spend instructional weight. */
  teachingEmphasis: string[]
  /** Concepts students commonly confuse, with clarifications. */
  commonConfusions: readonly InstructorConfusion[]
  /** Questions that open productive class discussion. */
  discussionPrompts: string[]
  /** In-class activities drawn from existing chapter material. */
  classroomActivities: readonly InstructorActivity[]
  /** How each topic connects to real barbershop work. */
  practicalConnections: string[]
  /** Predictable wrong beliefs and their corrections. */
  misconceptions: readonly InstructorMisconception[]
  /** How to route struggling students — via the 6C cycle, no parallel system. */
  remediationGuidance: string
  /** What the chapter quiz measures and how to use it. */
  assessmentGuidance: string
  /** Explicit labeling of ASCYN-enrichment concepts. */
  enrichmentIdentification: readonly EnrichmentIdentification[]
  /** The three provenance classes and what instructors may/may not claim. */
  provenanceBoundaries: string
  /** What may be said about exam relevance — and what may not. */
  boardRelevanceBoundaries: string
}

// ───────────────────────────────────────────────
// Dataset
// ───────────────────────────────────────────────

export const chapter2InstructorNotes: Chapter2InstructorNotes = {
  chapterNumber: 2,
  title: 'Life Skills for Barbers — Instructor Notes',

  purpose:
    'Chapter 2 builds the professional foundation that technical skill alone cannot sustain: goal setting, time management, study technique, ethics, communication, stress management, financial basics, cultural competence, career planning, leadership, and shop professionalism. Students who internalize this chapter persist longer, pass more confidently, and behave like professionals from their first day behind the chair. Teach it as career infrastructure, not as filler between technical chapters.',

  learningObjectiveIds: [
    'LO-2-01',
    'LO-2-02',
    'LO-2-03',
    'LO-2-04',
    'LO-2-05',
    'LO-2-06',
    'LO-2-07',
    'LO-2-08',
    'LO-2-09',
    'LO-2-10',
    'LO-2-11',
    'LO-2-12',
    'LO-2-13',
    'LO-2-14',
  ],

  teachingEmphasis: [
    'Weight CORE concepts heaviest: life-skills foundations (C-2-01), success psychology (C-2-02), motivation and discipline (C-2-03), mission and purpose (C-2-04), professional attitude (C-2-05), ethics and confidentiality (C-2-12, C-2-13), communication (C-2-17, C-2-18), cultural competence (C-2-23), and shop professionalism (C-2-26).',
    'Treat frameworks as tools, not trivia: SMART goals, the 2-Minute Rule, Pomodoro, spaced repetition, and the 50/30/20 budget rule are useful because students apply them — drill application, not acronym recall alone.',
    'Anchor every topic to the shop. Each concept lands harder when students can name the exact moment it appears in a workday: the walk-in triage (time management), the unhappy client (service recovery), tax season (financial literacy).',
    'Give the ASCYN enrichment clusters (networking, financial literacy, leadership/mentorship) real time — they are original ASCYN material and differentiate completers, but do not present them as textbook content.',
  ],

  commonConfusions: [
    {
      topic: 'Motivation vs. discipline',
      clarification:
        'Students treat them as synonyms. Motivation is the spark that starts action; discipline is the structure that continues it when motivation fades. Quiz evidence shows the distinction is a known sticking point — contrast them explicitly.',
      conceptIds: ['C-2-03'],
    },
    {
      topic: 'Mission statement vs. a goal',
      clarification:
        'A mission statement is identity and direction ("who I am, what I stand for"); a goal is a target with an endpoint. Students often write goals and call them missions — have them check: does this statement expire when achieved? If yes, it is a goal.',
      conceptIds: ['C-2-04', 'C-2-06'],
    },
    {
      topic: 'Client confidentiality vs. shop conversation',
      clarification:
        'Students assume discussing a client with coworkers is harmless if no name is used. The rule is the information, not the name: health details, personal situations, and private conversations stay private — even inside the shop.',
      conceptIds: ['C-2-13'],
    },
    {
      topic: 'Service recovery paradox vs. "the customer is always right"',
      clarification:
        'The paradox is not about surrendering; it is about the loyalty dividend of excellent recovery. A well-handled complaint can outperform a flawless visit — but only when the recovery is genuine, structured, and professional.',
      conceptIds: ['C-2-14'],
    },
    {
      topic: 'Budget rule as law vs. guideline',
      clarification:
        'Students memorize 50/30/20 and treat deviation as failure. It is a starting framework ASCYN teaches for income allocation — a student with irregular tips adapts the percentages while protecting the savings habit itself.',
      conceptIds: ['C-2-21'],
    },
    {
      topic: 'Active listening vs. waiting to speak',
      clarification:
        'Students can recite the definition and still rehearse their reply while the client talks. The consultation repeat-back technique makes listening observable: if you cannot repeat it back accurately, you were not listening.',
      conceptIds: ['C-2-18'],
    },
  ],

  discussionPrompts: [
    'Which of the essential life skills will be hardest for you personally — and what is your plan for it this month?',
    'Describe a moment when discipline carried you (or someone you watched) after motivation ran out. What did that look like day to day?',
    'A coworker starts telling you what a client shared privately. What exactly do you say in that moment?',
    'A client leaves angry — then returns loyal after the recovery. What did the barber do right, step by step?',
    'What would your weekly schedule look like if you actually protected study time, rest, and family? Where does it break?',
    'Which specialization path interests you, and what would the first milestone on that roadmap be?',
    'What does "professional" look like on a slammed Saturday when you are thirty minutes behind?',
  ],

  classroomActivities: [
    {
      title: 'Five-minute goal audit',
      instructions:
        'Students write one real goal, then pressure-test it against the SMART elements and rewrite it until each element is satisfied. Pairs swap and audit each other\'s rewrites.',
      conceptIds: ['C-2-06', 'C-2-07'],
    },
    {
      title: 'Sunday planning ritual',
      instructions:
        'Each student maps the coming week — appointments, classes, study blocks, personal time — then identifies their top three time traps and one countermeasure for each.',
      conceptIds: ['C-2-08', 'C-2-09'],
    },
    {
      title: 'Complaint role-play',
      instructions:
        'One student plays an unhappy client who raises their voice; another runs the recovery sequence end to end. Class debriefs: what was the first move, what was avoided, what would the paradox predict?',
      conceptIds: ['C-2-14', 'C-2-19', 'C-2-05'],
    },
    {
      title: 'Budget worksheet',
      instructions:
        'Students build a monthly budget from a realistic new-barber income, allocating needs, wants, and savings, then mark their emergency-fund starting target and the first expense they would cut.',
      conceptIds: ['C-2-21'],
    },
    {
      title: 'Mission statement draft',
      instructions:
        'Students draft a three-component personal mission statement and share one line aloud. Class identifies which component each shared line represents.',
      conceptIds: ['C-2-04'],
    },
    {
      title: 'Cultural awareness quick check',
      instructions:
        'Students self-assess their comfort across different client backgrounds and hair textures, then name one concrete step (asking, researching, practicing) for their weakest area.',
      conceptIds: ['C-2-23'],
    },
  ],

  practicalConnections: [
    'Time management: the double-booked Saturday, the walk-in during a full book, the client who arrives twenty minutes late.',
    'Ethics in the chair: recommending the product the client actually needs instead of the expensive one — and keeping the client anyway.',
    'Confidentiality: the client who shares a divorce or a diagnosis mid-cut, and the coworker who asks about it later.',
    'Financial literacy: the first tax season as a booth renter, and the barber who set money aside versus the one who did not.',
    'Service recovery: the fade the client hates — handled so well they rebook.',
    'Burnout: the six-day weeks that quietly degrade service quality until a mistake forces the issue.',
    'Cultural competence: the client whose hair texture or terminology is new to you — served with respect instead of guesswork.',
    'Leadership: the student who gives a peer honest, constructive feedback and raises the whole room.',
  ],

  misconceptions: [
    {
      misconception: 'Life skills are "soft" extras that matter less than technical skill.',
      correction:
        'Technical skill gets the license; life skills build the career. Reliability, communication, and money management are what keep a book full — the chapter opens with exactly this distinction.',
    },
    {
      misconception: 'Tips and cash income do not need to be tracked or set aside for taxes.',
      correction:
        'Untracked income becomes a tax-season crisis, especially for booth renters. The financial-literacy cluster teaches tracking, set-aside habits, and the emergency fund as career survival skills.',
    },
    {
      misconception: 'Selling products is pushy and unprofessional.',
      correction:
        'Ethical recommendation is service: suggesting what genuinely fits the client protects both parties. The ethical product-recommendation rule is about honesty, not pressure.',
    },
    {
      misconception: 'Burnout is a personal weakness to push through.',
      correction:
        'Burnout is a predictable occupational hazard with recognizable warning signs. Prevention and boundaries are professional skills — and a client-safety issue.',
    },
    {
      misconception: 'Confidentiality only applies outside the shop.',
      correction:
        'Client information stays private everywhere, including coworker conversations inside the shop. The obligation attaches to the information, not the location.',
    },
    {
      misconception: 'A career plan is fixed once written.',
      correction:
        'The career roadmap is a living document — reviewed and adjusted as skills, interests, and opportunities change.',
    },
  ],

  remediationGuidance:
    'Chapter 2 remediation runs exclusively through the production 6C cycle (concept detection → targeted review → reassessment), visible in the student dashboard remediation flow and instructor escalation surfaces. Do not build parallel review packets or ad-hoc retakes outside that system. When a student struggles, identify the weak concept from their quiz evidence, direct them to the targeted review for that concept (content blocks, flashcards, and key terms are all concept-mapped), and let the cycle drive reassessment. Watch for recurring weakness in the confusions listed above — they are the highest-frequency failure patterns.',

  assessmentGuidance:
    'The Chapter 2 quiz contains 48 questions with a configured passing threshold of 80%. It samples all 25 active concepts — every active concept retains quiz coverage — with emphasis on application (scenarios, ethical judgment, procedure selection) over pure recall. Use a student\'s missed questions to locate the weak concept, not just the wrong answer. This quiz is an internal ASCYN readiness assessment; do not present it to students as an official board exam or a simulation of one. Score trajectories matter more than single attempts: a student climbing from 60s to 80s through the 6C cycle is the system working as designed.',

  enrichmentIdentification: [
    {
      conceptId: 'C-2-20',
      conceptName: 'Professional Networking',
      identification:
        'ASCYN ENRICHMENT — original ASCYN PRO content beyond textbook scope. Teach it as ASCYN-added career material, not as textbook-derived curriculum.',
    },
    {
      conceptId: 'C-2-21',
      conceptName: 'Financial Literacy for Barbers',
      identification:
        'ASCYN ENRICHMENT — original ASCYN PRO content beyond textbook scope. The 50/30/20 rule, emergency fund guidance, and tax set-aside practices are practical ASCYN additions.',
    },
    {
      conceptId: 'C-2-25',
      conceptName: 'Leadership & Mentorship',
      identification:
        'ASCYN ENRICHMENT — original ASCYN PRO content beyond textbook scope. Leadership qualities and mentorship practices are ASCYN-developed career material.',
    },
  ],

  provenanceBoundaries:
    'Three source classes govern Chapter 2, and instructors must represent them accurately. DIRECT MILADY (textbook-derived): the underlying knowledge domain comes from the textbook — examples include life-skills foundations, motivation and self-esteem, mission statements, short/long-term goals, time management, note-taking, ethics, confidentiality, and professional communication basics. MILADY-SUPPORTED ASCYN EXPANSION: the textbook touches the area and ASCYN expands it independently — examples include SMART goals, spaced repetition, burnout, work-life balance, active listening and consultation technique, cultural competence, career planning, and shop etiquette. ASCYN ENRICHMENT: original ASCYN PRO content beyond textbook scope — professional networking, financial literacy, and leadership/mentorship. Named external frameworks (SMART, 2-Minute Rule, Pomodoro, Service Recovery Paradox, 50/30/20) are never textbook-derived; present them as practical tools ASCYN teaches. All ASCYN materials — lesson, flashcards, quiz, key terms, and these notes — use original wording only; do not read or distribute publisher text.',

  boardRelevanceBoundaries:
    'Chapter 2 concepts carry INDIRECT_REFERENCE_ONLY or NONE exam relevance in the approved concept map — no Chapter 2 concept carries verified direct board coverage. Instructors may say this chapter supports professional readiness and good habits that serve students in any examination setting. Instructors must not claim that Chapter 2 content is verified board-exam material, must not present the Chapter 2 quiz as an official board exam or board simulation, and must not promise that specific questions or terms "will be on the test." If asked, the honest answer: this chapter builds the professional foundation; exam-specific preparation lives in the technical chapters.',
}

// ───────────────────────────────────────────────
// Chapter registry (instructor-only; mirrors key-term pattern)
// ───────────────────────────────────────────────

export const chapterInstructorNotes: Record<number, Chapter2InstructorNotes> = {
  2: chapter2InstructorNotes,
}
