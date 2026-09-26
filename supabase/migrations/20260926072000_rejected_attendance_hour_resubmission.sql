-- ============================================================================
-- Segment D2 — Safe rejected attendance-hour resubmission
-- Preserve rejected review history while allowing one new pending correction.
-- ============================================================================

alter table public.hour_logs
  add column if not exists resubmission_of_hour_log_id uuid
    references public.hour_logs(id) on delete restrict;

drop index if exists public.uq_hour_logs_source_attendance;

create unique index if not exists uq_hour_logs_source_attendance_active
  on public.hour_logs(source_attendance_id)
  where source_attendance_id is not null
    and status in ('pending', 'approved');

create index if not exists idx_hour_logs_resubmission_of
  on public.hour_logs(resubmission_of_hour_log_id)
  where resubmission_of_hour_log_id is not null;

comment on column public.hour_logs.resubmission_of_hour_log_id is
  'Rejected hour-log revision this pending attendance-generated correction resubmits.';

drop policy if exists hour_logs_insert on public.hour_logs;
create policy hour_logs_insert on public.hour_logs
for insert to authenticated
with check (
  public.is_platform_super_admin()
  or (
    public.current_user_role() = 'instructor'
    and public.current_user_school_id() = hour_logs.school_id
    and hour_logs.submitted_by = auth.uid()
    and hour_logs.status = 'pending'
    and hour_logs.reviewed_by is null
    and hour_logs.reviewed_at is null
    and public.user_school_id(hour_logs.user_id) = hour_logs.school_id
    and (
      (
        hour_logs.source_type = 'manual'
        and hour_logs.source_attendance_id is null
        and hour_logs.resubmission_of_hour_log_id is null
      )
      or (
        hour_logs.source_type = 'attendance'
        and hour_logs.source_attendance_id is not null
        and exists (
          select 1
          from public.attendance_records ar
          where ar.id = hour_logs.source_attendance_id
            and ar.school_id = hour_logs.school_id
            and ar.user_id = hour_logs.user_id
            and ar.date = hour_logs.date
            and ar.status in ('Present', 'Tardy')
            and ar.minutes_present = hour_logs.minutes
            and ar.minutes_present > 0
        )
        and (
          (
            not exists (
              select 1
              from public.hour_logs prior
              where prior.source_attendance_id = hour_logs.source_attendance_id
                and prior.school_id = hour_logs.school_id
                and prior.user_id = hour_logs.user_id
                and prior.status = 'rejected'
            )
            and hour_logs.resubmission_of_hour_log_id is null
          )
          or (
            hour_logs.resubmission_of_hour_log_id is not null
            and exists (
              select 1
              from public.hour_logs rejected
              where rejected.id = hour_logs.resubmission_of_hour_log_id
                and rejected.source_attendance_id = hour_logs.source_attendance_id
                and rejected.school_id = hour_logs.school_id
                and rejected.user_id = hour_logs.user_id
                and rejected.status = 'rejected'
            )
          )
        )
      )
    )
  )
);

drop policy if exists hour_logs_update on public.hour_logs;
create policy hour_logs_update on public.hour_logs
for update to authenticated
using (
  public.is_school_admin(hour_logs.school_id)
  or public.is_platform_super_admin()
  or (
    public.current_user_role() = 'instructor'
    and public.current_user_school_id() = hour_logs.school_id
    and hour_logs.status = 'pending'
    and hour_logs.reviewed_by is null
    and hour_logs.reviewed_at is null
    and hour_logs.source_type = 'attendance'
    and hour_logs.source_attendance_id is not null
    and public.user_school_id(hour_logs.user_id) = hour_logs.school_id
    and exists (
      select 1
      from public.attendance_records ar
      where ar.id = hour_logs.source_attendance_id
        and ar.school_id = hour_logs.school_id
        and ar.user_id = hour_logs.user_id
        and ar.date = hour_logs.date
        and ar.status in ('Present', 'Tardy')
        and ar.minutes_present > 0
    )
  )
)
with check (
  public.is_school_admin(hour_logs.school_id)
  or public.is_platform_super_admin()
  or (
    public.current_user_role() = 'instructor'
    and public.current_user_school_id() = hour_logs.school_id
    and hour_logs.submitted_by = auth.uid()
    and hour_logs.status = 'pending'
    and hour_logs.reviewed_by is null
    and hour_logs.reviewed_at is null
    and hour_logs.source_type = 'attendance'
    and hour_logs.source_attendance_id is not null
    and public.user_school_id(hour_logs.user_id) = hour_logs.school_id
    and exists (
      select 1
      from public.attendance_records ar
      where ar.id = hour_logs.source_attendance_id
        and ar.school_id = hour_logs.school_id
        and ar.user_id = hour_logs.user_id
        and ar.date = hour_logs.date
        and ar.status in ('Present', 'Tardy')
        and ar.minutes_present = hour_logs.minutes
        and ar.minutes_present > 0
    )
    and (
      hour_logs.resubmission_of_hour_log_id is null
      or exists (
        select 1
        from public.hour_logs rejected
        where rejected.id = hour_logs.resubmission_of_hour_log_id
          and rejected.source_attendance_id = hour_logs.source_attendance_id
          and rejected.school_id = hour_logs.school_id
          and rejected.user_id = hour_logs.user_id
          and rejected.status = 'rejected'
      )
    )
  )
);
