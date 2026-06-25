'use server'

import { createClient } from '@/lib/supabase-server'
import { isAdmin } from '@/lib/auth-helpers'
import { SchoolConfiguration } from '@/types'
import { validateSchoolConfiguration, hasValidationErrors } from '@/lib/school-config/validation'
import { logPermissionDenied, logSensitiveConfigChange } from '@/lib/security/audit-logger'

export interface SaveConfigurationResult {
  success: boolean
  message: string
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
    url.startsWith('https://') &&
    !url.includes('your-project') &&
    !url.includes('example.supabase.co') &&
    key.length > 20

  if (demoMode || !supabaseConfigured) {
    return {
      success: true,
      message: 'Settings are valid, but changes are preview-only in demo mode and will not persist.',
    }
  }

  // Real persistence path (requires school_settings table or JSONB column on schools).
  try {
    // Prefer a dedicated school_settings row when available.
    const { error } = await supabase
      .from('school_settings')
      .upsert(
        {
          school_id: profile.school_id,
          settings: config as unknown as Record<string, unknown>,
          updated_at: new Date().toISOString(),
          updated_by: user.id,
        },
        { onConflict: 'school_id' }
      )

    if (error) {
      if (error.message?.includes('relation') || error.code === '42P01') {
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
    })

    return { success: true, message: 'School settings saved successfully.' }
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Failed to save school settings.',
    }
  }
}
