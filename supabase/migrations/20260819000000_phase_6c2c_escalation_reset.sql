-- ============================================================================
-- Migration: 20260819000000_phase_6c2c_escalation_reset
-- Phase 6C-2c — Instructor Escalation & Sustained-Performance Reset
--
-- Implements:
--   - instructor_escalations
--   - instructor_escalation_events (immutable audit ledger)
--   - sustained_performance_tracking
--   - sustained_performance_resets (immutable)
--   - remediation_cycles modifications (reset tracking)
--   - Required constraints, indexes, RLS, and concurrency protections
--
-- Binding Rules (from Phase 6C-1 §3.4.1 and Phase 6C-2c Architecture Review):
--   - Escalation after 2 unsuccessful remediation cycles in rolling 30 days
--   - Sustained-performance reset requires 30 consecutive days in CPW + follow-up evidence
--   - Instructor-owned escalations are protected from automation
--   - All audit events are immutable
-- ============================================================================

-- Ensure pgcrypto is available for gen_random_uuid()
create extension if not exists "pgcrypto";

-- ============================================================================
-- 1. INSTRUCTOR_ESCALATIONS TABLE
-- ============================================================================
-- Tracks instructor escalations for concepts requiring human intervention.
-- Chapter-agnostic design: uses chapter_id/concept_id as text.

create table if not exists public.instructor_escalations (
  id uuid primary key default gen_random_uuid(),

  -- Identity (chapter-agnostic)
  user_id uuid not null references auth.users(id) on delete cascade,
  concept_id text not null, -- Concept identifier (chapter-agnostic text)
  chapter_id text not null, -- Chapter identifier (denormalized for query performance)
  school_id uuid not null references public.schools(id) on delete cascade,

  -- Trigger context
  triggering_cycle_ids uuid[] not null, -- Array of remediation_cycle IDs
  unsuccessful_cycle_count integer not null,

  -- Detection evidence snapshot at trigger time
  detection_evidence jsonb not null, -- ConceptEvidence from Phase 6B-3

  -- State machine
  status text not null default 'pending',

  -- Ownership (NULL = not owned by instructor)
  acknowledged_by uuid references auth.users(id) on delete set null,
  acknowledged_at timestamptz,

  -- Instructor actions
  instructor_notes text,
  intervention_plan text,
  resolution_summary text,
  follow_up_required boolean,

  -- Auto-clear tracking (for sustained-performance reset)
  auto_cleared_at timestamptz,
  auto_cleared_by_reset_id uuid,

  -- Expiration
  expired_at timestamptz,

  -- Timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Constraints
  constraint valid_status check (status in (
    'pending', 'acknowledged', 'in_progress', 'resolved', 'auto_cleared', 'expired'
  )),
  constraint valid_unsuccessful_count check (unsuccessful_cycle_count >= 2),
  constraint acknowledged_requires_ownership check (
    (status = 'acknowledged' and acknowledged_by is not null and acknowledged_at is not null)
    or (status != 'acknowledged')
  ),
  constraint auto_cleared_requires_null_owner check (
    (status = 'auto_cleared' and acknowledged_by is null)
    or (status != 'auto_cleared')
  )
);

-- Indexes
create index if not exists idx_instructor_escalations_user_concept
  on public.instructor_escalations(user_id, concept_id);
create index if not exists idx_instructor_escalations_school_status
  on public.instructor_escalations(school_id, status) where status in ('pending', 'acknowledged', 'in_progress');
create index if not exists idx_instructor_escalations_acknowledged_by
  on public.instructor_escalations(acknowledged_by) where acknowledged_by is not null;
create index if not exists idx_instructor_escalations_created_at
  on public.instructor_escalations(created_at desc);

-- Unique active escalation per user/concept
create unique index if not exists idx_instructor_escalations_active_unique
  on public.instructor_escalations(user_id, concept_id)
  where status in ('pending', 'acknowledged', 'in_progress');

-- ============================================================================
-- 2. INSTRUCTOR_ESCALATION_EVENTS TABLE (Immutable Audit Ledger)
-- ============================================================================
-- Immutable audit log for all escalation-related events.
-- Events are append-only; no UPDATE or DELETE allowed.

