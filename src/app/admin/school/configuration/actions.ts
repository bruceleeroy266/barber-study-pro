'use server'

import { createClient } from '@/lib/supabase-server'
import { isAdmin, isSchoolAdmin, isPlatformAdminProfile } from '@/lib/auth-helpers'
import { SchoolConfiguration } from '@/types'
import { validateSchoolConfiguration, hasValidationErrors } from '@/lib/school-config/validation'
import { logPermissionDenied, logSensitiveConfigChange } from '@/lib/security/audit-logger'

export interface SaveConfigurationResult {
  success: boolean
  message: string
  savedConfig?: SchoolConfiguration
}

function isValidUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
}

export async function saveSchoolConfiguration(
  config: SchoolConfiguration,
  targetSchoolId?: string
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

  if (!profile || !(isAdmin(profile.role) || isSchoolAdmin(profile.role))) {
    await logPermissionDenied('manage_settings', {
      userId: user.id,
      email: user.email,
      role: profile?.role ?? null,
      schoolId: profile?.school_id ?? null,
      resource: '/admin/school/configuration',
      action: 'save',
    })
    return { success: false, message: 'Only administrators can save school settings.' }
  }

  // Resolve the school being administered.
  // - Platform admin (role='admin', school_id IS NULL): may administer any
  //   school, identified by targetSchoolId and validated server-side against
  //   active, non-deleted schools.
  // - School-attached admin / school_admin: strictly their own school.
  //   A client-provided targetSchoolId is NEVER trusted for these callers.
  let effectiveSchoolId: string

  if (isPlatformAdminProfile(profile)) {
    if (!targetSchoolId || !isValidUuid(targetSchoolId)) {
      return { success: false, message: 'A target school must be selected before saving.' }
    }

    const { data: targetSchool } = await supabase
      .from('schools')
      .select('id, is_active, deleted_at')
      .eq('id', targetSchoolId)
      .single()

    if (!targetSchool || !targetSchool.is_active || targetSchool.deleted_at) {
      await logPermissionDenied('manage_settings', {
        userId: user.id,
        email: user.email,
        role: profile.role,
        schoolId: null,
        resource: '/admin/school/configuration',
        resourceId: targetSchoolId,
        action: 'save',
      })
      return { success: false, message: 'The selected school is not active or does not exist.' }
    }

    effectiveSchoolId = targetSchool.id
  } else {
    // Multi-school isolation: an admin must be assigned to a school and may only
    // mutate settings for that school. Never accept a school id from the client.
    if (!profile.school_id) {
      return {
        success: false,
        message: 'You must be assigned to a school before you can save school settings.',
      }
    }
    effectiveSchoolId = profile.school_id
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
      .eq('school_id', effectiveSchoolId)
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

    // Update the schools table with the latest school info
    const { error: schoolError } = await supabase
      .from('schools')
      .update({
        name: configWithTimestamp.school.name,
        address: configWithTimestamp.school.address,
        city: configWithTimestamp.school.city,
        state: configWithTimestamp.school.state,
        postal_code: configWithTimestamp.school.postal_code,
        contact_email: configWithTimestamp.school.contact_email,
        contact_phone: configWithTimestamp.school.contact_phone,
        website: configWithTimestamp.school.website,
        timezone: configWithTimestamp.school.timezone,
        license_number: configWithTimestamp.school.license_number,
        accreditation: configWithTimestamp.school.accreditation,
        school_type: configWithTimestamp.school.school_type,
        updated_at: configWithTimestamp.updatedAt,
      })
      .eq('id', effectiveSchoolId)

    if (schoolError) {
      console.error('[SchoolConfiguration] Failed to update schools table:', schoolError.message)
      // Continue with settings save even if schools update fails
    }

    // Save the complete configuration to school_settings
    // Note: branding is stored as JSONB, not as standalone columns
    const { error } = await supabase
      .from('school_settings')
      .upsert(
        {
          school_id: effectiveSchoolId,
          settings: configWithTimestamp as unknown as Record<string, unknown>,
          name: configWithTimestamp.school.name,
          branding: {
            primaryColor: configWithTimestamp.branding.primaryColor,
            secondaryColor: configWithTimestamp.branding.secondaryColor,
            logoUrl: configWithTimestamp.branding.logoUrl,
            faviconUrl: configWithTimestamp.branding.faviconUrl,
          },
          contact_email: configWithTimestamp.school.contact_email,
          contact_phone: configWithTimestamp.school.contact_phone,
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
      schoolId: effectiveSchoolId,
      resourceId: effectiveSchoolId,
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
