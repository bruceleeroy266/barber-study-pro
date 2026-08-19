/**
 * Phase 6C-2a Migration Validation Tests
 * 
 * Validates the remediation foundation persistence layer migration structure.
 * These tests verify schema correctness without requiring a live database.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const MIGRATION_PATH = path.join(
  __dirname,
  '../../../supabase/migrations/20260818000000_phase_6c2a_remediation_foundation.sql'
);

describe('Phase 6C-2a Migration Validation', () => {
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
      expect(migrationContent).toContain('Migration: 20260818000000_phase_6c2a_remediation_foundation');
      expect(migrationContent).toContain('Phase 6C-2a — Foundation Persistence Implementation');
    });

    it('should include pgcrypto extension', () => {
      expect(migrationContent).toContain('create extension if not exists "pgcrypto"');
    });
  });

  describe('remediation_cycles Table', () => {
    it('should create remediation_cycles table', () => {
      expect(migrationContent).toContain('create table if not exists public.remediation_cycles');
    });

    it('should have required columns', () => {
      const requiredColumns = [
        'id uuid primary key default gen_random_uuid()',
        'user_id uuid not null references auth.users(id)',
        'concept_id text not null',
        'chapter_id text not null',
        'cycle_number integer not null',
        'detection_state text not null',
        'detection_confidence text not null',
        'detection_evidence jsonb not null',
        'status text not null default \'targeted\'',
        'targeted_at timestamptz not null default now()',
        'review_started_at timestamptz',
        'review_completed_at timestamptz',
        'reassessment_started_at timestamptz',
        'reassessment_completed_at timestamptz',
        'evaluated_at timestamptz',
        'outcome text',
        'post_remediation_state text',
        'created_at timestamptz not null default now()',
        'updated_at timestamptz not null default now()'
      ];

      requiredColumns.forEach(col => {
        expect(migrationContent).toContain(col);
      });
    });

    it('should have cycle_number CHECK constraint (1-3)', () => {
      expect(migrationContent).toContain('constraint valid_cycle_number check (cycle_number between 1 and 3)');
    });

    it('should have status CHECK constraint', () => {
      expect(migrationContent).toContain('constraint valid_status check (status in (');
      expect(migrationContent).toContain('\'targeted\', \'in_review\', \'review_completed\', \'reassessed\', \'evaluated\'');
    });

    it('should have outcome CHECK constraint', () => {
      expect(migrationContent).toContain('constraint valid_outcome check (');
      expect(migrationContent).toContain('\'successful\', \'unsuccessful\', \'pending\'');
    });

    it('should have detection_state CHECK constraint', () => {
      expect(migrationContent).toContain('constraint valid_detection_state check (');
      expect(migrationContent).toContain('\'emerging_weakness\', \'repeated_weakness\'');
    });

    it('should have detection_confidence CHECK constraint', () => {
      expect(migrationContent).toContain('constraint valid_detection_confidence check (');
      expect(migrationContent).toContain('\'low\', \'medium\', \'high\'');
    });

    it('should have required indexes', () => {
      expect(migrationContent).toContain('idx_remediation_cycles_user_concept');
      expect(migrationContent).toContain('idx_remediation_cycles_user_chapter');
      expect(migrationContent).toContain('idx_remediation_cycles_status');
      expect(migrationContent).toContain('idx_remediation_cycles_targeted_at');
    });

    it('should have unique active cycle constraint', () => {
      expect(migrationContent).toContain('idx_remediation_cycles_active_unique');
      expect(migrationContent).toContain('where status not in (\'evaluated\')');
    });
  });

  describe('remediation_cycle_events Table', () => {
    it('should create remediation_cycle_events table', () => {
      expect(migrationContent).toContain('create table if not exists public.remediation_cycle_events');
    });

    it('should have required columns', () => {
      const requiredColumns = [
        'id uuid primary key default gen_random_uuid()',
        'cycle_id uuid not null references public.remediation_cycles(id)',
        'event_type text not null',
        'event_data jsonb not null default \'{}\'',
        'created_at timestamptz not null default now()'
      ];

      requiredColumns.forEach(col => {
        expect(migrationContent).toContain(col);
      });
    });

    it('should have event_type CHECK constraint', () => {
      expect(migrationContent).toContain('constraint valid_event_type check (event_type in (');
      expect(migrationContent).toContain('\'targeted\', \'review_started\', \'content_viewed\', \'flashcard_reviewed\'');
      expect(migrationContent).toContain('\'review_completed\', \'reassessment_started\', \'reassessment_completed\'');
      expect(migrationContent).toContain('\'evaluated\', \'escalated\', \'reset\'');
    });

    it('should have required indexes', () => {
      expect(migrationContent).toContain('idx_remediation_cycle_events_cycle');
      expect(migrationContent).toContain('idx_remediation_cycle_events_type');
      expect(migrationContent).toContain('idx_remediation_cycle_events_created');
    });

    it('should have immutability enforcement', () => {
      expect(migrationContent).toContain('prevent_cycle_event_modification');
      expect(migrationContent).toContain('immutable audit ledger');
      expect(migrationContent).toContain('before update or delete on public.remediation_cycle_events');
    });
  });

  describe('remediation_assignments Table', () => {
    it('should create remediation_assignments table', () => {
      expect(migrationContent).toContain('create table if not exists public.remediation_assignments');
    });

    it('should have required columns', () => {
      const requiredColumns = [
        'id uuid primary key default gen_random_uuid()',
        'cycle_id uuid not null references public.remediation_cycles(id)',
        'assignment_type text not null',
        'asset_id text not null',
        'priority integer not null default 1',
        'is_primary boolean not null default true',
        'status text not null default \'assigned\'',
        'started_at timestamptz',
        'completed_at timestamptz',
        'created_at timestamptz not null default now()',
        'updated_at timestamptz not null default now()'
      ];

      requiredColumns.forEach(col => {
        expect(migrationContent).toContain(col);
      });
    });

    it('should have assignment_type CHECK constraint', () => {
      expect(migrationContent).toContain('constraint valid_assignment_type check (');
      expect(migrationContent).toContain('\'content_block\', \'flashcard\'');
    });

    it('should have status CHECK constraint', () => {
      expect(migrationContent).toContain('constraint valid_assignment_status check (');
      expect(migrationContent).toContain('\'assigned\', \'started\', \'completed\'');
    });

    it('should have required indexes', () => {
      expect(migrationContent).toContain('idx_remediation_assignments_cycle');
      expect(migrationContent).toContain('idx_remediation_assignments_status');
    });

    it('should have unique assignment constraint', () => {
      expect(migrationContent).toContain('idx_remediation_assignments_unique');
      expect(migrationContent).toContain('(cycle_id, assignment_type, asset_id)');
    });
  });

  describe('Row Level Security', () => {
    it('should enable RLS on all tables', () => {
      expect(migrationContent).toContain('alter table public.remediation_cycles enable row level security');
      expect(migrationContent).toContain('alter table public.remediation_cycle_events enable row level security');
      expect(migrationContent).toContain('alter table public.remediation_assignments enable row level security');
    });

    it('should have student policies for remediation_cycles', () => {
      expect(migrationContent).toContain('remediation_cycles_select');
      expect(migrationContent).toContain('remediation_cycles_insert');
      expect(migrationContent).toContain('remediation_cycles_update');
    });

    it('should have staff policies for remediation_cycles', () => {
      expect(migrationContent).toContain('remediation_cycles_staff_select');
      expect(migrationContent).toContain('is_school_staff');
      expect(migrationContent).toContain('current_user_school_id');
      expect(migrationContent).toContain('user_school_id');
    });

    it('should have super admin policies for remediation_cycles', () => {
      expect(migrationContent).toContain('remediation_cycles_super_admin');
      expect(migrationContent).toContain('is_platform_super_admin');
    });

    it('should have student policies for remediation_cycle_events', () => {
      expect(migrationContent).toContain('remediation_cycle_events_select');
      expect(migrationContent).toContain('remediation_cycle_events_insert');
    });

    it('should have staff policies for remediation_cycle_events', () => {
      expect(migrationContent).toContain('remediation_cycle_events_staff_select');
    });

    it('should have super admin policies for remediation_cycle_events', () => {
      expect(migrationContent).toContain('remediation_cycle_events_super_admin');
    });

    it('should have student policies for remediation_assignments', () => {
      expect(migrationContent).toContain('remediation_assignments_select');
      expect(migrationContent).toContain('remediation_assignments_insert');
      expect(migrationContent).toContain('remediation_assignments_update');
    });

    it('should have staff policies for remediation_assignments', () => {
      expect(migrationContent).toContain('remediation_assignments_staff_select');
    });

    it('should have super admin policies for remediation_assignments', () => {
      expect(migrationContent).toContain('remediation_assignments_super_admin');
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

    it('should not hard-code Chapter 2 references', () => {
      // Check that migration doesn't contain hard-coded chapter 2 references
      // (comments are OK, but not in schema definitions)
      const schemaSection = migrationContent.split('-- ============================================================================')[1];
      expect(schemaSection).not.toContain('C-2-');
      expect(schemaSection).not.toContain('ch-2');
    });
  });

  describe('Deferred Items (Not in Phase 6C-2a)', () => {
    it('should NOT create reassessment_question_history table', () => {
      expect(migrationContent).not.toContain('create table.*reassessment_question_history');
    });

    it('should NOT create instructor_escalations table', () => {
      expect(migrationContent).not.toContain('create table.*instructor_escalations');
    });

    it('should NOT create sustained_performance_resets table', () => {
      expect(migrationContent).not.toContain('create table.*sustained_performance_resets');
    });

    it('should NOT modify quiz_attempts table', () => {
      expect(migrationContent).not.toContain('alter table public.quiz_attempts');
      expect(migrationContent).not.toContain('add column.*is_reassessment');
    });
  });

  describe('Documentation', () => {
    it('should have table comments', () => {
      expect(migrationContent).toContain('comment on table public.remediation_cycles');
      expect(migrationContent).toContain('comment on table public.remediation_cycle_events');
      expect(migrationContent).toContain('comment on table public.remediation_assignments');
    });

    it('should have column comments', () => {
      expect(migrationContent).toContain('comment on column public.remediation_cycles.cycle_number');
      expect(migrationContent).toContain('comment on column public.remediation_cycles.detection_evidence');
      expect(migrationContent).toContain('comment on column public.remediation_cycle_events.event_type');
    });
  });
});
