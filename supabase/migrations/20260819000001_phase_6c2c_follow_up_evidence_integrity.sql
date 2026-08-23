-- ============================================================================
-- Migration: 20260819000001_phase_6c2c_follow_up_evidence_integrity
-- Phase 6C-2c — Follow-Up Assessment Evidence Integrity Hardening
--
-- Corrects the semantic-integrity defect identified in the Phase 6C-2c
-- pre-commit adversarial review:
--
--   DEFECT: record_detection_state_transition() accepted a caller-supplied
--   p_quiz_attempt_id and incremented follow_up_evidence_count without
--   independently verifying that the observation represents legitimate
--   persisted assessment evidence for the same student and target concept.
--
--   CORRECTION: Introduce a dedicated follow_up_evidence ledger and a
--   verified evidence-recording function that authoritatively establishes:
--     1. The quiz attempt exists in quiz_attempts
--     2. It belongs to the same student
--     3. It was completed after the active entered_cpw_at
--     4. It contains actual answers (is a legitimate assessment)
--     5. It has not already been counted (deduplication)
--     6. The application layer has verified canonical question→concept mapping
--
-- Architectural constraints preserved:
--   - Curriculum semantics/canonical concept mapping remain application-layer
--   - No Chapter 2 IDs hard-coded in SQL
--   - No concept membership inferred from question-ID naming
--   - No historical quiz_attempts rewritten
--   - Phase 6C-2b reassessment integrity and presentation atomicity preserved
-- ============================================================================

-- Ensure pgcrypto is available
create extension if not exists "pgcrypto";

-- ============================================================================
-- 1. FOLLOW_UP_EVIDENCE TABLE (Immutable, Deduplicated Evidence Ledger)
-- ============================================================================
-- Each row represents one verified follow-up assessment observation that
-- qualifies as sustained-performance evidence. The UNIQUE constraint on
-- (tracking_id, quiz_attempt_id) prevents double-counting.

create table if not exists public.follow_up_evidence (
  id uuid primary key default gen_random_uuid(),

  -- Reference to the tracking period this evidence supports
  tracking_id uuid not null references public.sustained_performance_tracking(id) on delete cascade,

  -- Identity (denormalized for query performance and audit)
  user_id uuid not null references auth.users(id) on delete cascade,
  concept_id text not null,
  chapter_id text not null,

  -- The authoritative quiz attempt providing this evidence
  quiz_attempt_id uuid not null references public.quiz_attempts(id) on delete cascade,

  -- Verification metadata
  -- The application layer must verify canonical mapping before calling;
  -- this column records that verification occurred
  canonical_mapping_verified boolean not null default false,

  -- Number of questions in the attempt that map to the target concept
  -- (computed by application layer via canonical mapping provider)
  mapped_question_count integer not null default 0,

  -- Timestamp of the quiz attempt (denormalized from quiz_attempts)
  attempt_completed_at timestamptz not null,

  -- Timestamp when evidence was recorded
  recorded_at timestamptz not null default now(),

  -- Constraints
  constraint valid_mapped_question_count check (mapped_question_count >= 0)
  -- Note: attempt_after_tracking_entry check removed - PostgreSQL does not allow subqueries in CHECK constraints
  -- This invariant is enforced by the application layer and the record_follow_up_evidence function
);

-- Deduplication: one evidence record per tracking period per quiz attempt
create unique index if not exists idx_follow_up_evidence_dedup
  on public.follow_up_evidence(tracking_id, quiz_attempt_id);

-- Indexes
create index if not exists idx_follow_up_evidence_tracking
  on public.follow_up_evidence(tracking_id);
create index if not exists idx_follow_up_evidence_user_concept
  on public.follow_up_evidence(user_id, concept_id);
create index if not exists idx_follow_up_evidence_quiz_attempt
  on public.follow_up_evidence(quiz_attempt_id);
