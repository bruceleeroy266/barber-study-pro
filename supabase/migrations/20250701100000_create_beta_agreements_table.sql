-- ============================================================================
-- Migration: 20250701100000_create_beta_agreements_table
-- Beta tester agreement acceptance records.
-- ============================================================================

create table if not exists public.beta_agreements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  tester_name text not null,
  tester_email text not null,
  agreement_version text not null default 'v1.0',
  accepted_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Speed up lookups by user and version.
create index if not exists idx_beta_agreements_user_id
  on public.beta_agreements(user_id);

create index if not exists idx_beta_agreements_version_accepted
  on public.beta_agreements(agreement_version, accepted_at desc);

-- Ensure one acceptance record per user per agreement version.
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'beta_agreements_user_version_unique'
      and conrelid = 'public.beta_agreements'::regclass
  ) then
    alter table public.beta_agreements
      add constraint beta_agreements_user_version_unique
      unique (user_id, agreement_version);
  end if;
end
$$;

-- Row Level Security
alter table public.beta_agreements enable row level security;

-- Users can view only their own acceptance records.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'beta_agreements'
      and policyname = 'Users can view own beta agreements'
  ) then
    create policy "Users can view own beta agreements"
      on public.beta_agreements
      for select
      to authenticated
      using (user_id = auth.uid());
  end if;
end
$$;

-- Users can insert only their own acceptance records.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'beta_agreements'
      and policyname = 'Users can insert own beta agreements'
  ) then
    create policy "Users can insert own beta agreements"
      on public.beta_agreements
      for insert
      to authenticated
      with check (user_id = auth.uid());
  end if;
end
$$;

-- Service role can manage all records for support and compliance.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'beta_agreements'
      and policyname = 'Service role can manage beta agreements'
  ) then
    create policy "Service role can manage beta agreements"
      on public.beta_agreements
      for all
      to service_role
      using (true)
      with check (true);
  end if;
end
$$;
