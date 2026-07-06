-- ============================================================================
-- Migration: 20250705210000_create_beta_feedback_table
-- Stores beta tester feedback submitted from the Beta Checklist page.
-- ============================================================================

create table if not exists public.beta_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  checklist_item_id text,
  category text not null check (category in ('bug', 'feature', 'ux', 'content', 'other')),
  severity text not null check (severity in ('low', 'medium', 'high', 'critical')),
  message text not null,
  created_at timestamptz not null default now()
);

-- Speed up lookups by user and by category/severity for triage.
create index if not exists idx_beta_feedback_user_id
  on public.beta_feedback(user_id);

create index if not exists idx_beta_feedback_category_severity
  on public.beta_feedback(category, severity);

-- Row Level Security
alter table public.beta_feedback enable row level security;

-- Users can view only their own feedback records.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'beta_feedback'
      and policyname = 'Users can view own beta feedback'
  ) then
    create policy "Users can view own beta feedback"
      on public.beta_feedback
      for select
      to authenticated
      using (user_id = auth.uid());
  end if;
end
$$;

-- Users can insert only their own feedback records.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'beta_feedback'
      and policyname = 'Users can insert own beta feedback'
  ) then
    create policy "Users can insert own beta feedback"
      on public.beta_feedback
      for insert
      to authenticated
      with check (user_id = auth.uid());
  end if;
end
$$;

-- Service role can manage all feedback for support and triage.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'beta_feedback'
      and policyname = 'Service role can manage beta feedback'
  ) then
    create policy "Service role can manage beta feedback"
      on public.beta_feedback
      for all
      to service_role
      using (true)
      with check (true);
  end if;
end
$$;
