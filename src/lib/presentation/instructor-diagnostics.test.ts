/**
 * Tier 2 Presentation — Instructor Diagnostics Translation Tests
 *
 * Proves: name resolution (incl. unknown/retired), chapter titles, exact
 * state/confidence translations, evidence summaries, trigger reasons,
 * coaching composition, knowledge-check tallies, and the student-boundary
 * guard (this module must never be imported by student-served code).
 */

import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'fs'
import { resolve, join } from 'path'
import {
  resolveConceptName,
  resolveChapterTitle,
  translateDetectionState,
  translateConfidence,
  buildEvidenceSummary,
  summarizeObservation,
  buildTriggerReason,
  buildCoachingRecommendation,
  buildKnowledgeCheckTally,
  translateStoredDetectionSummary,
} from './instructor-diagnostics'
import { ACTIVE_CONCEPT_IDS } from '@/lib/chapter-2-concepts/concepts'
import { chapter3ConceptFamilies } from '@/lib/chapter-3-concepts/concepts'
import { chapter4ConceptFamilies } from '@/lib/chapter-4-concepts/concepts'
import { chapter5ConceptFamilies } from '@/lib/chapter-5-concepts/concepts'
import { chapter6ConceptFamilies } from '@/lib/chapter-6-concepts/concepts'
import type { ConceptEvidence } from '@/lib/concept-detection/engine'

function makeEvidence(overrides: Partial<ConceptEvidence> = {}): ConceptEvidence {
  return {
    conceptId: 'C-2-15',
    learningObjectiveId: 'LO-2-08',
    totalObservations: 5,
    uniqueQuestions: 3,
    uniqueQuestionsMissed: 3,
    misses: 4,
    correct: 1,
    missRate: 0.8,
    consecutiveRecentCorrect: 0,
    consecutiveRecentMisses: 3,
    pattern: 'consistent',
    hasHistoricalWeakness: true,
    firstAttemptAt: '2026-08-30T10:00:00Z',
    lastAttemptAt: '2026-09-08T10:00:00Z',
    ...overrides,
  } as ConceptEvidence
}

describe('resolveConceptName', () => {
  it('resolves every active concept to its canonical name', () => {
    for (const id of ACTIVE_CONCEPT_IDS) {
      const name = resolveConceptName(id)
      expect(name).not.toContain('Unknown concept')
      expect(name).not.toContain('retired')
    }
  })

  it('resolves every Chapter 3 concept family to its canonical name', () => {
    for (const family of chapter3ConceptFamilies) {
      expect(resolveConceptName(family.id)).toBe(family.name)
    }
  })

  it('resolves all six Chapter 4 infection-control concept families to canonical names', () => {
    expect(chapter4ConceptFamilies).toHaveLength(6)
    for (const family of chapter4ConceptFamilies) {
      expect(resolveConceptName(family.id)).toBe(family.name)
      expect(resolveConceptName(family.id)).not.toContain('Unknown concept')
    }
  })

  it('resolves all six Chapter 5 implements and equipment concept families to canonical names', () => {
    expect(chapter5ConceptFamilies).toHaveLength(6)
    for (const family of chapter5ConceptFamilies) {
      expect(resolveConceptName(family.id)).toBe(family.name)
      expect(resolveConceptName(family.id)).not.toContain('Unknown concept')
    }
  })

  it('resolves all ten Chapter 6 anatomy/physiology concept families to canonical names', () => {
    expect(chapter6ConceptFamilies).toHaveLength(10)
    for (const family of chapter6ConceptFamilies) {
      expect(resolveConceptName(family.id)).toBe(family.name)
      expect(resolveConceptName(family.id)).not.toContain('Unknown concept')
      expect(resolveConceptName(family.id)).not.toContain(family.id)
    }
  })

  it('marks the retired concept explicitly', () => {
    expect(resolveConceptName('C-2-22')).toContain('retired concept')
  })

  it('degrades gracefully for unknown IDs (future chapters)', () => {
    expect(resolveConceptName('C-99-01')).toBe('Unknown concept (C-99-01)')
  })
})