create table if not exists public.instructor_escalation_events (
  id uuid primary key default gen_random_uuid(),

  -- Reference
  escalation_id uuid not null references public.instructor_escalations(id) on delete cascade,

  -- Event classification
  event_type text not null,

  -- Event payload
  event_data jsonb not null default '{}',

  -- Actor (NULL for system events)
  actor_id uuid references auth.users(id) on delete set null,

  -- Timestamp
  created_at timestamptz not null default now(),

  -- Constraints
  constraint valid_event_type check (event_type in (
    'created', 'acknowledged', 'in_progress', 'resolved',
    'auto_cleared', 'auto_clear_aborted', 'expired', 'notes_updated'
  ))
);

-- Indexes
create index if not exists idx_instructor_escalation_events_escalation
  on public.instructor_escalation_events(escalation_id);
create index if not exists idx_instructor_escalation_events_type
  on public.instructor_escalation_events(event_type);
create index if not exists idx_instructor_escalation_events_created
  on public.instructor_escalation_events(created_at desc);

-- ============================================================================
-- 3. SUSTAINED_PERFORMANCE_TRACKING TABLE
-- ============================================================================
-- Tracks currently_performing_well continuity for deterministic reset eligibility.

create table if not exists public.sustained_performance_tracking (
  id uuid primary key default gen_random_uuid(),

  -- Identity (chapter-agnostic)
  user_id uuid not null references auth.users(id) on delete cascade,
  concept_id text not null,
  chapter_id text not null,

  -- Tracking period
  entered_cpw_at timestamptz not null, -- When concept entered currently_performing_well
  last_verified_at timestamptz not null, -- Last detection run confirming CPW
  continuity_broken_at timestamptz, -- When concept left CPW (NULL = still in CPW)

  -- Evidence tracking
  follow_up_evidence_count integer not null default 0, -- Concept-mapped assessments during period
  follow_up_evidence_ids uuid[] default '{}', -- quiz_attempt IDs providing evidence

  -- State
  is_active boolean not null default true, -- false after reset or continuity break

  -- Reset linkage (NULL until reset)
  reset_at timestamptz,
  reset_id uuid,

  -- Timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Constraints
  constraint valid_follow_up_count check (follow_up_evidence_count >= 0),
  constraint continuity_broken_after_entry check (
    continuity_broken_at is null or continuity_broken_at >= entered_cpw_at
  ),
  constraint reset_after_entry check (
    reset_at is null or reset_at >= entered_cpw_at
  )
);

-- Indexes
create index if not exists idx_sustained_performance_tracking_user_concept
  on public.sustained_performance_tracking(user_id, concept_id);
create index if not exists idx_sustained_performance_tracking_active
  on public.sustained_performance_tracking(is_active) where is_active = true;
create index if not exists idx_sustained_performance_tracking_eligibility
  on public.sustained_performance_tracking(entered_cpw_at)
  where is_active = true and continuity_broken_at is null;

-- One active tracking period per user/concept
create unique index if not exists idx_sustained_performance_tracking_active_unique
  on public.sustained_performance_tracking(user_id, concept_id)
  where is_active = true;

-- ============================================================================
-- 4. SUSTAINED_PERFORMANCE_RESETS TABLE (Immutable)
-- ============================================================================
-- Immutable record of sustained-performance resets.

create table if not exists public.sustained_performance_resets (
  id uuid primary key default gen_random_uuid(),

  -- Identity
  user_id uuid not null references auth.users(id) on delete cascade,
  concept_id text not null,
  chapter_id text not null,

  -- Tracking period reference
  tracking_id uuid not null references public.sustained_performance_tracking(id),
  entered_cpw_at timestamptz not null, -- Denormalized for uniqueness

  -- Evidence snapshot
  follow_up_evidence_count integer not null,
  follow_up_evidence_ids uuid[] not null,
  detection_evidence jsonb not null, -- ConceptEvidence at reset time

  -- Before/after state
  previous_cycle_count integer not null,
  previous_unsuccessful_count integer not null,
  previous_lockout_active boolean not null,

  -- Escalation disposition
  escalation_auto_cleared boolean not null default false,
  escalation_id uuid references public.instructor_escalations(id),

  -- Execution metadata
  executed_at timestamptz not null default now(),
  executed_by uuid references auth.users(id), -- NULL for system

  -- Constraints
  constraint valid_previous_counts check (
    previous_cycle_count >= 0 and previous_unsuccessful_count >= 0
  )
);

-- Idempotency: one reset per tracking period
create unique index if not exists idx_sustained_performance_resets_tracking_unique
  on public.sustained_performance_resets(tracking_id);

