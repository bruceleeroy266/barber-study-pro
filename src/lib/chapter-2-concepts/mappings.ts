/**
 * Chapter 2 Concept Runtime Architecture — Asset-to-Concept Mappings
 *
 * Maps all production assets to the approved concept taxonomy.
 * Data verified against production files at commit 40b2bb5.
 *
 * Governing documents:
 *   - ASCYN_PRO_CH02_CONCEPT_OBJECTIVE_MAP_v1.1.md (APPROVED)
 *   - ASCYN_PRO_CH02_PHASE6B2_TYPED_CONCEPT_RUNTIME_ARCHITECTURE_REVIEW.md
 *   - Phase 5A/5B checkpoints for post-v1.1 asset additions
 */

import type {
  ContentConceptMapping,
  FlashcardConceptMapping,
  QuizQuestionConceptMapping,
} from './types'

// ───────────────────────────────────────────────
// Content Block → Concept Mappings (81 blocks)
// ───────────────────────────────────────────────

export const chapter2ContentMappings: readonly ContentConceptMapping[] = [
  // Section 1: Why Life Skills Matter
  { contentBlockId: 'why-life-skills', conceptId: 'C-2-01', subconceptId: 'SC-2-01-a' },
  { contentBlockId: 'success-separators', conceptId: 'C-2-01', subconceptId: 'SC-2-01-a' },
  { contentBlockId: 'clippers-quote', conceptId: 'C-2-01', subconceptId: 'SC-2-01-a' },

  // Section 2: Setting and Achieving Goals
  { contentBlockId: 'goal-setting', conceptId: 'C-2-06' },
  { contentBlockId: 'smart-goals', conceptId: 'C-2-06', subconceptId: 'SC-2-06-a' },
  { contentBlockId: 'short-vs-long', conceptId: 'C-2-06', subconceptId: 'SC-2-06-b' },
  { contentBlockId: 'action-steps', conceptId: 'C-2-06' },
  { contentBlockId: 'track-progress', conceptId: 'C-2-07' },
  { contentBlockId: 'goal-levels', conceptId: 'C-2-06' },
  { contentBlockId: 'goal-challenges', conceptId: 'C-2-07' },

  // Section 3: Time Management
  { contentBlockId: 'time-challenge', conceptId: 'C-2-08' },
  { contentBlockId: 'time-traps', conceptId: 'C-2-08', subconceptId: 'SC-2-08-c' },
  { contentBlockId: 'time-tools', conceptId: 'C-2-08', secondaryConceptIds: ['C-2-09'] },
  { contentBlockId: 'sample-schedule', conceptId: 'C-2-09' },

  // Section 4: Effective Study Habits
  { contentBlockId: 'study-habits', conceptId: 'C-2-10' },
  { contentBlockId: 'study-system', conceptId: 'C-2-11', secondaryConceptIds: ['C-2-10'] },

  // Section 5: Stress Management & Work-Life Balance
  { contentBlockId: 'stress-intro', conceptId: 'C-2-15' },
  { contentBlockId: 'physical-self-care', conceptId: 'C-2-15' },
  { contentBlockId: 'mental-health', conceptId: 'C-2-16' },
  { contentBlockId: 'burnout-signs', conceptId: 'C-2-15', subconceptId: 'SC-2-15-a' },

  // Section 6: Building Professional Relationships
  { contentBlockId: 'networking-intro', conceptId: 'C-2-20' },
  { contentBlockId: 'networking-myths', conceptId: 'C-2-20' },
  { contentBlockId: 'where-to-network', conceptId: 'C-2-20' },
  { contentBlockId: 'building-relationships', conceptId: 'C-2-20' },

  // Interactive: Time Scenarios
  { contentBlockId: 'time-scenarios', conceptId: 'C-2-08', secondaryConceptIds: ['C-2-09'] },
  { contentBlockId: 'time-actions', conceptId: 'C-2-08', secondaryConceptIds: ['C-2-09'] },

  // Section 7: Financial Literacy
  { contentBlockId: 'financial-truth', conceptId: 'C-2-21' },
  { contentBlockId: 'financial-rules', conceptId: 'C-2-21', subconceptId: 'SC-2-21-a' },
  { contentBlockId: 'barber-finances', conceptId: 'C-2-21', subconceptId: 'SC-2-21-b' },
  { contentBlockId: 'money-goals', conceptId: 'C-2-21', subconceptId: 'SC-2-21-c' },
  { contentBlockId: 'money-levels', conceptId: 'C-2-21' },

  // Section 8: Communication Skills
  { contentBlockId: 'communication-intro', conceptId: 'C-2-17' },
  { contentBlockId: 'active-listening', conceptId: 'C-2-18' },
  { contentBlockId: 'consultation-skills', conceptId: 'C-2-18' },
  { contentBlockId: 'communication-mistakes', conceptId: 'C-2-17' },
  { contentBlockId: 'comm-challenges', conceptId: 'C-2-17' },

  // Section 9: Professional Ethics
  { contentBlockId: 'ethics-intro', conceptId: 'C-2-12' },
  { contentBlockId: 'ethical-principles', conceptId: 'C-2-12', subconceptId: 'SC-2-12-a' },
  { contentBlockId: 'ethical-checklist', conceptId: 'C-2-12', subconceptId: 'SC-2-12-a' },
  { contentBlockId: 'ethics-scenarios', conceptId: 'C-2-13', secondaryConceptIds: ['C-2-12'] },

  // Section 10: Conflict Resolution
  { contentBlockId: 'conflict-intro', conceptId: 'C-2-19' },
  { contentBlockId: 'conflict-resolution', conceptId: 'C-2-14', secondaryConceptIds: ['C-2-19'] },
  { contentBlockId: 'step-1-listen', conceptId: 'C-2-19' },
  { contentBlockId: 'step-2-empathize', conceptId: 'C-2-19' },
  { contentBlockId: 'step-3-fix', conceptId: 'C-2-19' },
  { contentBlockId: 'step-4-follow-up', conceptId: 'C-2-19' },
  { contentBlockId: 'conflict-pro-tip', conceptId: 'C-2-19' },
  { contentBlockId: 'conflict-actions', conceptId: 'C-2-19' },

  // Section 11: Self-Motivation & Mindset
  { contentBlockId: 'mindset-intro', conceptId: 'C-2-02' },
  { contentBlockId: 'mindset-pillars', conceptId: 'C-2-02', subconceptId: 'SC-2-02-a' },
  { contentBlockId: 'daily-discipline', conceptId: 'C-2-03', subconceptId: 'SC-2-03-b' },
  { contentBlockId: 'mindset-challenges', conceptId: 'C-2-03', subconceptId: 'SC-2-03-a' },

  // Phase 5B-P1.5: Mission & Purpose (GAP-1)
  { contentBlockId: 'mission-foundations', conceptId: 'C-2-04' },
  { contentBlockId: 'mission-creation', conceptId: 'C-2-04' },
  { contentBlockId: 'mission-evaluation', conceptId: 'C-2-04' },

  // Phase 5B-P1.5: Positive Professional Attitude (GAP-2)
  { contentBlockId: 'attitude-framework', conceptId: 'C-2-05' },
  { contentBlockId: 'attitude-composure', conceptId: 'C-2-05' },
  { contentBlockId: 'attitude-communication', conceptId: 'C-2-05' },
  { contentBlockId: 'attitude-interest', conceptId: 'C-2-05' },
  { contentBlockId: 'attitude-positivity', conceptId: 'C-2-05' },
  { contentBlockId: 'attitude-scenarios', conceptId: 'C-2-05' },

  // Section 12: Cultural Competence
  { contentBlockId: 'cultural-competence-intro', conceptId: 'C-2-23' },
  { contentBlockId: 'inclusive-practices', conceptId: 'C-2-23' },
  { contentBlockId: 'cultural-awareness', conceptId: 'C-2-23' },
  { contentBlockId: 'cultural-scenarios', conceptId: 'C-2-23' },

  // Section 13: Career Planning
  { contentBlockId: 'career-planning-intro', conceptId: 'C-2-24' },
  { contentBlockId: 'career-milestones', conceptId: 'C-2-24' },
  { contentBlockId: 'specialization-paths', conceptId: 'C-2-24' },
  { contentBlockId: 'career-levels', conceptId: 'C-2-24' },

  // Section 14: Leadership & Mentorship
  { contentBlockId: 'leadership-intro', conceptId: 'C-2-25' },
  { contentBlockId: 'leadership-qualities', conceptId: 'C-2-25' },
  { contentBlockId: 'mentorship-actions', conceptId: 'C-2-25' },
  { contentBlockId: 'leadership-actions', conceptId: 'C-2-25' },

  // Section 15: Workplace Professionalism
  { contentBlockId: 'workplace-intro', conceptId: 'C-2-26' },
  { contentBlockId: 'shop-etiquette', conceptId: 'C-2-26' },
  { contentBlockId: 'station-respect', conceptId: 'C-2-26' },
  { contentBlockId: 'coworker-conduct', conceptId: 'C-2-26' },
  { contentBlockId: 'busy-days', conceptId: 'C-2-26' },
  { contentBlockId: 'professional-daily', conceptId: 'C-2-26' },
  { contentBlockId: 'closing-quote', conceptId: 'C-2-26' },
  { contentBlockId: 'final-boss', conceptId: 'C-2-26' },
] as const

