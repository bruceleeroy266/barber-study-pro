-- Migration: Backfill missing profiles for existing auth users
-- One-time repair for users who authenticated before handle_new_user trigger existed
-- or whose profiles were deleted.

-- ============================================================================
-- 1. Create profiles for auth users who don't have one
-- ============================================================================
insert into public.profiles (
  id,
  email,
  full_name,
  role,
  approval_status,
  is_disabled,
  created_at,
  updated_at
)
select
  au.id,
  au.email,
  coalesce(au.raw_user_meta_data->>'full_name', au.email),
  coalesce(au.raw_user_meta_data->>'role', 'student'),
  'approved',  -- Existing users are grandfathered in as approved
  false,
  au.created_at,
  now()
from auth.users au
where not exists (
  select 1 from public.profiles p where p.id = au.id
)
on conflict (id) do nothing;

-- ============================================================================
-- 2. Add constraint to prevent duplicate profiles (if not exists)
-- ============================================================================
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_id_key'
  ) then
    alter table public.profiles add constraint profiles_id_key unique (id);
  end if;
end $$;

-- ============================================================================
-- 3. Create index for approval_status lookups (if not exists)
-- ============================================================================
create index if not exists idx_profiles_approval_status on public.profiles(approval_status);
create index if not exists idx_profiles_is_disabled on public.profiles(is_disabled);

-- ============================================================================
-- 4. Add comment documenting the backfill
-- ============================================================================
comment on table public.profiles is 'User profiles. Backfilled 2026-07-27 for users missing profiles.';