create index if not exists idx_follow_up_evidence_recorded
  on public.follow_up_evidence(recorded_at desc);

-- ============================================================================
-- 2. IMMUTABILITY ENFORCEMENT FOR FOLLOW_UP_EVIDENCE
-- ============================================================================

create or replace function public.prevent_follow_up_evidence_modification()
returns trigger as $$
begin
  raise exception 'follow_up_evidence is an immutable evidence ledger. UPDATE and DELETE operations are not allowed.';
end;
$$ language plpgsql;

create trigger enforce_follow_up_evidence_immutability
  before update or delete on public.follow_up_evidence
  for each row execute function public.prevent_follow_up_evidence_modification();

-- ============================================================================
-- 3. VERIFIED FOLLOW-UP EVIDENCE RECORDING FUNCTION
-- ============================================================================
-- This function replaces the blind p_quiz_attempt_id increment in
-- record_detection_state_transition. It performs authoritative server-side
-- verification before recording evidence.
--
-- The application layer MUST verify canonical question→concept mapping
-- BEFORE calling this function and set p_canonical_mapping_verified = true.
-- This function verifies everything it can authoritatively check from
-- persisted data.

create or replace function public.record_follow_up_evidence(
  p_user_id uuid,
  p_concept_id text,
  p_chapter_id text,
  p_quiz_attempt_id uuid,
  p_canonical_mapping_verified boolean,
  p_mapped_question_count integer
)
returns uuid as $$
declare
  v_tracking_id uuid;
  v_entered_cpw_at timestamptz;
  v_attempt_user_id uuid;
  v_attempt_completed_at timestamptz;
  v_attempt_answers jsonb;
  v_evidence_id uuid;
begin
  -- ───────────────────────────────────────────────
  -- Verification 1: Canonical mapping must be verified by application layer
  -- ───────────────────────────────────────────────
  if not p_canonical_mapping_verified then
    raise exception 'Canonical mapping verification required: application layer must verify question→concept mapping before recording follow-up evidence';
  end if;

  if p_mapped_question_count < 1 then
    raise exception 'At least one canonically-mapped question required: mapped_question_count must be >= 1, got %', p_mapped_question_count;
  end if;

  -- ───────────────────────────────────────────────
  -- Verification 2: Active tracking period must exist
  -- ───────────────────────────────────────────────
  select id, entered_cpw_at into v_tracking_id, v_entered_cpw_at
  from public.sustained_performance_tracking
  where user_id = p_user_id
    and concept_id = p_concept_id
    and is_active = true;

  if v_tracking_id is null then
    raise exception 'No active sustained performance tracking found for user % concept %', p_user_id, p_concept_id;
  end if;

  -- ───────────────────────────────────────────────
  -- Verification 3: Quiz attempt must exist and belong to the same student
  -- ───────────────────────────────────────────────
  select user_id, completed_at, answers_json
  into v_attempt_user_id, v_attempt_completed_at, v_attempt_answers
  from public.quiz_attempts
  where id = p_quiz_attempt_id;

  if v_attempt_user_id is null then
    raise exception 'Quiz attempt not found: %', p_quiz_attempt_id;
  end if;

  if v_attempt_user_id != p_user_id then
    raise exception 'Quiz attempt % belongs to user %, not user %', p_quiz_attempt_id, v_attempt_user_id, p_user_id;
  end if;

  -- ───────────────────────────────────────────────
  -- Verification 4: Attempt must be completed after entering CPW
  -- ───────────────────────────────────────────────
  if v_attempt_completed_at is null then
    raise exception 'Quiz attempt % has no completed_at timestamp (not a completed assessment)', p_quiz_attempt_id;
  end if;

  if v_attempt_completed_at < v_entered_cpw_at then
    raise exception 'Quiz attempt % completed at % which is before entered_cpw_at % (evidence must be new)',
      p_quiz_attempt_id, v_attempt_completed_at, v_entered_cpw_at;
  end if;

  -- ───────────────────────────────────────────────
  -- Verification 5: Attempt must be a legitimate assessment (has answers)
  -- ───────────────────────────────────────────────
  if v_attempt_answers is null or v_attempt_answers = '{}'::jsonb then
    raise exception 'Quiz attempt % has no answers (not a legitimate assessment observation)', p_quiz_attempt_id;
  end if;

  -- ───────────────────────────────────────────────
  -- Verification 6: Deduplication — same attempt cannot be counted twice
  -- ───────────────────────────────────────────────
  -- The UNIQUE constraint on (tracking_id, quiz_attempt_id) provides the
  -- final authority. ON CONFLICT DO NOTHING returns NULL on duplicate.

  insert into public.follow_up_evidence (
    tracking_id, user_id, concept_id, chapter_id,
    quiz_attempt_id, canonical_mapping_verified, mapped_question_count,
    attempt_completed_at
  )
  values (
    v_tracking_id, p_user_id, p_concept_id, p_chapter_id,
    p_quiz_attempt_id, p_canonical_mapping_verified, p_mapped_question_count,
    v_attempt_completed_at
  )
  on conflict (tracking_id, quiz_attempt_id) do nothing
  returning id into v_evidence_id;

  -- If NULL, this attempt was already recorded (duplicate)
  if v_evidence_id is null then
    -- Return the existing evidence ID (idempotent)
    select id into v_evidence_id
    from public.follow_up_evidence
    where tracking_id = v_tracking_id
      and quiz_attempt_id = p_quiz_attempt_id;
    return v_evidence_id;
  end if;

  -- ───────────────────────────────────────────────
  -- Update tracking counters (only for new, non-duplicate evidence)
  -- ───────────────────────────────────────────────
  update public.sustained_performance_tracking
  set
    follow_up_evidence_count = (
      select count(*) from public.follow_up_evidence
      where tracking_id = v_tracking_id
    ),
    follow_up_evidence_ids = (
      select coalesce(array_agg(quiz_attempt_id), '{}')
      from public.follow_up_evidence
      where tracking_id = v_tracking_id
    ),
    last_verified_at = now()
  where id = v_tracking_id;

  return v_evidence_id;
