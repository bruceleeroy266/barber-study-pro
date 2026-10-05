import { describe, expect, it } from 'vitest'
import { buildMicroCheckCoverageHint } from '@/lib/micro-checks/hint-content'
import { hintLeaksAnswer } from '@/lib/micro-checks/hints'
import { registeredMicroCheckQuestions } from '@/lib/micro-checks/registry'

describe('MC-R1F.5 hint content coverage', () => {
  const entries = registeredMicroCheckQuestions()

  it('covers the complete 330-question micro-check bank', () => {
    expect(entries).toHaveLength(330)
    expect(new Set(entries.map((entry) => entry.question.id)).size).toBe(330)
  })

  it('provides a safe non-neutral covered hint for every registered question', () => {
    const failures: string[] = []

    for (const entry of entries) {
      const question = {
        ...entry.question,
        conceptFamilyId:
          entry.question.conceptFamilyId ??
          entry.question.conceptId ??
          entry.conceptId,
      }
      const resolved = buildMicroCheckCoverageHint(question)

      if (
        resolved.source !== 'question' ||
        !resolved.text.trim() ||
        hintLeaksAnswer(resolved.text, question)
      ) {
        failures.push(entry.question.id)
      }
    }

    expect(failures).toEqual([])
  })

  it('uses multiple content-aware hint families rather than one generic fallback', () => {
    const hints = entries.map((entry) =>
      buildMicroCheckCoverageHint({
        ...entry.question,
        conceptFamilyId:
          entry.question.conceptFamilyId ??
          entry.question.conceptId ??
          entry.conceptId,
      }).text,
    )

    expect(new Set(hints).size).toBeGreaterThanOrEqual(10)
  })

  it('does not expose source-key or positional answer language', () => {
    for (const entry of entries) {
      const hint = buildMicroCheckCoverageHint({
        ...entry.question,
        conceptFamilyId:
          entry.question.conceptFamilyId ??
          entry.question.conceptId ??
          entry.conceptId,
      }).text

      expect(hint).not.toMatch(/\b(?:choice|option)\s+[abcd]\b/i)
      expect(hint).not.toMatch(/\b(?:pick|select)\s+[abcd]\b/i)
      expect(hint).not.toMatch(
        /\b(?:first|second|third|fourth)\s+(?:choice|option|answer)\b/i,
      )
      expect(hint).not.toMatch(/\b(?:correct answer|answer is)\b/i)
    }
  })

  it('keeps the remediation panel on the covered hint path', () => {
    const fs = require('fs') as typeof import('fs')
    const path = require('path') as typeof import('path')
    const source = fs.readFileSync(
      path.join(
        process.cwd(),
        'src/components/chapter/MicroCheckRemediationPanel.tsx',
      ),
      'utf-8',
    )

    expect(source).toContain(
      "import { buildMicroCheckCoverageHint } from '@/lib/micro-checks/hint-content'",
    )
    expect(source).toContain('buildMicroCheckCoverageHint({')
    expect(source).not.toContain('resolveMicroCheckHint({')
  })
})
