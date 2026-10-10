-- READING-2A DRAFT ONLY. Do not apply until a disposable QA database is selected.
-- This is NOT academic evidence, grades, trusted study time, or attendance.
create table if not exists public.qa_reading_allowlist (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.qa_reading_allowlist enable row level security;
revoke all on public.qa_reading_allowlist from anon,authenticated;
-- Only an authorized administrator may separately populate QA IDs.

create table if not exists public.qa_reading_engagement_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  chapter_id text not null check (chapter_id='ch-1'),
  event_id uuid not null,
  event_type text not null check (event_type in ('scroll','reader_action','visible','hidden','tick')),
  scroll_depth_percent smallint check (scroll_depth_percent between 0 and 100),
  received_at timestamptz not null default clock_timestamp(),
  unique(user_id,event_id)
);
alter table public.qa_reading_engagement_events enable row level security;
revoke all on public.qa_reading_engagement_events from anon, authenticated;
-- Server-side authenticated, limited QA reads/writes via security-invoker RPC.
-- No client-provided duration is accepted. Raw events are NOT credited seconds.
create or replace function public.qa_record_reading_event(
  p_event_id uuid,p_event_type text,p_scroll_depth_percent smallint default null
) returns void language plpgsql security definer set search_path=public,pg_temp as $$
begin
  if auth.uid() is null then raise exception 'Unauthenticated'; end if;
  -- Explicit QA allowlist must be supplied before application; fail closed.
  if not exists (select 1 from public.qa_reading_allowlist q where q.user_id=auth.uid()) then
    raise exception 'QA account required';
  end if;
  if p_event_type not in ('scroll','reader_action','visible','hidden','tick') then
    raise exception 'Invalid event type';
  end if;
  insert into public.qa_reading_engagement_events(user_id,chapter_id,event_id,event_type,scroll_depth_percent)
  values(auth.uid(),'ch-1',p_event_id,p_event_type,p_scroll_depth_percent)
  on conflict(user_id,event_id) do nothing;
end $$;
revoke all on function public.qa_record_reading_event(uuid,text,smallint) from public,anon;
grant execute on function public.qa_record_reading_event(uuid,text,smallint) to authenticated;
