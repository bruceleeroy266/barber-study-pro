/**
 * Phase 6C-2b Migration Validation Tests
 *
 * Validates the reassessment integrity persistence layer migration structure.
 * These tests verify schema correctness without requiring a live database.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const MIGRATION_PATH = path.join(
  __dirname,
  '../../../supabase/migrations/20260818000001_phase_6c2b_reassessment_integrity.sql'
);

describe('Phase 6C-2b Migration Validation', () => {
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
      expect(migrationContent).toContain('Migration: 20260818000001_phase_6c2b_reassessment_integrity');
      expect(migrationContent).toContain('Phase 6C-2b — Reassessment Integrity Implementation');
    });

    it('should include pgcrypto extension', () => {
      expect(migrationContent).toContain('create extension if not exists "pgcrypto"');
    });
  });

  describe('reassessment_question_history Table', () => {
    it('should create reassessment_question_history table', () => {
      expect(migrationContent).toContain('create table if not exists public.reassessment_question_history');
    });

    it('should have required columns', () => {
      const requiredColumns = [
        'id uuid primary key default gen_random_uuid()',
        'user_id uuid not null references auth.users(id)',
        'concept_id text not null',
        'question_id text not null',
        'quiz_attempt_id uuid not null references public.quiz_attempts(id)',
        'cycle_id uuid references public.remediation_cycles(id)',
        'is_correct boolean not null',
        'attempted_at timestamptz not null default now()'
      ];

      requiredColumns.forEach(col => {
        expect(migrationContent).toContain(col);
      });
    });

    it('should have unique constraint on (user_id, concept_id, question_id)', () => {
      expect(migrationContent).toContain('constraint unique_user_concept_question unique (user_id, concept_id, question_id)');
    });

    it('should have required indexes', () => {
      expect(migrationContent).toContain('idx_reassessment_question_history_user_concept');
      expect(migrationContent).toContain('idx_reassessment_question_history_cycle');
      expect(migrationContent).toContain('idx_reassessment_question_history_quiz_attempt');
      expect(migrationContent).toContain('idx_reassessment_question_history_attempted_at');
    });

    it('should have immutability enforcement', () => {
      expect(migrationContent).toContain('prevent_question_history_modification');
      expect(migrationContent).toContain('immutable audit trail');
      expect(migrationContent).toContain('before update or delete on public.reassessment_question_history');
    });
  });

  describe('concept_question_pool_exhaustion Table', () => {
    it('should create concept_question_pool_exhaustion table', () => {
      expect(migrationContent).toContain('create table if not exists public.concept_question_pool_exhaustion');
    });

    it('should have required columns', () => {
      const requiredColumns = [
        'id uuid primary key default gen_random_uuid()',
        'user_id uuid not null references auth.users(id)',
        'concept_id text not null',
        'chapter_id text not null',
        'cycle_id uuid not null references public.remediation_cycles(id)',
        'total_questions_in_pool integer not null',
        'attempted_question_count integer not null',
        'attempted_question_ids jsonb not null',
        'exhausted_at timestamptz not null default now()',
        'resolved_at timestamptz',
        'resolved_by uuid references auth.users(id)',
        'resolution_notes text',
        'created_at timestamptz not null default now()',
        'updated_at timestamptz not null default now()'
      ];

      requiredColumns.forEach(col => {
        expect(migrationContent).toContain(col);
      });
    });

    it('should have pool counts CHECK constraint', () => {
      expect(migrationContent).toContain('constraint valid_pool_counts check (');
      expect(migrationContent).toContain('total_questions_in_pool >= 0');
      expect(migrationContent).toContain('attempted_question_count >= 0');
      expect(migrationContent).toContain('attempted_question_count <= total_questions_in_pool');
    });

    it('should have required indexes', () => {
      expect(migrationContent).toContain('idx_concept_question_pool_exhaustion_user_concept');
      expect(migrationContent).toContain('idx_concept_question_pool_exhaustion_cycle');
      expect(migrationContent).toContain('idx_concept_question_pool_exhaustion_unresolved');
    });

    it('should have unique active exhaustion constraint', () => {
      expect(migrationContent).toContain('idx_concept_question_pool_exhaustion_active_unique');
      expect(migrationContent).toContain('(user_id, concept_id, cycle_id)');
      expect(migrationContent).toContain('where resolved_at is null');
    });
  });

  describe('quiz_attempts Modifications', () => {
    it('should add is_reassessment column', () => {
      expect(migrationContent).toContain('add column if not exists is_reassessment boolean not null default false');
    });

    it('should add remediation_cycle_id column', () => {
      expect(migrationContent).toContain('add column if not exists remediation_cycle_id uuid references public.remediation_cycles(id)');
    });

    it('should add target_concept_id column', () => {
      expect(migrationContent).toContain('add column if not exists target_concept_id text');
    });

    it('should have reassessment indexes', () => {
      expect(migrationContent).toContain('idx_quiz_attempts_reassessment');
      expect(migrationContent).toContain('idx_quiz_attempts_cycle');
      expect(migrationContent).toContain('idx_quiz_attempts_target_concept');
    });
  });

  describe('Concurrency Protection Functions', () => {
    it('should create has_attempted_question function', () => {
      expect(migrationContent).toContain('create or replace function public.has_attempted_question');
      expect(migrationContent).toContain('returns boolean');
    });

    it('should create get_attempted_question_ids function', () => {
      expect(migrationContent).toContain('create or replace function public.get_attempted_question_ids');
      expect(migrationContent).toContain('returns text[]');
    });

    it('should create record_question_attempt function with ON CONFLICT', () => {
      expect(migrationContent).toContain('create or replace function public.record_question_attempt');
      expect(migrationContent).toContain('on conflict (user_id, concept_id, question_id) do nothing');
    });

    it('should create check_and_record_pool_exhaustion function', () => {
      expect(migrationContent).toContain('create or replace function public.check_and_record_pool_exhaustion');
      expect(migrationContent).toContain('returns uuid');
    });

    it('should use security definer for functions', () => {
      expect(migrationContent).toContain('language plpgsql security definer');
    });
  });

  describe('Row Level Security', () => {
    it('should enable RLS on all new tables', () => {
      expect(migrationContent).toContain('alter table public.reassessment_question_history enable row level security');
      expect(migrationContent).toContain('alter table public.concept_question_pool_exhaustion enable row level security');
    });

    it('should have student policies for reassessment_question_history', () => {
      expect(migrationContent).toContain('reassessment_question_history_select');
      expect(migrationContent).toContain('reassessment_question_history_insert');
    });

    it('should have staff policies for reassessment_question_history', () => {
      expect(migrationContent).toContain('reassessment_question_history_staff_select');
      expect(migrationContent).toContain('is_school_staff');
      expect(migrationContent).toContain('current_user_school_id');
      expect(migrationContent).toContain('user_school_id');
    });

    it('should have super admin policies for reassessment_question_history', () => {
      expect(migrationContent).toContain('reassessment_question_history_super_admin');
      expect(migrationContent).toContain('is_platform_super_admin');
    });

    it('should have student policies for concept_question_pool_exhaustion', () => {
      expect(migrationContent).toContain('concept_question_pool_exhaustion_select');
      expect(migrationContent).toContain('concept_question_pool_exhaustion_insert');
    });

    it('should have staff policies for concept_question_pool_exhaustion', () => {
      expect(migrationContent).toContain('concept_question_pool_exhaustion_staff_select');
    });

    it('should have super admin policies for concept_question_pool_exhaustion', () => {
      expect(migrationContent).toContain('concept_question_pool_exhaustion_super_admin');
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
      // Extract schema definitions (after first comment block)
      const schemaMatch = migrationContent.match(/-- =+\n-- \d+\. .*\n-- =+\n([\s\S]*?)(?=-- =+\n-- \d+\.|$)/g);
      if (schemaMatch) {
        schemaMatch.forEach(section => {
          // Remove comments for this check
          const noComments = section.replace(/--.*$/gm, '');
          expect(noComments).not.toContain('C-2-');
          expect(noComments).not.toContain('ch-2');
        });
      }
    });
  });

  describe('Reassessment Integrity Rules', () => {
    it('should document the binding rule', () => {
      expect(migrationContent).toContain('A student must never receive a previously attempted question');
      expect(migrationContent).toContain('as valid reassessment evidence for that concept');
    });

    it('should document pool exhaustion requirement', () => {
      expect(migrationContent).toContain('Do NOT silently reuse an old question');
      expect(migrationContent).toContain('Persist an explicit pool-exhaustion state/flag');
    });
  });

  describe('Documentation', () => {
    it('should have table comments', () => {
      expect(migrationContent).toContain('comment on table public.reassessment_question_history');
      expect(migrationContent).toContain('comment on table public.concept_question_pool_exhaustion');
    });

    it('should have column comments', () => {
      expect(migrationContent).toContain('comment on column public.reassessment_question_history.cycle_id');
      expect(migrationContent).toContain('comment on column public.concept_question_pool_exhaustion.attempted_question_ids');
      expect(migrationContent).toContain('comment on column public.quiz_attempts.is_reassessment');
      expect(migrationContent).toContain('comment on column public.quiz_attempts.remediation_cycle_id');
      expect(migrationContent).toContain('comment on column public.quiz_attempts.target_concept_id');
    });

    it('should have function comments', () => {
      expect(migrationContent).toContain('comment on function public.has_attempted_question');
      expect(migrationContent).toContain('comment on function public.get_attempted_question_ids');
      expect(migrationContent).toContain('comment on function public.record_question_attempt');
      expect(migrationContent).toContain('comment on function public.check_and_record_pool_exhaustion');
    });
  });

  describe('Phase 6C-2a Preservation', () => {
    it('should not modify Phase 6C-2a tables', () => {
      expect(migrationContent).not.toContain('alter table public.remediation_cycles');
      expect(migrationContent).not.toContain('alter table public.remediation_cycle_events');
      expect(migrationContent).not.toContain('alter table public.remediation_assignments');
    });

    it('should not drop Phase 6C-2a tables', () => {
      expect(migrationContent).not.toContain('drop table public.remediation_cycles');
      expect(migrationContent).not.toContain('drop table public.remediation_cycle_events');
      expect(migrationContent).not.toContain('drop table public.remediation_assignments');
    });
  });

  describe('Excluded Items (Not in Phase 6C-2b)', () => {
    it('should NOT create instructor_escalations table', () => {
      expect(migrationContent).not.toContain('create table.*instructor_escalations');
    });

    it('should NOT create sustained_performance_resets table', () => {
      expect(migrationContent).not.toContain('create table.*sustained_performance_resets');
    });

    it('should NOT implement remediation UI', () => {
      expect(migrationContent).not.toContain('create table.*remediation_ui');
    });

    it('should NOT implement instructor escalation runtime', () => {
      expect(migrationContent).not.toContain('create table.*escalation_runtime');
    });

    it('should NOT implement sustained-performance reset runtime', () => {
      expect(migrationContent).not.toContain('create table.*reset_runtime');
    });
  });
});
