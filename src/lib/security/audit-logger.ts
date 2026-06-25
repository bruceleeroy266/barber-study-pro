/**
 * Phase 13B — Security Audit Logging Foundation
 *
 * Provides structured logging for security-relevant events.
 * In production this can be extended to write to a `security_logs` table,
 * stream to an external SIEM, or both. For Phase 13B we emit structured
 * console logs and expose an optional database insertion path.
 */

import { createClient } from '@/lib/supabase-server'

export type SecurityEventType =
  | 'failed_login'
  | 'permission_denied'
  | 'unauthorized_page_access'
  | 'role_change'
  | 'sensitive_config_change'
  | 'school_isolation_violation'
  | 'id_or_attempt'
  | 'data_export'
  | 'session_expired'
  | 'logout'

export interface SecurityEvent {
  type: SecurityEventType
  userId?: string | null
  email?: string | null
  role?: string | null
  schoolId?: string | null
  resource?: string
  resourceId?: string
  action?: string
  result: 'allowed' | 'denied' | 'blocked' | 'success' | 'failure'
  reason?: string
  metadata?: Record<string, unknown>
  timestamp: string
  userAgent?: string
  ip?: string
}

interface LogSecurityEventOptions {
  /** The user id, if known. */
  userId?: string | null
  /** The user's email, if known. */
  email?: string | null
  /** The user's role, if known. */
  role?: string | null
  /** The user's school id, if known. */
  schoolId?: string | null
  /** Human-readable resource being accessed (e.g. "/admin/school"). */
  resource?: string
  /** Specific record id, if any. */
  resourceId?: string
  /** Action being attempted (e.g. "update", "read", "delete"). */
  action?: string
  /** Optional extra metadata. */
  metadata?: Record<string, unknown>
  /** Optional request context (only available in route handlers / middleware). */
  request?: Request
}

/**
 * Build a security event object. This is pure and safe to call anywhere.
 */
export function buildSecurityEvent(
  type: SecurityEventType,
  result: SecurityEvent['result'],
  reason: string,
  options: LogSecurityEventOptions = {}
): SecurityEvent {
  return {
    type,
    userId: options.userId ?? null,
    email: options.email ?? null,
    role: options.role ?? null,
    schoolId: options.schoolId ?? null,
    resource: options.resource,
    resourceId: options.resourceId,
    action: options.action,
    result,
    reason,
    metadata: options.metadata ?? {},
    timestamp: new Date().toISOString(),
    userAgent: options.request?.headers.get('user-agent') ?? undefined,
    ip: options.request?.headers.get('x-forwarded-for') ?? undefined,
  }
}

/**
 * Log a security event to the console and optionally to the database.
 *
 * This function never throws; failures are swallowed so security logging
 * cannot break application flows.
 */
export async function logSecurityEvent(
  type: SecurityEventType,
  result: SecurityEvent['result'],
  reason: string,
  options: LogSecurityEventOptions = {}
): Promise<void> {
  const event = buildSecurityEvent(type, result, reason, options)

  // Always emit a structured console log.
  const logLine = `[SECURITY] ${event.type} | ${event.result} | ${event.reason} | user=${event.userId ?? 'anonymous'} | resource=${event.resource ?? 'none'} | id=${event.resourceId ?? 'none'}`

  if (event.result === 'denied' || event.result === 'blocked' || event.result === 'failure') {
    console.warn(logLine, event)
  } else {
    console.info(logLine, event)
  }

  // Optionally persist to a security_logs table if it exists.
  // We intentionally swallow errors here; do not let logging break auth flows.
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('security_logs').insert({
      type: event.type,
      user_id: event.userId,
      email: event.email,
      role: event.role,
      school_id: event.schoolId,
      resource: event.resource,
      resource_id: event.resourceId,
      action: event.action,
      result: event.result,
      reason: event.reason,
      metadata: event.metadata,
      user_agent: event.userAgent,
      ip_address: event.ip,
    })
    if (error && !isMissingTableError(error)) {
      console.warn('[SECURITY] Failed to persist security log:', error.message)
    }
  } catch {
    // Ignore persistence errors in Phase 13B foundation.
  }
}

function isMissingTableError(error: { message?: string; code?: string }): boolean {
  return Boolean(
    error.message?.includes('relation') ||
      error.message?.includes('does not exist') ||
      error.code === '42P01'
  )
}

/**
 * Convenience helpers for common events.
 */
export async function logPermissionDenied(
  permission: string,
  options: LogSecurityEventOptions = {}
): Promise<void> {
  await logSecurityEvent('permission_denied', 'denied', `Missing permission: ${permission}`, options)
}

export async function logUnauthorizedAccess(
  resource: string,
  options: LogSecurityEventOptions = {}
): Promise<void> {
  await logSecurityEvent('unauthorized_page_access', 'blocked', `Unauthorized access to ${resource}`, {
    ...options,
    resource,
  })
}

export async function logRoleChange(
  targetUserId: string,
  oldRole: string,
  newRole: string,
  options: LogSecurityEventOptions = {}
): Promise<void> {
  await logSecurityEvent(
    'role_change',
    'success',
    `Role changed from ${oldRole} to ${newRole}`,
    {
      ...options,
      resourceId: targetUserId,
      metadata: { oldRole, newRole },
    }
  )
}

export async function logSensitiveConfigChange(
  resource: string,
  options: LogSecurityEventOptions = {}
): Promise<void> {
  await logSecurityEvent(
    'sensitive_config_change',
    'success',
    `Sensitive configuration changed: ${resource}`,
    {
      ...options,
      resource,
    }
  )
}
