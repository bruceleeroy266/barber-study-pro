import fs from 'fs'
import path from 'path'
import { describe, expect, it } from 'vitest'
import {
  registeredMicroCheckChapterIds,
  resolveRegisteredMicroCheckQuestion,
} from '@/lib/micro-checks/registry'

const root = process.cwd()
const read = (relativePath: string) =>
  fs.readFileSync(path.join(root, relativePath), 'utf-8')

describe('MC-R1F.4 cross-chapter remediation integration', () => {
  it('registers all 21 chapter micro-check banks', () => {
    expect(registeredMicroCheckChapterIds()).toEqual(
      Array.from({ length: 21 }, (_, index) => `ch-${index + 1}`),
    )

    for (let chapter = 1; chapter <= 21; chapter += 1) {
      const resolved = resolveRegisteredMicroCheckQuestion(
        `ch-${chapter}`,
        `mcq-${chapter}-001`,
      )
      expect(resolved?.chapterId).toBe(`ch-${chapter}`)
      expect(resolved?.question.id).toBe(`mcq-${chapter}-001`)
    }
  })

  it('wires every Chapter 1-21 card to the shared remediation panel', () => {
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
      expect(source).toContain('{attempt.is_correct && (')
      expect(source).toContain('{!attempt.is_correct && (')
    }
  })

  it('keeps answer-revealing explanations behind the correct/retry-complete boundary', () => {
    for (let chapter = 1; chapter <= 21; chapter += 1) {
      const source = read(
        `src/components/chapter/Chapter${chapter}MicroCheckCard.tsx`,
      )

      expect(source).toContain(
        '{attempt.is_correct && (\n                  <p className="mt-1">{question.explanation}</p>',
      )
    }

    const panel = read(
      'src/components/chapter/MicroCheckRemediationPanel.tsx',
    )
    expect(panel).toContain("state: 'initial_incorrect_hint'")
    expect(panel).toContain("type: 'START_REMEDIATION'")
    expect(panel).toContain("type: 'SUBMIT_REMEDIATION'")
    expect(panel).toContain("{question.explanation}")
    expect(panel).toContain("snapshot.state === 'remediation_complete'")
  })

  it('persists remediation separately and requires preserved first-attempt evidence', () => {
    const migration = read(
      'supabase/migrations/20261004231000_create_micro_check_remediation_attempts.sql',
    )
    expect(migration).toContain('chapter_micro_check_remediation_attempts')
    expect(migration).toContain('unique (user_id, chapter_id, question_id)')
    expect(migration).toContain(
      'references public.chapter_micro_check_attempts (user_id, chapter_id, question_id)',
    )
    expect(migration).toContain('on delete cascade')
    expect(migration).not.toContain(
      'grant insert on table public.chapter_micro_check_remediation_attempts to authenticated',
    )

    const route = read('src/app/api/micro-checks/remediation/route.ts')
    expect(route).toContain("from('chapter_micro_check_attempts')")
    expect(route).toContain("from('chapter_micro_check_remediation_attempts')")
    expect(route).toContain('if (!initialAttempt)')
    expect(route).toContain('if (initialAttempt.is_correct)')
    expect(route).toContain("error?.code === '23505'")
    expect(route).toContain('resolveRegisteredMicroCheckQuestion')
  })

  it('does not alter the immutable first-attempt table contract', () => {
    const original = read(
      'supabase/migrations/20260926044500_create_chapter_micro_check_attempts.sql',
    )

    expect(original).toContain(
      'unique (user_id, chapter_id, question_id)',
    )
    expect(original).toContain(
      "'Immutable first-attempt lesson micro-check evidence used for mastery, grade, and instructor diagnostics.'",
    )
  })
})
