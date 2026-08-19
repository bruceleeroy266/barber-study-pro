-- ============================================================================
-- Migration: 20260818000001_phase_6c2b_reassessment_integrity
-- Phase 6C-2b — Reassessment Integrity Implementation
--
-- Implements:
--   - reassessment_question_history (tracks all question attempts per concept)
--   - concept_question_pool_exhaustion (explicit pool exhaustion state)
--   - quiz_attempts modifications (reassessment context fields)
--   - Required constraints, indexes, RLS, and concurrency protections
--
-- Binding Rule: A student must never receive a previously attempted question
-- as valid reassessment evidence for that concept.
--
-- Pool Exhaustion Rule: Do NOT silently reuse an old question.
-- Persist an explicit pool-exhaustion state/flag.
-- ============================================================================

-- Ensure pgcrypto is available for gen_random_uuid()
create extension if not exists "pgcrypto";

-- ============================================================================
-- 1. REASSESSMENT_QUESTION_HISTORY TABLE
-- ============================================================================
-- Tracks which questions a student has attempted for each concept.
-- This is the authoritative source for preventing question reuse in reassessment.
-- Chapter-agnostic: uses text for concept_id, not FK to chapter-specific tables.

create table if not exists public.reassessment_question_history (
  id uuid primary key default gen_random_uuid(),

  -- Identity
  user_id uuid not null references auth.users(id) on delete cascade,
  concept_id text not null, -- e.g., 'C-2-01' — chapter-agnostic
  question_id text not null, -- e.g., 'qq-2-001'

  -- Attempt context
  quiz_attempt_id uuid not null references public.quiz_attempts(id) on delete cascade,
  cycle_id uuid references public.remediation_cycles(id) on delete set null, -- NULL for initial quiz, set for reassessment

  -- Result
  is_correct boolean not null,

  -- Timestamp
  attempted_at timestamptz not null default now(),

  -- Constraints
  constraint unique_user_concept_question unique (user_id, concept_id, question_id)
);

-- Indexes for efficient exclusion queries
create index if not exists idx_reassessment_question_history_user_concept
  on public.reassessment_question_history(user_id, concept_id);
create index if not exists idx_reassessment_question_history_cycle
  on public.reassessment_question_history(cycle_id) where cycle_id is not null;
create index if not exists idx_reassessment_question_history_quiz_attempt
  on public.reassessment_question_history(quiz_attempt_id);
create index if not exists idx_reassessment_question_history_attempted_at
  on public.reassessment_question_history(attempted_at desc);

-- ============================================================================
-- 2. CONCEPT_QUESTION_POOL_EXHAUSTION TABLE
-- ============================================================================
-- Explicit representation of pool exhaustion state.
-- When no eligible unseen reassessment question remains, this table preserves
-- the evidence explaining why the pool was exhausted.

create table if not exists public.concept_question_pool_exhaustion (
  id uuid primary key default gen_random_uuid(),

  -- Identity
  user_id uuid not null references auth.users(id) on delete cascade,
  concept_id text not null, -- e.g., 'C-2-01' — chapter-agnostic
  chapter_id text not null, -- e.g., 'ch-2' — denormalized for query performance

  -- Exhaustion context
  cycle_id uuid not null references public.remediation_cycles(id) on delete cascade,

  -- Pool state at exhaustion
  total_questions_in_pool integer not null, -- Total questions mapped to this concept
  attempted_question_count integer not null, -- How many the student has already attempted
  attempted_question_ids jsonb not null, -- Array of question_ids already attempted

  -- Exhaustion metadata
  exhausted_at timestamptz not null default now(),

  -- Resolution tracking (for future use when new questions are added)
  resolved_at timestamptz,
  resolved_by uuid references auth.users(id) on delete set null,
  resolution_notes text,

  -- Metadata
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Constraints
  constraint valid_pool_counts check (
    total_questions_in_pool >= 0
    and attempted_question_count >= 0
    and attempted_question_count <= total_questions_in_pool
  )
);

-- Indexes
create index if not exists idx_concept_question_pool_exhaustion_user_concept
  on public.concept_question_pool_exhaustion(user_id, concept_id);
create index if not exists idx_concept_question_pool_exhaustion_cycle
  on public.concept_question_pool_exhaustion(cycle_id);
create index if not exists idx_concept_question_pool_exhaustion_unresolved
  on public.concept_question_pool_exhaustion(user_id, concept_id) where resolved_at is null;

-- Unique constraint: one active exhaustion record per user/concept/cycle
create unique index if not exists idx_concept_question_pool_exhaustion_active_unique
  on public.concept_question_pool_exhaustion(user_id, concept_id, cycle_id)
  where resolved_at is null;

-- ============================================================================
-- 3. QUIZ_ATTEMPTS MODIFICATIONS
-- ============================================================================
-- Add reassessment context fields to quiz_attempts.
-- These fields link a quiz attempt to a remediation cycle and identify it
-- as a reassessment (not an initial chapter quiz).

