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


-- ---------------------------------------------------------------------------
-- Reassessment history / exhaustion: server writes, tenant-scoped reads.
-- HA-4 already revoked forged history writes; close the parallel exhaustion
-- mutation path as well.
drop policy if exists concept_question_pool_exhaustion_insert
  on public.concept_question_pool_exhaustion;
revoke insert, update, delete on public.concept_question_pool_exhaustion from authenticated;

-- ---------------------------------------------------------------------------
-- Escalations: clients may read according to role, but acknowledgement and
-- lifecycle mutations are server-authoritative and school-scoped.
drop policy if exists instructor_escalations_instructor_update
  on public.instructor_escalations;
revoke insert, update, delete on public.instructor_escalations from authenticated;
revoke insert, update, delete on public.instructor_escalation_events from authenticated;
revoke insert, update, delete on public.sustained_performance_tracking from authenticated;
revoke insert, update, delete on public.concept_question_pool_exhaustion from authenticated;

-- ---------------------------------------------------------------------------
-- Instructor notes: replace the broad staff FOR ALL policy. A student may read
-- notes about themself; same-school staff may read. Staff can create a note
-- only for their own school, for a student in that school, and with their own
-- instructor_id. Existing notes are historical coaching evidence and cannot be
-- retargeted to another student/school by a client.
drop policy if exists instructor_notes_all on public.instructor_notes;
drop policy if exists instructor_notes_select on public.instructor_notes;

create policy instructor_notes_select on public.instructor_notes
  for select to authenticated
  using (
    student_id = auth.uid()
    or (
      public.is_school_staff(public.current_user_school_id())
      and public.current_user_school_id() = school_id
    )
    or public.is_platform_admin()
    or public.is_platform_super_admin()
  );

create policy instructor_notes_insert on public.instructor_notes
  for insert to authenticated
  with check (
    public.is_school_staff(public.current_user_school_id())
    and public.current_user_school_id() = school_id
    and public.user_school_id(student_id) = school_id
    and instructor_id = auth.uid()
  );

revoke update, delete on public.instructor_notes from authenticated;

-- ---------------------------------------------------------------------------
-- Canonical application platform admin (role=admin, no school) needs read-only
-- cross-school diagnostic visibility. This is distinct from the future
-- platform_super_admin role, whose existing full-access policies remain.
create policy "Remediation cycles: platform admin read all" on public.remediation_cycles
  for select to authenticated using (public.is_platform_admin());

create policy "Remediation events: platform admin read all" on public.remediation_cycle_events
  for select to authenticated using (public.is_platform_admin());

create policy "Remediation assignments: platform admin read all" on public.remediation_assignments
  for select to authenticated using (public.is_platform_admin());

create policy "Reassessment history: platform admin read all" on public.reassessment_question_history
  for select to authenticated using (public.is_platform_admin());

create policy "Pool exhaustion: platform admin read all" on public.concept_question_pool_exhaustion
  for select to authenticated using (public.is_platform_admin());

create policy "Remediation evaluations: platform admin read all" on public.remediation_cycle_evaluations
  for select to authenticated using (public.is_platform_admin());

create policy "Instructor escalations: platform admin read all" on public.instructor_escalations
  for select to authenticated using (public.is_platform_admin());

create policy "Escalation events: platform admin read all" on public.instructor_escalation_events
  for select to authenticated using (public.is_platform_admin());

create policy "Sustained performance: platform admin read all" on public.sustained_performance_tracking
  for select to authenticated using (public.is_platform_admin());

create policy "Sustained resets: platform admin read all" on public.sustained_performance_resets
  for select to authenticated using (public.is_platform_admin());

create policy "Follow-up evidence: platform admin read all" on public.follow_up_evidence
  for select to authenticated using (public.is_platform_admin());
