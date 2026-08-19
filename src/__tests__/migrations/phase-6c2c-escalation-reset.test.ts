/**
 * Phase 6C-2c Migration Validation Tests
 *
 * Validates the escalation and sustained-performance reset persistence layer migration structure.
 * These tests verify schema correctness without requiring a live database.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const MIGRATION_PATH = path.join(
  __dirname,
  '../../../supabase/migrations/20260819000000_phase_6c2c_escalation_reset.sql'
);

describe('Phase 6C-2c Migration Validation', () => {
  let migrationContent: string;

  beforeAll(() => {
    migrationContent = fs.readFileSync(MIGRATION_PATH, 'utf-8');
  });

  describe('Migration File Structure', () => {
    it('should exist and be readable', () => {
      expect(fs.existsSync(MIGRATION_PATH)).toBe(true);
      expect(migrationContent.length).toBeGreaterThan(0);
    });

    it('should have proper migration header', () => {
      expect(migrationContent).toContain('Migration: 20260819000000_phase_6c2c_escalation_reset');
      expect(migrationContent).toContain('Phase 6C-2c — Instructor Escalation & Sustained-Performance Reset');
    });

    it('should include pgcrypto extension', () => {
      expect(migrationContent).toContain('create extension if not exists "pgcrypto"');
    });
  });

  describe('instructor_escalations Table', () => {
    it('should create instructor_escalations table', () => {
      expect(migrationContent).toContain('create table if not exists public.instructor_escalations');
    });

    it('should have required columns', () => {
      const requiredColumns = [
        'id uuid primary key default gen_random_uuid()',
        'user_id uuid not null references auth.users(id)',
        'concept_id text not null',
        'chapter_id text not null',
        'school_id uuid not null references public.schools(id)',
        'triggering_cycle_ids uuid[] not null',
        'unsuccessful_cycle_count integer not null',
        'detection_evidence jsonb not null',
        'status text not null default \'pending\'',
        'acknowledged_by uuid references auth.users(id)',
        'acknowledged_at timestamptz',
        'instructor_notes text',
        'intervention_plan text',
        'resolution_summary text',
        'follow_up_required boolean',
        'auto_cleared_at timestamptz',
        'auto_cleared_by_reset_id uuid',
        'expired_at timestamptz',
        'created_at timestamptz not null default now()',
        'updated_at timestamptz not null default now()'
      ];

      requiredColumns.forEach(col => {
        expect(migrationContent).toContain(col);
      });
    });

    it('should have status CHECK constraint with all valid states', () => {
      expect(migrationContent).toContain('constraint valid_status check (status in (');
      expect(migrationContent).toContain('\'pending\', \'acknowledged\', \'in_progress\', \'resolved\', \'auto_cleared\', \'expired\'');
    });

    it('should have unsuccessful_cycle_count CHECK constraint (>= 2)', () => {
      expect(migrationContent).toContain('constraint valid_unsuccessful_count check (unsuccessful_cycle_count >= 2)');
    });

    it('should have acknowledged_requires_ownership CHECK constraint', () => {
      expect(migrationContent).toContain('constraint acknowledged_requires_ownership check (');
      expect(migrationContent).toContain('acknowledged_by is not null and acknowledged_at is not null');
    });

    it('should have auto_cleared_requires_null_owner CHECK constraint', () => {
      expect(migrationContent).toContain('constraint auto_cleared_requires_null_owner check (');
      expect(migrationContent).toContain('acknowledged_by is null');
    });

    it('should have required indexes', () => {
      expect(migrationContent).toContain('idx_instructor_escalations_user_concept');
      expect(migrationContent).toContain('idx_instructor_escalations_school_status');
      expect(migrationContent).toContain('idx_instructor_escalations_acknowledged_by');
      expect(migrationContent).toContain('idx_instructor_escalations_created_at');
    });

    it('should have unique active escalation constraint', () => {
      expect(migrationContent).toContain('idx_instructor_escalations_active_unique');
      expect(migrationContent).toContain('where status in (\'pending\', \'acknowledged\', \'in_progress\')');
    });
  });

  describe('instructor_escalation_events Table', () => {
    it('should create instructor_escalation_events table', () => {
      expect(migrationContent).toContain('create table if not exists public.instructor_escalation_events');
    });

    it('should have required columns', () => {
      const requiredColumns = [
        'id uuid primary key default gen_random_uuid()',
        'escalation_id uuid not null references public.instructor_escalations(id)',
        'event_type text not null',
        'event_data jsonb not null default \'{}\'',
        'actor_id uuid references auth.users(id)',
        'created_at timestamptz not null default now()'
      ];

      requiredColumns.forEach(col => {
        expect(migrationContent).toContain(col);
      });
    });

    it('should have event_type CHECK constraint with all valid event types', () => {
      expect(migrationContent).toContain('constraint valid_event_type check (event_type in (');
      expect(migrationContent).toContain('\'created\', \'acknowledged\', \'in_progress\', \'resolved\'');
      expect(migrationContent).toContain('\'auto_cleared\', \'auto_clear_aborted\', \'expired\', \'notes_updated\'');
    });

    it('should have required indexes', () => {
      expect(migrationContent).toContain('idx_instructor_escalation_events_escalation');
      expect(migrationContent).toContain('idx_instructor_escalation_events_type');
      expect(migrationContent).toContain('idx_instructor_escalation_events_created');
    });

    it('should have immutability enforcement', () => {
      expect(migrationContent).toContain('prevent_escalation_event_modification');
      expect(migrationContent).toContain('immutable audit ledger');
      expect(migrationContent).toContain('before update or delete on public.instructor_escalation_events');
    });
  });

  describe('sustained_performance_tracking Table', () => {
    it('should create sustained_performance_tracking table', () => {
      expect(migrationContent).toContain('create table if not exists public.sustained_performance_tracking');
    });

    it('should have required columns', () => {
      const requiredColumns = [
        'id uuid primary key default gen_random_uuid()',
        'user_id uuid not null references auth.users(id)',
        'concept_id text not null',
        'chapter_id text not null',
        'entered_cpw_at timestamptz not null',
        'last_verified_at timestamptz not null',
        'continuity_broken_at timestamptz',
        'follow_up_evidence_count integer not null default 0',
        'follow_up_evidence_ids uuid[] default \'{}\'',
        'is_active boolean not null default true',
        'reset_at timestamptz',
        'reset_id uuid',
        'created_at timestamptz not null default now()',
        'updated_at timestamptz not null default now()'
      ];

      requiredColumns.forEach(col => {
        expect(migrationContent).toContain(col);
      });
    });

    it('should have follow_up_evidence_count CHECK constraint (>= 0)', () => {
      expect(migrationContent).toContain('constraint valid_follow_up_count check (follow_up_evidence_count >= 0)');
    });

    it('should have continuity_broken_after_entry CHECK constraint', () => {
      expect(migrationContent).toContain('constraint continuity_broken_after_entry check (');
      expect(migrationContent).toContain('continuity_broken_at is null or continuity_broken_at >= entered_cpw_at');
    });

    it('should have reset_after_entry CHECK constraint', () => {
      expect(migrationContent).toContain('constraint reset_after_entry check (');
      expect(migrationContent).toContain('reset_at is null or reset_at >= entered_cpw_at');
    });

    it('should have required indexes', () => {
      expect(migrationContent).toContain('idx_sustained_performance_tracking_user_concept');
      expect(migrationContent).toContain('idx_sustained_performance_tracking_active');
      expect(migrationContent).toContain('idx_sustained_performance_tracking_eligibility');
    });

    it('should have unique active tracking constraint', () => {
      expect(migrationContent).toContain('idx_sustained_performance_tracking_active_unique');
      expect(migrationContent).toContain('where is_active = true');
    });
  });

  describe('sustained_performance_resets Table', () => {
    it('should create sustained_performance_resets table', () => {
      expect(migrationContent).toContain('create table if not exists public.sustained_performance_resets');
    });

    it('should have required columns', () => {
      const requiredColumns = [
        'id uuid primary key default gen_random_uuid()',
        'user_id uuid not null references auth.users(id)',
        'concept_id text not null',
        'chapter_id text not null',
        'tracking_id uuid not null references public.sustained_performance_tracking(id)',
        'entered_cpw_at timestamptz not null',
        'follow_up_evidence_count integer not null',
        'follow_up_evidence_ids uuid[] not null',
        'detection_evidence jsonb not null',
        'previous_cycle_count integer not null',
        'previous_unsuccessful_count integer not null',
        'previous_lockout_active boolean not null',
        'escalation_auto_cleared boolean not null default false',
        'escalation_id uuid references public.instructor_escalations(id)',
        'executed_at timestamptz not null default now()',
        'executed_by uuid references auth.users(id)'
      ];

      requiredColumns.forEach(col => {
        expect(migrationContent).toContain(col);
      });
    });

    it('should have valid_previous_counts CHECK constraint', () => {
      expect(migrationContent).toContain('constraint valid_previous_counts check (');
      expect(migrationContent).toContain('previous_cycle_count >= 0 and previous_unsuccessful_count >= 0');
    });

    it('should have unique tracking_id constraint for idempotency', () => {
      expect(migrationContent).toContain('idx_sustained_performance_resets_tracking_unique');
      expect(migrationContent).toContain('on public.sustained_performance_resets(tracking_id)');
    });

    it('should have unique period constraint for extra safety', () => {
      expect(migrationContent).toContain('idx_sustained_performance_resets_period_unique');
      expect(migrationContent).toContain('(user_id, concept_id, entered_cpw_at)');
    });

    it('should have required indexes', () => {
      expect(migrationContent).toContain('idx_sustained_performance_resets_user_concept');
      expect(migrationContent).toContain('idx_sustained_performance_resets_executed_at');
    });

    it('should have immutability enforcement', () => {
      expect(migrationContent).toContain('prevent_reset_modification');
      expect(migrationContent).toContain('immutable audit record');
      expect(migrationContent).toContain('before update or delete on public.sustained_performance_resets');
    });
  });

  describe('remediation_cycles Modifications', () => {
    it('should add reset_by_sustained_performance column', () => {
      expect(migrationContent).toContain('add column if not exists reset_by_sustained_performance boolean not null default false');
    });

    it('should add sustained_performance_reset_id column', () => {
      expect(migrationContent).toContain('add column if not exists sustained_performance_reset_id uuid references public.sustained_performance_resets(id)');
    });

    it('should have index for reset tracking', () => {
      expect(migrationContent).toContain('idx_remediation_cycles_reset');
      expect(migrationContent).toContain('where reset_by_sustained_performance = true');
    });
  });

  describe('Helper Functions', () => {
    it('should create check_sustained_performance_reset_eligibility function', () => {
      expect(migrationContent).toContain('create or replace function public.check_sustained_performance_reset_eligibility');
      expect(migrationContent).toContain('returns table (');
      expect(migrationContent).toContain('is_eligible boolean');
      expect(migrationContent).toContain('blocking_reason text');
    });

    it('should create create_instructor_escalation function', () => {
      expect(migrationContent).toContain('create or replace function public.create_instructor_escalation');
      expect(migrationContent).toContain('returns uuid');
    });

    it('should create record_detection_state_transition function', () => {
      expect(migrationContent).toContain('create or replace function public.record_detection_state_transition');
      expect(migrationContent).toContain('returns void');
    });

    it('should create execute_sustained_performance_reset function', () => {
      expect(migrationContent).toContain('create or replace function public.execute_sustained_performance_reset');
      expect(migrationContent).toContain('returns uuid');
    });

    it('should have idempotency protection in create_instructor_escalation', () => {
      expect(migrationContent).toContain('on conflict (user_id, concept_id) where status in (\'pending\', \'acknowledged\', \'in_progress\')');
      expect(migrationContent).toContain('do nothing');
    });

    it('should have idempotency protection in execute_sustained_performance_reset', () => {
      expect(migrationContent).toContain('on conflict (tracking_id) do nothing');
    });

    it('should have FOR UPDATE locking in execute_sustained_performance_reset', () => {
      expect(migrationContent).toContain('for update');
    });
  });

  describe('Row Level Security', () => {
    it('should enable RLS on all new tables', () => {
      expect(migrationContent).toContain('alter table public.instructor_escalations enable row level security');
      expect(migrationContent).toContain('alter table public.instructor_escalation_events enable row level security');
      expect(migrationContent).toContain('alter table public.sustained_performance_tracking enable row level security');
      expect(migrationContent).toContain('alter table public.sustained_performance_resets enable row level security');
    });

    it('should have student policies for instructor_escalations', () => {
      expect(migrationContent).toContain('instructor_escalations_student_select');
      expect(migrationContent).toContain('auth.uid() = user_id');
    });

    it('should have instructor policies for instructor_escalations', () => {
      expect(migrationContent).toContain('instructor_escalations_instructor_select');
      expect(migrationContent).toContain('instructor_escalations_instructor_update');
      expect(migrationContent).toContain('is_school_staff');
      expect(migrationContent).toContain('current_user_school_id');
    });

    it('should have super admin policies for instructor_escalations', () => {
      expect(migrationContent).toContain('instructor_escalations_super_admin');
      expect(migrationContent).toContain('is_platform_super_admin');
    });

    it('should have student policies for instructor_escalation_events', () => {
      expect(migrationContent).toContain('instructor_escalation_events_student_select');
    });

    it('should have staff policies for instructor_escalation_events', () => {
      expect(migrationContent).toContain('instructor_escalation_events_staff_select');
    });

    it('should have super admin policies for instructor_escalation_events', () => {
      expect(migrationContent).toContain('instructor_escalation_events_super_admin');
    });

    it('should have student policies for sustained_performance_tracking', () => {
      expect(migrationContent).toContain('sustained_performance_tracking_student_select');
    });

    it('should have staff policies for sustained_performance_tracking', () => {
      expect(migrationContent).toContain('sustained_performance_tracking_staff_select');
    });

    it('should have super admin policies for sustained_performance_tracking', () => {
      expect(migrationContent).toContain('sustained_performance_tracking_super_admin');
    });

    it('should have student policies for sustained_performance_resets', () => {
      expect(migrationContent).toContain('sustained_performance_resets_student_select');
    });

    it('should have staff policies for sustained_performance_resets', () => {
      expect(migrationContent).toContain('sustained_performance_resets_staff_select');
    });

    it('should have super admin policies for sustained_performance_resets', () => {
      expect(migrationContent).toContain('sustained_performance_resets_super_admin');
    });
  });

  describe('Chapter-Agnostic Design', () => {
    it('should use text for concept_id (not FK to chapter-specific table)', () => {
      expect(migrationContent).toContain('concept_id text not null');
      expect(migrationContent).not.toContain('concept_id uuid references');
    });

    it('should use text for chapter_id (not FK to chapter-specific table)', () => {
      expect(migrationContent).toContain('chapter_id text not null');
      expect(migrationContent).not.toContain('chapter_id uuid references');
    });

    it('should not hard-code Chapter 2 references in schema', () => {
      // Extract only the actual SQL statements (not comments)
      // Remove all comment lines and block comments
      const sqlOnly = migrationContent
        .split('\n')
        .filter(line => !line.trim().startsWith('--'))
        .join('\n')
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
      
      // Check that actual SQL doesn't contain hard-coded chapter 2 references
      expect(sqlOnly).not.toContain('C-2-')
      expect(sqlOnly).not.toContain('ch-2')
      expect(sqlOnly).not.toContain('qq-2-')
    });
  });

  describe('Documentation', () => {
    it('should have table comments', () => {
      expect(migrationContent).toContain('comment on table public.instructor_escalations');
      expect(migrationContent).toContain('comment on table public.instructor_escalation_events');
      expect(migrationContent).toContain('comment on table public.sustained_performance_tracking');
      expect(migrationContent).toContain('comment on table public.sustained_performance_resets');
    });

    it('should have column comments', () => {
      expect(migrationContent).toContain('comment on column public.instructor_escalations.triggering_cycle_ids');
      expect(migrationContent).toContain('comment on column public.instructor_escalations.detection_evidence');
      expect(migrationContent).toContain('comment on column public.instructor_escalations.acknowledged_by');
      expect(migrationContent).toContain('comment on column public.sustained_performance_tracking.entered_cpw_at');
      expect(migrationContent).toContain('comment on column public.sustained_performance_tracking.follow_up_evidence_count');
      expect(migrationContent).toContain('comment on column public.sustained_performance_resets.previous_cycle_count');
      expect(migrationContent).toContain('comment on column public.sustained_performance_resets.escalation_auto_cleared');
    });

    it('should have function comments', () => {
      expect(migrationContent).toContain('comment on function public.check_sustained_performance_reset_eligibility');
      expect(migrationContent).toContain('comment on function public.create_instructor_escalation');
      expect(migrationContent).toContain('comment on function public.record_detection_state_transition');
      expect(migrationContent).toContain('comment on function public.execute_sustained_performance_reset');
    });
  });

  describe('Foreign Key Constraints', () => {
    it('should add FK for auto_cleared_by_reset_id', () => {
      expect(migrationContent).toContain('add constraint fk_auto_cleared_by_reset');
      expect(migrationContent).toContain('foreign key (auto_cleared_by_reset_id)');
      expect(migrationContent).toContain('references public.sustained_performance_resets(id)');
    });

    it('should add FK for reset_id in sustained_performance_tracking', () => {
      expect(migrationContent).toContain('add constraint fk_reset_id');
      expect(migrationContent).toContain('foreign key (reset_id)');
      expect(migrationContent).toContain('references public.sustained_performance_resets(id)');
    });
  });

  describe('Updated_at Triggers', () => {
    it('should have updated_at trigger for instructor_escalations', () => {
      expect(migrationContent).toContain('update_instructor_escalations_updated_at');
      expect(migrationContent).toContain('before update on public.instructor_escalations');
    });

    it('should have updated_at trigger for sustained_performance_tracking', () => {
      expect(migrationContent).toContain('update_sustained_performance_tracking_updated_at');
      expect(migrationContent).toContain('before update on public.sustained_performance_tracking');
    });
  });
});

// ───────────────────────────────────────────────
// Follow-Up Evidence Integrity Migration Tests
// ───────────────────────────────────────────────

const FOLLOW_UP_MIGRATION_PATH = path.join(
  __dirname,
  '../../../supabase/migrations/20260819000001_phase_6c2c_follow_up_evidence_integrity.sql'
);

describe('Phase 6C-2c Follow-Up Evidence Integrity Migration', () => {
  let migrationContent: string;

  beforeAll(() => {
    migrationContent = fs.readFileSync(FOLLOW_UP_MIGRATION_PATH, 'utf-8');
  });

  describe('Migration File Structure', () => {
    it('should exist and be readable', () => {
      expect(fs.existsSync(FOLLOW_UP_MIGRATION_PATH)).toBe(true);
      expect(migrationContent.length).toBeGreaterThan(0);
    });

    it('should have proper migration header', () => {
      expect(migrationContent).toContain('Migration: 20260819000001_phase_6c2c_follow_up_evidence_integrity');
      expect(migrationContent).toContain('Follow-Up Assessment Evidence Integrity Hardening');
    });
  });

  describe('follow_up_evidence Table', () => {
    it('should create follow_up_evidence table', () => {
      expect(migrationContent).toContain('create table if not exists public.follow_up_evidence');
    });

    it('should have required columns', () => {
      const requiredColumns = [
        'id uuid primary key default gen_random_uuid()',
        'tracking_id uuid not null references public.sustained_performance_tracking(id)',
        'user_id uuid not null references auth.users(id)',
        'concept_id text not null',
        'chapter_id text not null',
        'quiz_attempt_id uuid not null references public.quiz_attempts(id)',
        'canonical_mapping_verified boolean not null default false',
        'mapped_question_count integer not null default 0',
        'attempt_completed_at timestamptz not null',
        'recorded_at timestamptz not null default now()',
      ];

      requiredColumns.forEach(col => {
        expect(migrationContent).toContain(col);
      });
    });

    it('should have deduplication unique index', () => {
      expect(migrationContent).toContain('idx_follow_up_evidence_dedup');
      expect(migrationContent).toContain('on public.follow_up_evidence(tracking_id, quiz_attempt_id)');
    });

    it('should have immutability trigger', () => {
      expect(migrationContent).toContain('enforce_follow_up_evidence_immutability');
      expect(migrationContent).toContain('prevent_follow_up_evidence_modification');
    });
  });

  describe('record_follow_up_evidence Function', () => {
    it('should create record_follow_up_evidence function', () => {
      expect(migrationContent).toContain('create or replace function public.record_follow_up_evidence');
    });

    it('should verify canonical_mapping_verified is true', () => {
      expect(migrationContent).toContain('if not p_canonical_mapping_verified then');
      expect(migrationContent).toContain('Canonical mapping verification required');
    });

    it('should verify mapped_question_count >= 1', () => {
      expect(migrationContent).toContain('if p_mapped_question_count < 1 then');
    });

    it('should verify quiz attempt exists', () => {
      expect(migrationContent).toContain('Quiz attempt not found');
    });

    it('should verify quiz attempt belongs to same student', () => {
      expect(migrationContent).toContain('belongs to user');
    });

    it('should verify attempt completed after entered_cpw_at', () => {
      expect(migrationContent).toContain('which is before entered_cpw_at');
    });

    it('should verify attempt has answers', () => {
      expect(migrationContent).toContain('not a legitimate assessment observation');
    });

    it('should use ON CONFLICT DO NOTHING for deduplication', () => {
      expect(migrationContent).toContain('on conflict (tracking_id, quiz_attempt_id) do nothing');
    });

    it('should update tracking counters from evidence ledger', () => {
      expect(migrationContent).toContain('follow_up_evidence_count = (');
      expect(migrationContent).toContain('select count(*) from public.follow_up_evidence');
    });
  });

  describe('record_detection_state_transition Hardening', () => {
    it('should NOT have p_quiz_attempt_id parameter', () => {
      // The hardened function should not accept a quiz attempt ID
      // Match the function signature up to the returns clause
      const functionMatch = migrationContent.match(
        /create or replace function public\.record_detection_state_transition\s*\([\s\S]*?\)\s*returns void/
      );
      expect(functionMatch).toBeTruthy();
      expect(functionMatch![0]).not.toContain('p_quiz_attempt_id');
    });

    it('should NOT increment follow_up_evidence_count', () => {
      // The hardened function should not touch follow-up evidence
      const functionMatch = migrationContent.match(
        /create or replace function public\.record_detection_state_transition\([\s\S]*?\$\$ language plpgsql/
      );
      expect(functionMatch).toBeTruthy();
      expect(functionMatch![0]).not.toContain('follow_up_evidence_count');
    });
  });

  describe('RLS Policies', () => {
    it('should enable RLS on follow_up_evidence', () => {
      expect(migrationContent).toContain('alter table public.follow_up_evidence enable row level security');
    });

    it('should have student select policy', () => {
      expect(migrationContent).toContain('follow_up_evidence_student_select');
    });

    it('should have staff select policy', () => {
      expect(migrationContent).toContain('follow_up_evidence_staff_select');
    });

    it('should have super admin policy', () => {
      expect(migrationContent).toContain('follow_up_evidence_super_admin');
    });
  });

  describe('No Chapter-Specific Hardcoding', () => {
    it('should not contain Chapter 2 concept IDs in SQL', () => {
      // The migration should be chapter-agnostic
      expect(migrationContent).not.toContain('C-2-01');
      expect(migrationContent).not.toContain('C-2-02');
      expect(migrationContent).not.toContain('qq-2-');
    });
  });
});