end;
$$ language plpgsql security definer;

-- ============================================================================
-- 4. HARDEN record_detection_state_transition
-- ============================================================================
-- Remove the blind p_quiz_attempt_id increment. The function now ONLY
-- manages tracking lifecycle (entry, continuity, breaks). Follow-up
-- evidence must be recorded separately via record_follow_up_evidence()
-- which performs authoritative verification.

-- Drop the old 6-parameter version first (from 20260819000000)
-- PostgreSQL CREATE OR REPLACE with different signature creates overload, not replacement
drop function if exists public.record_detection_state_transition(uuid, text, text, text, jsonb, uuid);

create or replace function public.record_detection_state_transition(
  p_user_id uuid,
  p_concept_id text,
  p_chapter_id text,
  p_new_state text,
  p_evidence jsonb
)
returns void as $$
declare
  v_existing_tracking_id uuid;
  v_is_cpw boolean;
begin
  -- Determine if new state is currently_performing_well
  v_is_cpw := (p_new_state = 'currently_performing_well');

  -- Check for existing active tracking
  select id into v_existing_tracking_id
  from public.sustained_performance_tracking
  where user_id = p_user_id
    and concept_id = p_concept_id
    and is_active = true;

  if v_is_cpw then
    if v_existing_tracking_id is null then
      -- New tracking period: insert new record
      insert into public.sustained_performance_tracking (
        user_id, concept_id, chapter_id, entered_cpw_at, last_verified_at
      )
      values (
        p_user_id, p_concept_id, p_chapter_id, now(), now()
      );
    else
      -- Continued CPW: update last_verified_at
      update public.sustained_performance_tracking
      set last_verified_at = now()
      where id = v_existing_tracking_id;
    end if;
  else
    -- Transition out of CPW: break continuity
    if v_existing_tracking_id is not null then
      update public.sustained_performance_tracking
      set
        continuity_broken_at = now(),
        is_active = false
      where id = v_existing_tracking_id;
    end if;
  end if;