describe('resolveChapterTitle', () => {
  it('resolves ch-2 to its canonical title with number', () => {
    expect(resolveChapterTitle('ch-2')).toBe('Life Skills (Chapter 2)')
  })

  it('resolves Chapter 4 to its canonical title with number', () => {
    const title = resolveChapterTitle('ch-4')
    expect(title).toContain('(Chapter 4)')
    expect(title).not.toBe('Chapter 4')
  })

  it('resolves Chapter 5 to its canonical title for instructor presentation', () => {
    const title = resolveChapterTitle('ch-5')
    expect(title).toContain('(Chapter 5)')
    expect(title).not.toBe('Chapter 5')
  })

  it('resolves Chapter 6 to its canonical instructor title', () => {
    expect(resolveChapterTitle('ch-6')).toBe('General Anatomy and Physiology (Chapter 6)')
  })

  it('falls back to a numbered chapter for unknown IDs', () => {
    expect(resolveChapterTitle('ch-99')).toBe('Chapter 99')
  })
})

describe('translateDetectionState', () => {
  it('translates all five states exactly', () => {
    expect(translateDetectionState('currently_performing_well')).toBe('Performing well')
    expect(translateDetectionState('improving')).toBe('Improving after earlier misses')
    expect(translateDetectionState('emerging_weakness')).toBe('Early signs of difficulty')
    expect(translateDetectionState('repeated_weakness')).toBe('Repeated difficulty')
    expect(translateDetectionState('insufficient_evidence')).toBe('Not enough evidence yet')
  })
})

describe('translateConfidence', () => {
  it('translates all three levels exactly', () => {
    expect(translateConfidence('low')).toBe('Evidence strength: limited — few observations')
    expect(translateConfidence('medium')).toBe('Evidence strength: moderate')
    expect(translateConfidence('high')).toBe('Evidence strength: strong — consistent pattern')
  })
})

describe('buildEvidenceSummary', () => {
  it('summarizes misses, observations, questions, and date range', () => {
    expect(buildEvidenceSummary(makeEvidence())).toBe(
      '4 misses on 5 observations across 3 questions · Aug 30 – Sep 8',
    )
  })

  it('uses singular forms correctly', () => {
    const s = buildEvidenceSummary(
      makeEvidence({ misses: 1, totalObservations: 1, uniqueQuestions: 1 }),
    )
    expect(s).toContain('1 miss on 1 observation across 1 question')
  })

  it('appends the alternating-pattern note when present', () => {
    expect(buildEvidenceSummary(makeEvidence({ pattern: 'alternating' }))).toContain(
      'alternating right/wrong (possible guessing)',
    )
  })

  it('omits the date segment when dates are missing and handles null evidence', () => {
    const s = buildEvidenceSummary(
      makeEvidence({ firstAttemptAt: null, lastAttemptAt: null }),
    )
    expect(s).not.toBeNull()
    expect(s).not.toContain('·')
    expect(buildEvidenceSummary(null)).toBeNull()
    expect(buildEvidenceSummary(undefined)).toBeNull()
  })

  it('collapses same-day ranges to a single date', () => {
    const s = buildEvidenceSummary(
      makeEvidence({
        firstAttemptAt: '2026-09-08T08:00:00Z',
        lastAttemptAt: '2026-09-08T20:00:00Z',
      }),
    )
    expect(s).toContain('· Sep 8')
    expect(s).not.toContain('–')
  })
})

