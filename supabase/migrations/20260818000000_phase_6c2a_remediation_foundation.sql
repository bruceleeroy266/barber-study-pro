-- ============================================================================
-- Migration: 20260818000000_phase_6c2a_remediation_foundation
-- Phase 6C-2a — Foundation Persistence Implementation
-- 
-- Implements:
--   - remediation_cycles
--   - remediation_cycle_events (immutable audit ledger)
--   - remediation_assignments
--   - Required constraints, indexes, RLS, and relationships
--
-- Explicitly excluded (per Phase 6C-2a scope):
--   - reassessment_question_history (deferred)
--   - instructor_escalations (deferred)
--   - sustained_performance_resets (deferred)
--   - quiz_attempts modifications (deferred)
--   - Remediation UI (deferred)
-- ============================================================================

-- Ensure pgcrypto is available for gen_random_uuid()
create extension if not exists "pgcrypto";

-- ============================================================================
-- 1. REMEDIATION_CYCLES TABLE
-- ============================================================================
-- Tracks the lifecycle of a single remediation cycle for a concept.
-- Chapter-agnostic design: uses chapter_id/concept_id as text, not FK to
-- chapter-specific tables.

create table if not exists public.remediation_cycles (
  id uuid primary key default gen_random_uuid(),
  
  -- Identity
  user_id uuid not null references auth.users(id) on delete cascade,
  concept_id text not null, -- e.g., 'C-2-01' — chapter-agnostic
  chapter_id text not null, -- e.g., 'ch-2' — denormalized for query performance
  
  -- Cycle sequencing (per rolling 30-day window)
  cycle_number integer not null,
  
  -- Detection context (snapshot at cycle start)
  detection_state text not null, -- 'emerging_weakness', 'repeated_weakness'
  detection_confidence text not null, -- 'low', 'medium', 'high'
  detection_evidence jsonb not null, -- Full ConceptEvidence from Phase 6B-3
  
  -- Cycle state machine
  status text not null default 'targeted',
  
  -- Timestamps
  targeted_at timestamptz not null default now(),
  review_started_at timestamptz,
  review_completed_at timestamptz,
  reassessment_started_at timestamptz,
  reassessment_completed_at timestamptz,
  evaluated_at timestamptz,
  
  -- Outcome
  outcome text, -- 'successful', 'unsuccessful', 'pending'
  post_remediation_state text, -- Detection state after reassessment
  
  -- Metadata
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  
  -- Constraints
  constraint valid_cycle_number check (cycle_number between 1 and 3),
  constraint valid_status check (status in (
    'targeted', 'in_review', 'review_completed', 'reassessed', 'evaluated'
  )),
  constraint valid_outcome check (
    outcome in ('successful', 'unsuccessful', 'pending') or outcome is null
  ),
  constraint valid_detection_state check (
    detection_state in ('emerging_weakness', 'repeated_weakness')
  ),
  constraint valid_detection_confidence check (
    detection_confidence in ('low', 'medium', 'high')
  )
);

-- Indexes
create index if not exists idx_remediation_cycles_user_concept 
  on public.remediation_cycles(user_id, concept_id);
create index if not exists idx_remediation_cycles_user_chapter 
  on public.remediation_cycles(user_id, chapter_id);
create index if not exists idx_remediation_cycles_status 
  on public.remediation_cycles(status) where status != 'evaluated';
create index if not exists idx_remediation_cycles_targeted_at 
  on public.remediation_cycles(targeted_at desc);

-- Unique constraint: one active cycle per user/concept
create unique index if not exists idx_remediation_cycles_active_unique 
  on public.remediation_cycles(user_id, concept_id) 
  where status not in ('evaluated');

-- ============================================================================
-- 2. REMEDIATION_CYCLE_EVENTS TABLE (Immutable Audit Ledger)
-- ============================================================================
-- Immutable audit log for all cycle-related events.
-- Events are append-only; no UPDATE or DELETE allowed.

create table if not exists public.remediation_cycle_events (
  id uuid primary key default gen_random_uuid(),
  
  -- Reference
  cycle_id uuid not null references public.remediation_cycles(id) on delete cascade,
  
  -- Event classification
  event_type text not null,
  
  -- Event payload
  event_data jsonb not null default '{}',
  
  -- Timestamp
  created_at timestamptz not null default now(),
  
  -- Constraints
  constraint valid_event_type check (event_type in (
    'targeted', 'review_started', 'content_viewed', 'flashcard_reviewed',
    'review_completed', 'reassessment_started', 'reassessment_completed',
    'evaluated', 'escalated', 'reset'
  ))
);