alter table public.quiz_attempts
add column if not exists is_reassessment boolean not null default false,
add column if not exists remediation_cycle_id uuid references public.remediation_cycles(id) on delete set null,
add column if not exists target_concept_id text; -- The specific concept being reassessed

-- Index for reassessment queries
create index if not exists idx_quiz_attempts_reassessment
  on public.quiz_attempts(is_reassessment) where is_reassessment = true;
create index if not exists idx_quiz_attempts_cycle
  on public.quiz_attempts(remediation_cycle_id) where remediation_cycle_id is not null;
create index if not exists idx_quiz_attempts_target_concept
  on public.quiz_attempts(target_concept_id) where target_concept_id is not null;

-- ============================================================================
-- 4. CONCURRENCY PROTECTION: PREVENT DUPLICATE QUESTION ASSIGNMENT
-- ============================================================================
-- Function to check if a question has been attempted by a user for a concept.
-- Used by application code before assigning reassessment questions.
-- Returns true if the question has been attempted (should be excluded).

create or replace function public.has_attempted_question(
  p_user_id uuid,
  p_concept_id text,
  p_question_id text
)
returns boolean as $$
begin
  return exists (
    select 1 from public.reassessment_question_history
    where user_id = p_user_id
      and concept_id = p_concept_id
      and question_id = p_question_id
  );
end;
$$ language plpgsql security definer stable;

-- Function to get all attempted question IDs for a user/concept.
-- Used to build exclusion lists for reassessment question selection.

create or replace function public.get_attempted_question_ids(
  p_user_id uuid,
  p_concept_id text
)
returns text[] as $$
begin
  return array(
    select question_id from public.reassessment_question_history
    where user_id = p_user_id
      and concept_id = p_concept_id
  );
end;
$$ language plpgsql security definer stable;

-- Function to record a question attempt (with concurrency protection).
-- Uses INSERT ... ON CONFLICT to handle race conditions gracefully.
-- Returns the inserted ID or NULL if already exists (concurrent insert).

create or replace function public.record_question_attempt(
  p_user_id uuid,
  p_concept_id text,
  p_question_id text,
  p_quiz_attempt_id uuid,
  p_cycle_id uuid,
  p_is_correct boolean
)
returns uuid as $$
declare
  v_id uuid;
begin
  insert into public.reassessment_question_history (
    user_id, concept_id, question_id, quiz_attempt_id, cycle_id, is_correct
  )
  values (
    p_user_id, p_concept_id, p_question_id, p_quiz_attempt_id, p_cycle_id, p_is_correct
  )
  on conflict (user_id, concept_id, question_id) do nothing
  returning id into v_id;

  return v_id; -- NULL if conflict (already attempted)
end;
$$ language plpgsql security definer;

-- Function to check and record pool exhaustion atomically.
-- Returns the exhaustion record ID if pool is exhausted, NULL otherwise.

create or replace function public.check_and_record_pool_exhaustion(
  p_user_id uuid,
  p_concept_id text,
  p_chapter_id text,
  p_cycle_id uuid,
  p_total_questions_in_pool integer
)
returns uuid as $$
declare
  v_attempted_count integer;
  v_attempted_ids jsonb;
  v_exhaustion_id uuid;
begin
  -- Get attempted question count and IDs
  select count(*), coalesce(jsonb_agg(question_id), '[]'::jsonb)
  into v_attempted_count, v_attempted_ids
  from public.reassessment_question_history
  where user_id = p_user_id and concept_id = p_concept_id;

  -- Check if pool is exhausted
  if v_attempted_count >= p_total_questions_in_pool then
    -- Record exhaustion (idempotent via unique constraint)
    insert into public.concept_question_pool_exhaustion (
      user_id, concept_id, chapter_id, cycle_id,
      total_questions_in_pool, attempted_question_count, attempted_question_ids
    )
    values (
      p_user_id, p_concept_id, p_chapter_id, p_cycle_id,
      p_total_questions_in_pool, v_attempted_count, v_attempted_ids
    )
    on conflict (user_id, concept_id, cycle_id) where resolved_at is null
    do update set
      attempted_question_count = excluded.attempted_question_count,
      attempted_question_ids = excluded.attempted_question_ids,
      updated_at = now()
    returning id into v_exhaustion_id;

    return v_exhaustion_id;
  end if;

  return NULL; -- Pool not exhausted
end;
$$ language plpgsql security definer;

-- ============================================================================
-- 5. IMMUTABILITY ENFORCEMENT FOR REASSESSMENT_QUESTION_HISTORY
-- ============================================================================
-- Prevent UPDATE and DELETE on reassessment_question_history to maintain
-- the integrity of the attempted-question audit trail.

