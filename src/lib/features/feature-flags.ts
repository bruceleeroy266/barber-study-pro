import { createClient } from '@/lib/supabase-server'
import { isExplicitDemoMode, isSupabaseConfigured } from '@/lib/demo-helpers'

export type FeatureFlagKey =
  | 'ai_assistant'
  | 'messaging'
  | 'notifications'
  | 'beta_features'
  | 'school_configuration'
  | 'experimental_modules'

export interface FeatureFlag {
  id: string
  key: FeatureFlagKey
  name: string
  description: string
  enabled: boolean
  school_id: string | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

const defaultFlags: Record<FeatureFlagKey, boolean> = {
  ai_assistant: false,
  messaging: false,
  notifications: true,
  beta_features: false,
  school_configuration: true,
  experimental_modules: false,
}

let globalFlagCache: Record<string, FeatureFlag[]> | null = null
let globalFlagCacheAt: number | null = null
const CACHE_TTL_MS = 60_000

/**
 * Phase 13D — Feature flag service.
 *
 * Resolves a feature flag for the global scope and optionally a school.
 * School-specific flags override global flags. In safe demo mode all flags
 * return their safe defaults.
 */
export async function isFeatureEnabled(
  key: FeatureFlagKey,
  schoolId?: string | null
): Promise<boolean> {
  if (isSafeDemoEnvironment()) {
    return defaultFlags[key] ?? false
  }

  const flags = await getFlags(key)
  const schoolFlag = schoolId
    ? flags.find((f) => f.school_id === schoolId)
    : undefined
  const globalFlag = flags.find((f) => f.school_id === null)

  return schoolFlag?.enabled ?? globalFlag?.enabled ?? defaultFlags[key] ?? false
}

export async function getAllFeatureFlags(): Promise<{ flags: FeatureFlag[]; error?: string }> {
  if (isSafeDemoEnvironment()) {
    return { flags: buildDemoFlags() }
  }

  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('feature_flags')
      .select('*')
      .order('key', { ascending: true })

    if (error) {
      if (isMissingTableError(error)) {
        return { flags: buildDemoFlags() }
      }
      return { flags: [], error: error.message }
    }

    return { flags: (data ?? []).map(mapDbFlag) }
  } catch (err) {
    return {
      flags: [],
      error: err instanceof Error ? err.message : 'Failed to load feature flags.',
    }
  }
}

export async function setFeatureFlag(
  key: FeatureFlagKey,
  enabled: boolean,
  options: {
    schoolId?: string | null
    name?: string
    description?: string
    metadata?: Record<string, unknown>
  } = {}
): Promise<{ success: boolean; error?: string }> {
  if (isSafeDemoEnvironment()) {
    return { success: false, error: 'Feature flags cannot be modified in demo mode.' }
  }

  const supabase = await createClient()

  try {
    const { error } = await supabase.from('feature_flags').upsert(
      {
        key,
        name: options.name ?? key,
        description: options.description ?? '',
        enabled,
        school_id: options.schoolId ?? null,
        metadata: options.metadata ?? {},
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'key,school_id' }
    )

    if (error) {
      if (isMissingTableError(error)) {
        return { success: false, error: 'Feature flags table is not available.' }
      }
      return { success: false, error: error.message }
    }

    invalidateCache()
    return { success: true }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to update feature flag.',
    }
  }
}

async function getFlags(key: FeatureFlagKey): Promise<FeatureFlag[]> {
  const now = Date.now()
  if (globalFlagCache && globalFlagCacheAt && now - globalFlagCacheAt < CACHE_TTL_MS) {
    const cached = globalFlagCache[key]
    if (cached) return cached
  }

  const supabase = await createClient()

  try {
    const { data, error } = await supabase.from('feature_flags').select('*').eq('key', key)

    if (error || !data) {
      return []
    }

    const mapped = data.map(mapDbFlag)
    globalFlagCache = { ...(globalFlagCache ?? {}), [key]: mapped }
    globalFlagCacheAt = now
    return mapped
  } catch {
    return []
  }
}

function invalidateCache(): void {
  globalFlagCache = null
  globalFlagCacheAt = null
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

function mapDbFlag(row: Record<string, unknown>): FeatureFlag {
  return {
    id: String(row.id),
    key: String(row.key) as FeatureFlagKey,
    name: String(row.name),
    description: String(row.description ?? ''),
    enabled: Boolean(row.enabled),
    school_id: row.school_id ? String(row.school_id) : null,
    metadata: (row.metadata as Record<string, unknown>) ?? {},
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  }
}

function buildDemoFlags(): FeatureFlag[] {
  const now = new Date().toISOString()
  return (Object.keys(defaultFlags) as FeatureFlagKey[]).map((key) => ({
    id: `demo-${key}`,
    key,
    name: key,
    description: 'Demo feature flag.',
    enabled: defaultFlags[key],
    school_id: null,
    metadata: {},
    created_at: now,
    updated_at: now,
  }))
}
