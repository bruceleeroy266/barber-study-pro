/**
 * Direct RPC Authorization Tests
 * 
 * Verifies that RPC functions enforce proper authorization.
 */

import { describe, test, expect, beforeAll, afterAll } from 'vitest'
import { execFileSync } from 'node:child_process'
import { assertTestEnvironment } from '../setup/production-guard'
import {
  setupTestEnvironment,
  cleanupTestEnvironment,
  createAuthenticatedClient,
  getServiceClient,
  createAnonClient,
  resolveActorId,
} from '../setup/db-helpers'
import { TEST_ACTORS, TEST_SCHOOLS } from '../setup/test-actors'
import { getTestEnvironment } from '../setup/test-environment'
import { SupabaseDetectionOrchestratorDbClient } from '../../../src/lib/remediation/detection-orchestrator'
import { SupabaseEscalationDatabaseClient } from '../../../src/lib/escalation/supabase-client'
import { createSustainedPerformanceService } from '../../../src/lib/escalation/sustained-performance-service'

beforeAll(async () => {
  assertTestEnvironment()
  await setupTestEnvironment()
})

afterAll(async () => {
  await cleanupTestEnvironment()
})

describe('RPC Authorization', () => {
  describe('Administrative Functions', () => {
    test('Non-admin cannot call admin functions', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.STUDENT_A)

      // Attempt to call an admin-only function
      const { error } = await client.rpc('get_all_schools')

      // Should fail - function doesn't exist or not authorized
      expect(error).not.toBeNull()
    })

    test('School admin cannot access other school data via RPC', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.SCHOOL_ADMIN_A)

      // Attempt to call a function that might bypass RLS
      const { data, error } = await client.rpc('get_school_students', {
        target_school_id: TEST_SCHOOLS.SCHOOL_B.id,
      })

      // Should fail or return empty
      if (!error) {
        expect(data).toEqual([])
      }
    })
  })

  describe('Security Definer Functions', () => {
    test('create_school_from_inquiry requires platform admin', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.SCHOOL_ADMIN_A)

      // Attempt to call the school creation function directly
      const { error } = await client.rpc('create_school_from_inquiry', {
        inquiry_id: '00000000-0000-0000-0000-000000000000',
      })

      // Should fail - not authorized
      expect(error).not.toBeNull()
    })

    test('Student cannot call school creation function', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.STUDENT_A)

      const { error } = await client.rpc('create_school_from_inquiry', {
        inquiry_id: '00000000-0000-0000-0000-000000000000',
      })

      expect(error).not.toBeNull()
    })
  })

  describe('SQL Injection Prevention', () => {
    test('Parameterized queries prevent injection', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.STUDENT_A)

      // Attempt SQL injection via filter
      const maliciousInput = "'; DROP TABLE students; --"

      const { data, error } = await client
        .from('students')
        .select('*')
        .eq('student_number', maliciousInput)

      // Should not cause error (parameterized query treats it as literal string)
      // Table should still exist
      const serviceClient = getServiceClient()
      const { data: tableCheck } = await serviceClient
        .from('students')
        .select('id')
        .limit(1)

      // Table should still exist
      expect(tableCheck).not.toBeNull()
    })

    test('OR injection attempt is neutralized', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.STUDENT_A)

      // Attempt OR injection
      const { data, error } = await client
        .from('students')
        .select('*')
        .or(`school_id.eq.${TEST_SCHOOLS.SCHOOL_B.id}`)

      // RLS should still filter results
      expect(data).toEqual([])
    })
  })

  test('SEC-RELEASE-01I creates typed Chapter 2 assignments atomically and prevents duplicates', async () => {
    const env = getTestEnvironment()
    const db = new SupabaseDetectionOrchestratorDbClient({
      url: env.supabaseUrl,
      anonKey: env.supabaseAnonKey,
      serviceRoleKey: env.supabaseServiceRoleKey,
    })
    const userId = resolveActorId('STUDENT_A')
    const conceptId = 'SEC-RELEASE-01I-atomic-contract'
    const params = {
      userId,
      conceptId,
      chapterId: 'ch-2' as const,
      cycleNumber: 1,
      detectionState: 'emerging_weakness' as const,
      detectionConfidence: 'high' as const,
      detectionEvidence: {} as any,
      status: 'targeted' as const,
      assignments: [
        { assignmentType: 'content_block' as const, assetId: 'sec-01i-content', priority: 1, isPrimary: true },
        { assignmentType: 'flashcard' as const, assetId: 'sec-01i-card', priority: 2, isPrimary: false },
      ],
    }
    const cycleId = await db.createRemediationCycleWithAssignments(params)
      expect(cycleId, 'A null cycle ID indicates assignment creation failed').toBeTruthy()
      const { data: assignments, error } = await getServiceClient()
        .from('remediation_assignments')
        .select('assignment_type,asset_id,priority,is_primary')
        .eq('cycle_id', cycleId!)
        .order('priority', { ascending: true })
      expect(error).toBeNull()
      expect(assignments).toEqual([
        { assignment_type: 'content_block', asset_id: 'sec-01i-content', priority: 1, is_primary: true },
        { assignment_type: 'flashcard', asset_id: 'sec-01i-card', priority: 2, is_primary: false },
      ])
      const duplicate = await db.createRemediationCycleWithAssignments(params)
      expect(duplicate, 'Repeated detection must not create a second cycle').toBeNull()
    // No DELETE privilege is granted to service_role for remediation_cycles.
    // This suite uses disposable local Supabase; actor teardown cascades via auth.users.
  })


  test('SEC-RELEASE-01J full Chapter 2 tracking, mapped follow-up, eligibility and reset on disposable local DB', async () => {
    // Guard runs in beforeAll before any actor or SQL operation. No remote DB is allowed.
    assertTestEnvironment()
    const env = getTestEnvironment()
    const userId = resolveActorId('STUDENT_B')
    const conceptId = 'SEC-RELEASE-01J-lifecycle'
    const rpc = new SupabaseEscalationDatabaseClient({
      url: env.supabaseUrl,
      anonKey: env.supabaseAnonKey,
      serviceRoleKey: env.supabaseServiceRoleKey,
    })
    const service = createSustainedPerformanceService(rpc, {
      isQuestionMappedToConcept: (questionId: string, concept: string) =>
        questionId === 'sec-01j-question' && concept === conceptId,
    } as any)

    const transition = await service.recordDetectionTransition({
      userId, conceptId, chapterId: 'ch-2',
      newState: 'currently_performing_well', evidence: {} as any,
    })
    expect(transition.success, transition.error).toBe(true)
    const before = await service.checkResetEligibility(userId, conceptId)
    expect(before.isEligible).toBe(false)

    // Time passage cannot be simulated by client metadata. Backdate ONLY the
    // disposable local tracking record using the verified loopback Postgres URL.
    // We never grant service_role the table-level UPDATE privilege for this.
    execFileSync('psql', [
      env.databaseUrl, '-X', '-q', '-v', 'ON_ERROR_STOP=1', '-c',
      `UPDATE public.sustained_performance_tracking
       SET entered_cpw_at = now() - interval '31 days'
       WHERE user_id = '${userId}'::uuid AND concept_id = '${conceptId}'
         AND is_active = true;`,
    ], { stdio: 'pipe' })

    const { data: attempt, error: attemptError } = await getServiceClient()
      .from('quiz_attempts')
      .insert({
        user_id: userId,
        quiz_id: 'quiz-2',
        score: 1,
        total_questions: 1,
        percentage: 100,
        answers_json: { 'sec-01j-question': 'A' },
        completed_at: new Date().toISOString(),
      })
      .select('id')
      .single()
    expect(attemptError).toBeNull()
    expect(attempt?.id).toBeTruthy()

    const followUpParams = {
      userId, conceptId, chapterId: 'ch-2' as const, quizAttemptId: attempt!.id,
    }
    const evidence = await service.recordFollowUpEvidence(
      followUpParams, { 'sec-01j-question': 'A' },
    )
    expect(evidence.success, evidence.error).toBe(true)
    const repeat = await service.recordFollowUpEvidence(
      followUpParams, { 'sec-01j-question': 'A' },
    )
    expect(repeat.success, repeat.error).toBe(true)

    // The database, not the service-layer response, proves no double count.
    const count = execFileSync('psql', [
      env.databaseUrl, '-X', '-A', '-t', '-v', 'ON_ERROR_STOP=1', '-c',
      `SELECT follow_up_evidence_count
         FROM public.sustained_performance_tracking
         WHERE user_id = '${userId}'::uuid AND concept_id = '${conceptId}'
           AND is_active = true;`,
    ], { encoding: 'utf8' }).trim()
    expect(count).toBe('1')

    const eligibility = await service.checkResetEligibility(userId, conceptId)
    expect(eligibility.isEligible, eligibility.blockingReason).toBe(true)
    const reset = await service.executeReset(userId, conceptId)
    expect(reset.success, reset.error).toBe(true)
    expect(reset.resetId).toBeTruthy()
    const resetCount = execFileSync('psql', [
      env.databaseUrl, '-X', '-A', '-t', '-v', 'ON_ERROR_STOP=1', '-c',
      `SELECT count(*) FROM public.sustained_performance_resets
         WHERE user_id = '${userId}'::uuid AND concept_id = '${conceptId}';`,
    ], { encoding: 'utf8' }).trim()
    expect(resetCount).toBe('1')
    const after = await service.checkResetEligibility(userId, conceptId)
    expect(after.isEligible).toBe(false)
  })

  describe('SEC-RELEASE-01E academic RPC service-only contract', () => {
    const calls = [
      { name: 'check_sustained_performance_reset_eligibility', args: { p_user_id: TEST_ACTORS.STUDENT_B.id, p_concept_id: 'test-concept' } },
      { name: 'execute_sustained_performance_reset', args: { p_user_id: TEST_ACTORS.STUDENT_B.id, p_concept_id: 'test-concept', p_executed_by: TEST_ACTORS.STUDENT_A.id } },
      { name: 'record_detection_state_transition', args: { p_user_id: TEST_ACTORS.STUDENT_B.id, p_concept_id: 'test-concept', p_chapter_id: 'ch-2', p_new_state: 'currently_performing_well', p_evidence: {} } },
      { name: 'record_follow_up_evidence', args: { p_user_id: TEST_ACTORS.STUDENT_B.id, p_concept_id: 'test-concept', p_chapter_id: 'ch-2', p_quiz_attempt_id: '00000000-0000-0000-0000-000000000001', p_canonical_mapping_verified: true, p_mapped_question_count: 1 } },
    ] as const

    for (const call of calls) {
      test(`anonymous caller cannot execute ${call.name}`, async () => {
        const { error } = await createAnonClient().rpc(call.name, call.args)
        expect(error, 'Expected an authorization failure, not an empty success result').not.toBeNull()
        // PostgREST may conceal the function entirely or return a permission error.
        expect(['42501', 'PGRST202', 'PGRST301']).toContain(error!.code)
      })

      test(`student cannot execute ${call.name} for another school`, async () => {
        const client = await createAuthenticatedClient(TEST_ACTORS.STUDENT_A)
        const { error } = await client.rpc(call.name, call.args)
        expect(error).not.toBeNull()
        expect(['42501', 'PGRST202', 'PGRST301']).toContain(error!.code)
      })

      test(`school administrator cannot execute ${call.name} directly`, async () => {
        const client = await createAuthenticatedClient(TEST_ACTORS.SCHOOL_ADMIN_A)
        const { error } = await client.rpc(call.name, call.args)
        expect(error).not.toBeNull()
        expect(['42501', 'PGRST202', 'PGRST301']).toContain(error!.code)
      })
    }

    test('trusted service role retains read-only eligibility RPC access', async () => {
      const { error } = await getServiceClient().rpc(
        'check_sustained_performance_reset_eligibility',
        { p_user_id: '00000000-0000-0000-0000-000000000001', p_concept_id: 'nonexistent-concept' },
      )
      expect(error).toBeNull()
    })
  })

})
