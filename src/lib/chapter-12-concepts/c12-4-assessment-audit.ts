import type { Chapter12ConceptFamilyId } from './types'

export type Chapter12AssessmentAuditVerdict = 'REWRITE'

export interface Chapter12AssessmentAuditEntry {
  questionId: `qq-12-${string}`
  conceptFamilyId: Chapter12ConceptFamilyId
  difficulty: 'easy' | 'medium' | 'hard'
  sourceRefs: readonly string[]
  verdict: Chapter12AssessmentAuditVerdict
}

export const chapter12AssessmentAudit: readonly Chapter12AssessmentAuditEntry[] = [
  { questionId: 'qq-12-001', conceptFamilyId: 'ch12-client-care-professional-practice', difficulty: 'medium', sourceRefs: ['fc-ch12-001', 'lesson:why-facial-massage-matters'], verdict: 'REWRITE' },
  { questionId: 'qq-12-002', conceptFamilyId: 'ch12-client-care-professional-practice', difficulty: 'hard', sourceRefs: ['lesson:client-consultation', 'lesson:contraindications-safety'], verdict: 'REWRITE' },
  { questionId: 'qq-12-003', conceptFamilyId: 'ch12-client-care-professional-practice', difficulty: 'medium', sourceRefs: ['fc-ch12-111', 'fc-ch12-112'], verdict: 'REWRITE' },
  { questionId: 'qq-12-004', conceptFamilyId: 'ch12-client-care-professional-practice', difficulty: 'easy', sourceRefs: ['fc-ch12-001'], verdict: 'REWRITE' },

  { questionId: 'qq-12-005', conceptFamilyId: 'ch12-facial-anatomy-neurovascular', difficulty: 'easy', sourceRefs: ['fc-ch12-004'], verdict: 'REWRITE' },
  { questionId: 'qq-12-006', conceptFamilyId: 'ch12-facial-anatomy-neurovascular', difficulty: 'easy', sourceRefs: ['fc-ch12-005'], verdict: 'REWRITE' },
  { questionId: 'qq-12-007', conceptFamilyId: 'ch12-facial-anatomy-neurovascular', difficulty: 'easy', sourceRefs: ['fc-ch12-007'], verdict: 'REWRITE' },
  { questionId: 'qq-12-008', conceptFamilyId: 'ch12-facial-anatomy-neurovascular', difficulty: 'medium', sourceRefs: ['fc-ch12-008'], verdict: 'REWRITE' },
  { questionId: 'qq-12-009', conceptFamilyId: 'ch12-facial-anatomy-neurovascular', difficulty: 'easy', sourceRefs: ['fc-ch12-009'], verdict: 'REWRITE' },
  { questionId: 'qq-12-010', conceptFamilyId: 'ch12-facial-anatomy-neurovascular', difficulty: 'easy', sourceRefs: ['fc-ch12-012'], verdict: 'REWRITE' },
  { questionId: 'qq-12-011', conceptFamilyId: 'ch12-facial-anatomy-neurovascular', difficulty: 'easy', sourceRefs: ['fc-ch12-017'], verdict: 'REWRITE' },
  { questionId: 'qq-12-012', conceptFamilyId: 'ch12-facial-anatomy-neurovascular', difficulty: 'medium', sourceRefs: ['fc-ch12-021'], verdict: 'REWRITE' },
  { questionId: 'qq-12-013', conceptFamilyId: 'ch12-facial-anatomy-neurovascular', difficulty: 'medium', sourceRefs: ['fc-ch12-026'], verdict: 'REWRITE' },
  { questionId: 'qq-12-014', conceptFamilyId: 'ch12-facial-anatomy-neurovascular', difficulty: 'medium', sourceRefs: ['fc-ch12-035'], verdict: 'REWRITE' },

  { questionId: 'qq-12-015', conceptFamilyId: 'ch12-massage-principles-manipulations', difficulty: 'easy', sourceRefs: ['fc-ch12-040'], verdict: 'REWRITE' },
  { questionId: 'qq-12-016', conceptFamilyId: 'ch12-massage-principles-manipulations', difficulty: 'easy', sourceRefs: ['fc-ch12-041'], verdict: 'REWRITE' },
  { questionId: 'qq-12-017', conceptFamilyId: 'ch12-massage-principles-manipulations', difficulty: 'easy', sourceRefs: ['fc-ch12-042'], verdict: 'REWRITE' },
  { questionId: 'qq-12-018', conceptFamilyId: 'ch12-massage-principles-manipulations', difficulty: 'medium', sourceRefs: ['fc-ch12-043', 'fc-ch12-044'], verdict: 'REWRITE' },
  { questionId: 'qq-12-019', conceptFamilyId: 'ch12-massage-principles-manipulations', difficulty: 'medium', sourceRefs: ['fc-ch12-045'], verdict: 'REWRITE' },
  { questionId: 'qq-12-020', conceptFamilyId: 'ch12-massage-principles-manipulations', difficulty: 'easy', sourceRefs: ['fc-ch12-049'], verdict: 'REWRITE' },
  { questionId: 'qq-12-021', conceptFamilyId: 'ch12-massage-principles-manipulations', difficulty: 'medium', sourceRefs: ['fc-ch12-037'], verdict: 'REWRITE' },
  { questionId: 'qq-12-022', conceptFamilyId: 'ch12-massage-principles-manipulations', difficulty: 'hard', sourceRefs: ['lesson:massage-movements', 'lesson:contraindications-safety'], verdict: 'REWRITE' },

  { questionId: 'qq-12-023', conceptFamilyId: 'ch12-equipment-electrotherapy', difficulty: 'easy', sourceRefs: ['fc-ch12-057'], verdict: 'REWRITE' },
  { questionId: 'qq-12-024', conceptFamilyId: 'ch12-equipment-electrotherapy', difficulty: 'easy', sourceRefs: ['fc-ch12-052', 'fc-ch12-053'], verdict: 'REWRITE' },
  { questionId: 'qq-12-025', conceptFamilyId: 'ch12-equipment-electrotherapy', difficulty: 'medium', sourceRefs: ['fc-ch12-061'], verdict: 'REWRITE' },
  { questionId: 'qq-12-026', conceptFamilyId: 'ch12-equipment-electrotherapy', difficulty: 'medium', sourceRefs: ['fc-ch12-062'], verdict: 'REWRITE' },
  { questionId: 'qq-12-027', conceptFamilyId: 'ch12-equipment-electrotherapy', difficulty: 'medium', sourceRefs: ['fc-ch12-068'], verdict: 'REWRITE' },
  { questionId: 'qq-12-028', conceptFamilyId: 'ch12-equipment-electrotherapy', difficulty: 'medium', sourceRefs: ['fc-ch12-073'], verdict: 'REWRITE' },
  { questionId: 'qq-12-029', conceptFamilyId: 'ch12-equipment-electrotherapy', difficulty: 'hard', sourceRefs: ['lesson:board-exam-alerts', 'fc-ch12-064', 'fc-ch12-077', 'fc-ch12-078'], verdict: 'REWRITE' },

  { questionId: 'qq-12-030', conceptFamilyId: 'ch12-skin-analysis-product-selection', difficulty: 'easy', sourceRefs: ['fc-ch12-082'], verdict: 'REWRITE' },
  { questionId: 'qq-12-031', conceptFamilyId: 'ch12-skin-analysis-product-selection', difficulty: 'hard', sourceRefs: ['fc-ch12-086', 'fc-ch12-087'], verdict: 'REWRITE' },
  { questionId: 'qq-12-032', conceptFamilyId: 'ch12-skin-analysis-product-selection', difficulty: 'medium', sourceRefs: ['lesson:cleansers-toners-astringents', 'fc-ch12-091', 'fc-ch12-092'], verdict: 'REWRITE' },
  { questionId: 'qq-12-033', conceptFamilyId: 'ch12-skin-analysis-product-selection', difficulty: 'medium', sourceRefs: ['lesson:cleansers-toners-astringents', 'fc-ch12-093', 'fc-ch12-094'], verdict: 'REWRITE' },
  { questionId: 'qq-12-034', conceptFamilyId: 'ch12-skin-analysis-product-selection', difficulty: 'hard', sourceRefs: ['fc-ch12-096', 'fc-ch12-097'], verdict: 'REWRITE' },
  { questionId: 'qq-12-035', conceptFamilyId: 'ch12-skin-analysis-product-selection', difficulty: 'hard', sourceRefs: ['fc-ch12-098'], verdict: 'REWRITE' },

  { questionId: 'qq-12-036', conceptFamilyId: 'ch12-facial-treatment-procedures', difficulty: 'medium', sourceRefs: ['fc-ch12-100', 'fc-ch12-102', 'lesson:facial-massage-procedure'], verdict: 'REWRITE' },
  { questionId: 'qq-12-037', conceptFamilyId: 'ch12-facial-treatment-procedures', difficulty: 'hard', sourceRefs: ['lesson:hot-towel-safety'], verdict: 'REWRITE' },
  { questionId: 'qq-12-038', conceptFamilyId: 'ch12-facial-treatment-procedures', difficulty: 'medium', sourceRefs: ['lesson:beard-mustache-treatments'], verdict: 'REWRITE' },
  { questionId: 'qq-12-039', conceptFamilyId: 'ch12-facial-treatment-procedures', difficulty: 'medium', sourceRefs: ['lesson:facial-massage-procedure', 'lesson:product-selection-skin-type'], verdict: 'REWRITE' },

  { questionId: 'qq-12-040', conceptFamilyId: 'ch12-sanitation-infection-control', difficulty: 'easy', sourceRefs: ['fc-ch12-113', 'lesson:sanitation-infection-control'], verdict: 'REWRITE' },
  { questionId: 'qq-12-041', conceptFamilyId: 'ch12-sanitation-infection-control', difficulty: 'hard', sourceRefs: ['lesson:sanitation-infection-control'], verdict: 'REWRITE' },
  { questionId: 'qq-12-042', conceptFamilyId: 'ch12-sanitation-infection-control', difficulty: 'hard', sourceRefs: ['lesson:sanitation-infection-control'], verdict: 'REWRITE' },

  { questionId: 'qq-12-043', conceptFamilyId: 'ch12-contraindications-service-safety', difficulty: 'hard', sourceRefs: ['lesson:contraindications-safety', 'lesson:absolute-contraindications'], verdict: 'REWRITE' },
  { questionId: 'qq-12-044', conceptFamilyId: 'ch12-contraindications-service-safety', difficulty: 'hard', sourceRefs: ['fc-ch12-079', 'lesson:absolute-contraindications'], verdict: 'REWRITE' },
  { questionId: 'qq-12-045', conceptFamilyId: 'ch12-contraindications-service-safety', difficulty: 'hard', sourceRefs: ['lesson:contraindications-safety'], verdict: 'REWRITE' },
] as const