create or replace function public.prevent_question_history_modification()
returns trigger as $$
begin
  raise exception 'reassessment_question_history is an immutable audit trail. UPDATE and DELETE operations are not allowed.';
end;
$$ language plpgsql;

create trigger enforce_question_history_immutability
  before update or delete on public.reassessment_question_history
  for each row execute function public.prevent_question_history_modification();

-- ============================================================================
-- 6. UPDATED_AT TRIGGER FOR CONCEPT_QUESTION_POOL_EXHAUSTION
-- ============================================================================

create trigger update_concept_question_pool_exhaustion_updated_at
  before update on public.concept_question_pool_exhaustion
  for each row execute function public.update_updated_at_column();

-- ============================================================================
-- 7. ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on all new tables
alter table public.reassessment_question_history enable row level security;
alter table public.concept_question_pool_exhaustion enable row level security;

-- ============================================================================
-- REASSESSMENT_QUESTION_HISTORY RLS POLICIES
-- ============================================================================

-- Students: read own history
create policy reassessment_question_history_select on public.reassessment_question_history
  for select to authenticated
  using (auth.uid() = user_id);

-- Students: insert own history (via application)
create policy reassessment_question_history_insert on public.reassessment_question_history
  for insert to authenticated
  with check (auth.uid() = user_id);

-- School staff: read history for students in same school
create policy reassessment_question_history_staff_select on public.reassessment_question_history
  for select to authenticated
  using (
    public.is_school_staff(public.current_user_school_id())
    and public.current_user_school_id() = public.user_school_id(user_id)
  );

-- Platform super admin: full access
create policy reassessment_question_history_super_admin on public.reassessment_question_history
  for all to authenticated
  using (public.is_platform_super_admin())
  with check (public.is_platform_super_admin());

-- ============================================================================
-- CONCEPT_QUESTION_POOL_EXHAUSTION RLS POLICIES
-- ============================================================================

-- Students: read own exhaustion records
create policy concept_question_pool_exhaustion_select on public.concept_question_pool_exhaustion
  for select to authenticated
  using (auth.uid() = user_id);

-- Students: insert own exhaustion records (via application)
create policy concept_question_pool_exhaustion_insert on public.concept_question_pool_exhaustion
  for insert to authenticated
  with check (auth.uid() = user_id);

-- School staff: read exhaustion records for students in same school
create policy concept_question_pool_exhaustion_staff_select on public.concept_question_pool_exhaustion
  for select to authenticated
  using (
    public.is_school_staff(public.current_user_school_id())
    and public.current_user_school_id() = public.user_school_id(user_id)
  );

-- Platform super admin: full access
create policy concept_question_pool_exhaustion_super_admin on public.concept_question_pool_exhaustion
  for all to authenticated
  using (public.is_platform_super_admin())
  with check (public.is_platform_super_admin());

-- ============================================================================
-- 8. COMMENTS FOR DOCUMENTATION
-- ============================================================================

comment on table public.reassessment_question_history is
  'Phase 6C-2b: Tracks all question attempts per user/concept. Authoritative source for preventing question reuse in reassessment. Immutable audit trail.';

comment on table public.concept_question_pool_exhaustion is
  'Phase 6C-2b: Explicit representation of pool exhaustion state. Preserves evidence when no eligible unseen reassessment questions remain.';

comment on column public.reassessment_question_history.cycle_id is
  'NULL for initial chapter quiz attempts; set to remediation_cycles.id for reassessment attempts.';

comment on column public.concept_question_pool_exhaustion.attempted_question_ids is
  'JSONB array of question_ids the student has already attempted for this concept.';

comment on column public.quiz_attempts.is_reassessment is
  'TRUE if this quiz attempt is a reassessment for a remediation cycle; FALSE for initial chapter quizzes.';

comment on column public.quiz_attempts.remediation_cycle_id is
  'References the remediation cycle this reassessment belongs to. NULL for initial chapter quizzes.';

comment on column public.quiz_attempts.target_concept_id is
  'The specific concept being reassessed. NULL for initial chapter quizzes.';

comment on function public.has_attempted_question is
  'Returns TRUE if the user has previously attempted the question for the concept in reassessment_question_history only. Does NOT include historical normal-quiz evidence from quiz_attempts.answers_json. Application code must use the historical exclusion engine for complete never-reuse evidence.';

comment on function public.get_attempted_question_ids is
  'Returns array of question_ids the user has attempted for the concept in reassessment_question_history only. Does NOT include historical normal-quiz evidence from quiz_attempts.answers_json. Application code must use the historical exclusion engine for complete never-reuse evidence.';

comment on function public.record_question_attempt is
  'Records a question attempt with concurrency protection. Returns NULL if already attempted (concurrent insert).';

comment on function public.check_and_record_pool_exhaustion is
  'Atomically checks if pool is exhausted and records the exhaustion state. Returns exhaustion record ID or NULL.';

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