// ───────────────────────────────────────────────
// Flashcard → Concept Mappings (65 cards: 64 active + 1 inactive)
// ───────────────────────────────────────────────

export const chapter2FlashcardMappings: readonly FlashcardConceptMapping[] = [
  // Category 1: Foundation Knowledge (fc-2-001 to fc-2-010)
  { flashcardId: 'fc-2-001', conceptId: 'C-2-01' },
  { flashcardId: 'fc-2-002', conceptId: 'C-2-01', subconceptId: 'SC-2-01-b' },
  { flashcardId: 'fc-2-003', conceptId: 'C-2-02', subconceptId: 'SC-2-02-b' },
  { flashcardId: 'fc-2-004', conceptId: 'C-2-03', subconceptId: 'SC-2-03-a' },
  { flashcardId: 'fc-2-005', conceptId: 'C-2-06', subconceptId: 'SC-2-06-b' },
  { flashcardId: 'fc-2-006', conceptId: 'C-2-06', subconceptId: 'SC-2-06-a' },
  { flashcardId: 'fc-2-007', conceptId: 'C-2-21', subconceptId: 'SC-2-21-a' },
  { flashcardId: 'fc-2-008', conceptId: 'C-2-21', subconceptId: 'SC-2-21-b' },
  { flashcardId: 'fc-2-009', conceptId: 'C-2-21', subconceptId: 'SC-2-21-c' },
  { flashcardId: 'fc-2-010', conceptId: 'C-2-08', subconceptId: 'SC-2-08-a' },

  // Category 2: Definitions (fc-2-011 to fc-2-018)
  { flashcardId: 'fc-2-011', conceptId: 'C-2-04' },
  { flashcardId: 'fc-2-012', conceptId: 'C-2-12' },
  { flashcardId: 'fc-2-013', conceptId: 'C-2-17' },
  { flashcardId: 'fc-2-014', conceptId: 'C-2-05' },
  { flashcardId: 'fc-2-015', conceptId: 'C-2-02', subconceptId: 'SC-2-02-b' },
  { flashcardId: 'fc-2-016', conceptId: 'C-2-15', subconceptId: 'SC-2-15-a' },
  { flashcardId: 'fc-2-017', conceptId: 'C-2-12', subconceptId: 'SC-2-12-a' },
  { flashcardId: 'fc-2-018', conceptId: 'C-2-18' },

  // Category 3: Professional Practice (fc-2-019 to fc-2-024)
  { flashcardId: 'fc-2-019', conceptId: 'C-2-12', subconceptId: 'SC-2-12-a' },
  { flashcardId: 'fc-2-020', conceptId: 'C-2-13' },
  { flashcardId: 'fc-2-021', conceptId: 'C-2-21', subconceptId: 'SC-2-21-c' },
  { flashcardId: 'fc-2-022', conceptId: 'C-2-12', subconceptId: 'SC-2-12-b' },
  { flashcardId: 'fc-2-023', conceptId: 'C-2-14' },
  { flashcardId: 'fc-2-024', conceptId: 'C-2-26' },

  // Category 4: Visual Identification (fc-2-025 to fc-2-029)
  { flashcardId: 'fc-2-025', conceptId: 'C-2-11' },
  { flashcardId: 'fc-2-026', conceptId: 'C-2-08', subconceptId: 'SC-2-08-b' },
  { flashcardId: 'fc-2-027', conceptId: 'C-2-21', subconceptId: 'SC-2-21-a' },
  { flashcardId: 'fc-2-028', conceptId: 'C-2-18' },
  { flashcardId: 'fc-2-029', conceptId: 'C-2-09' },

  // Category 5: Scenario Thinking (fc-2-030 to fc-2-034)
  { flashcardId: 'fc-2-030', conceptId: 'C-2-19', secondaryConceptIds: ['C-2-14'] },
  { flashcardId: 'fc-2-031', conceptId: 'C-2-21', subconceptId: 'SC-2-21-b' },
  { flashcardId: 'fc-2-032', conceptId: 'C-2-12' },
  { flashcardId: 'fc-2-033', conceptId: 'C-2-08' },
  { flashcardId: 'fc-2-034', conceptId: 'C-2-15', subconceptId: 'SC-2-15-a' },

  // Category 6: Procedure/Process Knowledge (fc-2-035 to fc-2-040)
  { flashcardId: 'fc-2-035', conceptId: 'C-2-07' },
  { flashcardId: 'fc-2-036', conceptId: 'C-2-11' },
  { flashcardId: 'fc-2-037', conceptId: 'C-2-14' },
  { flashcardId: 'fc-2-038', conceptId: 'C-2-10' },
  { flashcardId: 'fc-2-039', conceptId: 'C-2-20' },
  { flashcardId: 'fc-2-040', conceptId: 'C-2-08', secondaryConceptIds: ['C-2-09'] },

  // Category 7: Safety Concepts (fc-2-041 to fc-2-043)
  { flashcardId: 'fc-2-041', conceptId: 'C-2-16' },
  { flashcardId: 'fc-2-042', conceptId: 'C-2-21' },
  { flashcardId: 'fc-2-043', conceptId: 'C-2-05' },

  // Category 8: Memory Reinforcement (fc-2-044 to fc-2-050)
  { flashcardId: 'fc-2-044', conceptId: 'C-2-11' },
  { flashcardId: 'fc-2-045', conceptId: 'C-2-05' }, // INACTIVE — is_active: false
  { flashcardId: 'fc-2-046', conceptId: 'C-2-02', subconceptId: 'SC-2-02-b' },
  { flashcardId: 'fc-2-047', conceptId: 'C-2-08' },
  { flashcardId: 'fc-2-048', conceptId: 'C-2-12', subconceptId: 'SC-2-12-a' },
  { flashcardId: 'fc-2-049', conceptId: 'C-2-17', subconceptId: 'SC-2-17-a' },
  { flashcardId: 'fc-2-050', conceptId: 'C-2-02' },

  // Phase 5B-P1.5 Additions: C-2-04 Mission & Purpose (fc-2-051 to fc-2-052)
  { flashcardId: 'fc-2-051', conceptId: 'C-2-04' },
  { flashcardId: 'fc-2-052', conceptId: 'C-2-04' },

  // Phase 5B-P1.5 Additions: C-2-05 Positive Professional Attitude (fc-2-053 to fc-2-058)
  { flashcardId: 'fc-2-053', conceptId: 'C-2-05' },
  { flashcardId: 'fc-2-054', conceptId: 'C-2-05' },
  { flashcardId: 'fc-2-055', conceptId: 'C-2-05' },
  { flashcardId: 'fc-2-056', conceptId: 'C-2-05' },
  { flashcardId: 'fc-2-057', conceptId: 'C-2-05' },
  { flashcardId: 'fc-2-058', conceptId: 'C-2-05' },

  // Phase 5B-P2 Additions: C-2-23, C-2-24, C-2-25 (fc-2-059 to fc-2-065)
  { flashcardId: 'fc-2-059', conceptId: 'C-2-23' },
  { flashcardId: 'fc-2-060', conceptId: 'C-2-23' },
  { flashcardId: 'fc-2-061', conceptId: 'C-2-23' },
  { flashcardId: 'fc-2-062', conceptId: 'C-2-24' },
  { flashcardId: 'fc-2-063', conceptId: 'C-2-24' },
  { flashcardId: 'fc-2-064', conceptId: 'C-2-25' },
  { flashcardId: 'fc-2-065', conceptId: 'C-2-25' },
] as const

