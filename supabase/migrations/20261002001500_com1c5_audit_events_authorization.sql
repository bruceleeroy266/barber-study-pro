-- COM-1C.5 — Communication Audit-Events Authorization
-- Scope: read authorization for communication_audit_events only.
-- Ordinary clients may not insert/update/delete/truncate audit evidence.
-- Server/service-role paths remain responsible for creating immutable audit events.

create policy "communication audit events school admins select"
on public.communication_audit_events
for select
to authenticated
using (
  school_id = (select public.current_user_school_id())
  and public.is_school_admin(school_id)
);

revoke all on table public.communication_audit_events from anon, authenticated;

grant select on table public.communication_audit_events to authenticated;

-- No authenticated INSERT/UPDATE/DELETE/TRUNCATE.
-- No broad platform-admin/private-message audit browsing is opened here.
