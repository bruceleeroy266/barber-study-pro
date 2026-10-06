import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const migration = fs.readFileSync(
  path.join(
    process.cwd(),
    'supabase/migrations/20261002160000_po1c3_comprehensive_exam_runtime.sql',
  ),
  'utf8',
)

const read = (relativePath: string) =>
  fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8')

const apiFiles = [
  'src/app/api/comprehensive-exam/config/route.ts',
  'src/app/api/comprehensive-exam/attempts/route.ts',
  'src/app/api/comprehensive-exam/attempts/[attemptId]/route.ts',
  'src/app/api/comprehensive-exam/attempts/[attemptId]/answers/[position]/route.ts',
  'src/app/api/comprehensive-exam/attempts/[attemptId]/flags/[position]/route.ts',
  'src/app/api/comprehensive-exam/attempts/[attemptId]/submit/route.ts',
  'src/app/api/comprehensive-exam/history/route.ts',
]

describe('PO-1C.3 comprehensive exam runtime', () => {
  it('snapshots timer and passing policy on each attempt', () => {
    expect(migration).toContain('time_limit_seconds_snapshot integer')
    expect(migration).toContain('passing_percentage_snapshot integer')
    expect(migration).toContain('v_config.time_limit_seconds')
    expect(migration).toContain('v_config.passing_percentage')
  })

  it('uses a private safe payload that never returns scoring secrets while active', () => {
    expect(migration).toContain(
      'create or replace function private.comprehensive_exam_attempt_payload',
    )
    expect(migration).toContain("'prompt', i.prompt_snapshot")
    expect(migration).toContain("'selectedOption', i.selected_option")
    expect(migration).not.toMatch(
      /jsonb_build_object\([\s\S]{0,180}['"]correctOption['"]/,
    )
    expect(migration).not.toContain("'isScored', i.is_scored")
    expect(migration).not.toContain("'explanation', i.explanation_snapshot")
  })

  it('keeps the scoring finalizer private and removes ordinary execute access', () => {
    expect(migration).toContain(
      'create or replace function private.finalize_comprehensive_exam_attempt',
    )
    expect(migration).toContain(
      'revoke execute on function private.finalize_comprehensive_exam_attempt(uuid, text)',
    )
    expect(migration).toContain('from public, anon, authenticated')
  })

  it('serializes starts per student/config and keeps the one-active-attempt backstop', () => {
    expect(migration).toContain('pg_advisory_xact_lock')
    expect(migration).toContain('hashtext(v_user_id::text)')
    expect(migration).toContain('hashtext(p_config_id::text)')
    expect(migration).toContain("and status = 'active'")
    expect(migration).toContain('for update;')
  })

  it('does not start an exam from a draft or incomplete configuration', () => {
    expect(migration).toContain("and status = 'active'")
    expect(migration).toContain(
      "raise exception 'Active comprehensive exam configuration not found'",
    )
    expect(migration).toContain(
      "raise exception 'Comprehensive exam configuration is incomplete'",
    )
  })

  it('creates a dedicated comprehensive_exam PO-1B session atomically', () => {
    expect(migration).toContain(
      "v_study_session_id := public.begin_study_session(",
    )
    expect(migration).toContain("'comprehensive_exam'")
    expect(migration).toContain('v_attempt_id::text')
    expect(migration).toContain('study_session_id')
  })

  it('generates the exact 35/10/40/15 scored blueprint plus ten unique unscored items', () => {
    expect(migration).toContain(
      "s.domain = 'scientific_concepts' and s.domain_rank <= 35",
    )
    expect(migration).toContain(
      "s.domain = 'implements_equipment' and s.domain_rank <= 10",
    )
    expect(migration).toContain(
      "s.domain = 'hair_care_services' and s.domain_rank <= 40",
    )
    expect(migration).toContain(
      "s.domain = 'facial_hair_skin_care_services' and s.domain_rank <= 15",
    )
    expect(migration).toContain('and not exists (')
    expect(migration).toContain('limit 10')
    expect(migration).toContain('v_item_count <> 110')
    expect(migration).toContain('v_unscored_count <> 10')
  })

  it('persists one immutable shuffled order and shuffled answer presentation', () => {
    expect(migration).toContain(
      'row_number() over (order by gen_random_uuid())::smallint as position',
    )
    expect(migration).toContain('array_agg(x.option_text order by x.rnd)')
    expect(migration).toContain('array_agg(x.option_label order by x.rnd)')
    expect(migration).toContain(
      'case array_position(perm.option_labels, o.correct_option)',
    )
  })

  it('uses server timestamps for start, expiry, refresh, save, and finalization', () => {
    expect(migration).toContain('v_now := clock_timestamp()')
    expect(migration).toContain(
      'v_now + make_interval(secs => v_config.time_limit_seconds)',
    )
    expect(migration).toContain('clock_timestamp() >= v_attempt.expires_at')
    expect(migration).toContain(
      'least(v_now, expires_at) - started_at',
    )
  })

  it('refresh recovery auto-finalizes an expired active attempt', () => {
    expect(migration).toContain(
      'create or replace function public.get_comprehensive_exam_attempt',
    )
    expect(migration).toContain(
      "private.finalize_comprehensive_exam_attempt(\n      v_attempt.id,\n      'timer_expired'",
    )
  })

  it('persists answers without accepting score or correctness from the client', () => {
    expect(migration).toContain(
      'create or replace function public.save_comprehensive_exam_answer',
    )
    expect(migration).toContain('selected_option = p_selected_option')
    expect(migration).toContain('answered_at = v_now')
    expect(migration).not.toContain('p_score')
    expect(migration).not.toContain('p_correct')
    expect(migration).not.toContain('p_is_scored')
  })

  it('records qualifying PO-1B activity best-effort after a valid answer save', () => {
    expect(migration).toContain(
      'public.record_learning_activity(',
    )
    expect(migration).toContain("'qualifying_activity'")
    expect(migration).toMatch(
      /begin[\s\S]+record_learning_activity[\s\S]+exception when others then[\s\S]+null;/,
    )
  })

  it('persists flags independently with no score effect', () => {
    expect(migration).toContain(
      'create or replace function public.set_comprehensive_exam_flag',
    )
    expect(migration).toContain('flagged = p_flagged')
    expect(migration).toContain(
      "case when p_flagged then 'flag_set' else 'flag_cleared' end",
    )
  })

  it('scores only the 100 scored snapshots and keeps unscored correctness separate', () => {
    expect(migration).toContain('where is_scored')
    expect(migration).toContain('v_percentage := round(v_scored_correct * 100.0 / 100)')
    expect(migration).toContain('unscored_correct = v_unscored_correct')
    expect(migration).toContain('unscored_total = 10')
  })

  it('calculates domain breakdown from scored items only', () => {
    expect(migration).toMatch(
      /from public\.comprehensive_exam_attempt_items[\s\S]+where attempt_id = v_attempt\.id[\s\S]+and is_scored[\s\S]+group by domain/,
    )
  })

  it('makes submission idempotent', () => {
    expect(migration).toContain(
      'create or replace function public.submit_comprehensive_exam_attempt',
    )
    expect(migration).toContain(
      "if v_attempt.status <> 'active' then",
    )
    expect(migration).toContain(
      'return private.comprehensive_exam_attempt_payload(v_attempt.id);',
    )
  })

  it('closes telemetry best-effort without rolling back a valid exam result', () => {
    expect(migration).toContain(
      "perform public.end_study_session(v_attempt.study_session_id, 'explicit_end')",
    )
    expect(migration).toContain("'telemetry_end_failed'")
  })

  it('keeps readiness deferred instead of inventing a second readiness pipeline', () => {
    expect(migration).toContain("readiness_sync_status = 'pending'")
    expect(migration.toLowerCase()).not.toContain(
      'insert into public.student_progress',
    )
    expect(migration.toLowerCase()).not.toContain(
      'update public.student_progress',
    )
  })

  it('preserves the H&A firewall', () => {
    const sql = migration.toLowerCase()
    expect(sql).not.toContain('public.hour_logs')
    expect(sql).not.toContain('effective_hour_logs')
    expect(sql).not.toContain('attendance_corrections')
    expect(sql).not.toContain('hour_adjustments')
  })

  it('adds only thin authenticated API routes with no service-role bypass', () => {
    for (const file of apiFiles) {
      const source = read(file)
      expect(source).toContain("createClient")
      expect(source).toContain('supabase.auth.getUser()')
      expect(source.toLowerCase()).not.toContain('service_role')
      expect(source.toLowerCase()).not.toContain('service role')
    }
  })

  it('keeps scoring logic out of the API routes', () => {
    const api = apiFiles.map(read).join('\n').toLowerCase()
    expect(api).not.toContain('correct_option')
    expect(api).not.toContain('correct answer')
    expect(api).not.toContain('scored_correct')
    expect(api).not.toContain('domain_breakdown')
  })

  it('keeps PO-1C.3 itself runtime/API-only even after later UI slices exist', () => {
    const lower = migration.toLowerCase()
    expect(lower).not.toContain('examshell.tsx')
    expect(lower).not.toContain('questionnavigator.tsx')
    expect(lower).not.toContain('examquestion.tsx')
    expect(lower).not.toContain('reviewscreen.tsx')
    expect(lower).not.toContain('examresults.tsx')
    expect(lower).not.toContain('/dashboard/exam-ready')
  })
})
