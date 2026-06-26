'use server'

import { createClient } from '@/lib/supabase-server'
import { isAdmin } from '@/lib/auth-helpers'
import { hasPermission } from '@/lib/security/permissions'
import { SecurityEventType } from '@/lib/security/audit-logger'

export type AuditLogResult = 'allowed' | 'denied' | 'blocked' | 'success' | 'failure'

export interface AuditLogEntry {
  id: string
  type: SecurityEventType
  user_id: string | null
  email: string | null
  role: string | null
  school_id: string | null
  resource: string | null
  resource_id: string | null
  action: string | null
  result: AuditLogResult
  reason: string | null
  metadata: Record<string, unknown>
  created_at: string
  user_agent: string | null
  ip_address: string | null
}

export interface AuditFilters {
  dateFrom?: string
  dateTo?: string
  userId?: string
  schoolId?: string
  type?: SecurityEventType
  result?: AuditLogResult
  limit?: number
  offset?: number
}

export interface AuditHistoryResult {
  logs: AuditLogEntry[]
  count: number
  error?: string
}

export async function getAuditHistory(filters: AuditFilters = {}): Promise<AuditHistoryResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { logs: [], count: 0, error: 'Unauthorized' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, school_id')
    .eq('id', user.id)
    .single()

  if (!profile || !isAdmin(profile.role)) {
    return { logs: [], count: 0, error: 'Forbidden' }
  }

  // Phase 13D: regular school admins can only view logs for their school.
  // Platform super admins may view all logs.
  const canViewPlatformLogs = hasPermission(profile.role, 'view_platform_analytics')
  const effectiveSchoolId = canViewPlatformLogs ? filters.schoolId : profile.school_id

  try {
    let countQuery = supabase.from('security_logs').select('*', { count: 'exact', head: true })
    let dataQuery = supabase.from('security_logs').select('*')

    if (effectiveSchoolId) {
      countQuery = countQuery.eq('school_id', effectiveSchoolId)
      dataQuery = dataQuery.eq('school_id', effectiveSchoolId)
    }

    if (filters.userId) {
      countQuery = countQuery.eq('user_id', filters.userId)
      dataQuery = dataQuery.eq('user_id', filters.userId)
    }

    if (filters.type) {
      countQuery = countQuery.eq('type', filters.type)
      dataQuery = dataQuery.eq('type', filters.type)
    }

    if (filters.result) {
      countQuery = countQuery.eq('result', filters.result)
      dataQuery = dataQuery.eq('result', filters.result)
    }

    if (filters.dateFrom) {
      countQuery = countQuery.gte('created_at', filters.dateFrom)
      dataQuery = dataQuery.gte('created_at', filters.dateFrom)
    }

    if (filters.dateTo) {
      countQuery = countQuery.lte('created_at', filters.dateTo)
      dataQuery = dataQuery.lte('created_at', filters.dateTo)
    }

    const limit = filters.limit ?? 50
    const offset = filters.offset ?? 0

    const [{ count, error: countError }, { data, error: dataError }] = await Promise.all([
      countQuery,
      dataQuery
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1),
    ])

    if (countError || dataError) {
      if (isMissingTableError(countError || dataError)) {
        return { logs: [], count: 0, error: 'Audit log table (security_logs) is not available.' }
      }
      return {
        logs: [],
        count: 0,
        error: countError?.message || dataError?.message || 'Failed to load audit history.',
      }
    }

    return {
      logs: (data ?? []).map(mapDbLog),
      count: count ?? 0,
    }
  } catch (err) {
    return {
      logs: [],
      count: 0,
      error: err instanceof Error ? err.message : 'Failed to load audit history.',
    }
  }
}

function isMissingTableError(error: { message?: string; code?: string } | null | undefined): boolean {
  if (!error) return false
  return Boolean(
    error.message?.includes('relation') ||
      error.message?.includes('does not exist') ||
      error.code === '42P01'
  )
}

function mapDbLog(row: Record<string, unknown>): AuditLogEntry {
  return {
    id: String(row.id),
    type: String(row.type) as SecurityEventType,
    user_id: row.user_id ? String(row.user_id) : null,
    email: row.email ? String(row.email) : null,
    role: row.role ? String(row.role) : null,
    school_id: row.school_id ? String(row.school_id) : null,
    resource: row.resource ? String(row.resource) : null,
    resource_id: row.resource_id ? String(row.resource_id) : null,
    action: row.action ? String(row.action) : null,
    result: String(row.result) as AuditLogResult,
    reason: row.reason ? String(row.reason) : null,
    metadata: (row.metadata as Record<string, unknown>) ?? {},
    created_at: String(row.created_at),
    user_agent: row.user_agent ? String(row.user_agent) : null,
    ip_address: row.ip_address ? String(row.ip_address) : null,
  }
}
