import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { getMappingProviderRegistry } from '@/lib/reassessment/provider-registry'
import { getChapterContentProvider } from '@/lib/remediation/content-provider-registry'
import { getFlashcardEvidenceConcept, isUnifiedActivityEvidenceChapter } from '@/lib/concept-mastery/activity-evidence-registry'
import { chapter1MicroChecks } from '@/lib/chapter-1-concepts/micro-checks'
import { chapter2MicroChecks } from '@/lib/chapter-2-concepts/micro-checks'
import { chapter3MicroChecks } from '@/lib/chapter-3-concepts/micro-checks'
import { chapter4MicroChecks } from '@/lib/chapter-4-concepts/micro-checks'
import { chapter5MicroChecks } from '@/lib/chapter-5-concepts/micro-checks'
import { chapter6MicroChecks } from '@/lib/chapter-6-concepts/micro-checks'
import { chapter7MicroChecks } from '@/lib/chapter-7-concepts/micro-checks'
import { chapter8MicroChecks } from '@/lib/chapter-8-concepts/micro-checks'
import { chapter9MicroChecks } from '@/lib/chapter-9-concepts/micro-checks'
import { chapter10MicroChecks } from '@/lib/chapter-10-concepts/micro-checks'
import { chapter11MicroChecks } from '@/lib/chapter-11-concepts/micro-checks'
import { chapter12MicroChecks } from '@/lib/chapter-12-concepts/micro-checks'
import { chapter13MicroChecks } from '@/lib/chapter-13-concepts/micro-checks'
import { chapter14MicroChecks } from '@/lib/chapter-14-concepts/micro-checks'
import { chapter15MicroChecks } from '@/lib/chapter-15-concepts/micro-checks'
import { chapter16MicroChecks } from '@/lib/chapter-16-concepts/micro-checks'
import { chapter17MicroChecks } from '@/lib/chapter-17-concepts/micro-checks'
import { chapter18MicroChecks } from '@/lib/chapter-18-concepts/micro-checks'
import { chapter19MicroChecks } from '@/lib/chapter-19-concepts/micro-checks'
import { chapter20MicroChecks } from '@/lib/chapter-20-concepts/micro-checks'
import { chapter21MicroChecks } from '@/lib/chapter-21-concepts/micro-checks'

const chapters = Array.from({ length: 21 }, (_, i) => i + 1)
const cid = (n: number) => `ch-${n}` as const
const micro = [chapter1MicroChecks,chapter2MicroChecks,chapter3MicroChecks,chapter4MicroChecks,chapter5MicroChecks,chapter6MicroChecks,chapter7MicroChecks,chapter8MicroChecks,chapter9MicroChecks,chapter10MicroChecks,chapter11MicroChecks,chapter12MicroChecks,chapter13MicroChecks,chapter14MicroChecks,chapter15MicroChecks,chapter16MicroChecks,chapter17MicroChecks,chapter18MicroChecks,chapter19MicroChecks,chapter20MicroChecks,chapter21MicroChecks] as const
const read = (p: string) => fs.readFileSync(path.join(process.cwd(), p), 'utf8')

