alter table public.hour_logs
  add column if not exists submitted_by uuid references public.profiles(id) on delete set null,
  add column if not exists rejection_reason text;

grant select, insert, update on table public.hour_logs to authenticated;

create index if not exists idx_hour_logs_submitted_by on public.hour_logs(submitted_by);

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
  )
);

drop policy if exists hour_logs_update on public.hour_logs;
create policy hour_logs_update on public.hour_logs
for update to authenticated
using (
  public.is_school_admin(school_id)
  or public.is_platform_super_admin()
)
with check (
  public.is_school_admin(school_id)
  or public.is_platform_super_admin()
);
