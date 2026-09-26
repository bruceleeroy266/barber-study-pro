-- ============================================================================
-- Segment C policy qualification hotfix
-- Fully qualify outer hour_logs columns inside attendance subqueries.
-- ============================================================================

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
      (hour_logs.source_type = 'manual' and hour_logs.source_attendance_id is null)
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
  )
);
