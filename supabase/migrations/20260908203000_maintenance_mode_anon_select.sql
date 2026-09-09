-- Migration: Allow anonymous SELECT on maintenance_mode
-- Founder approval: 2026-09-08 (Supabase Support ticket SU-467300 follow-up)
--
-- Intent, per the creating migration (20250625160000_create_enterprise_services_tables.sql):
--   "Maintenance mode: readable by all; writable by admins."
-- The original select policy was created `to authenticated` only and no table
-- grant was ever made to `anon`. Middleware runs the maintenance check for
-- every logged-out visit, so anonymous requests failed with Postgres 42501
-- before RLS was ever evaluated (fail-open: anonymous maintenance enforcement
-- silently never engaged, and every anonymous page view raised a 42501).
--
-- Preserved exactly:
--   anon          = SELECT only (added by this file)
--   authenticated = existing behavior (unchanged)
--   writes        = admin-only via maintenance_mode_admin_write (unchanged)
--   nabba_leads   = untouched (grants applied and verified by Supabase Support)
--
-- Idempotent: GRANT is a no-op when the privilege already exists, and the
-- policy is created only when an equivalent anon SELECT policy is absent.

grant select on public.maintenance_mode to anon;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'maintenance_mode'
      and policyname = 'maintenance_mode_select_anon'
  ) then
    create policy maintenance_mode_select_anon
      on public.maintenance_mode
      for select to anon
      using (true);
  end if;
end
$$;