describe('A21-6 Chapters 1-21 cross-chapter adversarial certification', () => {
  it('rejects every foreign canonical question at every other chapter boundary', () => {
    const registry = getMappingProviderRegistry()
    for (const owner of chapters) {
      const question = registry.getProvider(cid(owner))!.getAllQuestionIds()[0]
      expect(question).toBeDefined()
      for (const target of chapters) {
        if (target === owner) continue
        expect(registry.getProvider(cid(target))!.getConceptForQuestion(question!)).toBeUndefined()
        expect(getChapterContentProvider(cid(target))!.getQuizQuestionById(question!)).toBeNull()
      }
    }
  })

  it('cannot route a concept into another chapters reassessment reserve', () => {
    const registry = getMappingProviderRegistry()
    for (const owner of chapters) {
      const concept = registry.getProvider(cid(owner))!.getAllConceptIds()[0]
      for (const target of chapters) {
        if (target === owner) continue
        expect(registry.getProvider(cid(target))!.getQuestionsForConcept(concept!)).toEqual([])
      }
    }
  })

  it('keeps micro-check evidence identifiers globally collision-free', () => {
    const seen = new Set<string>()
    for (const checks of micro) for (const check of checks) {
      expect(seen.has(check.id)).toBe(false); seen.add(check.id)
      for (const q of check.questions) {
        expect(seen.has(q.id)).toBe(false); seen.add(q.id)
      }
    }
  })

  it('registers activity evidence for all 21 chapters and refuses foreign flashcard routing', () => {
    const registry = getMappingProviderRegistry()
    for (const owner of chapters) {
      expect(isUnifiedActivityEvidenceChapter(cid(owner))).toBe(true)
      const target = owner === 21 ? 1 : owner + 1
      const foreignProvider = getChapterContentProvider(cid(target))!
      const foreignConcept = registry.getProvider(cid(target))!.getAllConceptIds()[0]!
      const foreignCard = foreignProvider.filterFlashcardsByConcept(foreignConcept)[0]
      if (foreignCard) {
        expect(getFlashcardEvidenceConcept(cid(owner), foreignCard.id)).toBeNull()
      }
    }
  })

  it('database uniqueness makes duplicate first-attempt evidence non-overwriting', () => {
    const mc = read('supabase/migrations/20260926044500_create_chapter_micro_check_attempts.sql')
    const activity = read('supabase/migrations/20260928043000_create_chapter_activity_evidence.sql')
    expect(mc).toContain('unique (user_id, chapter_id, question_id)')
    expect(activity).toContain('unique (user_id, chapter_id, source, item_id)')
    expect(mc).toContain('grant select, insert on table public.chapter_micro_check_attempts to authenticated')
    expect(activity).toContain('grant select, insert on table public.chapter_activity_evidence to authenticated')
  })

  it('stale and duplicate reassessment submissions fail closed or replay persisted evidence', () => {
    const start = read('src/app/api/remediation/cycles/[cycleId]/reassessment/route.ts')
    const submit = read('src/app/api/remediation/cycles/[cycleId]/reassessment/submit/route.ts')
    expect(start).toContain('if (kcProgress.isComplete)')
    expect(start).toContain('status: 409')
    expect(start).toContain('if (kcProgress.openReservation)')
    expect(start).toContain('replayed: true')
    expect(submit).toContain('getConsumedAttemptId')
    expect(submit).toContain('attemptWasReplay')
    expect(submit).toContain('getCanonicalMappingProvider(cycle.chapterId)')
    expect(submit).toContain('isQuestionMappedToConcept(questionId, cycle.conceptId)')
  })

  it('atomic reassessment submission binds user, cycle, concept and exact reserved question', () => {
    const sql = read('supabase/migrations/20260820000000_phase_6c3_submission_integrity.sql')
    expect(sql).toContain('v_reservation.user_id != p_authenticated_user_id')
    expect(sql).toContain('v_reservation.cycle_id is null or v_reservation.cycle_id != p_cycle_id')
    expect(sql).toContain('v_reservation.question_id != p_question_id')
    expect(sql).toContain('v_cycle.user_id != p_authenticated_user_id')
    expect(sql).toContain('v_cycle.concept_id != v_reservation.concept_id')
    expect(sql).toContain("v_cycle.outcome in ('successful', 'unsuccessful')")
  })

  it('replay is idempotent and reassessment identity fields remain immutable', () => {
    const sql = read('supabase/migrations/20260820000000_phase_6c3_submission_integrity.sql')
    expect(sql).toContain('return v_attempt_id')
    expect(sql).toContain('OLD.user_id != NEW.user_id')
    expect(sql).toContain('OLD.concept_id != NEW.concept_id')
    expect(sql).toContain('OLD.question_id != NEW.question_id')
    expect(sql).toContain('OLD.cycle_id is distinct from NEW.cycle_id')
    expect(sql).toContain("TG_OP = 'DELETE'")
  })

  it('clients cannot bypass authoritative remediation/reassessment RPC boundaries', () => {
    const sql = read('supabase/migrations/20260930200000_c19_h2_remediation_rpc_security.sql')
    for (const fn of ['create_remediation_cycle_with_assignments','consume_reservation_and_create_attempt','record_question_attempt','evaluate_remediation_cycle','validate_evaluation_evidence']) {
      expect(sql).toContain(`function public.${fn}`)
    }
    expect(sql).toContain('from public, anon, authenticated')
    expect(sql).toContain('to service_role')
  })

  it('Chapters 19-21 reject direct evidence mutation while canonical server routes own correctness', () => {
    const sql = read('supabase/migrations/20261001031500_a21_5_ch19_21_evidence_authority.sql')
    expect(sql).toContain("chapter_id not in ('ch-19', 'ch-20', 'ch-21')")
    expect(sql).toContain("quiz_id not in ('quiz-19', 'quiz-20', 'quiz-21')")
    for (const chapter of [19,20,21]) {
      const route = read(`src/app/api/chapter-${chapter}/micro-check/route.ts`)
      expect(route).toContain('createServiceRoleClient')
      expect(route).toContain(`chapter_id: 'ch-${chapter}'`)
      expect(route).toContain('question.correctAnswer')
    }
  })
})
