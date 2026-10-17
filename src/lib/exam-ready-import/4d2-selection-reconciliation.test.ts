import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { buildDraftExamPlan, selectDraftExam } from './draft-exam-plan'

const migration = readFileSync(
  resolve(process.cwd(), 'supabase/migrations/20261017190000_exam_ready_4d2_selection_policy.sql'),
  'utf8',
)

const quotas = {
  scientific_concepts: [35, 4],
  implements_equipment: [10, 1],
  hair_care_services: [40, 4],
  facial_hair_skin_care_services: [15, 1],
} as const

function seededRandom(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0
    return state / 4294967296
  }
}

describe('4D-2 version-gated server selection contract', () => {
  it('uses an additive function replacement, not a historical migration edit', () => {
    expect(migration).toContain('create or replace function public.start_or_resume_comprehensive_exam')
    expect(migration).toContain("v_config.blueprint_version = 'exam-ready-573-blueprint-v1'")
    expect(migration).toContain("v_config.blueprint_version <> 'exam-ready-573-blueprint-v1'")
    expect(migration).toContain('u.legacy_rank <= 10')
    expect(migration).toContain('v_config_domain_count <> 4')
    expect(migration).toContain('v_config_domain_mismatches <> 4')
  })

  it('excludes scored questions before ranking experimental candidates', () => {
    const exclusion = migration.indexOf('not exists (select 1 from scored s where s.id = q.id)')
    const ranked = migration.indexOf('unscored_ranked as (')
    const selected = migration.indexOf('unscored as (')
    expect(ranked).toBeGreaterThan(0)
    expect(exclusion).toBeGreaterThan(ranked)
    expect(exclusion).toBeLessThan(selected)
    expect(migration).toContain('partition by q.domain order by gen_random_uuid()')
    expect(migration).toContain('v_distinct_question_count <> 110')
  })

  it('enforces exact experimental quotas and preserves scored quotas', () => {
    for (const [domain, [scored, experimental]] of Object.entries(quotas)) {
      expect(migration).toContain(`s.domain = '${domain}' and s.domain_rank <= ${scored}`)
      expect(migration).toContain(`u.domain = '${domain}' and u.experimental_rank <= ${experimental}`)
    }
    expect(migration).toContain('v_exp_scientific_count <> 4')
    expect(migration).toContain('v_exp_implements_count <> 1')
    expect(migration).toContain('v_exp_hair_count <> 4')
    expect(migration).toContain('v_exp_facial_count <> 1')
  })

  it('retains authorization, snapshots, shuffled keys and atomic fail-closed validation', () => {
    expect(migration).toContain("v_profile.role not in ('student','apprentice')")
    expect(migration).toContain('v_profile.school_id is null')
    expect(migration).toContain('pg_advisory_xact_lock')
    expect(migration).toContain('prompt_snapshot')
    expect(migration).toContain('correct_option_snapshot')
    expect(migration).toContain('array_position(perm.option_labels, o.correct_option)')
    expect(migration).toContain("raise exception 'Generated question set failed comprehensive exam blueprint'")
    expect(migration).not.toMatch(/\b(create table|insert into public\.comprehensive_exam_questions|update public\.comprehensive_exam_configs)\b/i)
  })

  it('produces 1,000 deterministic reference selections with no duplicates', () => {
    const plan = buildDraftExamPlan()
    for (let seed = 1; seed <= 1000; seed++) {
      const selected = selectDraftExam(plan, seededRandom(seed))
      expect(selected).toHaveLength(110)
      expect(new Set(selected.map(q => q.source_question_id)).size).toBe(110)
      for (const [domain, [scored, experimental]] of Object.entries(quotas)) {
        expect(selected.filter(q => q.domain === domain && q.is_scored)).toHaveLength(scored)
        expect(selected.filter(q => q.domain === domain && !q.is_scored)).toHaveLength(experimental)
      }
    }
  })
})
