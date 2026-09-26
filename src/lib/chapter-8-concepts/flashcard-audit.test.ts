import { describe, expect, it } from 'vitest'
import { chapter8PremiumFlashcards } from '../chapter-8-premium-flashcards'
import { chapter8FlashcardConceptMappings } from './mappings'
import {
  chapter8FlashcardAudit,
  chapter8FlashcardAuditCounts,
} from './flashcard-audit'

describe('C8-4 Chapter 8 flashcard audit baseline', () => {
  it('audits all 50 active flashcards exactly once before rewriting', () => {
    const activeIds = chapter8PremiumFlashcards
      .filter((card) => card.is_active)
      .map((card) => card.id)

    expect(activeIds).toHaveLength(50)
    expect(chapter8FlashcardAudit).toHaveLength(50)

    const auditedIds = chapter8FlashcardAudit.map((entry) => entry.flashcardId)
    expect(new Set(auditedIds).size).toBe(50)
    expect(new Set(auditedIds)).toEqual(new Set(activeIds))
  })

  it('preserves the existing concept mapping for every audited card', () => {
    const mapped = new Set(chapter8FlashcardConceptMappings.map((mapping) => mapping.flashcardId))
    expect(chapter8FlashcardAudit.every((entry) => mapped.has(entry.flashcardId))).toBe(true)
  })

  it('uses only KEEP, REWRITE, or REPLACE classifications', () => {
    expect(
      chapter8FlashcardAudit.every((entry) =>
        ['KEEP', 'REWRITE', 'REPLACE'].includes(entry.action),
      ),
    ).toBe(true)
  })

  it('forces explicit review of risky safety and treatment cards', () => {
    const byId = new Map(chapter8FlashcardAudit.map((entry) => [entry.flashcardId, entry.action]))
    expect(byId.get('fc-8-017')).toBe('REPLACE')
    expect(byId.get('fc-8-023')).toBe('REPLACE')
    expect(byId.get('fc-8-032')).toBe('REPLACE')
    expect(byId.get('fc-8-041')).toBe('REPLACE')
    expect(byId.get('fc-8-044')).toBe('REPLACE')
    expect(byId.get('fc-8-049')).toBe('REPLACE')
    expect(byId.get('fc-8-050')).toBe('REPLACE')
  })

  it('locks the exact KEEP / REWRITE / REPLACE audit totals', () => {
    expect(chapter8FlashcardAuditCounts).toEqual({
      KEEP: 11,
      REWRITE: 31,
      REPLACE: 8,
    })
  })
})
