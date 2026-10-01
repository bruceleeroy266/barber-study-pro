import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { SHARED_GRADE_WEIGHTS, calculateSharedConceptMastery, calculateSharedGrade } from '@/lib/concept-mastery/shared-grading'
import { getKnowledgeCheckLength } from '@/lib/remediation/knowledge-check'
import { hasRecoveredModernConcept } from '@/lib/reassessment/modern-recovery-policy'

const chapters = Array.from({ length: 21 }, (_, i) => `ch-${i + 1}`)
const read = (p: string) => fs.readFileSync(path.join(process.cwd(), p), 'utf8')

describe('A21-3 Chapters 1-21 grading and mastery certification', () => {
  it('locks shared grading to 20/10/40/15/15 and applies recovery without lowering grade', () => {
    expect(SHARED_GRADE_WEIGHTS).toEqual({
      micro_check: 0.20,
      flashcard: 0.10,
      chapter_assessment: 0.40,
      scenario_application: 0.15,
      remediation_reassessment: 0.15,
    })
    const result = calculateSharedGrade({
      microCheckPercent: 80,
      flashcardPercent: 90,
      chapterAssessmentPercent: 70,
      scenarioApplicationPercent: 80,
      remediationReassessmentPercent: 100,
    })
    expect(result.baseGrade).toBeCloseTo(76.47, 2)
    expect(result.finalGrade).toBeGreaterThan(result.baseGrade)
  })

  it.each(chapters)('%s uses a five-question live recovery sequence', (chapterId) => {
    expect(getKnowledgeCheckLength(chapterId)).toBe(5)
  })

  it('enforces 80 percent ordinary and 100 percent urgent-safety recovery', () => {
    expect(hasRecoveredModernConcept({ correctCount: 4, questionCount: 5, urgentSafety: false })).toBe(true)
    expect(hasRecoveredModernConcept({ correctCount: 4, questionCount: 5, urgentSafety: true })).toBe(false)
    expect(hasRecoveredModernConcept({ correctCount: 5, questionCount: 5, urgentSafety: true })).toBe(true)
  })

  it('keeps Chapter 19 urgent practical safety distinct while Chapters 20-21 remain ordinary/compliance', () => {
    const orchestrator = read('src/lib/remediation/detection-orchestrator.ts')
    expect(orchestrator).toContain("concept.conceptId === 'ch19-practical-exam-safety-readiness'")
    expect(orchestrator).toContain('requiredPassPercent')
    const c20 = read('src/lib/chapter-20-concepts/c20-7-reassessment-mastery-recovery.test.ts')
    expect(c20).toContain('CHAPTER20_SAFETY_CRITICAL_CONCEPT_FAMILY_IDS')
    const c21 = read('src/lib/chapter-21-concepts/c21-7-reassessment-mastery-recovery.test.ts')
    expect(c21).toContain('CHAPTER21_SAFETY_CRITICAL_CONCEPT_FAMILY_IDS')
  })

  it('raises mastery by appending reassessment evidence without erasing initial misses', () => {
    const initial = [
      { source: 'chapter_assessment' as const, itemId: 'q1', difficulty: 'application' as const, correct: false, attemptPhase: 'initial' as const, timestamp: '2026-09-30T00:00:00Z' },
      { source: 'micro_check' as const, itemId: 'm1', difficulty: 'application' as const, correct: false, attemptPhase: 'initial' as const, timestamp: '2026-09-30T00:01:00Z' },
    ]
    const before = calculateSharedConceptMastery(initial, '2026-09-30T01:00:00Z')
    const recovery = Array.from({ length: 5 }, (_, i) => ({
      source: 'remediation_reassessment' as const,
      itemId: `r${i + 1}`,
      difficulty: 'application' as const,
      correct: true,
      attemptPhase: 'reassessment' as const,
      timestamp: `2026-09-30T00:1${i}:00Z`,
    }))
    const combined = [...initial, ...recovery]
    const after = calculateSharedConceptMastery(combined, '2026-09-30T01:00:00Z')
    expect(combined.slice(0, initial.length)).toEqual(initial)
    expect(after.initialMissCount).toBe(2)
    expect(after.reassessmentCorrectCount).toBe(5)
    expect(after.mastery).toBeGreaterThan(before.mastery)
  })
})
