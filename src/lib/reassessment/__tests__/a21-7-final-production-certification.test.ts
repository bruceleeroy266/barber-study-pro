import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { getMappingProviderRegistry } from '@/lib/reassessment/provider-registry'
import { getChapterContentProvider } from '@/lib/remediation/content-provider-registry'
import { getChapterDetectionProvider, isConceptDetectionSupported } from '@/lib/remediation/chapter-registry'
import { getKnowledgeCheckLength } from '@/lib/remediation/knowledge-check'
import { SHARED_GRADE_WEIGHTS } from '@/lib/concept-mastery/shared-grading'

const chapters = Array.from({ length: 21 }, (_, i) => i + 1)
const cid = (n: number) => `ch-${n}` as const
const read = (p: string) => fs.readFileSync(path.join(process.cwd(), p), 'utf8')

describe('A21-7 final Chapters 1-21 production certification', () => {
  it('registers the complete canonical learning/remediation pipeline for every chapter', () => {
    const registry = getMappingProviderRegistry()
    for (const chapter of chapters) {
      const id = cid(chapter)
      const mapping = registry.getProvider(id)
      const content = getChapterContentProvider(id)
      expect(mapping, `${id} mapping`).toBeDefined()
      expect(content, `${id} content`).toBeDefined()
      expect(isConceptDetectionSupported(id), `${id} detection`).toBe(true)
      expect(getChapterDetectionProvider(id), `${id} remediation`).toBeDefined()
      expect(mapping!.getAllConceptIds().length, `${id} concepts`).toBeGreaterThan(0)
      expect(mapping!.getAllQuestionIds().length, `${id} questions`).toBeGreaterThan(0)
      expect(getKnowledgeCheckLength(id), `${id} recovery length`).toBe(5)
    }
  })

  it('locks the certified shared grade contract', () => {
    expect(SHARED_GRADE_WEIGHTS).toEqual({
      micro_check: 0.20,
      flashcard: 0.10,
      chapter_assessment: 0.40,
      scenario_application: 0.15,
      remediation_reassessment: 0.15,
    })
  })

  it('retains A21-2 learner-path and A21-6 adversarial certification in the exact final head', () => {
    expect(fs.existsSync(path.join(process.cwd(), 'src/components/chapter/__tests__/a21-2b-student-path-regression.test.ts'))).toBe(true)
    expect(fs.existsSync(path.join(process.cwd(), 'src/lib/reassessment/__tests__/a21-6-cross-chapter-adversarial.test.ts'))).toBe(true)
  })

  it('retains A21-3 grading/mastery and A21-4 staff visibility certification', () => {
    expect(fs.existsSync(path.join(process.cwd(), 'src/lib/concept-mastery/__tests__/a21-3-grading-mastery.test.ts'))).toBe(true)
    expect(fs.existsSync(path.join(process.cwd(), 'src/lib/oversight/a21-4-instructor-admin-visibility.test.ts'))).toBe(true)
  })

  it('retains A21-5 persistence/security hardening in the final head', () => {
    expect(fs.existsSync(path.join(process.cwd(), 'src/__tests__/migrations/a21-5-persistence-security.test.ts'))).toBe(true)
    const sql = read('supabase/migrations/20261001031500_a21_5_ch19_21_evidence_authority.sql')
    expect(sql).toContain("chapter_id not in ('ch-19', 'ch-20', 'ch-21')")
    expect(sql).toContain("quiz_id not in ('quiz-19', 'quiz-20', 'quiz-21')")
  })

  it('keeps reassessment reservation submission server-only and replay protected', () => {
    const rpc = read('supabase/migrations/20260930200000_c19_h2_remediation_rpc_security.sql')
    const integrity = read('supabase/migrations/20260820000000_phase_6c3_submission_integrity.sql')
    expect(rpc).toContain('consume_reservation_and_create_attempt')
    expect(rpc).toContain('from public, anon, authenticated')
    expect(rpc).toContain('to service_role')
    expect(integrity).toContain('return v_attempt_id')
    expect(integrity).toContain('v_cycle.concept_id != v_reservation.concept_id')
  })

  it('keeps same-school instructor/admin evidence isolation in the final head', () => {
    const activity = read('supabase/migrations/20260928043000_create_chapter_activity_evidence.sql')
    const micro = read('supabase/migrations/20260926044500_create_chapter_micro_check_attempts.sql')
    for (const sql of [activity, micro]) {
      expect(sql).toContain('is_school_staff(current_user_school_id())')
      expect(sql).toContain('current_user_school_id() = user_school_id(user_id)')
    }
  })
})
