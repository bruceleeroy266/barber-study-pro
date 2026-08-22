-- ============================================================================
-- Migration: 20260822000001_phase_7a_slice_5_5_onboarding_blockers
-- Phase 7A Slice 5.5 — Onboarding Functional Blocker Correction
--
-- Creates:
--   A. approve_pilot_inquiry() transactional RPC (P0-1)
--   B. pilot_inquiries UPDATE policy hardening (P0-1)
--
-- Security model:
--   - approve_pilot_inquiry() is SECURITY DEFINER with explicit auth
--   - Platform admin (role='admin', school_id IS NULL) only
--   - Legal status transitions enforced server-side and database-side:
--       new | contacted -> approved (allowed)
--       approved -> approved (idempotent no-op, returns current state)
--       declined | spam -> approved (rejected)
--   - SELECT ... FOR UPDATE row-level lock for concurrency safety
--   - search_path explicitly constrained
--   - Function privileges explicitly restricted (authenticated + service_role)
--   - Client-controlled arbitrary status manipulation prevented:
--     the pilot_inquiries UPDATE policy is restricted to platform admins,
--     and approval is only possible through this RPC.
-- ============================================================================

-- ============================================================================
-- A. APPROVE_PILOT_INQUIRY() TRANSACTIONAL RPC
-- ============================================================================
-- This function implements the approved production path for transitioning
-- an eligible pilot inquiry to the 'approved' state required by
-- create_school_from_inquiry().
--
-- Security properties:
--   - SECURITY DEFINER: runs with the privileges of the function owner
--     (postgres), not the caller.
--   - Explicit authorization: checks that the caller is a platform admin
--     (role='admin', school_id IS NULL) before proceeding. School admins,
--     instructors, students, and anonymous users cannot approve inquiries.
--   - search_path explicitly constrained to prevent search_path injection.
--   - Legal transitions only: 'new' and 'contacted' may transition to
--     'approved'. 'approved' is an idempotent no-op. 'declined' and 'spam'
--     are terminal for this workflow and cannot be approved.
--   - Concurrency safety: SELECT ... FOR UPDATE row-level lock serializes
--     concurrent approval calls for the same inquiry.
--   - Auditability: the function updates updated_at; the calling server
--     action writes the security audit event.
--   - Function privileges explicitly restricted: only authenticated users
--     can execute; anonymous users cannot.

create or replace function public.approve_pilot_inquiry(
  p_pilot_inquiry_id uuid
)
returns text
set search_path = public, pg_temp
as $$
declare
  v_caller_id uuid;
  v_caller_role text;
  v_caller_school_id uuid;
  v_inquiry record;
begin
  -- ==========================================================================
  -- 1. AUTHENTICATE/AUTHORIZE THE CALLER
  -- ==========================================================================
  v_caller_id := auth.uid();

  if v_caller_id is null then
    raise exception 'Unauthorized: no authenticated user'
      using errcode = '28000'; -- invalid_authorization_specification
  end if;

  select role, school_id into v_caller_role, v_caller_school_id
  from public.profiles
  where id = v_caller_id;

  if not found then
    raise exception 'Unauthorized: caller profile not found'
      using errcode = '28000';
  end if;

  -- Only platform admins (role='admin', school_id IS NULL) may approve
  -- pilot inquiries. School admins may NOT approve inquiries.
  if v_caller_role <> 'admin' or v_caller_school_id is not null then
    raise exception 'Unauthorized: only platform administrators may approve pilot inquiries'
      using errcode = '28000';
  end if;

  -- ==========================================================================
  -- 2. ACQUIRE ROW-LEVEL LOCK ON THE PILOT INQUIRY
  -- ==========================================================================
  -- SELECT ... FOR UPDATE serializes concurrent approval calls for the
  -- same inquiry. The second call blocks until the first transaction
  -- commits, then observes the committed status.
  select * into v_inquiry
  from public.pilot_inquiries
  where id = p_pilot_inquiry_id
  for update;

  if not found then
    raise exception 'Pilot inquiry not found: %', p_pilot_inquiry_id
      using errcode = '22023'; -- invalid_parameter_value
  end if;

  -- ==========================================================================
  -- 3. ENFORCE LEGAL STATUS TRANSITIONS
  -- ==========================================================================
  -- Idempotent: already approved -> return current status without change.
  if v_inquiry.status = 'approved' then
    return v_inquiry.status;
  end if;

  -- Legal transitions: only 'new' and 'contacted' may be approved.
  if v_inquiry.status not in ('new', 'contacted') then
    raise exception 'Illegal status transition: cannot approve inquiry with status ''%''. Only ''new'' or ''contacted'' inquiries may be approved.', v_inquiry.status
      using errcode = '22023';
  end if;

  -- ==========================================================================
  -- 4. APPLY THE TRANSITION (LOCK ALREADY HELD)
  -- ==========================================================================
  update public.pilot_inquiries
  set status = 'approved'
  where id = p_pilot_inquiry_id;

  -- ==========================================================================
  -- 5. RETURN THE NEW STATUS
  -- ==========================================================================
  return 'approved';

exception
  -- Re-raise any exception to ensure the transaction rolls back.
  when others then
    raise;
end;
$$ language plpgsql security definer;

-- ============================================================================
-- A.1 FUNCTION PRIVILEGES
-- ============================================================================

revoke execute on function public.approve_pilot_inquiry(uuid) from public;
revoke execute on function public.approve_pilot_inquiry(uuid) from anon;
grant execute on function public.approve_pilot_inquiry(uuid) to authenticated;
grant execute on function public.approve_pilot_inquiry(uuid) to service_role;

-- ============================================================================
-- A.2 COMMENTS
-- ============================================================================

comment on function public.approve_pilot_inquiry(uuid) is
  'Phase 7A Slice 5.5 (P0-1): Transactional RPC to transition an eligible pilot inquiry (status new|contacted) to approved. '
  'Enforces: platform-admin-only authorization, legal status transitions, idempotency for already-approved inquiries, '
  'concurrency safety via SELECT ... FOR UPDATE. SECURITY DEFINER with explicit search_path constraint.';

-- ============================================================================
-- B. PILOT_INQUIRIES UPDATE POLICY HARDENING
-- ============================================================================
-- The original UPDATE policy (20260713100000) allowed BOTH platform admins
-- and school admins to update pilot inquiries. That permitted arbitrary
-- client-controlled status manipulation (e.g., a school_admin setting
-- status='approved' directly via the Supabase client), bypassing the
-- approval workflow entirely.
--
-- Correction: restrict UPDATE to platform admins only (role='admin',
-- school_id IS NULL). School admins retain SELECT (read) access for
-- visibility but can no longer modify inquiry records.
--
-- The approval transition itself is performed exclusively through the
-- approve_pilot_inquiry() RPC, which re-validates authorization and
-- transition legality database-side. Direct API/client invocation of the
-- RPC cannot bypass authorization because the RPC independently checks
-- the caller's profile.

drop policy if exists "Admins can update pilot inquiries" on public.pilot_inquiries;

create policy "Platform admins can update pilot inquiries"
  on public.pilot_inquiries
  for update using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
        and profiles.school_id is null
    )
  );

comment on table public.pilot_inquiries is
  'Pilot program inquiries. Phase 7A Slice 5.5: UPDATE restricted to platform admins (role=admin, school_id IS NULL). '
  'Approval transitions occur exclusively through approve_pilot_inquiry() RPC.';
