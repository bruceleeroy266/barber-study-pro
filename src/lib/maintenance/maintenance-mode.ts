import { createClient } from '@/lib/supabase-server'
import { isExplicitDemoMode, isSupabaseConfigured } from '@/lib/demo-helpers'

export interface MaintenanceModeState {
  enabled: boolean
  message: string
  allowed_roles: string[]
  updated_at: string
  updated_by: string | null
}

const DEFAULT_MESSAGE = 'ASCYN PRO is undergoing scheduled maintenance. Please check back soon.'

/**
 * Phase 13D — Maintenance mode service.
 *
 * Reads and updates the single-row maintenance_mode table. In safe demo mode
 * maintenance mode is always disabled and updates are rejected.
 */
export async function getMaintenanceMode(): Promise<{
  state: MaintenanceModeState
  error?: string
}> {
  if (isSafeDemoEnvironment()) {
    return {
      state: {
        enabled: false,
        message: DEFAULT_MESSAGE,
        allowed_roles: ['platform_super_admin'],
        updated_at: new Date().toISOString(),
        updated_by: null,
      },
    }
  }

  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('maintenance_mode')
      .select('*')
      .order('id', { ascending: true })
      .limit(1)
      .maybeSingle()

    if (error) {
      if (isMissingTableError(error)) {
        return {
          state: {
            enabled: false,
            message: DEFAULT_MESSAGE,
            allowed_roles: ['platform_super_admin'],
            updated_at: new Date().toISOString(),
            updated_by: null,
          },
        }
      }
      return {
        state: {
          enabled: false,
          message: DEFAULT_MESSAGE,
          allowed_roles: ['platform_super_admin'],
          updated_at: new Date().toISOString(),
          updated_by: null,
        },
        error: error.message,
      }
    }

    if (!data) {
      return {
        state: {
          enabled: false,
          message: DEFAULT_MESSAGE,
          allowed_roles: ['platform_super_admin'],
          updated_at: new Date().toISOString(),
          updated_by: null,
        },
      }
    }

    return { state: mapDbState(data) }
  } catch (err) {
    return {
      state: {
        enabled: false,
        message: DEFAULT_MESSAGE,
        allowed_roles: ['platform_super_admin'],
        updated_at: new Date().toISOString(),
        updated_by: null,
      },
      error: err instanceof Error ? err.message : 'Failed to load maintenance mode.',
    }
  }
}

export async function setMaintenanceMode(
  enabled: boolean,
  message?: string,
  allowedRoles?: string[]
): Promise<{ success: boolean; error?: string }> {
  if (isSafeDemoEnvironment()) {
    return { success: false, error: 'Maintenance mode cannot be modified in demo mode.' }
  }

  const supabase = await createClient()

  try {
    const { data: userData } = await supabase.auth.getUser()
    const userId = userData.user?.id ?? null

    const { data: existing } = await supabase
      .from('maintenance_mode')
      .select('id')
      .order('id', { ascending: true })
      .limit(1)
      .maybeSingle()

    const row = {
      enabled,
      message: message ?? DEFAULT_MESSAGE,
      allowed_roles: allowedRoles ?? ['platform_super_admin'],
      updated_at: new Date().toISOString(),
      updated_by: userId,
    }

    let error = null
    if (existing?.id) {
      const result = await supabase.from('maintenance_mode').update(row).eq('id', existing.id)
      error = result.error
    } else {
      const result = await supabase.from('maintenance_mode').insert(row)
      error = result.error
    }

    if (error) {
      if (isMissingTableError(error)) {
        return { success: false, error: 'Maintenance mode table is not available.' }
      }
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to update maintenance mode.',
    }
  }
}

export async function isUserAllowedDuringMaintenance(role: string | null): Promise<boolean> {
  const { state } = await getMaintenanceMode()
  if (!state.enabled) return true
  return state.allowed_roles.includes(role ?? '')
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

function mapDbState(row: Record<string, unknown>): MaintenanceModeState {
  return {
    enabled: Boolean(row.enabled),
    message: String(row.message ?? DEFAULT_MESSAGE),
    allowed_roles: Array.isArray(row.allowed_roles)
      ? (row.allowed_roles as string[])
      : ['platform_super_admin'],
    updated_at: String(row.updated_at),
    updated_by: row.updated_by ? String(row.updated_by) : null,
  }
}