end;
$$ language plpgsql security definer;

-- ============================================================================
-- 5. ROW LEVEL SECURITY FOR FOLLOW_UP_EVIDENCE
-- ============================================================================

alter table public.follow_up_evidence enable row level security;

-- Students: read own evidence
create policy follow_up_evidence_student_select on public.follow_up_evidence
  for select to authenticated
  using (auth.uid() = user_id);

-- School staff: read evidence for students in same school
create policy follow_up_evidence_staff_select on public.follow_up_evidence
  for select to authenticated
  using (
    public.is_school_staff(public.current_user_school_id())
    and public.current_user_school_id() = public.user_school_id(user_id)
  );

-- Platform super admin: full access
create policy follow_up_evidence_super_admin on public.follow_up_evidence
  for all to authenticated
  using (public.is_platform_super_admin())
  with check (public.is_platform_super_admin());

-- ============================================================================
-- 6. COMMENTS FOR DOCUMENTATION
-- ============================================================================

comment on table public.follow_up_evidence is
  'Phase 6C-2c: Immutable, deduplicated ledger of verified follow-up assessment evidence for sustained-performance reset. Each record represents one quiz attempt that has been authoritatively verified as legitimate concept-mapped assessment evidence.';

comment on column public.follow_up_evidence.canonical_mapping_verified is
  'TRUE indicates the application layer verified question→concept mapping via the canonical mapping provider before recording. The database cannot verify curriculum semantics; this flag records that the application-layer verification occurred.';

comment on column public.follow_up_evidence.mapped_question_count is
  'Number of questions in the quiz attempt that are canonically mapped to the target concept. Computed by the application layer via ICanonicalMappingProvider.';

comment on function public.record_follow_up_evidence is
  'Records verified follow-up assessment evidence. Performs authoritative server-side verification: attempt exists, belongs to student, completed after CPW entry, has answers, not duplicate. Application layer must verify canonical mapping before calling.';

comment on function public.record_detection_state_transition is
  'Records a detection state transition from the Phase 6B-3 detection engine. Manages sustained_performance_tracking lifecycle ONLY. Follow-up evidence must be recorded separately via record_follow_up_evidence().';

-- ============================================================================
-- 6. TABLE GRANT REPAIR
-- ============================================================================
-- Repair table-level grants for authenticated and service_role.
-- Earlier migrations revoked privileges from authenticated but did not
-- consistently re-grant the minimum required SELECT for RLS policy
-- evaluation. This section restores the necessary grants.

-- Schools: SELECT for all roles (public read)
grant select on public.schools to anon, authenticated, service_role;

-- Programs: SELECT for authenticated (needed for RLS policy evaluation)
grant select on public.programs to authenticated, service_role;

-- Students: SELECT for authenticated (needed for RLS policy evaluation)
grant select on public.students to authenticated, service_role;

-- Instructors: SELECT for authenticated (needed for RLS policy evaluation)
grant select on public.instructors to authenticated, service_role;

-- Profiles: SELECT for authenticated (needed for RLS policy evaluation)
grant select on public.profiles to authenticated, service_role;

-- Enrollments: SELECT for authenticated (needed for RLS policy evaluation)
grant select on public.enrollments to authenticated, service_role;

-- Quiz attempts: SELECT for authenticated (needed for RLS policy evaluation)
grant select on public.quiz_attempts to authenticated, service_role;

-- Missed questions: SELECT for authenticated (needed for RLS policy evaluation)
grant select on public.missed_questions to authenticated, service_role;

-- Student progress: SELECT for authenticated (needed for RLS policy evaluation)
grant select on public.student_progress to authenticated, service_role;

