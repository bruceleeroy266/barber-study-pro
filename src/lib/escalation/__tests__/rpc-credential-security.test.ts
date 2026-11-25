/**
 * SEC-RELEASE-01E — Guard privileged escalation client credentials.
 * These are source-contract tests; authenticated RPC behavior is separately
 * certified by the local-only integration suite.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createClient } from '@supabase/supabase-js'
import { SupabaseEscalationDatabaseClient, createSupabaseEscalationClient } from '../supabase-client'

vi.mock('@supabase/supabase-js', () => ({ createClient: vi.fn(() => ({})) }))
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const source = fs.readFileSync(path.join(root, 'src/lib/escalation/supabase-client.ts'), 'utf8')
const guard = fs.readFileSync(path.join(root, 'tests/integration/setup/production-guard.ts'), 'utf8')
const migration = fs.readFileSync(path.join(root, 'supabase/migrations/20261109131846_sec_school_isolation_02b_revoke_privileged_rpc_execute.sql'), 'utf8')

const rpcSignatures = [
  'check_sustained_performance_reset_eligibility(uuid, text)',
  'execute_sustained_performance_reset(uuid, text, uuid)',
  'record_detection_state_transition(uuid, text, text, text, jsonb)',
  'record_follow_up_evidence(uuid, text, text, uuid, boolean, integer)',
]

describe('SEC-RELEASE-01E privileged RPC controls', () => {
  beforeEach(() => vi.clearAllMocks())
  afterEach(() => vi.unstubAllEnvs())

  it('rejects an empty privileged key before constructing a client', () => {
    expect(() => new SupabaseEscalationDatabaseClient({
      url: 'http://localhost:54321', anonKey: 'public-key', serviceRoleKey: '',
    })).toThrow('SUPABASE_SERVICE_ROLE_KEY is required')
    expect(createClient).not.toHaveBeenCalled()
  })

  it('fails closed at the environment factory when service role is absent', () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'http://localhost:54321')
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'public-key')
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', '')
    expect(() => createSupabaseEscalationClient()).toThrow('SUPABASE_SERVICE_ROLE_KEY')
    expect(createClient).not.toHaveBeenCalled()
  })

  it('constructs the client with the service-role credential only', () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'http://localhost:54321')
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'public-key')
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'trusted-test-key')
    createSupabaseEscalationClient()
    expect(createClient).toHaveBeenCalledWith('http://localhost:54321', 'trusted-test-key', expect.any(Object))
  })
  it('has no anon-key fallback in the escalation client', () => {
    expect(source).not.toContain('config.serviceRoleKey ?? config.anonKey')
    expect(source).toContain('createClient(config.url, config.serviceRoleKey')
    expect(source).toContain('if (!config.serviceRoleKey)')
    expect(source).toContain('if (!url || !anonKey || !serviceRoleKey)')
    expect(source).toContain('SUPABASE_SERVICE_ROLE_KEY is required')
  })

  it.each(rpcSignatures)('revokes public invocation of %s', (signature) => {
    expect(migration).toContain(`REVOKE EXECUTE ON FUNCTION public.${signature} FROM PUBLIC, anon, authenticated;`)
    expect(migration).toContain(`GRANT EXECUTE ON FUNCTION public.${signature} TO service_role;`)
  })

  it('enforces loopback-only integration targets', () => {
    expect(guard).toContain("ASCYN_TEST_ENVIRONMENT !== 'true'")
    expect(guard).toContain("'NEXT_PUBLIC_SUPABASE_URL'")
    expect(guard).toContain("'TEST_DATABASE_URL'")
    expect(guard).toContain("'127.0.0.1'")
    expect(guard).toContain('sb_secret_')
    expect(guard).toContain('sb_publishable_')
  })
})
