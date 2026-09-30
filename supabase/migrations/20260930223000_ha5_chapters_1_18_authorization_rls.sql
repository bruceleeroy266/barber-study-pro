-- HA-5 — Chapters 1-18 Authorization + RLS + Tenant-Boundary Hardening
--
-- The remediation runtime is server-authoritative. Students may read their own
-- cycles/assignments/history, same-school staff may read student diagnostics,
-- and platform super admins retain platform scope. Direct client mutation of
-- remediation state is prohibited; trusted service-role RPCs perform writes.

drop policy if exists remediation_cycles_insert on public.remediation_cycles;
drop policy if exists remediation_cycles_update on public.remediation_cycles;
drop policy if exists remediation_cycle_events_insert on public.remediation_cycle_events;
drop policy if exists remediation_assignments_insert on public.remediation_assignments;
drop policy if exists remediation_assignments_update on public.remediation_assignments;

revoke insert, update, delete on public.remediation_cycles from authenticated;
revoke insert, update, delete on public.remediation_cycle_events from authenticated;
revoke insert, update, delete on public.remediation_assignments from authenticated;

-- Reassert least-privilege read boundaries. These policies deliberately derive
-- school membership from authoritative profiles instead of trusting request
-- parameters or client-supplied school IDs.
drop policy if exists remediation_cycles_select on public.remediation_cycles;
create policy remediation_cycles_select on public.remediation_cycles
  for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists remediation_cycles_staff_select on public.remediation_cycles;
create policy remediation_cycles_staff_select on public.remediation_cycles
  for select to authenticated
  using (
    public.is_school_staff(public.current_user_school_id())
    and public.current_user_school_id() = public.user_school_id(user_id)
  );

drop policy if exists remediation_cycle_events_select on public.remediation_cycle_events;
create policy remediation_cycle_events_select on public.remediation_cycle_events
  for select to authenticated
  using (
    exists (
      select 1 from public.remediation_cycles rc
      where rc.id = cycle_id and rc.user_id = auth.uid()
    )
  );

drop policy if exists remediation_cycle_events_staff_select on public.remediation_cycle_events;
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

drop policy if exists remediation_assignments_select on public.remediation_assignments;
create policy remediation_assignments_select on public.remediation_assignments
  for select to authenticated
  using (
    exists (
      select 1 from public.remediation_cycles rc
      where rc.id = cycle_id and rc.user_id = auth.uid()
    )
  );

drop policy if exists remediation_assignments_staff_select on public.remediation_assignments;
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

comment on table public.remediation_cycles is
  'HA-5: server-authoritative remediation state; students read own rows, same-school staff read tenant rows, platform super admins retain platform scope.';
