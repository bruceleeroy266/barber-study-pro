-- SCHOOL-ADMIN-CRUD-30 rollback DRAFT. Use only on isolated test branch
-- when verifying recovery. Remove policy restrictions before helper function.
do $$
declare t text;
begin
  foreach t in array array[
    'profiles','students','instructors','enrollments',
    'quiz_attempts','student_progress','hour_logs','attendance_records',
    'user_management_audit_logs','school_settings'
  ] loop
    if to_regclass('public.' || t) is not null then
      execute format('drop policy if exists %I on public.%I', 'crud30_active_account', t);
    end if;
  end loop;
end; $$;
drop function if exists private.active_account();
-- Do not drop the private schema: other app functions may depend on it.

-- Test matrix (isolated database, disposable A/B users):
-- 1. Approved enabled student A: reads own records; cannot read B.
-- 2. With A's access JWT retained, disable A through service role:
--    SELECT/INSERT/UPDATE/DELETE on selected user tables deny.
-- 3. Disabled school_admin A with retained JWT: cannot read School A/B.
-- 4. Active school_admin B: normal School B access continues, no A access.
-- 5. Re-enable A: new sessions recover authorized A access.
-- 6. Apply rollback: baseline policies restored and tested.
-- Inspect pg_policies (permissive/restrictive), table grants, RPC functions,
-- views, and storage policies before any production application.
