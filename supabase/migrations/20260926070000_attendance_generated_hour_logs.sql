-- ============================================================================
-- Segment C — Attendance-generated Student Hours
-- Adds provenance and a database-level duplicate guard so one attendance
-- record can create at most one hour_logs row.
-- ============================================================================

alter table public.hour_logs
  add column if not exists source_type text not null default 'manual',
  add column if not exists source_attendance_id uuid references public.attendance_records(id) on delete restrict;

alter table public.hour_logs
  drop constraint if exists hour_logs_source_type_check;

alter table public.hour_logs
  add constraint hour_logs_source_type_check
  check (source_type in ('manual', 'attendance'));

create unique index if not exists uq_hour_logs_source_attendance
  on public.hour_logs(source_attendance_id)
  where source_attendance_id is not null;

create index if not exists idx_hour_logs_source_type
  on public.hour_logs(source_type);

comment on column public.hour_logs.source_type is
  'manual for instructor-entered hours; attendance for hours generated from a submitted attendance record.';

comment on column public.hour_logs.source_attendance_id is
  'Attendance record that generated this hour entry. Unique when present to prevent duplicate hour creation.';


-- Preserve manual instructor submissions while binding attendance-generated rows
-- to the exact same-school student/date/minutes attendance source.
drop policy if exists hour_logs_insert on public.hour_logs;
create policy hour_logs_insert on public.hour_logs
for insert to authenticated
with check (
  public.is_platform_super_admin()
  or (
    public.current_user_role() = 'instructor'
    and public.current_user_school_id() = school_id
    and submitted_by = auth.uid()
    and status = 'pending'
    and reviewed_by is null
    and reviewed_at is null
    and public.user_school_id(user_id) = school_id
    and (
      (source_type = 'manual' and source_attendance_id is null)
      or (
        source_type = 'attendance'
        and source_attendance_id is not null
        and exists (
          select 1
          from public.attendance_records ar
          where ar.id = source_attendance_id
            and ar.school_id = school_id
            and ar.user_id = user_id
            and ar.date = date
            and ar.status in ('Present', 'Tardy')
            and ar.minutes_present = minutes
            and ar.minutes_present > 0
        )
      )
    )
  )
);


-- Permit instructors to refresh only their own still-pending attendance-generated
-- hour row when they resubmit corrected attendance. Admin-reviewed rows remain locked.
drop policy if exists hour_logs_update on public.hour_logs;
create policy hour_logs_update on public.hour_logs
for update to authenticated
using (
  public.is_school_admin(school_id)
  or public.is_platform_super_admin()
  or (
    public.current_user_role() = 'instructor'
    and public.current_user_school_id() = school_id
    and status = 'pending'
    and reviewed_by is null
    and reviewed_at is null
    and source_type = 'attendance'
    and source_attendance_id is not null
    and public.user_school_id(user_id) = school_id
    and exists (
      select 1
      from public.attendance_records ar
      where ar.id = source_attendance_id
        and ar.school_id = school_id
        and ar.user_id = user_id
        and ar.date = date
        and ar.status in ('Present', 'Tardy')
        and ar.minutes_present > 0
    )
  )
)
with check (
  public.is_school_admin(school_id)
  or public.is_platform_super_admin()
  or (
    public.current_user_role() = 'instructor'
    and public.current_user_school_id() = school_id
    and submitted_by = auth.uid()
    and status = 'pending'
    and reviewed_by is null
    and reviewed_at is null
    and source_type = 'attendance'
    and source_attendance_id is not null
    and public.user_school_id(user_id) = school_id
    and exists (
      select 1
      from public.attendance_records ar
      where ar.id = source_attendance_id
        and ar.school_id = school_id
        and ar.user_id = user_id
        and ar.date = date
        and ar.status in ('Present', 'Tardy')
        and ar.minutes_present = minutes
        and ar.minutes_present > 0
    )
  )
);
