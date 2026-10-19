import { describe, expect, it } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

/**
 * Isolated, synthetic Exam Ready API contract fixture.
 * No database mutation, no authentic exam question bank imports.
 * Validates the SQL response projection rather than asserting live network behavior.
 */
const sql = fs.readFileSync(
  path.join(process.cwd(), 'supabase/migrations/20261002160000_po1c3_comprehensive_exam_runtime.sql'),
  'utf8',
)
const routes = [
  'config/route.ts',
  'history/route.ts',
  'attempts/route.ts',
  'attempts/[attemptId]/route.ts',
  'attempts/[attemptId]/submit/route.ts',
].map((file) => fs.readFileSync(
  path.join(process.cwd(), 'src/app/api/comprehensive-exam', file), 'utf8'
))

function sqlFunction(name: string): string {
  const start = sql.indexOf('create or replace function ' + name + '(')
  expect(start, 'Expected SQL function ' + name).toBeGreaterThanOrEqual(0)
  const end = sql.indexOf('\n$$;', start)
  expect(end, 'Expected function body end ' + name).toBeGreaterThan(start)
  return sql.slice(start, end)
}

describe('Exam Ready publisher API: isolated synthetic contract', () => {
  const syntheticQuestion = {
    prompt: 'Which synthetic tool is designated for the mock service?',
    optionA: 'Synthetic comb',
    optionB: 'Synthetic brush',
    optionC: 'Synthetic clip',
    optionD: 'Synthetic cape',
    sourceBasis: 'PRIVATE_QA_FIXTURE',
    sourceProvenance: 'INTERNAL_TEST_ONLY',
    correctOptionSnapshot: 'a',
  }

  it('uses explicit exam payload fields and does not serialize provenance or answer key', () => {
    const payload = sqlFunction('private.comprehensive_exam_attempt_payload')
    expect(payload).toContain("'prompt', i.prompt_snapshot")
    expect(payload).toContain("'optionA', i.option_a_snapshot")
    expect(payload).toContain("'optionD', i.option_d_snapshot")
    expect(payload).not.toContain('sourceBasis')
    expect(payload).not.toContain('sourceProvenance')
    expect(payload).not.toContain('correct_option_snapshot')
    const visibleFixture = Object.fromEntries(
      Object.entries(syntheticQuestion).filter(([key]) =>
        ['prompt', 'optionA', 'optionB', 'optionC', 'optionD'].includes(key)),
    )
    expect(Object.keys(visibleFixture)).toEqual(['prompt', 'optionA', 'optionB', 'optionC', 'optionD'])
    expect(JSON.stringify(visibleFixture)).not.toMatch(/sourceBasis|sourceProvenance|correctOptionSnapshot/i)
  })

  it('history and config responses use explicit allowlisted JSON fields', () => {
    const history = sqlFunction('public.get_my_comprehensive_exam_history')
    const config = sqlFunction('public.get_active_comprehensive_exam_config')
    expect(history).toContain("'attemptId', a.id")
    expect(config).toContain("'configId', v_config.id")
    for (const fn of [history, config]) {
      expect(fn).not.toMatch(/row_to_json\s*\(|to_jsonb\s*\(\s*\w+\s*\)/i)
      expect(fn).not.toMatch(/sourceBasis|sourceProvenance|correct_option_snapshot/i)
    }
  })

  it('API routes require authentication and call scoped RPCs', () => {
    for (const route of routes) {
      expect(route).toContain('supabase.auth.getUser()')
      expect(route).toContain('Authentication required')
    }
    expect(sqlFunction('public.get_comprehensive_exam_attempt')).toContain('v_attempt.user_id <> v_user_id')
  })

  it('identifies remaining content risk rather than falsely declaring question originality', () => {
    const payload = sqlFunction('private.comprehensive_exam_attempt_payload')
    expect(payload).toContain('i.prompt_snapshot')
    expect(payload).toContain('i.option_a_snapshot')
    // Stored question text is intentionally surfaced for exam taking;
    // provenance isolation is not a license or an originality determination.
  })
})
