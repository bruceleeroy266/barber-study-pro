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
} from './instructor-diagnostics'
import { ACTIVE_CONCEPT_IDS } from '@/lib/chapter-2-concepts/concepts'
import type { ConceptEvidence } from '@/lib/chapter-2-concepts/detection'

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
    expect(translateConfidence('low')).toBe('low confidence — limited observations')
    expect(translateConfidence('medium')).toBe('moderate confidence')
    expect(translateConfidence('high')).toBe('high confidence — consistent pattern')
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

  it('returns null for missing evidence', () => {
    expect(summarizeObservation(null)).toBeNull()
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
