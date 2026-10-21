-- Read-only authenticated check for the exact active Support Mode target.
-- No table SELECT permissions are granted.
create or replace function public.is_support_access_session_active(p_target uuid)
returns boolean language sql stable security definer set search_path = ''
as $$
 select auth.uid() is not null and exists (
   select 1 from public.support_access_sessions ss
   join public.profiles a on a.id = ss.actor_id
   join public.profiles t on t.id = ss.target_profile_id
   where ss.actor_id=auth.uid() and ss.target_profile_id=p_target
     and ss.expires_at>now()
     and a.role='admin' and a.school_id is null
     and a.approval_status='approved' and a.is_disabled is distinct from true
     and t.school_id is not null and t.role in ('instructor','school_admin','admin')
     and t.approval_status='approved' and t.is_disabled is distinct from true
 );
$$;
revoke all on function public.is_support_access_session_active(uuid) from public;
grant execute on function public.is_support_access_session_active(uuid) to authenticated;
