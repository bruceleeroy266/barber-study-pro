import { describe, expect, it } from 'vitest'
import {
  buildChapter8MicroCheckEvidence,
  chapter8MicroChecks,
  classifyChapter8MicroCheckSafetyEvidence,
  validateChapter8MicroCheckPlacements,
} from './micro-checks'

describe('C8-6 Chapter 8 micro checks', () => {
  it('covers all ten concepts with 22 application-oriented questions', () => {
    expect(chapter8MicroChecks).toHaveLength(10)
    const questions = chapter8MicroChecks.flatMap((check) => check.questions)
    expect(questions).toHaveLength(22)
    expect(new Set(chapter8MicroChecks.map((check) => check.conceptFamilyId)).size).toBe(10)
    expect(questions.every((question) => ['understanding', 'application', 'scenario'].includes(question.difficulty))).toBe(true)
  })

  it('matches canonical placement definitions', () => {
    expect(validateChapter8MicroCheckPlacements()).toBe(true)
  })

  it('builds immutable initial micro-check evidence without duplicate responses', () => {
    const records = buildChapter8MicroCheckEvidence(
      'student-1',
      [
        { questionId: 'mcq-8-007', selectedAnswer: 'b' },
        { questionId: 'mcq-8-007', selectedAnswer: 'a' },
        { questionId: 'mcq-8-020', selectedAnswer: 'a' },
      ],
      '2026-09-26T14:00:00Z',
    )
    expect(records).toHaveLength(2)
    expect(records.every((record) => record.chapterId === 'ch-8')).toBe(true)
    expect(records.every((record) => record.source === 'micro_check')).toBe(true)
    expect(records.every((record) => record.attemptPhase === 'initial')).toBe(true)
  })

  it('escalates scenario misses in electrical and light safety concepts', () => {
    const equipment = chapter8MicroChecks.flatMap((c) => c.questions).find((q) => q.id === 'mcq-8-007')!
    const light = chapter8MicroChecks.flatMap((c) => c.questions).find((q) => q.id === 'mcq-8-020')!
    const nonSafety = chapter8MicroChecks.flatMap((c) => c.questions).find((q) => q.id === 'mcq-8-003')!
    expect(classifyChapter8MicroCheckSafetyEvidence(equipment, false)).toBe('critical')
    expect(classifyChapter8MicroCheckSafetyEvidence(light, false)).toBe('critical')
    expect(classifyChapter8MicroCheckSafetyEvidence(nonSafety, false)).toBe('standard')
    expect(classifyChapter8MicroCheckSafetyEvidence(light, true)).toBe('standard')
  })
})
