'use server'

import { createClient } from '@/lib/supabase-server'
import { isAdmin } from '@/lib/auth-helpers'
import { SchoolConfiguration } from '@/types'
import { validateSchoolConfiguration, hasValidationErrors } from '@/lib/school-config/validation'
import { logPermissionDenied, logSensitiveConfigChange } from '@/lib/security/audit-logger'

export interface SaveConfigurationResult {
  success: boolean
  message: string
  savedConfig?: SchoolConfiguration
}

export async function saveSchoolConfiguration(
  config: SchoolConfiguration
): Promise<SaveConfigurationResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'You must be signed in to save settings.' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, school_id')
    .eq('id', user.id)
    .single()

  if (!profile || !isAdmin(profile.role)) {
    await logPermissionDenied('manage_settings', {
      userId: user.id,
      email: user.email,
      role: profile?.role ?? null,
      schoolId: profile?.school_id ?? null,
      resource: '/admin/school/configuration',
      action: 'save',
    })
    return { success: false, message: 'Only admins can save school settings.' }
  }

  // Multi-school isolation: an admin must be assigned to a school and may only
  // mutate settings for that school. Never accept a school id from the client.
  if (!profile.school_id) {
    return {
      success: false,
      message: 'You must be assigned to a school before you can save school settings.',
    }
  }

  const errors = validateSchoolConfiguration(config)
  if (hasValidationErrors(errors)) {
    return { success: false, message: 'Please fix validation errors before saving.' }
  }

  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  const supabaseConfigured =
    Boolean(url) &&
    url.startsWith('https://') &&
    !url.includes('your-project') &&
    !url.includes('example.supabase.co') &&
    key.length > 20

  if (demoMode || !supabaseConfigured) {
    return {
      success: true,
      message: 'Settings are valid, but changes are preview-only in demo mode and will not persist.',
      savedConfig: config,
    }
  }

  // Real persistence path.
  try {
    // Fetch existing settings to compute a safe change summary for audit logging.
    const { data: existingRow } = await supabase
      .from('school_settings')
      .select('settings')
      .eq('school_id', profile.school_id)
      .maybeSingle()

    const existingConfig = isSchoolConfiguration(existingRow?.settings)
      ? (existingRow.settings as SchoolConfiguration)
      : null

    const changedFields = existingConfig
      ? getChangedFields(existingConfig, config)
      : ['settings']

    const configWithTimestamp: SchoolConfiguration = {
      ...config,
      updatedAt: new Date().toISOString(),
    }

    const { error } = await supabase
      .from('school_settings')
      .upsert(
        {
          school_id: profile.school_id,
          settings: configWithTimestamp as unknown as Record<string, unknown>,
          name: configWithTimestamp.school.name,
          primary_color: configWithTimestamp.branding.primaryColor,
          contact_email: configWithTimestamp.school.contact_email,
          contact_phone: null,
          updated_at: configWithTimestamp.updatedAt,
          updated_by: user.id,
        },
        { onConflict: 'school_id' }
      )

    if (error) {
      if (isMissingTableError(error)) {
        return {
          success: false,
          message:
            'The school_settings table is not configured yet. Settings are valid but cannot be persisted.',
        }
      }
      return { success: false, message: error.message }
    }

    await logSensitiveConfigChange('school_settings', {
      userId: user.id,
      email: user.email,
      role: profile.role,
      schoolId: profile.school_id,
      resourceId: profile.school_id,
      action: 'save',
      metadata: { changedFields },
    })

    return {
      success: true,
      message: 'School settings saved successfully.',
      savedConfig: configWithTimestamp,
    }
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Failed to save school settings.',
    }
  }
}

function isMissingTableError(error: { message?: string; code?: string }): boolean {
  return Boolean(
    error.message?.includes('relation') ||
      error.message?.includes('does not exist') ||
      error.code === '42P01'
  )
}

function isSchoolConfiguration(value: unknown): boolean {
  return (
    typeof value === 'object' &&
    value !== null &&
    'school' in value &&
    'branding' in value &&
    'programs' in value &&
    'attendancePolicy' in value &&
    'hoursPolicy' in value &&
    'gradebookConfig' in value &&
    'assessmentDefaults' in value
  )
}

function getChangedFields(
  previous: SchoolConfiguration,
  next: SchoolConfiguration
): string[] {
  const fields: string[] = []
  const keys = new Set([
    ...Object.keys(previous),
    ...Object.keys(next),
  ]) as Set<keyof SchoolConfiguration>

  for (const key of keys) {
    if (JSON.stringify(previous[key]) !== JSON.stringify(next[key])) {
      fields.push(key)
    }
  }

  return fields
}
