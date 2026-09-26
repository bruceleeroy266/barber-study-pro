alter table public.hour_logs
  add column if not exists submitted_by uuid references public.profiles(id) on delete set null;

grant insert, update on table public.hour_logs to authenticated;

create index if not exists idx_hour_logs_submitted_by on public.hour_logs(submitted_by);