describe('summarizeObservation', () => {
  it('re-derives and translates the engine conclusion from a snapshot', () => {
    // Evidence engineered for repeated_weakness: 5 observations, 4 misses,
    // 3 consecutive recent misses → repeated_weakness per the locked matrix
    const summary = summarizeObservation(makeEvidence())
    expect(summary).not.toBeNull()
    expect(summary!.stateLabel).toBe('Repeated difficulty')
    expect(summary!.confidenceLabel).toMatch(/confidence/)
  })

  it('routes every Chapter 4 concept family through Chapter 4 detection', () => {
    for (const family of chapter4ConceptFamilies) {
      const summary = summarizeObservation(makeEvidence({
        conceptId: family.id,
        learningObjectiveId: family.learningObjectiveId,
      }))
      expect(summary).not.toBeNull()
      expect(summary!.stateLabel).toBe('Repeated difficulty')
      expect(summary!.confidenceLabel).toMatch(/confidence/)
    }
  })

  it('routes every Chapter 5 concept family through Chapter 5 detection', () => {
    for (const family of chapter5ConceptFamilies) {
      const summary = summarizeObservation(makeEvidence({
        conceptId: family.id,
        learningObjectiveId: family.learningObjectiveId,
      }))
      expect(summary).not.toBeNull()
      expect(summary!.stateLabel).toBe('Repeated difficulty')
      expect(summary!.confidenceLabel).toMatch(/confidence/)
    }
  })

  it('routes every Chapter 6 concept family through Chapter 6 detection', () => {
    for (const family of chapter6ConceptFamilies) {
      const summary = summarizeObservation(makeEvidence({
        conceptId: family.id,
        learningObjectiveId: family.learningObjectiveId,
      }))
      expect(summary).not.toBeNull()
      expect(summary!.stateLabel).toBe('Repeated difficulty')
      expect(summary!.confidenceLabel).toContain('Evidence strength:')
      expect(summary!.confidenceLabel).not.toContain('high confidence')
    }
  })

  it('keeps Chapter 3 diagnostic routing working', () => {
    const family = chapter3ConceptFamilies[0]
    const summary = summarizeObservation(makeEvidence({
      conceptId: family.id,
      learningObjectiveId: family.learningObjectiveId,
    }))
    expect(summary).not.toBeNull()
    expect(summary!.stateLabel).toBe('Repeated difficulty')
  })

  it('does not silently route an unknown future concept through Chapter 2', () => {
    expect(summarizeObservation(makeEvidence({ conceptId: 'ch99-future-concept' }))).toBeNull()
  })

  it('returns null for missing evidence', () => {
    expect(summarizeObservation(null)).toBeNull()
  })
})

describe('translateStoredDetectionSummary', () => {
  it('translates persisted engine states without exposing raw identifiers', () => {
    expect(translateStoredDetectionSummary('repeated_weakness')).toBe('Repeated difficulty')
    expect(translateStoredDetectionSummary('currently_performing_well')).toBe('Performing well')
    expect(translateStoredDetectionSummary('emerging_weakness')).toBe('Early signs of difficulty')
    expect(translateStoredDetectionSummary(null)).toBeNull()
  })

  it('fails closed to a neutral label for unknown stored states', () => {
    expect(translateStoredDetectionSummary('future_internal_state')).toBe('Outcome recorded')
  })
})

describe('buildTriggerReason', () => {
  it('uses plural for multiple cycles', () => {
    expect(buildTriggerReason(2)).toBe(
      'Escalated automatically after 2 unsuccessful remediation cycles within 30 days.',
    )
  })

  it('uses singular for one cycle', () => {
    expect(buildTriggerReason(1)).toBe(
      'Escalated automatically after 1 unsuccessful remediation cycle within 30 days.',
    )
  })
})

