/**
 * Audit Helpers for Integration Tests
 * 
 * Provides utilities for verifying audit logging behavior.
 */

import { getServiceClient } from './db-helpers'

export interface SecurityLogEntry {
  id: string
  type: string
  user_id: string | null
  email: string | null
  role: string | null
  school_id: string | null
  resource: string | null
  resource_id: string | null
  action: string | null
  result: 'allowed' | 'denied' | 'blocked' | 'success' | 'failure'
  reason: string | null
  metadata: Record<string, unknown>
  created_at: string
}

export interface UserManagementAuditEntry {
  id: string
  actor_id: string | null
  actor_email: string | null
  actor_role: string | null
  target_user_id: string | null
  target_user_email: string | null
  action: string
  old_values: Record<string, unknown>
  new_values: Record<string, unknown>
  school_id: string | null
  created_at: string
}

/**
 * Gets security logs for a specific user.
 */
export async function getSecurityLogsForUser(userId: string): Promise<SecurityLogEntry[]> {
  const client = getServiceClient()

  const { data, error } = await client
    .from('security_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to get security logs:', error)
    return []
  }

  return data || []
}

/**
 * Gets security logs by type.
 */
export async function getSecurityLogsByType(type: string): Promise<SecurityLogEntry[]> {
  const client = getServiceClient()

  const { data, error } = await client
    .from('security_logs')
    .select('*')
    .eq('type', type)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to get security logs:', error)
    return []
  }

  return data || []
}

/**
 * Gets security logs for a specific school.
 */
export async function getSecurityLogsForSchool(schoolId: string): Promise<SecurityLogEntry[]> {
  const client = getServiceClient()

  const { data, error } = await client
    .from('security_logs')
    .select('*')
    .eq('school_id', schoolId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to get security logs:', error)
    return []
  }

  return data || []
}

/**
 * Gets user management audit logs for a specific actor.
 */
export async function getUserManagementAuditLogs(actorId: string): Promise<UserManagementAuditEntry[]> {
  const client = getServiceClient()

  const { data, error } = await client
    .from('user_management_audit_logs')
    .select('*')
    .eq('actor_id', actorId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to get user management audit logs:', error)
    return []
  }

  return data || []
}

/**
 * Gets user management audit logs for a specific target user.
 */
export async function getUserManagementAuditLogsForTarget(targetUserId: string): Promise<UserManagementAuditEntry[]> {
  const client = getServiceClient()

  const { data, error } = await client
    .from('user_management_audit_logs')
    .select('*')
    .eq('target_user_id', targetUserId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to get user management audit logs:', error)
    return []
  }

  return data || []
}

/**
 * Waits for a security log entry to appear (with timeout).
 */
export async function waitForSecurityLog(
  predicate: (log: SecurityLogEntry) => boolean,
  timeoutMs: number = 5000
): Promise<SecurityLogEntry | null> {
  const client = getServiceClient()
  const startTime = Date.now()

  while (Date.now() - startTime < timeoutMs) {
    const { data } = await client
      .from('security_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    const matchingLog = data?.find(predicate)
    if (matchingLog) {
      return matchingLog
    }

    await new Promise(resolve => setTimeout(resolve, 100))
  }

  return null
}

/**
 * Verifies that a specific security event was logged.
 */
export async function verifySecurityEventLogged(
  type: string,
  userId?: string,
  result?: string
): Promise<boolean> {
  const client = getServiceClient()

  let query = client
    .from('security_logs')
    .select('*')
    .eq('type', type)

  if (userId) {
    query = query.eq('user_id', userId)
  }

  if (result) {
    query = query.eq('result', result)
  }

  const { data, error } = await query.limit(1)

  if (error) {
    console.error('Failed to verify security event:', error)
    return false
  }

  return (data?.length || 0) > 0
}

/**
 * Clears all security logs (for test isolation).
 */
export async function clearSecurityLogs(): Promise<void> {
  const client = getServiceClient()
  await client.from('security_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000')
}

/**
 * Clears all user management audit logs (for test isolation).
 */
export async function clearUserManagementAuditLogs(): Promise<void> {
  const client = getServiceClient()
  await client.from('user_management_audit_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000')
}
