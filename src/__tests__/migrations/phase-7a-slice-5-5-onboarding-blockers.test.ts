/**
 * Phase 7A Slice 5.5 — Onboarding Functional Blocker Correction
 * Migration Validation Tests
 *
 * Validates:
 *   - approve_pilot_inquiry() RPC structure and security
 *   - pilot_inquiries UPDATE policy hardening
 *   - Legal status transitions enforced database-side
 *   - Concurrency protections (SELECT FOR UPDATE)
 *   - Function security (SECURITY DEFINER, search_path, authorization)
 *   - Privilege restrictions
 */

import { describe, it, expect, beforeAll } from 'vitest'
import * as fs from 'fs'
import * as path from 'path'

const MIGRATION_PATH = path.join(
  __dirname,
  '../../../supabase/migrations/20260822000001_phase_7a_slice_5_5_onboarding_blockers.sql'
)

describe('Phase 7A Slice 5.5 — Onboarding Functional Blocker Correction', () => {
  let migrationContent: string

  beforeAll(() => {
    migrationContent = fs.readFileSync(MIGRATION_PATH, 'utf-8')
  })

  // ==========================================================================
  // 1. Migration File Structure
  // ==========================================================================
  describe('Migration File Structure', () => {
    it('should exist and be readable', () => {
      expect(fs.existsSync(MIGRATION_PATH)).toBe(true)
      expect(migrationContent.length).toBeGreaterThan(0)
    })

    it('should have proper migration header', () => {
      expect(migrationContent).toContain('Migration: 20260822000001_phase_7a_slice_5_5_onboarding_blockers')
      expect(migrationContent).toContain('Phase 7A Slice 5.5')
      expect(migrationContent).toContain('Onboarding Functional Blocker Correction')
    })

    it('should document the security model', () => {
      expect(migrationContent).toContain('Security model:')
      expect(migrationContent).toContain('SECURITY DEFINER')
      expect(migrationContent).toContain('search_path')
      expect(migrationContent).toContain('legal status transitions')
    })
  })

  // ==========================================================================
  // 2. approve_pilot_inquiry() RPC
  // ==========================================================================
  describe('approve_pilot_inquiry() RPC', () => {
    it('should create the function', () => {
      expect(migrationContent).toContain(
        'create or replace function public.approve_pilot_inquiry('
      )
    })

    it('should accept a single UUID parameter', () => {
      expect(migrationContent).toContain('p_pilot_inquiry_id uuid')
    })

    it('should return text (status)', () => {
      expect(migrationContent).toContain('returns text')
    })

    it('should set explicit search_path', () => {
      expect(migrationContent).toContain("set search_path = public, pg_temp")
    })

    it('should be SECURITY DEFINER', () => {
      expect(migrationContent).toContain('security definer')
    })

    it('should be plpgsql language', () => {
      expect(migrationContent).toContain('language plpgsql')
    })
  })

  // ==========================================================================
  // 3. Authorization
  // ==========================================================================
  describe('Authorization', () => {
    it('should check auth.uid()', () => {
      expect(migrationContent).toContain('v_caller_id := auth.uid()')
      expect(migrationContent).toContain("if v_caller_id is null then")
    })

    it('should reject unauthenticated callers', () => {
      expect(migrationContent).toContain(
        "raise exception 'Unauthorized: no authenticated user'"
      )
      expect(migrationContent).toContain("using errcode = '28000'")
    })

    it('should fetch caller role and school_id from profiles', () => {
      expect(migrationContent).toContain('select role, school_id into v_caller_role, v_caller_school_id')
      expect(migrationContent).toContain('from public.profiles')
    })

    it('should reject callers without a profile', () => {
      expect(migrationContent).toContain(
        "raise exception 'Unauthorized: caller profile not found'"
      )
    })

    it('should enforce platform-admin only (role=admin, school_id IS NULL)', () => {
      expect(migrationContent).toContain(
        "if v_caller_role <> 'admin' or v_caller_school_id is not null then"
      )
      expect(migrationContent).toContain(
        "raise exception 'Unauthorized: only platform administrators may approve pilot inquiries'"
      )
    })
  })

  // ==========================================================================
  // 4. Legal Status Transitions
  // ==========================================================================
  describe('Legal Status Transitions', () => {
    it('should enforce idempotency for already-approved inquiries', () => {
      expect(migrationContent).toContain("if v_inquiry.status = 'approved' then")
      expect(migrationContent).toContain('return v_inquiry.status')
    })

    it('should allow new and contacted to be approved', () => {
      expect(migrationContent).toContain(
        "if v_inquiry.status not in ('new', 'contacted') then"
      )
    })

    it('should reject illegal transitions (declined, spam)', () => {
      expect(migrationContent).toContain(
        "raise exception 'Illegal status transition: cannot approve inquiry with status ''%''. Only ''new'' or ''contacted'' inquiries may be approved.', v_inquiry.status"
      )
      expect(migrationContent).toContain("using errcode = '22023'")
    })

    it('should update status to approved', () => {
      expect(migrationContent).toContain("update public.pilot_inquiries")
      expect(migrationContent).toContain("set status = 'approved'")
    })

    it('should return approved', () => {
      expect(migrationContent).toContain("return 'approved'")
    })
  })

  // ==========================================================================
  // 5. Concurrency Protection
  // ==========================================================================
  describe('Concurrency Protection', () => {
    it('should use SELECT ... FOR UPDATE', () => {
      expect(migrationContent).toContain('for update')
    })

    it('should acquire the lock before checking status', () => {
      const forUpdateIndex = migrationContent.indexOf('for update')
      const statusCheckIndex = migrationContent.indexOf("if v_inquiry.status = 'approved' then")
      expect(forUpdateIndex).toBeGreaterThan(0)
      expect(statusCheckIndex).toBeGreaterThan(forUpdateIndex)
    })
  })

  // ==========================================================================
  // 6. Function Privileges
  // ==========================================================================
  describe('Function Privileges', () => {
    it('should revoke from public', () => {
      expect(migrationContent).toContain(
        'revoke execute on function public.approve_pilot_inquiry(uuid) from public'
      )
    })

    it('should revoke from anon', () => {
      expect(migrationContent).toContain(
        'revoke execute on function public.approve_pilot_inquiry(uuid) from anon'
      )
    })

    it('should grant to authenticated', () => {
      expect(migrationContent).toContain(
        'grant execute on function public.approve_pilot_inquiry(uuid) to authenticated'
      )
    })

    it('should grant to service_role', () => {
      expect(migrationContent).toContain(
        'grant execute on function public.approve_pilot_inquiry(uuid) to service_role'
      )
    })
  })

  // ==========================================================================
  // 7. UPDATE Policy Hardening
  // ==========================================================================
  describe('UPDATE Policy Hardening', () => {
    it('should drop the old broad UPDATE policy', () => {
      expect(migrationContent).toContain(
        'drop policy if exists "Admins can update pilot inquiries" on public.pilot_inquiries'
      )
    })

    it('should create a platform-admin-only UPDATE policy', () => {
      expect(migrationContent).toContain(
        'create policy "Platform admins can update pilot inquiries"'
      )
      expect(migrationContent).toContain("profiles.role = 'admin'")
      expect(migrationContent).toContain('profiles.school_id is null')
    })

    it('should not allow school_admins to update', () => {
      const policySection = migrationContent.substring(
        migrationContent.indexOf('create policy "Platform admins can update pilot inquiries"')
      )
      expect(policySection).not.toContain("profiles.role = 'school_admin'")
    })
  })

  // ==========================================================================
  // 8. Documentation
  // ==========================================================================
  describe('Documentation', () => {
    it('should have function comment', () => {
      expect(migrationContent).toContain('comment on function public.approve_pilot_inquiry')
    })

    it('should have table comment', () => {
      expect(migrationContent).toContain('comment on table public.pilot_inquiries')
    })
  })
})