// ───────────────────────────────────────────────
// Quiz Question → Concept Mappings (48 questions)
// ───────────────────────────────────────────────

export const chapter2QuizQuestionMappings: readonly QuizQuestionConceptMapping[] = [
  // Easy Questions (qq-2-001 to qq-2-010)
  { questionId: 'qq-2-001', conceptId: 'C-2-01' },
  { questionId: 'qq-2-002', conceptId: 'C-2-06', subconceptId: 'SC-2-06-a' },
  { questionId: 'qq-2-003', conceptId: 'C-2-21', subconceptId: 'SC-2-21-a' },
  { questionId: 'qq-2-004', conceptId: 'C-2-21', subconceptId: 'SC-2-21-c' },
  { questionId: 'qq-2-005', conceptId: 'C-2-08', subconceptId: 'SC-2-08-a' },
  { questionId: 'qq-2-006', conceptId: 'C-2-03', subconceptId: 'SC-2-03-a' },
  { questionId: 'qq-2-007', conceptId: 'C-2-04' },
  { questionId: 'qq-2-008', conceptId: 'C-2-08', subconceptId: 'SC-2-08-b' },
  { questionId: 'qq-2-009', conceptId: 'C-2-06', subconceptId: 'SC-2-06-b' },
  { questionId: 'qq-2-010', conceptId: 'C-2-18' },

  // Medium Questions (qq-2-011 to qq-2-020)
  { questionId: 'qq-2-011', conceptId: 'C-2-06', subconceptId: 'SC-2-06-a' },
  { questionId: 'qq-2-012', conceptId: 'C-2-21', subconceptId: 'SC-2-21-b' },
  { questionId: 'qq-2-013', conceptId: 'C-2-20' },
  { questionId: 'qq-2-014', conceptId: 'C-2-17' },
  { questionId: 'qq-2-015', conceptId: 'C-2-12', subconceptId: 'SC-2-12-a' },
  { questionId: 'qq-2-016', conceptId: 'C-2-14' },
  { questionId: 'qq-2-017', conceptId: 'C-2-15', subconceptId: 'SC-2-15-a' },
  { questionId: 'qq-2-018', conceptId: 'C-2-14' },
  { questionId: 'qq-2-019', conceptId: 'C-2-26' },
  { questionId: 'qq-2-020', conceptId: 'C-2-03', subconceptId: 'SC-2-03-b' },

  // Hard Questions (qq-2-021 to qq-2-030)
  { questionId: 'qq-2-021', conceptId: 'C-2-01', subconceptId: 'SC-2-01-b' },
  { questionId: 'qq-2-022', conceptId: 'C-2-19', secondaryConceptIds: ['C-2-14'] },
  { questionId: 'qq-2-023', conceptId: 'C-2-02', subconceptId: 'SC-2-02-b' },
  { questionId: 'qq-2-024', conceptId: 'C-2-21' },
  { questionId: 'qq-2-025', conceptId: 'C-2-17', subconceptId: 'SC-2-17-a' },
  { questionId: 'qq-2-026', conceptId: 'C-2-09', secondaryConceptIds: ['C-2-08'] },
  { questionId: 'qq-2-027', conceptId: 'C-2-12', subconceptId: 'SC-2-12-a' },
  { questionId: 'qq-2-028', conceptId: 'C-2-10' },
  { questionId: 'qq-2-029', conceptId: 'C-2-05' },
  { questionId: 'qq-2-030', conceptId: 'C-2-11' },

  // Phase 5A Additions: C-2-07 Goal Tracking (qq-2-031 to qq-2-032)
  { questionId: 'qq-2-031', conceptId: 'C-2-07' },
  { questionId: 'qq-2-032', conceptId: 'C-2-07' },

  // Phase 5A Additions: C-2-13 Client Confidentiality (qq-2-034 to qq-2-035)
  { questionId: 'qq-2-034', conceptId: 'C-2-13' },
  { questionId: 'qq-2-035', conceptId: 'C-2-13' },

  // Phase 5A Additions: C-2-16 Work-Life Balance (qq-2-037) — REGRESSION TEST
  { questionId: 'qq-2-037', conceptId: 'C-2-16' },

  // Phase 5A Additions: C-2-23 Cultural Competence (qq-2-038 to qq-2-039)
  { questionId: 'qq-2-038', conceptId: 'C-2-23' },
  { questionId: 'qq-2-039', conceptId: 'C-2-23' },

  // Phase 5A Additions: C-2-24 Career Planning (qq-2-040 to qq-2-041)
  { questionId: 'qq-2-040', conceptId: 'C-2-24' },
  { questionId: 'qq-2-041', conceptId: 'C-2-24' },

  // Phase 5A Additions: C-2-25 Leadership & Mentorship (qq-2-042)
  { questionId: 'qq-2-042', conceptId: 'C-2-25' },

  // Phase 5B-P1.5 Additions: C-2-04 Mission & Purpose (qq-2-043)
  { questionId: 'qq-2-043', conceptId: 'C-2-04' },

  // Phase 5B-P1.5 Additions: C-2-05 Positive Professional Attitude (qq-2-044 to qq-2-047)
  { questionId: 'qq-2-044', conceptId: 'C-2-05' },
  { questionId: 'qq-2-045', conceptId: 'C-2-05' },
  { questionId: 'qq-2-046', conceptId: 'C-2-05' },
  { questionId: 'qq-2-047', conceptId: 'C-2-05' },

  // Phase 5B-P1.5 Additions: Three YELLOW Assessment Gaps (qq-2-048 to qq-2-050)
  { questionId: 'qq-2-048', conceptId: 'C-2-02', subconceptId: 'SC-2-02-b' },
  { questionId: 'qq-2-049', conceptId: 'C-2-11' },
  { questionId: 'qq-2-050', conceptId: 'C-2-12', subconceptId: 'SC-2-12-b' },
] as const
