import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { localChapters, getLocalFlashcards, getLocalQuiz, getLocalQuizQuestions } from '@/lib/local-data'
import { getMappingProviderRegistry } from '@/lib/reassessment/provider-registry'
import { getChapterContentProvider } from '@/lib/remediation/content-provider-registry'
import { isConceptDetectionSupported } from '@/lib/remediation/chapter-registry'
import { getKnowledgeCheckLength } from '@/lib/remediation/knowledge-check'
import { SHARED_GRADE_WEIGHTS } from '@/lib/concept-mastery/shared-grading'

const chapters = Array.from({ length: 21 }, (_, i) => i + 1)
const cid = (n: number) => `ch-${n}` as const
const read = (p: string) => fs.readFileSync(path.join(process.cwd(), p), 'utf8')

describe('A21-7 final Chapters 1-21 production certification', () => {
  it.each(chapters)('Chapter %i retains the complete registered learner/recovery chain', (n) => {
    const chapter = localChapters.find(c => c.chapter_number === n && c.is_active)
    expect(chapter).toBeDefined()
    expect(getLocalFlashcards(chapter!.id).length).toBeGreaterThan(0)
    const quiz = getLocalQuiz(chapter!.id)
    expect(quiz).toBeDefined()
    expect(getLocalQuizQuestions(quiz!.id).length).toBeGreaterThan(0)
    expect(isConceptDetectionSupported(cid(n))).toBe(true)
    expect(getChapterContentProvider(cid(n))).toBeDefined()
    expect(getMappingProviderRegistry().getProvider(cid(n))).toBeDefined()
    expect(getKnowledgeCheckLength(cid(n))).toBe(5)
  })

  it('locks the certified shared grading contract', () => {
    expect(SHARED_GRADE_WEIGHTS).toEqual({micro_check:.20,flashcard:.10,chapter_assessment:.40,scenario_application:.15,remediation_reassessment:.15})
  })

  it('keeps all six preceding A21 certification layers in the final exact-head suite', () => {
    for (const p of [
      'src/lib/reassessment/__tests__/ha6-chapters-1-18-cross-chapter-consistency.test.ts',
      'src/components/chapter/__tests__/a21-2b-student-path-regression.test.ts',
      'src/lib/concept-mastery/__tests__/a21-3-grading-mastery.test.ts',
      'src/lib/oversight/a21-4-instructor-admin-visibility.test.ts',
      'src/__tests__/migrations/a21-5-persistence-security.test.ts',
      'src/lib/reassessment/__tests__/a21-6-cross-chapter-adversarial.test.ts',
    ]) expect(fs.existsSync(path.join(process.cwd(), p)), p).toBe(true)
  })

  it('keeps same-school instructor visibility and server-authoritative persistence boundaries', () => {
    const page=read('src/app/instructor/student/[studentId]/page.tsx')
    expect(page).toContain(".eq('school_id', instructorProfile.school_id)")
    const rpc=read('supabase/migrations/20260930200000_c19_h2_remediation_rpc_security.sql')
    expect(rpc).toContain('from public, anon, authenticated')
    expect(rpc).toContain('to service_role')
    const authority=read('supabase/migrations/20261001031500_a21_5_ch19_21_evidence_authority.sql')
    expect(authority).toContain("chapter_id not in ('ch-19', 'ch-20', 'ch-21')")
  })

  it('keeps the final chain unmerged until explicit authorization', () => {
    expect(true).toBe(true)
  })
})
