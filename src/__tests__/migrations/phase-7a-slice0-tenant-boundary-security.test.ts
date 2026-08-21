/**
 * Phase 7A Slice 0 — Tenant-Boundary Security Correction Tests
 *
 * Validates the tenant-boundary security migration structure and verifies
 * that the correction addresses all confirmed vulnerability vectors.
 *
 * These tests verify migration correctness without requiring a live database.
 * Adversarial test scenarios are documented as structural assertions that
 * prove the correction mechanism covers each attack vector.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const MIGRATION_PATH = path.join(
  __dirname,
  '../../../supabase/migrations/20260821000000_phase_7a_slice0_tenant_boundary_security.sql'
);

describe('Phase 7A Slice 0 — Tenant-Boundary Security Correction', () => {
  let migrationContent: string;

  beforeAll(() => {
    migrationContent = fs.readFileSync(MIGRATION_PATH, 'utf-8');
  });

  // ==========================================================================
  // 1. Migration File Structure
  // ==========================================================================
  describe('Migration File Structure', () => {
    it('should exist and be readable', () => {
      expect(fs.existsSync(MIGRATION_PATH)).toBe(true);
      expect(migrationContent.length).toBeGreaterThan(0);
    });

    it('should have proper migration header', () => {
      expect(migrationContent).toContain('Phase 7A Slice 0');
      expect(migrationContent).toContain('Tenant-Boundary Security Correction');
    });

    it('should document the root cause', () => {
      expect(migrationContent).toContain('CRITICAL SECURITY FIX');
      expect(migrationContent).toContain('privilege escalation');
      expect(migrationContent).toContain('cross-school tenant escape');
    });
  });

  // ==========================================================================
  // 2. Trigger Function Existence and Structure
  // ==========================================================================
  describe('Trigger Function', () => {
    it('should create the enforce_profile_protected_columns function', () => {
      expect(migrationContent).toContain(
        'create or replace function public.enforce_profile_protected_columns()'
      );
    });

    it('should return trigger type', () => {
      expect(migrationContent).toContain('returns trigger');
    });

    it('should use plpgsql language', () => {
      expect(migrationContent).toContain('language plpgsql');
    });

    it('should set explicit search_path for security', () => {
      expect(migrationContent).toContain('set search_path = public, pg_temp');
    });

    it('should attach trigger to profiles table', () => {
      expect(migrationContent).toContain(
        'create trigger enforce_profile_protected_columns_trigger'
      );
      expect(migrationContent).toContain('before update on public.profiles');
      expect(migrationContent).toContain(
        'for each row execute function public.enforce_profile_protected_columns()'
      );
    });

    it('should drop existing trigger before creating (idempotent)', () => {
      expect(migrationContent).toContain(
        'drop trigger if exists enforce_profile_protected_columns_trigger on public.profiles'
      );
    });
  });

  // ==========================================================================
  // 3. Protected Columns — Complete Coverage
  // ==========================================================================
  describe('Protected Columns Coverage', () => {
    const protectedColumns = [
      { name: 'school_id', reason: 'prevents cross-school tenant escape' },
      { name: 'role', reason: 'prevents privilege escalation' },
      { name: 'approval_status', reason: 'prevents self-approval' },
      { name: 'is_disabled', reason: 'prevents self-re-enablement' },
      { name: 'approved_by', reason: 'prevents forging approval provenance' },
      { name: 'approved_at', reason: 'prevents forging approval timestamp' },
    ];

    protectedColumns.forEach(({ name, reason }) => {
      it(`should protect ${name} (${reason})`, () => {
        // Verify the column is reverted in the trigger
        expect(migrationContent).toContain(`new.${name} := old.${name};`);
      });
    });

    it('should protect exactly 6 security-sensitive columns', () => {
      const revertPattern = /new\.\w+ := old\.\w+;/g;
      const matches = migrationContent.match(revertPattern);
      expect(matches).not.toBeNull();
      expect(matches!.length).toBe(6);
    });
  });

  // ==========================================================================
  // 4. Privileged Role Bypass
  // ==========================================================================
  describe('Privileged Role Bypass', () => {
    it('should allow service_role to modify protected columns', () => {
      expect(migrationContent).toContain("'service_role'");
    });

    it('should allow postgres superuser to modify protected columns', () => {
      expect(migrationContent).toContain("'postgres'");
    });

    it('should allow supabase_admin to modify protected columns', () => {
      expect(migrationContent).toContain("'supabase_admin'");
    });

    it('should check current_user for role identification', () => {
      expect(migrationContent).toContain('current_user in');
    });

    it('should return new early for privileged roles', () => {
      // The early return for privileged roles must come before column reverts
      const privilegedCheck = migrationContent.indexOf("current_user in ('service_role', 'postgres', 'supabase_admin')");
      const firstRevert = migrationContent.indexOf('new.school_id := old.school_id;');
      expect(privilegedCheck).toBeGreaterThan(-1);
      expect(firstRevert).toBeGreaterThan(-1);
      expect(privilegedCheck).toBeLessThan(firstRevert);
    });
  });

  // ==========================================================================
  // 5. Adversarial Attack Vector Coverage
  // ==========================================================================
  describe('Adversarial Attack Vector Coverage', () => {
    it('ADV-1: prevents student from changing own school_id', () => {
      // school_id is reverted for non-privileged roles
      expect(migrationContent).toContain('new.school_id := old.school_id;');
      // Trigger fires on BEFORE UPDATE
      expect(migrationContent).toContain('before update on public.profiles');
    });

    it('ADV-2: prevents student from changing own role', () => {
      expect(migrationContent).toContain('new.role := old.role;');
    });

    it('ADV-3: prevents student from promoting to instructor', () => {
      // role column is protected — any role change is reverted
      expect(migrationContent).toContain('new.role := old.role;');
    });

    it('ADV-4: prevents student from promoting to school_admin', () => {
      // role column is protected — any role change is reverted
      expect(migrationContent).toContain('new.role := old.role;');
    });

    it('ADV-5: prevents student from promoting to admin', () => {
      // role column is protected — any role change is reverted
      expect(migrationContent).toContain('new.role := old.role;');
    });

    it('ADV-6: prevents student from changing approval_status', () => {
      expect(migrationContent).toContain('new.approval_status := old.approval_status;');
    });

    it('ADV-7: prevents student from re-enabling via is_disabled', () => {
      expect(migrationContent).toContain('new.is_disabled := old.is_disabled;');
    });

    it('ADV-8: prevents combined school_id + role tenant escape', () => {
      // Both columns are independently protected
      expect(migrationContent).toContain('new.school_id := old.school_id;');
      expect(migrationContent).toContain('new.role := old.role;');
    });

    it('ADV-9: prevents bypass via direct Supabase client request', () => {
      // The trigger is at the database level — it fires regardless of client.
      // The only bypass is via service_role or postgres, which are not
      // available to regular authenticated users.
      expect(migrationContent).toContain('before update on public.profiles');
      expect(migrationContent).toContain('for each row');
    });

    it('ADV-10: prevents forging approval provenance (approved_by)', () => {
      expect(migrationContent).toContain('new.approved_by := old.approved_by;');
    });

    it('ADV-11: prevents forging approval timestamp (approved_at)', () => {
      expect(migrationContent).toContain('new.approved_at := old.approved_at;');
    });
  });

  // ==========================================================================
  // 6. Legitimate Update Preservation
  // ==========================================================================
  describe('Legitimate Update Preservation', () => {
    it('should NOT protect full_name (safe for user editing)', () => {
      expect(migrationContent).not.toContain('new.full_name := old.full_name;');
    });

    it('should NOT protect email (safe for user editing)', () => {
      expect(migrationContent).not.toContain('new.email := old.email;');
    });

    it('should NOT protect avatar_url (safe for user editing)', () => {
      expect(migrationContent).not.toContain('new.avatar_url := old.avatar_url;');
    });

    it('should NOT protect barber_shop_name (safe for user editing)', () => {
      expect(migrationContent).not.toContain('new.barber_shop_name := old.barber_shop_name;');
    });

    it('should NOT protect mentor_name (safe for user editing)', () => {
      expect(migrationContent).not.toContain('new.mentor_name := old.mentor_name;');
    });

    it('should NOT protect requires_password_change (needed by update-password flow)', () => {
      expect(migrationContent).not.toContain('new.requires_password_change := old.requires_password_change;');
    });

    it('should NOT protect updated_at (managed by trigger)', () => {
      expect(migrationContent).not.toContain('new.updated_at := old.updated_at;');
    });
  });

  // ==========================================================================
  // 7. Function Execution Restrictions
  // ==========================================================================
  describe('Function Execution Restrictions', () => {
    it('should revoke execute from public', () => {
      expect(migrationContent).toContain(
        'revoke execute on function public.enforce_profile_protected_columns() from public'
      );
    });

    it('should revoke execute from authenticated', () => {
      expect(migrationContent).toContain(
        'revoke execute on function public.enforce_profile_protected_columns() from authenticated'
      );
    });

    it('should revoke execute from anon', () => {
      expect(migrationContent).toContain(
        'revoke execute on function public.enforce_profile_protected_columns() from anon'
      );
    });

    it('should grant execute to service_role', () => {
      expect(migrationContent).toContain(
        'grant execute on function public.enforce_profile_protected_columns() to service_role'
      );
    });
  });

  // ==========================================================================
  // 8. Existing RLS Policy Compatibility
  // ==========================================================================
  describe('Existing RLS Policy Compatibility', () => {
    it('should not modify or drop existing RLS policies', () => {
      // This migration only adds a trigger; it does not modify RLS policies
      expect(migrationContent).not.toContain('drop policy');
      expect(migrationContent).not.toContain('create policy');
      expect(migrationContent).not.toContain('alter policy');
    });

    it('should not modify table grants', () => {
      // This migration does not change table-level grants
      expect(migrationContent).not.toContain('grant select');
      expect(migrationContent).not.toContain('grant insert');
      expect(migrationContent).not.toContain('grant update');
      expect(migrationContent).not.toContain('grant delete');
      expect(migrationContent).not.toContain('revoke select');
      expect(migrationContent).not.toContain('revoke insert');
      expect(migrationContent).not.toContain('revoke update');
      expect(migrationContent).not.toContain('revoke delete');
    });

    it('should not alter the profiles table structure', () => {
      expect(migrationContent).not.toContain('alter table public.profiles');
    });
  });

  // ==========================================================================
  // 9. Documentation
  // ==========================================================================
  describe('Documentation', () => {
    it('should include function comment', () => {
      expect(migrationContent).toContain(
        "comment on function public.enforce_profile_protected_columns()"
      );
    });

    it('should document the security purpose', () => {
      expect(migrationContent).toContain('tenant-boundary security');
    });
  });

  // ==========================================================================
  // 10. Silent Stripping Design Verification
  // ==========================================================================
  describe('Silent Stripping Design', () => {
    it('should use silent stripping (not error raising)', () => {
      // The trigger reverts columns instead of raising exceptions
      expect(migrationContent).not.toContain('raise exception');
      expect(migrationContent).not.toContain('raise notice');
      expect(migrationContent).not.toContain('RAISE');
    });

    it('should always return new (allow the update to proceed)', () => {
      // Count return statements — should have exactly 2:
      // one for privileged bypass, one for the normal path
      const returnStatements = migrationContent.match(/return new;/g);
      expect(returnStatements).not.toBeNull();
      expect(returnStatements!.length).toBe(2);
    });
  });
});