describe('buildCoachingRecommendation', () => {
  it('builds concept-specific Chapter 4 coaching for all six infection-control families', () => {
    for (const family of chapter4ConceptFamilies) {
      const rec = buildCoachingRecommendation(family.id)
      expect(rec.confusions).toEqual([{ topic: family.name, clarification: family.description }])
      expect(rec.chapterGuidance).toContain('Chapter 4')
      expect(rec.chapterGuidance).toContain('infection-control')
      expect(rec.chapterGuidance).toContain('Knowledge Check')
      expect(rec.enrichmentNote).toBeNull()
    }
  })

  it('builds concept-specific Chapter 6 coaching for all ten families without diagnostic overreach', () => {
    for (const family of chapter6ConceptFamilies) {
      const rec = buildCoachingRecommendation(family.id)
      expect(rec.confusions).toEqual([{ topic: family.name, clarification: family.description }])
      expect(rec.chapterGuidance).toContain('Chapter 6')
      expect(rec.chapterGuidance).toContain('Knowledge Check')
      expect(rec.chapterGuidance).toContain('without diagnosing')
      expect(rec.enrichmentNote).toBeNull()
    }
  })

  it('builds concept-specific Chapter 5 coaching for all six families', () => {
    for (const family of chapter5ConceptFamilies) {
      const rec = buildCoachingRecommendation(family.id)
      expect(rec.confusions).toEqual([{ topic: family.name, clarification: family.description }])
      expect(rec.chapterGuidance).toContain('Chapter 5')
      expect(rec.chapterGuidance).toContain('Knowledge Check')
      expect(rec.enrichmentNote).toBeNull()
    }
  })

  it('keeps Chapter 3 coaching chapter-specific', () => {
    const family = chapter3ConceptFamilies[0]
    const rec = buildCoachingRecommendation(family.id)
    expect(rec.confusions).toEqual([{ topic: family.name, clarification: family.description }])
    expect(rec.chapterGuidance).toContain('Chapter 3')
    expect(rec.enrichmentNote).toBeNull()
  })

  it('includes concept-specific confusions when they exist (C-2-21)', () => {
    const rec = buildCoachingRecommendation('C-2-21')
    expect(rec.confusions.length).toBeGreaterThan(0)
    expect(rec.chapterGuidance.length).toBeGreaterThan(20)
  })

  it('falls back to chapter-level guidance for concepts without confusions (C-2-26)', () => {
    const rec = buildCoachingRecommendation('C-2-26')
    expect(rec.confusions).toHaveLength(0)
    expect(rec.chapterGuidance.length).toBeGreaterThan(20)
  })

  it('includes the enrichment identification for enrichment concepts (C-2-20)', () => {
    const rec = buildCoachingRecommendation('C-2-20')
    expect(rec.enrichmentNote).not.toBeNull()
    expect(rec.enrichmentNote).toContain('ASCYN ENRICHMENT')
  })

  it('has no enrichment note for non-enrichment concepts (C-2-01)', () => {
    expect(buildCoachingRecommendation('C-2-01').enrichmentNote).toBeNull()
  })
})

describe('buildKnowledgeCheckTally', () => {
  it('counts taken and passed knowledge checks', () => {
    const items = [
      { reassessmentCompletedAt: '2026-09-01T10:00:00Z', outcome: 'unsuccessful' },
      { reassessmentCompletedAt: '2026-09-05T10:00:00Z', outcome: 'successful' },
      { reassessmentCompletedAt: null, outcome: null },
    ]
    expect(buildKnowledgeCheckTally(items)).toEqual({ taken: 2, passed: 1 })
  })

  it('handles empty history', () => {
    expect(buildKnowledgeCheckTally([])).toEqual({ taken: 0, passed: 0 })
  })
})

describe('student-boundary guard', () => {
  it('instructor-diagnostics is never imported by student-served code', () => {
    const studentRoots = [
      resolve(process.cwd(), 'src/app/(dashboard)'),
      resolve(process.cwd(), 'src/components/chapter'),
      resolve(process.cwd(), 'src/components/remediation'),
    ]
    const studentOnlyFiles = [
      resolve(process.cwd(), 'src/components/QuizClient.tsx'),
      resolve(process.cwd(), 'src/components/FlashcardClient.tsx'),
    ]
    const violations: string[] = []

    function scan(filePath: string) {
      const src = readFileSync(filePath, 'utf-8')
      if (/instructor-diagnostics/.test(src)) violations.push(filePath)
    }

    function walk(dir: string) {
      for (const entry of readdirSync(dir)) {
        const full = join(dir, entry)
        if (statSync(full).isDirectory()) walk(full)
        else if (/\.(ts|tsx)$/.test(entry)) scan(full)
      }
    }

    for (const root of studentRoots) walk(root)
    for (const f of studentOnlyFiles) scan(f)
    expect(violations).toEqual([])
  })
})