-- Also enforce uniqueness on (user_id, concept_id, entered_cpw_at) for extra safety
create unique index if not exists idx_sustained_performance_resets_period_unique
  on public.sustained_performance_resets(user_id, concept_id, entered_cpw_at);

-- Indexes
create index if not exists idx_sustained_performance_resets_user_concept
  on public.sustained_performance_resets(user_id, concept_id);
create index if not exists idx_sustained_performance_resets_executed_at
  on public.sustained_performance_resets(executed_at desc);

-- Add foreign key constraint for auto_cleared_by_reset_id after sustained_performance_resets exists
alter table public.instructor_escalations
add constraint fk_auto_cleared_by_reset
foreign key (auto_cleared_by_reset_id)
references public.sustained_performance_resets(id);

-- Add foreign key constraint for reset_id after sustained_performance_resets exists
alter table public.sustained_performance_tracking
add constraint fk_reset_id
foreign key (reset_id)
references public.sustained_performance_resets(id);

-- ============================================================================
-- 5. MODIFICATIONS TO EXISTING TABLES
-- ============================================================================

-- remediation_cycles: Add reset tracking
alter table public.remediation_cycles
add column if not exists reset_by_sustained_performance boolean not null default false,
add column if not exists sustained_performance_reset_id uuid references public.sustained_performance_resets(id);

create index if not exists idx_remediation_cycles_reset
  on public.remediation_cycles(reset_by_sustained_performance) where reset_by_sustained_performance = true;

-- ============================================================================
-- 6. IMMUTABILITY ENFORCEMENT
-- ============================================================================

-- Function to prevent modification of escalation events
create or replace function public.prevent_escalation_event_modification()
returns trigger as $$
begin
  raise exception 'instructor_escalation_events is an immutable audit ledger. UPDATE and DELETE operations are not allowed.';
end;
$$ language plpgsql;

-- Trigger to enforce immutability for escalation events
create trigger enforce_escalation_events_immutability
  before update or delete on public.instructor_escalation_events
  for each row execute function public.prevent_escalation_event_modification();

-- Function to prevent modification of sustained performance resets
create or replace function public.prevent_reset_modification()
returns trigger as $$
begin
  raise exception 'sustained_performance_resets is an immutable audit record. UPDATE and DELETE operations are not allowed.';
end;
$$ language plpgsql;

-- Trigger to enforce immutability for resets
create trigger enforce_resets_immutability
  before update or delete on public.sustained_performance_resets
  for each row execute function public.prevent_reset_modification();

-- ============================================================================
-- 7. UPDATED_AT TRIGGERS
-- ============================================================================

-- Apply updated_at trigger to instructor_escalations
create trigger update_instructor_escalations_updated_at
  before update on public.instructor_escalations
  for each row execute function public.update_updated_at_column();

-- Apply updated_at trigger to sustained_performance_tracking
create trigger update_sustained_performance_tracking_updated_at
  before update on public.sustained_performance_tracking
  for each row execute function public.update_updated_at_column();

-- ============================================================================
-- 8. HELPER FUNCTIONS
-- ============================================================================

-- Check if a concept is eligible for sustained-performance reset
create or replace function public.check_sustained_performance_reset_eligibility(
  p_user_id uuid,
  p_concept_id text
)
returns table (
  is_eligible boolean,
  entered_cpw_at timestamptz,
  days_in_cpw integer,
  follow_up_evidence_count integer,
  continuity_broken boolean,
  blocking_reason text
) as $$
begin
  return query
  select
    -- Eligible if: 30+ days, 1+ follow-up evidence, continuity maintained
    (now() - spt.entered_cpw_at >= interval '30 days'
     and spt.follow_up_evidence_count >= 1
     and spt.continuity_broken_at is null) as is_eligible,
    spt.entered_cpw_at,
    extract(day from (now() - spt.entered_cpw_at))::integer as days_in_cpw,
    spt.follow_up_evidence_count,
    (spt.continuity_broken_at is not null) as continuity_broken,
    case
      when spt.continuity_broken_at is not null then 'continuity_broken'
      when now() - spt.entered_cpw_at < interval '30 days' then 'insufficient_days'
      when spt.follow_up_evidence_count < 1 then 'no_follow_up_evidence'
      else null
    end as blocking_reason
  from public.sustained_performance_tracking spt
  where spt.user_id = p_user_id
    and spt.concept_id = p_concept_id
    and spt.is_active = true;
