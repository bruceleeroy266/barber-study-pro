-- QA-174: permit server-side student remediation service to persist
-- reviewed assignments, cycle state transitions and immutable audit events.
-- The route authenticates the cycle owner before invoking these operations.
-- Do not grant student/authenticated role direct mutation privileges.
grant update (status, updated_at, review_started_at, review_completed_at,
  reassessment_started_at, reassessment_completed_at, evaluated_at, outcome)
  on public.remediation_cycles to service_role;
grant update (status, updated_at, started_at, completed_at)
  on public.remediation_assignments to service_role;
grant select, insert on public.remediation_cycle_events to service_role;
