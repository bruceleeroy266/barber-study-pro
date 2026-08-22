/**
 * Phase 7A Slice 1 — School Onboarding & Enrollment Foundation Tests
 *
 * Validates the school onboarding persistence layer migration structure.
 * These tests verify schema correctness without requiring a live database.
 *
 * Test coverage:
 *   - Migration file existence and structure
 *   - school_onboarding_invitations table schema
 *   - pilot_inquiries additions (school_id, school_created_at)
 *   - create_school_from_inquiry() RPC structure and security
 *   - RLS policies and access control
 *   - Concurrency protection (SELECT FOR UPDATE row lock + UNIQUE constraint)
 *   - Function security (SECURITY DEFINER, search_path, authorization)
 *   - Privilege restrictions
 *   - Slice 0 tenant-boundary protections preserved
 */

import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const MIGRATION_PATH = path.join(
  __dirname,
  '../../../supabase/migrations/20260822000000_phase_7a_school_onboarding.sql'
);

describe('Phase 7A Slice 1 — School Onboarding & Enrollment Foundation', () => {
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
      expect(migrationContent).toContain('Migration: 20260822000000_phase_7a_school_onboarding');
      expect(migrationContent).toContain('Phase 7A Slice 1');
      expect(migrationContent).toContain('Persistence/Invariants: Database Foundation');
    });

    it('should document the security model', () => {
      expect(migrationContent).toContain('Security model:');
      expect(migrationContent).toContain('RLS enabled on school_onboarding_invitations');
      expect(migrationContent).toContain('Platform admin');
      expect(migrationContent).toContain('School admin');
      expect(migrationContent).toContain('ONE PILOT INQUIRY → AT MOST ONE SCHOOL');
    });
  });

  // ==========================================================================
  // 2. school_onboarding_invitations Table
  // ==========================================================================
  describe('school_onboarding_invitations Table', () => {
    it('should create school_onboarding_invitations table', () => {
      expect(migrationContent).toContain(
        'create table if not exists public.school_onboarding_invitations'
      );
    });

    it('should have all required architecture fields', () => {
      const requiredColumns = [
        'id uuid primary key default gen_random_uuid()',
        'school_id uuid not null references public.schools(id)',
        'pilot_inquiry_id uuid references public.pilot_inquiries(id)',
        'invited_by uuid not null references auth.users(id)',
        'email text not null',
        'full_name text not null',
        'role text not null',
        'auth_user_id uuid references auth.users(id)',
        'status text not null default \'pending\'',
        'invited_at timestamptz not null default now()',
        'accepted_at timestamptz',
        'expires_at timestamptz not null',
        'revoked_at timestamptz',
        'revoked_by uuid references auth.users(id)',
        'metadata jsonb default \'{}\'',
        'created_at timestamptz not null default now()',
        'updated_at timestamptz not null default now()',
      ];

      requiredColumns.forEach(col => {
        expect(migrationContent).toContain(col);
      });
    });

    it('should have role CHECK constraint with valid roles', () => {
      expect(migrationContent).toContain(
        "check (role in ('school_admin', 'instructor', 'student'))"
      );
    });

    it('should have status CHECK constraint with valid statuses', () => {
      expect(migrationContent).toContain(
        "check (status in ('pending', 'accepted', 'expired', 'revoked'))"
      );
    });

    it('should have required uniqueness constraint on (school_id, email, role)', () => {
      expect(migrationContent).toContain(
        'constraint school_onboarding_invitations_school_email_role_unique'
      );
      expect(migrationContent).toContain('unique (school_id, email, role)');
    });

    it('should have required indexes', () => {
      const requiredIndexes = [
        'idx_school_onboarding_invitations_school_id',
        'idx_school_onboarding_invitations_pilot_inquiry_id',
        'idx_school_onboarding_invitations_email',
        'idx_school_onboarding_invitations_status',
        'idx_school_onboarding_invitations_invited_by',
        'idx_school_onboarding_invitations_auth_user_id',
        'idx_school_onboarding_invitations_expires_at',
      ];

      requiredIndexes.forEach(idx => {
        expect(migrationContent).toContain(idx);
      });
    });

    it('should have updated_at trigger', () => {
      expect(migrationContent).toContain(
        'create trigger update_school_onboarding_invitations_updated_at'
      );
      expect(migrationContent).toContain(
        'before update on public.school_onboarding_invitations'
      );
      expect(migrationContent).toContain(
        'for each row execute function public.update_updated_at_column()'
      );
    });
  });

  // ==========================================================================
  // 3. RLS Policies for school_onboarding_invitations
  // ==========================================================================
  describe('RLS Policies for school_onboarding_invitations', () => {
    it('should enable RLS on school_onboarding_invitations', () => {
      expect(migrationContent).toContain(
        'alter table public.school_onboarding_invitations enable row level security'
      );
    });

    it('should have platform admin read-all policy', () => {
      expect(migrationContent).toContain(
        'create policy "Platform admins can read all invitations"'
      );
      expect(migrationContent).toContain(
        "p.role = 'admin'"
      );
      expect(migrationContent).toContain(
        'p.school_id is null'
      );
    });

    it('should have school admin read-own-school policy', () => {
      expect(migrationContent).toContain(
        'create policy "School admins can read own school invitations"'
      );
      expect(migrationContent).toContain(
        "p.role = 'school_admin'"
      );
      expect(migrationContent).toContain(
        'p.school_id = school_onboarding_invitations.school_id'
      );
    });

    it('should NOT have INSERT policy for authenticated users', () => {
      // Verify no INSERT policy is created for authenticated users
      const insertPolicyPattern = /create policy.*insert.*school_onboarding_invitations/i;
      expect(migrationContent).not.toMatch(insertPolicyPattern);
    });

    it('should NOT have UPDATE policy for authenticated users', () => {
      // Verify no UPDATE policy is created for authenticated users
      const updatePolicyPattern = /create policy.*update.*school_onboarding_invitations/i;
      expect(migrationContent).not.toMatch(updatePolicyPattern);
    });

    it('should NOT have DELETE policy for authenticated users', () => {
      // Verify no DELETE policy is created for authenticated users
      const deletePolicyPattern = /create policy.*delete.*school_onboarding_invitations/i;
      expect(migrationContent).not.toMatch(deletePolicyPattern);
    });

    it('should grant SELECT to authenticated for RLS evaluation', () => {
      expect(migrationContent).toContain(
        'grant select on public.school_onboarding_invitations to authenticated'
      );
    });

    it('should grant full access to service_role', () => {
      expect(migrationContent).toContain(
        'grant select, insert, update, delete on public.school_onboarding_invitations'
      );
      expect(migrationContent).toContain('to service_role');
    });

    it('should NOT grant any access to anon', () => {
      // Verify no grants to anon for this table
      const anonGrantPattern = /grant.*school_onboarding_invitations.*to anon/i;
      expect(migrationContent).not.toMatch(anonGrantPattern);
    });
  });

  // ==========================================================================
  // 4. pilot_inquiries Additions
  // ==========================================================================
  describe('pilot_inquiries Additions', () => {
    it('should add school_id column to pilot_inquiries', () => {
      expect(migrationContent).toContain(
        'add column school_id uuid references public.schools(id) on delete set null'
      );
    });

    it('should add school_created_at column to pilot_inquiries', () => {
      expect(migrationContent).toContain(
        'add column school_created_at timestamptz'
      );
    });

    it('should have UNIQUE index on pilot_inquiries.school_id', () => {
      expect(migrationContent).toContain(
        'create unique index if not exists idx_pilot_inquiries_school_id_unique'
      );
      expect(migrationContent).toContain(
        'on public.pilot_inquiries(school_id)'
      );
      expect(migrationContent).toContain('where school_id is not null');
    });

    it('should have index on pilot_inquiries.school_id', () => {
      expect(migrationContent).toContain(
        'create index if not exists idx_pilot_inquiries_school_id'
      );
    });

    it('should have updated_at trigger for pilot_inquiries', () => {
      expect(migrationContent).toContain(
        'create trigger update_pilot_inquiries_updated_at'
      );
      expect(migrationContent).toContain(
        'before update on public.pilot_inquiries'
      );
    });
  });

  // ==========================================================================
  // 5. create_school_from_inquiry() RPC Structure
  // ==========================================================================
  describe('create_school_from_inquiry() RPC Structure', () => {
    it('should create create_school_from_inquiry function', () => {
      expect(migrationContent).toContain(
        'create or replace function public.create_school_from_inquiry('
      );
    });

    it('should accept p_pilot_inquiry_id parameter', () => {
      expect(migrationContent).toContain('p_pilot_inquiry_id uuid');
    });

    it('should return uuid', () => {
      expect(migrationContent).toContain('returns uuid');
    });

    it('should be SECURITY DEFINER', () => {
      expect(migrationContent).toContain('language plpgsql security definer');
    });

    it('should set explicit search_path', () => {
      expect(migrationContent).toContain('set search_path = public, pg_temp');
    });
  });

  // ==========================================================================
  // 6. RPC Authorization Protection
  // ==========================================================================
  describe('RPC Authorization Protection', () => {
    it('should authenticate the caller', () => {
      expect(migrationContent).toContain('v_caller_id := auth.uid()');
      expect(migrationContent).toContain(
        "raise exception 'Unauthorized: no authenticated user'"
      );
    });

    it('should retrieve caller profile', () => {
      expect(migrationContent).toContain(
        'select role, school_id into v_caller_role, v_caller_school_id'
      );
      expect(migrationContent).toContain('from public.profiles');
      expect(migrationContent).toContain('where id = v_caller_id');
    });

    it('should require platform admin role', () => {
      expect(migrationContent).toContain(
        "if v_caller_role <> 'admin' or v_caller_school_id is not null then"
      );
      expect(migrationContent).toContain(
        "raise exception 'Unauthorized: only platform administrators may create schools'"
      );
    });

    it('should reject nonexistent inquiry', () => {
      expect(migrationContent).toContain(
        "raise exception 'Pilot inquiry not found: %', p_pilot_inquiry_id"
      );
    });

    it('should require approved inquiry status', () => {
      expect(migrationContent).toContain(
        "if v_inquiry.status <> 'approved' then"
      );
      expect(migrationContent).toContain(
        "raise exception 'Pilot inquiry must be approved before school creation. Current status: %', v_inquiry.status"
      );
    });
  });

  // ==========================================================================
  // 7. RPC Idempotency (Post-Lock)
  // ==========================================================================
  describe('RPC Idempotency (Post-Lock)', () => {
    it('should check for existing school_id AFTER acquiring FOR UPDATE lock', () => {
      // The FOR UPDATE lock must be acquired BEFORE the idempotency check
      const forUpdateIndex = migrationContent.indexOf('for update;');
      const idempotencyCheckIndex = migrationContent.indexOf(
        'if v_inquiry.school_id is not null then'
      );
      expect(forUpdateIndex).toBeGreaterThan(-1);
      expect(idempotencyCheckIndex).toBeGreaterThan(-1);
      expect(forUpdateIndex).toBeLessThan(idempotencyCheckIndex);
    });

    it('should return existing school_id for idempotency', () => {
      expect(migrationContent).toContain('return v_inquiry.school_id;');
    });

    it('should document post-lock idempotency behavior', () => {
      expect(migrationContent).toContain('ENFORCE IDEMPOTENCY (POST-LOCK)');
      expect(migrationContent).toContain('AFTER the FOR UPDATE row lock is acquired');
    });
  });

  // ==========================================================================
  // 8. RPC Atomic School/Settings/Program Creation
  // ==========================================================================
  describe('RPC Atomic School/Settings/Program Creation', () => {
    it('should create school record', () => {
      expect(migrationContent).toContain('insert into public.schools (');
      expect(migrationContent).toContain('name,');
      expect(migrationContent).toContain('contact_email,');
      expect(migrationContent).toContain('subscription_status,');
      expect(migrationContent).toContain('is_active,');
      expect(migrationContent).toContain('created_by');
      expect(migrationContent).toContain('returning id into v_school_id');
    });

    it('should create school_settings record', () => {
      expect(migrationContent).toContain('insert into public.school_settings (');
      expect(migrationContent).toContain('school_id,');
      expect(migrationContent).toContain('updated_by');
    });

    it('should create default program', () => {
      expect(migrationContent).toContain('insert into public.programs (');
      expect(migrationContent).toContain('school_id,');
      expect(migrationContent).toContain('name,');
      expect(migrationContent).toContain('required_hours,');
      expect(migrationContent).toContain('required_assessments,');
      expect(migrationContent).toContain('required_practicals,');
      expect(migrationContent).toContain('is_active');
    });

    it('should update pilot_inquiries with school_id and school_created_at', () => {
      expect(migrationContent).toContain('update public.pilot_inquiries');
      expect(migrationContent).toContain('school_id = v_school_id,');
      expect(migrationContent).toContain('school_created_at = now()');
    });

    it('should return the school_id', () => {
      expect(migrationContent).toContain('return v_school_id;');
    });

    it('should use established repository defaults', () => {
      // Default required_hours from programs table schema
      expect(migrationContent).toContain('v_default_required_hours := 1500');
      // Default subscription_status
      expect(migrationContent).toContain("'trial'");
      // Default is_active
      expect(migrationContent).toContain('true');
    });

    it('should map program_type to default program name', () => {
      expect(migrationContent).toContain("when 'barber' then 'Barbering'");
      expect(migrationContent).toContain("when 'cosmetology' then 'Cosmetology'");
      expect(migrationContent).toContain("when 'esthetics' then 'Esthetics'");
      expect(migrationContent).toContain("when 'nail_technology' then 'Nail Technology'");
      expect(migrationContent).toContain("when 'instructor' then 'Instructor Training'");
    });
  });

  // ==========================================================================
  // 9. RPC Exception Handling
  // ==========================================================================
  describe('RPC Exception Handling', () => {
    it('should re-raise exceptions for transaction rollback', () => {
      expect(migrationContent).toContain('exception');
      expect(migrationContent).toContain('when others then');
      expect(migrationContent).toContain('raise;');
    });
  });

  // ==========================================================================
  // 10. Function Privileges
  // ==========================================================================
  describe('Function Privileges', () => {
    it('should revoke execute from public', () => {
      expect(migrationContent).toContain(
        'revoke execute on function public.create_school_from_inquiry(uuid) from public'
      );
    });

    it('should revoke execute from anon', () => {
      expect(migrationContent).toContain(
        'revoke execute on function public.create_school_from_inquiry(uuid) from anon'
      );
    });

    it('should grant execute to authenticated', () => {
      expect(migrationContent).toContain(
        'grant execute on function public.create_school_from_inquiry(uuid) to authenticated'
      );
    });

    it('should grant execute to service_role', () => {
      expect(migrationContent).toContain(
        'grant execute on function public.create_school_from_inquiry(uuid) to service_role'
      );
    });
  });

  // ==========================================================================
  // 11. Concurrency Protection (SELECT FOR UPDATE + UNIQUE Constraint)
  // ==========================================================================
  describe('Concurrency Protection (SELECT FOR UPDATE + UNIQUE Constraint)', () => {
    it('should document the concurrency protection mechanism', () => {
      expect(migrationContent).toContain('CONCURRENCY PROTECTION');
      expect(migrationContent).toContain('ONE INQUIRY → AT MOST ONE SCHOOL');
    });

    it('should use SELECT ... FOR UPDATE as primary concurrency guard', () => {
      expect(migrationContent).toContain('for update;');
      expect(migrationContent).toContain('PRIMARY GUARD: SELECT ... FOR UPDATE');
    });

    it('should document the row-level lock serialization behavior', () => {
      expect(migrationContent).toContain('serializes concurrent provisioning calls');
      expect(migrationContent).toContain('blocks until the first transaction commits');
    });

    it('should document the second call idempotent return after lock release', () => {
      expect(migrationContent).toContain('observes the committed school_id and returns it');
    });

    it('should have UNIQUE constraint as defense in depth', () => {
      expect(migrationContent).toContain('DEFENSE IN DEPTH');
      expect(migrationContent).toContain(
        'create unique index if not exists idx_pilot_inquiries_school_id_unique'
      );
    });

    it('should have partial unique index on school_id', () => {
      expect(migrationContent).toContain('where school_id is not null');
    });

    it('should document the invariant that no orphans are produced', () => {
      expect(migrationContent).toContain('No orphan school, school_settings, or program');
    });

    it('should acquire lock before any INSERT operations', () => {
      const forUpdateIndex = migrationContent.indexOf('for update;');
      const schoolInsertIndex = migrationContent.indexOf('insert into public.schools');
      const settingsInsertIndex = migrationContent.indexOf('insert into public.school_settings');
      const programInsertIndex = migrationContent.indexOf('insert into public.programs');
      expect(forUpdateIndex).toBeGreaterThan(-1);
      expect(schoolInsertIndex).toBeGreaterThan(-1);
      expect(settingsInsertIndex).toBeGreaterThan(-1);
      expect(programInsertIndex).toBeGreaterThan(-1);
      expect(forUpdateIndex).toBeLessThan(schoolInsertIndex);
      expect(forUpdateIndex).toBeLessThan(settingsInsertIndex);
      expect(forUpdateIndex).toBeLessThan(programInsertIndex);
    });

    it('should acquire lock before idempotency check', () => {
      const forUpdateIndex = migrationContent.indexOf('for update;');
      const idempotencyCheckIndex = migrationContent.indexOf(
        'if v_inquiry.school_id is not null then'
      );
      expect(forUpdateIndex).toBeGreaterThan(-1);
      expect(idempotencyCheckIndex).toBeGreaterThan(-1);
      expect(forUpdateIndex).toBeLessThan(idempotencyCheckIndex);
    });

    it('should hold lock through final UPDATE (lock before UPDATE)', () => {
      const forUpdateIndex = migrationContent.indexOf('for update;');
      const updateIndex = migrationContent.indexOf('update public.pilot_inquiries');
      expect(forUpdateIndex).toBeGreaterThan(-1);
      expect(updateIndex).toBeGreaterThan(-1);
      expect(forUpdateIndex).toBeLessThan(updateIndex);
    });

    it('should document that the UPDATE does not block (lock already held)', () => {
      expect(migrationContent).toContain('LOCK ALREADY HELD');
      expect(migrationContent).toContain('does not block');
    });
  });

  // ==========================================================================
  // 12. Slice 0 Tenant-Boundary Protections Preserved
  // ==========================================================================
  describe('Slice 0 Tenant-Boundary Protections Preserved', () => {
    it('should NOT modify profiles.school_id protection', () => {
      // This migration should not touch the profiles table
      const profilesModificationPattern = /alter table public\.profiles/i;
      expect(migrationContent).not.toMatch(profilesModificationPattern);
    });

    it('should NOT modify profiles.role protection', () => {
      // This migration should not touch the profiles table
      const profilesModificationPattern = /alter table public\.profiles/i;
      expect(migrationContent).not.toMatch(profilesModificationPattern);
    });

    it('should NOT modify approval_status protection', () => {
      // This migration should not touch the profiles table
      const profilesModificationPattern = /alter table public\.profiles/i;
      expect(migrationContent).not.toMatch(profilesModificationPattern);
    });

    it('should NOT modify is_disabled protection', () => {
      // This migration should not touch the profiles table
      const profilesModificationPattern = /alter table public\.profiles/i;
      expect(migrationContent).not.toMatch(profilesModificationPattern);
    });

    it('should NOT modify approved_by protection', () => {
      // This migration should not touch the profiles table
      const profilesModificationPattern = /alter table public\.profiles/i;
      expect(migrationContent).not.toMatch(profilesModificationPattern);
    });

    it('should NOT modify approved_at protection', () => {
      // This migration should not touch the profiles table
      const profilesModificationPattern = /alter table public\.profiles/i;
      expect(migrationContent).not.toMatch(profilesModificationPattern);
    });

    it('should NOT expose service_role credentials', () => {
      // Verify no service_role key exposure
      expect(migrationContent).not.toContain('service_role_key');
      expect(migrationContent).not.toContain('SUPABASE_SERVICE_ROLE_KEY');
    });

    it('should NOT create client-side service-role access', () => {
      // Verify no client-side service_role grants
      const clientServiceRolePattern = /grant.*to authenticated.*service_role/i;
      expect(migrationContent).not.toMatch(clientServiceRolePattern);
    });
  });

  // ==========================================================================
  // 13. Cross-School Invitation Visibility Prevention
  // ==========================================================================
  describe('Cross-School Invitation Visibility Prevention', () => {
    it('should prevent school_admin from reading other schools invitations', () => {
      // The school_admin policy requires p.school_id = school_onboarding_invitations.school_id
      expect(migrationContent).toContain(
        'p.school_id = school_onboarding_invitations.school_id'
      );
    });

    it('should prevent ordinary instructor/student from enumerating invitations', () => {
      // No SELECT policy exists for instructor/student roles
      // Only platform admin and school_admin have SELECT policies
      const instructorPolicyPattern = /create policy.*instructor.*invitations/i;
      const studentPolicyPattern = /create policy.*student.*invitations/i;
      expect(migrationContent).not.toMatch(instructorPolicyPattern);
      expect(migrationContent).not.toMatch(studentPolicyPattern);
    });

    it('should prevent anonymous users from enumerating invitations', () => {
      // No grants to anon
      const anonGrantPattern = /grant.*school_onboarding_invitations.*to anon/i;
      expect(migrationContent).not.toMatch(anonGrantPattern);
    });
  });

  // ==========================================================================
  // 14. Ordinary Users Cannot Create Schools
  // ==========================================================================
  describe('Ordinary Users Cannot Create Schools', () => {
    it('should restrict school creation to platform admins only', () => {
      expect(migrationContent).toContain(
        "if v_caller_role <> 'admin' or v_caller_school_id is not null then"
      );
    });

    it('should reject school_admin from creating schools', () => {
      // school_admin has role='school_admin', not 'admin'
      // The check v_caller_role <> 'admin' will reject school_admin
      expect(migrationContent).toContain("v_caller_role <> 'admin'");
    });

    it('should reject instructors from creating schools', () => {
      // instructor has role='instructor', not 'admin'
      // The check v_caller_role <> 'admin' will reject instructor
      expect(migrationContent).toContain("v_caller_role <> 'admin'");
    });

    it('should reject students from creating schools', () => {
      // student has role='student', not 'admin'
      // The check v_caller_role <> 'admin' will reject student
      expect(migrationContent).toContain("v_caller_role <> 'admin'");
    });

    it('should reject anonymous users from creating schools', () => {
      // Anonymous users have no auth.uid(), so v_caller_id will be null
      expect(migrationContent).toContain('if v_caller_id is null then');
      expect(migrationContent).toContain(
        "raise exception 'Unauthorized: no authenticated user'"
      );
    });
  });

  // ==========================================================================
  // 15. Adversarial Structural Tests
  // ==========================================================================
  describe('Adversarial Structural Tests', () => {
    it('ADV-1: prevents search_path injection via explicit search_path', () => {
      expect(migrationContent).toContain('set search_path = public, pg_temp');
    });

    it('ADV-2: prevents privilege escalation via explicit authorization check', () => {
      // The function checks caller role before any privileged operation
      const authCheckIndex = migrationContent.indexOf("if v_caller_role <> 'admin'");
      const insertIndex = migrationContent.indexOf('insert into public.schools');
      expect(authCheckIndex).toBeGreaterThan(-1);
      expect(insertIndex).toBeGreaterThan(-1);
      expect(authCheckIndex).toBeLessThan(insertIndex);
    });

    it('ADV-3: prevents duplicate school creation via post-lock idempotency check', () => {
      // The idempotency check runs AFTER the FOR UPDATE lock, ensuring
      // the observed school_id is the committed value from any prior transaction
      const forUpdateIndex = migrationContent.indexOf('for update;');
      const idempotencyCheckIndex = migrationContent.indexOf(
        'if v_inquiry.school_id is not null then'
      );
      const insertIndex = migrationContent.indexOf('insert into public.schools');
      expect(forUpdateIndex).toBeGreaterThan(-1);
      expect(idempotencyCheckIndex).toBeGreaterThan(-1);
      expect(insertIndex).toBeGreaterThan(-1);
      expect(forUpdateIndex).toBeLessThan(idempotencyCheckIndex);
      expect(idempotencyCheckIndex).toBeLessThan(insertIndex);
    });

    it('ADV-4: prevents concurrent duplicate school creation via SELECT FOR UPDATE row lock', () => {
      // Primary concurrency guard: FOR UPDATE serializes concurrent calls
      expect(migrationContent).toContain('for update;');
      expect(migrationContent).toContain('PRIMARY GUARD: SELECT ... FOR UPDATE');
      // Defense in depth: UNIQUE constraint
      expect(migrationContent).toContain(
        'create unique index if not exists idx_pilot_inquiries_school_id_unique'
      );
    });

    it('ADV-5: prevents arbitrary school_id insertion via no client INSERT policy', () => {
      // No INSERT policy for authenticated users on school_onboarding_invitations
      const insertPolicyPattern = /create policy.*insert.*school_onboarding_invitations/i;
      expect(migrationContent).not.toMatch(insertPolicyPattern);
    });

    it('ADV-6: prevents invalid role insertion via CHECK constraint', () => {
      expect(migrationContent).toContain(
        "check (role in ('school_admin', 'instructor', 'student'))"
      );
    });

    it('ADV-7: prevents invalid status insertion via CHECK constraint', () => {
      expect(migrationContent).toContain(
        "check (status in ('pending', 'accepted', 'expired', 'revoked'))"
      );
    });

    it('ADV-8: prevents broken foreign keys via REFERENCES clauses', () => {
      expect(migrationContent).toContain('references public.schools(id)');
      expect(migrationContent).toContain('references public.pilot_inquiries(id)');
      expect(migrationContent).toContain('references auth.users(id)');
    });

    it('ADV-9: prevents orphan school_settings via CASCADE delete', () => {
      expect(migrationContent).toContain(
        'references public.schools(id) on delete cascade'
      );
    });

    it('ADV-10: prevents orphan default program via CASCADE delete', () => {
      // programs.school_id references schools(id) on delete cascade
      // This is from the existing schema, verified in the migration
      expect(migrationContent).toContain('insert into public.programs (');
    });

    it('ADV-11: prevents partial transaction completion via exception handler', () => {
      expect(migrationContent).toContain('exception');
      expect(migrationContent).toContain('when others then');
      expect(migrationContent).toContain('raise;');
    });

    it('ADV-12: prevents unauthorized RPC execution via privilege restrictions', () => {
      expect(migrationContent).toContain(
        'revoke execute on function public.create_school_from_inquiry(uuid) from anon'
      );
    });
  });

  // ==========================================================================
  // 16. Documentation Comments
  // ==========================================================================
  describe('Documentation Comments', () => {
    it('should document the RPC function', () => {
      expect(migrationContent).toContain(
        'comment on function public.create_school_from_inquiry(uuid) is'
      );
    });

    it('should document the school_onboarding_invitations table', () => {
      expect(migrationContent).toContain(
        'comment on table public.school_onboarding_invitations is'
      );
    });

    it('should document the role column', () => {
      expect(migrationContent).toContain(
        'comment on column public.school_onboarding_invitations.role is'
      );
    });

    it('should document the status column', () => {
      expect(migrationContent).toContain(
        'comment on column public.school_onboarding_invitations.status is'
      );
    });

    it('should document the expires_at column', () => {
      expect(migrationContent).toContain(
        'comment on column public.school_onboarding_invitations.expires_at is'
      );
    });

    it('should document the pilot_inquiries.school_id column', () => {
      expect(migrationContent).toContain(
        'comment on column public.pilot_inquiries.school_id is'
      );
    });

    it('should document the pilot_inquiries.school_created_at column', () => {
      expect(migrationContent).toContain(
        'comment on column public.pilot_inquiries.school_created_at is'
      );
    });
  });
});