end;
$$ language plpgsql security definer stable;

-- Create instructor escalation (idempotent)
create or replace function public.create_instructor_escalation(
  p_user_id uuid,
  p_concept_id text,
  p_chapter_id text,
  p_school_id uuid,
  p_triggering_cycle_ids uuid[],
  p_unsuccessful_cycle_count integer,
  p_detection_evidence jsonb
)
returns uuid as $$
declare
  v_escalation_id uuid;
begin
  -- Attempt to insert new escalation
  insert into public.instructor_escalations (
    user_id, concept_id, chapter_id, school_id,
    triggering_cycle_ids, unsuccessful_cycle_count, detection_evidence
  )
  values (
    p_user_id, p_concept_id, p_chapter_id, p_school_id,
    p_triggering_cycle_ids, p_unsuccessful_cycle_count, p_detection_evidence
  )
  on conflict (user_id, concept_id) where status in ('pending', 'acknowledged', 'in_progress')
  do nothing
  returning id into v_escalation_id;

  -- If conflict occurred, return existing escalation ID
  if v_escalation_id is null then
    select id into v_escalation_id
    from public.instructor_escalations
    where user_id = p_user_id
      and concept_id = p_concept_id
      and status in ('pending', 'acknowledged', 'in_progress');
  end if;

  return v_escalation_id;
end;
$$ language plpgsql security definer;