-- Indexes
create index if not exists idx_remediation_cycle_events_cycle 
  on public.remediation_cycle_events(cycle_id);
create index if not exists idx_remediation_cycle_events_type 
  on public.remediation_cycle_events(event_type);
create index if not exists idx_remediation_cycle_events_created 
  on public.remediation_cycle_events(created_at desc);

-- ============================================================================
-- 3. REMEDIATION_ASSIGNMENTS TABLE
-- ============================================================================
-- Tracks targeted content and flashcard assignments for a cycle.

create table if not exists public.remediation_assignments (
  id uuid primary key default gen_random_uuid(),
  
  -- Reference
  cycle_id uuid not null references public.remediation_cycles(id) on delete cascade,
  
  -- Assignment type
  assignment_type text not null, -- 'content_block', 'flashcard'
  
  -- Asset identification
  asset_id text not null, -- content_block_id or flashcard_id
  
  -- Prioritization
  priority integer not null default 1, -- 1 = highest
  is_primary boolean not null default true, -- primary vs secondary mapping
  
  -- Completion tracking
  status text not null default 'assigned',
  started_at timestamptz,
  completed_at timestamptz,
  
  -- Metadata
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  
  -- Constraints
  constraint valid_assignment_type check (
    assignment_type in ('content_block', 'flashcard')
  ),
  constraint valid_assignment_status check (
    status in ('assigned', 'started', 'completed')
  )
);

-- Indexes
create index if not exists idx_remediation_assignments_cycle 
  on public.remediation_assignments(cycle_id);
create index if not exists idx_remediation_assignments_status 
  on public.remediation_assignments(status) where status != 'completed';

-- Unique constraint: one assignment per asset per cycle
create unique index if not exists idx_remediation_assignments_unique 
  on public.remediation_assignments(cycle_id, assignment_type, asset_id);

-- ============================================================================
-- 4. IMMUTABILITY ENFORCEMENT FOR REMEDIATION_CYCLE_EVENTS
-- ============================================================================
-- Prevent UPDATE and DELETE on remediation_cycle_events to maintain
-- the immutable audit ledger design.

-- Function to prevent modification of cycle events
create or replace function public.prevent_cycle_event_modification()
returns trigger as $$
begin
  raise exception 'remediation_cycle_events is an immutable audit ledger. UPDATE and DELETE operations are not allowed.';
end;
$$ language plpgsql;

-- Trigger to enforce immutability
create trigger enforce_cycle_events_immutability
  before update or delete on public.remediation_cycle_events
  for each row execute function public.prevent_cycle_event_modification();

-- ============================================================================
-- 5. UPDATED_AT TRIGGER FOR REMEDIATION_CYCLES
-- ============================================================================
-- Reuse existing update_updated_at_column() function if available,
-- otherwise create it.

create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply updated_at trigger to remediation_cycles
create trigger update_remediation_cycles_updated_at
  before update on public.remediation_cycles
  for each row execute function public.update_updated_at_column();

-- Apply updated_at trigger to remediation_assignments
create trigger update_remediation_assignments_updated_at
  before update on public.remediation_assignments
  for each row execute function public.update_updated_at_column();

-- ============================================================================
-- 6. ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on all new tables
alter table public.remediation_cycles enable row level security;
alter table public.remediation_cycle_events enable row level security;
alter table public.remediation_assignments enable row level security;

-- ============================================================================
-- REMEDIATION_CYCLES RLS POLICIES
-- ============================================================================

-- Students: full CRUD on own cycles
create policy remediation_cycles_select on public.remediation_cycles
  for select to authenticated
  using (auth.uid() = user_id);

create policy remediation_cycles_insert on public.remediation_cycles
  for insert to authenticated
  with check (auth.uid() = user_id);

create policy remediation_cycles_update on public.remediation_cycles
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- School staff: read all cycles for students in same school
create policy remediation_cycles_staff_select on public.remediation_cycles
  for select to authenticated
  using (
    public.is_school_staff(public.current_user_school_id())
    and public.current_user_school_id() = public.user_school_id(user_id)
  );

