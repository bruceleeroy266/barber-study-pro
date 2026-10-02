-- G3-1 — Trusted study activity read model
--
-- Derive dashboard measurement directly from authoritative PO-1B event evidence.
-- This removes Gate 3 reads from the legacy writable study_activity_days table.

create or replace view public.trusted_study_activity_days
with (security_invoker = true)
as
select
  e.user_id,
  (e.received_at at time zone 'UTC')::date as study_date,
  sum(e.credited_seconds)::integer as active_seconds,
  'UTC'::text as timezone,
  max(e.received_at) as last_active_at
from public.study_session_events e
where e.credited_seconds > 0
group by e.user_id, (e.received_at at time zone 'UTC')::date;

revoke all on public.trusted_study_activity_days from public, anon;
grant select on public.trusted_study_activity_days to authenticated;
grant select on public.trusted_study_activity_days to service_role;

comment on view public.trusted_study_activity_days is
  'Authoritative Gate 3 daily study measurement derived from PO-1B credited events; observational only and never attendance/H&A.';
