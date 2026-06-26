import { createClient } from '@/lib/supabase-server'
import { isExplicitDemoMode, isSupabaseConfigured } from '@/lib/demo-helpers'

export type BackupStatusValue = 'unknown' | 'ok' | 'warning' | 'error'

export interface BackupStatus {
  id: string
  lastBackupAt: string | null
  status: BackupStatusValue
  backupLocation: string | null
  restoreReady: boolean
  notes: string
  updatedAt: string
  updatedBy: string | null
}

/**
 * Phase 13D — Backup & recovery operational status.
 *
 * Reads and updates the backup_status table. This module does NOT perform
 * actual backups; it surfaces the status set by external backup tooling.
 */
export async function getBackupStatus(): Promise<{ status: BackupStatus; error?: string }> {
  if (isSafeDemoEnvironment()) {
    return {
      status: {
        id: 'demo',
        lastBackupAt: null,
        status: 'unknown',
        backupLocation: null,
        restoreReady: false,
        notes: 'Backup integration not configured. Demo mode.',
        updatedAt: new Date().toISOString(),
        updatedBy: null,
      },
    }
  }

  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('backup_status')
      .select('*')
      .order('id', { ascending: true })
      .limit(1)
      .maybeSingle()

    if (error) {
      if (isMissingTableError(error)) {
        return {
          status: {
            id: 'not-configured',
            lastBackupAt: null,
            status: 'unknown',
            backupLocation: null,
            restoreReady: false,
            notes: 'Backup status table is not available.',
            updatedAt: new Date().toISOString(),
            updatedBy: null,
          },
        }
      }
      return {
        status: buildEmptyStatus(),
        error: error.message,
      }
    }

    if (!data) {
      return { status: buildEmptyStatus() }
    }

    return { status: mapDbStatus(data) }
  } catch (err) {
    return {
      status: buildEmptyStatus(),
      error: err instanceof Error ? err.message : 'Failed to load backup status.',
    }
  }
}

export async function updateBackupStatus(
  input: Partial<Omit<BackupStatus, 'id' | 'updatedAt' | 'updatedBy'>>
): Promise<{ success: boolean; error?: string }> {
  if (isSafeDemoEnvironment()) {
    return { success: false, error: 'Backup status cannot be modified in demo mode.' }
  }

  const supabase = await createClient()

  try {
    const { data: userData } = await supabase.auth.getUser()
    const userId = userData.user?.id ?? null

    const { data: existing } = await supabase
      .from('backup_status')
      .select('id')
      .order('id', { ascending: true })
      .limit(1)
      .maybeSingle()

    const row = {
      ...input,
      updated_at: new Date().toISOString(),
      updated_by: userId,
    }

    let error = null
    if (existing?.id) {
      const result = await supabase.from('backup_status').update(row).eq('id', existing.id)
      error = result.error
    } else {
      const result = await supabase.from('backup_status').insert(row)
      error = result.error
    }

    if (error) {
      if (isMissingTableError(error)) {
        return { success: false, error: 'Backup status table is not available.' }
      }
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to update backup status.',
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

function buildEmptyStatus(): BackupStatus {
  return {
    id: 'not-configured',
    lastBackupAt: null,
    status: 'unknown',
    backupLocation: null,
    restoreReady: false,
    notes: 'No backup status record found.',
    updatedAt: new Date().toISOString(),
    updatedBy: null,
  }
}

function mapDbStatus(row: Record<string, unknown>): BackupStatus {
  return {
    id: String(row.id),
    lastBackupAt: row.last_backup_at ? String(row.last_backup_at) : null,
    status: String(row.status) as BackupStatusValue,
    backupLocation: row.backup_location ? String(row.backup_location) : null,
    restoreReady: Boolean(row.restore_ready),
    notes: String(row.notes ?? ''),
    updatedAt: String(row.updated_at),
    updatedBy: row.updated_by ? String(row.updated_by) : null,
  }
}
