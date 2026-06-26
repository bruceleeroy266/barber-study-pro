import { createClient } from '@/lib/supabase-server'
import { Notification, NotificationPriority } from '@/types'
import { isExplicitDemoMode, isSupabaseConfigured } from '@/lib/demo-helpers'

export type EnterpriseNotificationType =
  | 'system'
  | 'security'
  | 'compliance'
  | 'attendance'
  | 'grades'
  | 'assessments'
  | 'school_approval'
  | 'account_approval'
  | 'maintenance'

export interface CreateNotificationInput {
  userId?: string | null
  schoolId?: string | null
  type: EnterpriseNotificationType
  title: string
  body: string
  priority?: NotificationPriority
  actionUrl?: string | null
  metadata?: Record<string, unknown>
}

export interface NotificationFilters {
  userId?: string
  schoolId?: string
  type?: EnterpriseNotificationType
  read?: boolean
  archived?: boolean
  limit?: number
}

/**
 * Phase 13D — Enterprise notification service.
 *
 * Creates and queries production notifications. In a safe demo environment
 * (explicit demo + no real Supabase) the service degrades to in-memory data
 * and never pretends to persist.
 */
export async function createNotification(
  input: CreateNotificationInput
): Promise<{ success: boolean; notification?: Notification; error?: string }> {
  if (isSafeDemoEnvironment()) {
    return {
      success: true,
      notification: buildDemoNotification(input),
    }
  }

  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: input.userId,
        school_id: input.schoolId,
        type: input.type,
        title: input.title,
        body: input.body,
        priority: input.priority ?? 'medium',
        action_url: input.actionUrl,
        metadata: input.metadata ?? {},
      })
      .select()
      .single()

    if (error) {
      if (isMissingTableError(error)) {
        return { success: false, error: 'Notifications table is not available.' }
      }
      return { success: false, error: error.message }
    }

    return { success: true, notification: mapDbNotification(data) }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to create notification.',
    }
  }
}

export async function getNotifications(
  filters: NotificationFilters = {}
): Promise<{ notifications: Notification[]; error?: string }> {
  if (isSafeDemoEnvironment()) {
    return { notifications: getDemoNotifications(filters) }
  }

  const supabase = await createClient()

  try {
    let query = supabase.from('notifications').select('*')

    if (filters.userId) {
      query = query.eq('user_id', filters.userId)
    }
    if (filters.schoolId) {
      query = query.eq('school_id', filters.schoolId)
    }
    if (filters.type) {
      query = query.eq('type', filters.type)
    }
    if (typeof filters.read === 'boolean') {
      query = query.eq('read', filters.read)
    }
    if (typeof filters.archived === 'boolean') {
      query = query.eq('archived', filters.archived)
    } else {
      // Default to non-archived.
      query = query.eq('archived', false)
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(filters.limit ?? 100)

    if (error) {
      if (isMissingTableError(error)) {
        return { notifications: [] }
      }
      return { notifications: [], error: error.message }
    }

    return { notifications: (data ?? []).map(mapDbNotification) }
  } catch (err) {
    return {
      notifications: [],
      error: err instanceof Error ? err.message : 'Failed to load notifications.',
    }
  }
}

export async function getUnreadNotificationCount(
  userId: string
): Promise<{ count: number; error?: string }> {
  if (isSafeDemoEnvironment()) {
    return { count: getDemoNotifications({ userId, read: false, archived: false }).length }
  }

  const supabase = await createClient()

  try {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false)
      .eq('archived', false)

    if (error) {
      if (isMissingTableError(error)) {
        return { count: 0 }
      }
      return { count: 0, error: error.message }
    }

    return { count: count ?? 0 }
  } catch (err) {
    return { count: 0, error: err instanceof Error ? err.message : 'Failed to count notifications.' }
  }
}

export async function markNotificationAsRead(
  notificationId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  if (isSafeDemoEnvironment()) {
    return { success: true }
  }

  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true, updated_at: new Date().toISOString() })
      .eq('id', notificationId)
      .eq('user_id', userId)

    if (error) {
      if (isMissingTableError(error)) {
        return { success: false, error: 'Notifications table is not available.' }
      }
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to mark notification as read.',
    }
  }
}

export async function archiveNotification(
  notificationId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  if (isSafeDemoEnvironment()) {
    return { success: true }
  }

  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from('notifications')
      .update({ archived: true, updated_at: new Date().toISOString() })
      .eq('id', notificationId)
      .eq('user_id', userId)

    if (error) {
      if (isMissingTableError(error)) {
        return { success: false, error: 'Notifications table is not available.' }
      }
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to archive notification.',
    }
  }
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

function mapDbNotification(row: Record<string, unknown>): Notification {
  return {
    id: String(row.id),
    userId: row.user_id ? String(row.user_id) : '',
    type: String(row.type) as Notification['type'],
    title: String(row.title),
    body: String(row.body),
    priority: String(row.priority) as NotificationPriority,
    read: Boolean(row.read),
    createdAt: String(row.created_at),
    actionUrl: row.action_url ? String(row.action_url) : null,
  }
}

function buildDemoNotification(input: CreateNotificationInput): Notification {
  return {
    id: `demo-${Date.now()}`,
    userId: input.userId ?? '',
    type: input.type as Notification['type'],
    title: input.title,
    body: input.body,
    priority: input.priority ?? 'medium',
    read: false,
    createdAt: new Date().toISOString(),
    actionUrl: input.actionUrl ?? null,
  }
}

function getDemoNotifications(filters: NotificationFilters): Notification[] {
  const base: Notification[] = [
    {
      id: 'demo-1',
      userId: filters.userId ?? 'demo-user',
      type: 'system',
      title: 'Welcome to ASCYN PRO',
      body: 'Your demo notification center is ready.',
      priority: 'medium',
      read: false,
      createdAt: new Date().toISOString(),
      actionUrl: null,
    },
  ]

  return base.filter((n) => {
    if (filters.type && n.type !== filters.type) return false
    if (typeof filters.read === 'boolean' && n.read !== filters.read) return false
    return true
  })
}
