import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { chapter19MicroChecks } from '@/lib/chapter-19-concepts/micro-checks'
import { chapter20MicroChecks } from '@/lib/chapter-20-concepts/micro-checks'
import { areKnowledgeCheckSectionsComplete } from '@/lib/progress'

const source = readFileSync('src/components/chapter/ChapterContent.tsx', 'utf8')
const genericCompletion = source.split('  useEffect(() => {\n    if (\n      knowledgeChecksSaved ||')[1]?.split('  }, [')[0] ?? ''
const required19 = chapter19MicroChecks.flatMap(check => check.questions.map(q => q.id))
const required20 = chapter20MicroChecks.flatMap(check => check.questions.map(q => q.id))
const allRecorded = (required: string[], recorded: string[]) =>
  required.every(id => new Set(recorded).has(id))

describe('TLS-MICROCHECK-AUDIT-1F completion guard', () => {
  it('uses a Chapter 19 micro-check gate inside the shared section completion effect', () => {
    expect(genericCompletion).toContain("if (chapterId === 'ch-19')")
    expect(genericCompletion).toContain('chapter19MicroCheckAttempts.map')
    expect(genericCompletion).toContain('chapter19MicroChecks.flatMap')
    expect(genericCompletion).toContain('if (!requiredQuestionIds.every((questionId) => recordedQuestionIds.has(questionId)))')
  })
  it('does not allow completed sections to substitute for incomplete Chapter 19 micro-checks', () => {
    expect(areKnowledgeCheckSectionsComplete(['scenario-1'], new Set(['scenario-1']))).toBe(true)
    expect(required19).toHaveLength(14)
    expect(allRecorded(required19, required19.slice(0, 13))).toBe(false)
    expect(allRecorded(required19, required19)).toBe(true)
  })
  it('preserves the equivalent Chapter 20 guard', () => {
    expect(genericCompletion).toContain("if (chapterId === 'ch-20')")
    expect(genericCompletion).toContain('chapter20MicroCheckAttempts.map')
    expect(required20).toHaveLength(12)
    expect(allRecorded(required20, required20.slice(0, 11))).toBe(false)
    expect(allRecorded(required20, required20)).toBe(true)
  })
  it('does not mark zero scenario sections complete', () => {
    expect(areKnowledgeCheckSectionsComplete([], new Set())).toBe(false)
  })
})
