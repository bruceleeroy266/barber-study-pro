/**
 * Phase 13B — Security Audit Logging Foundation
 *
 * Provides structured logging for security-relevant events.
 * In production this can be extended to write to a `security_logs` table,
 * stream to an external SIEM, or both. For Phase 13B we emit structured
 * console logs and persist events to the database using the service-role
 * client so the logger never depends on the caller's RLS context.
 */

import 'server-only'

import { createServiceRoleClient } from '@/lib/supabase-service-role'

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

export const SECURITY_EVENT_TYPES: readonly SecurityEventType[] = [
  'failed_login',
  'permission_denied',
  'unauthorized_page_access',
  'role_change',
  'sensitive_config_change',
  'school_isolation_violation',
  'id_or_attempt',
  'data_export',
  'session_expired',
  'logout',
] as const

export type SecurityEventResult = 'allowed' | 'denied' | 'blocked' | 'success' | 'failure'

export const SECURITY_EVENT_RESULTS: readonly SecurityEventResult[] = [
  'allowed',
  'denied',
  'blocked',
  'success',
  'failure',
] as const

export interface SecurityEvent {
  type: SecurityEventType
  userId?: string | null
  email?: string | null
  role?: string | null
  schoolId?: string | null
  resource?: string
  resourceId?: string
  action?: string
  result: SecurityEventResult
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

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const SAFE_ACTION_RE = /^[a-zA-Z0-9_-]+$/
const NO_CONTROL_CHARS_RE = /^[^\x00-\x1f\x7f]*$/

const MAX_EMAIL_LENGTH = 254
const MAX_ROLE_LENGTH = 64
const MAX_RESOURCE_LENGTH = 256
const MAX_RESOURCE_ID_LENGTH = 256
const MAX_ACTION_LENGTH = 64
const MAX_REASON_LENGTH = 500
const MAX_USER_AGENT_LENGTH = 512
const MAX_IP_LENGTH = 45
const MAX_METADATA_BYTES = 32768
const MAX_METADATA_KEYS = 100

export function isValidUuid(value: unknown): value is string {
  return typeof value === 'string' && UUID_RE.test(value)
}

export function isValidSecurityEventType(value: unknown): value is SecurityEventType {
  return typeof value === 'string' && (SECURITY_EVENT_TYPES as readonly string[]).includes(value)
}

export function isValidSecurityEventResult(value: unknown): value is SecurityEventResult {
  return typeof value === 'string' && (SECURITY_EVENT_RESULTS as readonly string[]).includes(value)
}

function normalizeEmail(email: unknown): string | null {
  if (email === null || email === undefined) return null
  const str = String(email).trim().toLowerCase()
  if (str.length === 0) return null
  return str.slice(0, MAX_EMAIL_LENGTH)
}

function sanitizeString(
  value: unknown,
  maxLength: number,
  pattern: RegExp = NO_CONTROL_CHARS_RE
): string | null {
  if (value === null || value === undefined) return null
  const str = String(value).trim()
  if (str.length === 0) return null
  if (str.length > maxLength) {
    throw new Error(`Security event field exceeds maximum length of ${maxLength}`)
  }
  if (!pattern.test(str)) {
    throw new Error('Security event field contains invalid characters')
  }
  return str
}

function sanitizeAction(action: unknown): string | null {
  if (action === null || action === undefined) return null
  const str = String(action).trim()
  if (str.length === 0) return null
  if (str.length > MAX_ACTION_LENGTH || !SAFE_ACTION_RE.test(str)) {
    throw new Error('Invalid security event action')
  }
  return str
}

function sanitizeUserAgent(ua: unknown): string | null {
  return sanitizeString(ua, MAX_USER_AGENT_LENGTH)
}

function sanitizeIp(ip: unknown): string | null {
  if (ip === null || ip === undefined) return null
  // x-forwarded-for can contain a chain of proxies; retain only the first
  // address and treat it as informational.
  const first = String(ip).split(',')[0].trim()
  if (first.length === 0) return null
  return sanitizeString(first, MAX_IP_LENGTH)
}

function sanitizeMetadata(metadata: unknown): Record<string, unknown> {
  if (metadata === null || metadata === undefined) return {}
  if (typeof metadata !== 'object' || Array.isArray(metadata)) {
    throw new Error('Security event metadata must be a plain object')
  }

  const keys = Object.keys(metadata as Record<string, unknown>)
  if (keys.length > MAX_METADATA_KEYS) {
    throw new Error(`Security event metadata exceeds maximum key count of ${MAX_METADATA_KEYS}`)
  }

  const serialized = JSON.stringify(metadata)
  if (serialized.length > MAX_METADATA_BYTES) {
    throw new Error(`Security event metadata exceeds maximum size of ${MAX_METADATA_BYTES} bytes`)
  }

  return metadata as Record<string, unknown>
}

/**
 * Validate and sanitize all inputs for a security event.
 *
 * Throws on invalid data so callers can decide how to handle bad input.
 * `logSecurityEvent` wraps this in a try/catch so logging failures never
 * break authentication flows.
 */
export function validateSecurityEventInput(
  type: unknown,
  result: unknown,
  reason: unknown,
  options: LogSecurityEventOptions = {}
): void {
  if (!isValidSecurityEventType(type)) {
    throw new Error(`Invalid security event type: ${String(type)}`)
  }
  if (!isValidSecurityEventResult(result)) {
    throw new Error(`Invalid security event result: ${String(result)}`)
  }

  if (options.userId !== undefined && options.userId !== null && !isValidUuid(options.userId)) {
    throw new Error(`Invalid security event userId (must be a UUID): ${String(options.userId)}`)
  }
  if (
    options.schoolId !== undefined &&
    options.schoolId !== null &&
    !isValidUuid(options.schoolId)
  ) {
    throw new Error(`Invalid security event schoolId (must be a UUID): ${String(options.schoolId)}`)
  }

  // These fields are never accepted directly from the browser; validate them
  // defensively in case a caller accidentally forwards user input.
  sanitizeString(reason, MAX_REASON_LENGTH)
  sanitizeString(options.resource, MAX_RESOURCE_LENGTH)
  sanitizeString(options.resourceId, MAX_RESOURCE_ID_LENGTH)
  sanitizeString(options.role, MAX_ROLE_LENGTH)
  sanitizeAction(options.action)
  sanitizeMetadata(options.metadata)
  normalizeEmail(options.email)
  sanitizeUserAgent(options.request?.headers.get('user-agent'))
  sanitizeIp(options.request?.headers.get('x-forwarded-for'))
}

/**
 * Build a security event object. This is pure and safe to call anywhere
 * inside trusted server code.
 */
export function buildSecurityEvent(
  type: SecurityEventType,
  result: SecurityEvent['result'],
  reason: string,
  options: LogSecurityEventOptions = {}
): SecurityEvent {
  validateSecurityEventInput(type, result, reason, options)

  return {
    type,
    userId: options.userId ?? null,
    email: normalizeEmail(options.email),
    role: sanitizeString(options.role, MAX_ROLE_LENGTH),
    schoolId: options.schoolId ?? null,
    resource: sanitizeString(options.resource, MAX_RESOURCE_LENGTH) ?? undefined,
    resourceId: sanitizeString(options.resourceId, MAX_RESOURCE_ID_LENGTH) ?? undefined,
    action: sanitizeAction(options.action) ?? undefined,
    result,
    reason: sanitizeString(reason, MAX_REASON_LENGTH) ?? undefined,
    metadata: sanitizeMetadata(options.metadata),
    timestamp: new Date().toISOString(),
    userAgent: sanitizeUserAgent(options.request?.headers.get('user-agent')) ?? undefined,
    ip: sanitizeIp(options.request?.headers.get('x-forwarded-for')) ?? undefined,
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
  let event: SecurityEvent

  try {
    event = buildSecurityEvent(type, result, reason, options)
  } catch (err) {
    console.warn('[SECURITY] Rejected invalid security event:', err instanceof Error ? err.message : err)
    return
  }

  // Always emit a structured console log.
  const logLine = `[SECURITY] ${event.type} | ${event.result} | ${event.reason} | user=${event.userId ?? 'anonymous'} | resource=${event.resource ?? 'none'} | id=${event.resourceId ?? 'none'}`

  if (event.result === 'denied' || event.result === 'blocked' || event.result === 'failure') {
    console.warn(logLine, event)
  } else {
    console.info(logLine, event)
  }

  // Persist using the service-role client so inserts succeed regardless of
  // the caller's RLS context. Errors are swallowed; logging must never break
  // authentication.
  try {
    const supabase = createServiceRoleClient()
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
  } catch (err) {
    console.warn('[SECURITY] Exception while persisting security log:', err instanceof Error ? err.message : err)
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