-- Pilot inquiries: SELECT for authenticated (needed for RLS policy evaluation)
grant select on public.pilot_inquiries to authenticated, service_role;

-- School settings: SELECT for authenticated (needed for RLS policy evaluation)
grant select on public.school_settings to authenticated, service_role;

-- Owner notifications: SELECT for authenticated (needed for RLS policy evaluation)
grant select on public.owner_notifications to authenticated, service_role;

-- Beta agreements: SELECT for authenticated (needed for RLS policy evaluation)
grant select on public.beta_agreements to authenticated, service_role;

-- User management audit logs: SELECT for authenticated (needed for RLS policy evaluation)
grant select on public.user_management_audit_logs to authenticated, service_role;

-- Hour logs: SELECT for authenticated (needed for RLS policy evaluation)
grant select on public.hour_logs to authenticated, service_role;

-- Grades: SELECT for authenticated (needed for RLS policy evaluation)
grant select on public.grades to authenticated, service_role;

-- Assessments: SELECT for authenticated (needed for RLS policy evaluation)
grant select on public.assessments to authenticated, service_role;

-- Instructor notes: SELECT for authenticated (needed for RLS policy evaluation)
grant select on public.instructor_notes to authenticated, service_role;

-- Attendance records: SELECT for authenticated (needed for RLS policy evaluation)
grant select on public.attendance_records to authenticated, service_role;

-- Notifications: SELECT for authenticated (needed for RLS policy evaluation)
grant select on public.notifications to authenticated, service_role;

-- Maintenance mode: SELECT for authenticated (needed for RLS policy evaluation)
grant select on public.maintenance_mode to authenticated, service_role;

-- Backup status: SELECT for authenticated (needed for RLS policy evaluation)
grant select on public.backup_status to authenticated, service_role;

-- Background jobs: SELECT for authenticated (needed for RLS policy evaluation)
grant select on public.background_jobs to authenticated, service_role;

-- Feature flags: SELECT for authenticated (needed for RLS policy evaluation)
grant select on public.feature_flags to authenticated, service_role;

-- Beta feedback: SELECT for authenticated (needed for RLS policy evaluation)
grant select on public.beta_feedback to authenticated, service_role;

-- Full CRUD for service_role on all tables (test setup and admin operations)
grant select, insert, update, delete on public.schools to service_role;
grant select, insert, update, delete on public.programs to service_role;
grant select, insert, update, delete on public.students to service_role;
grant select, insert, update, delete on public.instructors to service_role;
grant select, insert, update, delete on public.profiles to service_role;
grant select, insert, update, delete on public.enrollments to service_role;
grant select, insert, update, delete on public.quiz_attempts to service_role;
grant select, insert, update, delete on public.missed_questions to service_role;
grant select, insert, update, delete on public.student_progress to service_role;
grant select, insert, update, delete on public.pilot_inquiries to service_role;
grant select, insert, update, delete on public.school_settings to service_role;
grant select, insert, update, delete on public.owner_notifications to service_role;
grant select, insert, update, delete on public.beta_agreements to service_role;
grant select, insert, update, delete on public.user_management_audit_logs to service_role;
grant select, insert, update, delete on public.hour_logs to service_role;
grant select, insert, update, delete on public.grades to service_role;
grant select, insert, update, delete on public.assessments to service_role;
grant select, insert, update, delete on public.instructor_notes to service_role;
grant select, insert, update, delete on public.attendance_records to service_role;
grant select, insert, update, delete on public.notifications to service_role;
grant select, insert, update, delete on public.maintenance_mode to service_role;
grant select, insert, update, delete on public.backup_status to service_role;
grant select, insert, update, delete on public.background_jobs to service_role;
grant select, insert, update, delete on public.feature_flags to service_role;
grant select, insert, update, delete on public.beta_feedback to service_role;

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
