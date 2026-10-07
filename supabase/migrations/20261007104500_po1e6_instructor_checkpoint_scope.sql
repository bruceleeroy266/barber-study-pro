-- PO-1E.6 — Final certification hardening
-- Official school-wide checkpoint snapshots are administrative evidence.
-- Instructors retain assignment-scoped live pilot measurement but must not
-- read school-wide finalized checkpoint aggregates.

drop policy if exists pilot_measurement_checkpoints_school_staff_select
  on public.pilot_measurement_checkpoints;

drop policy if exists pilot_measurement_checkpoints_school_admin_select
  on public.pilot_measurement_checkpoints;

create policy pilot_measurement_checkpoints_school_admin_select
  on public.pilot_measurement_checkpoints
  for select to authenticated
  using (
    public.is_school_admin(school_id)
    and public.current_user_school_id() = school_id
  );

-- Platform-admin read policy remains unchanged.
-- Direct authenticated writes remain revoked and mutation remains RPC-only.
