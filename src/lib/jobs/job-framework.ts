/**
 * Phase 13D — Background Job Framework
 *
 * Lightweight in-app job registry and executor. In production this can be
 * backed by a worker process, cron service, or Supabase pg_cron. The framework
 * provides a common interface so jobs are not tied to a specific runner.
 */

import { createClient } from '@/lib/supabase-server'
import { isExplicitDemoMode, isSupabaseConfigured } from '@/lib/demo-helpers'

export type JobStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'

export interface JobDefinition {
  name: string
  type: string
  description: string
  execute: (payload: Record<string, unknown>) => Promise<{ success: boolean; result?: unknown; error?: string }>
}

export interface BackgroundJob {
  id: string
  name: string
  job_type: string
  payload: Record<string, unknown>
  status: JobStatus
  scheduled_at: string
  started_at?: string | null
  completed_at?: string | null
  last_error?: string | null
  result?: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export interface ScheduleJobInput {
  name: string
  type: string
  payload?: Record<string, unknown>
  scheduledAt?: string
}

const jobRegistry = new Map<string, JobDefinition>()

/**
 * Register a job definition. Called once at module init or app startup.
 */
export function registerJob(definition: JobDefinition): void {
  jobRegistry.set(definition.type, definition)
}

export function getRegisteredJobTypes(): string[] {
  return Array.from(jobRegistry.keys())
}

export async function scheduleJob(
  input: ScheduleJobInput
): Promise<{ success: boolean; job?: BackgroundJob; error?: string }> {
  if (isSafeDemoEnvironment()) {
    return {
      success: true,
      job: buildDemoJob(input),
    }
  }

  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('background_jobs')
      .insert({
        name: input.name,
        job_type: input.type,
        payload: input.payload ?? {},
        status: 'pending',
        scheduled_at: input.scheduledAt ?? new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      if (isMissingTableError(error)) {
        return { success: false, error: 'Background jobs table is not available.' }
      }
      return { success: false, error: error.message }
    }

    return { success: true, job: mapDbJob(data) }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to schedule job.',
    }
  }
}

export async function getJobs(
  status?: JobStatus,
  limit = 50
): Promise<{ jobs: BackgroundJob[]; error?: string }> {
  if (isSafeDemoEnvironment()) {
    return { jobs: getDemoJobs() }
  }

  const supabase = await createClient()

  try {
    let query = supabase.from('background_jobs').select('*')
    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query
      .order('scheduled_at', { ascending: false })
      .limit(limit)

    if (error) {
      if (isMissingTableError(error)) {
        return { jobs: [] }
      }
      return { jobs: [], error: error.message }
    }

    return { jobs: (data ?? []).map(mapDbJob) }
  } catch (err) {
    return { jobs: [], error: err instanceof Error ? err.message : 'Failed to load jobs.' }
  }
}

export async function executePendingJobs(limit = 10): Promise<{
  processed: number
  results: Array<{ jobId: string; success: boolean; error?: string }>
}> {
  const results: Array<{ jobId: string; success: boolean; error?: string }> = []

  if (isSafeDemoEnvironment()) {
    return { processed: 0, results }
  }

  const supabase = await createClient()

  try {
    const { data: pendingJobs, error: fetchError } = await supabase
      .from('background_jobs')
      .select('*')
      .eq('status', 'pending')
      .lte('scheduled_at', new Date().toISOString())
      .order('scheduled_at', { ascending: true })
      .limit(limit)

    if (fetchError || !pendingJobs) {
      return { processed: 0, results }
    }

    for (const raw of pendingJobs) {
      const job = mapDbJob(raw)
      const definition = jobRegistry.get(job.job_type)

      if (!definition) {
        await markJobStatus(job.id, 'failed', `No job definition registered for type: ${job.job_type}`)
        results.push({ jobId: job.id, success: false, error: 'Unknown job type' })
        continue
      }

      await markJobStatus(job.id, 'running')
      const outcome = await definition.execute(job.payload)
      await markJobComplete(job.id, outcome.success, outcome.result, outcome.error)
      results.push({ jobId: job.id, success: outcome.success, error: outcome.error })
    }

    return { processed: results.length, results }
  } catch (err) {
    return {
      processed: 0,
      results: [
        {
          jobId: 'framework',
          success: false,
          error: err instanceof Error ? err.message : 'Job execution failed.',
        },
      ],
    }
  }
}

async function markJobStatus(
  jobId: string,
  status: JobStatus,
  errorMessage?: string
): Promise<void> {
  const supabase = await createClient()
  const updates: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  }
  if (status === 'running') {
    updates.started_at = new Date().toISOString()
  }
  if (errorMessage) {
    updates.last_error = errorMessage
  }
  await supabase.from('background_jobs').update(updates).eq('id', jobId)
}

async function markJobComplete(
  jobId: string,
  success: boolean,
  result?: unknown,
  errorMessage?: string
): Promise<void> {
  const supabase = await createClient()
  await supabase
    .from('background_jobs')
    .update({
      status: success ? 'completed' : 'failed',
      completed_at: new Date().toISOString(),
      last_error: errorMessage ?? null,
      result: result ? (result as Record<string, unknown>) : {},
      updated_at: new Date().toISOString(),
    })
    .eq('id', jobId)
}

function isSafeDemoEnvironment(): boolean {
  return isExplicitDemoMode() && !isSupabaseConfigured()
}

function isMissingTableError(error: { message?: string; code?: string }): boolean {
  return Boolean(
    error.message?.includes('relation') ||
      error.message?.includes('does not exist') ||
      error.code === '42P01'
  )
}

function mapDbJob(row: Record<string, unknown>): BackgroundJob {
  return {
    id: String(row.id),
    name: String(row.name),
    job_type: String(row.job_type),
    payload: (row.payload as Record<string, unknown>) ?? {},
    status: String(row.status) as JobStatus,
    scheduled_at: String(row.scheduled_at),
    started_at: row.started_at ? String(row.started_at) : null,
    completed_at: row.completed_at ? String(row.completed_at) : null,
    last_error: row.last_error ? String(row.last_error) : null,
    result: (row.result as Record<string, unknown> | null) ?? null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  }
}

function buildDemoJob(input: ScheduleJobInput): BackgroundJob {
  const now = new Date().toISOString()
  return {
    id: `demo-${Date.now()}`,
    name: input.name,
    job_type: input.type,
    payload: input.payload ?? {},
    status: 'pending',
    scheduled_at: input.scheduledAt ?? now,
    started_at: null,
    completed_at: null,
    last_error: null,
    result: null,
    created_at: now,
    updated_at: now,
  }
}

function getDemoJobs(): BackgroundJob[] {
  const now = new Date().toISOString()
  return [
    {
      id: 'demo-1',
      name: 'Demo Attendance Recalculation',
      job_type: 'attendance_recalculation',
      payload: {},
      status: 'completed',
      scheduled_at: now,
      started_at: now,
      completed_at: now,
      last_error: null,
      result: { message: 'Demo job completed.' },
      created_at: now,
      updated_at: now,
    },
  ]
}