-- Platform super admin: full access
create policy remediation_cycles_super_admin on public.remediation_cycles
  for all to authenticated
  using (public.is_platform_super_admin())
  with check (public.is_platform_super_admin());

-- ============================================================================
-- REMEDIATION_CYCLE_EVENTS RLS POLICIES
-- ============================================================================

-- Students: read own cycle events (via cycle join)
create policy remediation_cycle_events_select on public.remediation_cycle_events
  for select to authenticated
  using (
    exists (
      select 1 from public.remediation_cycles rc
      where rc.id = cycle_id and rc.user_id = auth.uid()
    )
  );

-- Students: insert events for own cycles
create policy remediation_cycle_events_insert on public.remediation_cycle_events
  for insert to authenticated
  with check (
    exists (
      select 1 from public.remediation_cycles rc
      where rc.id = cycle_id and rc.user_id = auth.uid()
    )
  );

-- School staff: read events for students in same school
create policy remediation_cycle_events_staff_select on public.remediation_cycle_events
  for select to authenticated
  using (
    exists (
      select 1 from public.remediation_cycles rc
      where rc.id = cycle_id
        and public.is_school_staff(public.current_user_school_id())
        and public.current_user_school_id() = public.user_school_id(rc.user_id)
    )
  );

-- Platform super admin: full access
create policy remediation_cycle_events_super_admin on public.remediation_cycle_events
  for all to authenticated
  using (public.is_platform_super_admin())
  with check (public.is_platform_super_admin());

-- ============================================================================
-- REMEDIATION_ASSIGNMENTS RLS POLICIES
-- ============================================================================

-- Students: full CRUD on own assignments (via cycle join)
create policy remediation_assignments_select on public.remediation_assignments
  for select to authenticated
  using (
    exists (
      select 1 from public.remediation_cycles rc
      where rc.id = cycle_id and rc.user_id = auth.uid()
    )
  );

create policy remediation_assignments_insert on public.remediation_assignments
  for insert to authenticated
  with check (
    exists (
      select 1 from public.remediation_cycles rc
      where rc.id = cycle_id and rc.user_id = auth.uid()
    )
  );

create policy remediation_assignments_update on public.remediation_assignments
  for update to authenticated
  using (
    exists (
      select 1 from public.remediation_cycles rc
      where rc.id = cycle_id and rc.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.remediation_cycles rc
      where rc.id = cycle_id and rc.user_id = auth.uid()
    )
  );

-- School staff: read assignments for students in same school
create policy remediation_assignments_staff_select on public.remediation_assignments
  for select to authenticated
  using (
    exists (
      select 1 from public.remediation_cycles rc
      where rc.id = cycle_id
        and public.is_school_staff(public.current_user_school_id())
        and public.current_user_school_id() = public.user_school_id(rc.user_id)
    )
  );

-- Platform super admin: full access
create policy remediation_assignments_super_admin on public.remediation_assignments
  for all to authenticated
  using (public.is_platform_super_admin())
  with check (public.is_platform_super_admin());

-- ============================================================================
-- 7. COMMENTS FOR DOCUMENTATION
-- ============================================================================

comment on table public.remediation_cycles is 
  'Phase 6C-2a: Tracks remediation cycle lifecycle for concept-level gap intervention. Chapter-agnostic design.';

comment on table public.remediation_cycle_events is 
  'Phase 6C-2a: Immutable audit ledger for all remediation cycle events. Append-only; no UPDATE or DELETE allowed.';

comment on table public.remediation_assignments is 
  'Phase 6C-2a: Tracks targeted content and flashcard assignments within a remediation cycle.';

comment on column public.remediation_cycles.cycle_number is 
  'Cycle number within rolling 30-day window (1-3). Enforced by CHECK constraint.';

comment on column public.remediation_cycles.detection_evidence is 
  'JSONB snapshot of ConceptEvidence from Phase 6B-3 detection engine at cycle start.';

comment on column public.remediation_cycle_events.event_type is 
  'Event type: targeted, review_started, content_viewed, flashcard_reviewed, review_completed, reassessment_started, reassessment_completed, evaluated, escalated, reset.';

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
