import fs from 'fs'
import path from 'path'
import { describe, expect, it } from 'vitest'
import {
  INITIAL_MICRO_CHECK_ATTEMPT,
  microCheckAttemptAllowsExplanation,
  microCheckAttemptAllowsHint,
  microCheckAttemptEvidencePhases,
  reduceMicroCheckAttempt,
} from '@/lib/micro-checks/attempt-state'
import {
  buildMicroCheckEvidence,
  calculateInitialMicroCheckPercent,
} from '@/lib/micro-checks/evidence'
import { buildMicroCheckCoverageHint } from '@/lib/micro-checks/hint-content'
import { hintLeaksAnswer } from '@/lib/micro-checks/hints'
import {
  registeredMicroCheckChapterIds,
  registeredMicroCheckQuestions,
  resolveRegisteredMicroCheckQuestion,
} from '@/lib/micro-checks/registry'

const root = process.cwd()
const read = (relativePath: string) =>
  fs.readFileSync(path.join(root, relativePath), 'utf-8')

describe('MC-R1F.7 final hint and retry certification', () => {
  it('certifies complete Chapter 1-21 and 330-question coverage', () => {
    const chapterIds = registeredMicroCheckChapterIds()
    const entries = registeredMicroCheckQuestions()

    expect(chapterIds).toEqual(
      Array.from({ length: 21 }, (_, index) => `ch-${index + 1}`),
    )
    expect(entries).toHaveLength(330)
    expect(new Set(entries.map((entry) => entry.question.id)).size).toBe(330)

    for (let chapter = 1; chapter <= 21; chapter += 1) {
      const resolved = resolveRegisteredMicroCheckQuestion(
        `ch-${chapter}`,
        `mcq-${chapter}-001`,
      )
      expect(resolved?.chapterId).toBe(`ch-${chapter}`)
    }
  })

  it('certifies every registered hint is non-empty and answer-safe', () => {
    const failures: string[] = []

    for (const entry of registeredMicroCheckQuestions()) {
      const question = {
        ...entry.question,
        conceptFamilyId:
          entry.question.conceptFamilyId ??
          entry.question.conceptId ??
          entry.conceptId,
      }
      const hint = buildMicroCheckCoverageHint(question)

      if (
        hint.source !== 'question' ||
        !hint.text.trim() ||
        hintLeaksAnswer(hint.text, question)
      ) {
        failures.push(entry.question.id)
      }
    }

    expect(failures).toEqual([])
  })

  it('certifies miss -> hint -> retry -> completion without early explanation', () => {
    const missed = reduceMicroCheckAttempt(INITIAL_MICRO_CHECK_ATTEMPT, {
      type: 'SUBMIT_INITIAL',
      correct: false,
    })

    expect(missed.state).toBe('initial_incorrect_hint')
    expect(microCheckAttemptAllowsHint(missed)).toBe(true)
    expect(microCheckAttemptAllowsExplanation(missed)).toBe(false)
    expect(microCheckAttemptEvidencePhases(missed)).toEqual(['initial'])

    const retry = reduceMicroCheckAttempt(missed, {
      type: 'START_REMEDIATION',
    })
    const completed = reduceMicroCheckAttempt(retry, {
      type: 'SUBMIT_REMEDIATION',
      correct: true,
    })

    expect(completed.initialCorrect).toBe(false)
    expect(completed.remediationCorrect).toBe(true)
    expect(microCheckAttemptEvidencePhases(completed)).toEqual([
      'initial',
      'remediation',
    ])
    expect(microCheckAttemptAllowsExplanation(completed)).toBe(true)
  })

  it('certifies remediation cannot overwrite first-attempt grading evidence', () => {
    const records = buildMicroCheckEvidence({
      context: {
        studentId: 'cert-student',
        chapterId: 'ch-4',
        conceptFamilyId: 'ch4-disinfection-sterilization',
        itemId: 'mcq-4-004',
        difficulty: 'scenario',
      },
      snapshot: {
        state: 'remediation_complete',
        initialCorrect: false,
        remediationCorrect: true,
      },
      timestamps: {
        initial: '2026-10-05T01:10:00.000Z',
        remediation: '2026-10-05T01:11:00.000Z',
      },
    })

    expect(records).toHaveLength(2)
    expect(records[0].attemptPhase).toBe('initial')
    expect(records[0].correct).toBe(false)
    expect(records[1].attemptPhase).toBe('remediation')
    expect(records[1].correct).toBe(true)
    expect(calculateInitialMicroCheckPercent(records)).toBe(0)
  })

  it('certifies every chapter card stays on the shared remediation path', () => {
    for (let chapter = 1; chapter <= 21; chapter += 1) {
      const source = read(
        `src/components/chapter/Chapter${chapter}MicroCheckCard.tsx`,
      )

      expect(source).toContain(
        "import MicroCheckRemediationPanel from './MicroCheckRemediationPanel'",
      )
      expect(source).toContain('<MicroCheckRemediationPanel')
      expect(source).toContain(`chapterId="ch-${chapter}"`)
      expect(source).toContain('question={question}')
    }
  })

  it('certifies accessibility and answer-reveal boundaries remain intact', () => {
    const panel = read('src/components/chapter/MicroCheckRemediationPanel.tsx')
    const choices = read('src/components/chapter/RandomizedMicroCheckChoices.tsx')

    expect(panel).toContain('retryRegionRef.current?.focus()')
    expect(panel).toContain('completionRef.current?.focus()')
    expect(panel).toContain('role="status"')
    expect(panel).toContain('aria-live="polite"')
    expect(panel).toContain('role="alert"')
    expect(panel).toContain('aria-busy={saving}')
    expect(panel).toContain("snapshot.state === 'remediation_complete'")
    expect(panel).toContain('{question.explanation}')

    expect(choices).toContain('role="group"')
    expect(choices).toContain('aria-label="Answer choices"')
    expect(choices).toContain('aria-pressed={active}')
    expect(choices).toContain('focus-visible:ring-2')
    expect(choices).not.toContain('correctAnswer')
    expect(choices).not.toContain('is_correct')
  })

  it('certifies remediation persistence requires preserved initial evidence', () => {
    const migration = read(
      'supabase/migrations/20261004231000_create_micro_check_remediation_attempts.sql',
    )
    const route = read('src/app/api/micro-checks/remediation/route.ts')

    expect(migration).toContain(
      'references public.chapter_micro_check_attempts (user_id, chapter_id, question_id)',
    )
    expect(migration).toContain(
      'unique (user_id, chapter_id, question_id)',
    )
    expect(migration).not.toContain(
      'grant insert on table public.chapter_micro_check_remediation_attempts to authenticated',
    )

    expect(route).toContain("from('chapter_micro_check_attempts')")
    expect(route).toContain("from('chapter_micro_check_remediation_attempts')")
    expect(route).toContain('if (!initialAttempt)')
    expect(route).toContain('if (initialAttempt.is_correct)')
    expect(route).toContain("error?.code === '23505'")
  })
})