-- Record detection state transition (called by application layer)
create or replace function public.record_detection_state_transition(
  p_user_id uuid,
  p_concept_id text,
  p_chapter_id text,
  p_new_state text,
  p_evidence jsonb,
  p_quiz_attempt_id uuid default null
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

    -- Record follow-up evidence if quiz attempt provided
    if p_quiz_attempt_id is not null and v_existing_tracking_id is not null then
      update public.sustained_performance_tracking
      set
        follow_up_evidence_count = follow_up_evidence_count + 1,
        follow_up_evidence_ids = array_append(follow_up_evidence_ids, p_quiz_attempt_id)
      where id = v_existing_tracking_id
        and not (p_quiz_attempt_id = any(follow_up_evidence_ids)); -- Prevent duplicates
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

-- Execute sustained-performance reset (idempotent)
create or replace function public.execute_sustained_performance_reset(
  p_user_id uuid,
  p_concept_id text,
  p_executed_by uuid default null
)
returns uuid as $$
declare
  v_tracking_id uuid;
  v_entered_cpw_at timestamptz;
  v_follow_up_count integer;
  v_follow_up_ids uuid[];
  v_detection_evidence jsonb;
  v_previous_cycle_count integer;
  v_previous_unsuccessful_count integer;
  v_previous_lockout_active boolean;
  v_reset_id uuid;
  v_escalation_id uuid;
  v_escalation_auto_cleared boolean := false;
begin
  -- Get active tracking record with lock
  select id, entered_cpw_at, follow_up_evidence_count, follow_up_evidence_ids
  into v_tracking_id, v_entered_cpw_at, v_follow_up_count, v_follow_up_ids
  from public.sustained_performance_tracking
  where user_id = p_user_id
    and concept_id = p_concept_id
    and is_active = true
  for update;

  -- Verify eligibility
  if v_tracking_id is null then
    raise exception 'No active sustained performance tracking found for user % concept %', p_user_id, p_concept_id;
  end if;

  if now() - v_entered_cpw_at < interval '30 days' then
    raise exception 'Insufficient days in CPW: % days required, % elapsed', 30, extract(day from (now() - v_entered_cpw_at));
  end if;

  if v_follow_up_count < 1 then
    raise exception 'No follow-up evidence: at least 1 concept-mapped assessment required';
  end if;

  -- Get detection evidence (placeholder - application layer should provide)
  v_detection_evidence := '{}'::jsonb;

  -- Count previous cycles
  select count(*), count(*) filter (where outcome = 'unsuccessful')
  into v_previous_cycle_count, v_previous_unsuccessful_count
  from public.remediation_cycles
  where user_id = p_user_id
    and concept_id = p_concept_id
    and evaluated_at >= (now() - interval '30 days')
    and reset_by_sustained_performance = false;

  -- Check for active lockout (3 unsuccessful cycles)
  v_previous_lockout_active := (v_previous_unsuccessful_count >= 3);

  -- Insert reset record (idempotent via unique constraint)
  insert into public.sustained_performance_resets (
    user_id, concept_id, chapter_id, tracking_id, entered_cpw_at,
    follow_up_evidence_count, follow_up_evidence_ids, detection_evidence,
    previous_cycle_count, previous_unsuccessful_count, previous_lockout_active,
    executed_by
  )
  select
    p_user_id, p_concept_id, spt.chapter_id, v_tracking_id, v_entered_cpw_at,
    v_follow_up_count, v_follow_up_ids, v_detection_evidence,
    v_previous_cycle_count, v_previous_unsuccessful_count, v_previous_lockout_active,
    p_executed_by
  from public.sustained_performance_tracking spt
  where spt.id = v_tracking_id
  on conflict (tracking_id) do nothing
  returning id into v_reset_id;

  -- If conflict occurred, return existing reset ID
  if v_reset_id is null then
    select id into v_reset_id
    from public.sustained_performance_resets
    where tracking_id = v_tracking_id;
    return v_reset_id;
  end if;

  -- Update remediation cycles
  update public.remediation_cycles
  set
    reset_by_sustained_performance = true,
    sustained_performance_reset_id = v_reset_id
  where user_id = p_user_id
    and concept_id = p_concept_id
    and evaluated_at >= (now() - interval '30 days')
    and reset_by_sustained_performance = false;

  -- Update tracking record
  update public.sustained_performance_tracking
  set
    is_active = false,
    reset_at = now(),
    reset_id = v_reset_id
  where id = v_tracking_id;

  -- Auto-clear non-owned instructor escalations
  update public.instructor_escalations
  set
    status = 'auto_cleared',
    auto_cleared_at = now(),
    auto_cleared_by_reset_id = v_reset_id
  where user_id = p_user_id
    and concept_id = p_concept_id
    and status = 'pending'
    and acknowledged_by is null
  returning id into v_escalation_id;

  v_escalation_auto_cleared := (v_escalation_id is not null);

  -- Update reset record with escalation disposition
  if v_escalation_auto_cleared then
    update public.sustained_performance_resets
    set
      escalation_auto_cleared = true,
      escalation_id = v_escalation_id
    where id = v_reset_id;
  end if;

  return v_reset_id;
end;
$$ language plpgsql security definer;

-- ============================================================================
-- 9. ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on all new tables
alter table public.instructor_escalations enable row level security;
alter table public.instructor_escalation_events enable row level security;
alter table public.sustained_performance_tracking enable row level security;
alter table public.sustained_performance_resets enable row level security;

-- ============================================================================
-- INSTRUCTOR_ESCALATIONS RLS POLICIES
-- ============================================================================

-- Students: read own escalations
create policy instructor_escalations_student_select on public.instructor_escalations
  for select to authenticated
  using (auth.uid() = user_id);

-- Instructors: read escalations for students in same school
create policy instructor_escalations_instructor_select on public.instructor_escalations
  for select to authenticated
  using (
    public.is_school_staff(public.current_user_school_id())
    and public.current_user_school_id() = school_id
  );

-- Instructors: update escalations they have acknowledged or can acknowledge
create policy instructor_escalations_instructor_update on public.instructor_escalations
  for update to authenticated
  using (
    public.is_school_staff(public.current_user_school_id())
    and public.current_user_school_id() = school_id
    and (acknowledged_by = auth.uid() or acknowledged_by is null)
  )
  with check (
    public.is_school_staff(public.current_user_school_id())
    and public.current_user_school_id() = school_id
  );

-- Platform super admin: full access
create policy instructor_escalations_super_admin on public.instructor_escalations
  for all to authenticated
  using (public.is_platform_super_admin())
  with check (public.is_platform_super_admin());

-- ============================================================================
-- INSTRUCTOR_ESCALATION_EVENTS RLS POLICIES
-- ============================================================================

-- Students: read own escalation events (via escalation join)
create policy instructor_escalation_events_student_select on public.instructor_escalation_events
  for select to authenticated
  using (
    exists (
      select 1 from public.instructor_escalations ie
      where ie.id = escalation_id and ie.user_id = auth.uid()
    )
  );

-- School staff: read events for students in same school
create policy instructor_escalation_events_staff_select on public.instructor_escalation_events
  for select to authenticated
  using (
    exists (
      select 1 from public.instructor_escalations ie
      where ie.id = escalation_id
        and public.is_school_staff(public.current_user_school_id())
        and public.current_user_school_id() = ie.school_id
    )
  );

-- Platform super admin: full access
create policy instructor_escalation_events_super_admin on public.instructor_escalation_events
  for all to authenticated
  using (public.is_platform_super_admin())
  with check (public.is_platform_super_admin());

-- ============================================================================
-- SUSTAINED_PERFORMANCE_TRACKING RLS POLICIES
-- ============================================================================

-- Students: read own tracking
create policy sustained_performance_tracking_student_select on public.sustained_performance_tracking
  for select to authenticated
  using (auth.uid() = user_id);

-- School staff: read tracking for students in same school
create policy sustained_performance_tracking_staff_select on public.sustained_performance_tracking
  for select to authenticated
  using (
    public.is_school_staff(public.current_user_school_id())
    and public.current_user_school_id() = public.user_school_id(user_id)
  );

-- Platform super admin: full access
create policy sustained_performance_tracking_super_admin on public.sustained_performance_tracking
  for all to authenticated
  using (public.is_platform_super_admin())
  with check (public.is_platform_super_admin());

-- ============================================================================
-- SUSTAINED_PERFORMANCE_RESETS RLS POLICIES
-- ============================================================================

-- Students: read own resets
create policy sustained_performance_resets_student_select on public.sustained_performance_resets
  for select to authenticated
  using (auth.uid() = user_id);

-- School staff: read resets for students in same school
create policy sustained_performance_resets_staff_select on public.sustained_performance_resets
  for select to authenticated
  using (
    public.is_school_staff(public.current_user_school_id())
    and public.current_user_school_id() = public.user_school_id(user_id)
  );

-- Platform super admin: full access
create policy sustained_performance_resets_super_admin on public.sustained_performance_resets
  for all to authenticated
  using (public.is_platform_super_admin())
  with check (public.is_platform_super_admin());

-- ============================================================================
-- 10. COMMENTS FOR DOCUMENTATION
-- ============================================================================

comment on table public.instructor_escalations is
  'Phase 6C-2c: Tracks instructor escalations for concepts requiring human intervention after unsuccessful remediation cycles. Chapter-agnostic design.';

comment on table public.instructor_escalation_events is
  'Phase 6C-2c: Immutable audit ledger for all instructor escalation events. Append-only; no UPDATE or DELETE allowed.';

comment on table public.sustained_performance_tracking is
  'Phase 6C-2c: Tracks currently_performing_well continuity for deterministic sustained-performance reset eligibility.';

comment on table public.sustained_performance_resets is
  'Phase 6C-2c: Immutable record of sustained-performance resets. One reset per tracking period.';

comment on column public.instructor_escalations.triggering_cycle_ids is
  'Array of remediation_cycle IDs that triggered this escalation.';

comment on column public.instructor_escalations.detection_evidence is
  'JSONB snapshot of ConceptEvidence from Phase 6B-3 detection engine at escalation trigger time.';

comment on column public.instructor_escalations.acknowledged_by is
  'Instructor user ID who acknowledged this escalation. NULL indicates no instructor ownership.';

comment on column public.sustained_performance_tracking.entered_cpw_at is
  'Timestamp when concept entered currently_performing_well state. Start of 30-day reset clock.';

comment on column public.sustained_performance_tracking.follow_up_evidence_count is
  'Count of concept-mapped assessment observations during the tracking period. Required for reset eligibility.';

comment on column public.sustained_performance_resets.previous_cycle_count is
  'Number of remediation cycles in rolling 30-day window before reset.';

comment on column public.sustained_performance_resets.escalation_auto_cleared is
  'TRUE if a non-owned instructor escalation was auto-cleared by this reset.';

comment on function public.check_sustained_performance_reset_eligibility is
  'Checks if a concept is eligible for sustained-performance reset. Returns eligibility status and blocking reason if not eligible.';

comment on function public.create_instructor_escalation is
  'Creates an instructor escalation with idempotency protection. Returns existing escalation ID if one already exists for the user/concept.';

comment on function public.record_detection_state_transition is
  'Records a detection state transition from the Phase 6B-3 detection engine. Manages sustained_performance_tracking lifecycle.';

comment on function public.execute_sustained_performance_reset is
  'Executes a sustained-performance reset with idempotency protection. Clears counters, lockout, and non-owned escalations.';

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
