import fs from 'fs'
import path from 'path'
import { describe, expect, it } from 'vitest'

const root = process.cwd()
const migrationPath = path.join(
  root,
  'supabase/migrations/20261005203500_um_h3_identity_invitation_reconciliation.sql'
)
const sql = fs.readFileSync(migrationPath, 'utf8')

describe('UM-H3.3 invitation identity reconciliation migration', () => {
  it('is service-role only and security definer hardened', () => {
    expect(sql).toContain('security definer')
    expect(sql).toContain('set search_path = public, pg_temp')
    expect(sql).toContain('revoke all on function public.reconcile_user_identity_profile_and_invitation')
    expect(sql).toContain('from public, anon, authenticated')
    expect(sql).toContain('grant execute on function public.reconcile_user_identity_profile_and_invitation')
    expect(sql).toContain('to service_role')
  })

  it('locks the profile and verifies the expected old email before changing identity', () => {
    expect(sql).toContain('from public.profiles')
    expect(sql).toContain('for update')
    expect(sql).toContain("raise exception 'Profile email changed during identity update'")
  })

  it('reconciles the matching school + email + role invitation only', () => {
    expect(sql).toContain('from public.school_onboarding_invitations')
    expect(sql).toContain('school_id = v_profile.school_id')
    expect(sql).toContain('lower(trim(email)) = v_old_email')
    expect(sql).toContain('role = v_profile.role')
  })

  it('fails on a conflicting lifecycle row instead of merging invitation history', () => {
    expect(sql).toContain("raise exception 'An onboarding invitation already exists for the corrected email'")
  })

  it('preserves lifecycle state while recording historical email provenance', () => {
    expect(sql).toContain("'identity_email_history'")
    expect(sql).toContain("'from', v_old_email")
    expect(sql).toContain("'to', v_new_email")
    expect(sql).not.toMatch(/set[\s\S]{0,250}status\s*=/i)
    expect(sql).not.toMatch(/set[\s\S]{0,250}accepted_at\s*=/i)
    expect(sql).not.toMatch(/set[\s\S]{0,250}revoked_at\s*=/i)
  })

  it('updates profile and invitation in the same database function', () => {
    expect(sql).toContain('update public.school_onboarding_invitations')
    expect(sql).toContain('update public.profiles')
    expect(sql).toContain("'invitation_reconciled'")
    expect(sql).toContain("'invitation_status'")
  })
})
