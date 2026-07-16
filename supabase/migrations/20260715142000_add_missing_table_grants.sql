-- ============================================================================
-- Migration: 20260715142000_add_missing_table_grants
-- Add minimum table grants so authenticated users can exercise their RLS
-- policies and the service-role client can insert security logs.
-- ============================================================================

grant usage on schema public to anon, authenticated, service_role;

-- Authenticated users read their own logs through the existing RLS policy.
grant select on table public.security_logs to authenticated;

-- Service-role client writes audit events from trusted server code only.
-- INSERT is intentionally NOT granted to anon or authenticated.
grant insert on table public.security_logs to service_role;

-- Beta agreements: users may read/insert their own records (RLS enforced).
grant select, insert on table public.beta_agreements to authenticated;

-- Beta feedback: users may read/insert their own records (RLS enforced).
grant select, insert on table public.beta_feedback to authenticated;

-- Operational tables: readable/writable by admins via RLS.
grant select, insert, update on table public.maintenance_mode to authenticated;
grant select, insert, update on table public.notifications to authenticated;
grant select, insert, update on table public.feature_flags to authenticated;
grant select, insert, update on table public.background_jobs to authenticated;
grant select, insert, update on table public.backup_status to authenticated;
