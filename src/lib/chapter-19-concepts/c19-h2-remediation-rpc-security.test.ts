import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = process.cwd()
const read = (path: string) => readFileSync(join(root, path), 'utf8')

describe('C19-H2 shared remediation RPC security hardening', () => {
  it('revokes anon/authenticated execution and preserves service-role execution for shared remediation RPCs', () => {
    const migration = read(
      'supabase/migrations/20260930200000_c19_h2_remediation_rpc_security.sql',
    )

    const serverOnlyFunctions = [
      'create_remediation_cycle_with_assignments',
      'get_active_remediation_cycle_id',
      'consume_reservation_and_create_attempt',
      'record_question_attempt',
      'check_and_record_pool_exhaustion',
      'get_attempted_question_ids',
      'has_attempted_question',
      'evaluate_remediation_cycle',
      'validate_evaluation_evidence',
      'create_instructor_escalation',
    ]

    for (const fn of serverOnlyFunctions) {
      expect(migration).toContain(`revoke execute on function public.${fn}(`)
      expect(migration).toContain(
        ') from public, anon, authenticated;',
      )
      expect(migration).toContain(`grant execute on function public.${fn}(`)
      expect(migration).toContain(') to service_role;')
    }
  })

  it('does not alter Chapter 19 grading, recovery thresholds, or content inventories', () => {
    const migration = read(
      'supabase/migrations/20260930200000_c19_h2_remediation_rpc_security.sql',
    )

    expect(migration).not.toContain('update public.quiz_attempts')
    expect(migration).not.toContain('delete from public.quiz_attempts')
    expect(migration).not.toContain('chapter19Premium')
    expect(migration).not.toContain('0.2')
    expect(migration).not.toContain('0.1')
    expect(migration).not.toContain('0.4')
    expect(migration).not.toContain('0.15')
  })

  it('fails closed if the server-only remediation orchestrator lacks the service-role key', () => {
    const source = read('src/lib/remediation/detection-orchestrator.ts')
    expect(source).toContain('!url || !anonKey || !serviceRoleKey')
    expect(source).toContain('SUPABASE_SERVICE_ROLE_KEY are required')
  })

  it('fails closed if reassessment exclusion/history RPC access lacks the service-role key', () => {
    const source = read('src/lib/reassessment/supabase-client.ts')
    expect(source).toContain('!url || !anonKey || !serviceRoleKey')
    expect(source).toContain('SUPABASE_SERVICE_ROLE_KEY are required')
  })

  it('fails closed if remediation evaluation RPC access lacks the service-role key', () => {
    const source = read('src/lib/evaluation/supabase-client.ts')
    expect(source).toContain('!url || !anonKey || !serviceRoleKey')
    expect(source).toContain('SUPABASE_SERVICE_ROLE_KEY are required')
  })

  it('keeps the trusted API routes on server-side remediation clients', () => {
    const detect = read('src/app/api/remediation/detect/route.ts')
    const reassessment = read(
      'src/app/api/remediation/cycles/[cycleId]/reassessment/route.ts',
    )
    const submit = read(
      'src/app/api/remediation/cycles/[cycleId]/reassessment/submit/route.ts',
    )

    expect(detect).toContain('createSupabaseDetectionOrchestrator()')
    expect(reassessment).toContain('createSupabaseExclusionClient()')
    expect(submit).toContain('createSupabaseExclusionClient()')
    expect(submit).toContain('createSupabaseEvaluationClient()')
    expect(submit).toContain('SUPABASE_SERVICE_ROLE_KEY')
  })
})
